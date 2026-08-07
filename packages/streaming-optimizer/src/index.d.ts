/**
 * Streaming Token Optimizer
 * Compresses tool outputs, logs, and stack traces in real-time
 */
export interface StreamChunk {
    type: 'text' | 'tool_output' | 'log' | 'error' | 'stack_trace';
    content: string;
    priority: 'high' | 'medium' | 'low';
    tokens: number;
}
export interface StreamOptimizationResult {
    originalTokens: number;
    optimizedTokens: number;
    tokensSaved: number;
    savingsPercent: number;
    chunks: StreamChunk[];
}
export declare class StreamingOptimizer {
    private maxChunkTokens;
    private compressionRatio;
    constructor(maxChunkTokens?: number, compressionRatio?: number);
    optimizeChunk(chunk: StreamChunk): StreamChunk;
    optimizeStream(chunks: StreamChunk[]): StreamOptimizationResult;
    shouldCompress(chunk: StreamChunk): boolean;
    private compressToolOutput;
    private compressStackTrace;
    private compressError;
    private estimateTokens;
}
