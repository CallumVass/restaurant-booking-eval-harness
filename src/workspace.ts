// pattern: Imperative Shell

import { cp, mkdir, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { runCommand } from "./checks.js";

type Logger = (message: string) => void;

const baselineExcludeNames = new Set([
  ".agents",
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

const settleIgnoredDirs = new Set([".git", ".lattice", ".opencode", "bin", "coverage", "dist", "node_modules", "obj"]);

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

  await mkdir(path.join(input.workspace, ".opencode", "lattice-pipelines"), { recursive: true });
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

export async function ensureLatticePluginAvailable(input: {
  root: string;
  defaultLocalLatticePlugin: string;
  latticePluginSpecifier: string;
  log: Logger;
}): Promise<void> {
  if (input.latticePluginSpecifier !== input.defaultLocalLatticePlugin) return;
  if (await exists(input.latticePluginSpecifier)) return;

  const latticePackage = path.resolve(input.root, "..", "lattice", "package.json");
  if (!(await exists(latticePackage))) {
    throw new Error(`Lattice plugin not found at ${input.latticePluginSpecifier}. Set LATTICE_PLUGIN to a v3 plugin package or built plugin path.`);
  }

  input.log(`Lattice plugin build not found; building ${path.dirname(latticePackage)}`);
  const build = await runCommand("npm", ["run", "build"], path.dirname(latticePackage), 5 * 60 * 1000);
  if (build.exitCode !== 0) {
    throw new Error(`Lattice plugin build failed:\n${build.stderr || build.stdout}`);
  }

  if (!(await exists(input.latticePluginSpecifier))) {
    throw new Error(`Lattice plugin build finished but ${input.latticePluginSpecifier} does not exist.`);
  }
}

export async function archiveRun(workspace: string, scenario: string, archiveDir: string): Promise<string> {
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
      if ([".git", "node_modules", "bin", "obj", ".lattice", ".opencode", "result.json"].includes(entry.name)) continue;
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
