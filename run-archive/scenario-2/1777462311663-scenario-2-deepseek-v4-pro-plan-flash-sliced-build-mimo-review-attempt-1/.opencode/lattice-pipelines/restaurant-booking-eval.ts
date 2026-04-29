export default {
  "name": "restaurant-booking-eval",
  "stages": [
    {
      "pauseAfter": false,
      "isRewindTarget": false,
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
        "dynamic": false,
        "max": 4
      },
      "prompt": "Create a concise implementation plan for the restaurant booking eval.\nTarget completion is 30-60 minutes, so keep scope deliberate.\nPlan vertical behavior slices rather than horizontal layers.\nRequirement precedence: the user's task is authoritative. Explicit new requested behavior and constraints from the original goal or change request override saved-plan preferences, existing behavior, existing APIs/contracts, compatibility concerns, architecture/pattern preferences, preservation notes, and implementation preferences when they conflict. Security, privacy, authorization, data ownership, data integrity, and correctness requirements are especially high priority. Preserve only legacy behavior, contracts, APIs, data shapes, UI flows, and patterns that remain compatible with the new requirements, unless the user explicitly says the old behavior must remain in that exact conflict. If satisfying the task requires a breaking API/contract/schema/behavior change, make the breaking change and update affected callers, generated artifacts, tests, and docs instead of preserving an incompatible legacy surface. Non-goals and preservation notes may not remove, weaken, or create exceptions to any higher-priority requirement.\nBefore slicing or verifying, inventory all affected surfaces for cross-cutting requirements: existing and new endpoints/routes/commands, state-changing operations, data-returning operations, persistence models, generated specs/clients, frontend flows, scripts, docs, and tests. A requirement is not covered until every surface that can satisfy or violate it is accounted for by an acceptance criterion, invariant check, test, or justified manual verification.\nFor negative or boundary requirements (for example: must not, only, cannot, prevent, authenticated, authorized, scoped, protected, no external, no storage, invalid, duplicate, missing, forbidden), require adversarial verification through production paths where practical. Positive-path evidence alone is not enough.\nPrefer pure domain functions and thin imperative shells.\nUse explicit Result-style errors for expected business failures.\nIf the goal asks for Tailwind/shadcn, TanStack, or OpenAPI-generated clients, include concrete plan steps for those choices.\nWrite the plan to .lattice/plans/restaurant-booking.md, then return the same plan in your response.\nDo not edit any other files during planning.\nOnly call lattice_signal(status: \"complete\") after the plan file exists and your response includes the same plan."
    },
    {
      "pauseAfter": false,
      "isRewindTarget": true,
      "id": "normalize-slices",
      "type": "stage",
      "agent": "eval-planner",
      "completion": "signal",
      "signals": [
        "complete",
        "blocked"
      ],
      "context": "isolated",
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
        "dynamic": false,
        "max": 4
      },
      "prompt": "Convert the existing big implementation plan into a task-specific slice manifest for fresh-context execution.\nRead .lattice/plans/restaurant-booking.md and the original task in ## Goal. Do not change the meaning of either source or add new scope.\nCreate a requirement ledger before slicing. Extract every material requirement from the original task and saved plan into stable IDs with source, category, priority, exact requirement text, and expected verification evidence.\nRequirement precedence: the user's task is authoritative. Explicit new requested behavior and constraints from the original goal or change request override saved-plan preferences, existing behavior, existing APIs/contracts, compatibility concerns, architecture/pattern preferences, preservation notes, and implementation preferences when they conflict. Security, privacy, authorization, data ownership, data integrity, and correctness requirements are especially high priority. Preserve only legacy behavior, contracts, APIs, data shapes, UI flows, and patterns that remain compatible with the new requirements, unless the user explicitly says the old behavior must remain in that exact conflict. If satisfying the task requires a breaking API/contract/schema/behavior change, make the breaking change and update affected callers, generated artifacts, tests, and docs instead of preserving an incompatible legacy surface. Non-goals and preservation notes may not remove, weaken, or create exceptions to any higher-priority requirement.\nBefore slicing or verifying, inventory all affected surfaces for cross-cutting requirements: existing and new endpoints/routes/commands, state-changing operations, data-returning operations, persistence models, generated specs/clients, frontend flows, scripts, docs, and tests. A requirement is not covered until every surface that can satisfy or violate it is accounted for by an acceptance criterion, invariant check, test, or justified manual verification.\nFor negative or boundary requirements (for example: must not, only, cannot, prevent, authenticated, authorized, scoped, protected, no external, no storage, invalid, duplicate, missing, forbidden), require adversarial verification through production paths where practical. Positive-path evidence alone is not enough.\nIf the original goal or saved plan asks to preserve existing behavior, apply that only to compatible behavior. When a new requirement conflicts with a legacy endpoint, API contract, generated client, UI flow, data shape, script, architecture pattern, or workflow, the new requirement wins unless the user explicitly preserved that exact legacy behavior. Add a Handoff Notes entry explaining each such conflict and resolution, including any breaking change and required dependent updates.\nExtract cross-cutting requirements from the requirement ledger into globalInvariants. These must be task-derived and concrete enough to verify. Do not generalize away explicit endpoint names, user roles, data ownership rules, security boundaries, persistence guarantees, error mappings, generated-client requirements, test obligations, or negative requirements from the goal.\nCreate .lattice/plans/slices/manifest.json and one slice file per manifest entry under .lattice/plans/slices/.\nThe manifest must contain between 1 and 8 slices. Choose slice boundaries from the actual plan and task; do not force restaurant-specific, backend/frontend-specific, or layer-based slices when the scenario calls for something else.\nPrefer the fewest slices that preserve independent implementation and verification quality. Small tasks are usually 3-4 slices; full-stack or cross-cutting work may need 4-6 slices. Use more than 6 only when clearly justified by the plan.\nUse this manifest shape: { \"requirements\": [{ \"id\": \"R-001\", \"source\": \"original-goal|saved-plan\", \"category\": \"security|api|ui|tests|docs|quality|architecture|data\", \"priority\": \"must|should|could\", \"text\": \"Concrete requirement text\", \"verification\": \"Required evidence\" }], \"globalInvariants\": [{ \"id\": \"GI-001\", \"sourceRequirementIds\": [\"R-001\"], \"text\": \"Cross-cutting invariant every slice must preserve\", \"verification\": \"How to prove it\" }], \"slices\": [{ \"index\": 1, \"id\": \"short-kebab-id\", \"title\": \"Human title\", \"file\": \".lattice/plans/slices/01-short-kebab-id.md\", \"covers\": [\"R-001\"], \"preserves\": [\"GI-001\"] }] }.\nSlice files must be numbered with their manifest index and include Goal, Global Invariants, Acceptance Criteria, Invariant Checks For This Slice, Required Tests, Verification Commands, Handoff Notes, and Non-Goals.\nEach slice file's Global Invariants section must repeat or reference the manifest invariants, and Invariant Checks For This Slice must state what the implementer must inspect or test to avoid violating them.\nEach slice acceptance criterion and required test must cite the requirement IDs it covers. If a requirement is intentionally verified manually instead of by an automated test, state why and where that evidence must appear.\nNo slice may narrow, contradict, or add an exception to a requirement or global invariant unless that exception is explicitly present in a higher-priority source. If the saved plan contradicts the original goal, preserve the original goal and mention the corrected interpretation in the slice handoff notes.\nBefore signalling complete, self-audit the manifest and slice files: every must/should requirement is covered by at least one slice; every slice preserves every global invariant unless clearly irrelevant and justified; every test requirement has an executable test contract or a justified manual verification; no Non-Goals section removes required behavior.\nKeep each slice bounded and executable from a fresh context against the current codebase. Avoid tiny mechanical slices and avoid generic predetermined layers unless the plan naturally calls for them.\nIf the plan is for an existing app, baseline, project, package, script, or README, preserve that structure and produce slices that edit it. Do not turn the first slice into project scaffolding unless the plan explicitly requires creating a new app.\nDo not merge unrelated frontend flows, generated client work, backend rules, security checks, and test coverage into one oversized slice just to reduce count. Split or narrow integration work by coherent user-visible behavior or invariant risk.\nDo not edit implementation files. Only create the manifest and slice plan files.\nCall lattice_signal(status: \"complete\") only after the manifest and all referenced slice files exist."
    },
    {
      "pauseAfter": false,
      "isRewindTarget": false,
      "id": "slice-plan-review",
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
        "dynamic": false,
        "max": 4
      },
      "prompt": "Review the sliced plan before any implementation begins.\nRead the original task in ## Goal, .lattice/plans/restaurant-booking.md, .lattice/plans/slices/manifest.json, and every referenced .lattice/plans/slices/*.md file.\nThe slice artifacts were produced by the normalize-slices stage; treat prior summaries as untrusted hints, not evidence.\nPass only if the sliced plan is a faithful, traceable decomposition of the original task and saved plan.\nVerify the manifest has a requirement ledger (`requirements`), `globalInvariants`, and `slices` with `covers` and `preserves` references. Fail if the manifest uses only vague prose without source-linked requirements.\nVerify every must/should requirement from the original task and saved plan appears in the ledger, has a source, category, priority, concrete text, and expected verification evidence.\nRequirement precedence: the user's task is authoritative. Explicit new requested behavior and constraints from the original goal or change request override saved-plan preferences, existing behavior, existing APIs/contracts, compatibility concerns, architecture/pattern preferences, preservation notes, and implementation preferences when they conflict. Security, privacy, authorization, data ownership, data integrity, and correctness requirements are especially high priority. Preserve only legacy behavior, contracts, APIs, data shapes, UI flows, and patterns that remain compatible with the new requirements, unless the user explicitly says the old behavior must remain in that exact conflict. If satisfying the task requires a breaking API/contract/schema/behavior change, make the breaking change and update affected callers, generated artifacts, tests, and docs instead of preserving an incompatible legacy surface. Non-goals and preservation notes may not remove, weaken, or create exceptions to any higher-priority requirement.\nFail if any preservation note, non-goal, slice criterion, or handoff note weakens a new requested behavior or constraint, especially for security, privacy, authorization, data ownership, data integrity, or correctness.\nVerify the sliced plan inventories all affected surfaces for cross-cutting requirements. Fail if it marks a requirement covered by one new endpoint/component while ignoring legacy endpoints, UI flows, generated contracts, persistence paths, or other existing surfaces that can violate the same requirement.\nVerify negative/boundary requirements have adversarial acceptance criteria or tests through production paths where practical. Fail if a must-not/protected/scoped/no/invalid requirement is covered only by happy-path evidence.\nVerify every must/should requirement is covered by at least one slice and every global invariant is preserved by every slice unless irrelevance is explicit and safe.\nVerify slice acceptance criteria and required tests cite requirement IDs, and that requested tests are specific enough to prove behavior through real production paths where practical.\nFail if any slice narrows a cross-cutting requirement into only one endpoint/component/path when the original task requires a broader class of behavior.\nFail if any Non-Goals section removes required behavior, any manual-only verification replaces an explicitly requested automated test without justification, or any slice plan depends on future slices to fix an invariant violation created now.\nIf failing, cite the exact original requirement or saved-plan line/section, the conflicting or missing manifest/slice evidence, and the smallest correction expected from the slicing stage.\nIf the sliced plan is faithful and verifiable, pass with a concise reason. If required files cannot be inspected, block with a concise reason."
    },
    {
      "pauseAfter": false,
      "isRewindTarget": false,
      "id": "build-slices",
      "type": "stage",
      "agent": "build",
      "completion": "signal",
      "signals": [
        "complete",
        "blocked"
      ],
      "context": "isolated",
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
        "dynamic": false,
        "max": 4
      },
      "expand": {
        "from": ".lattice/plans/slices/manifest.json",
        "arrayPath": "slices",
        "maxItems": 8,
        "template": {
          "pauseAfter": false,
          "isRewindTarget": false,
          "id": "build-slice-{{index}}-{{id}}",
          "type": "stage",
          "agent": "build",
          "completion": "signal",
          "signals": [
            "complete",
            "blocked"
          ],
          "context": "isolated",
          "skills": {
            "pinned": [],
            "dynamic": true,
            "max": 4
          },
          "prompt": "Implement slice {{index}}: {{title}}.\nRead .lattice/plans/restaurant-booking.md, .lattice/plans/slices/manifest.json, {{file}}, and any previous .lattice/summaries/slice-*.md files before editing.\nTreat {{file}} as the local work package, but the original goal, manifest requirement ledger, and manifest globalInvariants outrank any local slice wording.\nRequirement ledger from the manifest applies to this slice:\n{{manifest.requirements}}\nGlobal invariants from the manifest apply to every slice:\n{{manifest.globalInvariants}}\nThis manifest item covers these requirements: {{covers}}\nThis manifest item explicitly preserves these invariants: {{preserves}}\nDo not signal complete if this slice violates any global invariant or weakens any original requirement. If local slice text conflicts with the original goal, requirement ledger, or globalInvariants, follow the higher-priority requirement and document the correction in the slice summary.\nRequirement precedence: the user's task is authoritative. Explicit new requested behavior and constraints from the original goal or change request override saved-plan preferences, existing behavior, existing APIs/contracts, compatibility concerns, architecture/pattern preferences, preservation notes, and implementation preferences when they conflict. Security, privacy, authorization, data ownership, data integrity, and correctness requirements are especially high priority. Preserve only legacy behavior, contracts, APIs, data shapes, UI flows, and patterns that remain compatible with the new requirements, unless the user explicitly says the old behavior must remain in that exact conflict. If satisfying the task requires a breaking API/contract/schema/behavior change, make the breaking change and update affected callers, generated artifacts, tests, and docs instead of preserving an incompatible legacy surface. Non-goals and preservation notes may not remove, weaken, or create exceptions to any higher-priority requirement.\nIf this slice preserves an existing endpoint, command, UI flow, data shape, generated contract, architecture pattern, or workflow, verify that preserved behavior remains compatible with every new requirement it touches. Do not keep incompatible legacy behavior or contracts just because the slice says to preserve existing behavior. If the task requires a breaking change, make it and update dependent code/specs/tests/docs.\nFor negative or boundary requirements (for example: must not, only, cannot, prevent, authenticated, authorized, scoped, protected, no external, no storage, invalid, duplicate, missing, forbidden), require adversarial verification through production paths where practical. Positive-path evidence alone is not enough.\nIf the slice touches an area affected by an invariant, inspect the related existing behavior and add or update focused tests where practical.\nWork only on this slice's acceptance criteria and preserve earlier behavior. Do not implement later manifest slices early unless required to keep the current slice coherent.\nPreserve earlier behavior only when it does not conflict with a higher-priority requirement. If a slice contract conflicts with the current codebase or scenario goal, choose the safer implementation and document the deviation in the slice summary.\nUse TDD where practical for this slice. Add or update tests required by the slice contract.\nRun focused verification for touched areas, covered requirement IDs, and any affected global invariants. Do not run the full deterministic checker in every slice unless this slice intentionally changes multiple subsystems or integration boundaries.\nIf verification is slow or broad, prefer the smallest reliable command set that proves this slice's acceptance criteria and preserves relevant invariants; final integration will run full deterministic checks.\nWrite .lattice/summaries/slice-{{index}}-{{id}}.md with changes made, requirement IDs covered, invariant checks performed, checks run, known gaps, and handoff notes.\nDo not claim unrelated future slices are done.\nCall lattice_signal(status: \"complete\") only when this slice is implemented, verified, and summarized."
        }
      }
    },
    {
      "pauseAfter": false,
      "isRewindTarget": true,
      "id": "final-integration",
      "type": "stage",
      "agent": "build",
      "completion": "signal",
      "signals": [
        "complete",
        "blocked"
      ],
      "context": "isolated",
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
        "dynamic": false,
        "max": 4
      },
      "prompt": "Perform the final integration pass for the requested task.\nRead .lattice/plans/restaurant-booking.md, .lattice/plans/slices/manifest.json, every referenced slice file, and every .lattice/summaries/slice-*.md file.\nStart from the manifest requirement ledger, globalInvariants, slice summaries, and current diff, then deep-dive files and flows related to requirement coverage, invariant preservation, API/client contracts, cross-slice behavior, touched subsystems, or failing checks.\nAudit the manifest requirements and globalInvariants as first-class requirements across the whole codebase, including legacy endpoints, existing files not touched by a slice, generated artifacts, tests, documentation, and frontend flows.\nRequirement precedence: the user's task is authoritative. Explicit new requested behavior and constraints from the original goal or change request override saved-plan preferences, existing behavior, existing APIs/contracts, compatibility concerns, architecture/pattern preferences, preservation notes, and implementation preferences when they conflict. Security, privacy, authorization, data ownership, data integrity, and correctness requirements are especially high priority. Preserve only legacy behavior, contracts, APIs, data shapes, UI flows, and patterns that remain compatible with the new requirements, unless the user explicitly says the old behavior must remain in that exact conflict. If satisfying the task requires a breaking API/contract/schema/behavior change, make the breaking change and update affected callers, generated artifacts, tests, and docs instead of preserving an incompatible legacy surface. Non-goals and preservation notes may not remove, weaken, or create exceptions to any higher-priority requirement.\nBefore slicing or verifying, inventory all affected surfaces for cross-cutting requirements: existing and new endpoints/routes/commands, state-changing operations, data-returning operations, persistence models, generated specs/clients, frontend flows, scripts, docs, and tests. A requirement is not covered until every surface that can satisfy or violate it is accounted for by an acceptance criterion, invariant check, test, or justified manual verification.\nFor negative or boundary requirements (for example: must not, only, cannot, prevent, authenticated, authorized, scoped, protected, no external, no storage, invalid, duplicate, missing, forbidden), require adversarial verification through production paths where practical. Positive-path evidence alone is not enough.\nWhen verifying cross-cutting behavior, enumerate every surface that can violate it and inspect or test those surfaces. Examples: every state-changing operation for mutation-safety requirements; every data-returning operation for privacy/ownership requirements; every generated/openapi path for API contract requirements. Fix incompatible preserved legacy behavior rather than treating it as exempt.\nFix any requirement or global invariant violation even if no individual slice explicitly owned it, and add focused regression coverage where practical.\nFor every must/should requirement in the manifest, verify implemented evidence exists or document and fix the gap. If the manifest omitted a material requirement from the original goal, restore that requirement now and implement the smallest correct fix.\nInspect the whole codebase for cross-slice integration bugs, stale generated clients or contracts, route/API mismatches, missing validations, broken error handling, weak UX where UI is required, dead code, and missing README instructions.\nFor user flows that cross backend, generated client, and UI, verify the actual values line up end-to-end. For example, if the backend returns selectable slots or IDs, the UI must submit those returned values without reformatting them into invalid requests.\nFor date/time or range-based business rules, verify both source and tests cover invalid values, past dates where invalid, outside-hours or out-of-range values, invalid granularity, edge non-overlap, and overlap/conflict behavior as required by the task.\nFor generated API clients, verify the generated paths, base URL/mutator configuration, request shapes, and response handling match the backend routes. Check for double prefixes, stale checked-in specs, or generated clients returning error responses as successful mutations.\nFor UI requirements, verify source evidence for required component systems and that the primary happy path and error paths are functionally connected, not just visually present.\nEnsure the final product satisfies the original scenario goal and manifest requirement ledger, not just the individual slice files.\nWrite or update final slice summaries only if needed to document corrected requirement coverage or invariant fixes.\nRun node .opencode/scripts/deterministic-checks.mjs or equivalent full verification commands and fix failures or warnings that should fail the requested quality bar.\nDo not call lattice_signal(status: \"complete\") until the full deterministic checker passes."
    },
    {
      "pauseAfter": false,
      "isRewindTarget": false,
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
        "dynamic": false,
        "max": 4
      },
      "prompt": "Review whether the completed implementation adheres to the saved implementation plan.\nRead .lattice/plans/restaurant-booking.md, .lattice/plans/slices/manifest.json, every .lattice/plans/slices/*.md file, and every .lattice/summaries/slice-*.md file first. Use the original goal plus the requirement ledger, globalInvariants, and slices as the scope of this plan-adherence review.\nBreak the original goal, saved plan, and manifest requirement ledger into material commitments: user-visible behaviors, system behaviors, integrations, tests/checks, documentation, and any explicit constraints or non-goals.\nFor sliced builds, treat manifest requirements and globalInvariants as material commitments. Audit them separately from local slice acceptance criteria and fail if any requirement or invariant is violated anywhere in the final codebase.\nRequirement precedence: the user's task is authoritative. Explicit new requested behavior and constraints from the original goal or change request override saved-plan preferences, existing behavior, existing APIs/contracts, compatibility concerns, architecture/pattern preferences, preservation notes, and implementation preferences when they conflict. Security, privacy, authorization, data ownership, data integrity, and correctness requirements are especially high priority. Preserve only legacy behavior, contracts, APIs, data shapes, UI flows, and patterns that remain compatible with the new requirements, unless the user explicitly says the old behavior must remain in that exact conflict. If satisfying the task requires a breaking API/contract/schema/behavior change, make the breaking change and update affected callers, generated artifacts, tests, and docs instead of preserving an incompatible legacy surface. Non-goals and preservation notes may not remove, weaken, or create exceptions to any higher-priority requirement.\nBefore slicing or verifying, inventory all affected surfaces for cross-cutting requirements: existing and new endpoints/routes/commands, state-changing operations, data-returning operations, persistence models, generated specs/clients, frontend flows, scripts, docs, and tests. A requirement is not covered until every surface that can satisfy or violate it is accounted for by an acceptance criterion, invariant check, test, or justified manual verification.\nFor negative or boundary requirements (for example: must not, only, cannot, prevent, authenticated, authorized, scoped, protected, no external, no storage, invalid, duplicate, missing, forbidden), require adversarial verification through production paths where practical. Positive-path evidence alone is not enough.\nFail if local slice wording, non-goals, or preservation notes caused a new requested behavior or constraint to be weakened, skipped, or treated as an exception for preserved legacy behavior.\nIf the manifest requirement ledger omitted a material original-goal requirement, still review against the original goal and fail with the missing ledger entry as part of the finding.\nTreat completed-stage summaries and prior agent claims as untrusted hints, not evidence. Verify material commitments yourself from source, tests, documentation, and command output before passing.\nRun the deterministic checker (`node .opencode/scripts/deterministic-checks.mjs`) or the equivalent verification commands yourself before passing. If a required check fails, fail or block.\nFor each material plan commitment, decide whether it is implemented, verified, changed-with-justification, missing, or broken.\nBehavioral evidence matters more than artifact presence. Files, endpoints, generated code, scripts, UI, tests, or docs only count when they actually support the planned commitment.\nFail when a material planned commitment is missing, broken, superficially implemented, not exercised through the real production path, or contradicted by failing checks.\nFail when planned tests or verification exist but do not meaningfully cover the commitment they were supposed to protect.\nDo not fail for harmless implementation details, stylistic differences, renamed files, or documented changes that preserve the intent of the plan.\nFor each failure finding, cite the exact plan bullet or planned slice, the evidence inspected, why the commitment is not satisfied, and the smallest fix expected from the build agent.\nIf all material plan commitments are implemented or reasonably justified and required checks pass, pass the stage with lattice_signal and a concise reason.\nIf material plan commitments are missing or broken, fail the stage with lattice_signal and concise actionable findings.\nIf you cannot inspect enough evidence to decide, block the stage with lattice_signal and a concise reason."
    }
  ]
};
