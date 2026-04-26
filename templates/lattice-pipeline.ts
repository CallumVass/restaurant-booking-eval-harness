export default {
  name: "restaurant-booking-eval",
  stages: [
    {
      id: "plan",
      type: "stage",
      agent: "eval-planner",
      completion: "tool_signal",
      signals: ["complete"],
      fork: false,
      skills: {
        pinned: [
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
        dynamic: false
      },
      prompt: [
        "Create a concise implementation plan for the restaurant booking eval.",
        "Target completion is 30-60 minutes, so keep scope deliberate.",
        "Plan vertical behavior slices rather than horizontal layers.",
        "Prefer pure domain functions and thin imperative shells.",
        "Use explicit Result-style errors for expected business failures.",
        "If the goal asks for Tailwind/shadcn, TanStack, or OpenAPI-generated clients, include concrete plan steps for those choices.",
        "Write the plan to .lattice/plans/restaurant-booking.md, then return the same plan in your response.",
        "Do not edit any other files during planning.",
        "Only call lattice_signal(status: \"complete\") after the plan file exists and your response includes the same plan."
      ].join("\n")
    },
    {
      id: "build",
      type: "stage",
      agent: "build",
      completion: "tool_signal",
      signals: ["complete"],
      fork: true,
      isRewindTarget: true,
      maxRewinds: 1,
      skills: {
        pinned: [
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
        dynamic: false
      },
      postHook: {
        commands: [
          "node .opencode/scripts/deterministic-checks.mjs"
        ],
        maxRetries: 1
      },
      prompt: [
        "Implement the plan for the restaurant booking system.",
        "Before editing, read .lattice/plans/restaurant-booking.md and use it as your implementation checklist.",
        "Follow the plan unless the codebase proves a step is unsafe or obsolete; if you deviate, document why in your final response.",
        "Use .NET 10 for the API and React for the SPA.",
        "Follow the goal's scenario-specific frontend/client requirements, including Tailwind/shadcn, TanStack Query, and OpenAPI-generated typed clients when requested.",
        "Work in behavior-focused TDD slices where practical.",
        "Add boundary tests for booking conflicts, invalid party size, invalid times, unknown restaurants, and overlapping reservations.",
        "Use pure domain functions for availability/conflict logic and keep I/O in thin shells.",
        "Keep Clean Architecture/DDD boundaries lightweight. Do not over-engineer CQRS, event sourcing, auth, or persistence.",
        "Prefer in-memory persistence unless another option is quicker and safer.",
        "Include README run instructions.",
        "Configure deterministic quality scripts in frontend/package.json: build, typecheck, lint, format:check, and deadcode.",
        "Use strict compiler/linter settings; do not leave warnings, unused code, unused exports, or dead code.",
        "The deterministic checker discovers the .NET solution/project and frontend package directory; ensure those artifacts exist and the checks pass from a clean workspace.",
        "Ensure backend build, backend tests, dotnet format verification, frontend install, frontend build, typecheck, lint, format check, and dead-code check all pass.",
        "If property-based testing is a natural fit for pure availability logic, use it; otherwise use focused example-based boundary tests.",
        "Do not call lattice_signal(status: \"complete\") until implementation is finished and you have run the deterministic checker or equivalent commands successfully."
      ].join("\n")
    },
    {
      id: "plan-adherence-review",
      type: "stage",
      agent: "plan-reviewer",
      completion: "tool_signal",
      signals: ["approve", "reject", "blocked"],
      fork: false,
      skills: {
        pinned: [
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
        dynamic: false
      },
      prompt: [
        "Review plan adherence for the completed restaurant booking implementation.",
        "Read .lattice/plans/restaurant-booking.md first, then inspect the source, tests, frontend package scripts, OpenAPI/client generation config, and README.",
        "Treat the plan as a set of intended user-visible and system behaviors, not as a file or artifact checklist.",
        "Approve only when the implementation shows behavioral evidence that the planned deliverables work end-to-end or are covered by meaningful tests/checks.",
        "Do not accept the mere existence of files, endpoints, generated code, scripts, UI components, documentation, or configuration as sufficient proof that the planned behavior is implemented.",
        "Reject when a planned mechanism is present but not enforced, wired but not used in the actual flow, tested only superficially, documented without implementation evidence, or implemented in a way that leaves an explicit scenario requirement unmet.",
        "Do not reject for harmless implementation details, stylistic differences, renamed files, or reasonable justified changes that preserve the planned behavior.",
        "For each rejection finding, cite the exact plan bullet or planned slice, the behavior that should have been verified, the source/test evidence showing the behavior is missing or weak, and the smallest fix expected from the build agent.",
        "When tests were planned, evaluate whether they exercise the important behavior and failure modes, not just whether a test file or script exists.",
        "When generated clients/hooks, auth/security, persistence, ownership, concurrency, error handling, or integration workflows were planned, verify that the production code path actually uses/enforces them and that boundary/failure cases are covered where practical.",
        "Pay special attention to generated OpenAPI/TanStack Query usage, CSRF/auth wiring when applicable, frontend test scripts and tests when planned, HTTP/OpenAPI regression tests, atomic conflict prevention, deterministic scripts, and README instructions.",
        "If a planned item was intentionally changed and the README or final notes explain a reasonable reason, mark it as changed-with-justification rather than rejecting.",
        "If all major planned deliverables are met or only minor polish gaps remain, approve the stage with lattice_signal and a concise reason.",
        "If major planned deliverables are missing or broken, reject the stage with lattice_signal and concise actionable findings.",
        "If you cannot inspect enough evidence to decide, block the stage with lattice_signal and a concise reason."
      ].join("\n")
    }
  ]
};
