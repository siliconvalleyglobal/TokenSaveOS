/**
 * Provider-Native Prompt Caching Module
 * Supports Anthropic (cache_control), OpenAI (automatic), and Gemini (context caching)
 */
export class PromptCacheManager {
    stats = new Map();
    cacheStore = new Map();
    constructor() { }
    addBreakpoint(prompt, type, tokens) {
        const hash = this.hashPrompt(prompt);
        const existing = this.cacheStore.get(hash);
        if (existing && existing.expiresAt > Date.now()) {
            this.recordHit(type, tokens);
            return hash;
        }
        this.cacheStore.set(hash, {
            content: prompt,
            provider: type,
            expiresAt: Date.now() + this.getTTL(type),
        });
        this.recordMiss(type, tokens);
        return hash;
    }
    getStats(provider) {
        const results = [];
        for (const [key, stat] of this.stats) {
            if (!provider || key.startsWith(provider)) {
                const hitRate = stat.cacheHits / (stat.cacheHits + stat.cacheMisses) || 0;
                results.push({ ...stat, hitRate });
            }
        }
        return results;
    }
    getOverallSavings() {
        let totalHits = 0;
        let totalMisses = 0;
        let totalTokensSaved = 0;
        let totalCostSaved = 0;
        for (const stat of this.stats.values()) {
            totalHits += stat.cacheHits;
            totalMisses += stat.cacheMisses;
            totalTokensSaved += stat.tokensSaved;
            totalCostSaved += stat.costSavedUSD;
        }
        return {
            tokensSaved: totalTokensSaved,
            costSavedUSD: totalCostSaved,
            hitRate: totalHits / (totalHits + totalMisses) || 0,
        };
    }
    clear() {
        this.cacheStore.clear();
        this.stats.clear();
    }
    hashPrompt(prompt) {
        let hash = 0;
        for (let i = 0; i < prompt.length; i++) {
            const char = prompt.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `cache-${Math.abs(hash)}`;
    }
    getTTL(type) {
        switch (type) {
            case 'anthropic':
                return 5 * 60 * 1000;
            case 'openai':
                return 10 * 60 * 1000;
            case 'gemini':
                return 60 * 60 * 1000;
            default:
                return 5 * 60 * 1000;
        }
    }
    recordHit(provider, tokens) {
        const key = provider;
        const stat = this.stats.get(key) || {
            provider: key,
            cacheHits: 0,
            cacheMisses: 0,
            tokensSaved: 0,
            costSavedUSD: 0,
            hitRate: 0,
        };
        stat.cacheHits++;
        stat.tokensSaved += tokens;
        stat.costSavedUSD += this.calculateSavings(provider, tokens);
        this.stats.set(key, stat);
    }
    recordMiss(provider, _tokens) {
        const key = provider;
        const stat = this.stats.get(key) || {
            provider: key,
            cacheHits: 0,
            cacheMisses: 0,
            tokensSaved: 0,
            costSavedUSD: 0,
            hitRate: 0,
        };
        stat.cacheMisses++;
        this.stats.set(key, stat);
    }
    calculateSavings(provider, tokens) {
        const rates = {
            anthropic: 0.003,
            openai: 0.0015,
            gemini: 0.00125,
        };
        return (tokens / 1000) * (rates[provider] || 0.002);
    }
}
//# sourceMappingURL=index.js.map