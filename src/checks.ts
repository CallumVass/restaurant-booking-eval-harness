// pattern: Imperative Shell

import { spawn } from "node:child_process";
import { readFile, readdir, rm, stat } from "node:fs/promises";
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

type SemanticFinding = {
  probe: string;
  severity: "info" | "warning" | "major";
  message: string;
  evidence: string[];
};

export async function collectSemanticEvidenceChecks(
  workspace: string,
  scenario: string,
  log: (message: string) => void
): Promise<CommandResult[]> {
  const started = Date.now();
  log("Evidence check: semantic probes");
  const files = await listWorkspaceFiles(workspace, 2_000);
  const findings = await runSemanticProbes(workspace, scenario, files);
  const result = {
    command: `semantic-probes scenario-${scenario}`,
    exitCode: findings.length > 0 ? 1 : 0,
    durationMs: Date.now() - started,
    stdout: truncate(JSON.stringify({ findings }, null, 2)),
    stderr: "",
    evidenceOnly: true
  } satisfies CommandResult;
  log(`Evidence check: semantic probes found ${findings.length} finding(s)`);
  return [result];
}

async function runSemanticProbes(workspace: string, scenario: string, files: string[]): Promise<SemanticFinding[]> {
  const findings: SemanticFinding[] = [];
  const textFiles = files.filter(isInspectableTextFile);
  const frontendSourceFiles = textFiles.filter(
    (file) => file.startsWith("frontend/src/") && !file.includes("/generated/") && !file.includes("/__generated__/")
  );
  const generatedFrontendFiles = textFiles.filter(
    (file) => file.startsWith("frontend/src/") && (file.includes("/generated/") || file.includes("/__generated__/"))
  );
  const frontendPackage = await readJsonFile(workspace, "frontend/package.json");
  const orvalConfig = await readFirstExistingText(workspace, ["frontend/orval.config.ts", "frontend/orval.config.js", "orval.config.ts"]);
  const programSource = await readFirstExistingText(workspace, ["backend/RestaurantBooking.Api/Program.cs"]);

  const maskedDeadcodeScript = scriptText(frontendPackage, "deadcode");
  if (maskedDeadcodeScript && /--no-exit-code|\|\|\s*true/.test(maskedDeadcodeScript)) {
    findings.push({
      probe: "masked-deadcode-script",
      severity: "major",
      message: "The frontend dead-code script appears to mask failures, weakening the deterministic dead-code signal.",
      evidence: [`frontend/package.json scripts.deadcode = ${maskedDeadcodeScript}`]
    });
  }

  if (scenario === "2") {
    const storageHits = await grepFiles(workspace, frontendSourceFiles, /\b(localStorage|sessionStorage)\b/);
    if (storageHits.length > 0) {
      findings.push({
        probe: "browser-token-storage-risk",
        severity: "major",
        message: "Scenario 2 forbids auth tokens in localStorage/sessionStorage; inspect these browser storage references for auth/session data.",
        evidence: storageHits.slice(0, 8)
      });
    }

    if (programSource && possibleUnauthenticatedBookingsEndpoint(programSource)) {
      findings.push({
        probe: "public-bookings-endpoint-risk",
        severity: "major",
        message: "A broad GET bookings endpoint appears to remain without nearby authorization; this has previously caused cross-user booking leaks.",
        evidence: [extractSnippet(programSource, /MapGet\(\s*"\/?(?:api\/)?bookings"/)]
      });
    }

    if (programSource && possibleMissingCsrfEnforcement(programSource)) {
      findings.push({
        probe: "csrf-enforcement-risk",
        severity: "major",
        message: "Cookie/Identity auth appears present, but antiforgery enforcement markers are missing or incomplete.",
        evidence: ["Program.cs contains auth/antiforgery setup without clear UseAntiforgery, ValidateAntiforgery, IAntiforgery, X-CSRF, or antiforgery endpoint-filter evidence."]
      });
    }

    if (orvalConfig && !/react-query|@tanstack\/react-query|tanstack/i.test(orvalConfig)) {
      findings.push({
        probe: "generated-query-hooks-risk",
        severity: "major",
        message: "Scenario 2 asks for generated TanStack Query hooks where supported, but Orval config does not appear to generate React Query/TanStack hooks.",
        evidence: ["frontend/orval.config.* lacks react-query/tanstack markers"]
      });
    }
  }

  const handwrittenApiHits = await grepFiles(workspace, frontendSourceFiles, /\bfetch\s*\(\s*[`'"]\/api\/|\baxios\s*\.|\baxios\s*\(/);
  if (handwrittenApiHits.length > 0) {
    findings.push({
      probe: "handwritten-api-client-risk",
      severity: scenario === "2" ? "major" : "warning",
      message: "Frontend source contains direct API fetch/axios usage outside generated folders; verify this is not bypassing the generated OpenAPI client workflow.",
      evidence: handwrittenApiHits.slice(0, 8)
    });
  }

  if (orvalConfig && /baseURL\s*:\s*[`'"]\/api[`'"]/.test(orvalConfig)) {
    const generatedApiPathHits = await grepFiles(workspace, generatedFrontendFiles, /[`'"]\/api\//);
    if (generatedApiPathHits.length > 0) {
      findings.push({
        probe: "api-double-prefix-risk",
        severity: "major",
        message: "Generated API paths appear to include /api while the client baseURL is also /api; this can produce /api/api requests.",
        evidence: ["frontend/orval.config.* has baseURL '/api'", ...generatedApiPathHits.slice(0, 5)]
      });
    }
  }

  return findings;
}

async function listWorkspaceFiles(directory: string, limit: number): Promise<string[]> {
  const files: string[] = [];

  async function walk(current: string): Promise<void> {
    if (files.length >= limit) return;
    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (files.length >= limit) return;
      if (excludedPathParts.has(entry.name)) continue;
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

const excludedPathParts = new Set([".agents", ".git", ".lattice", ".opencode", "bin", "coverage", "dist", "node_modules", "obj"]);

function isInspectableTextFile(file: string): boolean {
  return /\.(cs|csproj|js|jsx|json|md|ts|tsx)$/.test(file);
}

async function readFirstExistingText(workspace: string, relativePaths: string[]): Promise<string | null> {
  for (const relativePath of relativePaths) {
    const text = await readTextFile(workspace, relativePath);
    if (text !== null) return text;
  }
  return null;
}

async function readTextFile(workspace: string, relativePath: string): Promise<string | null> {
  try {
    const absolute = path.join(workspace, relativePath);
    const stats = await stat(absolute);
    if (stats.size > 1_000_000) return null;
    return await readFile(absolute, "utf8");
  } catch {
    return null;
  }
}

async function readJsonFile(workspace: string, relativePath: string): Promise<unknown> {
  const text = await readTextFile(workspace, relativePath);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function scriptText(packageJson: unknown, scriptName: string): string | null {
  if (!packageJson || typeof packageJson !== "object") return null;
  const scripts = (packageJson as { scripts?: unknown }).scripts;
  if (!scripts || typeof scripts !== "object") return null;
  const script = (scripts as Record<string, unknown>)[scriptName];
  return typeof script === "string" ? script : null;
}

async function grepFiles(workspace: string, files: string[], pattern: RegExp): Promise<string[]> {
  const hits: string[] = [];
  for (const file of files) {
    const text = await readTextFile(workspace, file);
    if (!text || !pattern.test(text)) continue;
    const line = text.split("\n").findIndex((value) => pattern.test(value));
    hits.push(`${file}${line >= 0 ? `:${line + 1}` : ""}`);
    if (hits.length >= 20) break;
  }
  return hits;
}

function possibleUnauthenticatedBookingsEndpoint(source: string): boolean {
  const matches = source.matchAll(/MapGet\(\s*"(\/?(?:api\/)?bookings)"/g);
  for (const match of matches) {
    const snippet = source.slice(match.index ?? 0, (match.index ?? 0) + 800);
    if (!/RequireAuthorization/.test(snippet)) return true;
  }
  return false;
}

function possibleMissingCsrfEnforcement(source: string): boolean {
  const hasCookieAuth = /AddAuthentication|AddIdentity|IdentityConstants|CookieAuthentication/.test(source);
  const hasAntiforgerySetup = /AddAntiforgery|Antiforgery/.test(source);
  if (!hasCookieAuth || !hasAntiforgerySetup) return false;
  return !/UseAntiforgery|ValidateAntiforgery|IAntiforgery|X-CSRF|RequireAntiforgery/i.test(source);
}

function extractSnippet(source: string, pattern: RegExp): string {
  const match = pattern.exec(source);
  if (!match || match.index === undefined) return "No snippet available";
  return source.slice(match.index, match.index + 500).replace(/\s+/g, " ").trim();
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
