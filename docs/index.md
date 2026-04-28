---
title: Restaurant Booking Eval Results
---

{% assign repo = site.github.repository_url | default: 'https://github.com/OWNER/REPO' %}
{% assign branch = site.github.source.branch | default: 'main' %}

# Restaurant Booking Eval Results

OpenCode + Lattice evals where model variants build a .NET 10 API and React SPA for a restaurant booking system. The archived solutions are linked to the generated source directories in GitHub.

Costs use archived provider-reported costs where available plus estimated OpenAI costs. Older open-model archives predate richer Lattice configured/observed model telemetry, so public-price normalized comparisons should treat those costs as approximate.

## Scenario 1

Strong frontend/client restaurant booking system: .NET 10 API, React SPA, Tailwind CSS, shadcn/ui, TanStack Query, OpenAPI-generated typed client, booking conflict prevention, available slots, boundary tests, and deterministic backend/frontend checks.

[Full Scenario 1 Report]({{ repo }}/blob/{{ branch }}/eval-scenario-1.md) · [Detailed Breakdown](./details)

| Rank | Variant | Score | Time | Tokens | Cost | Checks | Solution |
|---:|---|---:|---:|---:|---:|---|---|
| 1 | [`openai-gpt-5.5-plan-build`](./details#openai-gpt-55-plan-build) | 91 | 11.1m | 135,605 | ~$3.54 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777267827113-scenario-1-openai-gpt-5.5-plan-build-attempt-1) |
| 2 | [`deepseek-v4-pro-plan-flash-sliced-build-mimo-review` dynamic](./details#deepseek-v4-pro-plan-flash-sliced-build-mimo-review-dynamic) | 86 | 57.9m | 704,447 | $0.56 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777292815801-scenario-1-deepseek-v4-pro-plan-flash-sliced-build-mimo-review-attempt-1) |
| 3 | [`mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review`](./details#mimo-v25-pro-plan-mimo-v25-build-deepseek-review) | 84 | 34.3m | 368,209 | $1.62 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777275063712-scenario-1-mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review-attempt-1) |
| 4 | [`deepseek-v4-pro-plan-pro-build`](./details#deepseek-v4-pro-plan-pro-build) | 82 | 45.2m | 265,302 | $0.80 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777270578875-scenario-1-deepseek-v4-pro-plan-pro-build-attempt-1) |
| 5 | [`deepseek-v4-pro-plan-flash-build-mimo-review`](./details#deepseek-v4-pro-plan-flash-build-mimo-review) | 78 | 34.8m | 321,658 | $0.65 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777268491502-scenario-1-deepseek-v4-pro-plan-flash-build-mimo-review-attempt-1) |

## Scenario 1 Takeaways

- OpenAI produced the strongest result: best score, fastest run, strong frontend, generated typed client, and clean deterministic checks.
- Dynamic sliced execution finished second. Native Lattice stage expansion plus stage-local dynamic skills improved the DeepSeek Pro plan + Flash build + Mimo review combo from `78` to `86`, with a much stronger frontend/client result.
- Mimo plus DeepSeek review finished third. Review improved the build once, then caught one remaining plan-specific missing API test and paused after retry exhaustion; deterministic checks passed, so the run was judged.
- Cost caveat: public-price spot checks indicate the latest dynamic sliced run was probably more expensive than the single-build Flash run despite lower provider-reported pipeline cost, because it used more output/reasoning tokens and an extra judge/review-heavy stage mix.
- DeepSeek Pro without review built a strong backend but missed the central generated OpenAPI client requirement by using a hand-written fetch wrapper.
- DeepSeek Flash plus Mimo review passed deterministic checks but had runtime API double-prefixing, incomplete shadcn evidence, and a table-selection conflict flaw.

## Scenario 2

Brownfield auth/security extension: local cookie auth, CSRF protection, user-owned bookings, protected booking history, generated client integration, and regression coverage on the existing booking app.

[Full Scenario 2 Report]({{ repo }}/blob/{{ branch }}/eval-scenario-2.md) · [Detailed Breakdown](./details)

| Rank | Variant | Score | Time | Tokens | Cost | Checks | Solution |
|---:|---|---:|---:|---:|---:|---|---|
| 1 | [`openai-gpt-5.5-plan-build`](./details#scenario-2-openai-gpt-55-plan-build) | 88 | 16.6m | 269,990 | ~$6.45 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777298973976-scenario-2-openai-gpt-5.5-plan-build-attempt-1) |
| 2 | [`deepseek-v4-pro-plan-flash-build-mimo-review`](./details#scenario-2-deepseek-v4-pro-plan-flash-build-mimo-review) | 82 | 36.8m | 417,005 | $0.63 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777364720430-scenario-2-deepseek-v4-pro-plan-flash-build-mimo-review-attempt-1) |
| 3 | [`mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review`](./details#scenario-2-mimo-v25-pro-plan-mimo-v25-build-deepseek-review) | 82 | 39.9m | 401,441 | $1.59 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777367017204-scenario-2-mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review-attempt-1) |
| 4 | [`deepseek-v4-pro-plan-flash-sliced-build-mimo-review`](./details#scenario-2-deepseek-v4-pro-plan-flash-sliced-build-mimo-review) | 76 | 55.2m | 774,259 | $0.52 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777301480794-scenario-2-deepseek-v4-pro-plan-flash-sliced-build-mimo-review-attempt-1) |
| 5 | [`deepseek-v4-pro-plan-pro-build`](./details#scenario-2-deepseek-v4-pro-plan-pro-build) | 57 | 46.3m | 220,110 | $0.65 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777304791852-scenario-2-deepseek-v4-pro-plan-pro-build-attempt-1) |

## Scenario 2 Takeaways

- OpenAI produced the strongest brownfield auth result, especially on cookie auth, ownership, generated client integration, and balanced backend/frontend changes.
- DeepSeek Flash plus Mimo review and Mimo plus DeepSeek review tied on overall score, but failed in different ways: DeepSeek leaked the legacy all-bookings endpoint and used hand-written auth fetches, while Mimo lacked generated TanStack Query hooks and a strong cross-user isolation test.
- Dynamic sliced execution was much slower and more token-heavy in Scenario 2, and it missed core security/ownership details despite strong generated-client usage.
- DeepSeek Pro without review passed deterministic checks but was judged not reliably runnable because CSRF enforcement and frontend generated-client integration were materially broken.

## Repository Links

- [Harness source]({{ repo }}/tree/{{ branch }})
- [Scenario prompts]({{ repo }}/tree/{{ branch }}/scenarios)
- [Archived eval solutions]({{ repo }}/tree/{{ branch }}/run-archive)
