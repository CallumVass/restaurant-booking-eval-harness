# Restaurant Booking Eval Results: Scenario 1

Generated: 2026-04-24T20:41:09.697Z

Costs use provider-reported costs where available. OpenAI GPT-5.5/GPT-5.5-fast costs are estimated from token counts using public GPT-5.5 pricing: $5/input 1M, $0.50/cached-input 1M, $30/output 1M.

| Rank | Variant | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-fast-build` | Completed | 94 | 13.6m | 1,740,768 | $2.024899 | Pass |
| 2 | `zai-glm-5.1-high-plan-medium-build` | Completed | 89 | 27.2m | 14,711,180 | $4.608307 | Pass |
| 3 | `qwen3.6-plus-high-plan-medium-build` | Completed | 88 | 28.2m | 15,830,612 | $1.234194 | Pass |
| 4 | `moonshot-kimi-k2.6-high-plan-medium-build` | Completed | 86 | 20.8m | 2,746,024 | $0.282611 | Pass |

## Scenario 1 Scores

| Variant | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-fast-build` | 96 | 96 | 90 | 95 | 92 | 93 | 92 | 95 |
| `zai-glm-5.1-high-plan-medium-build` | 91 | 88 | 84 | 87 | 82 | 86 | 86 | 78 |
| `qwen3.6-plus-high-plan-medium-build` | 90 | 86 | 84 | 84 | 88 | 87 | 89 | 91 |
| `moonshot-kimi-k2.6-high-plan-medium-build` | 88 | 84 | 86 | 82 | 78 | 88 | 83 | 86 |

## Findings

- `openai-gpt-5.5-plan-fast-build`: Strongest scenario 1 result. It satisfied the requested restaurant booking system with all deterministic checks passing, strong backend correctness, good boundary coverage, and a complete simple frontend. Remaining limitations were eval-scope polish issues: basic UI and lightweight OpenAPI/Scalar setup rather than richer Swagger documentation.
- `zai-glm-5.1-high-plan-medium-build`: Strong full-stack submission with all checks passing and complete runnable functionality. Main deductions were non-atomic conflict prevention under concurrency, direct time access inside domain logic, limited test scope beyond domain tests, and a small unknown-restaurant validation gap on booking listing.
- `qwen3.6-plus-high-plan-medium-build`: Solid runnable implementation with good lightweight architecture and strong functional-core score. Main correctness gaps were table allocation that underused larger available tables and non-atomic conflict prevention under concurrent booking requests.
- `moonshot-kimi-k2.6-high-plan-medium-build`: Complete runnable submission with strong deterministic gates and a proportionate domain/service split. Main deductions were missing validation in the available-slots endpoint, non-atomic conflict prevention under concurrency, and weaker test quality than the other completed runs.
## Totals

- Total archived variants: 4
- Completed: 4
- DNF: 0
- Total time: 89.8m
- Total tokens: 35,028,584
- Total cost: $8.150011
