/**
 * Semantic Cache Layer
 * Caches similar queries using embedding-based similarity
 */
export interface SemanticCacheEntry {
    id: string;
    prompt: string;
    response: string;
    embedding: number[];
    createdAt: number;
    hitCount: number;
}
export interface SemanticCacheStats {
    totalQueries: number;
    cacheHits: number;
    cacheMisses: number;
    semanticHits: number;
    tokensSaved: number;
    avgSimilarity: number;
}
export declare class SemanticCache {
    private cache;
    private stats;
    private similarityThreshold;
    private maxEntries;
    constructor(similarityThreshold?: number, maxEntries?: number);
    lookup(prompt: string, embeddingFn: (text: string) => number[]): {
        hit: boolean;
        response?: string;
        similarity?: number;
    };
    store(prompt: string, response: string, embeddingFn: (text: string) => number[]): void;
    getStats(): SemanticCacheStats;
    clear(): void;
    private cosineSimilarity;
    private hashPrompt;
    private estimateTokens;
    private evictOldest;
}
//# sourceMappingURL=index.d.ts.map