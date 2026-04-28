# Restaurant Booking Eval Results: Scenario 2

Generated: 2026-04-28

Costs use archived provider-reported costs where available. OpenAI `gpt-5.5` is estimated from public pricing because provider metadata reported `0`; the estimate counts reasoning tokens as output tokens and includes cache-read input pricing.

## Summary

| Rank | Variant | Review | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | none | completed | 88 | 16m 38s | 269,990 | ~$6.45 | pass |
| 2 | `deepseek-v4-pro-plan-flash-build-mimo-review` | Mimo v2.5 Pro | judged after review retry exhausted | 82 | 36m 49s | 417,005 | $0.63 | pass |
| 3 | `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | DeepSeek V4 Pro | completed, review approved | 82 | 39m 51s | 401,441 | $1.59 | pass |
| 4 | `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Mimo v2.5 Pro | completed, review approved | 76 | 55m 11s | 774,259 | $0.52 | pass |
| 5 | `deepseek-v4-pro-plan-pro-build` | none | completed | 57 | 46m 16s | 220,110 | $0.65 | pass |

## Core Scores

| Variant | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core | UI/UX | Typed Client | Plan Quality | Plan Adherence |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 88 | 90 | 87 | 90 | 82 | 88 | 86 | 85 | 84 | 92 | 88 | 88 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | 82 | 86 | 76 | 81 | 77 | 79 | 80 | 82 | 80 | 72 | 82 | 82 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | 81 | 84 | 78 | 82 | 76 | 83 | 82 | 84 | 82 | 70 | 81 | 81 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | 76 | 78 | 77 | 74 | 72 | 80 | 80 | 82 | 78 | 86 | 76 | 76 |
| `deepseek-v4-pro-plan-pro-build` | 60 | 70 | 38 | 50 | 56 | 63 | 70 | 75 | 60 | 55 | 60 | 60 |

## Scenario-Specific Scores

| Variant | Auth Correctness | Auth Security | Booking Ownership | HTTP/OpenAPI Coverage | Frontend Flow Coverage | Generated Query Integration | Brownfield Integration | Regression Coverage |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 91 | 88 | 95 | 82 | 82 | 92 | 88 | 82 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | 84 | 78 | 62 | 72 | 60 | 70 | 84 | 78 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | 86 | 82 | 72 | 76 | 70 | 55 | 86 | 76 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | 80 | 58 | 55 | 78 | 55 | 86 | 82 | 70 |
| `deepseek-v4-pro-plan-pro-build` | 68 | 35 | 85 | 62 | 30 | 55 | 68 | 64 |

## Findings

- `openai-gpt-5.5-plan-build`: best Scenario 2 result. It delivered focused local cookie auth, CSRF protection, user-scoped bookings, generated TanStack Query integration, useful UI/test updates, and all deterministic checks passed. Main gaps were incomplete HTTP/OpenAPI-level error coverage, limited concurrency evidence for atomic conflict prevention, and missing CSRF header documentation in OpenAPI.
- `deepseek-v4-pro-plan-flash-build-mimo-review`: strong runnable result after review-driven retry, and the final workspace was judged after the single retry budget was exhausted. It implemented local cookie auth, CSRF handling, protected booking creation, `/mine` user history, generated client workflow, and a more polished UI. Main gap was that legacy public `GET /api/bookings` still exposed all bookings, including private user data.
- `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review`: strong brownfield result with all quality gates passing and most auth, CSRF, booking, UI, and test requirements implemented. Main deductions were the public all-bookings endpoint leaking other users' booking data, no generated TanStack Query hooks, and shallow ownership/OpenAPI/frontend integration coverage.
- `deepseek-v4-pro-plan-flash-sliced-build-mimo-review`: runnable and deterministic-check clean, with generally good brownfield integration and strong generated Orval/TanStack usage. It scored lower because CSRF was token-sent but not convincingly enforced for JSON mutations, public all-bookings still exposed other users' bookings, and frontend flow tests were shallow.
- `deepseek-v4-pro-plan-pro-build`: deterministic checks passed and backend ownership logic was partially implemented, but the submission was judged not reliably runnable. CSRF enforcement was effectively absent, the SPA misused generated Orval React Query response shapes, mutation success handlers read stale data, and README/test claims overstated CSRF coverage.

## Review Notes

- `openai-gpt-5.5-plan-build` and `deepseek-v4-pro-plan-pro-build` used no review stage.
- `deepseek-v4-pro-plan-flash-build-mimo-review` used Mimo v2.5 Pro review. The review triggered a retry that fixed an initial batch of issues; after the single retry budget was exhausted, the second review still found issues. Deterministic checks passed, so the harness judged the final workspace.
- `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` used native dynamic slices plus Mimo review and completed with review approval, but still missed core auth-security/ownership details.
- `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` used DeepSeek V4 Pro review and completed with review approval.

## Totals

- Total reported runs: 5
- Completed pipelines: 4
- Judged after review retry exhausted: 1
- DNF: 0
- Total time: 3h 14m 47s
- Total tokens: 2,082,805
- Total provider-reported + estimated OpenAI cost: ~$9.79
