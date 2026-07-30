import { describe, it, expect } from 'vitest';
import { estimateProviderTokens, compressPrompt } from '../src/index.js';
describe('Token Engine Tokenizer & Compressor', () => {
    it('should estimate provider tokens per model family', () => {
        const text = "Please refactor the architecture and optimize token usage.";
        const anthropicTokens = estimateProviderTokens(text, 'anthropic');
        const openaiTokens = estimateProviderTokens(text, 'openai');
        expect(anthropicTokens).toBeGreaterThan(0);
        expect(openaiTokens).toBeGreaterThan(0);
    });
    it('should compress prompt text and strip filler words', () => {
        const raw = "Please kindly note that we should refactor the code and remove unnecessary whitespace comments. # comment line";
        const result = compressPrompt(raw, { aggressivePrune: true, removeComments: true });
        expect(result.tokensSaved).toBeGreaterThan(0);
        expect(result.compressedText).not.toContain('# comment line');
    });
});
