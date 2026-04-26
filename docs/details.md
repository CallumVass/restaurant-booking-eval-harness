---
title: Detailed Eval Breakdown
---

{% assign repo = site.github.repository_url | default: 'https://github.com/OWNER/REPO' %}
{% assign branch = site.github.source.branch | default: 'main' %}

# Detailed Eval Breakdown

[Back to summary](./)

Archived result details have been reset. This page will be repopulated after new runs are published under `run-archive/`.

Expected result location pattern:

```text
run-archive/scenario-<n>/<timestamp>-scenario-<n>-<variant>-attempt-<n>/result.json
```

Report templates:

- [Scenario 1 report]({{ repo }}/blob/{{ branch }}/eval-scenario-1.md)
- [Scenario 2 report]({{ repo }}/blob/{{ branch }}/eval-scenario-2.md)
