/**
 * Cross-Session Memory Deduplication
 * Removes duplicate context across agent sessions
 */
export interface MemoryEntry {
    id: string;
    sessionId: string;
    content: string;
    embedding: number[];
    timestamp: number;
    accessCount: number;
}
export interface DedupResult {
    originalCount: number;
    deduplicatedCount: number;
    duplicatesRemoved: number;
    tokensSaved: number;
    entries: MemoryEntry[];
}
export declare class MemoryDeduplicator {
    private similarityThreshold;
    private maxEntries;
    constructor(similarityThreshold?: number, maxEntries?: number);
    deduplicate(entries: MemoryEntry[]): DedupResult;
    mergeSessions(sessionA: MemoryEntry[], sessionB: MemoryEntry[]): MemoryEntry[];
    private cosineSimilarity;
    private estimateTokens;
}
//# sourceMappingURL=index.d.ts.map