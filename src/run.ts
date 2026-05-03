// pattern: Imperative Shell

import { createOpencode } from "@opencode-ai/sdk";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { collectOptionalEvidenceChecks, runCommand, type CommandResult } from "./checks.js";
import { buildJudgePrompt, judgeInstructionsForScenario } from "./judge-prompt.js";
import { judgeSchema } from "./judge-schema.js";
import {
  completedPipelineAnomaly,
  getPipelineStatus,
  isPipelineCompleted,
  reviewRejectionSummary,
  waitForPipeline,
  type PipelineState
} from "./lattice-state.js";
import { makeOpenCodeConfig } from "./opencode-config.js";
import {
  renderPipelineTemplate,
  reviewModelForVariant,
  sliceModelForVariant,
  type ModelVariant,
  type PhaseModel
} from "./pipeline.js";
import { summarizeTelemetry, telemetryFromAssistantInfo, type AssistantTelemetry, type TelemetrySummary } from "./telemetry.js";
import { archiveRun, exists, listFiles, prepareWorkspace, waitForStableWorkspace } from "./workspace.js";

type ModelsConfig = {
  variants: ModelVariant[];
  judge: PhaseModel;
};

type ScenarioConfig = {
  id: string;
  taskPath: string;
  baselinePath: string | null;
  judgeInstructions: string[];
};

type RunSummary = {
  scenario: string;
  variant: string;
  attempt: number;
  maxAttempts: number;
  retryable: boolean;
  baseline: string | null;
  workspace: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  pipelineState: PipelineState;
  plan: string | null;
  telemetry: TelemetrySummary;
  checks: CommandResult[];
  fileTree: string[];
  judge: unknown;
};

const root = process.cwd();
const activeRunsDir = path.resolve(process.env.EVAL_RUNS_DIR ?? "/tmp/restaurant-booking-eval-harness-active");
const archiveDir = path.resolve(process.env.EVAL_ARCHIVE_DIR ?? path.join(root, "run-archive"));
const defaultTimeoutMs = 120 * 60 * 1000;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const scenario = parseScenario(args);
  const modelsPath = path.resolve(root, args.models ?? "models.json");
  const scenarioConfig = await makeScenarioConfig(scenario, args);
  const timeoutMs = Number(args.timeoutMs ?? defaultTimeoutMs);
  const runRetries = parseNonNegativeInteger(args.runRetries ?? "1", "runRetries");
  const maxAttempts = runRetries + 1;

  const models = JSON.parse(await readFile(modelsPath, "utf8")) as ModelsConfig;
  const task = await readFile(scenarioConfig.taskPath, "utf8");
  const requestedVariant = args.variant;
  const variants = requestedVariant
    ? models.variants.filter((variant) => variant.id === requestedVariant)
    : models.variants.filter((variant) => variant.enabled !== false);

  if (variants.length === 0) {
    throw new Error(`No variants matched ${requestedVariant}`);
  }

  if (requestedVariant && variants[0]?.enabled === false) {
    log(`Variant ${requestedVariant} is disabled (${variants[0].reason ?? "no reason"}) but was explicitly requested; running it anyway.`);
  }

  await mkdir(activeRunsDir, { recursive: true });
  await mkdir(archiveDir, { recursive: true });

  log(`Starting scenario ${scenario} with ${variants.length} variant(s): ${variants.map((variant) => variant.id).join(", ")}`);
  if (scenarioConfig.baselinePath) {
    log(`Scenario ${scenario}: seeding workspaces from ${scenarioConfig.baselinePath}`);
  }

  for (const [index, variant] of variants.entries()) {
    log(`[${index + 1}/${variants.length}] Starting variant ${variant.id}`);
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      log(`[${index + 1}/${variants.length}] ${variant.id}: attempt ${attempt}/${maxAttempts}`);
      const summary = await runVariant({
        variant,
        scenario,
        attempt,
        maxAttempts,
        judge: models.judge,
        task,
        scenarioConfig,
        timeoutMs,
        skipSkills: args.skipSkills === "true"
      });

      const outputDirectory = await archiveRun(summary.workspace, scenario, archiveDir);
      summary.workspace = outputDirectory;
      summary.retryable = isRetryableSummary(summary);
      const outputPath = path.join(outputDirectory, "result.json");
      await writeFile(outputPath, `${JSON.stringify(summary, null, 2)}\n`);
      log(`[${index + 1}/${variants.length}] Wrote ${outputPath}`);

      if (!summary.retryable || attempt === maxAttempts) {
        break;
      }

      log(`[${index + 1}/${variants.length}] ${variant.id}: retrying transient ${getPipelineStatus(summary.pipelineState) ?? "unknown"} status`);
    }
  }
}

async function runVariant(input: {
  variant: ModelVariant;
  scenario: string;
  attempt: number;
  maxAttempts: number;
  judge: PhaseModel;
  task: string;
  scenarioConfig: ScenarioConfig;
  timeoutMs: number;
  skipSkills: boolean;
}): Promise<RunSummary> {
  const startedAt = new Date();
  const workspace = path.join(activeRunsDir, `${Date.now()}-scenario-${input.scenario}-${safeName(input.variant.id)}-attempt-${input.attempt}`);
  log(`${input.variant.id}: preparing workspace ${workspace}`);
  await prepareWorkspace({
    workspace,
    variantId: input.variant.id,
    skipSkills: input.skipSkills,
    baselinePath: input.scenarioConfig.baselinePath,
    root,
    opencodeConfig: makeOpenCodeConfig(input.variant),
    pipelineTemplate: renderPipelineTemplate(input.variant),
    log
  });
  await writeLatticeConfig(workspace, input.variant);

  const previousCwd = process.cwd();
  process.chdir(workspace);

  let opencode: Awaited<ReturnType<typeof createOpencode>> | undefined;
  try {
    log(`${input.variant.id}: starting OpenCode server`);
    opencode = await createOpencode({
      port: await choosePort(),
      timeout: 30_000,
      config: makeOpenCodeConfig(input.variant) as any
    });
    log(`${input.variant.id}: OpenCode server started at ${opencode.server.url}`);

    const client = opencode.client as any;
    await assertCommandRegistered(client, "restaurant-booking-eval");
    await assertCommandRegistered(client, "lattice");

    log(`${input.variant.id}: creating OpenCode session`);
    const session = await client.session.create({
      body: { title: `restaurant-booking scenario ${input.scenario} ${input.variant.id}` }
    });
    const sessionId = session.data.id;

    log(`${input.variant.id}: starting Lattice pipeline`);
    await startLatticePipeline(client, sessionId, input.task);

    log(`${input.variant.id}: waiting for Lattice pipeline state`);
    if (!(await waitForPipelineStateFile(workspace, 60_000))) {
      throw new Error("Lattice pipeline did not start: no .lattice/state/*.json file was created after queueing /restaurant-booking-eval.");
    }
    log(`${input.variant.id}: Lattice pipeline state detected; waiting for pipeline completion`);

    let pipelineState = await waitForPipeline(workspace, input.timeoutMs, log);
    const retryFinding = reviewRejectionSummary(pipelineState);
    if (retryFinding) {
      log(`${input.variant.id}: review stage rejected; retrying upstream stage with review findings`);
      await retryPausedPipeline(client, sessionId, retryFinding);
      pipelineState = await waitForPipeline(workspace, input.timeoutMs, log);
    }
    if (!isPipelineCompleted(pipelineState)) {
      const completedAt = new Date();
      log(`${input.variant.id}: pipeline did not complete; running deterministic checks for salvage evidence`);
      const plan = await readPlan(workspace);
      const checks = await runChecks(workspace);
      const fileTree = await listFiles(workspace, 500);
      const pipelineTelemetry = summarizeTelemetry(pipelineState);
      if (checks.every((check) => check.exitCode === 0)) {
        log(`${input.variant.id}: deterministic checks passed despite pipeline status ${getPipelineStatus(pipelineState)}; running judge`);
        const judgeResult = await judgeRun(client, input.judge, {
          task: input.task,
          scenario: input.scenarioConfig,
          variant: input.variant,
          plan: null,
          pipelineTelemetry,
          checks,
          fileTree
        });
        return {
          variant: input.variant.id,
          scenario: input.scenario,
          attempt: input.attempt,
          maxAttempts: input.maxAttempts,
          retryable: false,
          baseline: input.scenarioConfig.baselinePath,
          workspace,
          startedAt: startedAt.toISOString(),
          completedAt: completedAt.toISOString(),
          durationMs: completedAt.getTime() - startedAt.getTime(),
          pipelineState,
          plan,
          telemetry: summarizeTelemetry(pipelineState, judgeResult.telemetry),
          checks,
          fileTree,
          judge: judgeResult.output
        };
      }

      log(`${input.variant.id}: deterministic checks failed; skipping judge`);
      return {
        variant: input.variant.id,
        scenario: input.scenario,
        attempt: input.attempt,
        maxAttempts: input.maxAttempts,
        retryable: false,
        baseline: input.scenarioConfig.baselinePath,
        workspace,
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        durationMs: completedAt.getTime() - startedAt.getTime(),
        pipelineState,
        plan,
        telemetry: pipelineTelemetry,
        checks,
        fileTree,
        judge: {
          skipped: true,
          reason: "pipeline did not complete and deterministic checks did not pass",
          status: getPipelineStatus(pipelineState)
        }
      };
    }

    log(`${input.variant.id}: pipeline completed; waiting for workspace to settle before checks`);
    await waitForStableWorkspace(workspace, 10_000, 120_000, log);
    log(`${input.variant.id}: pipeline completed; running deterministic checks`);
    const plan = await readPlan(workspace);
    const checks = await runChecks(workspace);
    log(`${input.variant.id}: deterministic checks finished; collecting files`);
    const fileTree = await listFiles(workspace, 500);
    const pipelineTelemetry = summarizeTelemetry(pipelineState);
    const pipelineAnomaly = completedPipelineAnomaly(pipelineState);
    if (pipelineAnomaly) {
      log(`${input.variant.id}: skipping judge because completed pipeline is anomalous: ${pipelineAnomaly}`);
      const completedAt = new Date();
      return {
        variant: input.variant.id,
        scenario: input.scenario,
        attempt: input.attempt,
        maxAttempts: input.maxAttempts,
        retryable: true,
        baseline: input.scenarioConfig.baselinePath,
        workspace,
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        durationMs: completedAt.getTime() - startedAt.getTime(),
        pipelineState,
        plan,
        telemetry: pipelineTelemetry,
        checks,
        fileTree,
        judge: {
          skipped: true,
          reason: pipelineAnomaly,
          status: getPipelineStatus(pipelineState)
        }
      };
    }
    log(`${input.variant.id}: running LLM judge`);
    const judgeResult = await judgeRun(client, input.judge, {
      task: input.task,
      scenario: input.scenarioConfig,
      variant: input.variant,
      plan: null,
      pipelineTelemetry,
      checks,
      fileTree
    });
    const telemetry = summarizeTelemetry(pipelineState, judgeResult.telemetry);
    log(`${input.variant.id}: judge completed`);

    const completedAt = new Date();
    return {
      variant: input.variant.id,
      scenario: input.scenario,
      attempt: input.attempt,
      maxAttempts: input.maxAttempts,
      retryable: false,
      baseline: input.scenarioConfig.baselinePath,
      workspace,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      durationMs: completedAt.getTime() - startedAt.getTime(),
      pipelineState,
      plan,
      telemetry,
      checks,
      fileTree,
      judge: judgeResult.output
    };
  } finally {
    opencode?.server.close();
    process.chdir(previousCwd);
  }
}

function isRetryableSummary(summary: RunSummary): boolean {
  const skippedReason =
    typeof summary.judge === "object" && summary.judge !== null && "reason" in summary.judge
      ? String((summary.judge as { reason?: unknown }).reason ?? "")
      : "";
  if (skippedReason.includes("completed pipeline has no assistant telemetry")) return true;
  if (skippedReason.includes("completed build stage has no assistant telemetry")) return true;

  const status = getPipelineStatus(summary.pipelineState);
  if (status !== "failed" && status !== "timeout") return false;
  if (summary.checks.length > 0 && summary.checks.every((check) => check.exitCode === 0)) return false;
  return true;
}

async function writeLatticeConfig(workspace: string, variant: ModelVariant): Promise<void> {
  const review = reviewModelForVariant(variant);
  const slice = sliceModelForVariant(variant);
  const latticeConfig = {
    agents: {
      "eval-planner": { model: variant.plan.model },
      "eval-slicer": { model: slice.model },
      "plan-reviewer": { model: review?.model ?? variant.plan.model },
      build: { model: variant.build.model }
    }
  };

  await writeFile(path.join(workspace, ".lattice", "config.jsonc"), `${JSON.stringify(latticeConfig, null, 2)}\n`);
}

async function waitForPipelineStateFile(workspace: string, timeoutMs: number): Promise<boolean> {
  const stateDir = path.join(workspace, ".lattice", "state");
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const entries = await readdir(stateDir);
      if (entries.some((entry) => entry.endsWith(".json"))) return true;
    } catch {
      // State directory is created only after Lattice starts the pipeline.
    }
    await sleep(1_000);
  }
  return false;
}

async function startLatticePipeline(client: any, sessionId: string, goal: string): Promise<void> {
  log("Pipeline: queueing /restaurant-booking-eval prompt");
  await withTransientSdkRetry("/restaurant-booking-eval", async () => {
    const result = await client.session.promptAsync({
      path: { id: sessionId },
      body: {
        agent: "build",
        parts: [
          {
            type: "text",
            text:
              `Use the lattice_control tool exactly once with action "run", pipeline "restaurant-booking-eval", and goal: ${goal}\n\n` +
              "After the tool call returns, stop. Do not inspect status, continue, retry, abort, read files, or begin implementation."
          }
        ]
      }
    });
    if (result?.error) {
      throw new Error(`Failed to queue /restaurant-booking-eval: ${errorSummary(result.error)}`);
    }
  });
  log("Pipeline: /restaurant-booking-eval prompt queued");
}

async function retryPausedPipeline(client: any, sessionId: string, findings: string): Promise<void> {
  log("Pipeline: invoking /lattice retry with review findings");
  await withTransientSdkRetry("/lattice retry", async () => {
    await client.session.command({
      path: { id: sessionId },
      body: {
        command: "lattice",
        arguments: [
          "retry",
          "Retry the appropriate upstream stage and address these review findings before signaling again:",
          "",
          findings
        ].join("\n")
      }
    });
  });
  log("Pipeline: /lattice retry command completed");
}

async function withTransientSdkRetry<T>(label: string, action: () => Promise<T>, maxAttempts = 4): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      if (!isTransientSdkError(error) || attempt === maxAttempts) break;
      const delayMs = Math.min(30_000, 2_000 * 2 ** (attempt - 1));
      log(`${label}: transient SDK error on attempt ${attempt}/${maxAttempts}; retrying in ${Math.round(delayMs / 1000)}s (${errorSummary(error)})`);
      await sleep(delayMs);
    }
  }
  throw lastError;
}

function isTransientSdkError(error: unknown): boolean {
  const text = errorSummary(error).toLowerCase();
  return [
    "fetch failed",
    "headers timeout",
    "und_err_headers_timeout",
    "body timeout",
    "econnreset",
    "econnrefused",
    "socket hang up",
    "terminated"
  ].some((needle) => text.includes(needle));
}

function errorSummary(error: unknown): string {
  if (error instanceof Error) {
    const cause = (error as Error & { cause?: unknown }).cause;
    return cause instanceof Error ? `${error.message}: ${cause.message}` : error.message;
  }
  return String(error);
}

async function readPlan(workspace: string): Promise<string | null> {
  const planPath = path.join(workspace, ".lattice", "plans", "restaurant-booking.md");
  try {
    return await readFile(planPath, "utf8");
  } catch {
    return null;
  }
}

async function runChecks(workspace: string): Promise<CommandResult[]> {
  log("Check: node .opencode/scripts/deterministic-checks.mjs --json");
  const result = await runCommand("node", [".opencode/scripts/deterministic-checks.mjs", "--json"], workspace, 60 * 60 * 1000);
  log(`Check: deterministic checker exited ${result.exitCode} in ${Math.round(result.durationMs / 1000)}s`);
  try {
    const checks = JSON.parse(result.stdout) as CommandResult[];
    return [...checks, ...(await collectOptionalEvidenceChecks(workspace, log))];
  } catch {
    return [result, ...(await collectOptionalEvidenceChecks(workspace, log))];
  }
}

async function assertCommandRegistered(client: any, commandName: string): Promise<void> {
  log(`Preflight: checking /${commandName} command is registered`);
  const response = await client.command.list();
  const commands = response.data as Array<{ name?: string; command?: string }>;
  const names = commands.map((command) => command.name ?? command.command).filter(Boolean) as string[];
  if (!names.includes(commandName)) {
    const latticeCommands = names.filter((name) => name.includes("lattice") || name.includes("restaurant"));
    throw new Error(
      `/${commandName} is not registered. Lattice commands found: ${latticeCommands.length ? latticeCommands.join(", ") : "none"}`
    );
  }
  log(`Preflight: /${commandName} command is registered`);
}

async function judgeRun(
  client: any,
  judge: PhaseModel,
  details: unknown
): Promise<{ output: unknown; telemetry: AssistantTelemetry }> {
  const session = await client.session.create({ body: { title: "judge restaurant booking eval" } });
  const prompt = buildJudgePrompt(
    details,
    "You are running in the submitted solution workspace. Before producing final structured output, inspect the codebase with filesystem/search tools as needed. Do not rely only on fileTree or deterministic check text for source-level claims."
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
    output: result.data.info.structured_output ?? result.data.info,
    telemetry: telemetryFromAssistantInfo(result.data.info)
  };
}

function toSdkModel(model: string) {
  const [providerID, ...modelParts] = model.split("/");
  return { providerID, modelID: modelParts.join("/") };
}

async function choosePort(): Promise<number> {
  return 4096 + Math.floor(Math.random() * 1000);
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

async function makeScenarioConfig(scenario: string, args: Record<string, string>): Promise<ScenarioConfig> {
  const taskPath = path.resolve(root, args.task ?? path.join("scenarios", `${scenario}.md`));
  const baselineArg = args.base ?? args.baseline;
  const baselinePath = baselineArg ? path.resolve(root, baselineArg) : null;

  if (baselinePath && !(await exists(baselinePath))) {
    throw new Error(`Baseline path does not exist: ${baselinePath}`);
  }

  return {
    id: scenario,
    taskPath,
    baselinePath,
    judgeInstructions: judgeInstructionsForScenario(scenario, Boolean(baselinePath))
  };
}

function parseScenario(args: Record<string, string>): string {
  const numericFlags = Object.entries(args)
    .filter(([, value]) => value === "true")
    .map(([key]) => key)
    .filter((key) => /^\d+$/.test(key));
  const scenario = args.scenario ?? numericFlags[0];
  if (!scenario) {
    throw new Error("Scenario is required. Use `npm start -- --1`, `npm start -- --2`, or `npm start -- --scenario 2`.");
  }
  if (!/^[12]$/.test(scenario)) {
    throw new Error(`Invalid scenario ${scenario}. Use --1, --2, --scenario 1, or --scenario 2.`);
  }
  if (numericFlags.length > 1) {
    throw new Error(`Only one scenario may be selected; got ${numericFlags.map((flag) => `--${flag}`).join(", ")}.`);
  }
  return scenario;
}

function parseNonNegativeInteger(value: string, name: string): number {
  if (!/^\d+$/.test(value)) {
    throw new Error(`${name} must be a non-negative integer.`);
  }
  return Number(value);
}

function safeName(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
