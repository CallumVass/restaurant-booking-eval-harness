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

type PlanModel = PhaseModel & {
  mode?: "big" | "sliced";
};

type BuildModel = PhaseModel & {
  mode?: "single" | "sliced";
};

type ReviewModel = PhaseModel & {
  enabled?: boolean;
};

type ModelVariant = {
  id: string;
  enabled?: boolean;
  reason?: string;
  plan: PlanModel;
  build: BuildModel;
  review?: ReviewModel;
};

type PipelineStage = Record<string, unknown>;

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
  estimatedCostUSD?: number;
  messageCount: number;
};

type TelemetrySummary = TokenTelemetry & {
  stages: Array<
    TokenTelemetry & {
      id: string;
      agent?: string;
      model?: string;
      provider?: string;
      configuredModel?: string;
      configuredProvider?: string;
      observedModel?: string;
      observedProvider?: string;
    }
  >;
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
const defaultTimeoutMs = 120 * 60 * 1000;
const publicModelPrices = [
  { match: "gpt-5.5", input: 0.000005, output: 0.00003, cacheRead: 0.0000005 },
  { match: "deepseek-v4-pro", input: 0.000000435, output: 0.00000087, cacheRead: 0.000000003625 },
  { match: "deepseek-v4-flash", input: 0.00000014, output: 0.00000028, cacheRead: 0.0000000028 },
  { match: "mimo-v2.5-pro", input: 0.000001, output: 0.000003, cacheRead: 0.0000002 },
  { match: "mimo-v2.5", input: 0.0000004, output: 0.000002, cacheRead: 0.00000008 }
] as const;
const pinnedSkills = [
  "tdd",
  "clean-ddd-hexagonal",
  "dotnet-backend-patterns",
  "dotnet-10-csharp-14",
  "vercel-react-best-practices",
  "shadcn",
  "tanstack-query-best-practices",
  "orval",
  "functional-core-imperative-shell",
  "vertical-slice-architecture"
];
const maxSliceSlots = 8;
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
  await mkdir(path.join(workspace, ".lattice", "plans", "slices"), { recursive: true });
  await mkdir(path.join(workspace, ".lattice", "summaries"), { recursive: true });

  const packageJsonPath = path.join(workspace, "package.json");
  if (!(await exists(packageJsonPath))) {
    await writeFile(packageJsonPath, `${JSON.stringify({ private: true }, null, 2)}\n`);
  }
  const gitignorePath = path.join(workspace, ".gitignore");
  if (!(await exists(gitignorePath))) {
    await writeFile(
      gitignorePath,
      [
        "node_modules/",
        "bin/",
        "obj/",
        "frontend/node_modules/",
        ".opencode/node_modules/",
        ".opencode/package.json",
        ".opencode/package-lock.json",
        ".opencode/skills/",
        ".agents/skills/",
        ""
      ].join("\n")
    );
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
  const stages = renderStages(variant);
  return `export default ${JSON.stringify({ name: "restaurant-booking-eval", stages }, null, 2)};\n`;
}

function renderStages(variant: ModelVariant): PipelineStage[] {
  const planMode = variant.plan.mode ?? "big";
  const stages: PipelineStage[] = [planStage(planMode)];
  const buildMode = variant.build.mode ?? "single";

  if (buildMode === "single") {
    stages.push(singleBuildStage(planMode));
  } else {
    if (planMode === "big") stages.push(sliceNormalizerStage());
    stages.push(dynamicSliceExpansionStage());
    stages.push(finalIntegrationStage());
  }

  if (reviewModelForVariant(variant)) stages.push(planAdherenceReviewStage(buildMode));
  return stages;
}

function commonSkills() {
  return { pinned: pinnedSkills, dynamic: false };
}

function dynamicSliceSkills() {
  return { pinned: [], dynamic: true, max: 4 };
}

function deterministicPostHook() {
  return { commands: ["node .opencode/scripts/deterministic-checks.mjs"], maxRetries: 1 };
}

function planStage(mode: "big" | "sliced"): PipelineStage {
  const prompt =
    mode === "sliced"
      ? [
          "Create an implementation plan for the restaurant booking eval as a small slice backlog.",
          "Target completion is 30-60 minutes, so keep scope deliberate and avoid line-by-line implementation scripts.",
          "Write a short overview to .lattice/plans/restaurant-booking.md.",
          "Include a ## Global Invariants section in .lattice/plans/restaurant-booking.md for cross-cutting requirements that every slice must preserve. Keep these generic and task-derived, such as security, ownership, API contract, data consistency, generated-client, UX, or regression constraints.",
          "Also create .lattice/plans/slices/manifest.json and one slice file per manifest entry under .lattice/plans/slices/.",
          `The manifest must contain between 1 and ${maxSliceSlots} slices. Choose slice boundaries from the actual task and plan; do not force backend/frontend phases if the scenario is brownfield, security, refactoring, CLI, infrastructure, or anything else.`,
          "Prefer 3-4 behavior slices. Use more than 4 only when the task has clearly independent workstreams that cannot be safely combined within the target completion window.",
          "Use this manifest shape: { \"globalInvariants\": [\"Cross-cutting invariant every slice must preserve\"], \"slices\": [{ \"index\": 1, \"id\": \"short-kebab-id\", \"title\": \"Human title\", \"file\": \".lattice/plans/slices/01-short-kebab-id.md\" }] }.",
          "Slice files must be numbered with their manifest index and include Goal, Global Invariants, Acceptance Criteria, Invariant Checks For This Slice, Required Tests, Verification Commands, Handoff Notes, and Non-Goals.",
          "Make slices behavior-focused and independently executable against the current codebase. Avoid tiny mechanical slices and avoid generic predetermined layers unless the task naturally calls for them.",
          "If an existing app, baseline, project file, package, script, or README is present, plan focused edits against that existing structure. Do not scaffold or replace an existing app unless the task explicitly asks for a rebuild.",
          "Avoid creating one broad integration slice that combines unrelated backend rules, API/client generation, frontend wiring, UX polish, and full verification. Keep integration slices bounded around a single user-visible behavior or invariant risk.",
          "Prefer pure domain functions and thin imperative shells. Use explicit Result-style errors for expected business failures.",
          "If the goal asks for Tailwind/shadcn, TanStack, or OpenAPI-generated clients, dedicate concrete slice acceptance criteria to those choices.",
          "Do not edit any implementation files during planning.",
          "Only call lattice_signal(status: \"complete\") after the overview and all slice files exist and your response summarizes the slice backlog."
        ]
      : [
          "Create a concise implementation plan for the restaurant booking eval.",
          "Target completion is 30-60 minutes, so keep scope deliberate.",
          "Plan vertical behavior slices rather than horizontal layers.",
          "Prefer pure domain functions and thin imperative shells.",
          "Use explicit Result-style errors for expected business failures.",
          "If the goal asks for Tailwind/shadcn, TanStack, or OpenAPI-generated clients, include concrete plan steps for those choices.",
          "Write the plan to .lattice/plans/restaurant-booking.md, then return the same plan in your response.",
          "Do not edit any other files during planning.",
          "Only call lattice_signal(status: \"complete\") after the plan file exists and your response includes the same plan."
        ];

  return {
    id: "plan",
    type: "stage",
    agent: "eval-planner",
    completion: "tool_signal",
    signals: ["complete"],
    fork: false,
    skills: commonSkills(),
    prompt: prompt.join("\n")
  };
}

function singleBuildStage(planMode: "big" | "sliced"): PipelineStage {
  const planReadInstruction =
    planMode === "sliced"
      ? "Before editing, read .lattice/plans/restaurant-booking.md and every .lattice/plans/slices/*.md file, then use the full slice backlog as your implementation checklist."
      : "Before editing, read .lattice/plans/restaurant-booking.md and use it as your implementation checklist.";

  return {
    id: "build",
    type: "stage",
    agent: "build",
    completion: "tool_signal",
    signals: ["complete"],
    fork: true,
    isRewindTarget: true,
    maxRewinds: 1,
    skills: commonSkills(),
    postHook: deterministicPostHook(),
    prompt: [
      "Implement the saved plan for the requested task.",
      planReadInstruction,
      "Follow the plan unless the codebase proves a step is unsafe or obsolete; if you deviate, document why in your final response.",
      "Follow the goal's scenario-specific technology requirements, frontend/client requirements, API requirements, and quality bar.",
      "Work in behavior-focused TDD slices where practical.",
      "Add boundary tests for booking conflicts, invalid party size, invalid times, unknown restaurants, and overlapping reservations.",
      "Use pure domain functions for availability/conflict logic and keep I/O in thin shells.",
      "Keep Clean Architecture/DDD boundaries lightweight. Do not over-engineer CQRS, event sourcing, auth, or persistence.",
      "Prefer in-memory persistence unless another option is quicker and safer.",
      "Include README run instructions.",
      "When the task includes a frontend package, configure deterministic quality scripts in frontend/package.json: build, typecheck, lint, format:check, and deadcode.",
      "Use strict compiler/linter settings; do not leave warnings, unused code, unused exports, or dead code.",
      "The deterministic checker discovers the .NET solution/project and frontend package directory; ensure those artifacts exist and the checks pass from a clean workspace.",
      "Ensure backend build, backend tests, dotnet format verification, frontend install, frontend build, typecheck, lint, format check, and dead-code check all pass.",
      "If property-based testing is a natural fit for pure availability logic, use it; otherwise use focused example-based boundary tests.",
      "Do not call lattice_signal(status: \"complete\") until implementation is finished and you have run the deterministic checker or equivalent commands successfully."
    ].join("\n")
  };
}

function sliceNormalizerStage(): PipelineStage {
  return {
    id: "normalize-slices",
    type: "stage",
    agent: "eval-planner",
    completion: "tool_signal",
    signals: ["complete"],
    fork: false,
    skills: commonSkills(),
    prompt: [
      "Convert the existing big implementation plan into a task-specific slice manifest for fresh-context execution.",
      "Read .lattice/plans/restaurant-booking.md. Do not change its meaning or add new scope.",
      "Extract cross-cutting requirements from the plan and original task into generic global invariants. These should describe behavior every slice must preserve, not implementation steps or scenario-specific hard-coded rules.",
      "Create .lattice/plans/slices/manifest.json and one slice file per manifest entry under .lattice/plans/slices/.",
      `The manifest must contain between 1 and ${maxSliceSlots} slices. Choose slice boundaries from the actual plan and task; do not force restaurant-specific, backend/frontend-specific, or layer-based slices when the scenario calls for something else.`,
      "Prefer 3-4 behavior slices. Use more than 4 only when the plan has clearly independent workstreams that cannot be safely combined within the target completion window.",
      "Use this manifest shape: { \"globalInvariants\": [\"Cross-cutting invariant every slice must preserve\"], \"slices\": [{ \"index\": 1, \"id\": \"short-kebab-id\", \"title\": \"Human title\", \"file\": \".lattice/plans/slices/01-short-kebab-id.md\" }] }.",
      "Slice files must be numbered with their manifest index and include Goal, Global Invariants, Acceptance Criteria, Invariant Checks For This Slice, Required Tests, Verification Commands, Handoff Notes, and Non-Goals.",
      "Each slice file's Global Invariants section must repeat or reference the manifest invariants, and Invariant Checks For This Slice must state what the implementer must inspect or test to avoid violating them.",
      "Keep each slice bounded and executable from a fresh context against the current codebase. Avoid tiny mechanical slices and avoid generic predetermined layers unless the plan naturally calls for them.",
      "If the plan is for an existing app, baseline, project, package, script, or README, preserve that structure and produce slices that edit it. Do not turn the first slice into project scaffolding unless the plan explicitly requires creating a new app.",
      "Avoid creating one broad integration slice that combines unrelated backend rules, API/client generation, frontend wiring, UX polish, and full verification. Split or narrow integration work by user-visible behavior or invariant risk.",
      "Do not edit implementation files. Only create the manifest and slice plan files.",
      "Call lattice_signal(status: \"complete\") only after the manifest and all referenced slice files exist."
    ].join("\n")
  };
}

function dynamicSliceExpansionStage(): PipelineStage {
  return {
    id: "build-slices",
    type: "stage",
    agent: "build",
    completion: "tool_signal",
    signals: ["complete"],
    fork: false,
    skills: commonSkills(),
    expand: {
      from: ".lattice/plans/slices/manifest.json",
      arrayPath: "slices",
      maxItems: maxSliceSlots,
      template: {
        id: "build-slice-{{index}}-{{id}}",
        type: "stage",
        agent: "build",
        completion: "tool_signal",
        signals: ["complete"],
        fork: false,
        skills: dynamicSliceSkills(),
        prompt: [
          "Implement slice {{index}}: {{title}}.",
          "Read {{file}} and treat it as the slice contract.",
          "Global invariants from the manifest apply to every slice:\n{{manifest.globalInvariants}}",
          "Do not signal complete if this slice violates any global invariant. If the slice touches an area affected by an invariant, inspect the related existing behavior and add or update focused tests where practical.",
          "Also inspect the current codebase and any previous .lattice/summaries/slice-*.md files before editing.",
          "Work only on this slice's acceptance criteria and preserve earlier behavior. Do not implement later manifest slices early unless required to keep the current slice coherent.",
          "If a slice contract conflicts with the current codebase or scenario goal, choose the safer implementation and document the deviation in the slice summary.",
          "Use TDD where practical for this slice. Add or update tests required by the slice contract.",
          "Run focused verification for touched areas and any affected global invariants. Do not run the full deterministic checker in every slice unless this slice intentionally changes multiple subsystems or integration boundaries.",
          "If verification is slow or broad, prefer the smallest reliable command set that proves this slice's acceptance criteria and preserves relevant invariants; final integration will run full deterministic checks.",
          "Write .lattice/summaries/slice-{{index}}-{{id}}.md with changes made, checks run, known gaps, and handoff notes.",
          "Do not claim unrelated future slices are done.",
          "Call lattice_signal(status: \"complete\") only when this slice is implemented, verified, and summarized."
        ].join("\n")
      }
    }
  };
}

function finalIntegrationStage(): PipelineStage {
  return {
    id: "final-integration",
    type: "stage",
    agent: "build",
    completion: "tool_signal",
    signals: ["complete"],
    fork: false,
    isRewindTarget: true,
    maxRewinds: 1,
    skills: commonSkills(),
    postHook: deterministicPostHook(),
    prompt: [
      "Perform the final integration pass for the requested task.",
      "Read .lattice/plans/restaurant-booking.md, .lattice/plans/slices/manifest.json, every referenced slice file, and every .lattice/summaries/slice-*.md file.",
      "Start from the slice summaries and current diff, then deep-dive only files and flows related to global invariants, API/client contracts, cross-slice behavior, touched subsystems, or failing checks.",
      "Audit the manifest globalInvariants as first-class requirements across the whole codebase, including legacy endpoints, existing files not touched by a slice, generated artifacts, tests, documentation, and frontend flows.",
      "Fix any global invariant violation even if no individual slice explicitly owned it, and add focused regression coverage where practical.",
      "Inspect the whole codebase for cross-slice integration bugs, stale generated clients or contracts, route/API mismatches, missing validations, broken error handling, weak UX where UI is required, dead code, and missing README instructions.",
      "For user flows that cross backend, generated client, and UI, verify the actual values line up end-to-end. For example, if the backend returns selectable slots or IDs, the UI must submit those returned values without reformatting them into invalid requests.",
      "For date/time or range-based business rules, verify both source and tests cover invalid values, past dates where invalid, outside-hours or out-of-range values, invalid granularity, edge non-overlap, and overlap/conflict behavior as required by the task.",
      "For generated API clients, verify the generated paths, base URL/mutator configuration, request shapes, and response handling match the backend routes. Check for double prefixes, stale checked-in specs, or generated clients returning error responses as successful mutations.",
      "For UI requirements, verify source evidence for required component systems and that the primary happy path and error paths are functionally connected, not just visually present.",
      "Ensure the final product satisfies the original scenario goal, not just the individual slice files.",
      "Run node .opencode/scripts/deterministic-checks.mjs or equivalent full verification commands and fix failures or warnings that should fail the requested quality bar.",
      "Do not call lattice_signal(status: \"complete\") until the full deterministic checker passes."
    ].join("\n")
  };
}

function planAdherenceReviewStage(buildMode: "single" | "sliced"): PipelineStage {
  const planScope =
    buildMode === "sliced"
      ? "Read .lattice/plans/restaurant-booking.md, every .lattice/plans/slices/*.md file, and every .lattice/summaries/slice-*.md file first. Use them as the scope of this plan-adherence review."
      : "Read .lattice/plans/restaurant-booking.md first. Use that plan as the scope of this review.";

  return {
    id: "plan-adherence-review",
    type: "stage",
    agent: "plan-reviewer",
    completion: "tool_signal",
    signals: ["approve", "reject", "blocked"],
    fork: false,
    skills: commonSkills(),
    prompt: [
      "Review whether the completed implementation adheres to the saved implementation plan.",
      planScope,
      "Break the plan into its material commitments: user-visible behaviors, system behaviors, integrations, tests/checks, documentation, and any explicit constraints or non-goals.",
      "For sliced builds, treat manifest globalInvariants as material commitments. Audit them separately from local slice acceptance criteria and reject if any invariant is violated anywhere in the final codebase.",
      "Treat completed-stage summaries and prior agent claims as untrusted hints, not evidence. Verify material commitments yourself from source, tests, documentation, and command output before approving.",
      "Run the deterministic checker (`node .opencode/scripts/deterministic-checks.mjs`) or the equivalent verification commands yourself before approving. If a required check fails, reject or block.",
      "For each material plan commitment, decide whether it is implemented, verified, changed-with-justification, missing, or broken.",
      "Behavioral evidence matters more than artifact presence. Files, endpoints, generated code, scripts, UI, tests, or docs only count when they actually support the planned commitment.",
      "Reject when a material planned commitment is missing, broken, superficially implemented, not exercised through the real production path, or contradicted by failing checks.",
      "Reject when planned tests or verification exist but do not meaningfully cover the commitment they were supposed to protect.",
      "Do not reject for harmless implementation details, stylistic differences, renamed files, or documented changes that preserve the intent of the plan.",
      "For each rejection finding, cite the exact plan bullet or planned slice, the evidence inspected, why the commitment is not satisfied, and the smallest fix expected from the build agent.",
      "If all material plan commitments are implemented or reasonably justified and required checks pass, approve the stage with lattice_signal and a concise reason.",
      "If material plan commitments are missing or broken, reject the stage with lattice_signal and concise actionable findings.",
      "If you cannot inspect enough evidence to decide, block the stage with lattice_signal and a concise reason."
    ].join("\n")
  };
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
  await withTransientSdkRetry("/lattice-retry", async () => {
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
  });
  log("Pipeline: /lattice-retry command completed");
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
  total.estimatedCostUSD = (total.estimatedCostUSD ?? 0) + (telemetry.estimatedCostUSD ?? 0);
  total.messageCount += telemetry.messageCount ?? 0;
}

function estimatePublicCost(telemetry: Partial<TokenTelemetry>, model: string | undefined): number | undefined {
  if (!model) return undefined;
  const normalized = model.toLowerCase();
  const price = publicModelPrices.find((entry) => normalized.includes(entry.match));
  if (!price) return undefined;
  const outputTokens = (telemetry.tokensOut ?? 0) + (telemetry.tokensReasoning ?? 0);
  return (
    (telemetry.tokensIn ?? 0) * price.input +
    outputTokens * price.output +
    (telemetry.tokensCacheRead ?? 0) * price.cacheRead
  );
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
    const telemetryRecord = telemetry as Partial<TokenTelemetry> & {
      model?: unknown;
      provider?: unknown;
      configuredModel?: unknown;
      configuredProvider?: unknown;
      observedModel?: unknown;
      observedProvider?: unknown;
    };
    const model = typeof telemetryRecord.model === "string" ? telemetryRecord.model : undefined;
    const observedModel = typeof telemetryRecord.observedModel === "string" ? telemetryRecord.observedModel : undefined;
    const estimatedCostUSD = estimatePublicCost(telemetryRecord, observedModel ?? model);
    return [
      {
        id: typeof stageRecord.id === "string" ? stageRecord.id : "unknown",
        agent: typeof stageRecord.agent === "string" ? stageRecord.agent : undefined,
        model,
        provider: typeof telemetryRecord.provider === "string" ? telemetryRecord.provider : undefined,
        configuredModel: typeof telemetryRecord.configuredModel === "string" ? telemetryRecord.configuredModel : undefined,
        configuredProvider:
          typeof telemetryRecord.configuredProvider === "string" ? telemetryRecord.configuredProvider : undefined,
        observedModel,
        observedProvider: typeof telemetryRecord.observedProvider === "string" ? telemetryRecord.observedProvider : undefined,
        tokensIn: telemetryRecord.tokensIn ?? 0,
        tokensOut: telemetryRecord.tokensOut ?? 0,
        tokensReasoning: telemetryRecord.tokensReasoning ?? 0,
        tokensCacheRead: telemetryRecord.tokensCacheRead ?? 0,
        tokensCacheWrite: telemetryRecord.tokensCacheWrite ?? 0,
        costUSD: telemetryRecord.costUSD ?? 0,
        ...(estimatedCostUSD !== undefined ? { estimatedCostUSD } : {}),
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
  const telemetry = {
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
  const estimatedCostUSD = estimatePublicCost(telemetry, telemetry.model);
  return { ...telemetry, ...(estimatedCostUSD !== undefined ? { estimatedCostUSD } : {}) };
}

async function listFiles(directory: string, limit: number): Promise<string[]> {
  const files: string[] = [];

  async function walk(current: string) {
    if (files.length >= limit) return;
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (files.length >= limit) return;
      if ([".git", "node_modules", "bin", "obj", ".lattice", ".opencode", "result.json"].includes(entry.name)) continue;
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
