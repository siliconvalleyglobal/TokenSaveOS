/**
 * Cross-Session Memory Deduplication
 * Removes duplicate context across agent sessions
 */
export class MemoryDeduplicator {
    similarityThreshold;
    maxEntries;
    constructor(similarityThreshold = 0.95, maxEntries = 5000) {
        this.similarityThreshold = similarityThreshold;
        this.maxEntries = maxEntries;
    }
    deduplicate(entries) {
        const originalCount = entries.length;
        const kept = [];
        const removed = [];
        for (const entry of entries) {
            let isDuplicate = false;
            for (const existing of kept) {
                const similarity = this.cosineSimilarity(entry.embedding, existing.embedding);
                if (similarity >= this.similarityThreshold) {
                    isDuplicate = true;
                    if (entry.timestamp > existing.timestamp) {
                        existing.content = entry.content;
                        existing.timestamp = entry.timestamp;
                        existing.accessCount++;
                    }
                    removed.push(entry);
                    break;
                }
            }
            if (!isDuplicate) {
                kept.push(entry);
            }
        }
        const totalTokens = entries.reduce((sum, e) => sum + this.estimateTokens(e.content), 0);
        const keptTokens = kept.reduce((sum, e) => sum + this.estimateTokens(e.content), 0);
        return {
            originalCount,
            deduplicatedCount: kept.length,
            duplicatesRemoved: removed.length,
            tokensSaved: totalTokens - keptTokens,
            entries: kept.slice(-this.maxEntries),
        };
    }
    mergeSessions(sessionA, sessionB) {
        const combined = [...sessionA, ...sessionB];
        const result = this.deduplicate(combined);
        return result.entries;
    }
    cosineSimilarity(a, b) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
    }
    estimateTokens(text) {
        return Math.ceil(text.length / 4);
    }
}
