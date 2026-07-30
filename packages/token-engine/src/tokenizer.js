/**
 * Per-Provider Tokenizer Estimator
 */
export const PROVIDER_RATES = {
    anthropic: { inputPer1k: 0.003, outputPer1k: 0.015 },
    openai: { inputPer1k: 0.005, outputPer1k: 0.015 },
    ollama: { inputPer1k: 0.0005, outputPer1k: 0.0008 }
};
export function estimateProviderTokens(text, provider = 'anthropic') {
    if (!text)
        return 0;
    const charLen = text.length;
    const wordLen = text.trim().split(/\s+/).length;
    // Provider-tuned character-to-token ratio adjustments
    if (provider === 'openai') {
        return Math.max(1, Math.ceil((charLen / 3.8 + wordLen) / 2));
    }
    else if (provider === 'anthropic') {
        return Math.max(1, Math.ceil((charLen / 4.1 + wordLen) / 2));
    }
    else {
        return Math.max(1, Math.ceil((charLen / 4.5 + wordLen) / 2));
    }
}
