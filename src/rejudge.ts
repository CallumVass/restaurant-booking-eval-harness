// pattern: Imperative Shell

import { createOpencode } from "@opencode-ai/sdk";
import { cp, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { collectOptionalEvidenceChecks } from "./checks.js";
import { judgeSchema } from "./judge-schema.js";
import { buildJudgePrompt, judgeInstructionsForScenario } from "./judge-prompt.js";
import { telemetryFromAssistantInfo, type AssistantTelemetry } from "./telemetry.js";

type PhaseModel = {
  model: string;
};

type ModelsConfig = {
  judge: PhaseModel;
};

type ScenarioConfig = {
  id: string;
  taskPath: string;
  baselinePath: string | null;
  judgeInstructions: string[];
};

type ArchivedResult = {
  scenario: string;
  variant: string;
  baseline: string | null;
  workspace: string;
  plan: string | null;
  pipelineState: unknown;
  telemetry?: Record<string, unknown> & { judge?: AssistantTelemetry };
  checks: unknown[];
  fileTree?: string[];
  judge?: unknown;
  [key: string]: unknown;
};

const root = process.cwd();
const archiveDir = path.resolve(process.env.EVAL_ARCHIVE_DIR ?? path.join(root, "run-archive"));

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const modelsPath = path.resolve(root, args.models ?? "models.json");
  const models = JSON.parse(await readFile(modelsPath, "utf8")) as ModelsConfig;
  const resultPaths = await selectResultPaths(args);

  if (resultPaths.length === 0) {
    throw new Error("No archived result.json files matched the requested filters.");
  }

  log(`Rejudging ${resultPaths.length} archived result(s)`);

  for (const [index, resultPath] of resultPaths.entries()) {
    log(`[${index + 1}/${resultPaths.length}] Reading ${path.relative(root, resultPath)}`);
    const result = JSON.parse(await readFile(resultPath, "utf8")) as ArchivedResult;
    const archiveWorkspace = path.dirname(resultPath);
    const tempWorkspace = await mkdtemp(path.join(tmpdir(), "restaurant-booking-rejudge-"));
    const scenario = await makeScenarioConfig(result.scenario, result.baseline);
    const task = await readFile(scenario.taskPath, "utf8");
    const previousCwd = process.cwd();
    let opencode: Awaited<ReturnType<typeof createOpencode>> | undefined;

    try {
      await cp(archiveWorkspace, tempWorkspace, { recursive: true });
      await rm(path.join(tempWorkspace, "result.json"), { force: true });
      const fileTree = await listFiles(tempWorkspace, 500);
      const checks = [
        ...result.checks,
        ...(await collectOptionalEvidenceChecks(tempWorkspace, log, { installFrontendDependencies: true }))
      ];

      process.chdir(tempWorkspace);
      opencode = await createOpencode({
        port: await choosePort(),
        timeout: 30_000
      });
      const client = opencode.client as any;

      const judgeResult = await judgeRun(client, models.judge, {
        task,
        scenario,
        variant: { id: result.variant },
        plan: result.plan,
        pipelineCompleted: getPipelineStatus(result.pipelineState) === "completed",
        pipelineStatus: getPipelineStatus(result.pipelineState),
        checks,
        fileTree
      });

      if (hasStructuredJudge(result.judge)) {
        result.judge.structured = judgeResult.output;
      } else {
        result.judge = judgeResult.output;
      }

      await writeFile(resultPath, `${JSON.stringify(result, null, 2)}\n`);
      const score = (judgeResult.output as { overallScore?: unknown })?.overallScore;
      log(`[${index + 1}/${resultPaths.length}] Wrote ${path.relative(root, resultPath)}${typeof score === "number" ? ` score=${score}` : ""}`);
    } finally {
      opencode?.server.close();
      process.chdir(previousCwd);
      await rm(tempWorkspace, { recursive: true, force: true });
    }
  }
}

async function selectResultPaths(args: Record<string, string>): Promise<string[]> {
  if (args.path) {
    const selected = path.resolve(root, args.path);
    const info = await stat(selected);
    if (info.isFile()) return [selected];
    return findResultFiles(selected, args);
  }

  return findResultFiles(archiveDir, args);
}

async function findResultFiles(directory: string, args: Record<string, string>): Promise<string[]> {
  const files: string[] = [];

  async function walk(current: string) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
      } else if (entry.name === "result.json") {
        files.push(absolute);
      }
    }
  }

  await walk(directory);
  return files
    .filter((file) => !args.scenario || file.includes(`${path.sep}scenario-${args.scenario}${path.sep}`))
    .filter((file) => !args.variant || file.includes(args.variant))
    .sort();
}

async function judgeRun(
  client: any,
  judge: PhaseModel,
  details: unknown
): Promise<{ output: unknown; telemetry: AssistantTelemetry }> {
  const session = await client.session.create({ body: { title: "rejudge restaurant booking eval" } });
  const prompt = buildJudgePrompt(
    details,
    "You are running in a temporary copy of the submitted solution with result.json removed. Before producing final structured output, inspect the codebase with filesystem/search tools as needed. Do not rely only on fileTree or deterministic check text for source-level claims."
  );

  const result = await client.session.prompt({
    path: { id: session.data.id },
    body: {
      model: toSdkModel(judge.model),
      agent: "build",
      parts: [{ type: "text", text: prompt }],
      format: { type: "json_schema", schema: judgeSchema, retryCount: 2 }
    }
  });

  return {
    output: extractStructuredOutput(result.data.info),
    telemetry: telemetryFromAssistantInfo(result.data.info)
  };
}

function extractStructuredOutput(info: any): unknown {
  return info?.structured_output ?? info?.structured ?? info;
}

async function makeScenarioConfig(scenario: string, baselinePath: string | null): Promise<ScenarioConfig> {
  const taskPath = path.resolve(root, path.join("scenarios", `${scenario}.md`));
  return {
    id: scenario,
    taskPath,
    baselinePath,
    judgeInstructions: judgeInstructionsForScenario(scenario, Boolean(baselinePath))
  };
}

async function listFiles(directory: string, limit: number): Promise<string[]> {
  const files: string[] = [];

  async function walk(current: string) {
    if (files.length >= limit) return;
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (files.length >= limit) return;
      if ([".git", "node_modules", "bin", "obj", ".lattice"].includes(entry.name)) continue;
      const absolute = path.join(current, entry.name);
      const relative = path.relative(directory, absolute);
      if (entry.isDirectory()) {
        await walk(absolute);
      } else if (entry.name !== "result.json") {
        files.push(relative);
      }
    }
  }

  await walk(directory);
  return files.sort();
}

function getPipelineStatus(pipelineState: unknown): string | undefined {
  if (!pipelineState || typeof pipelineState !== "object") return undefined;
  const status = (pipelineState as { status?: unknown }).status;
  return typeof status === "string" ? status : undefined;
}

function hasStructuredJudge(value: unknown): value is { structured: unknown } {
  return Boolean(value && typeof value === "object" && "structured" in value);
}

function parseArgs(args: string[]): Record<string, string> {
  const parsed: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = "true";
    } else {
      parsed[key] = next;
      i += 1;
    }
  }
  return parsed;
}

function toSdkModel(model: string) {
  const [providerID, ...modelParts] = model.split("/");
  return { providerID, modelID: modelParts.join("/") };
}

async function choosePort(): Promise<number> {
  return 5096 + Math.floor(Math.random() * 1000);
}

function log(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
