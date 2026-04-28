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
      "id": "normalize-slices",
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
      "prompt": "Convert the existing big implementation plan into a task-specific slice manifest for fresh-context execution.\nRead .lattice/plans/restaurant-booking.md. Do not change its meaning or add new scope.\nCreate .lattice/plans/slices/manifest.json and one slice file per manifest entry under .lattice/plans/slices/.\nThe manifest must contain between 1 and 8 slices. Choose slice boundaries from the actual plan and task; do not force restaurant-specific, backend/frontend-specific, or layer-based slices when the scenario calls for something else.\nUse this manifest shape: { \"slices\": [{ \"index\": 1, \"id\": \"short-kebab-id\", \"title\": \"Human title\", \"file\": \".lattice/plans/slices/01-short-kebab-id.md\" }] }.\nSlice files must be numbered with their manifest index and include Goal, Acceptance Criteria, Required Tests, Verification Commands, Handoff Notes, and Non-Goals.\nKeep each slice bounded and executable from a fresh context against the current codebase. Avoid tiny mechanical slices and avoid generic predetermined layers unless the plan naturally calls for them.\nDo not edit implementation files. Only create the manifest and slice plan files.\nCall lattice_signal(status: \"complete\") only after the manifest and all referenced slice files exist."
    },
    {
      "id": "build-slices",
      "type": "stage",
      "agent": "build",
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
      "expand": {
        "from": ".lattice/plans/slices/manifest.json",
        "arrayPath": "slices",
        "maxItems": 8,
        "template": {
          "id": "build-slice-{{index}}-{{id}}",
          "type": "stage",
          "agent": "build",
          "completion": "tool_signal",
          "signals": [
            "complete"
          ],
          "fork": false,
          "skills": {
            "pinned": [],
            "dynamic": true,
            "max": 4
          },
          "prompt": "Implement slice {{index}}: {{title}}.\nRead {{file}} and treat it as the slice contract.\nAlso inspect the current codebase and any previous .lattice/summaries/slice-*.md files before editing.\nWork only on this slice's acceptance criteria and preserve earlier behavior. Do not implement later manifest slices early unless required to keep the current slice coherent.\nIf a slice contract conflicts with the current codebase or scenario goal, choose the safer implementation and document the deviation in the slice summary.\nUse TDD where practical for this slice. Add or update tests required by the slice contract.\nRun the slice's verification commands, plus any directly relevant build/test commands for touched areas.\nWrite .lattice/summaries/slice-{{index}}-{{id}}.md with changes made, checks run, known gaps, and handoff notes.\nDo not claim unrelated future slices are done.\nCall lattice_signal(status: \"complete\") only when this slice is implemented, verified, and summarized."
        }
      }
    },
    {
      "id": "final-integration",
      "type": "stage",
      "agent": "build",
      "completion": "tool_signal",
      "signals": [
        "complete"
      ],
      "fork": false,
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
      "prompt": "Perform the final integration pass for the requested task.\nRead .lattice/plans/restaurant-booking.md, .lattice/plans/slices/manifest.json, every referenced slice file, and every .lattice/summaries/slice-*.md file.\nInspect the whole codebase for cross-slice integration bugs, stale generated clients or contracts, route/API mismatches, missing validations, broken error handling, weak UX where UI is required, dead code, and missing README instructions.\nFor user flows that cross backend, generated client, and UI, verify the actual values line up end-to-end. For example, if the backend returns selectable slots or IDs, the UI must submit those returned values without reformatting them into invalid requests.\nFor date/time or range-based business rules, verify both source and tests cover invalid values, past dates where invalid, outside-hours or out-of-range values, invalid granularity, edge non-overlap, and overlap/conflict behavior as required by the task.\nFor generated API clients, verify the generated paths, base URL/mutator configuration, request shapes, and response handling match the backend routes. Check for double prefixes, stale checked-in specs, or generated clients returning error responses as successful mutations.\nFor UI requirements, verify source evidence for required component systems and that the primary happy path and error paths are functionally connected, not just visually present.\nEnsure the final product satisfies the original scenario goal, not just the individual slice files.\nRun node .opencode/scripts/deterministic-checks.mjs or equivalent full verification commands and fix failures or warnings that should fail the requested quality bar.\nDo not call lattice_signal(status: \"complete\") until the full deterministic checker passes."
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
      "prompt": "Review whether the completed implementation adheres to the saved implementation plan.\nRead .lattice/plans/restaurant-booking.md, every .lattice/plans/slices/*.md file, and every .lattice/summaries/slice-*.md file first. Use them as the scope of this plan-adherence review.\nBreak the plan into its material commitments: user-visible behaviors, system behaviors, integrations, tests/checks, documentation, and any explicit constraints or non-goals.\nTreat completed-stage summaries and prior agent claims as untrusted hints, not evidence. Verify material commitments yourself from source, tests, documentation, and command output before approving.\nRun the deterministic checker (`node .opencode/scripts/deterministic-checks.mjs`) or the equivalent verification commands yourself before approving. If a required check fails, reject or block.\nFor each material plan commitment, decide whether it is implemented, verified, changed-with-justification, missing, or broken.\nBehavioral evidence matters more than artifact presence. Files, endpoints, generated code, scripts, UI, tests, or docs only count when they actually support the planned commitment.\nReject when a material planned commitment is missing, broken, superficially implemented, not exercised through the real production path, or contradicted by failing checks.\nReject when planned tests or verification exist but do not meaningfully cover the commitment they were supposed to protect.\nDo not reject for harmless implementation details, stylistic differences, renamed files, or documented changes that preserve the intent of the plan.\nFor each rejection finding, cite the exact plan bullet or planned slice, the evidence inspected, why the commitment is not satisfied, and the smallest fix expected from the build agent.\nIf all material plan commitments are implemented or reasonably justified and required checks pass, approve the stage with lattice_signal and a concise reason.\nIf material plan commitments are missing or broken, reject the stage with lattice_signal and concise actionable findings.\nIf you cannot inspect enough evidence to decide, block the stage with lattice_signal and a concise reason."
    }
  ]
};
