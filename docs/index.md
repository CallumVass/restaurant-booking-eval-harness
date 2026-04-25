---
title: Restaurant Booking Eval Results
---

{% assign repo = site.github.repository_url | default: 'https://github.com/OWNER/REPO' %}
{% assign branch = site.github.source.branch | default: 'main' %}

# Restaurant Booking Eval Results

OpenCode + Lattice evals where model variants built a .NET 10 API and React SPA for a restaurant booking system. The archived solutions are linked to the generated source directories in GitHub.

Costs use provider-reported costs where available. OpenAI GPT-5.5/GPT-5.5-fast costs are estimated from token counts using public GPT-5.5 pricing: $5/input 1M, $0.50/cached-input 1M, $30/output 1M.

[Detailed breakdown by eval](./details)

## Scenario 1

Original restaurant booking system: .NET 10 API, React SPA, booking conflict prevention, available slots, boundary tests, deterministic backend/frontend checks.

[Full Scenario 1 Report]({{ repo }}/blob/{{ branch }}/eval-scenario-1.md)

| Rank | Variant | Score | Time | Tokens | Cost | Checks | Details | Solution |
|---:|---|---:|---:|---:|---:|---|---|---|
| 1 | `openai-gpt-5.5-plan-fast-build` | 94 | 13.6m | 1,740,768 | $2.024899 | Pass | [breakdown](./details?eval=s1-openai-gpt-55-fast) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777053335143-openai-gpt-5.5-plan-fast-build) |
| 2 | `zai-glm-5.1-high-plan-medium-build` | 89 | 27.2m | 14,711,180 | $4.608307 | Pass | [breakdown](./details?eval=s1-zai-glm-51) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777054148547-zai-glm-5.1-high-plan-medium-build) |
| 3 | `qwen3.6-plus-high-plan-medium-build` | 88 | 28.2m | 15,830,612 | $1.234194 | Pass | [breakdown](./details?eval=s1-qwen36-plus) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777058053592-qwen3.6-plus-high-plan-medium-build) |
| 4 | `moonshot-kimi-k2.6-high-plan-medium-build` | 86 | 20.8m | 2,746,024 | $0.282611 | Pass | [breakdown](./details?eval=s1-kimi-k26) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777055782131-moonshot-kimi-k2.6-high-plan-medium-build) |

## Scenario 2

Scenario 1 plus Tailwind CSS, shadcn/ui, TanStack Query/libraries, OpenAPI typed client generation via Orval/equivalent, polished responsive UI, and plan/adherence judging.

[Full Scenario 2 Report]({{ repo }}/blob/{{ branch }}/eval-scenario-2.md)

| Rank | Variant | Score | Time | Tokens | Cost | Checks | Details | Solution |
|---:|---|---:|---:|---:|---:|---|---|---|
| 1 | `openai-gpt-5.5-plan-build` | 91 | 10.8m | 4,397,754 | $3.566181 | Pass | [breakdown](./details?eval=s2-openai-gpt-55) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777100816107-scenario-2-openai-gpt-5.5-plan-build) |
| 2 | `mimo-v2.5-pro-plan-mimo-v2.5-build` | 86 | 15.7m | 10,786,018 | $1.099003 | Pass | [breakdown](./details?eval=s2-mimo-v25) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777106388919-scenario-2-mimo-v2.5-pro-plan-mimo-v2.5-build-attempt-1) |
| 3 | `moonshot-kimi-k2.6-high-plan-medium-build` | 86 | 20.3m | 4,705,968 | $0.447946 | Pass | [breakdown](./details?eval=s2-kimi-k26) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777103372714-scenario-2-moonshot-kimi-k2.6-high-plan-medium-build-attempt-1) |
| 4 | `deepseek-v4-pro-plan-flash-build` | 86 | 29.7m | 25,445,570 | $0.986744 | Pass | [breakdown](./details?eval=s2-deepseek-flash) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777109534353-scenario-2-deepseek-v4-pro-plan-flash-build-attempt-1) |
| 5 | `deepseek-v4-pro-high-plan-medium-build` | 86 | 36.7m | 13,984,485 | $2.620604 | Pass | [breakdown](./details?eval=s2-deepseek-medium) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777107333568-scenario-2-deepseek-v4-pro-high-plan-medium-build-attempt-1) |
| 6 | `minimax-m2.7-high-plan-medium-build` | 82 | 30.0m | 12,275,788 | $0.959646 | Pass | [breakdown](./details?eval=s2-minimax-m27) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-2/1777104591499-scenario-2-minimax-m2.7-high-plan-medium-build-attempt-1) |

## Scenario 3

Brownfield extension from a neutral Scenario 3 baseline: fix known baseline issues, add local cookie auth with CSRF protection, protect booking creation, scope booking history to the authenticated user, preserve generated client/TanStack Query workflow, and score scenario-specific brownfield/auth dimensions.

Scenario 3 results will be added after runs are archived.

## Repository Links

- [Harness source]({{ repo }}/tree/{{ branch }})
- [Scenario prompts]({{ repo }}/tree/{{ branch }}/scenarios)
- [Archived eval solutions]({{ repo }}/tree/{{ branch }}/run-archive)
