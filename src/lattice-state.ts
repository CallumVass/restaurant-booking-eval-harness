// pattern: Imperative Shell

import type { PipelineInstance, PipelineStatus } from "@callumvass/lattice";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

export type TimeoutPipelineState = {
  status: "timeout";
  timeoutMs: number;
  lastState: PipelineState;
};

export type PipelineState = PipelineInstance | TimeoutPipelineState | null;

type PipelineStageStatus = PipelineInstance["stages"][number]["status"];

export async function waitForPipeline(
  workspace: string,
  timeoutMs: number,
  log: (message: string) => void
): Promise<PipelineState> {
  const start = Date.now();
  let lastState: PipelineState = null;
  let lastLoggedStatus = "waiting-for-state";
  let lastHeartbeat = start;
  log(`Pipeline: waiting for .lattice/state (timeout ${Math.round(timeoutMs / 60000)}m)`);

  while (Date.now() - start < timeoutMs) {
    lastState = await latestPipelineState(workspace);
    const status = getPipelineStatus(lastState);

    const displayStatus = status ?? "waiting-for-state";
    if (displayStatus !== lastLoggedStatus) {
      lastLoggedStatus = displayStatus;
      log(`Pipeline: status ${displayStatus}`);
    }

    if (status === "completed" || status === "paused" || status === "failed") {
      return lastState;
    }

    if (Date.now() - lastHeartbeat > 60_000) {
      lastHeartbeat = Date.now();
      log(`Pipeline: still ${displayStatus} after ${Math.round((Date.now() - start) / 60000)}m`);
    }

    await sleep(10_000);
  }

  return { status: "timeout", timeoutMs, lastState };
}

export function isPipelineCompleted(state: unknown): boolean {
  return getPipelineStatus(state) === "completed";
}

export function getPipelineStatus(state: unknown): PipelineStatus | "timeout" | undefined {
  return typeof state === "object" && state !== null ? ((state as { status?: PipelineStatus | "timeout" }).status) : undefined;
}

export function reviewRejectionSummary(state: unknown): string | null {
  if (getPipelineStatus(state) !== "paused" || !state || typeof state !== "object") return null;
  const stages = (state as PipelineInstance).stages;
  if (!Array.isArray(stages)) return null;
  const retryableReviewStageIds = new Set(["slice-plan-review", "plan-adherence-review"]);
  const rejected = stages.find((stage) => retryableReviewStageIds.has(stage.id) && stage.status === "rejected");
  if (!rejected) return null;
  return typeof rejected.summary === "string" && rejected.summary.trim().length > 0
    ? rejected.summary.trim()
    : "Review stage rejected without a summary.";
}

export function completedPipelineAnomaly(state: unknown): string | null {
  if (getPipelineStatus(state) !== "completed") return null;
  if (!state || typeof state !== "object") return "completed pipeline state is missing";

  const stages = (state as PipelineInstance).stages;
  if (!Array.isArray(stages)) return "completed pipeline state has no stages";

  const completedStages = stages.filter((stage) => stage.status === ("completed" satisfies PipelineStageStatus));

  if (completedStages.length === 0) return "completed pipeline has no completed stages";

  const buildStage = completedStages.find(
    (stage) => stage.id === "build" || stage.agent === "build" || stage.agent === "eval-builder" || stage.agent === "implementor"
  );
  const stagesToCheck = buildStage ? [buildStage] : completedStages;

  for (const stage of stagesToCheck) {
    if (stage.agent === "eval-builder") {
      continue;
    }
    if (!stage.telemetry || typeof stage.telemetry !== "object") {
      return buildStage ? `completed build stage has no assistant telemetry (${stage.id})` : "completed pipeline has no assistant telemetry";
    }
    const messageCount = typeof stage.telemetry.messageCount === "number" ? stage.telemetry.messageCount : 0;
    const tokensIn = typeof stage.telemetry.tokensIn === "number" ? stage.telemetry.tokensIn : 0;
    const tokensOut = typeof stage.telemetry.tokensOut === "number" ? stage.telemetry.tokensOut : 0;
    if (messageCount === 0 || (tokensIn === 0 && tokensOut === 0)) {
      return buildStage
        ? `completed build stage has no assistant telemetry (${stage.id})`
        : `completed stage has no assistant telemetry (${stage.id})`;
    }
  }

  return null;
}

async function latestPipelineState(workspace: string): Promise<PipelineInstance | null> {
  const stateDir = path.join(workspace, ".lattice", "state");
  let entries: string[];
  try {
    entries = await readdir(stateDir);
  } catch {
    return null;
  }

  const jsonFiles = entries.filter((entry) => entry.endsWith(".json"));
  if (jsonFiles.length === 0) return null;

  const files = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(stateDir, file);
      return { filePath, stats: await stat(filePath) };
    })
  );
  files.sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs);

  return JSON.parse(await readFile(files[0].filePath, "utf8")) as PipelineInstance;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
