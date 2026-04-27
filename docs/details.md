---
title: Detailed Eval Breakdown
---

{% assign repo = site.github.repository_url | default: 'https://github.com/OWNER/REPO' %}
{% assign branch = site.github.source.branch | default: 'main' %}

# Detailed Eval Breakdown

[Back to summary](./)

## Scenario 1

| Variant | Score | Requirements | Backend | Frontend | Tests | Typed Client | UI/UX | Deterministic |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `openai-gpt-5.5-plan-build` | 91 | 94 | 93 | 91 | 84 | 91 | 90 | 100 |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | 84 | 86 | 88 | 79 | 84 | 84 | 78 | 95 |
| `deepseek-v4-pro-plan-pro-build` | 82 | 82 | 88 | 73 | 86 | 15 | 74 | 100 |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | 78 | 80 | 79 | 66 | 82 | 78 | 68 | 100 |

### `openai-gpt-5.5-plan-build`

- Archive: [`run-archive/scenario-1/1777267827113-scenario-1-openai-gpt-5.5-plan-build-attempt-1`]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777267827113-scenario-1-openai-gpt-5.5-plan-build-attempt-1)
- Status: completed without review.
- Score: 91.
- Strengths: all deterministic checks passed, backend had pure booking rules and explicit Result-style errors, boundary tests covered overlap and validation cases, frontend used Tailwind/shadcn-style UI, TanStack Query, and Orval-generated typed client regenerated during build.
- Issues: limited test coverage beyond domain rules; endpoint/OpenAPI contract and frontend behavior were not directly tested.

### `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review`

- Archive: [`run-archive/scenario-1/1777275063712-scenario-1-mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review-attempt-1`]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777275063712-scenario-1-mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review-attempt-1)
- Status: judged after review rejection; deterministic checks passed.
- Score: 84.
- Strengths: real Tailwind/shadcn components, TanStack Query, generated Orval endpoint/model files, backend functional core with boundary tests, and review-driven improvements to validation and shadcn usage.
- Issues: bookings endpoint only returned today's bookings, frontend mutation error handling could treat 400 responses as success, lint emitted warnings despite exit code 0, and the final review found one missing API boundary test for unknown restaurant.

### `deepseek-v4-pro-plan-pro-build`

- Archive: [`run-archive/scenario-1/1777270578875-scenario-1-deepseek-v4-pro-plan-pro-build-attempt-1`]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777270578875-scenario-1-deepseek-v4-pro-plan-pro-build-attempt-1)
- Status: completed without review.
- Score: 82.
- Strengths: strong backend domain model, Result-style business errors, boundary tests, responsive React/TanStack/Tailwind frontend, and all deterministic checks passed.
- Issues: failed the generated OpenAPI client requirement by using a hand-written fetch wrapper, Orval artifacts were absent from the actual app, and overlap prevention was not atomically rechecked at repository insertion.

### `deepseek-v4-pro-plan-flash-build-mimo-review`

- Archive: [`run-archive/scenario-1/1777268491502-scenario-1-deepseek-v4-pro-plan-flash-build-mimo-review-attempt-1`]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777268491502-scenario-1-deepseek-v4-pro-plan-flash-build-mimo-review-attempt-1)
- Status: completed; review approved.
- Score: 78.
- Strengths: all deterministic commands passed, many backend tests were present, and Orval generated typed TanStack Query hooks from a checked-in OpenAPI spec.
- Issues: generated API paths were double-prefixed at runtime, create-booking could reject valid bookings when another suitable table was free, shadcn/ui setup was not substantiated by source evidence, and availability did not reject past dates.

## Report Links

- [Scenario 1 report]({{ repo }}/blob/{{ branch }}/eval-scenario-1.md)
- [Scenario 2 report]({{ repo }}/blob/{{ branch }}/eval-scenario-2.md)
