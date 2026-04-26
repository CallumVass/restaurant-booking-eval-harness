// pattern: Imperative Shell

import { spawn } from "node:child_process";
import { readFile, rm, stat } from "node:fs/promises";
import path from "node:path";

export type CommandResult = {
  command: string;
  exitCode: number | null;
  durationMs: number;
  stdout: string;
  stderr: string;
  evidenceOnly?: boolean;
};

export async function runCommand(command: string, args: string[], cwd: string, timeoutMs: number): Promise<CommandResult> {
  const started = Date.now();
  return await new Promise((resolve) => {
    const child = spawn(command, args, { cwd, env: process.env });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill("SIGTERM"), timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("close", (exitCode) => {
      clearTimeout(timer);
      resolve({
        command: [command, ...args].join(" "),
        exitCode,
        durationMs: Date.now() - started,
        stdout: truncate(stdout),
        stderr: truncate(stderr)
      });
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({
        command: [command, ...args].join(" "),
        exitCode: 127,
        durationMs: Date.now() - started,
        stdout: truncate(stdout),
        stderr: truncate(`${stderr}\n${error.message}`)
      });
    });
  });
}

export async function collectOptionalEvidenceChecks(
  workspace: string,
  log: (message: string) => void,
  options: { installFrontendDependencies?: boolean } = {}
): Promise<CommandResult[]> {
  const frontendPackagePath = path.join(workspace, "frontend", "package.json");
  if (!(await exists(frontendPackagePath))) return [];

  const packageJson = JSON.parse(await readFile(frontendPackagePath, "utf8")) as { scripts?: Record<string, unknown> };
  if (typeof packageJson.scripts?.test !== "string") return [];

  const evidence: CommandResult[] = [];
  if (options.installFrontendDependencies) {
    await rm(path.join(workspace, "frontend", "node_modules"), { recursive: true, force: true });
    log("Evidence setup: npm --prefix frontend install");
    const install = await runCommand("npm", ["--prefix", "frontend", "install"], workspace, 10 * 60 * 1000);
    log(`Evidence setup: npm --prefix frontend install exited ${install.exitCode} in ${Math.round(install.durationMs / 1000)}s`);
    evidence.push({ ...install, evidenceOnly: true });
    if (install.exitCode !== 0) return evidence;
  }

  log("Evidence check: npm --prefix frontend test");
  const result = await runCommand("npm", ["--prefix", "frontend", "test"], workspace, 10 * 60 * 1000);
  log(`Evidence check: npm --prefix frontend test exited ${result.exitCode} in ${Math.round(result.durationMs / 1000)}s`);
  if (result.exitCode !== 0) {
    log(`Evidence check stdout:\n${result.stdout.slice(0, 4000)}`);
    log(`Evidence check stderr:\n${result.stderr.slice(0, 4000)}`);
  }
  evidence.push({ ...result, evidenceOnly: true });
  return evidence;
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function truncate(value: string): string {
  return value.length > 20_000 ? `${value.slice(0, 20_000)}\n...[truncated]` : value;
}
