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

export class BatchRouter {
  private batchQueue: BatchJob[] = [];
  private processing = false;
  private flushIntervalMs: number;
  private maxBatchSize: number;

  constructor(flushIntervalMs: number = 60000, maxBatchSize: number = 100) {
    this.flushIntervalMs = flushIntervalMs;
    this.maxBatchSize = maxBatchSize;
  }

  public route(job: BatchJob): BatchRouteDecision {
    if (job.priority === 'high') {
      return {
        useBatch: false,
        estimatedSavingsPercent: 0,
        estimatedLatencyMs: 2000,
        reason: 'High priority job routed to real-time API',
      };
    }

    if (job.priority === 'medium' && this.batchQueue.length > this.maxBatchSize * 0.8) {
      return {
        useBatch: true,
        estimatedSavingsPercent: 50,
        estimatedLatencyMs: 30000,
        reason: 'Batch queue near capacity, redirecting to save cost',
      };
    }

    return {
      useBatch: true,
      estimatedSavingsPercent: 50,
      estimatedLatencyMs: this.flushIntervalMs,
      reason: 'Non-urgent job routed to batch API for 50% cost savings',
    };
  }

  public enqueue(job: BatchJob): void {
    this.batchQueue.push(job);
    if (this.batchQueue.length >= this.maxBatchSize && !this.processing) {
      this.flush();
    }
  }

  public async flush(): Promise<string[]> {
    if (this.processing || this.batchQueue.length === 0) {
      return [];
    }

    this.processing = true;
    const jobs = this.batchQueue.splice(0, this.maxBatchSize);
    const results: string[] = [];

    for (const job of jobs) {
      try {
        const result = await this.executeBatchJob(job);
        results.push(result);
        job.callback?.(result);
      } catch (error) {
        results.push(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    this.processing = false;
    return results;
  }

  public getQueueLength(): number {
    return this.batchQueue.length;
  }

  private async executeBatchJob(job: BatchJob): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return `[BATCH] Processed: ${job.prompt.slice(0, 50)}...`;
  }
}
