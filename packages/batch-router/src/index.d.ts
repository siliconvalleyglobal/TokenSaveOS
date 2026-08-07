/**
 * Batch API Router
 * Routes non-urgent jobs to cheaper batch endpoints
 */
export interface BatchJob {
    id: string;
    prompt: string;
    model: string;
    priority: 'low' | 'medium' | 'high';
    callback?: (result: string) => void;
    createdAt: number;
}
export interface BatchRouteDecision {
    useBatch: boolean;
    estimatedSavingsPercent: number;
    estimatedLatencyMs: number;
    reason: string;
}
export declare class BatchRouter {
    private batchQueue;
    private processing;
    private flushIntervalMs;
    private maxBatchSize;
    constructor(flushIntervalMs?: number, maxBatchSize?: number);
    route(job: BatchJob): BatchRouteDecision;
    enqueue(job: BatchJob): void;
    flush(): Promise<string[]>;
    getQueueLength(): number;
    private executeBatchJob;
}
