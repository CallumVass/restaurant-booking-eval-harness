// pattern: Imperative Shell

import {
  AuthStorage,
  createAgentSession,
  DefaultResourceLoader,
  defineTool,
  getAgentDir,
  ModelRegistry,
  SessionManager,
  type Skill
} from "@mariozechner/pi-coding-agent";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Type } from "typebox";
import type { CommandResult } from "./checks.js";
import type { ScenarioConfig } from "./run-types.js";
import {
  criticModelForVariant,
  reviewModelForVariant,
  type ModelVariant,
  type PhaseModel
} from "./pipeline.js";
import type { AssistantTelemetry, TokenTelemetry } from "./telemetry.js";
import { listFiles, waitForStableWorkspace } from "./workspace.js";

export type PiPipelineStage = {
  id: string;
  agent: "pi";
  status: "pending" | "running" | "completed" | "failed";
  startedAt?: string;
  completedAt?: string;
  summary?: string;
  error?: string;
  telemetry?: AssistantTelemetry & {
    configuredModel?: string;
    configuredProvider?: string;
    observedModel?: string;
    observedProvider?: string;
  };
};

export type PiPipelineState = {
  name: "restaurant-booking-eval";
  backend: "pi";
  status: "running" | "completed" | "failed";
  stages: PiPipelineStage[];
  createdAt: string;
  updatedAt: string;
  error?: string;
};

export type PiCriticAttemptSummary = {
  attempt: number;
  output: unknown;
  telemetry: AssistantTelemetry;
  repaired: boolean;
  repairTelemetry?: AssistantTelemetry;
};

export type PiPipelineResult = {
  pipelineState: PiPipelineState;
  plan: string | null;
  checks: CommandResult[];
  fileTree: string[];
  critic: PiCriticAttemptSummary[];
};

type Logger = (message: string) => void;

type CriticOutput = {
  verdict?: unknown;
  findings?: unknown;
};

type RunChecks = (workspace: string, scenario: string) => Promise<CommandResult[]>;

export async function runPiPipeline(input: {
  workspace: string;
  variant: ModelVariant;
  scenario: ScenarioConfig;
  task: string;
  timeoutMs: number;
  skillsEnabled: boolean;
  runChecks: RunChecks;
  log: Logger;
}): Promise<PiPipelineResult> {
  await mkdir(path.join(input.workspace, ".lattice", "pi", "sessions"), { recursive: true });
  await mkdir(path.join(input.workspace, ".lattice", "pi", "stage-outputs"), { recursive: true });
  await mkdir(path.join(input.workspace, ".lattice", "state"), { recursive: true });

  const state = newPiState();
  await writePiState(input.workspace, state);

  try {
    input.log(`${input.variant.id}: Pi plan stage`);
    const planStage = await runPiStage({
      workspace: input.workspace,
      stageId: "pi-plan",
      stageTitle: "Pi plan restaurant booking eval",
      phase: input.variant.plan,
      tools: ["read", "grep", "find", "ls", "write", "edit"],
      prompt: buildPlanPrompt(input.task),
      timeoutMs: stageTimeoutMs(input.timeoutMs),
      skillsEnabled: input.skillsEnabled,
      log: input.log
    });
    state.stages.push(planStage);
    await writeStageOutput(input.workspace, "pi-plan", planStage.summary ?? "");
    await writePiState(input.workspace, markStateRunning(state));

    const plan = await readPlan(input.workspace);

    input.log(`${input.variant.id}: Pi build stage`);
    const buildStage = await runPiStage({
      workspace: input.workspace,
      stageId: "pi-build",
      stageTitle: "Pi build restaurant booking eval",
      phase: input.variant.build,
      tools: ["read", "bash", "edit", "write", "grep", "find", "ls"],
      prompt: buildBuildPrompt(input.task, plan),
      timeoutMs: input.timeoutMs,
      skillsEnabled: input.skillsEnabled,
      log: input.log
    });
    state.stages.push(buildStage);
    await writeStageOutput(input.workspace, "pi-build", buildStage.summary ?? "");
    await writePiState(input.workspace, markStateRunning(state));

    input.log(`${input.variant.id}: Pi build completed; waiting for workspace to settle before checks`);
    await waitForStableWorkspace(input.workspace, 10_000, 120_000, input.log);
    input.log(`${input.variant.id}: running deterministic checks after Pi build`);
    let checks = await input.runChecks(input.workspace, input.scenario.id);
    let fileTree = await listFiles(input.workspace, 500);

    const critic = await runPiCriticRepairLoop({
      workspace: input.workspace,
      variant: input.variant,
      scenario: input.scenario,
      task: input.task,
      plan,
      checks,
      fileTree,
      timeoutMs: input.timeoutMs,
      skillsEnabled: input.skillsEnabled,
      state,
      runChecks: input.runChecks,
      log: input.log
    });
    checks = critic.checks;
    fileTree = critic.fileTree;

    const completed = markStateCompleted(state);
    await writePiState(input.workspace, completed);
    return { pipelineState: completed, plan: await readPlan(input.workspace), checks, fileTree, critic: critic.attempts };
  } catch (error) {
    const failed = markStateFailed(state, errorSummary(error));
    await writePiState(input.workspace, failed);
    input.log(`${input.variant.id}: Pi pipeline failed: ${errorSummary(error)}`);
    const checks = await input.runChecks(input.workspace, input.scenario.id);
    const fileTree = await listFiles(input.workspace, 500);
    return { pipelineState: failed, plan: await readPlan(input.workspace), checks, fileTree, critic: [] };
  }
}

async function runPiCriticRepairLoop(input: {
  workspace: string;
  variant: ModelVariant;
  scenario: ScenarioConfig;
  task: string;
  plan: string | null;
  checks: CommandResult[];
  fileTree: string[];
  timeoutMs: number;
  skillsEnabled: boolean;
  state: PiPipelineState;
  runChecks: RunChecks;
  log: Logger;
}): Promise<{ attempts: PiCriticAttemptSummary[]; checks: CommandResult[]; fileTree: string[] }> {
  const criticPhase = criticModelForVariant(input.variant) ?? reviewModelForVariant(input.variant) ?? input.variant.plan;
  const maxRepairAttempts = repairAttemptLimit(
    criticModelForVariant(input.variant)?.maxRepairAttempts ?? reviewModelForVariant(input.variant)?.maxRetries ?? 1
  );
  const attempts: PiCriticAttemptSummary[] = [];
  let checks = input.checks;
  let fileTree = input.fileTree;

  for (let attempt = 1; attempt <= maxRepairAttempts + 1; attempt += 1) {
    input.log(`${input.variant.id}: Pi critic pass ${attempt}/${maxRepairAttempts + 1}`);
    const critic = await runPiCriticStage({
      workspace: input.workspace,
      stageId: `pi-critic-${attempt}`,
      phase: criticPhase,
      prompt: buildCriticPrompt({
        task: input.task,
        scenario: input.scenario,
        plan: input.plan,
        checks,
        fileTree
      }),
      timeoutMs: stageTimeoutMs(input.timeoutMs),
      skillsEnabled: input.skillsEnabled,
      log: input.log
    });
    input.state.stages.push(critic.stage);
    await writeStageOutput(input.workspace, `pi-critic-${attempt}`, JSON.stringify(critic.output, null, 2));
    await writePiState(input.workspace, markStateRunning(input.state));

    const shouldRepair = criticNeedsRepair(critic.output) && attempt <= maxRepairAttempts;
    const summary: PiCriticAttemptSummary = {
      attempt,
      output: critic.output,
      telemetry: critic.stage.telemetry ?? emptyTelemetry(),
      repaired: shouldRepair
    };

    if (!shouldRepair) {
      attempts.push(summary);
      break;
    }

    input.log(`${input.variant.id}: Pi critic requested repair; running repair ${attempt}/${maxRepairAttempts}`);
    const repair = await runPiStage({
      workspace: input.workspace,
      stageId: `pi-repair-${attempt}`,
      stageTitle: `Pi repair restaurant booking eval ${attempt}`,
      phase: input.variant.build,
      tools: ["read", "bash", "edit", "write", "grep", "find", "ls"],
      prompt: buildRepairPrompt({
        task: input.task,
        plan: input.plan,
        checks,
        criticOutput: critic.output
      }),
      timeoutMs: input.timeoutMs,
      skillsEnabled: input.skillsEnabled,
      log: input.log
    });
    input.state.stages.push(repair);
    await writeStageOutput(input.workspace, `pi-repair-${attempt}`, repair.summary ?? "");
    await writePiState(input.workspace, markStateRunning(input.state));
    summary.repairTelemetry = repair.telemetry ?? emptyTelemetry();
    attempts.push(summary);

    await waitForStableWorkspace(input.workspace, 10_000, 120_000, input.log);
    input.log(`${input.variant.id}: rerunning checks after Pi repair`);
    checks = await input.runChecks(input.workspace, input.scenario.id);
    fileTree = await listFiles(input.workspace, 500);
  }

  return { attempts, checks, fileTree };
}

async function runPiStage(input: {
  workspace: string;
  stageId: string;
  stageTitle: string;
  phase: PhaseModel;
  tools: string[];
  prompt: string;
  timeoutMs: number;
  skillsEnabled: boolean;
  log: Logger;
}): Promise<PiPipelineStage> {
  const startedAt = new Date();
  const session = await createPiSession({
    workspace: input.workspace,
    phase: input.phase,
    title: input.stageTitle,
    tools: input.tools,
    skillsEnabled: input.skillsEnabled
  });

  try {
    await withTimeout(input.stageId, input.timeoutMs, () => session.prompt(input.prompt, { source: "extension" }), () => session.abort());
    const completedAt = new Date();
    return {
      id: input.stageId,
      agent: "pi",
      status: "completed",
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      summary: lastAssistantText(session.messages),
      telemetry: stageTelemetry(session.messages, input.phase.model)
    };
  } catch (error) {
    const completedAt = new Date();
    return {
      id: input.stageId,
      agent: "pi",
      status: "failed",
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      error: errorSummary(error),
      summary: lastAssistantText(session.messages),
      telemetry: stageTelemetry(session.messages, input.phase.model)
    };
  } finally {
    session.dispose();
  }
}

async function runPiCriticStage(input: {
  workspace: string;
  stageId: string;
  phase: PhaseModel;
  prompt: string;
  timeoutMs: number;
  skillsEnabled: boolean;
  log: Logger;
}): Promise<{ stage: PiPipelineStage; output: unknown }> {
  let submitted: unknown;
  const submitCriticResult = defineTool({
    name: "submit_critic_result",
    label: "Submit Critic Result",
    description: "Submit the final structured critic verdict. Call exactly once when review is complete.",
    parameters: Type.Object({
      verdict: Type.Union([Type.Literal("pass"), Type.Literal("repair")]),
      confidence: Type.Number({ minimum: 0, maximum: 1 }),
      findings: Type.Array(
        Type.Object({
          severity: Type.Union([Type.Literal("blocker"), Type.Literal("major"), Type.Literal("minor")]),
          title: Type.String(),
          evidence: Type.String(),
          impact: Type.String(),
          smallestFix: Type.String()
        })
      ),
      summary: Type.String()
    }),
    execute: async (_toolCallId, params) => {
      submitted = params;
      return { content: [{ type: "text", text: "Critic result recorded." }], details: params };
    }
  });

  const startedAt = new Date();
  const session = await createPiSession({
    workspace: input.workspace,
    phase: input.phase,
    title: input.stageId,
    tools: ["read", "bash", "grep", "find", "ls", "submit_critic_result"],
    customTools: [submitCriticResult],
    skillsEnabled: input.skillsEnabled
  });

  try {
    await withTimeout(input.stageId, input.timeoutMs, () => session.prompt(input.prompt, { source: "extension" }), () => session.abort());
    const completedAt = new Date();
    const output = submitted ?? parseJsonObject(lastAssistantText(session.messages));
    return {
      output,
      stage: {
        id: input.stageId,
        agent: "pi",
        status: "completed",
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        summary: typeof output === "object" && output !== null ? JSON.stringify(output) : lastAssistantText(session.messages),
        telemetry: stageTelemetry(session.messages, input.phase.model)
      }
    };
  } catch (error) {
    const completedAt = new Date();
    const output = submitted ?? { verdict: "pass", confidence: 0, findings: [], summary: `Critic failed: ${errorSummary(error)}` };
    return {
      output,
      stage: {
        id: input.stageId,
        agent: "pi",
        status: "failed",
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        error: errorSummary(error),
        summary: lastAssistantText(session.messages),
        telemetry: stageTelemetry(session.messages, input.phase.model)
      }
    };
  } finally {
    session.dispose();
  }
}

async function createPiSession(input: {
  workspace: string;
  phase: PhaseModel;
  title: string;
  tools: string[];
  customTools?: any[];
  skillsEnabled: boolean;
}) {
  const authStorage = AuthStorage.create();
  const modelRegistry = ModelRegistry.create(authStorage);
  const [provider, modelId] = splitModel(input.phase.model);
  const model = modelRegistry.find(provider, modelId);
  if (!model) throw new Error(`Pi model not found: ${input.phase.model}`);

  const resourceLoader = new DefaultResourceLoader({
    cwd: input.workspace,
    agentDir: getAgentDir(),
    noExtensions: true,
    noPromptTemplates: true,
    noThemes: true,
    noContextFiles: true,
    noSkills: !input.skillsEnabled,
    skillsOverride: input.skillsEnabled
      ? (base) => ({
          skills: base.skills.filter((skill: Skill) => path.resolve(skill.filePath).startsWith(path.join(input.workspace, ".agents", "skills"))),
          diagnostics: base.diagnostics
        })
      : undefined
  });
  await resourceLoader.reload();

  const result = await createAgentSession({
    cwd: input.workspace,
    model,
    thinkingLevel: thinkingLevelForPhase(input.phase),
    tools: input.tools,
    customTools: input.customTools as any,
    resourceLoader,
    sessionManager: SessionManager.create(input.workspace, path.join(input.workspace, ".lattice", "pi", "sessions"))
  });

  return result.session;
}

function buildPlanPrompt(task: string): string {
  return [
    "You are the planning stage for an unattended coding-agent eval.",
    "Inspect the existing workspace before planning. Do not implement product changes in this stage.",
    "Write a concise implementation plan to .lattice/plans/restaurant-booking.md.",
    "The plan must cover the scenario requirements, affected surfaces, risks, tests, generated-client/OpenAPI work if relevant, and deterministic verification commands.",
    "Prefer vertical behavior slices, pure domain functions, and thin imperative shells.",
    "Final response: summarize the saved plan path and the highest-risk implementation points.",
    "",
    "## Scenario Task",
    task
  ].join("\n");
}

function buildBuildPrompt(task: string, plan: string | null): string {
  return [
    "You are the build stage for an unattended coding-agent eval.",
    "Implement the scenario task completely in this workspace, following the saved plan unless the codebase proves a plan detail wrong.",
    "If you must deviate from the plan, preserve the scenario task as authoritative and update .lattice/plans/restaurant-booking.md with a short deviation note.",
    "Run `node .opencode/scripts/deterministic-checks.mjs --json` before finishing. Fix failures you can.",
    "Do not inspect eval archive/result files. Work only on the submitted product source, tests, generated artifacts, scripts, and docs.",
    "Final response: concise summary of changes and verification commands run.",
    "",
    "## Scenario Task",
    task,
    "",
    "## Saved Plan",
    plan ?? "No saved plan was found; create/update .lattice/plans/restaurant-booking.md before implementation."
  ].join("\n");
}

function buildCriticPrompt(details: {
  task: string;
  scenario: ScenarioConfig;
  plan: string | null;
  checks: CommandResult[];
  fileTree: string[];
}): string {
  return [
    "You are an independent critic stage for a coding-agent eval.",
    "Inspect source as needed. Do not edit files.",
    "Find only material blocker or major issues worth sending back to the builder for repair. Do not nitpick style or subjective polish.",
    "Treat the scenario task as authoritative. The plan is useful context but cannot weaken scenario requirements.",
    "Treat command evidence and file tree as leads, not proof. Verify material issues from source/tests where practical.",
    "Focus especially on auth/CSRF gaps, public data leaks, stale OpenAPI/generated clients, frontend/backend route mismatches, mutation error handling, masked scripts, and tests that bypass production paths.",
    "Call submit_critic_result exactly once with verdict pass or repair. Use repair only when at least one blocker/major finding is concrete and source-backed.",
    "",
    "## Scenario Task",
    details.task,
    "",
    "## Saved Plan",
    details.plan ?? "No saved plan found.",
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

function buildRepairPrompt(details: { task: string; plan: string | null; checks: CommandResult[]; criticOutput: unknown }): string {
  return [
    "You are the repair stage for an unattended coding-agent eval.",
    "Repair the implementation using only the critic findings below.",
    "Fix blocker and major findings with the smallest correct edits. Do not rewrite unrelated architecture or chase minor/nice-to-have findings.",
    "Preserve all scenario requirements, generated-client workflow, deterministic checks, and README accuracy.",
    "Run `node .opencode/scripts/deterministic-checks.mjs --json` before finishing and fix failures you can.",
    "Update .lattice/plans/restaurant-booking.md only if the repair materially changes the implementation approach.",
    "Final response: concise summary of fixes and verification commands run.",
    "",
    "## Scenario Task",
    details.task,
    "",
    "## Saved Plan",
    details.plan ?? "No saved plan found.",
    "",
    "## Current Command Evidence",
    JSON.stringify(details.checks, null, 2),
    "",
    "## Critic Findings",
    JSON.stringify(details.criticOutput, null, 2)
  ].join("\n");
}

async function readPlan(workspace: string): Promise<string | null> {
  try {
    return await readFile(path.join(workspace, ".lattice", "plans", "restaurant-booking.md"), "utf8");
  } catch {
    return null;
  }
}

async function writeStageOutput(workspace: string, stageId: string, output: string): Promise<void> {
  await writeFile(path.join(workspace, ".lattice", "pi", "stage-outputs", `${stageId}.txt`), output);
}

async function writePiState(workspace: string, state: PiPipelineState): Promise<void> {
  await writeFile(path.join(workspace, ".lattice", "state", "pi-run.json"), `${JSON.stringify(state, null, 2)}\n`);
}

function newPiState(): PiPipelineState {
  const now = new Date().toISOString();
  return { name: "restaurant-booking-eval", backend: "pi", status: "running", stages: [], createdAt: now, updatedAt: now };
}

function markStateRunning(state: PiPipelineState): PiPipelineState {
  state.status = "running";
  state.updatedAt = new Date().toISOString();
  return state;
}

function markStateCompleted(state: PiPipelineState): PiPipelineState {
  state.status = state.stages.some((stage) => stage.status === "failed") ? "failed" : "completed";
  state.updatedAt = new Date().toISOString();
  return state;
}

function markStateFailed(state: PiPipelineState, error: string): PiPipelineState {
  state.status = "failed";
  state.error = error;
  state.updatedAt = new Date().toISOString();
  return state;
}

function stageTelemetry(messages: any[], configuredModel: string): PiPipelineStage["telemetry"] {
  const telemetry = emptyTelemetry();
  let model: string | undefined;
  let provider: string | undefined;

  for (const message of messages) {
    if (message?.role !== "assistant") continue;
    addAssistantMessageTelemetry(telemetry, message);
    if (typeof message.model === "string") model = message.model;
    if (typeof message.provider === "string") provider = message.provider;
  }

  const [configuredProvider, configuredModelId] = splitModel(configuredModel);
  return {
    ...telemetry,
    model,
    provider,
    configuredModel: configuredModelId,
    configuredProvider,
    observedModel: model,
    observedProvider: provider
  };
}

function emptyTelemetry(): AssistantTelemetry {
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

function addAssistantMessageTelemetry(total: TokenTelemetry, message: any): void {
  const usage = message.usage;
  if (!usage || typeof usage !== "object") return;
  total.tokensIn += numberValue(usage.input);
  total.tokensOut += numberValue(usage.output);
  total.tokensCacheRead += numberValue(usage.cacheRead);
  total.tokensCacheWrite += numberValue(usage.cacheWrite);
  total.costUSD += numberValue(usage.cost?.total);
  total.messageCount += 1;
}

function lastAssistantText(messages: any[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role !== "assistant" || !Array.isArray(message.content)) continue;
    const text = message.content
      .filter((part: any) => part?.type === "text" && typeof part.text === "string")
      .map((part: any) => part.text)
      .join("\n")
      .trim();
    if (text) return text;
  }
  return "";
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

function parseJsonObject(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return { verdict: "pass", confidence: 0, findings: [], summary: "No structured critic result was submitted." };
    try {
      return JSON.parse(match[0]);
    } catch {
      return { verdict: "pass", confidence: 0, findings: [], summary: "No valid structured critic result was submitted." };
    }
  }
}

function repairAttemptLimit(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 1;
  return Math.max(0, Math.min(3, Math.trunc(value)));
}

function thinkingLevelForPhase(phase: PhaseModel): any {
  const effort = phase.agentOptions?.reasoningEffort;
  if (typeof effort !== "string") return "medium";
  if (["off", "minimal", "low", "medium", "high", "xhigh"].includes(effort)) return effort;
  return "medium";
}

function stageTimeoutMs(timeoutMs: number): number {
  return Math.max(5 * 60 * 1000, Math.min(timeoutMs, Math.round(timeoutMs / 3)));
}

async function withTimeout<T>(label: string, timeoutMs: number, action: () => Promise<T>, onTimeout: () => Promise<unknown>): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      action(),
      new Promise<T>((_resolve, reject) => {
        timeout = setTimeout(async () => {
          try {
            await onTimeout();
          } finally {
            reject(new Error(`${label} timed out after ${Math.round(timeoutMs / 60000)}m`));
          }
        }, timeoutMs);
      })
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function splitModel(model: string): [string, string] {
  const [provider, ...modelParts] = model.split("/");
  return [provider, modelParts.join("/")];
}

function numberValue(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function errorSummary(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
