# Restaurant Booking Eval Results: Scenario 1

Generated: 2026-05-15

Scenario 1 asks agents to build a .NET 10 restaurant booking API plus a React/Tailwind/shadcn/TanStack/Orval frontend.

Costs use archived provider-reported costs where available plus estimated OpenAI judge/reference costs. Older OpenAI archives reported provider cost as `0`, so their public-price estimates are approximate.

## Summary

| Rank | Variant | Backend | Pipeline | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | Lattice | plan + build | completed | 91 | 11.1m | 135,605 | ~$3.54 | pass |
| 2 | `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Lattice | staged sliced + review | completed, review approved | 86 | 57.9m | 704,447 | $0.56 | pass |
| 3 | `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | Lattice | staged review | judged after review retry exhausted | 84 | 34.3m | 368,209 | $1.62 | pass |
| 4 | `deepseek-v4-pro-plan-pro-build` | Lattice | plan + build | completed | 82 | 45.2m | 265,302 | $0.80 | pass |
| 5 | `deepseek-v4-pro-plan-flash-build-mimo-review` | Lattice | staged review | completed, review approved | 78 | 34.8m | 321,658 | $0.65 | pass |

## Core Scores

| Variant | Backend | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core | UI/UX | Typed Client | Plan Quality | Plan Adherence |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | Lattice | 94 | 93 | 91 | 92 | 84 | 91 | 91 | 93 | 90 | 91 | 95 | 93 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Lattice sliced | 88 | 82 | 90 | 84 | 78 | 80 | 84 | 86 | 84 | 94 | 88 | 88 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | Lattice | 86 | 88 | 79 | 83 | 84 | 80 | 84 | 86 | 78 | 84 | 92 | 84 |
| `deepseek-v4-pro-plan-pro-build` | Lattice | 82 | 88 | 73 | 84 | 86 | 82 | 86 | 88 | 74 | 15 | 92 | 76 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Lattice | 80 | 79 | 66 | 70 | 82 | 82 | 83 | 82 | 68 | 78 | 94 | 80 |

## Scenario-Specific Scores

| Variant | Backend | Tailwind/shadcn | TanStack | OpenAPI Typed Client | Booking Rules | Responsive Polish | Deterministic Quality |
|---|---|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | Lattice | 92 | 90 | 91 | 94 | 90 | 100 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Lattice sliced | 92 | 94 | 94 | 82 | 84 | 90 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | Lattice | 90 | 82 | 86 | 86 | 78 | 95 |
| `deepseek-v4-pro-plan-pro-build` | Lattice | 85 | 86 | 15 | 82 | 72 | 100 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Lattice | 55 | 90 | 82 | 72 | 68 | 100 |

## Findings

- `openai-gpt-5.5-plan-build` (Lattice): strongest score. It satisfied the backend/frontend requirements, passed all deterministic checks, implemented conflict-safe booking rules with boundary tests, and used Orval-generated typed client code with TanStack Query and polished Tailwind/shadcn-style UI. Main limitation was test depth beyond pure domain rules.
- `deepseek-v4-pro-plan-flash-sliced-build-mimo-review`: strongest older open-model Lattice run. It had excellent generated client integration, but weaker backend concurrency/time-grid validation, no frontend regression tests, and a dead-code script that masked Knip findings while exiting 0.

## Totals

- Total reported runs: 5
- Completed pipelines: 4
- Judged after paused review: 1
- DNF: 0
