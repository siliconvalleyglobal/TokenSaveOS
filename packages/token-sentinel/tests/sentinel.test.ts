import { describe, it, expect } from 'vitest';
import { StreamingTokenSentinel } from '../src/index';

describe('StreamingTokenSentinel', () => {
  it('should allow normal non-repetitive chunks within limit', () => {
    const sentinel = new StreamingTokenSentinel({ maxTokensPerResponse: 100 });
    const res = sentinel.processChunk("Hello, I am executing an architectural optimization task.");
    expect(res.shouldAbort).toBe(false);
    expect(res.totalTokensProcessed).toBeGreaterThan(0);
  });

  it('should abort when token cap is exceeded', () => {
    const sentinel = new StreamingTokenSentinel({ maxTokensPerResponse: 20 });
    const longChunk = "A".repeat(120); // ~30 tokens
    const res = sentinel.processChunk(longChunk);
    expect(res.shouldAbort).toBe(true);
    expect(res.reason).toContain('Max Token Cap Exceeded');
  });

  it('should abort when infinite repetitive loop is detected', () => {
    const sentinel = new StreamingTokenSentinel({ maxTokensPerResponse: 1000, repetitionThreshold: 2 });
    let res;
    for (let i = 0; i < 5; i++) {
      res = sentinel.processChunk("loop loop loop loop loop loop loop loop loop loop ");
    }
    expect(res?.shouldAbort).toBe(true);
    expect(res?.reason).toContain('Infinite Loop Detected');
  });
});
