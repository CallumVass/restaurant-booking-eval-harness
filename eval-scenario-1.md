# Restaurant Booking Eval Results: Scenario 1

Generated: 2026-04-26T12:22:49.265Z

Costs use provider-reported costs where available. OpenAI GPT-5.5/GPT-5.5-fast costs are estimated from token counts using public GPT-5.5 pricing: $5/input 1M, $0.50/cached-input 1M, $30/output 1M.

| Rank | Variant | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | Completed | 92 | 12.6m | 4,237,796 | $3.646083 | Pass |
| 2 | `mimo-v2.5-pro-plan-mimo-v2.5-build` | Completed | 78 | 15.4m | 10,325,013 | $0.974228 | Pass |
| 3 | `deepseek-v4-pro-plan-flash-build` | Completed | 76 | 22.3m | 11,359,693 | $0.398040 | Pass |
| 4 | `qwen3.6-plus-high-plan-medium-build` | Completed | 74 | 25.9m | 9,474,158 | $0.643007 | Pass |

## Scenario 1 Scores

| Variant | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core | UI/UX | Typed Client | Plan Adherence |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 94 | 94 | 91 | 93 | 84 | 89 | 90 | 91 | 88 | 91 | 93 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build` | 77 | 86 | 66 | 82 | 80 | 78 | 82 | 86 | 70 | 10 | 70 |
| `deepseek-v4-pro-plan-flash-build` | 82 | 86 | 62 | 68 | 75 | 80 | 82 | 84 | 72 | 70 | 76 |
| `qwen3.6-plus-high-plan-medium-build` | 78 | 86 | 58 | 68 | 80 | 76 | 82 | 78 | 74 | 55 | 78 |

## Scenario-Specific Scores

| Variant | Tailwind/shadcn | TanStack | OpenAPI Typed Client | Booking Rules | Responsive Polish | Deterministic Quality |
|---|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 92 | 95 | 90 | 94 | 88 | 100 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build` | 45 | 90 | 10 | 82 | 70 | 100 |
| `deepseek-v4-pro-plan-flash-build` | 90 | 80 | 72 | 84 | 70 | 100 |
| `qwen3.6-plus-high-plan-medium-build` | 95 | 90 | 55 | 82 | 78 | 100 |

## Findings

- `openai-gpt-5.5-plan-build`: Strongest Scenario 1 result. It delivered robust booking rules, boundary tests, TanStack Query integration, reproducible Orval client generation, and a polished responsive SPA. Deductions are mostly modest test breadth beyond the domain layer and minor UI accessibility semantics.
- `mimo-v2.5-pro-plan-mimo-v2.5-build`: Runnable with strong deterministic quality and solid backend domain/testing coverage. The largest gaps are frontend technology compliance: no actual shadcn usage, no generated OpenAPI typed client in use, and an availability capacity bug when multiple suitable tables exist.
- `deepseek-v4-pro-plan-flash-build`: Strong deterministic quality and a mostly complete backend/domain implementation. The main limiter is a serious frontend runtime integration bug between the generated Orval client and custom fetch mutator, plus incomplete validation for over-capacity availability requests.
- `qwen3.6-plus-high-plan-medium-build`: Strong deterministic quality and a solid backend/domain slice, but the frontend API integration is materially broken. Generated client types, custom fetch runtime behavior, OpenAPI POST metadata, and CORS/proxy setup do not align, so the SPA falls short of being fully runnable.

## Totals

- Total archived variants: 4
- Completed: 4
- DNF: 0
- Total time: 76.3m
- Total tokens: 35,396,660
- Total cost: $5.661358
