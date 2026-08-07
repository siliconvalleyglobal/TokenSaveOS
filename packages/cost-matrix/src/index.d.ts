/**
 * Multi-Provider Cost Matrix & Pricing Comparison Engine for TokenSaveOS.
 * Calculates exact costs across Anthropic, OpenAI, Gemini, and Groq LLM models.
 */
export interface ModelPricing {
    modelId: string;
    provider: 'Anthropic' | 'OpenAI' | 'Google' | 'Groq';
    name: string;
    inputCostPer1M: number;
    outputCostPer1M: number;
    cachedInputCostPer1M?: number;
}
export interface CostEstimate {
    modelId: string;
    provider: string;
    name: string;
    inputCostUSD: number;
    outputCostUSD: number;
    totalCostUSD: number;
    isCheapest: boolean;
}
export declare class ProviderCostMatrix {
    static MODELS: ModelPricing[];
    /**
     * Compares estimated costs across all registered LLM models for a given token volume.
     */
    calculateComparison(inputTokens: number, outputTokens: number, useCache?: boolean): CostEstimate[];
    /**
     * Recommends the lowest-cost model for a given task.
     */
    recommendOptimalModel(inputTokens: number, outputTokens: number): CostEstimate;
}
//# sourceMappingURL=index.d.ts.map