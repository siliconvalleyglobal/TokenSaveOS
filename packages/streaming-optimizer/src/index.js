/**
 * Streaming Token Optimizer
 * Compresses tool outputs, logs, and stack traces in real-time
 */
export class StreamingOptimizer {
    maxChunkTokens;
    compressionRatio;
    constructor(maxChunkTokens = 2000, compressionRatio = 0.6) {
        this.maxChunkTokens = maxChunkTokens;
        this.compressionRatio = compressionRatio;
    }
    optimizeChunk(chunk) {
        let content = chunk.content;
        if (chunk.type === 'tool_output' || chunk.type === 'log') {
            content = this.compressToolOutput(content);
        }
        else if (chunk.type === 'stack_trace') {
            content = this.compressStackTrace(content);
        }
        else if (chunk.type === 'error') {
            content = this.compressError(content);
        }
        const tokens = this.estimateTokens(content);
        return {
            ...chunk,
            content,
            tokens,
        };
    }
    optimizeStream(chunks) {
        const originalTokens = chunks.reduce((sum, c) => sum + c.tokens, 0);
        const optimized = chunks.map((c) => this.optimizeChunk(c));
        const optimizedTokens = optimized.reduce((sum, c) => sum + c.tokens, 0);
        return {
            originalTokens,
            optimizedTokens,
            tokensSaved: originalTokens - optimizedTokens,
            savingsPercent: originalTokens > 0 ? ((originalTokens - optimizedTokens) / originalTokens) * 100 : 0,
            chunks: optimized,
        };
    }
    shouldCompress(chunk) {
        return chunk.tokens > this.maxChunkTokens;
    }
    compressToolOutput(content) {
        const lines = content.split('\n');
        const compressed = [];
        let totalLines = lines.length;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('error') || line.includes('Error') || line.includes('ERROR')) {
                compressed.push(line);
            }
            else if (i === 0 || i === lines.length - 1 || i < 10 || i > lines.length - 10) {
                compressed.push(line);
            }
            else if (Math.random() < this.compressionRatio) {
                compressed.push(line);
            }
        }
        if (compressed.length < totalLines) {
            compressed.splice(10, 0, `... [${totalLines - compressed.length} lines compressed] ...`);
        }
        return compressed.join('\n');
    }
    compressStackTrace(content) {
        const lines = content.split('\n');
        const relevant = [];
        let internalCount = 0;
        for (const line of lines) {
            if (line.includes('node_modules') || line.includes('internal/')) {
                internalCount++;
                if (internalCount <= 3) {
                    relevant.push(line);
                }
            }
            else {
                relevant.push(line);
                internalCount = 0;
            }
        }
        if (internalCount > 3) {
            relevant.push(`... [${internalCount - 3} internal frames hidden] ...`);
        }
        return relevant.join('\n');
    }
    compressError(content) {
        return content
            .replace(/at .*node_modules.*\n/g, '')
            .replace(/at .*internal\/.*\n/g, '')
            .trim();
    }
    estimateTokens(text) {
        return Math.ceil(text.length / 4);
    }
}
//# sourceMappingURL=index.js.map