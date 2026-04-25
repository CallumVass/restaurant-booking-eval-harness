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

Restaurant booking system with .NET 10 API, React SPA, Tailwind CSS, shadcn/ui, TanStack Query, OpenAPI typed client generation, polished responsive UI, booking conflict prevention, available slots, boundary tests, deterministic backend/frontend checks, and plan/adherence judging.

[Full Scenario 1 Report]({{ repo }}/blob/{{ branch }}/eval-scenario-1.md)

| Rank | Variant | Score | Time | Tokens | Cost | Checks | Details | Solution |
|---:|---|---:|---:|---:|---:|---|---|---|
| 1 | `openai-gpt-5.5-plan-build` | 91 | 12.6m | 4,237,796 | $3.646083 | Pass | [breakdown](./details?eval=s1-openai-gpt-55) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777138615836-scenario-1-openai-gpt-5.5-plan-build-attempt-1) |
| 2 | `deepseek-v4-pro-plan-flash-build` | 88 | 22.3m | 11,359,693 | $0.398040 | Pass | [breakdown](./details?eval=s1-deepseek-flash) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777144375955-scenario-1-deepseek-v4-pro-plan-flash-build-attempt-1) |
| 3 | `mimo-v2.5-pro-plan-mimo-v2.5-build` | 74 | 15.4m | 10,325,013 | $0.974228 | Pass | [breakdown](./details?eval=s1-mimo-v25) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777143448989-scenario-1-mimo-v2.5-pro-plan-mimo-v2.5-build-attempt-1) |
| 4 | `qwen3.6-plus-high-plan-medium-build` | 72 | 25.9m | 9,474,158 | $0.643007 | Pass | [breakdown](./details?eval=s1-qwen36) | [source]({{ repo }}/tree/{{ branch }}/run-archive/scenario-1/1777141829210-scenario-1-qwen3.6-plus-high-plan-medium-build-attempt-1) |

## Scenario 2

Brownfield extension from a neutral Scenario 2 baseline: fix known baseline issues, add local cookie auth with CSRF protection, protect booking creation, scope booking history to the authenticated user, preserve generated client/TanStack Query workflow, and score scenario-specific brownfield/auth dimensions.

[Full Scenario 2 Report]({{ repo }}/blob/{{ branch }}/eval-scenario-2.md)

Scenario 2 results will be added after post-orchestration-fix runs are archived.

## Repository Links

- [Harness source]({{ repo }}/tree/{{ branch }})
- [Scenario prompts]({{ repo }}/tree/{{ branch }}/scenarios)
- [Archived eval solutions]({{ repo }}/tree/{{ branch }}/run-archive)
