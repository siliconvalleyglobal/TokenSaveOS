/**
 * Semantic Cache Layer
 * Caches similar queries using embedding-based similarity
 */
export class SemanticCache {
    cache = new Map();
    stats = {
        totalQueries: 0,
        cacheHits: 0,
        cacheMisses: 0,
        semanticHits: 0,
        tokensSaved: 0,
        avgSimilarity: 0,
    };
    similarityThreshold;
    maxEntries;
    constructor(similarityThreshold = 0.92, maxEntries = 10000) {
        this.similarityThreshold = similarityThreshold;
        this.maxEntries = maxEntries;
    }
    lookup(prompt, embeddingFn) {
        this.stats.totalQueries++;
        const queryEmbedding = embeddingFn(prompt);
        let bestMatch = null;
        for (const [id, entry] of this.cache) {
            const similarity = this.cosineSimilarity(queryEmbedding, entry.embedding);
            if (similarity > this.similarityThreshold && (!bestMatch || similarity > bestMatch.similarity)) {
                bestMatch = { id, similarity };
            }
        }
        if (bestMatch) {
            const entry = this.cache.get(bestMatch.id);
            entry.hitCount++;
            this.stats.cacheHits++;
            this.stats.semanticHits++;
            this.stats.tokensSaved += this.estimateTokens(entry.response);
            this.stats.avgSimilarity = (this.stats.avgSimilarity + bestMatch.similarity) / 2;
            return { hit: true, response: entry.response, similarity: bestMatch.similarity };
        }
        this.stats.cacheMisses++;
        return { hit: false };
    }
    store(prompt, response, embeddingFn) {
        if (this.cache.size >= this.maxEntries) {
            this.evictOldest();
        }
        const id = this.hashPrompt(prompt);
        this.cache.set(id, {
            id,
            prompt,
            response,
            embedding: embeddingFn(prompt),
            createdAt: Date.now(),
            hitCount: 0,
        });
    }
    getStats() {
        return { ...this.stats };
    }
    clear() {
        this.cache.clear();
        this.stats = {
            totalQueries: 0,
            cacheHits: 0,
            cacheMisses: 0,
            semanticHits: 0,
            tokensSaved: 0,
            avgSimilarity: 0,
        };
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
    hashPrompt(prompt) {
        let hash = 0;
        for (let i = 0; i < prompt.length; i++) {
            hash = ((hash << 5) - hash) + prompt.charCodeAt(i);
            hash = hash & hash;
        }
        return `sem-${Math.abs(hash)}`;
    }
    estimateTokens(text) {
        return Math.ceil(text.length / 4);
    }
    evictOldest() {
        let oldest = null;
        let oldestTime = Infinity;
        for (const [id, entry] of this.cache) {
            if (entry.createdAt < oldestTime) {
                oldestTime = entry.createdAt;
                oldest = id;
            }
        }
        if (oldest)
            this.cache.delete(oldest);
    }
}
//# sourceMappingURL=index.js.map