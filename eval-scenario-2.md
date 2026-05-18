# Restaurant Booking Eval Results: Scenario 2

Generated: 2026-05-15

Scenario 2 is a brownfield auth/security extension: local cookie auth, CSRF protection, user-owned bookings, protected booking history, generated client integration, and regression coverage on the existing booking app.

Costs use archived provider-reported costs where available plus estimated OpenAI costs. Older OpenAI archives reported provider cost as `0`, so public-price estimates are approximate.

## Summary

| Rank | Variant | Backend | Pipeline | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | Lattice | plan + build | completed | 88 | 16.6m | 269,990 | ~$6.45 | pass |
| 2 | `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Lattice | staged sliced + review | completed, review approved | 87 | 83.3m | 1,220,714 | $0.86 | pass |
| 3 | `deepseek-v4-pro-plan-flash-build-mimo-review` | Lattice | staged review | judged after review retry exhausted | 82 | 36.8m | 417,005 | $0.68 | pass |
| 3 | `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | Lattice | staged review | completed, review approved | 82 | 39.9m | 401,441 | $1.50 | pass |
| 5 | `deepseek-v4-pro-plan-pro-build` | Lattice | plan + build | completed | 57 | 46.3m | 220,110 | $0.65 | pass |

## Core Scores

| Variant | Backend | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core | UI/UX | Typed Client | Plan Quality | Plan Adherence |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | Lattice | 88 | 90 | 87 | 90 | 82 | 88 | 86 | 85 | 84 | 92 | 88 | 88 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Lattice sliced | 86 | 89 | 84 | 88 | 83 | 85 | 85 | 82 | 82 | 86 | 86 | 86 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Lattice | 82 | 86 | 76 | 81 | 77 | 79 | 80 | 82 | 80 | 72 | 82 | 82 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | Lattice | 81 | 84 | 78 | 82 | 76 | 83 | 82 | 84 | 82 | 70 | 81 | 81 |
| `deepseek-v4-pro-plan-pro-build` | Lattice | 60 | 70 | 38 | 50 | 56 | 63 | 70 | 75 | 60 | 55 | 60 | 60 |

## Scenario-Specific Scores

| Variant | Backend | Auth Correctness | Auth Security | Booking Ownership | HTTP/OpenAPI | Frontend Flow | Generated Query | Brownfield | Regression |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | Lattice | 91 | 88 | 95 | 82 | 82 | 92 | 88 | 82 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Lattice sliced | 90 | 84 | 92 | 82 | 76 | 86 | 88 | 82 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Lattice | 84 | 78 | 62 | 72 | 60 | 70 | 84 | 78 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | Lattice | 86 | 82 | 72 | 76 | 70 | 55 | 86 | 76 |
| `deepseek-v4-pro-plan-pro-build` | Lattice | 68 | 35 | 85 | 62 | 30 | 55 | 68 | 64 |

- Medium-thinking implementation appears important for Scenario 2: auth, CSRF, OpenAPI, generated client, frontend tests, and ownership rules are cross-surface work.

## Findings

- `openai-gpt-5.5-plan-build` (Lattice): original best baseline. It delivered focused cookie auth, CSRF, user-scoped bookings, generated TanStack Query integration, useful UI/test updates, and passing checks. Main gaps were incomplete HTTP/OpenAPI-level error coverage, limited concurrency evidence, and missing CSRF header documentation in OpenAPI.
- `deepseek-v4-pro-plan-flash-sliced-build-mimo-review`: strongest open-model Scenario 2 result. It fixed prior CSRF and public all-bookings ownership failures, though it remained slow/token-heavy and had thinner frontend auth/client integration tests.

## Totals

- Total reported runs: 5
- Completed pipelines: 4
- Judged after review retry exhausted: 1
- DNF: 0
