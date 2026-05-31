import { logger } from '../utils/logger';
import { BaseConnector, IntegrationStatus } from '../integrations/base.connector';
import { CacheService } from './cache.service';

export class DataAggregatorService {
  private static connectors: Map<string, BaseConnector> = new Map();
  private static cache: CacheService = CacheService.getInstance();

  static registerConnector(id: string, connector: BaseConnector): void {
    this.connectors.set(id, connector);
    logger.info(`Registered connector: ${id}`);
  }

  static getConnector(id: string): BaseConnector {
    const connector = this.connectors.get(id);
    if (!connector) {
      throw new Error(`Connector not found: ${id}`);
    }
    return connector;
  }

  static async getAllSystems(): Promise<IntegrationStatus[]> {
    const systems: IntegrationStatus[] = [];
    
    for (const [id, connector] of this.connectors) {
      try {
        const status = await connector.getStatus();
        systems.push(status);
      } catch (error: any) {
        systems.push({
          id,
          name: id,
          type: 'unknown',
          status: 'ERROR',
          config: {} as any,
        });
      }
    }
    
    return systems;
  }

  static async getAllMetrics(): Promise<any[]> {
    const allMetrics: any[] = [];
    
    for (const [id, connector] of this.connectors) {
      try {
        const metrics = await connector.getMetrics();
        if (Array.isArray(metrics)) {
          allMetrics.push(...metrics.map((m) => ({ ...m, system: id })));
        } else {
          allMetrics.push({ ...metrics, system: id });
        }
      } catch (error) {
        logger.error(`Failed to get metrics from ${id}:`, error);
      }
    }
    
    return allMetrics;
  }

  static async getSummary(): Promise<any> {
    const systems = await this.getAllSystems();
    const connected = systems.filter((s) => s.status === 'CONNECTED').length;
    
    return {
      totalSystems: systems.length,
      connectedSystems: connected,
      totalMetrics: systems.reduce((sum, s) => sum + (s.metrics.total || 0), 0),
      avgResponseTime: systems.reduce((sum, s) => sum + (s.metrics.avgResponseTime || 0), 0) / systems.length,
      errorRate: (systems.filter((s) => s.status === 'ERROR').length / systems.length) * 100,
    };
  }

  static async syncSystem(systemId: string): Promise<IntegrationStatus> {
    const connector = this.getConnector(systemId);
    await connector.sync();
    return connector.getStatus();
  }

  static async syncAllSystems(): Promise<IntegrationStatus[]> {
    const results: IntegrationStatus[] = [];
    
    for (const [id, connector] of this.connectors) {
      try {
        await connector.sync();
        results.push(await connector.getStatus());
      } catch (error: any) {
        logger.error(`Sync failed for ${id}:`, error.message);
        results.push({
          id,
          name: id,
          type: 'unknown',
          status: 'ERROR',
          config: {} as any,
        });
      }
    }
    
    return results;
  }

  static async updateSystemConfig(id: string, config: any): Promise<IntegrationStatus> {
    // In production, you'd update the database and reinitialize the connector
    const connector = this.getConnector(id);
    // Update logic here
    return connector.getStatus();
  }
}