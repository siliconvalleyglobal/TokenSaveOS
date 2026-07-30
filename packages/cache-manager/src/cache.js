/**
 * Native Prompt Cache & Breakpoint Manager
 */
import { estimateProviderTokens } from '@tokensaveos/token-engine';
export class CacheManager {
    cache = new Map();
    hits = 0;
    misses = 0;
    totalTokensSaved = 0;
    generateKey(prompt) {
        return prompt.trim().toLowerCase().replace(/\s+/g, ' ');
    }
    annotateCacheBreakpoints(systemPrompt, provider = 'anthropic') {
        if (provider === 'anthropic') {
            return {
                type: 'text',
                text: systemPrompt,
                cache_control: { type: 'ephemeral' }
            };
        }
        return systemPrompt;
    }
    checkCache(prompt) {
        const key = this.generateKey(prompt);
        if (this.cache.has(key)) {
            this.hits++;
            const entry = this.cache.get(key);
            entry.hits++;
            const tokens = estimateProviderTokens(prompt, 'anthropic');
            this.totalTokensSaved += tokens;
            return { hit: true, cachedPrompt: entry.prompt };
        }
        this.misses++;
        return { hit: false };
    }
    setCache(prompt) {
        const key = this.generateKey(prompt);
        const tokens = estimateProviderTokens(prompt, 'anthropic');
        this.cache.set(key, { prompt, tokens, hits: 1 });
    }
    getStats() {
        const total = this.hits + this.misses;
        const hitRate = total > 0 ? parseFloat(((this.hits / total) * 100).toFixed(1)) : 0;
        const usdSaved = parseFloat(((this.totalTokensSaved / 1000) * 0.003).toFixed(4));
        return {
            hits: this.hits,
            misses: this.misses,
            hitRate,
            totalTokensSaved: this.totalTokensSaved,
            usdSaved
        };
    }
}
