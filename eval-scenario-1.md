# Restaurant Booking Eval Results: Scenario 1

Generated: 2026-04-27

Costs use provider-reported costs where available. OpenAI cost was reported as `0` by provider metadata, so `gpt-5.5` is estimated from public model pricing data: `$5/M` input tokens, `$0.50/M` cached input tokens, and `$30/M` output tokens. For OpenAI reasoning runs, output cost is estimated using `output + reasoning` tokens.

## Summary

| Rank | Variant | Review | Status | Score | Time | Tokens | Cost | Checks |
|---:|---|---|---|---:|---:|---:|---:|---|
| 1 | `openai-gpt-5.5-plan-build` | none | completed | 91 | 11m 04s | 135,605 | ~$3.54 | pass |
| 2 | `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` (dynamic slices + dynamic skills) | Mimo v2.5 Pro | completed, review approved | 86 | 57m 52s | 704,447 | $0.56 | pass |
| 3 | `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | DeepSeek V4 Pro | judged after review rejection | 84 | 34m 15s | 368,209 | $1.62 | pass |
| 4 | `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` (prior fixed-slot slices) | Mimo v2.5 Pro | completed, review approved | 82 | 56m 56s | 436,502 | $0.59 | pass |
| 5 | `deepseek-v4-pro-plan-pro-build` | none | completed | 82 | 45m 13s | 265,302 | $0.80 | pass |
| 6 | `deepseek-v4-pro-plan-flash-build-mimo-review` | Mimo v2.5 Pro | completed, review approved | 78 | 34m 47s | 321,658 | $0.65 | pass |

## Core Scores

| Variant | Requirements | Backend | Frontend | Correctness | Tests | Maintainability | Architecture | Functional Core | UI/UX | Typed Client | Plan Quality | Plan Adherence |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 94 | 93 | 91 | 92 | 84 | 91 | 91 | 93 | 90 | 91 | 95 | 93 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` (dynamic) | 88 | 82 | 90 | 84 | 78 | 80 | 84 | 86 | 84 | 94 | 88 | 88 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | 86 | 88 | 79 | 83 | 84 | 80 | 84 | 86 | 78 | 84 | 92 | 84 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` (prior) | 84 | 86 | 76 | 78 | 78 | 86 | 86 | 84 | 73 | 88 | 84 | 84 |
| `deepseek-v4-pro-plan-pro-build` | 82 | 88 | 73 | 84 | 86 | 82 | 86 | 88 | 74 | 15 | 92 | 76 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | 80 | 79 | 66 | 70 | 82 | 82 | 83 | 82 | 68 | 78 | 94 | 80 |

## Scenario-Specific Scores

| Variant | Tailwind/shadcn | TanStack | OpenAPI Typed Client | Booking Rules | Responsive Polish | Deterministic Quality |
|---|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 92 | 90 | 91 | 94 | 90 | 100 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` (dynamic) | 92 | 94 | 94 | 82 | 84 | 90 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | 90 | 82 | 86 | 86 | 78 | 95 |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` (prior) | 90 | 88 | 88 | 78 | 74 | 100 |
| `deepseek-v4-pro-plan-pro-build` | 85 | 86 | 15 | 82 | 72 | 100 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | 55 | 90 | 82 | 72 | 68 | 100 |

## Findings

- `openai-gpt-5.5-plan-build`: strongest Scenario 1 result. It satisfied the core backend and frontend requirements, passed all deterministic checks, implemented conflict-safe booking rules with boundary tests, and used a reproducible Orval-generated typed client with TanStack Query and polished Tailwind/shadcn-style UI. Main limitation was test depth beyond pure domain rules: endpoint/OpenAPI contract and frontend behavior were not covered by source tests.
- `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` (dynamic slices + dynamic skills): latest Lattice run scored second overall. Native dynamic stage expansion removed the old unused slice slots, and stage-local dynamic skills selected backend skills for the backend slice and frontend/client skills for frontend slices. It materially improved the prior sliced result: frontend `76` to `90`, typed client `88` to `94`, and overall `82` to `86`. Remaining issues were API-level conflict prevention not being atomic under concurrent requests, off-grid booking times such as `11:17` being accepted, no frontend regression tests, and a dead-code script that masked Knip findings while exiting 0.
- `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review`: strong runnable full-stack result with clean deterministic checks, solid backend domain logic, boundary tests, and real Tailwind/shadcn/TanStack/Orval usage. The review stage first triggered a useful retry for missing form validation and weak shadcn usage, then rejected a remaining plan-specific missing API boundary test for unknown restaurant. Judge still scored the salvaged result third overall. Main product issues were today's-date filtering for existing bookings, frontend 400-response handling, and lint warnings despite exit code 0.
- `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` (prior fixed-slot slices): earlier sliced execution improved the same DeepSeek Pro plan + Flash build + Mimo review combo from `78` to `82`. It fixed the big-plan run's worst integration failures: the app was judged runnable, shadcn evidence was real, typed OpenAPI client integration improved, and final integration regenerated OpenAPI/Orval artifacts. Remaining issues were a broken frontend slot-to-booking datetime composition, incomplete invalid-time validation, availability accepting past dates, and missing invalid-time boundary tests.
- `deepseek-v4-pro-plan-pro-build`: strong backend and deterministic quality, but failed a central frontend requirement by not actually generating and using an OpenAPI typed client. It configured Orval but used a hand-written `src/api/client.ts` fetch wrapper with hard-coded paths. It also lacked atomic overlap enforcement at repository insertion time.
- `deepseek-v4-pro-plan-flash-build-mimo-review`: passed all deterministic commands and had useful generated Orval/TanStack code plus many backend tests. It scored lowest because the integrated SPA was judged not functionally runnable: the Axios base URL double-prefixed generated `/api/*` paths, create-booking could reject valid bookings when another suitable table was free, and shadcn/ui setup was not substantiated by source evidence.

## Sliced Execution Comparison

| Comparison | Big Plan + Single Build | Prior Fixed-Slot Sliced Build | Latest Dynamic Sliced Build | Delta vs Big Plan |
|---|---:|---:|---:|---:|
| Overall score | 78 | 82 | 86 | +8 |
| Frontend score | 66 | 76 | 90 | +24 |
| Correctness score | 70 | 78 | 84 | +14 |
| Typed client score | 78 | 88 | 94 | +16 |
| Tailwind/shadcn score | 55 | 90 | 92 | +37 |
| Runnable | false | true | true | improved |
| Time | 34.8m | 56.9m | 57.9m | +23.1m |
| Tokens | 321,658 | 436,502 | 704,447 | +382,789 |
| Cost | $0.65 | $0.59 | $0.56 | -$0.09 |

Slicing appears promising for open-model execution quality. The prior fixed-slot sliced pipeline made the app runnable but still had a broken slot-submission flow. The latest dynamic Lattice pipeline improved again: real manifest stages replaced unused slice placeholders, dynamic skill selection targeted backend/frontend work correctly, and the frontend/client implementation became substantially stronger. It remains slower than a single build and used many more non-cached tokens; the next likely improvement is stricter backend concurrency/time-grid validation plus frontend regression tests.

## Review Notes

- `openai-gpt-5.5-plan-build` and `deepseek-v4-pro-plan-pro-build` used no review stage.
- `deepseek-v4-pro-plan-flash-build-mimo-review` used cross-model open review. The review approved the implementation, but the final judge still found major runtime and shadcn evidence gaps that the reviewer missed.
- `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` was run twice. The prior fixed-slot sliced run normalized the big plan into four manifest slices but still executed four unused placeholder stages. The latest dynamic sliced run used native Lattice stage expansion and stage-local dynamic skill selection; the review approved it and the final judge scored it second overall.
- `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` used cross-model review. The review process helped once by forcing a retry that added `react-hook-form`/Zod validation and more shadcn components, but the second review rejection exhausted the single rewind budget. Deterministic checks passed, so the harness salvaged and judged the result.
- The review-stage telemetry for the Mimo/DeepSeek run recorded the reviewer model incorrectly in the archived state due to a Lattice attribution bug. OpenCode logs confirmed the reviewer LLM calls used `deepseek-v4-pro`; Lattice has since been patched to seed configured model telemetry and avoid overwrites from later message metadata.

## Totals

- Total archived runs: 6
- Unique variants: 5
- Completed pipelines: 5
- Judged after paused review: 1
- DNF: 0
- Total time: 4h 00m 08s
- Total tokens: 2,231,723
- Total provider-reported + estimated OpenAI cost: ~$7.76
