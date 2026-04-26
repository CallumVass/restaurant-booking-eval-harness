# Restaurant Booking Eval Results: Scenario 2

Generated: 2026-04-26T12:22:49.265Z

Costs use provider-reported costs where available. OpenAI GPT-5.5/GPT-5.5-fast costs are estimated from token counts using public GPT-5.5 pricing: $5/input 1M, $0.50/cached-input 1M, $30/output 1M.

| Rank | Variant | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | Completed | 86 | 12.0m | 5,785,397 | $4.800921 | Pass |
| 2 | `mimo-v2.5-pro-plan-mimo-v2.5-build` | Completed | 72 | 18.9m | 11,383,556 | $1.180013 | Pass |
| 3 | `qwen3.6-plus-high-plan-medium-build` | Completed | 67 | 41.0m | 21,082,012 | $1.388018 | Pass |
| 4 | `deepseek-v4-pro-plan-flash-build` | Completed | 66 | 29.8m | 21,004,354 | $0.772080 | Pass |

## Scenario 2 Scores

| Variant | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core | UI/UX | Typed Client | Plan Adherence |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 85 | 88 | 82 | 90 | 74 | 88 | 89 | 85 | 84 | 90 | 88 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build` | 70 | 76 | 67 | 69 | 55 | 72 | 74 | 80 | 76 | 64 | 66 |
| `qwen3.6-plus-high-plan-medium-build` | 64 | 73 | 54 | 66 | 50 | 72 | 72 | 76 | 73 | 52 | 56 |
| `deepseek-v4-pro-plan-flash-build` | 68 | 72 | 52 | 60 | 60 | 74 | 76 | 78 | 62 | 58 | 70 |

## Scenario-Specific Scores

| Variant | Auth Correctness | Auth Security | Booking Ownership | HTTP/OpenAPI Coverage | Frontend Flow Coverage | Generated Query Integration | Brownfield Integration | Regression Coverage |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 90 | 87 | 92 | 76 | 70 | 91 | 90 | 76 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build` | 82 | 35 | 86 | 58 | 22 | 48 | 76 | 56 |
| `qwen3.6-plus-high-plan-medium-build` | 72 | 42 | 65 | 55 | 15 | 35 | 76 | 52 |
| `deepseek-v4-pro-plan-flash-build` | 70 | 42 | 50 | 76 | 25 | 55 | 72 | 58 |

## Findings

- `openai-gpt-5.5-plan-build`: Best Scenario 2 result. It implemented the core authenticated booking behavior correctly with CSRF-protected cookie auth, user-scoped history, generated React Query hooks, documentation, and all deterministic gates passing. Deductions are now focused on incomplete HTTP/OpenAPI assertion depth and limited frontend integration coverage, not runtime/build failures.
- `mimo-v2.5-pro-plan-mimo-v2.5-build`: Runnable and deterministic-check clean with solid baseline preservation and a mostly functional authenticated booking flow. The largest correctness/security gap is ineffective CSRF enforcement despite cookie auth; coverage is also short because frontend tests are absent, generated TanStack Query hooks are not used, and backend HTTP/OpenAPI tests miss required boundaries.
- `qwen3.6-plus-high-plan-medium-build`: Runnable with a mostly functional backend auth/ownership model and preserved brownfield architecture. Main deductions are security and coverage gaps: CSRF is bypassed in local development and not wired through the generated client path, frontend tests are absent, generated TanStack Query hooks were not adopted, backend HTTP tests miss core authenticated/conflict scenarios, and a public all-bookings endpoint exposes other users' booking details.
- `deepseek-v4-pro-plan-flash-build`: Passes deterministic gates and adds substantial backend auth/account work with useful HTTP tests. Key requirements are undermined by unenforced CSRF validation, a public all-bookings endpoint leaking other users' booking data, and a frontend generated-client integration bug that prevents the real SPA from correctly displaying or using backend data.

## Totals

- Total archived variants: 4
- Completed: 4
- DNF: 0
- Total time: 101.7m
- Total tokens: 59,255,319
- Total cost: $8.141033
