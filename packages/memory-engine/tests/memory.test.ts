import { describe, it, expect } from 'vitest';
import { MemoryEngine } from '../src/index.js';

describe('Memory Engine Storage & Redaction', () => {
  it('should load memory with schemaVersion = 1', () => {
    const mem = new MemoryEngine();
    const record = mem.loadMemory();
    expect(record.schemaVersion).toBe(1);
  });

  it('should redact secrets before saving memory record', () => {
    const mem = new MemoryEngine();
    mem.saveMemory({ project: 'Secret Project with key sk-123456789012345678901234567890' });
    const loaded = mem.loadMemory();
    expect(loaded.project).not.toContain('sk-123456789012345678901234567890');
    expect(loaded.project).toContain('[REDACTED_SECRET]');
  });
});
