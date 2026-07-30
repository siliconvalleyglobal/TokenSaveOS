/**
 * Native Prompt Cache & Breakpoint Manager
 */
import { CacheStats } from '@tokensaveos/core';
export declare class CacheManager {
    private cache;
    private hits;
    private misses;
    private totalTokensSaved;
    private generateKey;
    annotateCacheBreakpoints(systemPrompt: string, provider?: string): any;
    checkCache(prompt: string): {
        hit: boolean;
        cachedPrompt?: string;
    };
    setCache(prompt: string): void;
    getStats(): CacheStats;
}
