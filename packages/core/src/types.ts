/**
 * Core interface contracts for TokenSaveOS pluggable architecture
 */

export interface TokenSaveConfig {
  aiModels: {
    simple: string;
    medium: string;
    complex: string;
  };
  context: {
    maxTokens: number;
    ignorePatterns: string[];
  };
  memory: {
    autoUpdate: boolean;
    schemaVersion: number;
  };
  cache: {
    enabled: boolean;
    provider: string;
  };
  eval: {
    gateOnRegression: boolean;
    minSuccessRate: number;
  };
}

export interface RankedFile {
  path: string;
  score: number;
  tokens: number;
  reason: string;
}

export interface CompressionResult {
  compressedText: string;
  originalTokens: number;
  compressedTokens: number;
  tokensSaved: number;
  compressionRatio: number;
  estimatedSavingsUSD: number;
}

export interface ModelRouteDecision {
  selectedModel: string;
  tokenCount: number;
  estimatedCostUSD: number;
  savingsVsDefaultUSD: number;
  rationale: string;
  escalated: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalTokensSaved: number;
  usdSaved: number;
}
