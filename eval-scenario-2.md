# Restaurant Booking Eval Results: Scenario 2

Generated: 2026-04-25T10:40:21.185Z

Costs use provider-reported costs where available. OpenAI GPT-5.5/GPT-5.5 judge costs are estimated from recorded token counts using public GPT-5.5 pricing: $5/input 1M, $0.50/cached-input 1M, $30/output 1M. The OpenAI pricing page returned HTTP 403 during lookup, so these estimates use the same GPT-5.5 pricing basis as `eval-scenario-1.md`.

| Rank | Variant | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | Completed | 91 | 10.8m | 4,397,754 | $3.566181 | Pass |
| 2 | `mimo-v2.5-pro-plan-mimo-v2.5-build` | Completed | 86 | 15.7m | 10,786,018 | $1.099003 | Pass |
| 3 | `moonshot-kimi-k2.6-high-plan-medium-build` | Completed | 86 | 20.3m | 4,705,968 | $0.447946 | Pass |
| 4 | `deepseek-v4-pro-plan-flash-build` | Completed | 86 | 29.7m | 25,445,570 | $0.986744 | Pass |
| 5 | `deepseek-v4-pro-high-plan-medium-build` | Completed | 86 | 36.7m | 13,984,485 | $2.620604 | Pass |
| 6 | `minimax-m2.7-high-plan-medium-build` | Completed | 82 | 30.0m | 12,275,788 | $0.959646 | Pass |

## Scenario 2 Scores

| Variant | UI/UX | Typed Client | Plan Quality | Plan Adherence | Tailwind/shadcn | TanStack | Typed OpenAPI Client |
|---|---:|---:|---:|---:|---|---|---|
| `openai-gpt-5.5-plan-build` | 86 | 96 | 94 | 91 | Yes | Yes | Yes |
| `mimo-v2.5-pro-plan-mimo-v2.5-build` | 76 | 92 | 92 | 88 | Yes | Yes | Yes |
| `moonshot-kimi-k2.6-high-plan-medium-build` | 62 | 90 | 94 | 84 | No | Yes | Yes |
| `deepseek-v4-pro-plan-flash-build` | 78 | 84 | 92 | 82 | Yes | Yes | Yes |
| `deepseek-v4-pro-high-plan-medium-build` | 78 | 94 | 91 | 84 | Yes | Yes | Yes |
| `minimax-m2.7-high-plan-medium-build` | 72 | 86 | 88 | 79 | Yes | Yes | Yes |

## Findings

- `openai-gpt-5.5-plan-build`: Strongest overall result with the best score, fastest completion, all deterministic checks passing, high typed-client score, and good UI/UX. Main residual risk was non-atomic booking conflict prevention under concurrent requests.
- `mimo-v2.5-pro-plan-mimo-v2.5-build`: Best value among the 86-score group. Passed all checks, used generated client/TanStack Query, and had good plan adherence; penalties were API validation gaps, a frontend time-display bug, race-prone conflict prevention, and generic UI polish.
- `moonshot-kimi-k2.6-high-plan-medium-build`: Cheapest completed run. Backend and typed-client work were strong, but it missed shadcn/ui evidence and had the weakest UI/UX score.
- `deepseek-v4-pro-plan-flash-build`: Solid deterministic pass and broad feature coverage, but slower and token-heavy. Penalties included concurrency weakness, generated-client workflow drift, missing Suspense/error boundary around suspense queries, and plan drift.
- `deepseek-v4-pro-high-plan-medium-build`: Strong typed-client score and checks, but slowest completed run and highest non-OpenAI provider cost. Main deductions were non-atomic conflict prevention, incomplete timeslot validation, moderate UI polish, and plan/OpenAPI drift.
- `minimax-m2.7-high-plan-medium-build`: Completed and passed all checks, but scored lowest. Main issues were correctness gaps around non-positive party sizes, broken confirmation id, incomplete booking filtering, weaker API-level validation/testing, and partial shadcn polish.

## Totals

- Total archived variants: 6
- Completed: 6
- DNF: 0
- Total time: 143.2m
- Total tokens: 71,595,583
- Total cost: $9.680125
