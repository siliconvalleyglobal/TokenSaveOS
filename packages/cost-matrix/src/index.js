"use strict";
/**
 * Multi-Provider Cost Matrix & Pricing Comparison Engine for TokenSaveOS.
 * Calculates exact costs across Anthropic, OpenAI, Gemini, and Groq LLM models.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderCostMatrix = void 0;
class ProviderCostMatrix {
    static MODELS = [
        { modelId: 'claude-3-5-haiku', provider: 'Anthropic', name: 'Claude 3.5 Haiku', inputCostPer1M: 0.80, outputCostPer1M: 4.00, cachedInputCostPer1M: 0.08 },
        { modelId: 'claude-3-7-sonnet', provider: 'Anthropic', name: 'Claude 3.7 Sonnet', inputCostPer1M: 3.00, outputCostPer1M: 15.00, cachedInputCostPer1M: 0.30 },
        { modelId: 'claude-3-opus', provider: 'Anthropic', name: 'Claude 3 Opus', inputCostPer1M: 15.00, outputCostPer1M: 75.00, cachedInputCostPer1M: 1.50 },
        { modelId: 'gpt-4o-mini', provider: 'OpenAI', name: 'GPT-4o mini', inputCostPer1M: 0.15, outputCostPer1M: 0.60, cachedInputCostPer1M: 0.075 },
        { modelId: 'gpt-4o', provider: 'OpenAI', name: 'GPT-4o', inputCostPer1M: 2.50, outputCostPer1M: 10.00, cachedInputCostPer1M: 1.25 },
        { modelId: 'gemini-1.5-flash', provider: 'Google', name: 'Gemini 1.5 Flash', inputCostPer1M: 0.075, outputCostPer1M: 0.30, cachedInputCostPer1M: 0.018 },
        { modelId: 'gemini-1.5-pro', provider: 'Google', name: 'Gemini 1.5 Pro', inputCostPer1M: 1.25, outputCostPer1M: 5.00, cachedInputCostPer1M: 0.312 },
        { modelId: 'llama-3.3-70b-groq', provider: 'Groq', name: 'Llama 3.3 70B (Groq)', inputCostPer1M: 0.59, outputCostPer1M: 0.79 },
    ];
    /**
     * Compares estimated costs across all registered LLM models for a given token volume.
     */
    calculateComparison(inputTokens, outputTokens, useCache = false) {
        const estimates = ProviderCostMatrix.MODELS.map(m => {
            const inputRate = (useCache && m.cachedInputCostPer1M) ? m.cachedInputCostPer1M : m.inputCostPer1M;
            const inputCost = (inputTokens / 1_000_000) * inputRate;
            const outputCost = (outputTokens / 1_000_000) * m.outputCostPer1M;
            const totalCost = Number((inputCost + outputCost).toFixed(6));
            return {
                modelId: m.modelId,
                provider: m.provider,
                name: m.name,
                inputCostUSD: Number(inputCost.toFixed(6)),
                outputCostUSD: Number(outputCost.toFixed(6)),
                totalCostUSD: totalCost,
                isCheapest: false
            };
        });
        estimates.sort((a, b) => a.totalCostUSD - b.totalCostUSD);
        if (estimates.length > 0) {
            estimates[0].isCheapest = true;
        }
        return estimates;
    }
    /**
     * Recommends the lowest-cost model for a given task.
     */
    recommendOptimalModel(inputTokens, outputTokens) {
        const comparison = this.calculateComparison(inputTokens, outputTokens);
        return comparison[0];
    }
}
exports.ProviderCostMatrix = ProviderCostMatrix;
//# sourceMappingURL=index.js.map