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
    }
  ]
};
