/**
 * Budget Circuit Breaker
 * Enforces hard budget limits to prevent runaway agent costs
 */

export interface BudgetThreshold {
  userId: string;
  projectId?: string;
  dailyLimitUSD: number;
  hourlyLimitUSD: number;
  perRunLimitUSD: number;
  alertThresholdPercent: number;
}

export interface BudgetState {
  userId: string;
  projectId?: string;
  dailySpendUSD: number;
  hourlySpendUSD: number;
  currentRunSpendUSD: number;
  lastResetDate: string;
  lastResetHour: string;
  isTripped: boolean;
  tripReason?: string;
}

export interface CircuitBreakerConfig {
  checkIntervalMs: number;
  cooldownMs: number;
  enabled: boolean;
}

export class BudgetCircuitBreaker {
  private thresholds: Map<string, BudgetThreshold> = new Map();
  private states: Map<string, BudgetState> = new Map();
  private config: CircuitBreakerConfig;
  private listeners: Set<(state: BudgetState) => void> = new Set();

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      checkIntervalMs: config.checkIntervalMs ?? 1000,
      cooldownMs: config.cooldownMs ?? 60000,
      enabled: config.enabled ?? true,
    };
  }

  public setThreshold(threshold: BudgetThreshold): void {
    const key = this.getKey(threshold.userId, threshold.projectId);
    this.thresholds.set(key, threshold);
    this.ensureState(key, threshold);
  }

  public recordSpend(userId: string, amountUSD: number, projectId?: string): { allowed: boolean; reason?: string } {
    if (!this.config.enabled) {
      return { allowed: true };
    }

    const key = this.getKey(userId, projectId);
    const threshold = this.thresholds.get(key);
    if (!threshold) {
      return { allowed: true };
    }

    const state = this.ensureState(key, threshold);

    if (state.isTripped) {
      if (Date.now() - new Date(state.lastResetDate).getTime() < this.config.cooldownMs) {
        return { allowed: false, reason: state.tripReason };
      }
      state.isTripped = false;
      state.tripReason = undefined;
    }

    state.dailySpendUSD += amountUSD;
    state.hourlySpendUSD += amountUSD;
    state.currentRunSpendUSD += amountUSD;

    if (state.currentRunSpendUSD >= threshold.perRunLimitUSD) {
      this.trip(key, `Per-run budget exceeded: $${state.currentRunSpendUSD.toFixed(2)} >= $${threshold.perRunLimitUSD}`);
      return { allowed: false, reason: state.tripReason };
    }

    if (state.dailySpendUSD >= threshold.dailyLimitUSD) {
      this.trip(key, `Daily budget exceeded: $${state.dailySpendUSD.toFixed(2)} >= $${threshold.dailyLimitUSD}`);
      return { allowed: false, reason: state.tripReason };
    }

    if (state.hourlySpendUSD >= threshold.hourlyLimitUSD) {
      this.trip(key, `Hourly budget exceeded: $${state.hourlySpendUSD.toFixed(2)} >= $${threshold.hourlyLimitUSD}`);
      return { allowed: false, reason: state.tripReason };
    }

    const alertThreshold = (threshold.dailyLimitUSD * threshold.alertThresholdPercent) / 100;
    if (state.dailySpendUSD >= alertThreshold) {
      this.notifyListeners(state);
    }

    return { allowed: true };
  }

  public getState(userId: string, projectId?: string): BudgetState | undefined {
    const key = this.getKey(userId, projectId);
    return this.states.get(key);
  }

  public resetRun(userId: string, projectId?: string): void {
    const key = this.getKey(userId, projectId);
    const state = this.states.get(key);
    if (state) {
      state.currentRunSpendUSD = 0;
    }
  }

  public onStateChange(listener: (state: BudgetState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private trip(key: string, reason: string): void {
    const state = this.states.get(key);
    if (state) {
      state.isTripped = true;
      state.tripReason = reason;
      this.notifyListeners(state);
    }
  }

  private notifyListeners(state: BudgetState): void {
    for (const listener of this.listeners) {
      listener(state);
    }
  }

  private getKey(userId: string, projectId?: string): string {
    return projectId ? `${userId}:${projectId}` : userId;
  }

  private ensureState(key: string, threshold: BudgetThreshold): BudgetState {
    if (!this.states.has(key)) {
      const today = new Date().toISOString().split('T')[0];
      const currentHour = new Date().toISOString().slice(0, 13);
      this.states.set(key, {
        userId: threshold.userId,
        projectId: threshold.projectId,
        dailySpendUSD: 0,
        hourlySpendUSD: 0,
        currentRunSpendUSD: 0,
        lastResetDate: today,
        lastResetHour: currentHour,
        isTripped: false,
      });
    }
    return this.states.get(key)!;
  }
}
