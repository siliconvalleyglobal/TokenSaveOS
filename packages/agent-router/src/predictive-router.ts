/**
 * Predictive Auto-Tiering Model Router
 * Evaluates request complexity, code presence, reasoning depth, and latency SLAs to route dynamically.
 */

export interface ModelTierConfig {
  flashTier: string;      // e.g. claude-3-5-haiku / gpt-4o-mini / gemini-2.0-flash
  balancedTier: string;   // e.g. claude-3-7-sonnet / gpt-4o
  flagshipTier: string;   // e.g. claude-3-opus / o3-mini / deepseek-r1
}

export interface RoutePredictionRequest {
  prompt: string;
  maxLatencyMs?: number;
  maxCostUSD?: number;
  requiresReasoningChain?: boolean;
}

export interface PredictiveRouteResult {
  tier: 'flash' | 'balanced' | 'flagship';
  model: string;
  confidenceScore: number;
  estimatedCostUSD: number;
  estimatedLatencyMs: number;
  reasoningFlags: string[];
}

export class PredictiveModelRouter {
  private tiers: ModelTierConfig;

  constructor(tiers?: Partial<ModelTierConfig>) {
    this.tiers = {
      flashTier: tiers?.flashTier ?? 'claude-3-5-haiku-latest',
      balancedTier: tiers?.balancedTier ?? 'claude-3-7-sonnet-latest',
      flagshipTier: tiers?.flagshipTier ?? 'claude-3-opus-latest',
    };
  }

  public predictRoute(req: RoutePredictionRequest): PredictiveRouteResult {
    const text = req.prompt.toLowerCase();
    const flags: string[] = [];

    let complexityScore = 0;

    // Check code syntax and architectural reasoning
    if (/(?:function|class|interface|def |import |async |await |SELECT |INSERT )/.test(req.prompt)) {
      flags.push('CODE_SYNTAX_DETECTED');
      complexityScore += 30;
    }

    if (req.requiresReasoningChain || /(?:refactor|architect|benchmark|security vulnerability|concurrency|race condition)/.test(text)) {
      flags.push('DEEP_REASONING_REQUIRED');
      complexityScore += 45;
    }

    if (req.prompt.length > 4000) {
      flags.push('LONG_CONTEXT_INPUT');
      complexityScore += 25;
    }

    if (/(?:hello|hi|translate|summarize|spell check|format json|clean up)/.test(text) && req.prompt.length < 500) {
      flags.push('SIMPLE_CONVERSATIONAL');
      complexityScore -= 30;
    }

    // Determine Tier
    let tier: 'flash' | 'balanced' | 'flagship' = 'balanced';
    let model = this.tiers.balancedTier;
    let estimatedCostUSD = 0.003;
    let estimatedLatencyMs = 600;

    if (complexityScore < 20 && (!req.maxLatencyMs || req.maxLatencyMs >= 200)) {
      tier = 'flash';
      model = this.tiers.flashTier;
      estimatedCostUSD = 0.0004;
      estimatedLatencyMs = 250;
    } else if (complexityScore >= 70) {
      tier = 'flagship';
      model = this.tiers.flagshipTier;
      estimatedCostUSD = 0.015;
      estimatedLatencyMs = 1500;
    }

    // Enforce cost budget cap downgrade if requested
    if (req.maxCostUSD && estimatedCostUSD > req.maxCostUSD) {
      tier = 'flash';
      model = this.tiers.flashTier;
      flags.push('BUDGET_CAP_ENFORCED_DOWNGRADE');
    }

    return {
      tier,
      model,
      confidenceScore: Math.min(Math.max(0.75 + (complexityScore / 200), 0.5), 0.99),
      estimatedCostUSD,
      estimatedLatencyMs,
      reasoningFlags: flags,
    };
  }
}
