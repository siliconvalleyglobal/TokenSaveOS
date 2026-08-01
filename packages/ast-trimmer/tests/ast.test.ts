import { describe, it, expect } from 'vitest';
import { ASTCodeTrimmer } from '../src/index';

describe('ASTCodeTrimmer', () => {
  const trimmer = new ASTCodeTrimmer();

  it('should strip comments and docstrings from TypeScript code', () => {
    const tsCode = `
      /**
       * Multi-line JSDoc comment
       * Explaining internal architecture
       */
      export interface User {
        id: string; // user ID
        name: string;
      }

      // Internal helper function
      function internalHelper() {
        return true;
      }
    `;

    const result = trimmer.trimCodeContext(tsCode, 'typescript');
    expect(result.trimmedCode).not.toContain('Multi-line JSDoc comment');
    expect(result.trimmedCode).not.toContain('Internal helper function');
    expect(result.trimmedCode).toContain('export interface User');
    expect(result.estimatedTokensSaved).toBeGreaterThan(0);
  });

  it('should extract exported signatures', () => {
    const tsCode = `
      const secretKey = "12345";
      function privateFn() {}

      export interface Config {
        port: number;
      }
    `;

    const exported = trimmer.extractExportedSignatures(tsCode);
    expect(exported).toContain('export interface Config');
    expect(exported).not.toContain('secretKey');
    expect(exported).not.toContain('privateFn');
  });
});
