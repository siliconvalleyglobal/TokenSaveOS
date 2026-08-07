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
export declare class LoopDetector {
    private history;
    private signatures;
    private maxHistory;
    private loopThreshold;
    private consecutiveThreshold;
    constructor(maxHistory?: number, loopThreshold?: number, consecutiveThreshold?: number);
    recordStep(step: string): LoopDetectionResult;
    getLoopPatterns(): LoopSignature[];
    reset(): void;
    private countIdenticalSequences;
    private detectFuzzyLoop;
    private normalizeStep;
}
