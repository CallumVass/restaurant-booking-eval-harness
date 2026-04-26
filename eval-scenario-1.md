# Restaurant Booking Eval Results: Scenario 1

Generated: 2026-04-26T11:18:51.065Z

Costs use provider-reported costs where available. OpenAI GPT-5.5/GPT-5.5-fast costs are estimated from token counts using public GPT-5.5 pricing: $5/input 1M, $0.50/cached-input 1M, $30/output 1M.

| Rank | Variant | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | Completed | 92 | 12.6m | 4,237,796 | $3.646083 | Pass |
| 2 | `mimo-v2.5-pro-plan-mimo-v2.5-build` | Completed | 77 | 15.4m | 10,325,013 | $0.974228 | Pass |
| 3 | `qwen3.6-plus-high-plan-medium-build` | Completed | 76 | 25.9m | 9,474,158 | $0.643007 | Pass |
| 4 | `deepseek-v4-pro-plan-flash-build` | Completed | 76 | 22.3m | 11,359,693 | $0.398040 | Pass |

## Scenario 1 Scores

| Variant | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core | UI/UX | Typed Client | Plan Adherence |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 95 | 94 | 90 | 93 | 84 | 91 | 90 | 92 | 87 | 91 | 93 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build` | 78 | 84 | 65 | 78 | 83 | 78 | 80 | 78 | 68 | 0 | 65 |
| `qwen3.6-plus-high-plan-medium-build` | 80 | 83 | 64 | 68 | 82 | 80 | 84 | 80 | 74 | 60 | 78 |
| `deepseek-v4-pro-plan-flash-build` | 78 | 91 | 62 | 68 | 78 | 82 | 84 | 84 | 72 | 70 | 82 |

## Scenario-Specific Scores

| Variant | Tailwind/shadcn | TanStack | OpenAPI Typed Client | Booking Rules | Responsive Polish | Deterministic Quality |
|---|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 92 | 94 | 91 | 94 | 87 | 100 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build` | 40 | 85 | 0 | 78 | 65 | 100 |
| `qwen3.6-plus-high-plan-medium-build` | 90 | 88 | 62 | 82 | 76 | 100 |
| `deepseek-v4-pro-plan-flash-build` | 90 | 85 | 70 | 88 | 72 | 100 |

## Findings

- `openai-gpt-5.5-plan-build`: Strongest Scenario 1 result. It met the backend rules, frontend stack, generated typed client workflow, deterministic scripts, README expectations, and saved plan. Deductions were modest: test breadth is mostly domain-oriented and the UI remains compact rather than highly distinctive.
- `mimo-v2.5-pro-plan-mimo-v2.5-build`: Deterministic gates passed and the backend domain tests were good, but it missed key frontend/client requirements. The frontend used a handwritten fetch wrapper with manual interfaces rather than a generated OpenAPI client, shadcn/ui evidence was absent, and availability can hide valid slots when one suitable table is booked while another is free.
- `qwen3.6-plus-high-plan-medium-build`: Strong backend/domain slice and deterministic hygiene, but the frontend integration is materially broken. Generated client types, custom fetch behavior, and component expectations disagree, browser CORS is not configured for the Vite/backend split, and the OpenAPI document does not accurately describe booking creation responses.
- `deepseek-v4-pro-plan-flash-build`: Solid backend/domain implementation and deterministic checks, with Tailwind/shadcn, TanStack Query, and OpenAPI generation present. The major deduction is a frontend runtime mismatch where the custom Orval mutator returns raw JSON while wrapper code expects `{ data, status }`, preventing the SPA from correctly consuming restaurants and booking responses.

## Totals

- Total archived variants: 4
- Completed: 4
- DNF: 0
- Total time: 76.3m
- Total tokens: 35,396,660
- Total cost: $5.661358
