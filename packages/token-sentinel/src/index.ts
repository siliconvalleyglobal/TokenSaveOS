/**
 * Real-Time Streaming Token Sentinel for TokenSaveOS.
 * Monitors SSE output chunks chunk-by-chunk to catch and abort infinite AI output loops and token spikes.
 */

export interface SentinelConfig {
  maxTokensPerResponse?: number;
  repetitionThreshold?: number; // max repeated identical words/phrases allowed
}

export interface SentinelEvaluation {
  shouldAbort: boolean;
  reason?: string;
  totalTokensProcessed: number;
  repetitionCount: number;
}

export class StreamingTokenSentinel {
  private config: Required<SentinelConfig>;
  private accumulatedText: string = '';
  private tokenCount: number = 0;
  private repetitionCount: number = 0;

  constructor(config?: SentinelConfig) {
    this.config = {
      maxTokensPerResponse: config?.maxTokensPerResponse ?? 4096,
      repetitionThreshold: config?.repetitionThreshold ?? 5
    };
  }

  /**
   * Processes an incoming streaming output chunk.
   * Returns a SentinelEvaluation indicating if the stream should be aborted.
   */
  public processChunk(chunk: string): SentinelEvaluation {
    this.accumulatedText += chunk;
    // Approximate token count by word/whitespace chunks
    const chunkTokens = Math.max(1, Math.round(chunk.length / 4));
    this.tokenCount += chunkTokens;

    // Check 1: Max Token Cap
    if (this.tokenCount > this.config.maxTokensPerResponse) {
      return {
        shouldAbort: true,
        reason: `Max Token Cap Exceeded (${this.tokenCount} > ${this.config.maxTokensPerResponse})`,
        totalTokensProcessed: this.tokenCount,
        repetitionCount: this.repetitionCount
      };
    }

    // Check 2: Repetitive Output Loop (e.g. infinite repeating words/phrases)
    const words = this.accumulatedText.trim().split(/\s+/);
    if (words.length >= 10) {
      const recent = words.slice(-10);
      const uniqueRecent = new Set(recent);
      // If 10 consecutive words contain only 1 or 2 unique words, AI is in an infinite loop
      if (uniqueRecent.size <= 2) {
        this.repetitionCount++;
        if (this.repetitionCount >= this.config.repetitionThreshold) {
          return {
            shouldAbort: true,
            reason: `Infinite Loop Detected: Repetitive word pattern '${Array.from(uniqueRecent).join(', ')}'`,
            totalTokensProcessed: this.tokenCount,
            repetitionCount: this.repetitionCount
          };
        }
      }
    }

    return {
      shouldAbort: false,
      totalTokensProcessed: this.tokenCount,
      repetitionCount: this.repetitionCount
    };
  }

  public reset(): void {
    this.accumulatedText = '';
    this.tokenCount = 0;
    this.repetitionCount = 0;
  }
}
