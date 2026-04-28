import { spawn } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const json = process.argv.includes("--json");
const timeoutMs = 10 * 60 * 1000;

const results = [];

const backendTarget = await findBackendTarget(root);
if (backendTarget) {
  const targetArg = path.relative(root, backendTarget.path) || ".";
  results.push(await run("dotnet", ["build", targetArg, "-p:TreatWarningsAsErrors=true"], root));
  for (const testTarget of backendTarget.testTargets) {
    results.push(await run("dotnet", ["test", path.relative(root, testTarget) || ".", "--no-build"], root));
  }
  results.push(await run("dotnet", ["format", targetArg, "--verify-no-changes"], root));
} else {
  for (const command of [
    "dotnet build <solution-or-project> -p:TreatWarningsAsErrors=true",
    "dotnet test <solution-or-project> --no-build",
    "dotnet format <solution-or-project> --verify-no-changes"
  ]) {
    results.push(missing(command, "No .sln, .slnx, or .csproj file was found."));
  }
}

const frontend = await findFrontend(root);
if (frontend) {
  const relative = path.relative(root, frontend) || ".";
  results.push(await run("npm", ["--prefix", relative, "install"], root));
  for (const script of ["build", "typecheck", "lint", "format:check", "deadcode"]) {
    results.push(await run("npm", ["--prefix", relative, "run", script], root));
  }
} else {
  for (const command of [
    "npm --prefix <frontend> install",
    "npm --prefix <frontend> run build",
    "npm --prefix <frontend> run typecheck",
    "npm --prefix <frontend> run lint",
    "npm --prefix <frontend> run format:check",
    "npm --prefix <frontend> run deadcode"
  ]) {
    results.push(missing(command, "No frontend package.json with the required scripts was found."));
  }
}

if (json) {
  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
} else {
  for (const result of results) {
    process.stdout.write(`\n$ ${result.command}\nexit ${result.exitCode} in ${Math.round(result.durationMs / 1000)}s\n`);
    if (result.stdout) process.stdout.write(`${result.stdout}\n`);
    if (result.stderr) process.stderr.write(`${result.stderr}\n`);
  }
}

process.exitCode = results.every((result) => result.exitCode === 0) ? 0 : 1;

async function findBackendTarget(directory) {
  const files = await walk(directory, (file) => /\.(sln|slnx|csproj)$/.test(file));
  const solutions = files.filter((file) => /\.(sln|slnx)$/.test(file));
  if (solutions.length > 0) {
    const solution = sortPreferred(solutions)[0];
    return { kind: "solution", path: solution, testTargets: [solution] };
  }

  const projects = sortPreferred(files.filter((file) => file.endsWith(".csproj")));
  const testProjects = projects.filter((file) => /test/i.test(path.basename(file)) || /tests?/i.test(path.dirname(file)));
  const appProjects = projects.filter((file) => !testProjects.includes(file));
  const target = appProjects[0] ?? projects[0];
  return target ? { kind: "project", path: target, testTargets: testProjects.length > 0 ? testProjects : [target] } : null;
}

async function findFrontend(directory) {
  const packages = sortPreferred(await walk(directory, (file) => path.basename(file) === "package.json"));
  for (const file of packages) {
    if (path.relative(directory, file) === "package.json") continue;
    try {
      const pkg = JSON.parse(await readFile(file, "utf8"));
      const scripts = pkg.scripts ?? {};
      if (["build", "typecheck", "lint", "format:check", "deadcode"].every((script) => typeof scripts[script] === "string")) {
        return path.dirname(file);
      }
    } catch {
      // Ignore malformed package files; the deterministic failure will surface elsewhere.
    }
  }
  return null;
}

async function walk(directory, predicate, results = []) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if ([".git", ".lattice", "node_modules", "bin", "obj", "dist", "coverage", "run-archive", "results"].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(absolute, predicate, results);
    } else if (predicate(absolute)) {
      results.push(absolute);
    }
  }
  return results;
}

function sortPreferred(files) {
  return [...files].sort((a, b) => preference(a) - preference(b) || a.localeCompare(b));
}

function preference(file) {
  const relative = path.relative(root, file).toLowerCase();
  if (relative.startsWith("src/")) return 0;
  if (relative.startsWith("backend/") || relative.startsWith("api/")) return 1;
  if (relative.startsWith("frontend/") || relative.startsWith("client/")) return 1;
  return relative.split(path.sep).length;
}

async function run(command, args, cwd) {
  const started = Date.now();
  const display = [command, ...args].join(" ");
  if (!json) process.stdout.write(`\nRunning ${display}\n`);

  return await new Promise((resolve) => {
    const child = spawn(command, args, { cwd, env: process.env });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill("SIGTERM"), timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
      if (!json) process.stdout.write(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      if (!json) process.stderr.write(chunk);
    });
    child.on("close", (exitCode) => {
      clearTimeout(timer);
      resolve({ command: display, exitCode, durationMs: Date.now() - started, stdout: truncate(stdout), stderr: truncate(stderr) });
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ command: display, exitCode: 127, durationMs: Date.now() - started, stdout: truncate(stdout), stderr: truncate(`${stderr}\n${error.message}`) });
    });
  });
}

function missing(command, stderr) {
  return { command, exitCode: 127, durationMs: 0, stdout: "", stderr };
}

function truncate(value) {
  return value.length > 20_000 ? `${value.slice(0, 20_000)}\n...[truncated]` : value;
}
