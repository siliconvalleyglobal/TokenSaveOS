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
export declare class BudgetCircuitBreaker {
    private thresholds;
    private states;
    private config;
    private listeners;
    constructor(config?: Partial<CircuitBreakerConfig>);
    setThreshold(threshold: BudgetThreshold): void;
    recordSpend(userId: string, amountUSD: number, projectId?: string): {
        allowed: boolean;
        reason?: string;
    };
    getState(userId: string, projectId?: string): BudgetState | undefined;
    resetRun(userId: string, projectId?: string): void;
    onStateChange(listener: (state: BudgetState) => void): () => void;
    private trip;
    private notifyListeners;
    private getKey;
    private ensureState;
}
//# sourceMappingURL=index.d.ts.map