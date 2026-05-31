import { BaseConnector, ConnectorConfig, IntegrationStatus } from './base.connector';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  createdAt: string;
  reference: string;
}

export class PayFastConnector extends BaseConnector {
  constructor(config: ConnectorConfig) {
    super(config);
  }

  async getStatus(): Promise<IntegrationStatus> {
    try {
      const test = await this.request<any>('GET', '/api/v1/payments?limit=1');
      return {
        id: 'payfast',
        name: 'PayFast Payments',
        type: 'payment',
        status: 'CONNECTED',
        lastSync: new Date().toISOString(),
        metrics: { totalTransactions: test.total || 0 },
        config: this.config,
      };
    } catch {
      return {
        id: 'payfast',
        name: 'PayFast Payments',
        type: 'payment',
        status: 'ERROR',
        config: this.config,
      };
    }
  }

  async sync(): Promise<any> {
    logger.info('Syncing PayFast transactions...');
    const payments = await this.getPayments(100);
    await this.cacheSet('payfast:last-sync', payments, 300);
    return payments;
  }

  async getPayments(limit: number = 20): Promise<Payment[]> {
    const cached = await this.cacheGet<Payment[]>('payfast:recent');
    if (cached) return cached;

    const payments = await this.request<Payment[]>('GET', '/api/v1/payments', { limit });
    await this.cacheSet('payfast:recent', payments, 300);
    return payments;
  }

  async getTransaction(transactionId: string): Promise<Payment> {
    return this.request<Payment>('GET', `/api/v1/payments/${transactionId}`);
  }

  async verifyTransaction(pfOutput: string): Promise<boolean> {
    const response = await this.request<any>('POST', '/api/v1/payments/verify', { pfOutput });
    return response.status === 'VERIFIED';
  }
}