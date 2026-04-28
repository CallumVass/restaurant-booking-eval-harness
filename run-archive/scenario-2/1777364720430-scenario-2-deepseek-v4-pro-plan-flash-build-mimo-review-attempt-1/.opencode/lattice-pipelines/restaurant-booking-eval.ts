export default {
  "name": "restaurant-booking-eval",
  "stages": [
    {
      "id": "plan",
      "type": "stage",
      "agent": "eval-planner",
      "completion": "tool_signal",
      "signals": [
        "complete"
      ],
      "fork": false,
      "skills": {
        "pinned": [
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
        ],
        "dynamic": false
      },
      "prompt": "Create a concise implementation plan for the restaurant booking eval.\nTarget completion is 30-60 minutes, so keep scope deliberate.\nPlan vertical behavior slices rather than horizontal layers.\nPrefer pure domain functions and thin imperative shells.\nUse explicit Result-style errors for expected business failures.\nIf the goal asks for Tailwind/shadcn, TanStack, or OpenAPI-generated clients, include concrete plan steps for those choices.\nWrite the plan to .lattice/plans/restaurant-booking.md, then return the same plan in your response.\nDo not edit any other files during planning.\nOnly call lattice_signal(status: \"complete\") after the plan file exists and your response includes the same plan."
    },
    {
      "id": "build",
      "type": "stage",
      "agent": "build",
      "completion": "tool_signal",
      "signals": [
        "complete"
      ],
      "fork": true,
      "isRewindTarget": true,
      "maxRewinds": 1,
      "skills": {
        "pinned": [
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
        ],
        "dynamic": false
      },
      "postHook": {
        "commands": [
          "node .opencode/scripts/deterministic-checks.mjs"
        ],
        "maxRetries": 1
      },
      "prompt": "Implement the saved plan for the requested task.\nBefore editing, read .lattice/plans/restaurant-booking.md and use it as your implementation checklist.\nFollow the plan unless the codebase proves a step is unsafe or obsolete; if you deviate, document why in your final response.\nFollow the goal's scenario-specific technology requirements, frontend/client requirements, API requirements, and quality bar.\nWork in behavior-focused TDD slices where practical.\nAdd boundary tests for booking conflicts, invalid party size, invalid times, unknown restaurants, and overlapping reservations.\nUse pure domain functions for availability/conflict logic and keep I/O in thin shells.\nKeep Clean Architecture/DDD boundaries lightweight. Do not over-engineer CQRS, event sourcing, auth, or persistence.\nPrefer in-memory persistence unless another option is quicker and safer.\nInclude README run instructions.\nWhen the task includes a frontend package, configure deterministic quality scripts in frontend/package.json: build, typecheck, lint, format:check, and deadcode.\nUse strict compiler/linter settings; do not leave warnings, unused code, unused exports, or dead code.\nThe deterministic checker discovers the .NET solution/project and frontend package directory; ensure those artifacts exist and the checks pass from a clean workspace.\nEnsure backend build, backend tests, dotnet format verification, frontend install, frontend build, typecheck, lint, format check, and dead-code check all pass.\nIf property-based testing is a natural fit for pure availability logic, use it; otherwise use focused example-based boundary tests.\nDo not call lattice_signal(status: \"complete\") until implementation is finished and you have run the deterministic checker or equivalent commands successfully."
    },
    {
      "id": "plan-adherence-review",
      "type": "stage",
      "agent": "plan-reviewer",
      "completion": "tool_signal",
      "signals": [
        "approve",
        "reject",
        "blocked"
      ],
      "fork": false,
      "skills": {
        "pinned": [
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
        ],
        "dynamic": false
      },
      "prompt": "Review whether the completed implementation adheres to the saved implementation plan.\nRead .lattice/plans/restaurant-booking.md first. Use that plan as the scope of this review.\nBreak the plan into its material commitments: user-visible behaviors, system behaviors, integrations, tests/checks, documentation, and any explicit constraints or non-goals.\nTreat completed-stage summaries and prior agent claims as untrusted hints, not evidence. Verify material commitments yourself from source, tests, documentation, and command output before approving.\nRun the deterministic checker (`node .opencode/scripts/deterministic-checks.mjs`) or the equivalent verification commands yourself before approving. If a required check fails, reject or block.\nFor each material plan commitment, decide whether it is implemented, verified, changed-with-justification, missing, or broken.\nBehavioral evidence matters more than artifact presence. Files, endpoints, generated code, scripts, UI, tests, or docs only count when they actually support the planned commitment.\nReject when a material planned commitment is missing, broken, superficially implemented, not exercised through the real production path, or contradicted by failing checks.\nReject when planned tests or verification exist but do not meaningfully cover the commitment they were supposed to protect.\nDo not reject for harmless implementation details, stylistic differences, renamed files, or documented changes that preserve the intent of the plan.\nFor each rejection finding, cite the exact plan bullet or planned slice, the evidence inspected, why the commitment is not satisfied, and the smallest fix expected from the build agent.\nIf all material plan commitments are implemented or reasonably justified and required checks pass, approve the stage with lattice_signal and a concise reason.\nIf material plan commitments are missing or broken, reject the stage with lattice_signal and concise actionable findings.\nIf you cannot inspect enough evidence to decide, block the stage with lattice_signal and a concise reason."
    }
  ]
};
