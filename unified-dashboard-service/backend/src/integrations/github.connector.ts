import { BaseConnector, ConnectorConfig, IntegrationStatus } from './base.connector';

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  updatedAt: string;
  pushedAt: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: string;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  pullRequest?: {
    url: string;
    htmlUrl: string;
    merged: boolean;
    title: string;
  };
}

export class GitHubConnector extends BaseConnector {
  constructor(config: ConnectorConfig) {
    super(config);
  }

  async getStatus(): Promise<IntegrationStatus> {
    try {
      const repos = await this.getRepos(10);
      return {
        id: 'github',
        name: 'GitHub',
        type: 'github',
        status: 'CONNECTED',
        lastSync: new Date().toISOString(),
        metrics: {
          totalRepos: repos.length,
          totalStars: repos.reduce((sum, r) => sum + r.stargazersCount, 0),
          totalForks: repos.reduce((sum, r) => sum + r.forksCount, 0),
          openIssues: repos.reduce((sum, r) => sum + r.openIssuesCount, 0),
        },
        config: this.config,
      };
    } catch {
      return {
        id: 'github',
        name: 'GitHub',
        type: 'github',
        status: 'ERROR',
        config: this.config,
      };
    }
  }

  async sync(): Promise<any> {
    return this.getRepos(50);
  }

  async getMetrics(): Promise<any> {
    const repos = await this.getRepos(20);
    return {
      category: 'github',
      totalStars: repos.reduce((sum, r) => sum + r.stargazersCount, 0),
      totalForks: repos.reduce((sum, r) => sum + r.forksCount, 0),
      avgStarsPerRepo: repos.length
        ? repos.reduce((sum, r) => sum + r.stargazersCount, 0) / repos.length
        : 0,
      repoCount: repos.length,
      updatedAt: new Date().toISOString(),
    };
  }

  async getRepos(limit = 20): Promise<GitHubRepo[]> {
    const cached = await this.cacheGet<GitHubRepo[]>(`github:repos:${limit}`);
    if (cached) return cached;

    if (!this.config.auth?.token) {
      throw new Error('GitHub token missing');
    }

    const data = await this.request<GitHubRepo[]>(
      'GET',
      '/user/repos?sort=updated&per_page=' + String(limit),
      undefined,
      {
        Authorization: `Bearer ${this.config.auth.token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      }
    );

    await this.cacheSet(`github:repos:${limit}`, data, 120);
    return data;
  }

  async getIssues(state = 'open', limit = 20): Promise<GitHubIssue[]> {
    const cached = await this.cacheGet<GitHubIssue[]>(`github:issues:${state}:${limit}`);
    if (cached) return cached;

    if (!this.config.auth?.token) {
      throw new Error('GitHub token missing');
    }

    const data = await this.request<GitHubIssue[]>(
      'GET',
      '/issues?state=' + state + '&per_page=' + String(limit),
      undefined,
      {
        Authorization: `Bearer ${this.config.auth.token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      }
    );

    await this.cacheSet(`github:issues:${state}:${limit}`, data, 120);
    return data;
  }
}
