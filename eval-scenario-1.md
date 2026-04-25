# Restaurant Booking Eval Results: Scenario 1

Generated: 2026-04-25T19:35:13.586Z

Costs use provider-reported costs where available. OpenAI GPT-5.5/GPT-5.5-fast costs are estimated from token counts using public GPT-5.5 pricing: $5/input 1M, $0.50/cached-input 1M, $30/output 1M.

| Rank | Variant | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | Completed | 91 | 12.6m | 4,237,796 | $3.646083 | Pass |
| 2 | `deepseek-v4-pro-plan-flash-build` | Completed | 88 | 22.3m | 11,359,693 | $0.398040 | Pass |
| 3 | `mimo-v2.5-pro-plan-mimo-v2.5-build` | Completed | 74 | 15.4m | 10,325,013 | $0.974228 | Pass |
| 4 | `qwen3.6-plus-high-plan-medium-build` | Completed | 72 | 25.9m | 9,474,158 | $0.643007 | Pass |

## Scenario 1 Scores

| Variant | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core | UI/UX | Typed Client | Plan Adherence |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 92 | 92 | 89 | 92 | 84 | 89 | 88 | 90 | 85 | 90 | 91 |
| `deepseek-v4-pro-plan-flash-build` | 89 | 91 | 84 | 89 | 82 | 85 | 87 | 89 | 78 | 88 | 84 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build` | 76 | 83 | 58 | 78 | 74 | 72 | 70 | 82 | 46 | 10 | 61 |
| `qwen3.6-plus-high-plan-medium-build` | 70 | 84 | 50 | 62 | 82 | 78 | 78 | 70 | 66 | 58 | 78 |

## Scenario-Specific Scores

| Variant | Tailwind/shadcn | TanStack | OpenAPI Typed Client | Booking Rules | Frontend Runtime/Polish | Deterministic Quality |
|---|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 86 | 88 | 90 | 93 | 84 | 100 |
| `deepseek-v4-pro-plan-flash-build` | 88 | 86 | 90 | 90 | 78 | 100 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build` | 35 | 82 | 10 | 78 | 45 | 100 |
| `qwen3.6-plus-high-plan-medium-build` | 78 | 82 | 58 | 84 | 42 | 100 |

## Findings

- `openai-gpt-5.5-plan-build`: Strongest current Scenario 1 result. All deterministic checks passed, backend rule coverage was solid, conflict prevention rechecked under a lock, and the frontend used Tailwind, shadcn-style components, TanStack Query, and an Orval-generated typed client. Main deductions were missing HTTP/frontend tests and manual TanStack Query wrappers around generated fetch functions rather than generated query hooks.
- `deepseek-v4-pro-plan-flash-build`: Strong runnable implementation with all deterministic checks passing, clean domain validation/conflict/availability logic, shadcn/Tailwind UI, TanStack Query, and Orval `react-query` generation. Main deductions were limited API-level tests, standard/basic frontend composition, and availability returning empty slots rather than explicit validation errors for party sizes above table capacity.
- `mimo-v2.5-pro-plan-mimo-v2.5-build`: Runnable and deterministic-check clean with a mostly correct backend core and good TanStack Query use. Major scenario deductions were no actual shadcn/ui component usage, no OpenAPI-generated typed client in frontend runtime use, conservative availability calculation across multiple tables, and non-atomic conflict prevention under concurrent requests.
- `qwen3.6-plus-high-plan-medium-build`: Strong backend tests and all deterministic gates passed, but the frontend generated-client integration had a serious runtime response-shape mismatch. Additional deductions were invalid available-slot requests returning empty lists instead of explicit validation errors, non-atomic booking persistence, and manual/reproducibility gaps in OpenAPI client generation.
## Totals

- Total archived variants: 4
- Completed: 4
- DNF: 0
- Total time: 76.3m
- Total tokens: 35,396,660
- Total cost: $5.661358
