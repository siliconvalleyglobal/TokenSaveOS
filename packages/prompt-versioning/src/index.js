/**
 * Prompt Versioning & A/B Testing
 * Version-control prompts and compare token usage across versions
 */
export class PromptVersioning {
    versions = new Map();
    currentVersions = new Map();
    createVersion(name, content, metadata = {}) {
        const existing = this.versions.get(name) || [];
        const version = existing.length + 1;
        const promptVersion = {
            id: `${name}-v${version}`,
            name,
            content,
            version,
            createdAt: Date.now(),
            metadata,
        };
        existing.push(promptVersion);
        this.versions.set(name, existing);
        this.currentVersions.set(name, promptVersion.id);
        return promptVersion;
    }
    getVersion(name, versionId) {
        const existing = this.versions.get(name) || [];
        if (versionId) {
            return existing.find((v) => v.id === versionId);
        }
        return existing[existing.length - 1];
    }
    listVersions(name) {
        return this.versions.get(name) || [];
    }
    async runABTest(name, runnerA, runnerB, tokenEstimator, costCalculator) {
        const versionA = this.getVersion(name);
        const versionB = this.getVersion(name, this.currentVersions.get(`${name}-b`));
        if (!versionA || !versionB) {
            throw new Error('Both versions required for A/B test');
        }
        const [resultA, resultB] = await Promise.all([
            runnerA(versionA.content),
            runnerB(versionB.content),
        ]);
        const aTokens = tokenEstimator(resultA);
        const bTokens = tokenEstimator(resultB);
        const aCostUSD = costCalculator(aTokens);
        const bCostUSD = costCalculator(bTokens);
        const improvementPercent = aCostUSD > 0 ? ((aCostUSD - bCostUSD) / aCostUSD) * 100 : 0;
        let winner = 'tie';
        if (bCostUSD < aCostUSD * 0.9)
            winner = 'B';
        else if (aCostUSD < bCostUSD * 0.9)
            winner = 'A';
        return {
            versionA: versionA.id,
            versionB: versionB.id,
            winner,
            aTokens,
            bTokens,
            aCostUSD,
            bCostUSD,
            improvementPercent,
        };
    }
    rollback(name, versionId) {
        const existing = this.versions.get(name) || [];
        const target = existing.find((v) => v.id === versionId);
        if (target) {
            this.currentVersions.set(name, versionId);
        }
    }
}
//# sourceMappingURL=index.js.map