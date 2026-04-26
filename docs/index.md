---
title: Restaurant Booking Eval Results
---

{% assign repo = site.github.repository_url | default: 'https://github.com/OWNER/REPO' %}
{% assign branch = site.github.source.branch | default: 'main' %}

# Restaurant Booking Eval Results

OpenCode + Lattice evals where model variants build a .NET 10 API and React SPA for a restaurant booking system.

Results have been reset. New runs will be published here after the next Scenario 1 and Scenario 2 batches complete.

## Current Matrix

| Variant | Review | Purpose |
|---|---|---|
| `openai-gpt-5.5-plan-build` | none | Proprietary quality reference. |
| `deepseek-v4-pro-plan-flash-build-mimo-review` | Mimo v2.5 Pro | Cheap DeepSeek build with independent open-model review. |
| `deepseek-v4-pro-plan-pro-build` | none | DeepSeek Pro quality ceiling without review overhead. |
| `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | DeepSeek V4 Pro | Mimo build with independent DeepSeek review. |

## Reports

- [Scenario 1 report]({{ repo }}/blob/{{ branch }}/eval-scenario-1.md)
- [Scenario 2 report]({{ repo }}/blob/{{ branch }}/eval-scenario-2.md)
- [Detailed breakdown](./details)

## Repository Links

- [Harness source]({{ repo }}/tree/{{ branch }})
- [Scenario prompts]({{ repo }}/tree/{{ branch }}/scenarios)
- [Archived eval solutions]({{ repo }}/tree/{{ branch }}/run-archive)
