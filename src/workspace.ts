// pattern: Imperative Shell

import { chmod, cp, mkdir, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { runCommand } from "./checks.js";

type Logger = (message: string) => void;

const baselineExcludeNames = new Set([
  ".agents",
  ".codemap",
  ".git",
  ".lattice",
  ".opencode",
  "bin",
  "coverage",
  "dist",
  "node_modules",
  "obj",
  "result.json"
]);

const settleIgnoredDirs = new Set([".codemap", ".git", ".lattice", ".opencode", "bin", "coverage", "dist", "node_modules", "obj"]);

export async function prepareWorkspace(input: {
  workspace: string;
  variantId: string;
  skipSkills: boolean;
  baselinePath: string | null;
  root: string;
  opencodeConfig: unknown;
  pipelineTemplate: string;
  log: Logger;
}): Promise<void> {
  await rm(input.workspace, { recursive: true, force: true });
  await mkdir(input.workspace, { recursive: true });

  if (input.baselinePath) {
    input.log(`${input.variantId}: copying baseline source from ${input.baselinePath}`);
    await copyBaseline(input.baselinePath, input.workspace);
  }

  let codemapBinary: string | null = null;
  if (process.env.EVAL_CODEMAP === "1") {
    codemapBinary = await resolveCodemapBinary();
    await initializeCodemapWorkspace(input.workspace, input.variantId, input.log, codemapBinary);
  }

  await mkdir(path.join(input.workspace, ".opencode", "lattice-pipelines"), { recursive: true });
  await mkdir(path.join(input.workspace, ".opencode", "bin"), { recursive: true });
  await mkdir(path.join(input.workspace, ".opencode", "scripts"), { recursive: true });
  await mkdir(path.join(input.workspace, ".lattice", "plans"), { recursive: true });
  await mkdir(path.join(input.workspace, ".lattice", "plans", "slices"), { recursive: true });
  await mkdir(path.join(input.workspace, ".lattice", "summaries"), { recursive: true });

  const packageJsonPath = path.join(input.workspace, "package.json");
  if (!(await exists(packageJsonPath))) {
    await writeFile(packageJsonPath, `${JSON.stringify({ private: true }, null, 2)}\n`);
  }
  const gitignorePath = path.join(input.workspace, ".gitignore");
  if (!(await exists(gitignorePath))) {
    await writeFile(gitignorePath, workspaceGitignore());
  }

  await writeFile(path.join(input.workspace, "opencode.json"), `${JSON.stringify(input.opencodeConfig, null, 2)}\n`);
  await writeFile(path.join(input.workspace, ".opencode", "lattice-pipelines", "restaurant-booking-eval.ts"), input.pipelineTemplate);
  if (codemapBinary) {
    await writeCodemapWrapper(input.workspace, codemapBinary);
  }
  await cp(
    path.join(input.root, "templates", "scripts", "deterministic-checks.mjs"),
    path.join(input.workspace, ".opencode", "scripts", "deterministic-checks.mjs")
  );

  if (!input.skipSkills) {
    input.log(`${input.variantId}: installing skills`);
    const skillInstall = await runCommand("bash", [path.join(input.root, "scripts", "install-skills.sh")], input.workspace, 10 * 60 * 1000);
    input.log(`${input.variantId}: skill install exited ${skillInstall.exitCode}`);
    if (skillInstall.exitCode !== 0) {
      throw new Error(`Skill install failed:\n${skillInstall.stderr || skillInstall.stdout}`);
    }
    input.log(`${input.variantId}: syncing skills for Lattice`);
    await syncSkillsForLattice(input.workspace);
  } else {
    input.log(`${input.variantId}: skipping skill install`);
  }
}

export async function archiveRun(workspace: string, scenario: string, archiveDir: string): Promise<string> {
  await preserveCodemapUsageLog(workspace);
  await rm(path.join(workspace, ".codemap"), { recursive: true, force: true });
  await rm(path.join(workspace, ".git"), { recursive: true, force: true });

  const destination = path.join(archiveDir, `scenario-${scenario}`, path.basename(workspace));
  await rm(destination, { recursive: true, force: true });
  await mkdir(path.dirname(destination), { recursive: true });

  try {
    await rename(workspace, destination);
  } catch (error) {
    const code = typeof error === "object" && error !== null ? (error as { code?: string }).code : undefined;
    if (code !== "EXDEV") throw error;
    await cp(workspace, destination, { recursive: true });
    await rm(workspace, { recursive: true, force: true });
  }

  return destination;
}

export async function listFiles(directory: string, limit: number): Promise<string[]> {
  const files: string[] = [];

  async function walk(current: string) {
    if (files.length >= limit) return;
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (files.length >= limit) return;
      if ([".codemap", ".git", "node_modules", "bin", "obj", ".lattice", ".opencode", "result.json"].includes(entry.name)) continue;
      const absolute = path.join(current, entry.name);
      const relative = path.relative(directory, absolute);
      if (entry.isDirectory()) {
        await walk(absolute);
      } else {
        files.push(relative);
      }
    }
  }

  await walk(directory);
  return files.sort();
}

export async function waitForStableWorkspace(workspace: string, quietMs: number, timeoutMs: number, log: Logger): Promise<void> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const latestMtimeMs = await latestWorkspaceMtimeMs(workspace);
    if (Date.now() - latestMtimeMs >= quietMs) return;
    await sleep(1_000);
  }
  log(`Workspace did not stay quiet for ${Math.round(quietMs / 1000)}s before timeout; continuing with latest files`);
}

export async function exists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyBaseline(baselinePath: string, workspace: string) {
  const entries = await readdir(baselinePath, { withFileTypes: true });
  for (const entry of entries) {
    if (baselineExcludeNames.has(entry.name)) continue;
    const source = path.join(baselinePath, entry.name);
    const destination = path.join(workspace, entry.name);
    await cp(source, destination, {
      recursive: true,
      filter: (candidate) => !isExcludedBaselinePath(baselinePath, candidate)
    });
  }
}

async function initializeCodemapWorkspace(workspace: string, variantId: string, log: Logger, codemapBinary: string): Promise<void> {
  log(`${variantId}: initializing temporary git repo for codemap`);
  const gitInit = await runCommand("git", ["init", "-b", "main"], workspace, 60_000);
  if (gitInit.exitCode !== 0) {
    throw new Error(`git init for codemap failed:\n${gitInit.stderr || gitInit.stdout}`);
  }

  log(`${variantId}: pre-indexing workspace with codemap`);
  const codemapSync = await runCommand(codemapBinary, ["sync"], workspace, 2 * 60 * 1000);
  log(`${variantId}: codemap sync exited ${codemapSync.exitCode}`);
  if (codemapSync.exitCode !== 0) {
    throw new Error(`codemap sync failed:\n${codemapSync.stderr || codemapSync.stdout}`);
  }
}

async function writeCodemapWrapper(workspace: string, codemapBinary: string): Promise<void> {
  const wrapperPath = path.join(workspace, ".opencode", "bin", "codemap");
  const script = [
    "#!/usr/bin/env sh",
    "set +e",
    "log_dir=\"$(pwd)/.codemap\"",
    "mkdir -p \"$log_dir\"",
    "start=$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    `${shellQuote(codemapBinary)} "$@"`,
    "status=$?",
    "end=$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "printf '%s\\t%s\\t%s\\t%s\\n' \"$start\" \"$end\" \"$status\" \"$*\" >> \"$log_dir/usage.log\"",
    "exit $status",
    ""
  ].join("\n");
  await writeFile(wrapperPath, script);
  await chmod(wrapperPath, 0o755);
}

async function preserveCodemapUsageLog(workspace: string): Promise<void> {
  const source = path.join(workspace, ".codemap", "usage.log");
  if (!(await exists(source))) return;
  const target = path.join(workspace, ".lattice", "codemap-usage.log");
  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target, { force: true });
}

async function resolveCodemapBinary(): Promise<string> {
  const configured = process.env.EVAL_CODEMAP_BIN;
  if (configured) {
    return path.resolve(configured);
  }

  for (const entry of (process.env.PATH ?? "").split(path.delimiter)) {
    if (!entry) continue;
    const candidate = path.join(entry, "codemap");
    if (await exists(candidate)) return candidate;
  }

  throw new Error("EVAL_CODEMAP=1 requires codemap on PATH or EVAL_CODEMAP_BIN to point to the codemap binary.");
}

function shellQuote(value: string): string {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

function isExcludedBaselinePath(baselinePath: string, candidate: string): boolean {
  const relative = path.relative(baselinePath, candidate);
  if (!relative || relative.startsWith("..")) return false;
  return relative.split(path.sep).some((part) => baselineExcludeNames.has(part));
}

async function syncSkillsForLattice(workspace: string) {
  const source = path.join(workspace, ".agents", "skills");
  const target = path.join(workspace, ".opencode", "skills");
  if (!(await exists(source))) {
    throw new Error(`Skills CLI did not create ${source}`);
  }

  await rm(target, { recursive: true, force: true });
  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target, { recursive: true });
}

async function latestWorkspaceMtimeMs(dir: string): Promise<number> {
  let latest = 0;
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return latest;
  }

  for (const entry of entries) {
    if (settleIgnoredDirs.has(entry)) continue;
    const filePath = path.join(dir, entry);
    let stats;
    try {
      stats = await stat(filePath);
    } catch {
      continue;
    }

    latest = Math.max(latest, stats.mtimeMs);
    if (stats.isDirectory()) {
      latest = Math.max(latest, await latestWorkspaceMtimeMs(filePath));
    }
  }

  return latest;
}

function workspaceGitignore(): string {
  return [
    "node_modules/",
    ".codemap/",
    "bin/",
    "obj/",
    "frontend/node_modules/",
    ".opencode/node_modules/",
    ".opencode/package.json",
    ".opencode/package-lock.json",
    ".opencode/skills/",
    ".agents/skills/",
    ""
  ].join("\n");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
