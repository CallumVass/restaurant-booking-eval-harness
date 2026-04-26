// pattern: Functional Core

export function buildJudgePrompt(details: unknown, workspaceDescription: string): string {
  const scenarioInstructions = getScenarioJudgeInstructions(details);
  const blindDetails = makeBlindJudgeDetails(details);
  return [
    "You are an impartial LLM judge for a coding-agent eval.",
    "Score the generated restaurant booking system against the requested task.",
    "The implementation author and model identity have been intentionally removed. Do not infer or discuss which agent/model produced the work.",
    "Prefer deterministic evidence from command results over subjective source review.",
    "The deterministic checks are mandatory: backend warning-free build, backend tests, backend format verification, frontend install, frontend build, frontend typecheck, frontend lint, frontend format check, and frontend dead-code check.",
    "Some check results may be marked evidenceOnly; use them as supporting evidence for coverage/runtime claims, but do not include them when deciding deterministicChecksPass or the required backend/frontend pass booleans.",
    "Set deterministicChecksPass to true only if every deterministic command exited 0.",
    "Set each backend/frontend pass boolean directly from the matching command result, not from intent or README claims.",
    "For commands outside the provided deterministic checks, inspect the relevant package.json/project file and test configuration before assessing the script. Do not assume a common framework/setup failure from source patterns alone.",
    "Do not claim an optional command such as `npm test`, `vitest`, or a custom script failed unless you actually ran that exact command in the correct project directory or the command output is present in the provided check results. If you did not run it, phrase concerns as coverage gaps from source evidence, not as command failures.",
    "When citing a command failure, include the exact command and the observed failure reason in majorIssues or scenarioFindings. If setup files/configuration could affect the result, inspect them first.",
    "Set boundaryTestsPresent to true only if source evidence shows tests for booking conflicts/overlaps and invalid party size/date/time cases.",
    "Set deadCodeCheckPass to true only if a dedicated dead-code/unused-export command exited 0.",
    "Set typedOpenApiClientUsed to true only if the frontend uses generated types/client code from OpenAPI through Orval or an equivalent generator.",
    "Score planQualityScore based on specificity, risk awareness, vertical slicing, testing strategy, and coverage of requested frontend/client technology.",
    "Score planAdherenceScore based on how closely the implementation follows the saved plan, allowing justified deviations when documented.",
    workspaceDescription,
    "Separate source evidence from test evidence. If source implements a requirement but tests do not assert it, score implementation correctness separately from regression coverage instead of calling the requirement missing.",
    "Do not turn optional best-practice preferences into missing requirements. Penalize them proportionally under maintainability, UI/UX, typed-client quality, or scenario-specific polish unless the task explicitly required them.",
    "Avoid speculative findings such as 'likely' or 'appears' unless you label them as unverified risk. If the file snapshot is incomplete but the file tree shows relevant files, do not claim absence; say the evidence provided was insufficient.",
    "Make majorIssues and missingRequirements evidence-backed. Prefer mentioning the concrete source/test behavior that supports the finding, not only the inferred consequence.",
    "Inspect relevant test and implementation files directly before setting boundaryTestsPresent or declaring evidence unavailable. Do not say source content was not provided unless you attempted to inspect it and it was absent or unreadable.",
    ...scenarioInstructions,
    "Penalize missing runnable code, failed deterministic checks, weak conflict prevention, no boundary tests, over-engineering, hidden implementation gaps, formatting drift, lint failures, dead code, generic UI, untyped fetch wrappers where typed generation was requested, weak plans, and poor plan adherence.",
    "Reward clean architecture when proportionate, pure domain logic, explicit Result-style business errors, strong responsive UI, generated typed API clients, TanStack Query integration, and useful React/API integration.",
    "Return only structured output matching the schema.",
    "",
    JSON.stringify(blindDetails, null, 2)
  ].join("\n");
}

export function judgeInstructionsForScenario(scenario: string, hasBaseline: boolean): string[] {
  const instructions = [
    "Populate scenarioScores with any scenario-specific dimensions you used. Use concise camelCase names and 0-100 numeric scores.",
    "Populate scenarioFindings with concise evidence-backed notes for those scenario-specific scores."
  ];

  if (scenario === "1") {
    instructions.push(
      "For scenario 1, scenarioScores must use exactly these names: tailwindShadcnUsage, tanstackUsage, openApiTypedClientUsage, bookingConflictRules, responsivePolish, deterministicQuality.",
      "Score Tailwind/shadcn usage, TanStack usage, and OpenAPI-generated typed client usage from source evidence, not claims.",
      "For OpenAPI client generation, give credit when Orval or an equivalent generator consumes an OpenAPI document that is present in the solution, matches the current backend endpoints/request/response shapes from source evidence, and generation is reproducible from source. Do not treat absence of live-backend OpenAPI fetching during deterministic build as a missing requirement unless the task explicitly requires that exact workflow; penalize drift only when the OpenAPI document does not represent the current backend API."
    );
  }

  if (hasBaseline) {
    instructions.push(
      "This run started from a seeded baseline. Judge it as brownfield work: reward focused changes that preserve existing behavior and fit the existing architecture.",
      "For brownfield runs, include scenarioScores entries for baselinePreservation, changeMinimality, integrationQuality, and regressionSafety.",
      "Penalize unnecessary rewrites, replacing established project structure, bypassing existing generated clients, duplicated APIs, or failing to update tests/docs around changed behavior."
    );
  }

  if (scenario === "2") {
    instructions.push(
      "For scenario 2, scenarioScores must use exactly these names: authCorrectness, authSecurity, bookingOwnership, httpOpenApiCoverage, frontendFlowCoverage, generatedQueryIntegration, brownfieldIntegration, regressionCoverage.",
      "Score authCorrectness low if unauthenticated users can create bookings, auth endpoints are not usable from the SPA, or booking history is not tied to authenticated users.",
      "Score authSecurity low if cookie auth is used without CSRF protection for state-changing requests, auth tokens are stored in localStorage/sessionStorage, or credentialed CORS is configured carelessly.",
      "Score bookingOwnership low if users can view another user's booking history or bookings are not associated with the authenticated creator.",
      "Score httpOpenApiCoverage low if backend tests only cover domain functions and do not exercise HTTP endpoints, OpenAPI availability, and error mapping.",
      "For OpenAPI auth coverage, give credit for auth endpoints, protected-operation 401 responses, generated client support, and documented CSRF headers when the OpenAPI document matches the current backend source. Do not treat absence of a formal cookie-auth securitySchemes entry as a missing requirement unless the task explicitly requested security scheme metadata; mention it only as a minor documentation/polish gap.",
      "Distinguish live backend OpenAPI output from checked-in frontend OpenAPI specs. A checked-in spec can satisfy generated-client workflow evidence, while live backend OpenAPI tests should be scored based on what the backend actually serves and what tests assert.",
      "Score frontendFlowCoverage low if there are no frontend UI/integration tests for booking forms, auth flows, API errors, confirmations, and booking history.",
      "Score generatedQueryIntegration low if the frontend bypasses the generated OpenAPI client, uses stringly typed fetch wrappers, or keeps avoidable manual TanStack Query wrappers where generated query hooks are available.",
      "Score regressionCoverage low if there are no tests for auth boundaries, user-scoped booking history, and the carried-over Scenario 1 gaps requested in the task."
    );
  }

  return instructions;
}

function makeBlindJudgeDetails(details: unknown): unknown {
  const redactions = collectJudgeRedactions(details);
  return sanitizeJudgeValue(details, redactions);
}

function collectJudgeRedactions(value: unknown, redactions = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) collectJudgeRedactions(item, redactions);
    return redactions;
  }
  if (!value || typeof value !== "object") return redactions;
  const record = value as Record<string, unknown>;
  if (record.variant && typeof record.variant === "object") collectVariantRedactions(record.variant, redactions);
  for (const [key, item] of Object.entries(record)) {
    if (["model", "provider", "modelID", "providerID"].includes(key) && typeof item === "string" && item.length > 0) redactions.add(item);
    collectJudgeRedactions(item, redactions);
  }
  return redactions;
}

function collectVariantRedactions(value: unknown, redactions: Set<string>): void {
  if (!value || typeof value !== "object") return;
  const variant = value as { id?: unknown };
  if (typeof variant.id === "string" && variant.id.length > 0) redactions.add(variant.id);
}

function sanitizeJudgeValue(value: unknown, redactions: Set<string>): unknown {
  if (typeof value === "string") return sanitizeJudgeString(value, redactions);
  if (Array.isArray(value)) return value.map((item) => sanitizeJudgeValue(item, redactions));
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  if ("judgeInstructions" in record && "taskPath" in record) {
    return {
      id: sanitizeJudgeValue(record.id, redactions),
      hasBaseline: Boolean(record.baselinePath),
      judgeInstructions: sanitizeJudgeValue(record.judgeInstructions, redactions)
    };
  }
  const sanitized: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(record)) {
    if (["variant", "pipelineTelemetry", "telemetry", "model", "provider", "modelID", "providerID", "agentOptions", "workspace", "cwd", "root", "taskPath", "baselinePath", "cost", "costUSD"].includes(key)) continue;
    sanitized[key] = sanitizeJudgeValue(item, redactions);
  }
  return sanitized;
}

function sanitizeJudgeString(value: string, redactions: Set<string>): string {
  let sanitized = value
    .replaceAll(/\/tmp\/restaurant-booking-eval-harness-active\/[^\s"')]+/g, "/workspace")
    .replaceAll(/\/home\/[^\s"')]*restaurant-booking-eval-harness\/run-archive\/[^\s"')]+/g, "/workspace");
  for (const redaction of redactions) sanitized = sanitized.split(redaction).join("[redacted]");
  return sanitized;
}

function getScenarioJudgeInstructions(details: unknown): string[] {
  if (!details || typeof details !== "object") return [];
  const scenario = (details as { scenario?: unknown }).scenario;
  if (!scenario || typeof scenario !== "object") return [];
  const instructions = (scenario as { judgeInstructions?: unknown }).judgeInstructions;
  return Array.isArray(instructions) ? instructions.filter((instruction): instruction is string => typeof instruction === "string") : [];
}
