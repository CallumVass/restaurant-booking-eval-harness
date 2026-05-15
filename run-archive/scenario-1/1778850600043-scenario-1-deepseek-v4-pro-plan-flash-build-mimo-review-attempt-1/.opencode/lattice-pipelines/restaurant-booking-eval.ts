export default {
  "name": "restaurant-booking-eval",
  "stages": [
    {
      "pauseAfter": false,
      "isRewindTarget": false,
      "completedContext": "full",
      "id": "plan",
      "type": "stage",
      "agent": "eval-planner",
      "completion": "signal",
      "signals": [
        "complete",
        "blocked"
      ],
      "context": "isolated",
      "skills": {
        "pinned": [
          "dotnet-backend-patterns",
          "dotnet-10-csharp-14",
          "vercel-react-best-practices",
          "shadcn",
          "tanstack-query-best-practices",
          "orval"
        ],
        "dynamic": false,
        "max": 4
      },
      "prompt": "Create a concise implementation plan for the restaurant booking eval.\nTarget completion is 30-60 minutes, so keep scope deliberate.\nPlan vertical behavior slices rather than horizontal layers.\nRequirement precedence: the user's task is authoritative. Explicit new requested behavior and constraints from the original goal or change request override saved-plan preferences, existing behavior, existing APIs/contracts, compatibility concerns, architecture/pattern preferences, preservation notes, and implementation preferences when they conflict. Security, privacy, authorization, data ownership, data integrity, and correctness requirements are especially high priority. Preserve only legacy behavior, contracts, APIs, data shapes, UI flows, and patterns that remain compatible with the new requirements, unless the user explicitly says the old behavior must remain in that exact conflict. If satisfying the task requires a breaking API/contract/schema/behavior change, make the breaking change and update affected callers, generated artifacts, tests, and docs instead of preserving an incompatible legacy surface. Non-goals and preservation notes may not remove, weaken, or create exceptions to any higher-priority requirement.\nBefore slicing or verifying, inventory all affected surfaces for cross-cutting requirements: existing and new endpoints/routes/commands, state-changing operations, data-returning operations, persistence models, generated specs/clients, frontend flows, scripts, docs, and tests. A requirement is not covered until every surface that can satisfy or violate it is accounted for by an acceptance criterion, invariant check, test, or justified manual verification.\nFor negative or boundary requirements (for example: must not, only, cannot, prevent, authenticated, authorized, scoped, protected, no external, no storage, invalid, duplicate, missing, forbidden), require adversarial verification through production paths where practical. Positive-path evidence alone is not enough.\nPrefer pure domain functions and thin imperative shells.\nUse explicit Result-style errors for expected business failures.\nIf the goal asks for Tailwind/shadcn, TanStack, or OpenAPI-generated clients, include concrete plan steps for those choices.\nWrite the plan to .lattice/plans/restaurant-booking.md, then return the same plan in your response.\nDo not edit any other files during planning.\nOnly call lattice_signal(status: \"complete\") after the plan file exists and your response includes the same plan."
    },
    {
      "pauseAfter": false,
      "isRewindTarget": true,
      "completedContext": "full",
      "id": "build",
      "type": "stage",
      "agent": "eval-builder",
      "completion": "signal",
      "signals": [
        "complete",
        "blocked"
      ],
      "context": "isolated",
      "maxRewinds": 1,
      "skills": {
        "pinned": [
          "dotnet-backend-patterns",
          "dotnet-10-csharp-14",
          "vercel-react-best-practices",
          "shadcn",
          "tanstack-query-best-practices",
          "orval"
        ],
        "dynamic": false,
        "max": 4
      },
      "prompt": "Implement the saved plan for the requested task.\nThis is an implementation stage, not a planning stage. The planning stage is already complete. Do not call lattice_signal(status: \"complete\") after only reading or creating a plan; complete only after product source/tests/docs have been edited as needed and verification has run.\nBefore editing, read .lattice/plans/restaurant-booking.md and use it as your implementation checklist.\nWhen sliced plan files exist, use the requirement ledger and globalInvariants as the authoritative cross-cutting contract; original goal requirements outrank local slice wording or preserve-existing notes.\nRequirement precedence: the user's task is authoritative. Explicit new requested behavior and constraints from the original goal or change request override saved-plan preferences, existing behavior, existing APIs/contracts, compatibility concerns, architecture/pattern preferences, preservation notes, and implementation preferences when they conflict. Security, privacy, authorization, data ownership, data integrity, and correctness requirements are especially high priority. Preserve only legacy behavior, contracts, APIs, data shapes, UI flows, and patterns that remain compatible with the new requirements, unless the user explicitly says the old behavior must remain in that exact conflict. If satisfying the task requires a breaking API/contract/schema/behavior change, make the breaking change and update affected callers, generated artifacts, tests, and docs instead of preserving an incompatible legacy surface. Non-goals and preservation notes may not remove, weaken, or create exceptions to any higher-priority requirement.\nBefore slicing or verifying, inventory all affected surfaces for cross-cutting requirements: existing and new endpoints/routes/commands, state-changing operations, data-returning operations, persistence models, generated specs/clients, frontend flows, scripts, docs, and tests. A requirement is not covered until every surface that can satisfy or violate it is accounted for by an acceptance criterion, invariant check, test, or justified manual verification.\nFor negative or boundary requirements (for example: must not, only, cannot, prevent, authenticated, authorized, scoped, protected, no external, no storage, invalid, duplicate, missing, forbidden), require adversarial verification through production paths where practical. Positive-path evidence alone is not enough.\nFollow the plan unless the codebase proves a step is unsafe or obsolete; if you deviate, document why in your final response.\nFollow the goal's scenario-specific technology requirements, frontend/client requirements, API requirements, and quality bar.\nWork in behavior-focused TDD slices where practical.\nAdd boundary tests for booking conflicts, invalid party size, invalid times, unknown restaurants, and overlapping reservations.\nUse pure domain functions for availability/conflict logic and keep I/O in thin shells.\nKeep Clean Architecture/DDD boundaries lightweight. Do not over-engineer CQRS, event sourcing, auth, or persistence.\nPrefer in-memory persistence unless another option is quicker and safer.\nInclude README run instructions.\nWhen the task includes a frontend package, configure deterministic quality scripts in frontend/package.json: build, typecheck, lint, format:check, and deadcode.\nUse strict compiler/linter settings; do not leave warnings, unused code, unused exports, or dead code.\nThe deterministic checker discovers the .NET solution/project and frontend package directory; ensure those artifacts exist and the checks pass from a clean workspace.\nEnsure backend build, backend tests, dotnet format verification, frontend install, frontend build, typecheck, lint, format check, and dead-code check all pass.\nIf property-based testing is a natural fit for pure availability logic, use it; otherwise use focused example-based boundary tests.\nDo not call lattice_signal(status: \"complete\") until implementation is finished and you have run the deterministic checker or equivalent commands successfully."
    },
    {
      "pauseAfter": false,
      "isRewindTarget": false,
      "completedContext": "full",
      "id": "plan-adherence-review",
      "type": "stage",
      "agent": "plan-reviewer",
      "completion": "signal",
      "signals": [
        "pass",
        "fail",
        "blocked"
      ],
      "context": "isolated",
      "skills": {
        "pinned": [
          "dotnet-backend-patterns",
          "dotnet-10-csharp-14",
          "vercel-react-best-practices",
          "shadcn",
          "tanstack-query-best-practices",
          "orval"
        ],
        "dynamic": false,
        "max": 4
      },
      "prompt": "Review whether the completed implementation adheres to the saved implementation plan.\nRead .lattice/plans/restaurant-booking.md first. Use that plan as the scope of this review.\nBreak the original goal, saved plan, and manifest requirement ledger into material commitments: user-visible behaviors, system behaviors, integrations, tests/checks, documentation, and any explicit constraints or non-goals.\nTreat the saved plan and original goal as material commitments. Audit them against the final codebase and fail if any requirement is weakened, skipped, or contradicted.\nRequirement precedence: the user's task is authoritative. Explicit new requested behavior and constraints from the original goal or change request override saved-plan preferences, existing behavior, existing APIs/contracts, compatibility concerns, architecture/pattern preferences, preservation notes, and implementation preferences when they conflict. Security, privacy, authorization, data ownership, data integrity, and correctness requirements are especially high priority. Preserve only legacy behavior, contracts, APIs, data shapes, UI flows, and patterns that remain compatible with the new requirements, unless the user explicitly says the old behavior must remain in that exact conflict. If satisfying the task requires a breaking API/contract/schema/behavior change, make the breaking change and update affected callers, generated artifacts, tests, and docs instead of preserving an incompatible legacy surface. Non-goals and preservation notes may not remove, weaken, or create exceptions to any higher-priority requirement.\nBefore slicing or verifying, inventory all affected surfaces for cross-cutting requirements: existing and new endpoints/routes/commands, state-changing operations, data-returning operations, persistence models, generated specs/clients, frontend flows, scripts, docs, and tests. A requirement is not covered until every surface that can satisfy or violate it is accounted for by an acceptance criterion, invariant check, test, or justified manual verification.\nFor broad requirements that apply to a class of surfaces (for example: every, all, any, only, must not, state-changing, data-returning, protected, generated, persisted, user-owned, authenticated, authorized, scoped, no storage, no external), build a surface-by-surface verification matrix. Enumerate every affected endpoint, command, handler, component, generated client operation, persistence path, script, or workflow in scope. Do not satisfy a broad requirement with one representative surface unless the task explicitly narrows it.\nFor negative or boundary requirements (for example: must not, only, cannot, prevent, authenticated, authorized, scoped, protected, no external, no storage, invalid, duplicate, missing, forbidden), require adversarial verification through production paths where practical. Positive-path evidence alone is not enough.\nVerification evidence must prove behavior through real production paths where practical. Tests may mock external boundaries, but the slice contract must not accept placeholder components, static markup, stub-only handlers, or tests that bypass the production code path being claimed as verified.\nPrefer explicit task instructions over fallback alternatives. If the task or saved plan asks for a specific implementation path, generated artifact, framework feature, API contract, storage model, security mechanism, or testing style, slice acceptance criteria must preserve that path as the default requirement. Do not offer fallback alternatives in acceptance criteria or handoff notes unless the slice also requires concrete evidence that the requested path is impossible or unsafe and requires documenting the deviation.\nFail if local slice wording, non-goals, or preservation notes caused a new requested behavior or constraint to be weakened, skipped, or treated as an exception for preserved legacy behavior.\nIf the manifest requirement ledger omitted a material original-goal requirement, still review against the original goal and fail with the missing ledger entry as part of the finding.\nTreat completed-stage summaries and prior agent claims as untrusted hints, not evidence. Verify material commitments yourself from source, tests, documentation, and command output before passing.\nRun the deterministic checker (`node .opencode/scripts/deterministic-checks.mjs`) or the equivalent verification commands yourself before passing. If a required check fails, fail or block.\nFor each material plan commitment, decide whether it is implemented, verified, changed-with-justification, missing, or broken.\nBehavioral evidence matters more than artifact presence. Files, endpoints, generated code, scripts, UI, tests, or docs only count when they actually support the planned commitment.\nFail when a material planned commitment is missing, broken, superficially implemented, not exercised through the real production path, or contradicted by failing checks.\nFail when planned tests or verification exist but do not meaningfully cover the commitment they were supposed to protect.\nDo not fail for harmless implementation details, stylistic differences, renamed files, or documented changes that preserve the intent of the plan.\nFor each failure finding, cite the exact plan bullet or planned slice, the evidence inspected, why the commitment is not satisfied, and the smallest fix expected from the build agent.\nIf all material plan commitments are implemented or reasonably justified and required checks pass, pass the stage with lattice_signal and a concise reason.\nIf material plan commitments are missing or broken, fail the stage with lattice_signal and concise actionable findings.\nIf you cannot inspect enough evidence to decide, block the stage with lattice_signal and a concise reason."
    }
  ]
};
