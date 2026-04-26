import { createOpencode } from "@opencode-ai/sdk";
import { cp, mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { collectOptionalEvidenceChecks, runCommand, type CommandResult } from "./checks.js";
import { judgeSchema } from "./judge-schema.js";
import { buildJudgePrompt, judgeInstructionsForScenario } from "./judge-prompt.js";

type PhaseModel = {
  model: string;
  agentOptions?: Record<string, unknown>;
};

type ReviewModel = PhaseModel & {
  enabled?: boolean;
};

type ModelVariant = {
  id: string;
  enabled?: boolean;
  reason?: string;
  plan: PhaseModel;
  build: PhaseModel;
  review?: ReviewModel;
};

type ModelsConfig = {
  variants: ModelVariant[];
  judge: PhaseModel;
};

type TokenTelemetry = {
  tokensIn: number;
  tokensOut: number;
  tokensReasoning: number;
  tokensCacheRead: number;
  tokensCacheWrite: number;
  costUSD: number;
  messageCount: number;
};

type TelemetrySummary = TokenTelemetry & {
  stages: Array<TokenTelemetry & { id: string; agent?: string; model?: string; provider?: string }>;
  judge?: TokenTelemetry & { model?: string; provider?: string };
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
  pipelineState: unknown;
  plan: string | null;
  telemetry: TelemetrySummary;
  checks: CommandResult[];
  fileTree: string[];
  judge: unknown;
};

const root = process.cwd();
const activeRunsDir = path.resolve(process.env.EVAL_RUNS_DIR ?? "/tmp/restaurant-booking-eval-harness-active");
const archiveDir = path.resolve(process.env.EVAL_ARCHIVE_DIR ?? path.join(root, "run-archive"));
const defaultTimeoutMs = 75 * 60 * 1000;
const baselineExcludeNames = new Set([
  ".agents",
  ".git",
  ".lattice",
  ".opencode",
  "bin",
  "coverage",
  "dist",
  "node_modules",
  "obj",
  "result.json"
]);

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

      const outputDirectory = await archiveRun(summary.workspace, scenario);
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
  await prepareWorkspace(workspace, input.variant, input.skipSkills, input.scenarioConfig.baselinePath);

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
    log(`${input.variant.id}: creating OpenCode session`);
    const session = await client.session.create({
      body: { title: `restaurant-booking scenario ${input.scenario} ${input.variant.id}` }
    });
    const sessionId = session.data.id;

    await assertCommandRegistered(client, "restaurant-booking-eval");

    log(`${input.variant.id}: starting Lattice pipeline via prompt`);
    await client.session.prompt({
      path: { id: sessionId },
      body: {
        agent: "build",
        model: toSdkModel(input.variant.build.model),
        parts: [
          {
            type: "text",
            text: [
              "Use the lattice_run tool to start the pipeline named \"restaurant-booking-eval\".",
              "Pass the following goal exactly as the tool goal:",
              "",
              input.task
            ].join("\n")
          }
        ]
      }
    });
    log(`${input.variant.id}: Lattice start prompt returned; waiting for pipeline state`);

    let pipelineState = await waitForPipeline(workspace, input.timeoutMs);
    const retryFinding = planReviewRejectionSummary(pipelineState);
    if (retryFinding) {
      log(`${input.variant.id}: plan-adherence review rejected; retrying build with review findings`);
      await retryPausedPipeline(client, sessionId, retryFinding);
      pipelineState = await waitForPipeline(workspace, input.timeoutMs);
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
          plan,
          pipelineCompleted: false,
          pipelineStatus: getPipelineStatus(pipelineState),
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
    await waitForStableWorkspace(workspace, 10_000, 120_000);
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
      plan,
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

async function prepareWorkspace(workspace: string, variant: ModelVariant, skipSkills: boolean, baselinePath: string | null) {
  await rm(workspace, { recursive: true, force: true });
  await mkdir(workspace, { recursive: true });

  if (baselinePath) {
    log(`${variant.id}: copying baseline source from ${baselinePath}`);
    await copyBaseline(baselinePath, workspace);
  }

  await mkdir(path.join(workspace, ".opencode", "lattice-pipelines"), { recursive: true });
  await mkdir(path.join(workspace, ".opencode", "scripts"), { recursive: true });
  await mkdir(path.join(workspace, ".lattice", "plans"), { recursive: true });

  const packageJsonPath = path.join(workspace, "package.json");
  if (!(await exists(packageJsonPath))) {
    await writeFile(packageJsonPath, `${JSON.stringify({ private: true }, null, 2)}\n`);
  }
  const gitignorePath = path.join(workspace, ".gitignore");
  if (!(await exists(gitignorePath))) {
    await writeFile(gitignorePath, [".lattice/", "node_modules/", "bin/", "obj/", "frontend/node_modules/", ""].join("\n"));
  }
  await writeFile(path.join(workspace, "opencode.json"), `${JSON.stringify(makeOpenCodeConfig(variant), null, 2)}\n`);
  await writeFile(
    path.join(workspace, ".opencode", "lattice-pipelines", "restaurant-booking-eval.ts"),
    await renderPipelineTemplate(variant)
  );
  await cp(
    path.join(root, "templates", "scripts", "deterministic-checks.mjs"),
    path.join(workspace, ".opencode", "scripts", "deterministic-checks.mjs")
  );

  if (!skipSkills) {
    log(`${variant.id}: installing skills`);
    const skillInstall = await runCommand("bash", [path.join(root, "scripts", "install-skills.sh")], workspace, 10 * 60 * 1000);
    log(`${variant.id}: skill install exited ${skillInstall.exitCode}`);
    if (skillInstall.exitCode !== 0) {
      throw new Error(`Skill install failed:\n${skillInstall.stderr || skillInstall.stdout}`);
    }
    log(`${variant.id}: syncing skills for Lattice`);
    await syncSkillsForLattice(workspace);
  } else {
    log(`${variant.id}: skipping skill install`);
  }
}

async function copyBaseline(baselinePath: string, workspace: string) {
  const entries = await readdir(baselinePath, { withFileTypes: true });
  for (const entry of entries) {
    if (baselineExcludeNames.has(entry.name)) continue;
    const source = path.join(baselinePath, entry.name);
    const destination = path.join(workspace, entry.name);
    await cp(source, destination, {
      recursive: true,
      filter: (candidate) => !isExcludedBaselinePath(baselinePath, candidate)
    });
  }
}

function isExcludedBaselinePath(baselinePath: string, candidate: string): boolean {
  const relative = path.relative(baselinePath, candidate);
  if (!relative || relative.startsWith("..")) return false;
  return relative.split(path.sep).some((part) => baselineExcludeNames.has(part));
}

async function archiveRun(workspace: string, scenario: string): Promise<string> {
  const destination = path.join(archiveDir, `scenario-${scenario}`, path.basename(workspace));
  await rm(destination, { recursive: true, force: true });
  await mkdir(path.dirname(destination), { recursive: true });

  try {
    await rename(workspace, destination);
  } catch (error) {
    const code = typeof error === "object" && error !== null ? (error as { code?: string }).code : undefined;
    if (code !== "EXDEV") throw error;
    await cp(workspace, destination, { recursive: true });
    await rm(workspace, { recursive: true, force: true });
  }

  return destination;
}

async function syncSkillsForLattice(workspace: string) {
  const source = path.join(workspace, ".agents", "skills");
  const target = path.join(workspace, ".opencode", "skills");
  if (!(await exists(source))) {
    throw new Error(`Skills CLI did not create ${source}`);
  }

  await rm(target, { recursive: true, force: true });
  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target, { recursive: true });
}

function makeOpenCodeConfig(variant: ModelVariant) {
  const review = reviewModelForVariant(variant);
  return {
    $schema: "https://opencode.ai/config.json",
    model: variant.build.model,
    agent: {
      plan: {
        model: variant.plan.model,
        ...variant.plan.agentOptions
      },
      "eval-planner": {
        model: variant.plan.model,
        mode: "subagent",
        description: "Writes a concise implementation plan for the restaurant booking eval before build.",
        permission: {
          read: "allow",
          edit: "allow",
          glob: "allow",
          grep: "allow",
          list: "allow",
          bash: "deny",
          external_directory: {
            "/tmp/*": "allow",
            "*": "deny"
          },
          webfetch: "allow",
          skill: "allow"
        },
        ...variant.plan.agentOptions
      },
      "plan-reviewer": {
        model: review?.model ?? variant.plan.model,
        mode: "subagent",
        description: "Reviews whether the implementation followed the saved plan and scenario requirements.",
        permission: {
          read: "allow",
          edit: "deny",
          glob: "allow",
          grep: "allow",
          list: "allow",
          bash: "allow",
          external_directory: {
            "/tmp/*": "allow",
            "*": "deny"
          },
          webfetch: "allow",
          skill: "allow"
        },
        ...(review?.agentOptions ?? variant.plan.agentOptions)
      },
      build: {
        model: variant.build.model,
        permission: {
          external_directory: {
            "/tmp/*": "allow",
            "*": "deny"
          }
        },
        ...variant.build.agentOptions
      }
    },
    permission: {
      edit: "allow",
      bash: "allow",
      external_directory: {
        "/tmp/*": "allow",
        "*": "deny"
      },
      webfetch: "allow"
    },
    snapshot: false
  };
}

async function renderPipelineTemplate(variant: ModelVariant): Promise<string> {
  const template = await readFile(path.join(root, "templates", "lattice-pipeline.ts"), "utf8");
  if (reviewModelForVariant(variant)) return template;

  const reviewStageStart = template.indexOf('\n    {\n      id: "plan-adherence-review"');
  if (reviewStageStart === -1) {
    throw new Error("Could not find plan-adherence-review stage in pipeline template");
  }

  const stagesEnd = template.indexOf("\n  ]", reviewStageStart);
  if (stagesEnd === -1) {
    throw new Error("Could not find end of stages array in pipeline template");
  }

  return template.slice(0, reviewStageStart) + template.slice(stagesEnd);
}

function reviewModelForVariant(variant: ModelVariant): ReviewModel | undefined {
  if (!variant.review || variant.review.enabled === false) return undefined;
  return variant.review;
}

async function waitForPipeline(workspace: string, timeoutMs: number): Promise<unknown> {
  const start = Date.now();
  let lastState: unknown = null;
  let lastLoggedStatus = "waiting-for-state";
  let lastHeartbeat = start;
  log(`Pipeline: waiting for .lattice/state (timeout ${Math.round(timeoutMs / 60000)}m)`);

  while (Date.now() - start < timeoutMs) {
    lastState = await latestPipelineState(workspace);
    const status = typeof lastState === "object" && lastState ? (lastState as { status?: string }).status : undefined;

    const displayStatus = status ?? "waiting-for-state";
    if (displayStatus !== lastLoggedStatus) {
      lastLoggedStatus = displayStatus;
      log(`Pipeline: status ${displayStatus}`);
    }

    if (status === "completed" || status === "paused" || status === "failed") {
      return lastState;
    }

    if (Date.now() - lastHeartbeat > 60_000) {
      lastHeartbeat = Date.now();
      log(`Pipeline: still ${displayStatus} after ${Math.round((Date.now() - start) / 60000)}m`);
    }

    await sleep(10_000);
  }

  return { status: "timeout", timeoutMs, lastState };
}

async function latestPipelineState(workspace: string): Promise<unknown> {
  const stateDir = path.join(workspace, ".lattice", "state");
  let entries: string[];
  try {
    entries = await readdir(stateDir);
  } catch {
    return null;
  }

  const jsonFiles = entries.filter((entry) => entry.endsWith(".json"));
  if (jsonFiles.length === 0) return null;

  const files = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(stateDir, file);
      return { filePath, stats: await stat(filePath) };
    })
  );
  files.sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs);

  return JSON.parse(await readFile(files[0].filePath, "utf8"));
}

function isPipelineCompleted(state: unknown): boolean {
  return getPipelineStatus(state) === "completed";
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

function getPipelineStatus(state: unknown): string | undefined {
  return typeof state === "object" && state !== null ? (state as { status?: string }).status : undefined;
}

function planReviewRejectionSummary(state: unknown): string | null {
  if (getPipelineStatus(state) !== "paused" || !state || typeof state !== "object") return null;
  const stages = (state as { stages?: unknown }).stages;
  if (!Array.isArray(stages)) return null;
  const rejected = stages.find((stage) => {
    if (!stage || typeof stage !== "object") return false;
    const record = stage as { id?: unknown; status?: unknown };
    return record.id === "plan-adherence-review" && record.status === "rejected";
  });
  if (!rejected || typeof rejected !== "object") return null;
  const summary = (rejected as { summary?: unknown }).summary;
  return typeof summary === "string" && summary.trim().length > 0 ? summary.trim() : "Plan-adherence review rejected without a summary.";
}

async function retryPausedPipeline(client: any, sessionId: string, findings: string): Promise<void> {
  log("Pipeline: invoking /lattice-retry with plan-review findings");
  await client.session.command({
    path: { id: sessionId },
    body: {
      command: "lattice-retry",
      arguments: [
        "Retry the build stage and address these plan-adherence review findings before signaling complete again:",
        "",
        findings
      ].join("\n")
    }
  });
  log("Pipeline: /lattice-retry command completed");
}

function completedPipelineAnomaly(state: unknown): string | null {
  if (getPipelineStatus(state) !== "completed") return null;
  if (!state || typeof state !== "object") return "completed pipeline state is missing";

  const stages = (state as { stages?: unknown }).stages;
  if (!Array.isArray(stages)) return "completed pipeline state has no stages";

  const completedStages = stages.filter((stage) => {
    if (!stage || typeof stage !== "object") return false;
    const status = (stage as { status?: unknown }).status;
    return status === "completed";
  });

  if (completedStages.length === 0) return "completed pipeline has no completed stages";

  const buildStage = completedStages.find((stage) => {
    const record = stage as { id?: unknown; agent?: unknown };
    return record.id === "build" || record.agent === "build" || record.agent === "implementor";
  });
  const stagesToCheck = buildStage ? [buildStage] : completedStages;

  for (const stage of stagesToCheck) {
    const record = stage as { id?: unknown; telemetry?: unknown };
    const id = typeof record.id === "string" ? record.id : "unknown";
    if (!record.telemetry || typeof record.telemetry !== "object") {
      return buildStage ? `completed build stage has no assistant telemetry (${id})` : "completed pipeline has no assistant telemetry";
    }
    const telemetry = record.telemetry as { messageCount?: unknown; tokensIn?: unknown; tokensOut?: unknown };
    const messageCount = typeof telemetry.messageCount === "number" ? telemetry.messageCount : 0;
    const tokensIn = typeof telemetry.tokensIn === "number" ? telemetry.tokensIn : 0;
    const tokensOut = typeof telemetry.tokensOut === "number" ? telemetry.tokensOut : 0;
    if (messageCount === 0 || (tokensIn === 0 && tokensOut === 0)) {
      return buildStage
        ? `completed build stage has no assistant telemetry (${id})`
        : `completed stage has no assistant telemetry (${id})`;
    }
  }

  return null;
}

async function readPlan(workspace: string): Promise<string | null> {
  const planPath = path.join(workspace, ".lattice", "plans", "restaurant-booking.md");
  try {
    return await readFile(planPath, "utf8");
  } catch {
    return null;
  }
}

function emptyTelemetry(): TokenTelemetry {
  return {
    tokensIn: 0,
    tokensOut: 0,
    tokensReasoning: 0,
    tokensCacheRead: 0,
    tokensCacheWrite: 0,
    costUSD: 0,
    messageCount: 0
  };
}

function addTelemetry(total: TokenTelemetry, telemetry: Partial<TokenTelemetry> | undefined): void {
  if (!telemetry) return;
  total.tokensIn += telemetry.tokensIn ?? 0;
  total.tokensOut += telemetry.tokensOut ?? 0;
  total.tokensReasoning += telemetry.tokensReasoning ?? 0;
  total.tokensCacheRead += telemetry.tokensCacheRead ?? 0;
  total.tokensCacheWrite += telemetry.tokensCacheWrite ?? 0;
  total.costUSD += telemetry.costUSD ?? 0;
  total.messageCount += telemetry.messageCount ?? 0;
}

function summarizeTelemetry(state: unknown, judge?: TelemetrySummary["judge"]): TelemetrySummary {
  const stages = extractStageTelemetry(state);
  const total = emptyTelemetry();
  for (const stage of stages) addTelemetry(total, stage);
  addTelemetry(total, judge);
  return { ...total, stages, ...(judge ? { judge } : {}) };
}

function extractStageTelemetry(state: unknown): TelemetrySummary["stages"] {
  if (!state || typeof state !== "object") return [];
  const stages = (state as { stages?: unknown }).stages;
  if (!Array.isArray(stages)) return [];

  return stages.flatMap((stage) => {
    if (!stage || typeof stage !== "object") return [];
    const stageRecord = stage as { id?: unknown; agent?: unknown; telemetry?: unknown };
    const telemetry = stageRecord.telemetry;
    if (!telemetry || typeof telemetry !== "object") return [];
    const telemetryRecord = telemetry as Partial<TokenTelemetry> & { model?: unknown; provider?: unknown };
    return [
      {
        id: typeof stageRecord.id === "string" ? stageRecord.id : "unknown",
        agent: typeof stageRecord.agent === "string" ? stageRecord.agent : undefined,
        model: typeof telemetryRecord.model === "string" ? telemetryRecord.model : undefined,
        provider: typeof telemetryRecord.provider === "string" ? telemetryRecord.provider : undefined,
        tokensIn: telemetryRecord.tokensIn ?? 0,
        tokensOut: telemetryRecord.tokensOut ?? 0,
        tokensReasoning: telemetryRecord.tokensReasoning ?? 0,
        tokensCacheRead: telemetryRecord.tokensCacheRead ?? 0,
        tokensCacheWrite: telemetryRecord.tokensCacheWrite ?? 0,
        costUSD: telemetryRecord.costUSD ?? 0,
        messageCount: telemetryRecord.messageCount ?? 0
      }
    ];
  });
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
): Promise<{ output: unknown; telemetry: TokenTelemetry & { model?: string; provider?: string } }> {
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

function telemetryFromAssistantInfo(info: any): TokenTelemetry & { model?: string; provider?: string } {
  return {
    model: typeof info?.modelID === "string" ? info.modelID : undefined,
    provider: typeof info?.providerID === "string" ? info.providerID : undefined,
    tokensIn: info?.tokens?.input ?? 0,
    tokensOut: info?.tokens?.output ?? 0,
    tokensReasoning: info?.tokens?.reasoning ?? 0,
    tokensCacheRead: info?.tokens?.cache?.read ?? 0,
    tokensCacheWrite: info?.tokens?.cache?.write ?? 0,
    costUSD: info?.cost ?? 0,
    messageCount: 1
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
      } else {
        files.push(relative);
      }
    }
  }

  await walk(directory);
  return files.sort();
}

async function runLoggedCheck(command: string, args: string[], cwd: string): Promise<CommandResult> {
  const display = [command, ...args].join(" ");
  log(`Check: ${display}`);
  const result = await runCommand(command, args, cwd, 10 * 60 * 1000);
  log(`Check: ${display} exited ${result.exitCode} in ${Math.round(result.durationMs / 1000)}s`);
  return result;
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

async function exists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function safeName(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-");
}

const SETTLE_IGNORED_DIRS = new Set([".git", ".lattice", ".opencode", "bin", "coverage", "dist", "node_modules", "obj"]);

async function latestWorkspaceMtimeMs(dir: string): Promise<number> {
  let latest = 0;
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return latest;
  }

  for (const entry of entries) {
    if (SETTLE_IGNORED_DIRS.has(entry)) continue;
    const filePath = path.join(dir, entry);
    let stats;
    try {
      stats = await stat(filePath);
    } catch {
      continue;
    }

    latest = Math.max(latest, stats.mtimeMs);
    if (stats.isDirectory()) {
      latest = Math.max(latest, await latestWorkspaceMtimeMs(filePath));
    }
  }

  return latest;
}

async function waitForStableWorkspace(workspace: string, quietMs: number, timeoutMs: number): Promise<void> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const latestMtimeMs = await latestWorkspaceMtimeMs(workspace);
    if (Date.now() - latestMtimeMs >= quietMs) return;
    await sleep(1_000);
  }
  log(`Workspace did not stay quiet for ${Math.round(quietMs / 1000)}s before timeout; continuing with latest files`);
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
