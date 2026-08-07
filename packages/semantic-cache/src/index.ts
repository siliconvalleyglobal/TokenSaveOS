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

export class SemanticCache {
  private cache: Map<string, SemanticCacheEntry> = new Map();
  private stats: SemanticCacheStats = {
    totalQueries: 0,
    cacheHits: 0,
    cacheMisses: 0,
    semanticHits: 0,
    tokensSaved: 0,
    avgSimilarity: 0,
  };
  private similarityThreshold: number;
  private maxEntries: number;

  constructor(similarityThreshold: number = 0.92, maxEntries: number = 10000) {
    this.similarityThreshold = similarityThreshold;
    this.maxEntries = maxEntries;
  }

  public lookup(prompt: string, embeddingFn: (text: string) => number[]): { hit: boolean; response?: string; similarity?: number } {
    this.stats.totalQueries++;
    const queryEmbedding = embeddingFn(prompt);

    let bestMatch: { id: string; similarity: number } | null = null;
    for (const [id, entry] of this.cache) {
      const similarity = this.cosineSimilarity(queryEmbedding, entry.embedding);
      if (similarity > this.similarityThreshold && (!bestMatch || similarity > bestMatch.similarity)) {
        bestMatch = { id, similarity };
      }
    }

    if (bestMatch) {
      const entry = this.cache.get(bestMatch.id)!;
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

  public store(prompt: string, response: string, embeddingFn: (text: string) => number[]): void {
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

  public getStats(): SemanticCacheStats {
    return { ...this.stats };
  }

  public clear(): void {
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

  private cosineSimilarity(a: number[], b: number[]): number {
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

  private hashPrompt(prompt: string): string {
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      hash = ((hash << 5) - hash) + prompt.charCodeAt(i);
      hash = hash & hash;
    }
    return `sem-${Math.abs(hash)}`;
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private evictOldest(): void {
    let oldest: string | null = null;
    let oldestTime = Infinity;
    for (const [id, entry] of this.cache) {
      if (entry.createdAt < oldestTime) {
        oldestTime = entry.createdAt;
        oldest = id;
      }
    }
    if (oldest) this.cache.delete(oldest);
  }
}
