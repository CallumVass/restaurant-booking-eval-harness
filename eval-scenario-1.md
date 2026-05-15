# Restaurant Booking Eval Results: Scenario 1

Generated: 2026-05-15

Scenario 1 asks agents to build a .NET 10 restaurant booking API plus a React/Tailwind/shadcn/TanStack/Orval frontend. This report now includes the latest `pi-single` bounded-swarm runs. Those runs launched normal Pi with variant-local delegator profiles and used `delegate_workflow` evidence in the Pi JSONL.

Costs use archived provider-reported costs where available plus estimated OpenAI judge/reference costs. Older OpenAI archives reported provider cost as `0`, so their public-price estimates are approximate.

## Summary

| Rank | Variant | Backend | Delegation | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | Lattice | none | completed | 91 | 11.1m | 135,605 | ~$3.54 | pass |
| 2 | `openai-gpt-5.5-plan-build` | Pi single | bounded swarm, 2 `delegate_workflow` calls | completed | 89 | 7.7m | 110,688 | ~$1.35 | pass |
| 3 | `deepseek-v4-pro-plan-flash-build-mimo-review` | Pi single | delegated swarm, 8 `delegate_workflow` calls | completed | 88 | 29.7m | 504,848 | ~$0.32 | pass |
| 4 | `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Lattice | staged sliced + review | completed, review approved | 86 | 57.9m | 704,447 | $0.56 | pass |
| 5 | `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | Lattice | staged review | judged after review retry exhausted | 84 | 34.3m | 368,209 | $1.62 | pass |
| 6 | `deepseek-v4-pro-plan-pro-build` | Lattice | none | completed | 82 | 45.2m | 265,302 | $0.80 | pass |
| 7 | `deepseek-v4-pro-plan-flash-build-mimo-review` | Lattice | staged review | completed, review approved | 78 | 34.8m | 321,658 | $0.65 | pass |

## Core Scores

| Variant | Backend | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core | UI/UX | Typed Client | Plan Quality | Plan Adherence |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | Lattice | 94 | 93 | 91 | 92 | 84 | 91 | 91 | 93 | 90 | 91 | 95 | 93 |
| `openai-gpt-5.5-plan-build` | Pi single bounded swarm | 90 | 92 | 87 | 91 | 82 | 88 | 86 | 90 | 84 | 92 | 90 | 90 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Pi single delegated swarm | 90 | 89 | 86 | 87 | 80 | 84 | 85 | 82 | 82 | 88 | 90 | 90 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Lattice sliced | 88 | 82 | 90 | 84 | 78 | 80 | 84 | 86 | 84 | 94 | 88 | 88 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | Lattice | 86 | 88 | 79 | 83 | 84 | 80 | 84 | 86 | 78 | 84 | 92 | 84 |
| `deepseek-v4-pro-plan-pro-build` | Lattice | 82 | 88 | 73 | 84 | 86 | 82 | 86 | 88 | 74 | 15 | 92 | 76 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Lattice | 80 | 79 | 66 | 70 | 82 | 82 | 83 | 82 | 68 | 78 | 94 | 80 |

## Scenario-Specific Scores

| Variant | Backend | Tailwind/shadcn | TanStack | OpenAPI Typed Client | Booking Rules | Responsive Polish | Deterministic Quality |
|---|---|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | Lattice | 92 | 90 | 91 | 94 | 90 | 100 |
| `openai-gpt-5.5-plan-build` | Pi single bounded swarm | 72 | 95 | 92 | 92 | 84 | 100 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Pi single delegated swarm | 90 | 95 | 88 | 86 | 82 | 100 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Lattice sliced | 92 | 94 | 94 | 82 | 84 | 90 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | Lattice | 90 | 82 | 86 | 86 | 78 | 95 |
| `deepseek-v4-pro-plan-pro-build` | Lattice | 85 | 86 | 15 | 82 | 72 | 100 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Lattice | 55 | 90 | 82 | 72 | 68 | 100 |

## Delegation Findings

- **OpenAI bounded swarm (`pi-single`)** used exactly two unique `delegate_workflow` calls and finished fastest at 7.7m / ~$1.35, but scored `89` due to weaker shadcn evidence and incomplete OpenAPI error documentation.
- **DeepSeek Flash bounded/delegated Pi single** improved the original DeepSeek Flash + Mimo review run from `78` to `88`, cut runtime from 34.8m to 29.7m, cut parent tokens fell but delegated-worker-inclusive tokens were 504,848; estimated cost still fell from `$0.65` to about `$0.32`. It used DeepSeek Flash for the main run and Mimo v2.5 Pro through the `deep` delegation profile.
- The DeepSeek Pi single run beat the older dynamic sliced DeepSeek run overall (`88` vs `86`) while being much faster and cheaper, but it had a runtime URL drift issue between Orval, backend launch settings, and README instructions.
- Bounded delegation helped cost and speed more than top-end OpenAI quality in Scenario 1. The best absolute score remains the original OpenAI Lattice run (`91`).

## Findings

- `openai-gpt-5.5-plan-build` (Lattice): strongest score. It satisfied the backend/frontend requirements, passed all deterministic checks, implemented conflict-safe booking rules with boundary tests, and used Orval-generated typed client code with TanStack Query and polished Tailwind/shadcn-style UI. Main limitation was test depth beyond pure domain rules.
- `openai-gpt-5.5-plan-build` (Pi single bounded swarm): fastest OpenAI run. It kept deterministic quality, TanStack usage, and typed client usage strong, but lost points for weak shadcn registry/component evidence and incomplete OpenAPI error response documentation.
- `deepseek-v4-pro-plan-flash-build-mimo-review` (Pi single delegated swarm): major improvement over the original DeepSeek Flash run. It fixed the old API double-prefix bug, improved shadcn/Tailwind evidence, and produced a stronger runnable SPA. Main remaining issue was inconsistent runtime backend URLs.
- `deepseek-v4-pro-plan-flash-sliced-build-mimo-review`: strongest older open-model Lattice run. It had excellent generated client integration, but weaker backend concurrency/time-grid validation, no frontend regression tests, and a dead-code script that masked Knip findings while exiting 0.

## Totals

- Total reported runs: 7
- Delegated Pi single runs highlighted: 2
- Completed pipelines: 6
- Judged after paused review: 1
- DNF: 0
