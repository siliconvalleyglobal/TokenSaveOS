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

export class MemoryDeduplicator {
  private similarityThreshold: number;
  private maxEntries: number;

  constructor(similarityThreshold: number = 0.95, maxEntries: number = 5000) {
    this.similarityThreshold = similarityThreshold;
    this.maxEntries = maxEntries;
  }

  public deduplicate(entries: MemoryEntry[]): DedupResult {
    const originalCount = entries.length;
    const kept: MemoryEntry[] = [];
    const removed: MemoryEntry[] = [];

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

  public mergeSessions(sessionA: MemoryEntry[], sessionB: MemoryEntry[]): MemoryEntry[] {
    const combined = [...sessionA, ...sessionB];
    const result = this.deduplicate(combined);
    return result.entries;
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

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
