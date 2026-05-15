---
title: Restaurant Booking Eval Results
---

{% assign repo = site.github.repository_url | default: 'https://github.com/OWNER/REPO' %}
{% assign branch = site.github.source.branch | default: 'main' %}

# Restaurant Booking Eval Results

OpenCode/Lattice and Pi `pi-single` evals where model variants build a .NET 10 API and React SPA for a restaurant booking system. The latest Pi runs use bounded Kimi-style delegation through `delegate_workflow`: one planning swarm, one review swarm, and variant-local delegator profiles.

Costs use archived provider-reported costs where available plus estimated OpenAI costs. Older open-model archives predate richer configured/observed model telemetry, so public-price normalized comparisons should treat those costs as approximate.

## Scenario 1

Strong frontend/client restaurant booking system: .NET 10 API, React SPA, Tailwind CSS, shadcn/ui, TanStack Query, OpenAPI-generated typed client, booking conflict prevention, available slots, boundary tests, and deterministic backend/frontend checks.

[Full Scenario 1 Report]({{ repo }}/blob/{{ branch }}/eval-scenario-1.md) · [Detailed Breakdown](./details)

| Rank | Variant | Backend | Delegation | Score | Time | Tokens | Cost | Checks | Solution |
|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | [`openai-gpt-5.5-plan-build`](./details#openai-gpt-55-plan-build-lattice) | Lattice | none | 91 | 11.1m | 135,605 | ~$3.54 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777267827113-scenario-1-openai-gpt-5.5-plan-build-attempt-1) |
| 2 | [`openai-gpt-5.5-plan-build`](./details#openai-gpt-55-plan-build-pi-single-bounded-swarm) | Pi single | 2 workflow swarms | 89 | 7.7m | 110,688 | ~$1.35 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1778845240606-scenario-1-openai-gpt-5.5-plan-build-attempt-1) |
| 3 | [`deepseek-v4-pro-plan-flash-build-mimo-review`](./details#deepseek-v4-pro-plan-flash-build-mimo-review-pi-single-delegated-swarm) | Pi single | delegated swarm | 88 | 29.7m | 170,669 | ~$0.15 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1778850600043-scenario-1-deepseek-v4-pro-plan-flash-build-mimo-review-attempt-1) |
| 4 | [`deepseek-v4-pro-plan-flash-sliced-build-mimo-review`](./details#deepseek-v4-pro-plan-flash-sliced-build-mimo-review-dynamic) | Lattice | sliced + review | 86 | 57.9m | 704,447 | $0.56 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777292815801-scenario-1-deepseek-v4-pro-plan-flash-sliced-build-mimo-review-attempt-1) |
| 5 | [`mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review`](./details#mimo-v25-pro-plan-mimo-v25-build-deepseek-review) | Lattice | review | 84 | 34.3m | 368,209 | $1.62 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777275063712-scenario-1-mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review-attempt-1) |
| 6 | [`deepseek-v4-pro-plan-pro-build`](./details#deepseek-v4-pro-plan-pro-build) | Lattice | none | 82 | 45.2m | 265,302 | $0.80 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777270578875-scenario-1-deepseek-v4-pro-plan-pro-build-attempt-1) |
| 7 | [`deepseek-v4-pro-plan-flash-build-mimo-review`](./details#deepseek-v4-pro-plan-flash-build-mimo-review-lattice-original) | Lattice | review | 78 | 34.8m | 321,658 | $0.65 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777268491502-scenario-1-deepseek-v4-pro-plan-flash-build-mimo-review-attempt-1) |

## Scenario 1 Takeaways

- The original OpenAI Lattice run remains the top score at `91`.
- OpenAI Pi single bounded swarm was the fastest Scenario 1 run at `7.7m`, scoring `89` with two `delegate_workflow` calls.
- DeepSeek Flash Pi single delegated swarm improved the original DeepSeek Flash + Mimo review result from `78` to `88` while cutting time, tokens, and cost.
- The older dynamic sliced DeepSeek run still had stronger typed-client/frontend scores than the latest DeepSeek Pi single run, but was much slower and token-heavy.

## Scenario 2

Brownfield auth/security extension: local cookie auth, CSRF protection, user-owned bookings, protected booking history, generated client integration, and regression coverage on the existing booking app.

[Full Scenario 2 Report]({{ repo }}/blob/{{ branch }}/eval-scenario-2.md) · [Detailed Breakdown](./details)

| Rank | Variant | Backend | Delegation | Score | Time | Tokens | Cost | Checks | Solution |
|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | [`openai-gpt-5.5-plan-build`](./details#scenario-2-openai-gpt-55-plan-build-lattice) | Lattice | none | 88 | 16.6m | 269,990 | ~$6.45 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777298973976-scenario-2-openai-gpt-5.5-plan-build-attempt-1) |
| 1 | [`openai-gpt-5.5-plan-build`](./details#scenario-2-openai-gpt-55-plan-build-pi-single-bounded-swarm-medium) | Pi single | 2 workflow swarms | 88 | 12.9m | 166,025 | ~$2.69 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1778847125134-scenario-2-openai-gpt-5.5-plan-build-attempt-1) |
| 3 | [`deepseek-v4-pro-plan-flash-sliced-build-mimo-review`](./details#scenario-2-deepseek-v4-pro-plan-flash-sliced-build-mimo-review) | Lattice | sliced + review | 87 | 83.3m | 1,220,714 | $0.86 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777462311663-scenario-2-deepseek-v4-pro-plan-flash-sliced-build-mimo-review-attempt-1) |
| 4 | [`deepseek-v4-pro-plan-flash-build-mimo-review`](./details#scenario-2-deepseek-v4-pro-plan-flash-build-mimo-review) | Lattice | review | 82 | 36.8m | 417,005 | $0.68 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777364720430-scenario-2-deepseek-v4-pro-plan-flash-build-mimo-review-attempt-1) |
| 4 | [`mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review`](./details#scenario-2-mimo-v25-pro-plan-mimo-v25-build-deepseek-review) | Lattice | review | 82 | 39.9m | 401,441 | $1.50 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777367017204-scenario-2-mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review-attempt-1) |
| 6 | [`deepseek-v4-pro-plan-pro-build`](./details#scenario-2-deepseek-v4-pro-plan-pro-build) | Lattice | none | 57 | 46.3m | 220,110 | $0.65 | Pass | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777304791852-scenario-2-deepseek-v4-pro-plan-pro-build-attempt-1) |

## Scenario 2 Takeaways

- OpenAI Pi single bounded swarm with the `balanced` profile at medium thinking tied the original OpenAI score (`88`) while cutting time, tokens, and estimated cost.
- Scenario 2 needs medium implementation thinking: auth, CSRF, OpenAPI, generated client, frontend tests, and ownership rules are cross-surface work.
- Dynamic sliced DeepSeek remains the strongest open-model Lattice result, but the latest OpenAI Pi single medium run is far faster and cheaper at the same top score as original OpenAI.

## Repository Links

- [Harness source]({{ repo }}/tree/{{ branch }})
- [Scenario prompts]({{ repo }}/tree/{{ branch }}/scenarios)
- [Archived eval solutions]({{ repo }}/tree/{{ branch }}/run-archive)
