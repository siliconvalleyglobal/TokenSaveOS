/**
 * Prompt Versioning & A/B Testing
 * Version-control prompts and compare token usage across versions
 */

export interface PromptVersion {
  id: string;
  name: string;
  content: string;
  version: number;
  createdAt: number;
  metadata: Record<string, unknown>;
}

export interface ABTestResult {
  versionA: string;
  versionB: string;
  winner: 'A' | 'B' | 'tie';
  aTokens: number;
  bTokens: number;
  aCostUSD: number;
  bCostUSD: number;
  improvementPercent: number;
}

export class PromptVersioning {
  private versions: Map<string, PromptVersion[]> = new Map();
  private currentVersions: Map<string, string> = new Map();

  public createVersion(name: string, content: string, metadata: Record<string, unknown> = {}): PromptVersion {
    const existing = this.versions.get(name) || [];
    const version = existing.length + 1;

    const promptVersion: PromptVersion = {
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

  public getVersion(name: string, versionId?: string): PromptVersion | undefined {
    const existing = this.versions.get(name) || [];
    if (versionId) {
      return existing.find((v) => v.id === versionId);
    }
    return existing[existing.length - 1];
  }

  public listVersions(name: string): PromptVersion[] {
    return this.versions.get(name) || [];
  }

  public async runABTest(
    name: string,
    runnerA: (prompt: string) => Promise<string>,
    runnerB: (prompt: string) => Promise<string>,
    tokenEstimator: (text: string) => number,
    costCalculator: (tokens: number) => number
  ): Promise<ABTestResult> {
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

    let winner: 'A' | 'B' | 'tie' = 'tie';
    if (bCostUSD < aCostUSD * 0.9) winner = 'B';
    else if (aCostUSD < bCostUSD * 0.9) winner = 'A';

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

  public rollback(name: string, versionId: string): void {
    const existing = this.versions.get(name) || [];
    const target = existing.find((v) => v.id === versionId);
    if (target) {
      this.currentVersions.set(name, versionId);
    }
  }
}
