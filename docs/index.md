---
title: Restaurant Booking Eval Results
---

{% assign repo = site.github.repository_url | default: 'https://github.com/OWNER/REPO' %}
{% assign branch = site.github.source.branch | default: 'main' %}

# Restaurant Booking Eval Results

OpenCode + Lattice evals where model variants build a .NET 10 API and React SPA for a restaurant booking system.

Scenario 1 has completed for the current four-variant matrix. All variants passed deterministic checks and were judged; one reviewed run paused after exhausting its single review retry but was salvaged because checks passed.

## Scenario 1 Leaderboard

| Rank | Variant | Review | Score | Status | Checks | Cost |
|---:|---|---|---:|---|---|---:|
| 1 | `openai-gpt-5.5-plan-build` | none | 91 | completed | pass | ~$3.54 |
| 2 | `mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review` | DeepSeek V4 Pro | 84 | judged after review rejection | pass | $1.62 |
| 3 | `deepseek-v4-pro-plan-pro-build` | none | 82 | completed | pass | $0.80 |
| 4 | `deepseek-v4-pro-plan-flash-build-mimo-review` | Mimo v2.5 Pro | 78 | completed, review approved | pass | $0.65 |

## Takeaways

- OpenAI produced the strongest Scenario 1 implementation: best overall score, fast runtime, generated typed client, strong booking rules, and polished frontend.
- Mimo plus DeepSeek review finished second. Review improved the result once, then caught one remaining plan-specific missing API test and paused after the retry budget was exhausted.
- DeepSeek Pro without review built a strong backend but missed the central generated-client requirement by using a hand-written fetch wrapper.
- DeepSeek Flash plus Mimo review had the lowest judged score because the reviewer approved despite runtime API double-prefixing, incomplete shadcn evidence, and a table-selection conflict flaw.

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
