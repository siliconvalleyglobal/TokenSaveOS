/**
 * Prompt Versioning & A/B Testing
 * Version-control prompts and compare token usage across versions
 */
export interface PromptVersion {
    id: string;
    name: string;
    content: string;
    version: number;
    createdAt: number;
    metadata: Record<string, unknown>;
}
export interface ABTestResult {
    versionA: string;
    versionB: string;
    winner: 'A' | 'B' | 'tie';
    aTokens: number;
    bTokens: number;
    aCostUSD: number;
    bCostUSD: number;
    improvementPercent: number;
}
export declare class PromptVersioning {
    private versions;
    private currentVersions;
    createVersion(name: string, content: string, metadata?: Record<string, unknown>): PromptVersion;
    getVersion(name: string, versionId?: string): PromptVersion | undefined;
    listVersions(name: string): PromptVersion[];
    runABTest(name: string, runnerA: (prompt: string) => Promise<string>, runnerB: (prompt: string) => Promise<string>, tokenEstimator: (text: string) => number, costCalculator: (tokens: number) => number): Promise<ABTestResult>;
    rollback(name: string, versionId: string): void;
}
