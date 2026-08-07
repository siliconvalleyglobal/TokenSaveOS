/**
 * Budget Circuit Breaker
 * Enforces hard budget limits to prevent runaway agent costs
 */
export class BudgetCircuitBreaker {
    thresholds = new Map();
    states = new Map();
    config;
    listeners = new Set();
    constructor(config = {}) {
        this.config = {
            checkIntervalMs: config.checkIntervalMs ?? 1000,
            cooldownMs: config.cooldownMs ?? 60000,
            enabled: config.enabled ?? true,
        };
    }
    setThreshold(threshold) {
        const key = this.getKey(threshold.userId, threshold.projectId);
        this.thresholds.set(key, threshold);
        this.ensureState(key, threshold);
    }
    recordSpend(userId, amountUSD, projectId) {
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
    getState(userId, projectId) {
        const key = this.getKey(userId, projectId);
        return this.states.get(key);
    }
    resetRun(userId, projectId) {
        const key = this.getKey(userId, projectId);
        const state = this.states.get(key);
        if (state) {
            state.currentRunSpendUSD = 0;
        }
    }
    onStateChange(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    trip(key, reason) {
        const state = this.states.get(key);
        if (state) {
            state.isTripped = true;
            state.tripReason = reason;
            this.notifyListeners(state);
        }
    }
    notifyListeners(state) {
        for (const listener of this.listeners) {
            listener(state);
        }
    }
    getKey(userId, projectId) {
        return projectId ? `${userId}:${projectId}` : userId;
    }
    ensureState(key, threshold) {
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
        return this.states.get(key);
    }
}
//# sourceMappingURL=index.js.map