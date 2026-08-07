/**
 * Agent Loop Detector v2
 * Detects and terminates runaway agent loops in real-time
 */
export class LoopDetector {
    history = [];
    signatures = new Map();
    maxHistory;
    loopThreshold;
    consecutiveThreshold;
    constructor(maxHistory = 50, loopThreshold = 0.85, consecutiveThreshold = 5) {
        this.maxHistory = maxHistory;
        this.loopThreshold = loopThreshold;
        this.consecutiveThreshold = consecutiveThreshold;
    }
    recordStep(step) {
        this.history.push(step);
        if (this.history.length > this.maxHistory) {
            this.history = this.history.slice(-this.maxHistory);
        }
        if (this.history.length < this.consecutiveThreshold) {
            return { isLooping: false, confidence: 0, occurrences: 0, recommendation: 'continue' };
        }
        const recent = this.history.slice(-this.consecutiveThreshold);
        const identicalCount = this.countIdenticalSequences(recent);
        if (identicalCount >= this.consecutiveThreshold) {
            const pattern = recent[0];
            return {
                isLooping: true,
                confidence: 1.0,
                pattern,
                occurrences: identicalCount,
                recommendation: 'terminate',
            };
        }
        const fuzzyResult = this.detectFuzzyLoop(recent);
        if (fuzzyResult.isLooping) {
            return {
                isLooping: true,
                confidence: fuzzyResult.similarity,
                pattern: fuzzyResult.pattern,
                occurrences: fuzzyResult.occurrences,
                recommendation: fuzzyResult.similarity > this.loopThreshold ? 'terminate' : 'warn',
            };
        }
        return { isLooping: false, confidence: 0, occurrences: 0, recommendation: 'continue' };
    }
    getLoopPatterns() {
        return Array.from(this.signatures.values()).sort((a, b) => b.occurrences - a.occurrences);
    }
    reset() {
        this.history = [];
        this.signatures.clear();
    }
    countIdenticalSequences(sequence) {
        const first = sequence[0];
        return sequence.filter((s) => s === first).length;
    }
    detectFuzzyLoop(recent) {
        const groups = new Map();
        for (const step of recent) {
            const normalized = this.normalizeStep(step);
            const existing = groups.get(normalized) || [];
            existing.push(step);
            groups.set(normalized, existing);
        }
        for (const [pattern, occurrences] of groups) {
            if (occurrences.length >= this.consecutiveThreshold) {
                const similarity = occurrences.length / recent.length;
                return { isLooping: true, similarity, pattern, occurrences: occurrences.length };
            }
        }
        return { isLooping: false, similarity: 0, pattern: '', occurrences: 0 };
    }
    normalizeStep(step) {
        return step
            .replace(/\d+/g, 'N')
            .replace(/['"`][^'"`]*['"`]/g, 'STRING')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 100);
    }
}
//# sourceMappingURL=index.js.map