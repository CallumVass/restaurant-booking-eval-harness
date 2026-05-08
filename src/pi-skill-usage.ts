// pattern: Functional Core

import path from "node:path";

export type PiSkillUsageRecord = {
  name: string;
  path?: string;
  count: number;
  firstEventIndex: number;
  lastEventIndex: number;
};

export type PiSkillUsageSummary = {
  available: string[];
  read: PiSkillUsageRecord[];
  invoked: PiSkillUsageRecord[];
};

type MutableSkillUsageRecord = PiSkillUsageRecord;

export type PiSkillUsageAccumulator = {
  available: Set<string>;
  eventIndex: number;
  read: Map<string, MutableSkillUsageRecord>;
  invoked: Map<string, MutableSkillUsageRecord>;
};

export function createPiSkillUsageAccumulator(available: string[]): PiSkillUsageAccumulator {
  return {
    available: new Set(available),
    eventIndex: 0,
    read: new Map(),
    invoked: new Map()
  };
}

export function recordPiSkillUsageEvent(accumulator: PiSkillUsageAccumulator, event: unknown, workspace: string): void {
  accumulator.eventIndex += 1;
  if (!isRecord(event)) return;

  if (event.type === "tool_execution_start" && event.toolName === "read" && isRecord(event.args) && typeof event.args.path === "string") {
    const skill = skillFromPath(event.args.path, workspace);
    if (skill) record(accumulator.read, skill.name, skill.path, accumulator.eventIndex);
  }

  if (event.type === "message_end" && isRecord(event.message)) {
    for (const text of messageTextParts(event.message)) {
      for (const skill of skillsFromSkillBlocks(text, workspace)) {
        record(accumulator.invoked, skill.name, skill.path, accumulator.eventIndex);
      }
    }
  }
}

export function summarizePiSkillUsage(accumulator: PiSkillUsageAccumulator): PiSkillUsageSummary {
  return {
    available: Array.from(accumulator.available).sort(),
    read: Array.from(accumulator.read.values()).sort(compareSkillUsageRecord),
    invoked: Array.from(accumulator.invoked.values()).sort(compareSkillUsageRecord)
  };
}

function record(records: Map<string, MutableSkillUsageRecord>, name: string, skillPath: string | undefined, eventIndex: number): void {
  const existing = records.get(name);
  if (existing) {
    existing.count += 1;
    existing.lastEventIndex = eventIndex;
    existing.path ??= skillPath;
    return;
  }
  records.set(name, {
    name,
    path: skillPath,
    count: 1,
    firstEventIndex: eventIndex,
    lastEventIndex: eventIndex
  });
}

function skillFromPath(rawPath: string, workspace: string): { name: string; path: string } | null {
  const normalized = normalizeSkillPath(rawPath, workspace);
  const match = /(?:^|\/)skills\/([^/]+)\/SKILL\.md$/u.exec(normalized);
  if (!match) return null;
  return { name: match[1], path: normalized };
}

function skillsFromSkillBlocks(text: string, workspace: string): Array<{ name: string; path?: string }> {
  const skills: Array<{ name: string; path?: string }> = [];
  const regex = /<skill\s+name=["']([^"']+)["']\s+location=["']([^"']+)["'][^>]*>/gu;
  for (const match of text.matchAll(regex)) {
    skills.push({ name: match[1], path: normalizeSkillPath(match[2], workspace) });
  }
  return skills;
}

function normalizeSkillPath(rawPath: string, workspace: string): string {
  const normalizedRaw = rawPath.replaceAll("\\", "/");
  const normalizedWorkspace = path.resolve(workspace).replaceAll("\\", "/");
  const absolutePath = path.isAbsolute(normalizedRaw) ? normalizedRaw : path.resolve(workspace, normalizedRaw).replaceAll("\\", "/");
  if (absolutePath === normalizedWorkspace) return ".";
  if (absolutePath.startsWith(`${normalizedWorkspace}/`)) return absolutePath.slice(normalizedWorkspace.length + 1);
  const archivedWorkspaceMatch = /(?:^|\/)(\.(?:pi|agents|opencode)\/skills\/.+)$/u.exec(normalizedRaw);
  if (archivedWorkspaceMatch) return archivedWorkspaceMatch[1];
  return normalizedRaw;
}

function messageTextParts(message: Record<string, unknown>): string[] {
  const content = message.content;
  if (typeof content === "string") return [content];
  if (!Array.isArray(content)) return [];
  return content.flatMap((part) => {
    if (typeof part === "string") return [part];
    if (isRecord(part) && typeof part.text === "string") return [part.text];
    return [];
  });
}

function compareSkillUsageRecord(left: PiSkillUsageRecord, right: PiSkillUsageRecord): number {
  return left.firstEventIndex - right.firstEventIndex || left.name.localeCompare(right.name);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
