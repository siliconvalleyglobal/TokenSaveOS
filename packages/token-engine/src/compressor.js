/**
 * Token Optimization & Compression Engine
 */
import { redactSecrets } from '@tokensaveos/core';
import { estimateProviderTokens, PROVIDER_RATES } from './tokenizer.js';
export function compressPrompt(rawText, options = {}) {
    const { stripWhitespace = true, removeComments = true, dedupLines = true, minifyJson = true, aggressivePrune = false, provider = 'anthropic' } = options;
    let text = redactSecrets(rawText || "");
    const originalTokens = estimateProviderTokens(text, provider);
    if (originalTokens === 0) {
        return {
            compressedText: "",
            originalTokens: 0,
            compressedTokens: 0,
            tokensSaved: 0,
            compressionRatio: 0,
            estimatedSavingsUSD: 0
        };
    }
    // 1. Minify JSON blocks
    if (minifyJson) {
        text = text.replace(/```json\s*([\s\S]*?)\s*```/g, (match, jsonStr) => {
            try {
                const parsed = JSON.parse(jsonStr);
                return "```json\n" + JSON.stringify(parsed) + "\n```";
            }
            catch (e) {
                return match;
            }
        });
    }
    // 2. Remove code comments
    if (removeComments) {
        text = text.replace(/\/\*[\s\S]*?\*\//g, "");
        text = text.replace(/(^|\s)#\s+[^\n]*/g, "$1");
    }
    // 3. Deduplicate redundant lines
    if (dedupLines) {
        const lines = text.split("\n");
        const uniqueLines = [];
        let prev = null;
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed !== prev || trimmed === "") {
                uniqueLines.push(line);
                if (trimmed !== "")
                    prev = trimmed;
            }
        }
        text = uniqueLines.join("\n");
    }
    // 4. Strip whitespace
    if (stripWhitespace) {
        text = text.replace(/[ \t]+/g, " ");
        text = text.replace(/\n\s*\n/g, "\n");
        text = text.trim();
    }
    // 5. Aggressive filler removal
    if (aggressivePrune) {
        const fillers = [
            /\bplease\b/gi, /\bkindly\b/gi, /\bas an ai\b/gi,
            /\bas mentioned before\b/gi, /\bfor your information\b/gi,
            /\bin order to\b/gi, /\bat this point in time\b/gi
        ];
        for (const rx of fillers) {
            text = text.replace(rx, "");
        }
        text = text.replace(/  +/g, " ");
    }
    const compressedTokens = estimateProviderTokens(text, provider);
    const tokensSaved = Math.max(0, originalTokens - compressedTokens);
    const compressionRatio = originalTokens > 0 ? parseFloat(((tokensSaved / originalTokens) * 100).toFixed(1)) : 0;
    const rate = PROVIDER_RATES[provider].inputPer1k;
    const estimatedSavingsUSD = parseFloat(((tokensSaved / 1000) * rate).toFixed(5));
    return {
        compressedText: text,
        originalTokens,
        compressedTokens,
        tokensSaved,
        compressionRatio,
        estimatedSavingsUSD
    };
}
