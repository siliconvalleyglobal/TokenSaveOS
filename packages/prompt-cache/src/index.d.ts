/**
 * Provider-Native Prompt Caching Module
 * Supports Anthropic (cache_control), OpenAI (automatic), and Gemini (context caching)
 */
export interface CacheBreakpoint {
    type: 'anthropic' | 'openai' | 'gemini';
    tokens: number;
    ttlSeconds?: number;
}
export interface PromptCacheStats {
    provider: string;
    cacheHits: number;
    cacheMisses: number;
    tokensSaved: number;
    costSavedUSD: number;
    hitRate: number;
}
export declare class PromptCacheManager {
    private stats;
    private cacheStore;
    constructor();
    addBreakpoint(prompt: string, type: CacheBreakpoint['type'], tokens: number): string;
    getStats(provider?: string): PromptCacheStats[];
    getOverallSavings(): {
        tokensSaved: number;
        costSavedUSD: number;
        hitRate: number;
    };
    clear(): void;
    private hashPrompt;
    private getTTL;
    private recordHit;
    private recordMiss;
    private calculateSavings;
}
//# sourceMappingURL=index.d.ts.map