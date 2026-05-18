// pattern: Imperative Shell

import { createOpencode } from "@opencode-ai/sdk";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { collectOptionalEvidenceChecks, collectSemanticEvidenceChecks, runCommand, type CommandResult } from "./checks.js";
import { buildJudgePrompt, judgeInstructionsForScenario } from "./judge-prompt.js";
import { judgeSchema } from "./judge-schema.js";
import {
  completedPipelineAnomaly,
  getPipelineStatus,
  isPipelineCompleted,
  reviewRejectionSummary,
  waitForPipeline,
  waitForPipelineRetryResume,
  type PipelineState
} from "./lattice-state.js";
import { makeOpenCodeConfig, makeWeaveConfig } from "./opencode-config.js";
import {
  criticModelForVariant,
  renderPipelineTemplate,
  reviewModelForVariant,
  securityReviewModelForVariant,
  sliceModelForVariant,
  stageAgentsForVariant,
  type EvalBackend,
  type ModelVariant,
  type PhaseModel
} from "./pipeline.js";
import { runPiPipeline, runPiSingleProcess } from "./pi-runner.js";
import type { ScenarioConfig } from "./run-types.js";
import { summarizeTelemetry, telemetryFromAssistantInfo, type AssistantTelemetry, type TelemetrySummary } from "./telemetry.js";
import { archiveRun, exists, listFiles, prepareWorkspace, waitForStableWorkspace } from "./workspace.js";

type ModelsConfig = {
  variants: ModelVariant[];
  judge: PhaseModel;
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
  critic?: CriticAttemptSummary[];
  judge: unknown;
};

type CriticAttemptSummary = {
  attempt: number;
  output: unknown;
  telemetry: AssistantTelemetry;
  repaired: boolean;
  repairTelemetry?: AssistantTelemetry;
};

type CriticOutput = {
  verdict?: unknown;
  findings?: unknown;
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
  const backendOverride = parseBackend(args.backend);
  const piSingleExtensionsOverride = parseOptionalBoolean(args.piSingleExtensions, "piSingleExtensions");
  const piSingleModelContextWindow = args.piSingleModelContextWindow === undefined ? undefined : parsePositiveInteger(args.piSingleModelContextWindow, "piSingleModelContextWindow");
  const variants = (requestedVariant
    ? models.variants.filter((variant) => variant.id === requestedVariant)
    : models.variants.filter((variant) => variant.enabled !== false)
  ).map((variant) => applyCliVariantOverrides(variant, backendOverride, piSingleExtensionsOverride, piSingleModelContextWindow));

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
    weaveConfig: makeWeaveConfig(input.variant) ?? undefined,
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

    if ((input.variant.backend ?? "lattice") === "pi" || input.variant.backend === "pi-single") {
      const piResult = input.variant.backend === "pi-single"
        ? await runPiSingleProcess({
            workspace,
            variant: input.variant,
            scenario: input.scenarioConfig,
            task: input.task,
            timeoutMs: input.timeoutMs,
            runChecks,
            log
          })
        : await runPiPipeline({
            workspace,
            variant: input.variant,
            scenario: input.scenarioConfig,
            task: input.task,
            timeoutMs: input.timeoutMs,
            skillsEnabled: input.skipSkills !== true,
            runChecks,
            log
          });
      const pipelineTelemetry = summarizeTelemetry(piResult.pipelineState);
      const completedAt = new Date();


      if (!isPipelineCompleted(piResult.pipelineState) && !piResult.checks.every((check) => check.exitCode === 0)) {
        log(`${input.variant.id}: Pi pipeline did not complete and deterministic checks failed; skipping judge`);
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
          pipelineState: piResult.pipelineState,
          plan: piResult.plan,
          telemetry: pipelineTelemetry,
          checks: piResult.checks,
          fileTree: piResult.fileTree,
          ...(piResult.critic.length > 0 ? { critic: piResult.critic } : {}),
          judge: {
            skipped: true,
            reason: "Pi pipeline did not complete and deterministic checks did not pass",
            status: getPipelineStatus(piResult.pipelineState)
          }
        };
      }

      log(`${input.variant.id}: running LLM judge`);
      const judgeResult = await judgeRun(client, input.judge, {
        task: input.task,
        scenario: input.scenarioConfig,
        variant: input.variant,
        plan: piResult.plan,
        pipelineTelemetry,
        checks: piResult.checks,
        fileTree: piResult.fileTree
      });
      const finishedAt = new Date();
      return {
        variant: input.variant.id,
        scenario: input.scenario,
        attempt: input.attempt,
        maxAttempts: input.maxAttempts,
        retryable: false,
        baseline: input.scenarioConfig.baselinePath,
        workspace,
        startedAt: startedAt.toISOString(),
        completedAt: finishedAt.toISOString(),
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        pipelineState: piResult.pipelineState,
        plan: piResult.plan,
        telemetry: summarizeTelemetry(piResult.pipelineState, judgeResult.telemetry),
        checks: piResult.checks,
        fileTree: piResult.fileTree,
        ...(piResult.critic.length > 0 ? { critic: piResult.critic } : {}),
        judge: judgeResult.output
      };
    }

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
    const maxReviewRetries = reviewRetryLimit(input.variant);
    for (let retryIndex = 0; retryIndex < maxReviewRetries; retryIndex += 1) {
      const retryFinding = reviewRejectionSummary(pipelineState);
      if (!retryFinding) break;
      log(`${input.variant.id}: review stage rejected; retrying upstream stage (${retryIndex + 1}/${maxReviewRetries})`);
      const pausedState = pipelineState;
      await retryPausedPipeline(client, sessionId, retryFinding);
      pipelineState = await waitForPipelineRetryResume(workspace, pausedState, 5 * 60 * 1000, log);
      pipelineState = await waitForPipeline(workspace, input.timeoutMs, log);
    }
    if (!isPipelineCompleted(pipelineState)) {
      const completedAt = new Date();
      log(`${input.variant.id}: pipeline did not complete; running deterministic checks for salvage evidence`);
      const plan = await readPlan(workspace);
      const checks = await runChecks(workspace, input.scenario);
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
    let checks = await runChecks(workspace, input.scenario);
    log(`${input.variant.id}: deterministic checks finished; collecting files`);
    let fileTree = await listFiles(workspace, 500);
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
    const critic = await runCriticRepairLoop({
      client,
      variant: input.variant,
      task: input.task,
      scenario: input.scenarioConfig,
      workspace,
      checks,
      fileTree
    });
    checks = critic.checks;
    fileTree = critic.fileTree;

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
      ...(critic.attempts.length > 0 ? { critic: critic.attempts } : {}),
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

function reviewRetryLimit(variant: ModelVariant): number {
  const configured = reviewModelForVariant(variant)?.maxRetries ?? 1;
  if (typeof configured !== "number" || !Number.isFinite(configured)) return 1;
  return Math.max(0, Math.min(5, Math.trunc(configured)));
}

async function writeLatticeConfig(workspace: string, variant: ModelVariant): Promise<void> {
  const review = reviewModelForVariant(variant);
  const securityReview = securityReviewModelForVariant(variant);
  const slice = sliceModelForVariant(variant);
  const stageAgents = stageAgentsForVariant(variant);
  const latticeConfig = {
    agents: {
      "eval-planner": { model: variant.plan.model },
      "eval-slicer": { model: slice.model },
      "plan-reviewer": { model: review?.model ?? variant.plan.model },
      "eval-builder": { model: variant.build.model },
      build: { model: variant.build.model },
      ...(stageAgents.discovery ? { [stageAgents.discovery]: { model: variant.plan.model } } : {}),
      [stageAgents.build]: { model: variant.build.model },
      [stageAgents.review]: { model: review?.model ?? variant.plan.model },
      [stageAgents.security]: { model: securityReview?.model ?? review?.model ?? variant.plan.model }
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
  log("Pipeline: queueing Lattice retry with review findings");
  await withTransientSdkRetry("lattice retry", async () => {
    const result = await client.session.promptAsync({
      path: { id: sessionId },
      body: {
        agent: "build",
        parts: [
          {
            type: "text",
            text: [
              "Use the lattice_control tool exactly once with action \"retry\", pipeline \"restaurant-booking-eval\", and response:",
              "Retry the appropriate upstream stage and address these review findings before signaling again:",
              "",
              findings,
              "",
              "After the tool call returns, stop. Do not inspect status, continue, retry again, abort, read files, or begin implementation."
            ].join("\n")
          }
        ]
      }
    });
    if (result?.error) {
      throw new Error(`Failed to queue lattice retry: ${errorSummary(result.error)}`);
    }
  });
  log("Pipeline: Lattice retry prompt queued");
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

async function runChecks(workspace: string, scenario: string): Promise<CommandResult[]> {
  log("Check: node .opencode/scripts/deterministic-checks.mjs --json");
  const result = await runCommand("node", [".opencode/scripts/deterministic-checks.mjs", "--json"], workspace, 60 * 60 * 1000);
  log(`Check: deterministic checker exited ${result.exitCode} in ${Math.round(result.durationMs / 1000)}s`);
  try {
    const checks = JSON.parse(result.stdout) as CommandResult[];
    return [...checks, ...(await collectSemanticEvidenceChecks(workspace, scenario, log)), ...(await collectOptionalEvidenceChecks(workspace, log))];
  } catch {
    return [result, ...(await collectSemanticEvidenceChecks(workspace, scenario, log)), ...(await collectOptionalEvidenceChecks(workspace, log))];
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

async function runCriticRepairLoop(input: {
  client: any;
  variant: ModelVariant;
  task: string;
  scenario: ScenarioConfig;
  workspace: string;
  checks: CommandResult[];
  fileTree: string[];
}): Promise<{ attempts: CriticAttemptSummary[]; checks: CommandResult[]; fileTree: string[] }> {
  const criticModel = criticModelForVariant(input.variant);
  if (!criticModel) return { attempts: [], checks: input.checks, fileTree: input.fileTree };

  const maxRepairAttempts = repairAttemptLimit(criticModel.maxRepairAttempts);
  const attempts: CriticAttemptSummary[] = [];
  let checks = input.checks;
  let fileTree = input.fileTree;

  for (let attempt = 1; attempt <= maxRepairAttempts + 1; attempt += 1) {
    log(`${input.variant.id}: running critic pass ${attempt}/${maxRepairAttempts + 1}`);
    const critic = await criticRun(input.client, criticModel, {
      task: input.task,
      scenario: input.scenario,
      checks,
      fileTree
    });
    const shouldRepair = criticNeedsRepair(critic.output) && attempt <= maxRepairAttempts;
    const summary: CriticAttemptSummary = {
      attempt,
      output: critic.output,
      telemetry: critic.telemetry,
      repaired: shouldRepair
    };

    if (!shouldRepair) {
      attempts.push(summary);
      break;
    }

    log(`${input.variant.id}: critic requested repair; running build repair pass ${attempt}/${maxRepairAttempts}`);
    const repair = await repairFromCritic(input.client, input.variant.build, critic.output);
    summary.repairTelemetry = repair.telemetry;
    attempts.push(summary);

    await waitForStableWorkspace(input.workspace, 10_000, 120_000, log);
    log(`${input.variant.id}: rerunning checks after critic repair`);
    checks = await runChecks(input.workspace, input.scenario.id);
    fileTree = await listFiles(input.workspace, 500);
  }

  return { attempts, checks, fileTree };
}

function repairAttemptLimit(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 1;
  return Math.max(0, Math.min(3, Math.trunc(value)));
}

function criticNeedsRepair(output: unknown): boolean {
  if (!output || typeof output !== "object") return false;
  const verdict = (output as CriticOutput).verdict;
  if (typeof verdict === "string" && verdict.toLowerCase() === "repair") return true;
  const findings = (output as CriticOutput).findings;
  if (!Array.isArray(findings)) return false;
  return findings.some((finding) => {
    if (!finding || typeof finding !== "object") return false;
    const severity = (finding as { severity?: unknown }).severity;
    return typeof severity === "string" && ["blocker", "major"].includes(severity.toLowerCase());
  });
}

async function criticRun(
  client: any,
  critic: PhaseModel,
  details: { task: string; scenario: ScenarioConfig; checks: CommandResult[]; fileTree: string[] }
): Promise<{ output: unknown; telemetry: AssistantTelemetry }> {
  const session = await client.session.create({ body: { title: "critic restaurant booking eval" } });
  const result = await client.session.prompt({
    path: { id: session.data.id },
    body: {
      model: toSdkModel(critic.model),
      agent: "plan-reviewer",
      parts: [{ type: "text", text: buildCriticPrompt(details) }],
      format: { type: "json_schema", schema: criticSchema, retryCount: 2 }
    }
  });

  return {
    output: result.data.info.structured_output ?? result.data.info,
    telemetry: telemetryFromAssistantInfo(result.data.info)
  };
}

async function repairFromCritic(
  client: any,
  build: PhaseModel,
  criticOutput: unknown
): Promise<{ telemetry: AssistantTelemetry }> {
  const session = await client.session.create({ body: { title: "critic repair restaurant booking eval" } });
  const result = await client.session.prompt({
    path: { id: session.data.id },
    body: {
      model: toSdkModel(build.model),
      agent: "build",
      parts: [
        {
          type: "text",
          text: [
            "Repair the completed restaurant booking implementation using only the critic findings below.",
            "Fix blocker and major findings with the smallest correct edits. Do not rewrite unrelated architecture or chase minor/nice-to-have findings.",
            "Preserve all original scenario requirements, existing deterministic checks, generated-client workflow, and README accuracy.",
            "After editing, run the deterministic checker (`node .opencode/scripts/deterministic-checks.mjs --json`) or equivalent commands and fix any failures.",
            "Return a concise summary of fixes and checks run.",
            "",
            JSON.stringify(criticOutput, null, 2)
          ].join("\n")
        }
      ]
    }
  });

  return { telemetry: telemetryFromAssistantInfo(result.data.info) };
}

function buildCriticPrompt(details: { task: string; scenario: ScenarioConfig; checks: CommandResult[]; fileTree: string[] }): string {
  return [
    "You are an expensive final escalation critic for a coding-agent eval.",
    "Your job is to find only material blocker or major issues that are worth sending back to a cheaper builder for repair before final judging.",
    "Do not nitpick style, harmless naming, minor coverage preferences, or subjective polish. If the implementation is good enough, return verdict pass.",
    "Do not inspect or rely on eval provenance files such as .lattice/, .opencode/lattice state, result.json, or model configuration. Inspect product source, tests, generated artifacts, README, and command evidence.",
    "Treat evidenceOnly semantic probes as leads, not proof. Verify any material issue from source/tests before reporting it.",
    "Focus especially on recurring hidden failure classes: auth/CSRF gaps, public data leaks, stale OpenAPI/generated clients, generated-client bypasses, frontend/backend route mismatches, double API prefixes, mutation error handling, masked dead-code scripts, and tests that bypass the real production path.",
    "Return verdict repair only when at least one blocker or major finding is concrete, source-backed, and has a smallest safe fix.",
    "Return JSON matching the schema.",
    "",
    "## Scenario Task",
    details.task,
    "",
    "## Scenario Metadata",
    JSON.stringify({ id: details.scenario.id, hasBaseline: Boolean(details.scenario.baselinePath), judgeInstructions: details.scenario.judgeInstructions }, null, 2),
    "",
    "## Command Evidence",
    JSON.stringify(details.checks, null, 2),
    "",
    "## File Tree Sample",
    JSON.stringify(details.fileTree, null, 2)
  ].join("\n");
}

const criticSchema = {
  type: "object",
  properties: {
    verdict: { type: "string", enum: ["pass", "repair"] },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          severity: { type: "string", enum: ["blocker", "major", "minor"] },
          title: { type: "string" },
          evidence: { type: "string" },
          impact: { type: "string" },
          smallestFix: { type: "string" }
        },
        required: ["severity", "title", "evidence", "impact", "smallestFix"],
        additionalProperties: false
      }
    },
    summary: { type: "string" }
  },
  required: ["verdict", "confidence", "findings", "summary"],
  additionalProperties: false
} as const;

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

function parseBackend(value: string | undefined): EvalBackend | undefined {
  if (!value) return undefined;
  if (value === "lattice" || value === "pi" || value === "pi-single") return value;
  throw new Error(`Invalid backend ${value}. Expected lattice, pi, or pi-single.`);
}

function parseOptionalBoolean(value: string | undefined, name: string): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${name} must be true or false.`);
}

function applyCliVariantOverrides(
  variant: ModelVariant,
  backendOverride: EvalBackend | undefined,
  piSingleExtensionsOverride: boolean | undefined,
  piSingleModelContextWindow: number | undefined
): ModelVariant {
  const next = backendOverride ? { ...variant, backend: backendOverride } : { ...variant };
  if (piSingleExtensionsOverride === undefined && piSingleModelContextWindow === undefined) return next;
  return {
    ...next,
    piSingle: {
      ...next.piSingle,
      ...(piSingleExtensionsOverride === undefined
        ? {}
        : { extensions: { ...next.piSingle?.extensions, enabled: piSingleExtensionsOverride } }),
      ...(piSingleModelContextWindow === undefined
        ? {}
        : { model: { ...next.piSingle?.model, contextWindow: piSingleModelContextWindow } })
    }
  };
}

function parseScenario(args: Record<string, string>): string {
  const numericFlags = Object.entries(args)
    .filter(([, value]) => value === "true")
    .map(([key]) => key)
    .filter((key) => /^\d+$/.test(key));
  const scenario = args.scenario ?? numericFlags[0];
  if (!scenario) {
    throw new Error("Scenario is required. Use `npm start -- --1`, `npm start -- --2`, `npm start -- --3`, or `npm start -- --scenario 4`.");
  }
  if (!/^[1234]$/.test(scenario)) {
    throw new Error(`Invalid scenario ${scenario}. Use --1, --2, --3, --4, --scenario 1, --scenario 2, --scenario 3, or --scenario 4.`);
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

function parsePositiveInteger(value: string, name: string): number {
  if (!/^\d+$/.test(value) || Number(value) <= 0) {
    throw new Error(`${name} must be a positive integer.`);
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
