// pattern: Functional Core

export type TokenTelemetry = {
  tokensIn: number;
  tokensOut: number;
  tokensReasoning: number;
  tokensCacheRead: number;
  tokensCacheWrite: number;
  costUSD: number;
  estimatedCostUSD?: number;
  messageCount: number;
};

export type AssistantTelemetry = TokenTelemetry & { model?: string; provider?: string };

export type TelemetrySummary = TokenTelemetry & {
  stages: Array<
    TokenTelemetry & {
      id: string;
      agent?: string;
      model?: string;
      provider?: string;
      configuredModel?: string;
      configuredProvider?: string;
      observedModel?: string;
      observedProvider?: string;
    }
  >;
  judge?: AssistantTelemetry;
};

const publicModelPrices = [
  { match: "gpt-5.5", input: 0.000005, output: 0.00003, cacheRead: 0.0000005 },
  { match: "deepseek-v4-pro", input: 0.000000435, output: 0.00000087, cacheRead: 0.000000003625 },
  { match: "deepseek-v4-flash", input: 0.00000014, output: 0.00000028, cacheRead: 0.0000000028 },
  { match: "mimo-v2.5-pro", input: 0.000001, output: 0.000003, cacheRead: 0.0000002 },
  { match: "mimo-v2.5", input: 0.0000004, output: 0.000002, cacheRead: 0.00000008 }
] as const;

export function summarizeTelemetry(state: unknown, judge?: TelemetrySummary["judge"]): TelemetrySummary {
  const stages = extractStageTelemetry(state);
  const total = emptyTelemetry();
  for (const stage of stages) addTelemetry(total, stage);
  addTelemetry(total, judge);
  return { ...total, stages, ...(judge ? { judge } : {}) };
}

export function telemetryFromAssistantInfo(info: any): AssistantTelemetry {
  const telemetry = {
    model: typeof info?.modelID === "string" ? info.modelID : undefined,
    provider: typeof info?.providerID === "string" ? info.providerID : undefined,
    tokensIn: info?.tokens?.input ?? 0,
    tokensOut: info?.tokens?.output ?? 0,
    tokensReasoning: info?.tokens?.reasoning ?? 0,
    tokensCacheRead: info?.tokens?.cache?.read ?? 0,
    tokensCacheWrite: info?.tokens?.cache?.write ?? 0,
    costUSD: info?.cost ?? 0,
    messageCount: 1
  };
  const estimatedCostUSD = estimatePublicCost(telemetry, telemetry.model);
  return { ...telemetry, ...(estimatedCostUSD !== undefined ? { estimatedCostUSD } : {}) };
}

function emptyTelemetry(): TokenTelemetry {
  return {
    tokensIn: 0,
    tokensOut: 0,
    tokensReasoning: 0,
    tokensCacheRead: 0,
    tokensCacheWrite: 0,
    costUSD: 0,
    messageCount: 0
  };
}

function addTelemetry(total: TokenTelemetry, telemetry: Partial<TokenTelemetry> | undefined): void {
  if (!telemetry) return;
  total.tokensIn += telemetry.tokensIn ?? 0;
  total.tokensOut += telemetry.tokensOut ?? 0;
  total.tokensReasoning += telemetry.tokensReasoning ?? 0;
  total.tokensCacheRead += telemetry.tokensCacheRead ?? 0;
  total.tokensCacheWrite += telemetry.tokensCacheWrite ?? 0;
  total.costUSD += telemetry.costUSD ?? 0;
  total.estimatedCostUSD = (total.estimatedCostUSD ?? 0) + (telemetry.estimatedCostUSD ?? 0);
  total.messageCount += telemetry.messageCount ?? 0;
}

function estimatePublicCost(telemetry: Partial<TokenTelemetry>, model: string | undefined): number | undefined {
  if (!model) return undefined;
  const normalized = model.toLowerCase();
  const price = publicModelPrices.find((entry) => normalized.includes(entry.match));
  if (!price) return undefined;
  const outputTokens = (telemetry.tokensOut ?? 0) + (telemetry.tokensReasoning ?? 0);
  return (
    (telemetry.tokensIn ?? 0) * price.input +
    outputTokens * price.output +
    (telemetry.tokensCacheRead ?? 0) * price.cacheRead
  );
}

function extractStageTelemetry(state: unknown): TelemetrySummary["stages"] {
  if (!state || typeof state !== "object") return [];
  const stages = (state as { stages?: unknown }).stages;
  if (!Array.isArray(stages)) return [];

  return stages.flatMap((stage) => {
    if (!stage || typeof stage !== "object") return [];
    const stageRecord = stage as { id?: unknown; agent?: unknown; telemetry?: unknown };
    const telemetry = stageRecord.telemetry;
    if (!telemetry || typeof telemetry !== "object") return [];
    const telemetryRecord = telemetry as Partial<TokenTelemetry> & {
      model?: unknown;
      provider?: unknown;
      configuredModel?: unknown;
      configuredProvider?: unknown;
      observedModel?: unknown;
      observedProvider?: unknown;
    };
    const model = typeof telemetryRecord.model === "string" ? telemetryRecord.model : undefined;
    const observedModel = typeof telemetryRecord.observedModel === "string" ? telemetryRecord.observedModel : undefined;
    const estimatedCostUSD = estimatePublicCost(telemetryRecord, observedModel ?? model);
    return [
      {
        id: typeof stageRecord.id === "string" ? stageRecord.id : "unknown",
        agent: typeof stageRecord.agent === "string" ? stageRecord.agent : undefined,
        model,
        provider: typeof telemetryRecord.provider === "string" ? telemetryRecord.provider : undefined,
        configuredModel: typeof telemetryRecord.configuredModel === "string" ? telemetryRecord.configuredModel : undefined,
        configuredProvider:
          typeof telemetryRecord.configuredProvider === "string" ? telemetryRecord.configuredProvider : undefined,
        observedModel,
        observedProvider: typeof telemetryRecord.observedProvider === "string" ? telemetryRecord.observedProvider : undefined,
        tokensIn: telemetryRecord.tokensIn ?? 0,
        tokensOut: telemetryRecord.tokensOut ?? 0,
        tokensReasoning: telemetryRecord.tokensReasoning ?? 0,
        tokensCacheRead: telemetryRecord.tokensCacheRead ?? 0,
        tokensCacheWrite: telemetryRecord.tokensCacheWrite ?? 0,
        costUSD: telemetryRecord.costUSD ?? 0,
        ...(estimatedCostUSD !== undefined ? { estimatedCostUSD } : {}),
        messageCount: telemetryRecord.messageCount ?? 0
      }
    ];
  });
}
