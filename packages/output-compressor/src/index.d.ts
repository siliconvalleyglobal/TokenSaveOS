/**
 * Output Compressor Module
 * Trims and compresses LLM outputs to reduce token costs
 */
export interface CompressOptions {
    maxTokens?: number;
    trimTrailingWhitespace?: boolean;
    removeFiller?: boolean;
    removeEmojis?: boolean;
    compressCodeBlocks?: boolean;
    maxCodeBlockLines?: number;
}
export interface CompressResult {
    original: string;
    compressed: string;
    originalTokens: number;
    compressedTokens: number;
    savingsPercent: number;
    tokensSaved: number;
}
export declare class OutputCompressor {
    private options;
    constructor(options?: CompressOptions);
    compress(output: string, provider?: 'anthropic' | 'openai' | 'gemini'): CompressResult;
    shouldCompress(output: string, provider?: 'anthropic' | 'openai' | 'gemini'): boolean;
    private compressCodeBlocks;
    private estimateTokens;
}
//# sourceMappingURL=index.d.ts.map