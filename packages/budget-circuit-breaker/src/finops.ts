/**
 * Enterprise FinOps Real-Time Budgeting & Webhook Alerting
 * Multi-dimensional cost allocation and velocity alert dispatching.
 */

export interface FinOpsAllocationTag {
  tenantId: string;
  departmentId?: string;
  projectId?: string;
  userId?: string;
  agentId?: string;
}

export interface FinOpsAlertWebhook {
  url: string;
  channel: 'slack' | 'discord' | 'custom_webhook';
  minSeverity: 'info' | 'warning' | 'critical';
}

export interface FinOpsSpendRecord {
  tag: FinOpsAllocationTag;
  costUSD: number;
  tokens: number;
  model: string;
  timestamp: number;
}

export class FinOpsBudgetEngine {
  private records: FinOpsSpendRecord[] = [];
  private webhooks: FinOpsAlertWebhook[] = [];
  private departmentLimitsUSD: Map<string, number> = new Map();

  constructor() {}

  public registerWebhook(webhook: FinOpsAlertWebhook): void {
    this.webhooks.push(webhook);
  }

  public setDepartmentLimit(departmentId: string, limitUSD: number): void {
    this.departmentLimitsUSD.set(departmentId, limitUSD);
  }

  public recordSpend(record: FinOpsSpendRecord): { allowed: boolean; action: 'allow' | 'warn' | 'block'; message?: string } {
    this.records.push(record);

    const dept = record.tag.departmentId;
    if (dept && this.departmentLimitsUSD.has(dept)) {
      const limit = this.departmentLimitsUSD.get(dept)!;
      const currentSpend = this.getDepartmentSpend(dept);

      if (currentSpend >= limit) {
        this.dispatchAlert('critical', `Department ${dept} budget exceeded ($${currentSpend.toFixed(2)} >= $${limit.toFixed(2)})`);
        return { allowed: false, action: 'block', message: `Budget limit for department ${dept} reached.` };
      } else if (currentSpend >= limit * 0.8) {
        this.dispatchAlert('warning', `Department ${dept} has reached 80% of budget allocation.`);
        return { allowed: true, action: 'warn', message: `Approaching budget cap for ${dept}.` };
      }
    }

    return { allowed: true, action: 'allow' };
  }

  public getDepartmentSpend(departmentId: string): number {
    return this.records
      .filter((r) => r.tag.departmentId === departmentId)
      .reduce((sum, r) => sum + r.costUSD, 0);
  }

  public getTenantSpend(tenantId: string): number {
    return this.records
      .filter((r) => r.tag.tenantId === tenantId)
      .reduce((sum, r) => sum + r.costUSD, 0);
  }

  private dispatchAlert(severity: 'info' | 'warning' | 'critical', message: string): void {
    for (const webhook of this.webhooks) {
      if (severity === 'critical' || webhook.minSeverity === severity || webhook.minSeverity === 'info') {
        // Send simulated async notification payload
        if (typeof globalThis.fetch === 'function') {
          globalThis
            .fetch(webhook.url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: `[TokenSaveOS FinOps Alert - ${severity.toUpperCase()}] ${message}`,
                timestamp: Date.now(),
              }),
            })
            .catch(() => {
              // Silently ignore unreachable alert endpoints in sandbox
            });
        }
      }
    }
  }
}
