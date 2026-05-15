# Restaurant Booking Eval Results: Scenario 2

Generated: 2026-05-15

Scenario 2 is a brownfield auth/security extension: local cookie auth, CSRF protection, user-owned bookings, protected booking history, generated client integration, and regression coverage on the existing booking app. This report now includes the latest `pi-single` bounded-swarm OpenAI runs, which used Pi delegation through `delegate_workflow`.

Costs use archived provider-reported costs where available plus estimated OpenAI costs. Older OpenAI archives reported provider cost as `0`, so public-price estimates are approximate.

## Summary

| Rank | Variant | Backend | Delegation | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | Lattice | none | completed | 88 | 16.6m | 269,990 | ~$6.45 | pass |
| 1 | `openai-gpt-5.5-plan-build` | Pi single | bounded swarm, 2 `delegate_workflow` calls | completed | 88 | 12.9m | 490,286 | ~$4.66 | pass |
| 3 | `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Lattice | staged sliced + review | completed, review approved | 87 | 83.3m | 1,220,714 | $0.86 | pass |
| 4 | `deepseek-v4-pro-plan-flash-build-mimo-review` | Lattice | staged review | judged after review retry exhausted | 82 | 36.8m | 417,005 | $0.68 | pass |
| 6 | `deepseek-v4-pro-plan-flash-build-mimo-review` | Pi single | delegated swarm, 3 `delegate_workflow` calls | completed with semantic probe failure | 77 | 29.3m | 281,351 | ~$0.18 | fail |
| 4 | `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | Lattice | staged review | completed, review approved | 82 | 39.9m | 401,441 | $1.50 | pass |
| 7 | `deepseek-v4-pro-plan-pro-build` | Lattice | none | completed | 57 | 46.3m | 220,110 | $0.65 | pass |

## Core Scores

| Variant | Backend | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core | UI/UX | Typed Client | Plan Quality | Plan Adherence |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | Lattice | 88 | 90 | 87 | 90 | 82 | 88 | 86 | 85 | 84 | 92 | 88 | 88 |
| `openai-gpt-5.5-plan-build` | Pi single bounded swarm, medium | 89 | 90 | 88 | 90 | 82 | 88 | 88 | 90 | 86 | 92 | 89 | 89 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Lattice sliced | 86 | 89 | 84 | 88 | 83 | 85 | 85 | 82 | 82 | 86 | 86 | 86 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Lattice | 82 | 86 | 76 | 81 | 77 | 79 | 80 | 82 | 80 | 72 | 82 | 82 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Pi single delegated swarm | 76 | 81 | 70 | 75 | 63 | 76 | 78 | 80 | 78 | 82 | 76 | 76 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | Lattice | 81 | 84 | 78 | 82 | 76 | 83 | 82 | 84 | 82 | 70 | 81 | 81 |
| `deepseek-v4-pro-plan-pro-build` | Lattice | 60 | 70 | 38 | 50 | 56 | 63 | 70 | 75 | 60 | 55 | 60 | 60 |

## Scenario-Specific Scores

| Variant | Backend | Auth Correctness | Auth Security | Booking Ownership | HTTP/OpenAPI | Frontend Flow | Generated Query | Brownfield | Regression |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | Lattice | 91 | 88 | 95 | 82 | 82 | 92 | 88 | 82 |
| `openai-gpt-5.5-plan-build` | Pi single bounded swarm, medium | 91 | 88 | 94 | 80 | 80 | 92 | 90 | 82 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Lattice sliced | 90 | 84 | 92 | 82 | 76 | 86 | 88 | 82 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Lattice | 84 | 78 | 62 | 72 | 60 | 70 | 84 | 78 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Pi single delegated swarm | 82 | 72 | 55 | 65 | 35 | 78 | 78 | 66 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | Lattice | 86 | 82 | 72 | 76 | 70 | 55 | 86 | 76 |
| `deepseek-v4-pro-plan-pro-build` | Lattice | 68 | 35 | 85 | 62 | 30 | 55 | 68 | 64 |

## Delegation Findings

- **OpenAI Pi single bounded swarm, medium balanced profile** tied the original OpenAI score (`88`) while reducing wall time from 16.6m to 12.9m, delegated-worker-inclusive tokens from 269,990 to 490,286, while estimated cost still fell from roughly `$6.45` to `$4.66`. It used two unique `delegate_workflow` calls and no `delegate_task` calls.
- Medium-thinking implementation appears important for Scenario 2: auth, CSRF, OpenAPI, generated client, frontend tests, and ownership rules are cross-surface work.
- DeepSeek Flash Pi single was cheaper/faster than its original Lattice run, but dropped from `82` to `77` and failed the semantic probe because public `GET /api/bookings` still leaked user booking records.

## Findings

- `openai-gpt-5.5-plan-build` (Pi single bounded swarm, medium): strongest latest delegated result. It substantially satisfied auth, CSRF, ownership, generated client usage, UI integration, and deterministic gates. Remaining gaps were OpenAPI-depth assertions and a few missing frontend/auth regression tests.
- `openai-gpt-5.5-plan-build` (Lattice): original best baseline. It delivered focused cookie auth, CSRF, user-scoped bookings, generated TanStack Query integration, useful UI/test updates, and passing checks. Main gaps were incomplete HTTP/OpenAPI-level error coverage, limited concurrency evidence, and missing CSRF header documentation in OpenAPI.
- `deepseek-v4-pro-plan-flash-build-mimo-review` (Pi single delegated swarm): cheaper and faster than the original DeepSeek Flash Lattice run, but worse quality. It left public all-bookings leakage, no frontend tests, missing live OpenAPI tests, and unprotected registration CSRF.
- `deepseek-v4-pro-plan-flash-sliced-build-mimo-review`: strongest open-model Scenario 2 result. It fixed prior CSRF and public all-bookings ownership failures, though it remained slow/token-heavy and had thinner frontend auth/client integration tests.

## Totals

- Total reported runs: 7
- Delegated Pi single runs highlighted: 2
- Completed pipelines: 6
- Judged after review retry exhausted: 1
- DNF: 0
