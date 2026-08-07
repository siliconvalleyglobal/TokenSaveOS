/**
 * Token Forecasting Engine
 * Predicts total cost and token usage BEFORE execution
 */
export class TokenForecaster {
    modelPricing;
    constructor() {
        this.modelPricing = {
            'claude-3.5-sonnet': { input: 0.003, output: 0.015 },
            'claude-3-opus': { input: 0.015, output: 0.075 },
            'claude-3-haiku': { input: 0.00025, output: 0.00125 },
            'gpt-4o': { input: 0.0025, output: 0.01 },
            'gpt-4-turbo': { input: 0.01, output: 0.03 },
            'gpt-4': { input: 0.03, output: 0.06 },
            'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
            'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
        };
    }
    forecast(request) {
        const promptTokens = this.countTokens(request.prompt, request.provider);
        const systemPromptTokens = request.includeContext ? (request.contextSizeTokens ?? 2000) : 500;
        const toolDefTokens = 800;
        const contextTokens = request.includeContext ? (request.contextSizeTokens ?? 0) : 0;
        const inputTokens = systemPromptTokens + contextTokens + promptTokens + toolDefTokens;
        const outputTokens = this.estimateOutput(request.expectedSteps);
        const totalTokens = inputTokens + outputTokens;
        const pricing = this.modelPricing[request.model] || { input: 0.002, output: 0.008 };
        const inputCost = (inputTokens / 1000) * pricing.input;
        const outputCost = (outputTokens / 1000) * pricing.output;
        const totalCost = inputCost + outputCost;
        const confidence = this.calculateConfidence(request);
        const recommendations = this.generateRecommendations(request, totalCost, totalTokens);
        return {
            estimatedInputTokens: inputTokens,
            estimatedOutputTokens: outputTokens,
            estimatedTotalTokens: totalTokens,
            estimatedCostUSD: Math.round(totalCost * 100) / 100,
            confidence,
            breakdown: {
                systemPrompt: systemPromptTokens,
                context: contextTokens,
                userPrompt: promptTokens,
                toolDefinitions: toolDefTokens,
                output: outputTokens,
            },
            recommendations,
        };
    }
    compareModels(prompt, expectedSteps, models) {
        return models.map((model) => {
            const result = this.forecast({
                prompt,
                expectedSteps,
                model,
                provider: 'anthropic',
                includeContext: true,
            });
            return {
                model,
                estimatedCostUSD: result.estimatedCostUSD,
                estimatedTokens: result.estimatedTotalTokens,
            };
        }).sort((a, b) => a.estimatedCostUSD - b.estimatedCostUSD);
    }
    estimateOutput(steps) {
        const baseOutput = 500;
        const perStep = 300;
        return baseOutput + (steps * perStep);
    }
    countTokens(text, provider) {
        const rates = {
            anthropic: 0.25,
            openai: 0.25,
            gemini: 0.25,
        };
        return Math.ceil(text.length * (rates[provider] || 0.25));
    }
    calculateConfidence(request) {
        let confidence = 0.7;
        if (request.contextSizeTokens && request.contextSizeTokens > 0)
            confidence += 0.1;
        if (request.expectedSteps <= 5)
            confidence += 0.1;
        if (request.expectedSteps <= 10)
            confidence += 0.05;
        return Math.min(confidence, 0.95);
    }
    generateRecommendations(request, cost, tokens) {
        const recommendations = [];
        if (cost > 1.0) {
            recommendations.push('Consider using Haiku for simple tasks to reduce cost by 80%');
        }
        if (tokens > 100000) {
            recommendations.push('Enable context compression to reduce input tokens by 60-80%');
        }
        if (request.expectedSteps > 10) {
            recommendations.push('Enable prompt caching to save 90% on repeated context');
        }
        if (recommendations.length === 0) {
            recommendations.push('Cost is within acceptable range');
        }
        return recommendations;
    }
}
//# sourceMappingURL=index.js.map