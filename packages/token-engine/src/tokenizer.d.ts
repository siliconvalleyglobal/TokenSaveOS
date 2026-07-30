/**
 * Per-Provider Tokenizer Estimator
 */
export type ModelProvider = 'anthropic' | 'openai' | 'ollama';
export declare const PROVIDER_RATES: Record<ModelProvider, {
    inputPer1k: number;
    outputPer1k: number;
}>;
export declare function estimateProviderTokens(text: string, provider?: ModelProvider): number;
