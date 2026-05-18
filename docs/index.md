---
title: Restaurant Booking Eval Results
---

{% assign repo = site.github.repository_url | default: 'https://github.com/OWNER/REPO' %}
{% assign branch = site.github.source.branch | default: 'main' %}

# Restaurant Booking Eval Results

OpenCode/Lattice evals where model variants build a .NET 10 API and React SPA for a restaurant booking system.

Costs use archived provider-reported costs where available plus estimated OpenAI costs. Older open-model archives predate richer configured/observed model telemetry, so public-price normalized comparisons should treat those costs as approximate.

## Scenario 1

Strong frontend/client restaurant booking system: .NET 10 API, React SPA, Tailwind CSS, shadcn/ui, TanStack Query, OpenAPI-generated typed client, booking conflict prevention, available slots, boundary tests, and deterministic backend/frontend checks.

[Full Scenario 1 Report]({{ repo }}/blob/{{ branch }}/eval-scenario-1.md) · [Detailed Breakdown](./details)

| Rank | Variant | Backend | Pipeline | Score | Time | Tokens | Cost | Checks | Solution |
|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | [`openai-gpt-5.5-plan-build`](./details#openai-gpt-55-plan-build-lattice) | Lattice | plan + build | 91 | 11.1m | 135,605 | ~$3.54 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777267827113-scenario-1-openai-gpt-5.5-plan-build-attempt-1) |
| 2 | [`deepseek-v4-pro-plan-flash-sliced-build-mimo-review`](./details#deepseek-v4-pro-plan-flash-sliced-build-mimo-review-dynamic) | Lattice | sliced + review | 86 | 57.9m | 704,447 | $0.56 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777292815801-scenario-1-deepseek-v4-pro-plan-flash-sliced-build-mimo-review-attempt-1) |
| 3 | [`mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review`](./details#mimo-v25-pro-plan-mimo-v25-build-deepseek-review) | Lattice | review | 84 | 34.3m | 368,209 | $1.62 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777275063712-scenario-1-mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review-attempt-1) |
| 4 | [`deepseek-v4-pro-plan-pro-build`](./details#deepseek-v4-pro-plan-pro-build) | Lattice | plan + build | 82 | 45.2m | 265,302 | $0.80 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777270578875-scenario-1-deepseek-v4-pro-plan-pro-build-attempt-1) |
| 5 | [`deepseek-v4-pro-plan-flash-build-mimo-review`](./details#deepseek-v4-pro-plan-flash-build-mimo-review-lattice-original) | Lattice | review | 78 | 34.8m | 321,658 | $0.65 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777268491502-scenario-1-deepseek-v4-pro-plan-flash-build-mimo-review-attempt-1) |

## Scenario 1 Takeaways

- The original OpenAI Lattice run remains the top score at `91`.

## Scenario 2

Brownfield auth/security extension: local cookie auth, CSRF protection, user-owned bookings, protected booking history, generated client integration, and regression coverage on the existing booking app.

[Full Scenario 2 Report]({{ repo }}/blob/{{ branch }}/eval-scenario-2.md) · [Detailed Breakdown](./details)

| Rank | Variant | Backend | Pipeline | Score | Time | Tokens | Cost | Checks | Solution |
|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | [`openai-gpt-5.5-plan-build`](./details#scenario-2-openai-gpt-55-plan-build-lattice) | Lattice | plan + build | 88 | 16.6m | 269,990 | ~$6.45 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777298973976-scenario-2-openai-gpt-5.5-plan-build-attempt-1) |
| 2 | [`deepseek-v4-pro-plan-flash-sliced-build-mimo-review`](./details#scenario-2-deepseek-v4-pro-plan-flash-sliced-build-mimo-review) | Lattice | sliced + review | 87 | 83.3m | 1,220,714 | $0.86 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777462311663-scenario-2-deepseek-v4-pro-plan-flash-sliced-build-mimo-review-attempt-1) |
| 3 | [`deepseek-v4-pro-plan-flash-build-mimo-review`](./details#scenario-2-deepseek-v4-pro-plan-flash-build-mimo-review) | Lattice | review | 82 | 36.8m | 417,005 | $0.68 | Pass |
| 3 | [`mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review`](./details#scenario-2-mimo-v25-pro-plan-mimo-v25-build-deepseek-review) | Lattice | review | 82 | 39.9m | 401,441 | $1.50 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777367017204-scenario-2-mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review-attempt-1) |
| 5 | [`deepseek-v4-pro-plan-pro-build`](./details#scenario-2-deepseek-v4-pro-plan-pro-build) | Lattice | plan + build | 57 | 46.3m | 220,110 | $0.65 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777304791852-scenario-2-deepseek-v4-pro-plan-pro-build-attempt-1) |

## Scenario 2 Takeaways

- Scenario 2 needs medium implementation thinking: auth, CSRF, OpenAPI, generated client, frontend tests, and ownership rules are cross-surface work.

## Repository Links

- [Harness source]({{ repo }}/tree/{{ branch }})
- [Scenario prompts]({{ repo }}/tree/{{ branch }}/scenarios)
- [Archived eval solutions]({{ repo }}/tree/{{ branch }}/run-archive)
