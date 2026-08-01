/**
 * Codebase AST Context Trimmer for TokenSaveOS.
 * Strips comments, internal unexported functions, and verbose docstrings from code files,
 * preserving exported signatures to save 35%-55% prompt tokens.
 */
export interface TrimmingResult {
    originalCode: string;
    trimmedCode: string;
    originalLineCount: number;
    trimmedLineCount: number;
    estimatedTokensSaved: number;
}
export declare class ASTCodeTrimmer {
    /**
     * Trims code snippets for LLM prompt context by removing docstrings, comments,
     * unexported internal helpers, and empty lines.
     */
    trimCodeContext(code: string, language?: 'typescript' | 'javascript' | 'python'): TrimmingResult;
    /**
     * Extracts only exported interface signatures from TypeScript code to produce ultra-compact context.
     */
    extractExportedSignatures(code: string): string;
}
