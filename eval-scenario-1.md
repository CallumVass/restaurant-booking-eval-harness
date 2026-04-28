# Restaurant Booking Eval Results: Scenario 1

Generated: 2026-04-28

Costs in the summary use archived provider-reported costs where available plus estimated OpenAI judge/reference costs. Older open-model archives were created before Lattice recorded configured and observed models separately, so provider-reported cost is useful as an approximate billing signal but is not fully normalized across old runs. Public-price spot checks suggest the latest dynamic sliced run was likely more expensive than the single-build Flash run despite its lower provider-reported pipeline cost.

## Summary

| Rank | Variant | Review | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | none | completed | 91 | 11m 04s | 135,605 | ~$3.54 | pass |
| 2 | `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` (dynamic slices + dynamic skills) | Mimo v2.5 Pro | completed, review approved | 86 | 57m 52s | 704,447 | $0.56 | pass |
| 3 | `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | DeepSeek V4 Pro | judged after review retry exhausted | 84 | 34m 15s | 368,209 | $1.62 | pass |
| 4 | `deepseek-v4-pro-plan-pro-build` | none | completed | 82 | 45m 13s | 265,302 | $0.80 | pass |
| 5 | `deepseek-v4-pro-plan-flash-build-mimo-review` | Mimo v2.5 Pro | completed, review approved | 78 | 34m 47s | 321,658 | $0.65 | pass |

## Core Scores

| Variant | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core | UI/UX | Typed Client | Plan Quality | Plan Adherence |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 94 | 93 | 91 | 92 | 84 | 91 | 91 | 93 | 90 | 91 | 95 | 93 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` (dynamic) | 88 | 82 | 90 | 84 | 78 | 80 | 84 | 86 | 84 | 94 | 88 | 88 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | 86 | 88 | 79 | 83 | 84 | 80 | 84 | 86 | 78 | 84 | 92 | 84 |
| `deepseek-v4-pro-plan-pro-build` | 82 | 88 | 73 | 84 | 86 | 82 | 86 | 88 | 74 | 15 | 92 | 76 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | 80 | 79 | 66 | 70 | 82 | 82 | 83 | 82 | 68 | 78 | 94 | 80 |

## Scenario-Specific Scores

| Variant | Tailwind/shadcn | TanStack | OpenAPI Typed Client | Booking Rules | Responsive Polish | Deterministic Quality |
|---|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 92 | 90 | 91 | 94 | 90 | 100 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` (dynamic) | 92 | 94 | 94 | 82 | 84 | 90 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | 90 | 82 | 86 | 86 | 78 | 95 |
| `deepseek-v4-pro-plan-pro-build` | 85 | 86 | 15 | 82 | 72 | 100 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | 55 | 90 | 82 | 72 | 68 | 100 |

## Findings

- `openai-gpt-5.5-plan-build`: strongest Scenario 1 result. It satisfied the core backend and frontend requirements, passed all deterministic checks, implemented conflict-safe booking rules with boundary tests, and used a reproducible Orval-generated typed client with TanStack Query and polished Tailwind/shadcn-style UI. Main limitation was test depth beyond pure domain rules: endpoint/OpenAPI contract and frontend behavior were not covered by source tests.
- `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` (dynamic slices + dynamic skills): latest Lattice run scored second overall. Native dynamic stage expansion removed the old unused slice slots, and stage-local dynamic skills selected backend skills for the backend slice and frontend/client skills for frontend slices. It materially improved the prior sliced result: frontend `76` to `90`, typed client `88` to `94`, and overall `82` to `86`. Remaining issues were API-level conflict prevention not being atomic under concurrent requests, off-grid booking times such as `11:17` being accepted, no frontend regression tests, and a dead-code script that masked Knip findings while exiting 0.
- `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review`: the eval run completed and was judged, but the Lattice pipeline ended at the review gate after the single allowed retry was used. The first review rejection triggered a useful build retry for missing form validation and weak shadcn usage; the second review still found a remaining plan-specific missing API boundary test for unknown restaurant. Deterministic checks passed, so the harness judged the final workspace. Judge still scored it third overall. Main product issues were today's-date filtering for existing bookings, frontend 400-response handling, and lint warnings despite exit code 0.
- `deepseek-v4-pro-plan-pro-build`: strong backend and deterministic quality, but failed a central frontend requirement by not actually generating and using an OpenAPI typed client. It configured Orval but used a hand-written `src/api/client.ts` fetch wrapper with hard-coded paths. It also lacked atomic overlap enforcement at repository insertion time.
- `deepseek-v4-pro-plan-flash-build-mimo-review`: passed all deterministic commands and had useful generated Orval/TanStack code plus many backend tests. It scored lowest because the integrated SPA was judged not functionally runnable: the Axios base URL double-prefixed generated `/api/*` paths, create-booking could reject valid bookings when another suitable table was free, and shadcn/ui setup was not substantiated by source evidence.

## Sliced Execution Comparison

| Comparison | DeepSeek Pro Single Build | Dynamic Sliced Flash Build |
|---|---:|---:|
| Overall score | 82 | 86 |
| Frontend score | 73 | 90 |
| Correctness score | 84 | 84 |
| Typed client score | 15 | 94 |
| Tailwind/shadcn score | 85 | 92 |
| Runnable | true | true |
| Time | 45.2m | 57.9m |
| Tokens | 265,302 | 704,447 |
| Cost | $0.80 | $0.56 |

Slicing appears promising for open-model execution quality. The latest dynamic Lattice pipeline produced the strongest open-model frontend/client result: real manifest stages, stage-local dynamic skill selection, and much stronger generated client integration. It remains slower and more token-heavy; the next likely improvement is stricter backend concurrency/time-grid validation plus frontend regression tests.

Cost caveat: the cost row above is provider-reported archive telemetry, not a normalized public-price estimate. Using public pricing for DeepSeek V4, MiMo v2.5, and GPT-5.5, the single-build Flash run is roughly `~$0.45-$0.50` while the latest dynamic sliced run is roughly `~$0.58-$0.64` including judge cost.

## Review Notes

- `openai-gpt-5.5-plan-build` and `deepseek-v4-pro-plan-pro-build` used no review stage.
- `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` used native Lattice stage expansion and stage-local dynamic skill selection; the review approved it and the final judge scored it second overall.
- `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` used cross-model review. The review process helped once by forcing a retry that added `react-hook-form`/Zod validation and more shadcn components. The second review rejection exhausted the single rewind budget, so the harness treated the final workspace as complete enough to judge because deterministic checks passed.
- The review-stage telemetry for the Mimo/DeepSeek run recorded the reviewer model incorrectly in the archived state due to a Lattice attribution bug. OpenCode logs confirmed the reviewer LLM calls used `deepseek-v4-pro`; Lattice has since been patched to seed configured model telemetry and avoid overwrites from later message metadata.

## Totals

- Total reported runs: 5
- Completed pipelines: 4
- Judged after paused review: 1
- DNF: 0
- Total time: 3h 03m 11s
- Total tokens: 1,795,221
- Total provider-reported + estimated OpenAI cost: ~$7.17
