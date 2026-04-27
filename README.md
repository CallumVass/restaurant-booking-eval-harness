# Restaurant Booking Eval Harness

Runs an OpenCode + Lattice eval where each model variant builds a .NET 10 API and React SPA for a restaurant booking system. Results are judged by an LLM with structured output.

## Prerequisites

- Node/npm/npx
- .NET SDK 10
- OpenCode provider credentials configured for the models in `models.json`

This machine currently has Node `25.9.0`, npm/npx `11.12.1`, and .NET SDK `10.0.107`.

## Files

- `models.json`: phase-specific model variants and judge model.
- `scenarios/`: required scenario prompts sent to the Lattice pipeline.
- `templates/lattice-pipeline.ts`: project-local Lattice pipeline copied into each fresh run workspace.
- `scripts/install-skills.sh`: installs the pinned skills into the run workspace.
- `src/run.ts`: orchestrates workspace creation, OpenCode startup, Lattice execution, verification, and judging.
- `baselines/`: optional sanitized source snapshots used to seed brownfield scenario workspaces.
- `skills-lock.json`: lock file produced by the Skills CLI for the selected skills.
- `runs/`: legacy generated per-run workspaces.
- `run-archive/scenario-<n>/`: completed run workspaces, each containing its own `result.json`.
- `results/`: legacy result summaries.

## Install

```bash
npm install
```

## Run One Variant

```bash
npm start -- --2 --base ./baselines/scenario-2 --variant openai-gpt-5.5-plan-build
```

## Run All Variants

```bash
npm start -- --2 --base ./baselines/scenario-2
```

## Current Model Matrix

The current default matrix is intentionally small. It reflects prior exploratory runs where broad model sweeps were less useful than testing a few clear planner/builder/reviewer combinations.

| Variant | Plan | Build | Review | Use |
|---|---|---|---|---|
| `openai-gpt-5.5-plan-build` | OpenAI GPT-5.5 | OpenAI GPT-5.5 | none | Proprietary quality reference. Review was not materially useful in prior OpenAI runs. |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | DeepSeek V4 Pro | DeepSeek V4 Flash | Mimo v2.5 Pro | Tests whether cheap DeepSeek implementation plus independent open-model review beats paying for Pro implementation. |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | DeepSeek V4 Pro big plan | DeepSeek V4 Flash sliced execution | Mimo v2.5 Pro | A/B test for whether fresh-context sliced execution improves the current DeepSeek Flash implementation gap while keeping the same planner/reviewer. |
| `deepseek-v4-pro-plan-pro-build` | DeepSeek V4 Pro | DeepSeek V4 Pro | none | Open-model quality ceiling/control without review overhead. |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | Mimo v2.5 Pro | Mimo v2.5 | DeepSeek V4 Pro | Tests Mimo planning/building with independent DeepSeek review. |

The `review` field in `models.json` is optional. When a variant omits `review`, the generated workspace pipeline excludes the `plan-adherence-review` stage. When present, the review stage is included and uses the configured review model/options.

`plan.mode` and `build.mode` are optional. Defaults preserve the original behavior: `plan.mode: "big"` and `build.mode: "single"`. A sliced build keeps the big plan available, normalizes it into a task-specific `.lattice/plans/slices/manifest.json` plus referenced slice files, runs generic numbered slice slots in fresh subagent contexts, then runs a final integration stage before optional review. The slice names, count, order, and acceptance criteria come from the generated plan, not from restaurant-specific harness phases.

## Review Strategy

The plan-adherence review is a scoped reviewer, not the final judge. It reads `.lattice/plans/restaurant-booking.md`, treats prior stage summaries as untrusted hints, and verifies whether the material commitments in the saved plan were implemented.

Prior exploratory runs suggested:

- OpenAI plan/build runs generally followed the plan well; review added time and did not improve scores.
- Same-model review was weak for weaker implementations because it tended to rubber-stamp the builder's assumptions.
- Cross-model open review is more promising because it gives the builder independent feedback without using a proprietary reviewer.
- Review is only worth its overhead when it catches material misses and triggers a rewind/retry.
- Brownfield/security/ownership scenarios benefited more from review than greenfield Scenario 1-style builds.

For future comparisons, keep no-review and review variants distinct in `models.json` so before/after effects remain visible in `run-archive/`.

## Useful Options

```bash
npm start -- --variant moonshot-kimi-k2.6-high-plan-medium-build --timeoutMs 4500000
npm start -- --1 --variant moonshot-kimi-k2.6-high-plan-medium-build --runRetries 2
npm start -- --1 --skipSkills
npm start -- --scenario 2 --models ./models.json
npm start -- --scenario 2 --base ./baselines/scenario-2
npm start -- --1 --task ./scenarios/1.md
EVAL_RUNS_DIR=/tmp/my-eval-runs npm start -- --1
EVAL_ARCHIVE_DIR=/tmp/my-eval-archive npm start -- --1
```

The scenario argument is required. Use `--1`, `--2`, `--scenario 1`, or `--scenario 2`.

`--skipSkills` is useful for smoke-testing the harness wiring. Real eval runs should keep skills enabled.

`--runRetries` controls whole-run retries for transient pipeline failures. It defaults to `1`, so each variant gets up to two attempts. Retries only happen when the pipeline fails or times out and deterministic checks do not already pass.

## Brownfield Scenarios

Use `--base <path>` or `--baseline <path>` to seed every run workspace from an existing project before the Lattice/OpenCode harness files are installed. This makes a scenario a true brownfield extension instead of a prompt-only instruction to reuse prior work.

Recommended workflow for a scenario that extends a neutral Scenario 2 baseline:

1. Create a sanitized baseline directory, for example `baselines/scenario-2/`.
2. Copy only project source from the selected Scenario 1 archive into that baseline.
3. Include useful project files such as `backend/`, `frontend/`, `RestaurantBooking.slnx`, `.editorconfig`, and `README.md`.
4. Exclude eval/runtime files such as `.opencode/`, `.agents/`, `.lattice/`, `result.json`, `node_modules/`, `bin/`, `obj/`, `dist/`, and `coverage/`.
5. Run with `npm start -- --scenario 2 --base ./baselines/scenario-2`.

The runner also excludes those eval/runtime paths while copying a baseline, so archived runs can be used directly in a pinch. A curated `baselines/` snapshot is still preferable because it is stable, reviewable, and avoids carrying stale generated eval state into future comparisons.

## Result Shape

Each result includes:

- variant id
- scenario id
- attempt number, max attempts, and whether the archived attempt was retryable
- baseline path when a run was seeded from existing source
- run workspace path
- duration
- latest `.lattice/state/*.json` pipeline state
- generated implementation plan from `.lattice/plans/restaurant-booking.md`
- token/cost telemetry totals, per-stage Lattice telemetry, and judge telemetry
- verification command results
- generated file tree
- LLM judge scores and findings

The judge schema includes `scenarioScores` and `scenarioFindings` for scenario-specific scoring dimensions. Brownfield runs automatically ask the judge to include `baselinePreservation`, `changeMinimality`, `integrationQuality`, and `regressionSafety` score entries.

## Publish Results

The `docs/` directory is a GitHub Pages-ready site with summary tables and links to the archived eval solutions in GitHub. To publish it, enable GitHub Pages for the repository and choose the `docs/` folder as the Pages source.

The public-facing reports are:

- `docs/index.md`: website landing page with solution links.
- `eval-scenario-1.md`: detailed scenario 1 report.
- `eval-scenario-2.md`: detailed scenario 2 report.

The `run-archive/` directory contains the generated solutions and `result.json` files. Archive-level `.gitignore` rules keep generated dependency folders, build outputs, runtime state, and environment files out of the public repo while preserving source and evaluation evidence.

## Deterministic Checks

The build stage post-hook and final runner both use `.opencode/scripts/deterministic-checks.mjs`. The checker discovers the generated solution/project and frontend package directory, then enforces:

- `dotnet build <solution-or-project> -p:TreatWarningsAsErrors=true`
- `dotnet test <solution-or-project> --no-build`
- `dotnet format <solution-or-project> --verify-no-changes`
- `npm --prefix <frontend-package-dir> install`
- `npm --prefix <frontend-package-dir> run build`
- `npm --prefix <frontend-package-dir> run typecheck`
- `npm --prefix <frontend-package-dir> run lint`
- `npm --prefix <frontend-package-dir> run format:check`
- `npm --prefix <frontend-package-dir> run deadcode`

The LLM judge is instructed to treat these command results as mandatory evidence and to fail the relevant boolean fields when commands fail or scripts are missing.

## Notes

- The harness generates `opencode.json` per workspace with separate model/options for `eval-planner` and `build` agents.
- `eval-planner` is a custom subagent with edit permission so the plan can be persisted before implementation.
- Current default variants use phase-specific models: heavier/high-reasoning planning and medium/faster build settings.
- `openai/*` exposes named reasoning variants in OpenCode metadata. Several `opencode-go/*` models expose reasoning capability but no named variants, so their `reasoningEffort` settings are passed as provider options and should be treated as best-effort.
- Lattice is loaded through the `@callumvass/lattice` OpenCode plugin.
- The Skills CLI installs to `.agents/skills`; the runner syncs that directory to `.opencode/skills` because Lattice discovers OpenCode skills there.
- Active run workspaces are created in `/tmp/restaurant-booking-eval-harness-active` by default so agents cannot see harness code or archived results.
- Completed workspaces are moved to `run-archive/scenario-<n>/<run-id>/` with the run's `result.json` stored alongside the generated code.
- OpenCode external-directory access is limited to `/tmp/*` to reduce accidental access to prior runs/results and the harness source.
- The pipeline has no approval gate so it can run unattended.
- The build stage has one post-hook retry for the deterministic checker.
