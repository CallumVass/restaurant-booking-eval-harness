# Restaurant Booking Eval Results: Scenario 2

Generated: 2026-04-26T11:18:51.065Z

Costs use provider-reported costs where available. OpenAI GPT-5.5/GPT-5.5-fast costs are estimated from token counts using public GPT-5.5 pricing: $5/input 1M, $0.50/cached-input 1M, $30/output 1M.

| Rank | Variant | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | Completed | 82 | 12.0m | 5,785,397 | $4.800921 | Pass |
| 2 | `deepseek-v4-pro-plan-flash-build` | Completed | 78 | 29.8m | 21,004,354 | $0.772080 | Pass |
| 3 | `mimo-v2.5-pro-plan-mimo-v2.5-build` | Completed | 72 | 18.9m | 11,383,556 | $1.180013 | Pass |
| 4 | `qwen3.6-plus-high-plan-medium-build` | Completed | 68 | 41.0m | 21,082,012 | $1.388018 | Pass |

## Scenario 2 Scores

| Variant | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core | UI/UX | Typed Client | Plan Adherence |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 84 | 88 | 78 | 84 | 70 | 84 | 85 | 82 | 80 | 88 | 86 |
| `deepseek-v4-pro-plan-flash-build` | 79 | 83 | 74 | 78 | 66 | 80 | 82 | 80 | 76 | 76 | 76 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build` | 73 | 78 | 63 | 72 | 55 | 75 | 78 | 80 | 75 | 65 | 66 |
| `qwen3.6-plus-high-plan-medium-build` | 67 | 76 | 56 | 66 | 52 | 70 | 72 | 78 | 62 | 45 | 56 |

## Scenario-Specific Scores

| Variant | Auth Correctness | Auth Security | Booking Ownership | HTTP/OpenAPI Coverage | Frontend Flow Coverage | Generated Query Integration | Brownfield Integration | Regression Coverage |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 88 | 82 | 90 | 74 | 58 | 90 | 86 | 70 |
| `deepseek-v4-pro-plan-flash-build` | 84 | 62 | 82 | 78 | 40 | 74 | 84 | 68 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build` | 82 | 40 | 88 | 55 | 20 | 45 | 78 | 52 |
| `qwen3.6-plus-high-plan-medium-build` | 70 | 35 | 78 | 58 | 18 | 35 | 72 | 55 |

## Findings

- `openai-gpt-5.5-plan-build`: Best Scenario 2 result. It added local cookie auth, CSRF-protected state-changing endpoints, user-owned booking history, generated React Query client usage, README updates, and all mandatory deterministic gates passed. Main deductions were a non-passing frontend test suite when run directly, partial HTTP-level edge coverage, and shallow OpenAPI assertions.
- `deepseek-v4-pro-plan-flash-build`: Strong brownfield integration with passing deterministic gates and most backend auth/ownership behavior implemented. Main deductions were incomplete proof of CSRF enforcement on JSON mutation endpoints, manual fetch-based auth despite generated client support, shallow frontend flow tests, and a weak booking-history isolation test setup.
- `mimo-v2.5-pro-plan-mimo-v2.5-build`: Runnable and deterministic-check clean with core auth and user-scoped booking behavior. Major deductions were ineffective CSRF enforcement, no frontend tests, use of generated fetch operations plus manual TanStack wrappers instead of generated query hooks, and incomplete HTTP/OpenAPI regression coverage.
- `qwen3.6-plus-high-plan-medium-build`: Meaningful backend auth/history work and preserved brownfield structure, but lower security and frontend scores. CSRF is disabled in local development/test, SPA mutation calls do not send the documented CSRF header through the generated client, register/sign-in mode switching is broken, frontend tests are absent, and generated TanStack Query hooks were not adopted.

## Totals

- Total archived variants: 4
- Completed: 4
- DNF: 0
- Total time: 101.7m
- Total tokens: 59,255,319
- Total cost: $8.141033
