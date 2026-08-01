import { describe, it, expect } from 'vitest';
import { ProviderCostMatrix } from '../src/index';

describe('ProviderCostMatrix', () => {
  const matrix = new ProviderCostMatrix();

  it('should calculate and sort model estimates by cost', () => {
    const estimates = matrix.calculateComparison(100_000, 10_000);
    expect(estimates.length).toBeGreaterThan(0);
    expect(estimates[0].isCheapest).toBe(true);
    expect(estimates[0].totalCostUSD).toBeLessThan(estimates[estimates.length - 1].totalCostUSD);
  });

  it('should apply prompt caching discount when requested', () => {
    const normal = matrix.calculateComparison(1_000_000, 0, false);
    const cached = matrix.calculateComparison(1_000_000, 0, true);

    const sonnetNormal = normal.find(m => m.modelId === 'claude-3-7-sonnet')!;
    const sonnetCached = cached.find(m => m.modelId === 'claude-3-7-sonnet')!;

    expect(sonnetCached.totalCostUSD).toBeLessThan(sonnetNormal.totalCostUSD);
    expect(sonnetCached.totalCostUSD).toBe(0.30); // $0.30 per 1M cached vs $3.00 normal
  });

  it('should recommend optimal cheapest model', () => {
    const optimal = matrix.recommendOptimalModel(50_000, 5_000);
    expect(optimal).toBeDefined();
    expect(optimal.totalCostUSD).toBeGreaterThan(0);
  });
});
