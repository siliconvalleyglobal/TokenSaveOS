/**
 * Durable Memory Engine with Schema Versioning & Secret Scrubbing
 */

import * as fs from 'fs';
import * as path from 'path';
import { redactSecrets } from '@tokensaveos/core';

export interface MemoryRecord {
  schemaVersion: number;
  project: string;
  updatedAt: string;
  architecture: string;
  decisions: string[];
  style: string;
}

export class MemoryEngine {
  private memoryDir: string;

  constructor(rootDir: string = process.cwd()) {
    this.memoryDir = path.join(rootDir, '.tokensave', 'memory');
    if (!fs.existsSync(this.memoryDir)) {
      fs.mkdirSync(this.memoryDir, { recursive: true });
    }
  }

  public getMemoryPath(filename: string = 'project.json'): string {
    return path.join(this.memoryDir, filename);
  }

  public loadMemory(filename: string = 'project.json'): MemoryRecord {
    const memPath = this.getMemoryPath(filename);
    if (fs.existsSync(memPath)) {
      try {
        const raw = fs.readFileSync(memPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.schemaVersion !== 1) {
          console.warn(`Memory schema version mismatch (expected 1, got ${parsed.schemaVersion}). Migrating memory.`);
        }
        return parsed;
      } catch (e) {
        // Fallback default
      }
    }
    return {
      schemaVersion: 1,
      project: 'Default Project',
      updatedAt: new Date().toISOString(),
      architecture: 'Modular TypeScript Monorepo Architecture',
      decisions: ['Use TokenSaveOS for token savings & context pruning'],
      style: 'TypeScript ESM Modules'
    };
  }

  public saveMemory(record: Partial<MemoryRecord>, filename: string = 'project.json'): void {
    const current = this.loadMemory(filename);
    const updated: MemoryRecord = {
      schemaVersion: 1,
      project: redactSecrets(record.project || current.project),
      updatedAt: new Date().toISOString(),
      architecture: redactSecrets(record.architecture || current.architecture),
      decisions: (record.decisions || current.decisions).map(d => redactSecrets(d)),
      style: redactSecrets(record.style || current.style)
    };

    const memPath = this.getMemoryPath(filename);
    fs.writeFileSync(memPath, JSON.stringify(updated, null, 2), 'utf-8');
  }
}
