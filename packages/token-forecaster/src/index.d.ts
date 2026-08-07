/**
 * Token Forecasting Engine
 * Predicts total cost and token usage BEFORE execution
 */
export interface ForecastRequest {
    prompt: string;
    expectedSteps: number;
    model: string;
    provider: 'anthropic' | 'openai' | 'gemini';
    includeContext: boolean;
    contextSizeTokens?: number;
}
export interface ForecastResult {
    estimatedInputTokens: number;
    estimatedOutputTokens: number;
    estimatedTotalTokens: number;
    estimatedCostUSD: number;
    confidence: number;
    breakdown: {
        systemPrompt: number;
        context: number;
        userPrompt: number;
        toolDefinitions: number;
        output: number;
    };
    recommendations: string[];
}
export declare class TokenForecaster {
    private modelPricing;
    constructor();
    forecast(request: ForecastRequest): ForecastResult;
    compareModels(prompt: string, expectedSteps: number, models: string[]): Array<{
        model: string;
        estimatedCostUSD: number;
        estimatedTokens: number;
    }>;
    private estimateOutput;
    private countTokens;
    private calculateConfidence;
    private generateRecommendations;
}
