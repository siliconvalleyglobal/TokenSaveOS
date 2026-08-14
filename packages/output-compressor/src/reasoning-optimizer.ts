/**
 * Reasoning Token Budget Optimizer & Thought-Stream Pruner
 * Intelligently manages and prunes extended thinking tokens across multi-turn agent conversations.
 */

export interface ReasoningBudgetConfig {
  maxThinkingTokens?: number;
  preserveFinalConclusionsOnly?: boolean;
  complexityMultiplier?: number;
  provider?: 'anthropic' | 'openai' | 'deepseek' | 'gemini';
}

export interface PrunedReasoningResult {
  cleanedText: string;
  extractedThought?: string;
  originalTokens: number;
  prunedTokens: number;
  tokensSaved: number;
  savingsPercentage: number;
}

export class ReasoningBudgetOptimizer {
  private config: Required<ReasoningBudgetConfig>;

  constructor(config: ReasoningBudgetConfig = {}) {
    this.config = {
      maxThinkingTokens: config.maxThinkingTokens ?? 2048,
      preserveFinalConclusionsOnly: config.preserveFinalConclusionsOnly ?? true,
      complexityMultiplier: config.complexityMultiplier ?? 1.0,
      provider: config.provider ?? 'anthropic',
    };
  }

  /**
   * Calculates optimal reasoning token budget based on prompt complexity
   */
  public calculateDynamicBudget(prompt: string): number {
    const promptLength = prompt.length;
    const lower = prompt.toLowerCase();

    let baseTokens = 1024;

    // Detect complex reasoning signals
    if (
      lower.includes('refactor') ||
      lower.includes('architect') ||
      lower.includes('algorithm') ||
      lower.includes('optimize') ||
      lower.includes('prove')
    ) {
      baseTokens = 4096;
    } else if (
      lower.includes('debug') ||
      lower.includes('explain') ||
      lower.includes('analyze')
    ) {
      baseTokens = 2048;
    } else if (promptLength < 100) {
      baseTokens = 512;
    }

    return Math.min(
      Math.round(baseTokens * this.config.complexityMultiplier),
      16384
    );
  }

  /**
   * Prunes reasoning tags (<thinking>...</thinking>, thought blocks) from conversation history
   */
  public pruneReasoningHistory(text: string): PrunedReasoningResult {
    const originalTokens = this.estimateTokens(text);
    const thinkingRegex = /<(?:thinking|thought)>([\s\S]*?)<\/(?:thinking|thought)>/gi;

    let extractedThought: string | undefined;
    const match = thinkingRegex.exec(text);
    if (match) {
      extractedThought = match[1].trim();
    }

    let cleaned = text.replace(thinkingRegex, '').trim();

    // Also strip generic chain-of-thought markdown markers if needed
    cleaned = cleaned.replace(/^>\s*Thinking Process:[\s\S]*?\n\n/gim, '');

    const prunedTokens = this.estimateTokens(cleaned);
    const tokensSaved = Math.max(0, originalTokens - prunedTokens);
    const savingsPercentage = originalTokens > 0 ? (tokensSaved / originalTokens) * 100 : 0;

    return {
      cleanedText: cleaned,
      extractedThought,
      originalTokens,
      prunedTokens,
      tokensSaved,
      savingsPercentage: Math.round(savingsPercentage * 100) / 100,
    };
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length * 0.25);
  }
}
