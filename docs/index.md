---
title: Restaurant Booking Eval Results
---

{% assign repo = site.github.repository_url | default: 'https://github.com/OWNER/REPO' %}
{% assign branch = site.github.source.branch | default: 'main' %}

# Restaurant Booking Eval Results

OpenCode + Lattice evals where model variants build a .NET 10 API and React SPA for a restaurant booking system. The archived solutions are linked to the generated source directories in GitHub.

Costs use provider-reported costs where available. OpenAI `gpt-5.5` costs are estimated from public model pricing data: `$5/input 1M`, `$0.50/cached-input 1M`, `$30/output 1M`, with reasoning tokens counted as output tokens for the estimate.

## Scenario 1

Strong frontend/client restaurant booking system: .NET 10 API, React SPA, Tailwind CSS, shadcn/ui, TanStack Query, OpenAPI-generated typed client, booking conflict prevention, available slots, boundary tests, and deterministic backend/frontend checks.

[Full Scenario 1 Report]({{ repo }}/blob/{{ branch }}/eval-scenario-1.md) · [Detailed Breakdown](./details)

| Rank | Variant | Score | Time | Tokens | Cost | Checks | Solution |
|---:|---|---:|---:|---:|---:|---|---|
| 1 | [`openai-gpt-5.5-plan-build`](./details#openai-gpt-55-plan-build) | 91 | 11.1m | 135,605 | ~$3.54 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777267827113-scenario-1-openai-gpt-5.5-plan-build-attempt-1) |
| 2 | [`mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review`](./details#mimo-v25-pro-plan-mimo-v25-build-deepseek-review) | 84 | 34.3m | 368,209 | $1.62 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777275063712-scenario-1-mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review-attempt-1) |
| 3 | [`deepseek-v4-pro-plan-flash-sliced-build-mimo-review`](./details#deepseek-v4-pro-plan-flash-sliced-build-mimo-review) | 82 | 56.9m | 436,502 | $0.59 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777282060863-scenario-1-deepseek-v4-pro-plan-flash-sliced-build-mimo-review-attempt-1) |
| 4 | [`deepseek-v4-pro-plan-pro-build`](./details#deepseek-v4-pro-plan-pro-build) | 82 | 45.2m | 265,302 | $0.80 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777270578875-scenario-1-deepseek-v4-pro-plan-pro-build-attempt-1) |
| 5 | [`deepseek-v4-pro-plan-flash-build-mimo-review`](./details#deepseek-v4-pro-plan-flash-build-mimo-review) | 78 | 34.8m | 321,658 | $0.65 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777268491502-scenario-1-deepseek-v4-pro-plan-flash-build-mimo-review-attempt-1) |

## Scenario 1 Takeaways

- OpenAI produced the strongest result: best score, fastest run, strong frontend, generated typed client, and clean deterministic checks.
- Mimo plus DeepSeek review finished second. Review improved the build once, then caught one remaining plan-specific missing API test and paused after retry exhaustion; deterministic checks passed, so the run was judged.
- Sliced execution improved the DeepSeek Pro plan + Flash build + Mimo review combo from `78` to `82`, making the app runnable and improving shadcn/typed-client integration, but it took about 22 minutes longer and still missed invalid date/time and slot-submission correctness.
- DeepSeek Pro without review built a strong backend but missed the central generated OpenAPI client requirement by using a hand-written fetch wrapper.
- DeepSeek Flash plus Mimo review passed deterministic checks but had runtime API double-prefixing, incomplete shadcn evidence, and a table-selection conflict flaw.

## Current Matrix

| Variant | Review | Purpose |
|---|---|---|
| `openai-gpt-5.5-plan-build` | none | Proprietary quality reference. |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Mimo v2.5 Pro | Cheap DeepSeek build with independent open-model review. |
| `deepseek-v4-pro-plan-flash-sliced-build-mimo-review` | Mimo v2.5 Pro | Same DeepSeek Pro plan and Flash build as the cheap open baseline, but executes normalized slices in fresh contexts. |
| `deepseek-v4-pro-plan-pro-build` | none | DeepSeek Pro quality ceiling without review overhead. |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | DeepSeek V4 Pro | Mimo build with independent DeepSeek review. |

## Scenario 2

Scenario 2 results have not been republished for the current reset archive yet.

[Scenario 2 Report Template]({{ repo }}/blob/{{ branch }}/eval-scenario-2.md)

## Repository Links

- [Harness source]({{ repo }}/tree/{{ branch }})
- [Scenario prompts]({{ repo }}/tree/{{ branch }}/scenarios)
- [Archived eval solutions]({{ repo }}/tree/{{ branch }}/run-archive)
