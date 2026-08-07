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

export class PromptCacheManager {
  private stats: Map<string, PromptCacheStats> = new Map();
  private cacheStore: Map<string, { content: string; provider: string; expiresAt: number }> = new Map();

  constructor() {}

  public addBreakpoint(prompt: string, type: CacheBreakpoint['type'], tokens: number): string {
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

  public getStats(provider?: string): PromptCacheStats[] {
    const results: PromptCacheStats[] = [];
    for (const [key, stat] of this.stats) {
      if (!provider || key.startsWith(provider)) {
        const hitRate = stat.cacheHits / (stat.cacheHits + stat.cacheMisses) || 0;
        results.push({ ...stat, hitRate });
      }
    }
    return results;
  }

  public getOverallSavings(): { tokensSaved: number; costSavedUSD: number; hitRate: number } {
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

  public clear(): void {
    this.cacheStore.clear();
    this.stats.clear();
  }

  private hashPrompt(prompt: string): string {
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `cache-${Math.abs(hash)}`;
  }

  private getTTL(type: CacheBreakpoint['type']): number {
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

  private recordHit(provider: CacheBreakpoint['type'], tokens: number): void {
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

  private recordMiss(provider: CacheBreakpoint['type'], _tokens: number): void {
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

  private calculateSavings(provider: CacheBreakpoint['type'], tokens: number): number {
    const rates: Record<string, number> = {
      anthropic: 0.003,
      openai: 0.0015,
      gemini: 0.00125,
    };
    return (tokens / 1000) * (rates[provider] || 0.002);
  }
}
