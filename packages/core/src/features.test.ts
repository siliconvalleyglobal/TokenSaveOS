import { describe, test, expect } from 'vitest';
import { ReasoningBudgetOptimizer, ToolPayloadStripper } from '@tokensaveos/output-compressor';
import { PromptCacheAligner } from '@tokensaveos/prompt-cache';
import { PredictiveModelRouter } from '@tokensaveos/agent-router';
import { FinOpsBudgetEngine } from '@tokensaveos/budget-circuit-breaker';

describe('TokenSaveOS v2.1.0 Enterprise Features', () => {
  test('ReasoningBudgetOptimizer prunes thought streams and calculates budget', () => {
    const optimizer = new ReasoningBudgetOptimizer();
    const prompt = 'Please architect and refactor this concurrent distributed database system';
    const budget = optimizer.calculateDynamicBudget(prompt);
    expect(budget).toBeGreaterThanOrEqual(4096);

    const historyWithThoughts = '<thinking>I will first analyze the database locks.</thinking>Here is the final migration plan.';
    const pruned = optimizer.pruneReasoningHistory(historyWithThoughts);
    expect(pruned.cleanedText).toBe('Here is the final migration plan.');
    expect(pruned.extractedThought).toBe('I will first analyze the database locks.');
    expect(pruned.tokensSaved).toBeGreaterThan(0);
  });

  test('ToolPayloadStripper truncates deep bulky JSON structures', () => {
    const stripper = new ToolPayloadStripper({ maxArrayItems: 2, truncateLongStringsLength: 20 });
    const largePayload = {
      status: 'ok',
      records: [1, 2, 3, 4, 5],
      hugeText: 'This is a very long string that should get truncated',
      emptyVal: null,
    };
    const cleaned = stripper.stripPayload(largePayload) as any;
    expect(cleaned.records.length).toBe(3); // 2 items + truncated marker
    expect(cleaned.hugeText).toContain('truncated');
    expect(cleaned.emptyVal).toBeUndefined();
  });

  test('PromptCacheAligner maximizes prefix cache alignment', () => {
    const aligner = new PromptCacheAligner();
    const aligned = aligner.alignPrompt({
      systemPrompt: '  You are an expert assistant.\n',
      toolSchemas: [{ name: 'b_tool' }, { name: 'a_tool' }],
      dynamicContext: 'User context',
      userQuery: 'How do I run this?',
    });

    expect(aligned.alignedPrompt).toContain('[SYSTEM_PROMPT]');
    expect(aligned.alignedPrompt).toContain('[TOOL_DEFINITIONS]');
    expect(aligned.cachePrefixHash).toMatch(/^prefix-/);
    expect(aligned.estimatedCacheHitRate).toBeGreaterThan(0.5);
  });

  test('PredictiveModelRouter routes requests according to complexity', () => {
    const router = new PredictiveModelRouter();
    
    // Simple conversational query
    const simple = router.predictRoute({ prompt: 'Hello, can you summarize this line?' });
    expect(simple.tier).toBe('flash');

    // Deep coding / architectural query
    const complex = router.predictRoute({ prompt: 'function resolveRaceCondition() { refactor architecture }' });
    expect(complex.tier).toBe('flagship');
  });

  test('FinOpsBudgetEngine records spend and enforces department caps', () => {
    const finops = new FinOpsBudgetEngine();
    finops.setDepartmentLimit('engineering', 50.0);

    const spend1 = finops.recordSpend({
      tag: { tenantId: 'tenant_1', departmentId: 'engineering' },
      costUSD: 10.0,
      tokens: 2000,
      model: 'claude-3-7-sonnet',
      timestamp: Date.now(),
    });
    expect(spend1.allowed).toBe(true);

    const spend2 = finops.recordSpend({
      tag: { tenantId: 'tenant_1', departmentId: 'engineering' },
      costUSD: 45.0,
      tokens: 9000,
      model: 'claude-3-opus',
      timestamp: Date.now(),
    });
    expect(spend2.allowed).toBe(false);
    expect(spend2.action).toBe('block');
  });
});
