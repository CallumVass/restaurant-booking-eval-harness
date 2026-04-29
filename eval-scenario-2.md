# Restaurant Booking Eval Results: Scenario 2

Generated: 2026-04-29

Costs use archived provider-reported costs where available. OpenAI `gpt-5.5` is estimated from public pricing because provider metadata reported `0`; the estimate counts reasoning tokens as output tokens and includes cache-read input pricing.

## Summary

| Rank | Variant | Review | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | none | completed | 88 | 16m 38s | 269,990 | ~$6.45 | pass |
| 2 | `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Mimo v2.5 Pro | completed, review approved | 87 | 1h 23m 16s | 1,220,714 | $0.96 | pass |
| 3 | `deepseek-v4-pro-plan-flash-build-mimo-review` | Mimo v2.5 Pro | judged after review retry exhausted | 82 | 36m 49s | 417,005 | $0.63 | pass |
| 4 | `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | DeepSeek V4 Pro | completed, review approved | 82 | 39m 51s | 401,441 | $1.59 | pass |
| 5 | `deepseek-v4-pro-plan-pro-build` | none | completed | 57 | 46m 16s | 220,110 | $0.65 | pass |

## Core Scores

| Variant | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core | UI/UX | Typed Client | Plan Quality | Plan Adherence |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 88 | 90 | 87 | 90 | 82 | 88 | 86 | 85 | 84 | 92 | 88 | 88 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | 86 | 89 | 84 | 88 | 83 | 85 | 85 | 82 | 82 | 86 | 86 | 86 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | 82 | 86 | 76 | 81 | 77 | 79 | 80 | 82 | 80 | 72 | 82 | 82 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | 81 | 84 | 78 | 82 | 76 | 83 | 82 | 84 | 82 | 70 | 81 | 81 |
| `deepseek-v4-pro-plan-pro-build` | 60 | 70 | 38 | 50 | 56 | 63 | 70 | 75 | 60 | 55 | 60 | 60 |

## Scenario-Specific Scores

| Variant | Auth Correctness | Auth Security | Booking Ownership | HTTP/OpenAPI Coverage | Frontend Flow Coverage | Generated Query Integration | Brownfield Integration | Regression Coverage |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 91 | 88 | 95 | 82 | 82 | 92 | 88 | 82 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | 90 | 84 | 92 | 82 | 76 | 86 | 88 | 82 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | 84 | 78 | 62 | 72 | 60 | 70 | 84 | 78 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | 86 | 82 | 72 | 76 | 70 | 55 | 86 | 76 |
| `deepseek-v4-pro-plan-pro-build` | 68 | 35 | 85 | 62 | 30 | 55 | 68 | 64 |

## Findings

- `openai-gpt-5.5-plan-build`: best Scenario 2 result by one point. It delivered focused local cookie auth, CSRF protection, user-scoped bookings, generated TanStack Query integration, useful UI/test updates, and all deterministic checks passed. Main gaps were incomplete HTTP/OpenAPI-level error coverage, limited concurrency evidence for atomic conflict prevention, and missing CSRF header documentation in OpenAPI.
- `deepseek-v4-pro-plan-flash-sliced-build-mimo-review`: strongest open-model Scenario 2 result after the generic precedence/surface-inventory prompt changes. It removed the incompatible legacy public `GET /api/bookings`, scoped booking history to `/api/bookings/mine`, enforced CSRF on auth and booking mutations, used generated Orval React Query hooks, and passed all deterministic checks. Remaining deductions were mocked-only frontend auth/client tests, shallow live OpenAPI metadata assertions, no concurrent conflict test, and less explicit generated-client credential handling.
- `deepseek-v4-pro-plan-flash-build-mimo-review`: strong runnable result after review-driven retry, and the final workspace was judged after the single retry budget was exhausted. It implemented local cookie auth, CSRF handling, protected booking creation, `/mine` user history, generated client workflow, and a more polished UI. Main gap was that legacy public `GET /api/bookings` still exposed all bookings, including private user data.
- `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review`: strong brownfield result with all quality gates passing and most auth, CSRF, booking, UI, and test requirements implemented. Main deductions were the public all-bookings endpoint leaking other users' booking data, no generated TanStack Query hooks, and shallow ownership/OpenAPI/frontend integration coverage.
- `deepseek-v4-pro-plan-pro-build`: deterministic checks passed and backend ownership logic was partially implemented, but the submission was judged not reliably runnable. CSRF enforcement was effectively absent, the SPA misused generated Orval React Query response shapes, mutation success handlers read stale data, and README/test claims overstated CSRF coverage.

## Review Notes

- `openai-gpt-5.5-plan-build` and `deepseek-v4-pro-plan-pro-build` used no review stage.
- `deepseek-v4-pro-plan-flash-build-mimo-review` used Mimo v2.5 Pro review. The review triggered a retry that fixed an initial batch of issues; after the single retry budget was exhausted, the second review still found issues. Deterministic checks passed, so the harness judged the final workspace.
- `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` used native dynamic slices plus Mimo review and completed with review approval. The latest sliced run used five manifest-derived slices and fixed the previous CSRF and public all-bookings ownership failures by treating new task requirements as higher priority than incompatible legacy behavior.
- `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` used DeepSeek V4 Pro review and completed with review approval.

## Totals

- Total reported runs: 5
- Completed pipelines: 4
- Judged after review retry exhausted: 1
- DNF: 0
- Total time: 3h 42m 51s
- Total tokens: 2,529,260
- Total provider-reported + estimated OpenAI cost: ~$10.23
