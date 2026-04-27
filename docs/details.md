---
title: Detailed Eval Breakdown
---

{% assign repo = site.github.repository_url | default: 'https://github.com/OWNER/REPO' %}
{% assign branch = site.github.source.branch | default: 'main' %}
{% assign repository_nwo = site.github.repository_nwo | default: 'OWNER/REPO' %}
{% assign raw_base = 'https://raw.githubusercontent.com/' | append: repository_nwo | append: '/' | append: branch | append: '/' %}

# Detailed Eval Breakdown

This page loads each published `result.json` from the archived eval solutions and renders judge scores, deterministic checks, telemetry, findings, and links back to the exact source directories.

[Back to summary](./)

<div id="status">Loading archived result files...</div>
<div id="results"></div>

<style>
  #results {
    display: grid;
    gap: 1.25rem;
  }

  .eval-card {
    border: 1px solid #d0d7de;
    border-radius: 0.75rem;
    padding: 1rem;
    background: #ffffff;
  }

  .eval-card h2 {
    margin-top: 0;
  }

  .meta-grid,
  .score-grid,
  .flag-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 0.5rem;
  }

  .metric {
    border: 1px solid #d8dee4;
    border-radius: 0.5rem;
    padding: 0.5rem 0.65rem;
    background: #f6f8fa;
  }

  .metric strong {
    display: block;
    font-size: 0.8rem;
    color: #57606a;
  }

  .pass {
    color: #116329;
    font-weight: 600;
  }

  .fail {
    color: #cf222e;
    font-weight: 600;
  }

  .checks,
  .telemetry-table {
    overflow-x: auto;
  }

  .checks table,
  .telemetry-table table {
    width: 100%;
    min-width: 42rem;
  }

  details {
    margin-top: 0.75rem;
  }

  details pre {
    white-space: pre-wrap;
  }
</style>

<script>
const repoUrl = "{{ repo }}";
const rawBase = "{{ raw_base }}";
const branch = "{{ branch }}";

const evals = [
  {
    id: "openai-gpt-55-plan-build",
    scenario: "Scenario 1",
    rank: 1,
    estimatedCost: "~$3.54",
    path: "run-archive/scenario-1/1777267827113-scenario-1-openai-gpt-5.5-plan-build-attempt-1/result.json"
  },
  {
    id: "deepseek-v4-pro-plan-flash-sliced-build-mimo-review-dynamic",
    scenario: "Scenario 1",
    rank: 2,
    path: "run-archive/scenario-1/1777292815801-scenario-1-deepseek-v4-pro-plan-flash-sliced-build-mimo-review-attempt-1/result.json"
  },
  {
    id: "mimo-v25-pro-plan-mimo-v25-build-deepseek-review",
    scenario: "Scenario 1",
    rank: 3,
    path: "run-archive/scenario-1/1777275063712-scenario-1-mimo-v2.5-pro-plan-mimo-v2.5-build-deepseek-review-attempt-1/result.json"
  },
  {
    id: "deepseek-v4-pro-plan-flash-sliced-build-mimo-review-prior",
    scenario: "Scenario 1",
    rank: 4,
    path: "run-archive/scenario-1/1777282060863-scenario-1-deepseek-v4-pro-plan-flash-sliced-build-mimo-review-attempt-1/result.json"
  },
  {
    id: "deepseek-v4-pro-plan-pro-build",
    scenario: "Scenario 1",
    rank: 5,
    path: "run-archive/scenario-1/1777270578875-scenario-1-deepseek-v4-pro-plan-pro-build-attempt-1/result.json"
  },
  {
    id: "deepseek-v4-pro-plan-flash-build-mimo-review",
    scenario: "Scenario 1",
    rank: 6,
    path: "run-archive/scenario-1/1777268491502-scenario-1-deepseek-v4-pro-plan-flash-build-mimo-review-attempt-1/result.json"
  }
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function formatMinutes(durationMs) {
  return `${(Number(durationMs || 0) / 60000).toFixed(1)}m`;
}

function formatSeconds(durationMs) {
  return `${(Number(durationMs || 0) / 1000).toFixed(1)}s`;
}

function totalTokens(result) {
  const telemetry = result.telemetry || {};
  return (telemetry.tokensIn || 0) +
    (telemetry.tokensOut || 0) +
    (telemetry.tokensReasoning || 0);
}

function displayCost(item, result) {
  if (item.estimatedCost) return item.estimatedCost;
  const cost = Number(result.telemetry?.costUSD || 0);
  return `$${cost.toFixed(2)}`;
}

function metric(label, value, className = "") {
  return `<div class="metric ${className}"><strong>${escapeHtml(label)}</strong>${escapeHtml(value)}</div>`;
}

function list(items, emptyText) {
  if (!items || items.length === 0) {
    return `<p>${escapeHtml(emptyText)}</p>`;
  }
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function scoreGrid(judge) {
  const scores = Object.entries(judge || {})
    .filter(([key, value]) => key.endsWith("Score") && typeof value === "number")
    .map(([key, value]) => metric(key.replace(/Score$/, ""), value));
  return `<div class="score-grid">${scores.join("")}</div>`;
}

function scenarioScores(judge) {
  const rows = (judge.scenarioScores || []).map((score) => `
    <tr>
      <td>${escapeHtml(score.name)}</td>
      <td>${escapeHtml(score.score)}</td>
    </tr>
  `).join("");
  if (!rows) return "<p>No scenario-specific scores recorded.</p>";
  return `<table><thead><tr><th>Dimension</th><th>Score</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function flagGrid(judge) {
  const flags = Object.entries(judge || {})
    .filter(([, value]) => typeof value === "boolean")
    .map(([key, value]) => metric(key, value ? "Pass" : "Fail", value ? "pass" : "fail"));
  return `<div class="flag-grid">${flags.join("")}</div>`;
}

function checksTable(checks) {
  if (!checks || checks.length === 0) {
    return "<p>No deterministic checks recorded.</p>";
  }
  const rows = checks.map((check) => `
    <tr>
      <td><code>${escapeHtml(check.command)}</code></td>
      <td class="${check.exitCode === 0 ? "pass" : "fail"}">${escapeHtml(check.exitCode === 0 ? "Pass" : `Fail (${check.exitCode})`)}</td>
      <td>${escapeHtml(formatSeconds(check.durationMs))}</td>
    </tr>
  `).join("");
  return `
    <div class="checks">
      <table>
        <thead><tr><th>Command</th><th>Status</th><th>Duration</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function telemetrySection(result) {
  const telemetry = result.telemetry || {};
  const stages = telemetry.stages || [];
  const stageRows = stages.map((stage) => `
    <tr>
      <td>${escapeHtml(stage.id)}</td>
      <td>${escapeHtml(stage.model || "")}</td>
      <td>${formatNumber(stage.tokensIn)}</td>
      <td>${formatNumber(stage.tokensOut)}</td>
      <td>${formatNumber(stage.tokensReasoning)}</td>
      <td>${formatNumber(stage.tokensCacheRead)}</td>
      <td>$${Number(stage.costUSD || 0).toFixed(4)}</td>
    </tr>
  `).join("");
  const judge = telemetry.judge;
  const judgeRow = judge ? `
    <tr>
      <td>judge</td>
      <td>${escapeHtml(judge.model || "")}</td>
      <td>${formatNumber(judge.tokensIn)}</td>
      <td>${formatNumber(judge.tokensOut)}</td>
      <td>${formatNumber(judge.tokensReasoning)}</td>
      <td>${formatNumber(judge.tokensCacheRead)}</td>
      <td>$${Number(judge.costUSD || 0).toFixed(4)}</td>
    </tr>
  ` : "";
  return `
    <div class="meta-grid">
      ${metric("Total tokens", formatNumber(totalTokens(result)))}
      ${metric("Input tokens", formatNumber(telemetry.tokensIn))}
      ${metric("Output tokens", formatNumber(telemetry.tokensOut))}
      ${metric("Reasoning tokens", formatNumber(telemetry.tokensReasoning))}
      ${metric("Cached input tokens", formatNumber(telemetry.tokensCacheRead))}
      ${metric("Messages", formatNumber(telemetry.messageCount))}
    </div>
    <details>
      <summary>Stage telemetry</summary>
      <div class="telemetry-table">
        <table>
          <thead><tr><th>Stage</th><th>Model</th><th>Input</th><th>Output</th><th>Reasoning</th><th>Cached Input</th><th>Cost</th></tr></thead>
          <tbody>${stageRows}${judgeRow}</tbody>
        </table>
      </div>
    </details>
  `;
}

function renderCard(item, result) {
  const judge = result.judge?.structured || result.judge || {};
  const resultPath = item.path;
  const sourcePath = resultPath.replace(/\/result\.json$/, "");
  const sourceUrl = `${repoUrl}/tree/${branch}/${sourcePath}`;
  const resultUrl = `${repoUrl}/blob/${branch}/${resultPath}`;
  const status = result.pipelineState?.status || "unknown";
  return `
    <article class="eval-card" id="${escapeHtml(item.id)}">
      <h2>${escapeHtml(item.scenario)} Rank ${item.rank}: <code>${escapeHtml(result.variant)}</code></h2>
      <div class="meta-grid">
        ${metric("Overall", judge.overallScore ?? "N/A")}
        ${metric("Duration", formatMinutes(result.durationMs))}
        ${metric("Tokens", formatNumber(totalTokens(result)))}
        ${metric("Cost", displayCost(item, result))}
        ${metric("Pipeline", status)}
        ${metric("Checks", judge.deterministicChecksPass ? "Pass" : "Fail", judge.deterministicChecksPass ? "pass" : "fail")}
      </div>
      <p><a href="${sourceUrl}">Source directory</a> · <a href="${resultUrl}">result.json</a></p>
      <h3>Judge Summary</h3>
      <p>${escapeHtml(judge.summary || "No judge summary recorded.")}</p>
      <h3>Scores</h3>
      ${scoreGrid(judge)}
      <h3>Scenario Scores</h3>
      ${scenarioScores(judge)}
      <h3>Requirement Flags</h3>
      ${flagGrid(judge)}
      <h3>Major Issues</h3>
      ${list(judge.majorIssues, "No major issues recorded.")}
      <h3>Missing Requirements</h3>
      ${list(judge.missingRequirements, "No missing requirements recorded.")}
      <h3>Notable Strengths</h3>
      ${list(judge.notableStrengths, "No notable strengths recorded.")}
      <h3>Scenario Findings</h3>
      ${list(judge.scenarioFindings, "No scenario findings recorded.")}
      <h3>Deterministic Checks</h3>
      ${checksTable(result.checks)}
      <h3>Telemetry</h3>
      ${telemetrySection(result)}
      <details>
        <summary>Saved implementation plan</summary>
        <pre>${escapeHtml(result.plan || "No plan recorded.")}</pre>
      </details>
    </article>
  `;
}

async function loadResults() {
  const container = document.getElementById("results");
  const status = document.getElementById("status");
  const cards = [];
  const failures = [];

  for (const item of evals) {
    try {
      const response = await fetch(`${rawBase}${item.path}`);
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      cards.push(renderCard(item, result));
    } catch (error) {
      failures.push(`${item.path}: ${error.message}`);
    }
  }

  container.innerHTML = cards.join("");
  status.innerHTML = failures.length === 0
    ? `Loaded ${cards.length} archived result files.`
    : `Loaded ${cards.length} archived result files. Failed to load: ${escapeHtml(failures.join("; "))}`;
}

loadResults();
</script>
