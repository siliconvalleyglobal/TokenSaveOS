/**
 * Real-Time Streaming Token Sentinel for TokenSaveOS.
 * Monitors SSE output chunks chunk-by-chunk to catch and abort infinite AI output loops and token spikes.
 */
export interface SentinelConfig {
    maxTokensPerResponse?: number;
    repetitionThreshold?: number;
}
export interface SentinelEvaluation {
    shouldAbort: boolean;
    reason?: string;
    totalTokensProcessed: number;
    repetitionCount: number;
}
export declare class StreamingTokenSentinel {
    private config;
    private accumulatedText;
    private tokenCount;
    private repetitionCount;
    constructor(config?: SentinelConfig);
    /**
     * Processes an incoming streaming output chunk.
     * Returns a SentinelEvaluation indicating if the stream should be aborted.
     */
    processChunk(chunk: string): SentinelEvaluation;
    reset(): void;
}
