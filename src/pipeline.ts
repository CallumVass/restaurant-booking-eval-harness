// pattern: Functional Core

import type { SkillsConfig, StageDefinition } from "@callumvass/lattice";

export type PhaseModel = {
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

export type ModelVariant = {
  id: string;
  enabled?: boolean;
  reason?: string;
  plan: PlanModel;
  build: BuildModel;
  review?: ReviewModel;
};

type PipelineStage = StageDefinition;

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
const requirementPrecedence =
  "Requirement precedence: the user's task is authoritative. Explicit new requested behavior and constraints from the original goal or change request override saved-plan preferences, existing behavior, existing APIs/contracts, compatibility concerns, architecture/pattern preferences, preservation notes, and implementation preferences when they conflict. Security, privacy, authorization, data ownership, data integrity, and correctness requirements are especially high priority. Preserve only legacy behavior, contracts, APIs, data shapes, UI flows, and patterns that remain compatible with the new requirements, unless the user explicitly says the old behavior must remain in that exact conflict. If satisfying the task requires a breaking API/contract/schema/behavior change, make the breaking change and update affected callers, generated artifacts, tests, and docs instead of preserving an incompatible legacy surface. Non-goals and preservation notes may not remove, weaken, or create exceptions to any higher-priority requirement.";
const surfaceInventoryInstruction =
  "Before slicing or verifying, inventory all affected surfaces for cross-cutting requirements: existing and new endpoints/routes/commands, state-changing operations, data-returning operations, persistence models, generated specs/clients, frontend flows, scripts, docs, and tests. A requirement is not covered until every surface that can satisfy or violate it is accounted for by an acceptance criterion, invariant check, test, or justified manual verification.";
const adversarialRequirementInstruction =
  "For negative or boundary requirements (for example: must not, only, cannot, prevent, authenticated, authorized, scoped, protected, no external, no storage, invalid, duplicate, missing, forbidden), require adversarial verification through production paths where practical. Positive-path evidence alone is not enough.";
const contextPackInstruction =
  "Create a progressive-disclosure context pack under .lattice/context/. It must include index.json plus one small file per material requirement under .lattice/context/requirements/R-###.md, one small file per global invariant under .lattice/context/invariants/GI-###.md, and reusable rule files under .lattice/context/rules/ for precedence, surface-inventory, adversarial-verification, and focused-verification. index.json must be raw valid JSON only, with no Markdown, prose, or code fences. Use this shape: { \"requirements\": { \"R-001\": { \"file\": \".lattice/context/requirements/R-001.md\" } }, \"globalInvariants\": { \"GI-001\": { \"file\": \".lattice/context/invariants/GI-001.md\" } }, \"rules\": { \"precedence\": { \"file\": \".lattice/context/rules/precedence.md\" } }, \"slices\": { \"slice-id\": { \"file\": \".lattice/plans/slices/01-slice-id.md\", \"requirements\": [\"R-001\"], \"globalInvariants\": [\"GI-001\"], \"rules\": [\"precedence\"] } } }. It must map every requirement ID, global invariant ID, rule ID, and slice ID to its small context file references. Keep manifest.json as the full audit source, but make slice execution depend on the small context files relevant to that slice.";

export function renderPipelineTemplate(variant: ModelVariant): string {
  const stages = renderStages(variant);
  return `export default ${JSON.stringify({ name: "restaurant-booking-eval", stages }, null, 2)};\n`;
}

export function renderStages(variant: ModelVariant): PipelineStage[] {
  const planMode = variant.plan.mode ?? "big";
  const stages: PipelineStage[] = [planStage(planMode)];
  const buildMode = variant.build.mode ?? "single";

  if (buildMode === "single") {
    stages.push(singleBuildStage(planMode));
  } else {
    if (planMode === "big") stages.push(sliceNormalizerStage());
    stages.push(slicePlanReviewStage(planMode));
    stages.push(dynamicSliceExpansionStage());
    stages.push(finalIntegrationStage());
  }

  if (reviewModelForVariant(variant) && buildMode === "single") {
    stages.push(planAdherenceReviewStage(buildMode));
  }
  return stages;
}

export function reviewModelForVariant(variant: ModelVariant): ReviewModel | undefined {
  if (!variant.review || variant.review.enabled === false) return undefined;
  return variant.review;
}

function commonSkills(): SkillsConfig {
  return { pinned: pinnedSkills, dynamic: false, max: 4 };
}

function dynamicSliceSkills(): SkillsConfig {
  return { pinned: [], dynamic: true, max: 4 };
}

type StageWithDefaultableFields = Omit<PipelineStage, "pauseAfter" | "isRewindTarget"> &
  Partial<Pick<PipelineStage, "pauseAfter" | "isRewindTarget">>;

function withStageDefaults(stage: StageWithDefaultableFields): PipelineStage {
  return { pauseAfter: false, isRewindTarget: false, ...stage };
}

function planStage(mode: "big" | "sliced"): PipelineStage {
  const prompt =
    mode === "sliced"
      ? [
          "Create an implementation plan for the restaurant booking eval as a small slice backlog.",
          "Target completion is 30-60 minutes, so keep scope deliberate and avoid line-by-line implementation scripts.",
          "Write a short overview to .lattice/plans/restaurant-booking.md.",
          "Include a ## Requirement Ledger section in .lattice/plans/restaurant-booking.md. Extract every material requirement from the original goal into stable IDs with source, category, priority, exact requirement text, and expected verification evidence.",
          "Include a ## Global Invariants section in .lattice/plans/restaurant-booking.md for cross-cutting requirements that every slice must preserve. Keep these task-derived and concrete enough to verify, such as security, ownership, API contract, data consistency, generated-client, UX, or regression constraints. Do not generalize away explicit endpoint names, user roles, data ownership rules, error mappings, test obligations, or negative requirements from the goal.",
          "Also create .lattice/plans/slices/manifest.json and one slice file per manifest entry under .lattice/plans/slices/.",
          contextPackInstruction,
          `The manifest must contain between 1 and ${maxSliceSlots} slices. Choose slice boundaries from the actual task and plan; do not force backend/frontend phases if the scenario is brownfield, security, refactoring, CLI, infrastructure, or anything else.`,
          "Prefer the fewest slices that preserve independent implementation and verification quality. Small tasks are usually 3-4 slices; full-stack or cross-cutting work may need 4-6 slices. Use more than 6 only when clearly justified by the task.",
          "Do not create a standalone documentation, cleanup, or final quality-gate slice unless the task is primarily documentation-only. Fold README/docs/script updates into the behavior slice that creates or changes that behavior; final-integration owns final cleanup and full deterministic checks.",
          "Use this manifest shape: { \"requirements\": [{ \"id\": \"R-001\", \"source\": \"original-goal\", \"category\": \"security|api|ui|tests|docs|quality|architecture|data\", \"priority\": \"must|should|could\", \"text\": \"Concrete requirement text\", \"verification\": \"Required evidence\" }], \"globalInvariants\": [{ \"id\": \"GI-001\", \"sourceRequirementIds\": [\"R-001\"], \"text\": \"Cross-cutting invariant every slice must preserve\", \"verification\": \"How to prove it\" }], \"slices\": [{ \"index\": 1, \"id\": \"short-kebab-id\", \"title\": \"Human title\", \"file\": \".lattice/plans/slices/01-short-kebab-id.md\", \"covers\": [\"R-001\"], \"preserves\": [\"GI-001\"] }] }.",
          "Slice files must be numbered with their manifest index and include Goal, Context References, Acceptance Criteria, Invariant Checks For This Slice, Required Tests, Focused Verification Commands, Handoff Notes, and Non-Goals. Context References must list only the requirement files, invariant files, and rule files this slice should read.",
          "Each slice acceptance criterion and required test must cite the requirement IDs it covers. If a requirement is intentionally verified manually instead of by an automated test, say why and where that evidence must appear.",
          requirementPrecedence,
          surfaceInventoryInstruction,
          adversarialRequirementInstruction,
          "If preserving an existing surface could conflict with a new requirement, the plan must call out the conflict and resolve it explicitly in favor of the task rather than silently preserving the old behavior. Do not avoid a required task change merely because it breaks an existing contract; plan the contract change and its dependent updates.",
          "Before signalling complete, self-audit the slice backlog: every must/should requirement is covered by at least one slice; every global invariant is preserved by every slice unless clearly irrelevant and justified; every slice file references its relevant context files; no slice acceptance criteria, invariant check, handoff note, or non-goal contradicts or narrows a requirement or global invariant.",
          "Make slices behavior-focused and independently executable against the current codebase. Avoid tiny mechanical slices and avoid generic predetermined layers unless the task naturally calls for them.",
          "If an existing app, baseline, project file, package, script, or README is present, plan focused edits against that existing structure. Do not scaffold or replace an existing app unless the task explicitly asks for a rebuild.",
          "Do not merge unrelated frontend flows, generated client work, backend rules, security checks, and test coverage into one oversized slice just to reduce count. Keep integration slices bounded around coherent user-visible behavior or invariant risk.",
          "Prefer pure domain functions and thin imperative shells. Use explicit Result-style errors for expected business failures.",
          "If the goal asks for Tailwind/shadcn, TanStack, or OpenAPI-generated clients, dedicate concrete slice acceptance criteria to those choices.",
          "Do not edit any implementation files during planning.",
          "Only call lattice_signal(status: \"complete\") after the overview and all slice files exist and your response summarizes the slice backlog."
        ]
      : [
          "Create a concise implementation plan for the restaurant booking eval.",
          "Target completion is 30-60 minutes, so keep scope deliberate.",
          "Plan vertical behavior slices rather than horizontal layers.",
          requirementPrecedence,
          surfaceInventoryInstruction,
          adversarialRequirementInstruction,
          "Prefer pure domain functions and thin imperative shells.",
          "Use explicit Result-style errors for expected business failures.",
          "If the goal asks for Tailwind/shadcn, TanStack, or OpenAPI-generated clients, include concrete plan steps for those choices.",
          "Write the plan to .lattice/plans/restaurant-booking.md, then return the same plan in your response.",
          "Do not edit any other files during planning.",
          "Only call lattice_signal(status: \"complete\") after the plan file exists and your response includes the same plan."
        ];

  return withStageDefaults({
    id: "plan",
    type: "stage",
    agent: "eval-planner",
    completion: "signal",
    signals: ["complete", "blocked"],
    context: "isolated",
    isRewindTarget: mode === "sliced",
    maxRewinds: mode === "sliced" ? 1 : undefined,
    skills: commonSkills(),
    prompt: prompt.join("\n")
  });
}

function singleBuildStage(planMode: "big" | "sliced"): PipelineStage {
  const planReadInstruction =
    planMode === "sliced"
      ? "Before editing, read .lattice/plans/restaurant-booking.md and every .lattice/plans/slices/*.md file, then use the full slice backlog as your implementation checklist."
      : "Before editing, read .lattice/plans/restaurant-booking.md and use it as your implementation checklist.";

  return withStageDefaults({
    id: "build",
    type: "stage",
    agent: "build",
    completion: "signal",
    signals: ["complete", "blocked"],
    context: "isolated",
    isRewindTarget: true,
    maxRewinds: 1,
    skills: commonSkills(),
    prompt: [
      "Implement the saved plan for the requested task.",
      planReadInstruction,
      "When sliced plan files exist, use the requirement ledger and globalInvariants as the authoritative cross-cutting contract; original goal requirements outrank local slice wording or preserve-existing notes.",
      requirementPrecedence,
      surfaceInventoryInstruction,
      adversarialRequirementInstruction,
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
  });
}

function sliceNormalizerStage(): PipelineStage {
  return withStageDefaults({
    id: "normalize-slices",
    type: "stage",
    agent: "eval-planner",
    completion: "signal",
    signals: ["complete", "blocked"],
    context: "isolated",
    isRewindTarget: true,
    maxRewinds: 1,
    skills: commonSkills(),
    prompt: [
      "Convert the existing big implementation plan into a task-specific slice manifest for fresh-context execution.",
      "Read .lattice/plans/restaurant-booking.md and the original task in ## Goal. Do not change the meaning of either source or add new scope.",
      "Create a requirement ledger before slicing. Extract every material requirement from the original task and saved plan into stable IDs with source, category, priority, exact requirement text, and expected verification evidence.",
      requirementPrecedence,
      surfaceInventoryInstruction,
      adversarialRequirementInstruction,
      contextPackInstruction,
      "If the original goal or saved plan asks to preserve existing behavior, apply that only to compatible behavior. When a new requirement conflicts with a legacy endpoint, API contract, generated client, UI flow, data shape, script, architecture pattern, or workflow, the new requirement wins unless the user explicitly preserved that exact legacy behavior. Add a Handoff Notes entry explaining each such conflict and resolution, including any breaking change and required dependent updates.",
      "Extract cross-cutting requirements from the requirement ledger into globalInvariants. These must be task-derived and concrete enough to verify. Do not generalize away explicit endpoint names, user roles, data ownership rules, security boundaries, persistence guarantees, error mappings, generated-client requirements, test obligations, or negative requirements from the goal.",
      "Create .lattice/plans/slices/manifest.json and one slice file per manifest entry under .lattice/plans/slices/.",
      `The manifest must contain between 1 and ${maxSliceSlots} slices. Choose slice boundaries from the actual plan and task; do not force restaurant-specific, backend/frontend-specific, or layer-based slices when the scenario calls for something else.`,
      "Prefer the fewest slices that preserve independent implementation and verification quality. Small tasks are usually 3-4 slices; full-stack or cross-cutting work may need 4-6 slices. Use more than 6 only when clearly justified by the plan.",
      "Do not create a standalone documentation, cleanup, or final quality-gate slice unless the task is primarily documentation-only. Fold README/docs/script updates into the behavior slice that creates or changes that behavior; final-integration owns final cleanup and full deterministic checks.",
      "Use this manifest shape: { \"requirements\": [{ \"id\": \"R-001\", \"source\": \"original-goal|saved-plan\", \"category\": \"security|api|ui|tests|docs|quality|architecture|data\", \"priority\": \"must|should|could\", \"text\": \"Concrete requirement text\", \"verification\": \"Required evidence\" }], \"globalInvariants\": [{ \"id\": \"GI-001\", \"sourceRequirementIds\": [\"R-001\"], \"text\": \"Cross-cutting invariant every slice must preserve\", \"verification\": \"How to prove it\" }], \"slices\": [{ \"index\": 1, \"id\": \"short-kebab-id\", \"title\": \"Human title\", \"file\": \".lattice/plans/slices/01-short-kebab-id.md\", \"covers\": [\"R-001\"], \"preserves\": [\"GI-001\"] }] }.",
      "Slice files must be numbered with their manifest index and include Goal, Context References, Acceptance Criteria, Invariant Checks For This Slice, Required Tests, Focused Verification Commands, Handoff Notes, and Non-Goals. Context References must list only the requirement files, invariant files, and rule files this slice should read.",
      "Do not repeat the full requirement ledger or full global invariant text in every slice file. Use Context References to point to the small .lattice/context files instead, and include only slice-specific interpretation or conflict notes.",
      "Each slice acceptance criterion and required test must cite the requirement IDs it covers. If a requirement is intentionally verified manually instead of by an automated test, state why and where that evidence must appear.",
      "No slice may narrow, contradict, or add an exception to a requirement or global invariant unless that exception is explicitly present in a higher-priority source. If the saved plan contradicts the original goal, preserve the original goal and mention the corrected interpretation in the slice handoff notes.",
      "Before signalling complete, self-audit the manifest and slice files: every must/should requirement is covered by at least one slice; every slice preserves every global invariant unless clearly irrelevant and justified; every test requirement has an executable test contract or a justified manual verification; no Non-Goals section removes required behavior.",
      "Keep each slice bounded and executable from a fresh context against the current codebase. Avoid tiny mechanical slices and avoid generic predetermined layers unless the plan naturally calls for them.",
      "If the plan is for an existing app, baseline, project, package, script, or README, preserve that structure and produce slices that edit it. Do not turn the first slice into project scaffolding unless the plan explicitly requires creating a new app.",
      "Do not merge unrelated frontend flows, generated client work, backend rules, security checks, and test coverage into one oversized slice just to reduce count. Split or narrow integration work by coherent user-visible behavior or invariant risk.",
      "Do not edit implementation files. Only create the manifest and slice plan files.",
      "Call lattice_signal(status: \"complete\") only after the manifest and all referenced slice files exist."
    ].join("\n")
  });
}

function slicePlanReviewStage(planMode: "big" | "sliced"): PipelineStage {
  const producer = planMode === "big" ? "normalize-slices" : "plan";

  return withStageDefaults({
    id: "slice-plan-review",
    type: "stage",
    agent: "plan-reviewer",
    completion: "signal",
    signals: ["pass", "fail", "blocked"],
    context: "isolated",
    skills: commonSkills(),
    prompt: [
      "Review the sliced plan before any implementation begins.",
      "Read the original task in ## Goal, .lattice/plans/restaurant-booking.md, .lattice/plans/slices/manifest.json, .lattice/context/index.json, every referenced .lattice/plans/slices/*.md file, and the context files referenced by each slice.",
      `The slice artifacts were produced by the ${producer} stage; treat prior summaries as untrusted hints, not evidence.`,
      "Pass only if the sliced plan is a faithful, traceable decomposition of the original task and saved plan.",
      "Verify the manifest has a requirement ledger (`requirements`), `globalInvariants`, and `slices` with `covers` and `preserves` references. Fail if the manifest uses only vague prose without source-linked requirements.",
      "Verify .lattice/context/index.json exists and maps each requirement ID, invariant ID, and slice ID to its small context file. Verify every covered requirement and preserved invariant referenced by a slice has a corresponding context file.",
      "Verify every must/should requirement from the original task and saved plan appears in the ledger, has a source, category, priority, concrete text, and expected verification evidence.",
      requirementPrecedence,
      "Fail if any preservation note, non-goal, slice criterion, or handoff note weakens a new requested behavior or constraint, especially for security, privacy, authorization, data ownership, data integrity, or correctness.",
      "Verify the sliced plan inventories all affected surfaces for cross-cutting requirements. Fail if it marks a requirement covered by one new endpoint/component while ignoring legacy endpoints, UI flows, generated contracts, persistence paths, or other existing surfaces that can violate the same requirement.",
      "Verify negative/boundary requirements have adversarial acceptance criteria or tests through production paths where practical. Fail if a must-not/protected/scoped/no/invalid requirement is covered only by happy-path evidence.",
      "Fail if a non-documentation task has a standalone docs/cleanup/final quality-gate slice instead of folding docs into behavior slices and reserving final cleanup/full checks for final-integration.",
      "Verify every must/should requirement is covered by at least one slice and every global invariant is preserved by every slice unless irrelevance is explicit and safe.",
      "Verify slice files use progressive disclosure: they should reference relevant context files instead of copying the full manifest, full requirement ledger, or unrelated slice details.",
      "Verify slice acceptance criteria and required tests cite requirement IDs, and that requested tests are specific enough to prove behavior through real production paths where practical.",
      "Fail if any slice narrows a cross-cutting requirement into only one endpoint/component/path when the original task requires a broader class of behavior.",
      "Fail if any Non-Goals section removes required behavior, any manual-only verification replaces an explicitly requested automated test without justification, or any slice plan depends on future slices to fix an invariant violation created now.",
      "If failing, cite the exact original requirement or saved-plan line/section, the conflicting or missing manifest/slice evidence, and the smallest correction expected from the slicing stage.",
      "If the sliced plan is faithful and verifiable, pass with a concise reason. If required files cannot be inspected, block with a concise reason."
    ].join("\n")
  });
}

function dynamicSliceExpansionStage(): PipelineStage {
  return withStageDefaults({
    id: "build-slices",
    type: "stage",
    agent: "build",
    completion: "signal",
    signals: ["complete", "blocked"],
    context: "isolated",
    skills: commonSkills(),
    expand: {
      from: ".lattice/plans/slices/manifest.json",
      arrayPath: "slices",
      maxItems: maxSliceSlots,
      template: withStageDefaults({
        id: "build-slice-{{index}}-{{id}}",
        type: "stage",
        agent: "build",
        completion: "signal",
        signals: ["complete", "blocked"],
        context: "isolated",
        skills: dynamicSliceSkills(),
        prompt: [
          "Implement slice {{index}}: {{title}}.",
          "Use progressive disclosure. Read .lattice/context/index.json, {{file}}, and the specific requirement, invariant, and rule context files referenced by {{file}} for covered IDs {{covers}} and preserved IDs {{preserves}}. Do not read unrelated requirements, invariants, slice files, summaries, or the full manifest unless needed to resolve a conflict or missing context reference.",
          "If .lattice/context/ is missing or incomplete, fall back to .lattice/plans/slices/manifest.json and document the fallback in the slice summary.",
          "Treat {{file}} as the local work package, but the original goal, referenced requirement files, referenced invariant files, and rule files outrank any local slice wording.",
          "Do not signal complete if this slice violates any global invariant or weakens any original requirement. If local slice text conflicts with the original goal, requirement ledger, or globalInvariants, follow the higher-priority requirement and document the correction in the slice summary.",
          requirementPrecedence,
          "If this slice preserves an existing endpoint, command, UI flow, data shape, generated contract, architecture pattern, or workflow, verify that preserved behavior remains compatible with every new requirement it touches. Do not keep incompatible legacy behavior or contracts just because the slice says to preserve existing behavior. If the task requires a breaking change, make it and update dependent code/specs/tests/docs.",
          adversarialRequirementInstruction,
          "If the slice touches an area affected by an invariant, inspect the related existing behavior and add or update focused tests where practical.",
          "Work only on this slice's acceptance criteria and preserve earlier behavior. Do not implement later manifest slices early unless required to keep the current slice coherent.",
          "Preserve earlier behavior only when it does not conflict with a higher-priority requirement. If a slice contract conflicts with the current codebase or scenario goal, choose the safer implementation and document the deviation in the slice summary.",
          "Use TDD where practical for this slice. Add or update tests required by the slice contract.",
          "Run only focused verification for touched areas, covered requirement IDs, and affected global invariants. Do not run the full deterministic checker in slice stages.",
          "Avoid broad final-gate command suites in slice stages, such as full backend + frontend quality pipelines, unless no narrower reliable command exists; if you must run a broad command, explain why in the slice summary. Final integration owns the full deterministic checks.",
          "Write .lattice/summaries/slice-{{index}}-{{id}}.md with changes made, requirement IDs covered, invariant checks performed, checks run, known gaps, and handoff notes.",
          "Do not claim unrelated future slices are done.",
          "Call lattice_signal(status: \"complete\") only when this slice is implemented, verified, and summarized."
        ].join("\n")
      })
    }
  });
}

function finalIntegrationStage(): PipelineStage {
  return withStageDefaults({
    id: "final-integration",
    type: "stage",
    agent: "build",
    completion: "signal",
    signals: ["complete", "blocked"],
    context: "isolated",
    isRewindTarget: true,
    maxRewinds: 1,
    skills: commonSkills(),
    prompt: [
      "Perform the final integration pass for the requested task.",
      "Read .lattice/plans/restaurant-booking.md, .lattice/plans/slices/manifest.json, .lattice/context/index.json when present, every referenced slice file, and every .lattice/summaries/slice-*.md file.",
      "Start from the manifest requirement ledger, globalInvariants, slice summaries, and current diff, then deep-dive files and flows related to requirement coverage, invariant preservation, API/client contracts, cross-slice behavior, touched subsystems, or failing checks.",
      "Audit the manifest requirements and globalInvariants as first-class requirements across the whole codebase, including legacy endpoints, existing files not touched by a slice, generated artifacts, tests, documentation, and frontend flows.",
      requirementPrecedence,
      surfaceInventoryInstruction,
      adversarialRequirementInstruction,
      "When verifying cross-cutting behavior, enumerate every surface that can violate it and inspect or test those surfaces. Examples: every state-changing operation for mutation-safety requirements; every data-returning operation for privacy/ownership requirements; every generated/openapi path for API contract requirements. Fix incompatible preserved legacy behavior rather than treating it as exempt.",
      "Fix any requirement or global invariant violation even if no individual slice explicitly owned it, and add focused regression coverage where practical.",
      "For every must/should requirement in the manifest, verify implemented evidence exists or document and fix the gap. If the manifest omitted a material requirement from the original goal, restore that requirement now and implement the smallest correct fix.",
      "Inspect the whole codebase for cross-slice integration bugs, stale generated clients or contracts, route/API mismatches, missing validations, broken error handling, weak UX where UI is required, dead code, and missing README instructions.",
      "For user flows that cross backend, generated client, and UI, verify the actual values line up end-to-end. For example, if the backend returns selectable slots or IDs, the UI must submit those returned values without reformatting them into invalid requests.",
      "For date/time or range-based business rules, verify both source and tests cover invalid values, past dates where invalid, outside-hours or out-of-range values, invalid granularity, edge non-overlap, and overlap/conflict behavior as required by the task.",
      "For generated API clients, verify the generated paths, base URL/mutator configuration, request shapes, and response handling match the backend routes. Check for double prefixes, stale checked-in specs, or generated clients returning error responses as successful mutations.",
      "For UI requirements, verify source evidence for required component systems and that the primary happy path and error paths are functionally connected, not just visually present.",
      "Complete any remaining README/docs/script cleanup here; ordinary feature runs should not rely on a standalone documentation or cleanup slice.",
      "Ensure the final product satisfies the original scenario goal and manifest requirement ledger, not just the individual slice files.",
      "Write or update final slice summaries only if needed to document corrected requirement coverage or invariant fixes.",
      "Run node .opencode/scripts/deterministic-checks.mjs or equivalent full verification commands and fix failures or warnings that should fail the requested quality bar.",
      "Do not call lattice_signal(status: \"complete\") until the full deterministic checker passes."
    ].join("\n")
  });
}

function planAdherenceReviewStage(buildMode: "single" | "sliced"): PipelineStage {
  const planScope =
    buildMode === "sliced"
      ? "Read .lattice/plans/restaurant-booking.md, .lattice/plans/slices/manifest.json, every .lattice/plans/slices/*.md file, and every .lattice/summaries/slice-*.md file first. Use the original goal plus the requirement ledger, globalInvariants, and slices as the scope of this plan-adherence review."
      : "Read .lattice/plans/restaurant-booking.md first. Use that plan as the scope of this review.";

  return withStageDefaults({
    id: "plan-adherence-review",
    type: "stage",
    agent: "plan-reviewer",
    completion: "signal",
    signals: ["pass", "fail", "blocked"],
    context: "isolated",
    skills: commonSkills(),
    prompt: [
      "Review whether the completed implementation adheres to the saved implementation plan.",
      planScope,
      "Break the original goal, saved plan, and manifest requirement ledger into material commitments: user-visible behaviors, system behaviors, integrations, tests/checks, documentation, and any explicit constraints or non-goals.",
      "For sliced builds, treat manifest requirements and globalInvariants as material commitments. Audit them separately from local slice acceptance criteria and fail if any requirement or invariant is violated anywhere in the final codebase.",
      requirementPrecedence,
      surfaceInventoryInstruction,
      adversarialRequirementInstruction,
      "Fail if local slice wording, non-goals, or preservation notes caused a new requested behavior or constraint to be weakened, skipped, or treated as an exception for preserved legacy behavior.",
      "If the manifest requirement ledger omitted a material original-goal requirement, still review against the original goal and fail with the missing ledger entry as part of the finding.",
      "Treat completed-stage summaries and prior agent claims as untrusted hints, not evidence. Verify material commitments yourself from source, tests, documentation, and command output before passing.",
      "Run the deterministic checker (`node .opencode/scripts/deterministic-checks.mjs`) or the equivalent verification commands yourself before passing. If a required check fails, fail or block.",
      "For each material plan commitment, decide whether it is implemented, verified, changed-with-justification, missing, or broken.",
      "Behavioral evidence matters more than artifact presence. Files, endpoints, generated code, scripts, UI, tests, or docs only count when they actually support the planned commitment.",
      "Fail when a material planned commitment is missing, broken, superficially implemented, not exercised through the real production path, or contradicted by failing checks.",
      "Fail when planned tests or verification exist but do not meaningfully cover the commitment they were supposed to protect.",
      "Do not fail for harmless implementation details, stylistic differences, renamed files, or documented changes that preserve the intent of the plan.",
      "For each failure finding, cite the exact plan bullet or planned slice, the evidence inspected, why the commitment is not satisfied, and the smallest fix expected from the build agent.",
      "If all material plan commitments are implemented or reasonably justified and required checks pass, pass the stage with lattice_signal and a concise reason.",
      "If material plan commitments are missing or broken, fail the stage with lattice_signal and concise actionable findings.",
      "If you cannot inspect enough evidence to decide, block the stage with lattice_signal and a concise reason."
    ].join("\n")
  });
}
