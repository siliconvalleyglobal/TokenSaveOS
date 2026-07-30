import { describe, it, expect } from 'vitest';
import { CacheManager } from '../src/index.js';
describe('Cache Manager Prompt Breakpoints', () => {
    it('should annotate cache breakpoints for Anthropic provider', () => {
        const mgr = new CacheManager();
        const annotated = mgr.annotateCacheBreakpoints("System Prompt", "anthropic");
        expect(annotated.cache_control).toBeDefined();
        expect(annotated.cache_control.type).toBe('ephemeral');
    });
    it('should track prompt cache hits and misses', () => {
        const mgr = new CacheManager();
        const prompt = "Durable Architecture Prompt";
        expect(mgr.checkCache(prompt).hit).toBe(false);
        mgr.setCache(prompt);
        expect(mgr.checkCache(prompt).hit).toBe(true);
        const stats = mgr.getStats();
        expect(stats.hits).toBe(1);
        expect(stats.misses).toBe(1);
    });
});
