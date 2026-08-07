/**
 * Output Compressor Module
 * Trims and compresses LLM outputs to reduce token costs
 */
const FILLER_PATTERNS = [
    /\b(I think|I believe|In my opinion|As an AI|It's important to note|It is worth noting|Please note|Keep in mind|Of course|Certainly|Sure thing)\b/gi,
    /\b(Actually|Basically|Essentially|Fundamentally|Obviously|Clearly| Needless to say)\b/gi,
    /\b(I hope this helps|Let me know if|Feel free to|Don't hesitate|Reach out|I'd be happy to)\b/gi,
    /\s{2,}/g,
];
export class OutputCompressor {
    options;
    constructor(options = {}) {
        this.options = {
            maxTokens: options.maxTokens ?? 4000,
            trimTrailingWhitespace: options.trimTrailingWhitespace ?? true,
            removeFiller: options.removeFiller ?? true,
            removeEmojis: options.removeEmojis ?? true,
            compressCodeBlocks: options.compressCodeBlocks ?? true,
            maxCodeBlockLines: options.maxCodeBlockLines ?? 200,
        };
    }
    compress(output, provider = 'anthropic') {
        const originalTokens = this.estimateTokens(output, provider);
        let compressed = output;
        if (this.options.trimTrailingWhitespace) {
            compressed = compressed.trim();
        }
        if (this.options.removeFiller) {
            for (const pattern of FILLER_PATTERNS) {
                compressed = compressed.replace(pattern, '');
            }
        }
        if (this.options.removeEmojis) {
            compressed = compressed.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
        }
        if (this.options.compressCodeBlocks) {
            compressed = this.compressCodeBlocks(compressed);
        }
        compressed = compressed.replace(/\n{3,}/g, '\n\n').trim();
        const compressedTokens = this.estimateTokens(compressed, provider);
        const tokensSaved = originalTokens - compressedTokens;
        const savingsPercent = originalTokens > 0 ? (tokensSaved / originalTokens) * 100 : 0;
        return {
            original: output,
            compressed,
            originalTokens,
            compressedTokens,
            savingsPercent: Math.round(savingsPercent * 100) / 100,
            tokensSaved,
        };
    }
    shouldCompress(output, provider = 'anthropic') {
        const tokens = this.estimateTokens(output, provider);
        return tokens > this.options.maxTokens;
    }
    compressCodeBlocks(text) {
        const codeBlockRegex = /```[\s\S]*?```/g;
        return text.replace(codeBlockRegex, (match) => {
            const lines = match.split('\n');
            if (lines.length > this.options.maxCodeBlockLines) {
                const lang = lines[0].replace('```', '').trim();
                const header = `\`\`\`${lang}`;
                const footer = '```';
                const content = lines.slice(1, -1);
                const keepStart = Math.floor((this.options.maxCodeBlockLines - 2) / 2);
                const keepEnd = Math.ceil((this.options.maxCodeBlockLines - 2) / 2);
                const truncated = [
                    ...content.slice(0, keepStart),
                    `... [${content.length - keepStart - keepEnd} lines truncated] ...`,
                    ...content.slice(-keepEnd),
                ];
                return [header, ...truncated, footer].join('\n');
            }
            return match;
        });
    }
    estimateTokens(text, provider) {
        const rates = {
            anthropic: 0.25,
            openai: 0.25,
            gemini: 0.25,
        };
        return Math.ceil(text.length * (rates[provider] || 0.25));
    }
}
//# sourceMappingURL=index.js.map