/**
 * Native Prompt Cache & Breakpoint Manager
 */

import { CacheStats } from '@tokensaveos/core';
import { estimateProviderTokens } from '@tokensaveos/token-engine';

export class CacheManager {
  private cache = new Map<string, { prompt: string; tokens: number; hits: number }>();
  private hits = 0;
  private misses = 0;
  private totalTokensSaved = 0;

  private generateKey(prompt: string): string {
    return prompt.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  public annotateCacheBreakpoints(systemPrompt: string, provider: string = 'anthropic'): any {
    if (provider === 'anthropic') {
      return {
        type: 'text',
        text: systemPrompt,
        cache_control: { type: 'ephemeral' }
      };
    }
    return systemPrompt;
  }

  public checkCache(prompt: string): { hit: boolean; cachedPrompt?: string } {
    const key = this.generateKey(prompt);
    if (this.cache.has(key)) {
      this.hits++;
      const entry = this.cache.get(key)!;
      entry.hits++;
      const tokens = estimateProviderTokens(prompt, 'anthropic');
      this.totalTokensSaved += tokens;
      return { hit: true, cachedPrompt: entry.prompt };
    }
    this.misses++;
    return { hit: false };
  }

  public setCache(prompt: string): void {
    const key = this.generateKey(prompt);
    const tokens = estimateProviderTokens(prompt, 'anthropic');
    this.cache.set(key, { prompt, tokens, hits: 1 });
  }

  public getStats(): CacheStats {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? parseFloat(((this.hits / total) * 100).toFixed(1)) : 0;
    const usdSaved = parseFloat(((this.totalTokensSaved / 1000) * 0.003).toFixed(4));

    return {
      hits: this.hits,
      misses: this.misses,
      hitRate,
      totalTokensSaved: this.totalTokensSaved,
      usdSaved
    };
  }
}
