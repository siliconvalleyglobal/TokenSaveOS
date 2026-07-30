/**
 * Durable Memory Engine with Schema Versioning & Secret Scrubbing
 */
export interface MemoryRecord {
    schemaVersion: number;
    project: string;
    updatedAt: string;
    architecture: string;
    decisions: string[];
    style: string;
}
export declare class MemoryEngine {
    private memoryDir;
    constructor(rootDir?: string);
    getMemoryPath(filename?: string): string;
    loadMemory(filename?: string): MemoryRecord;
    saveMemory(record: Partial<MemoryRecord>, filename?: string): void;
}
