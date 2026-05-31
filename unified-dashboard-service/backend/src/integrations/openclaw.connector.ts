import { BaseConnector, ConnectorConfig, IntegrationStatus } from './base.connector';

export interface AIAgentMetrics {
  model: string;
  tokensUsed: number;
  requestsCount: number;
  avgResponseTime: number;
  errorRate: number;
  lastActivity: string;
}

export class OpenClawConnector extends BaseConnector {
  async getStatus(): Promise<IntegrationStatus> {
    try {
      const metrics = await this.getMetrics();
      return {
        id: 'openclaw',
        name: 'OpenClaw AI Agents',
        type: 'ai-agent',
        status: 'CONNECTED',
        lastSync: new Date().toISOString(),
        metrics: {
          activeAgents: metrics.length,
          totalTokens: metrics.reduce((sum, m) => sum + m.tokensUsed, 0),
        },
        config: this.config,
      };
    } catch {
      return {
        id: 'openclaw',
        name: 'OpenClaw AI Agents',
        type: 'ai-agent',
        status: 'ERROR',
        config: this.config,
      };
    }
  }

  async sync(): Promise<any> {
    logger.info('Syncing OpenClaw agent metrics...');
    const metrics = await this.getMetrics();
    await this.cacheSet('openclaw:metrics', metrics, 60);
    return metrics;
  }

  async getMetrics(): Promise<AIAgentMetrics[]> {
    const cached = await this.cacheGet<AIAgentMetrics[]>('openclaw:metrics');
    if (cached) return cached;

    const metrics = await this.request<AIAgentMetrics[]>('GET', '/api/agents/metrics');
    await this.cacheSet('openclaw:metrics', metrics, 60);
    return metrics;
  }

  async executeAgent(agentId: string, input: string): Promise<any> {
    return this.request('POST', `/api/agents/${agentId}/execute`, { input });
  }
}