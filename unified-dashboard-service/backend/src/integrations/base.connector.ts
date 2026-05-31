import axios from 'axios';
import { logger } from '../utils/logger';
import { CacheService } from '../services/cache.service';

export interface ConnectorConfig {
  name: string;
  type: string;
  baseUrl: string;
  auth?: {
    type: 'bearer' | 'api-key' | 'oauth2' | 'basic';
    token?: string;
    key?: string;
    clientId?: string;
    clientSecret?: string;
  };
  headers?: Record<string, string>;
  timeout?: number;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  type: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'SYNCING';
  lastSync?: string;
  metrics: Record<string, any>;
  config: ConnectorConfig;
}

export abstract class BaseConnector {
  protected config: ConnectorConfig;
  protected cache: CacheService;
  protected client: any;

  constructor(config: ConnectorConfig) {
    this.config = config;
    this.cache = CacheService.getInstance();
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: config.headers,
    });

    this.setupAuth();
  }

  protected setupAuth(): void {
    if (!this.config.auth) return;

    switch (this.config.auth.type) {
      case 'bearer':
        this.client.defaults.headers.common['Authorization'] = `Bearer ${this.config.auth.token}`;
        break;
      case 'api-key':
        this.client.defaults.headers.common['X-API-Key'] = this.config.auth.key;
        break;
      case 'basic':
        const auth = Buffer.from(`${this.config.auth.token}`).toString('base64');
        this.client.defaults.headers.common['Authorization'] = `Basic ${auth}`;
        break;
    }
  }

  abstract getStatus(): Promise<IntegrationStatus>;
  abstract sync(): Promise<any>;
  abstract getMetrics(): Promise<any>;

  protected async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const response = await this.client.request({
        method,
        url: endpoint,
        data,
      });
      return response.data as T;
    } catch (error: any) {
      logger.error(`${this.config.name} request failed:`, error.message);
      throw error;
    }
  }

  protected async cacheGet<T>(key: string, ttl: number = 300): Promise<T | null> {
    return this.cache.get(key);
  }

  protected async cacheSet(key: string, value: any, ttl: number = 300): Promise<void> {
    await this.cache.set(key, value, ttl);
  }
}