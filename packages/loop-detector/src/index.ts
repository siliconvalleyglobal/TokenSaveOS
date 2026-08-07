/**
 * Agent Loop Detector v2
 * Detects and terminates runaway agent loops in real-time
 */

export interface LoopSignature {
  pattern: string;
  occurrences: number;
  firstSeen: number;
  lastSeen: number;
}

export interface LoopDetectionResult {
  isLooping: boolean;
  confidence: number;
  pattern?: string;
  occurrences: number;
  recommendation: 'continue' | 'warn' | 'terminate';
}

export class LoopDetector {
  private history: string[] = [];
  private signatures: Map<string, LoopSignature> = new Map();
  private maxHistory: number;
  private loopThreshold: number;
  private consecutiveThreshold: number;

  constructor(maxHistory: number = 50, loopThreshold: number = 0.85, consecutiveThreshold: number = 5) {
    this.maxHistory = maxHistory;
    this.loopThreshold = loopThreshold;
    this.consecutiveThreshold = consecutiveThreshold;
  }

  public recordStep(step: string): LoopDetectionResult {
    this.history.push(step);
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(-this.maxHistory);
    }

    if (this.history.length < this.consecutiveThreshold) {
      return { isLooping: false, confidence: 0, occurrences: 0, recommendation: 'continue' };
    }

    const recent = this.history.slice(-this.consecutiveThreshold);
    const identicalCount = this.countIdenticalSequences(recent);
    
    if (identicalCount >= this.consecutiveThreshold) {
      const pattern = recent[0];
      return {
        isLooping: true,
        confidence: 1.0,
        pattern,
        occurrences: identicalCount,
        recommendation: 'terminate',
      };
    }

    const fuzzyResult = this.detectFuzzyLoop(recent);
    if (fuzzyResult.isLooping) {
      return {
        isLooping: true,
        confidence: fuzzyResult.similarity,
        pattern: fuzzyResult.pattern,
        occurrences: fuzzyResult.occurrences,
        recommendation: fuzzyResult.similarity > this.loopThreshold ? 'terminate' : 'warn',
      };
    }

    return { isLooping: false, confidence: 0, occurrences: 0, recommendation: 'continue' };
  }

  public getLoopPatterns(): LoopSignature[] {
    return Array.from(this.signatures.values()).sort((a, b) => b.occurrences - a.occurrences);
  }

  public reset(): void {
    this.history = [];
    this.signatures.clear();
  }

  private countIdenticalSequences(sequence: string[]): number {
    const first = sequence[0];
    return sequence.filter((s) => s === first).length;
  }

  private detectFuzzyLoop(recent: string[]): { isLooping: boolean; similarity: number; pattern: string; occurrences: number } {
    const groups = new Map<string, string[]>();
    for (const step of recent) {
      const normalized = this.normalizeStep(step);
      const existing = groups.get(normalized) || [];
      existing.push(step);
      groups.set(normalized, existing);
    }

    for (const [pattern, occurrences] of groups) {
      if (occurrences.length >= this.consecutiveThreshold) {
        const similarity = occurrences.length / recent.length;
        return { isLooping: true, similarity, pattern, occurrences: occurrences.length };
      }
    }

    return { isLooping: false, similarity: 0, pattern: '', occurrences: 0 };
  }

  private normalizeStep(step: string): string {
    return step
      .replace(/\d+/g, 'N')
      .replace(/['"`][^'"`]*['"`]/g, 'STRING')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100);
  }
}
