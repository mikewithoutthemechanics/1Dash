import { BaseConnector, ConnectorConfig, IntegrationStatus } from './base.connector';

export interface VercelDeployment {
  id: string;
  url: string;
  state: string;
  createdAt: string;
  ready?: number | null;
  buildingAt?: number | null;
  inspectorUrl?: string | null;
}

export interface VercelProject {
  id: string;
  name: string;
  framework: string | null;
  createdAt: number;
  updatedAt: number;
  latestDeployments: VercelDeployment[];
}

export class VercelConnector extends BaseConnector {
  constructor(config: ConnectorConfig) {
    super(config);
  }

  async getStatus(): Promise<IntegrationStatus> {
    try {
      const projects = await this.getProjects(10);
      const deployments = projects.flatMap((p) => p.latestDeployments);
      const errors = deployments.filter((d) => d.state === 'ERROR').length;
      const ready = deployments.filter((d) => d.state === 'READY').length;

      return {
        id: 'vercel',
        name: 'Vercel',
        type: 'vercel',
        status: 'CONNECTED',
        lastSync: new Date().toISOString(),
        metrics: {
          projectCount: projects.length,
          deploymentCount: deployments.length,
          readyCount: ready,
          errorCount: errors,
        },
        config: this.config,
      };
    } catch {
      return {
        id: 'vercel',
        name: 'Vercel',
        type: 'vercel',
        status: 'ERROR',
        config: this.config,
      };
    }
  }

  async sync(): Promise<any> {
    return this.getProjects(50);
  }

  async getMetrics(): Promise<any> {
    const projects = await this.getProjects(20);
    const deployments = projects.flatMap((p) => p.latestDeployments);
    const ready = deployments.filter((d) => d.state === 'READY').length;
    const failed = deployments.filter((d) => d.state === 'ERROR').length;

    return {
      category: 'vercel',
      totalProjects: projects.length,
      totalDeployments: deployments.length,
      successRate: deployments.length ? (ready / deployments.length) * 100 : 0,
      failureRate: deployments.length ? (failed / deployments.length) * 100 : 0,
      updatedAt: new Date().toISOString(),
    };
  }

  async getProjects(limit = 20): Promise<VercelProject[]> {
    const cached = await this.cacheGet<VercelProject[]>(`vercel:projects:${limit}`);
    if (cached) return cached;

    if (!this.config.auth?.token) {
      throw new Error('Vercel token missing');
    }

    const data = await this.request<{ projects: VercelProject[] }>(
      'GET',
      '/v9/projects?limit=' + String(limit),
      undefined,
      {
        Authorization: `Bearer ${this.config.auth.token}`,
      }
    );

    await this.cacheSet(`vercel:projects:${limit}`, data.projects, 120);
    return data.projects;
  }

  async getDeployments(projectId: string, limit = 10): Promise<VercelDeployment[]> {
    const key = `vercel:deployments:${projectId}:${limit}`;
    const cached = await this.cacheGet<VercelDeployment[]>(key);
    if (cached) return cached;

    if (!this.config.auth?.token) {
      throw new Error('Vercel token missing');
    }

    const data = await this.request<{ deployments: VercelDeployment[] }>(
      'GET',
      '/v6/deployments?projectId=' + projectId + '&limit=' + String(limit),
      undefined,
      {
        Authorization: `Bearer ${this.config.auth.token}`,
      }
    );

    await this.cacheSet(key, data.deployments, 120);
    return data.deployments;
  }
}
