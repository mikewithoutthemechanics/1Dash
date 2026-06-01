import { IntegrationClient, IntegrationRegistry } from './base';
import { GitHubClient, GitHubRepo, GitHubIssue } from './github';
import { VercelClient, VercelProject } from './vercel';

class GitHubIntegration implements IntegrationClient {
  private client = new GitHubClient();
  getMeta() {
    return {
      id: 'github',
      name: 'GitHub',
      description: 'Repositories, issues, and activity',
      authUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      scopes: ['repo', 'read:user', 'read:org'],
      fields: [{ key: 'token', label: 'Personal Access Token', type: 'password' }],
      dataRoute: '/api/integrations/github',
      statusRoute: '/api/integrations/github/status',
      category: 'dev',
    };
  }

  async getStatus(token: string) {
    try {
      const repos = await this.client.getRepos(token, 1);
      return { id: 'github', connected: true, lastSync: new Date().toISOString() };
    } catch (error) {
      return {
        id: 'github',
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async fetchData(token: string, params: Record<string, string | undefined>) {
    const type = params.type || 'repos';
    const limit = Number(params.limit || '20');
    if (type === 'issues') {
      const issues = await this.client.getIssues(token, 'open', limit);
      return issues.map((issue: GitHubIssue) => ({
        id: issue.id,
        type: 'issue',
        title: issue.title,
        state: issue.state,
        url: issue.html_url,
        createdAt: issue.created_at,
      }));
    }
    const repos = await this.client.getRepos(token, limit);
    return repos.map((repo: GitHubRepo) => ({
      id: repo.id,
      type: 'repo',
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
    }));
  }
}

class VercelIntegration implements IntegrationClient {
  private client = new VercelClient();
  getMeta() {
    return {
      id: 'vercel',
      name: 'Vercel',
      description: 'Projects and deployments',
      authUrl: 'https://vercel.com/oauth/authorize',
      tokenUrl: 'https://api.vercel.com/v2/oauth/access_token',
      fields: [{ key: 'token', label: 'Vercel Token', type: 'password' }],
      dataRoute: '/api/integrations/vercel',
      statusRoute: '/api/integrations/vercel/status',
      category: 'infra',
    };
  }

  async getStatus(token: string) {
    try {
      const projects = await this.client.getProjects(token, 1);
      return { id: 'vercel', connected: true, lastSync: new Date().toISOString() };
    } catch (error) {
      return {
        id: 'vercel',
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async fetchData(token: string, params: Record<string, string | undefined>) {
    const projects = await this.client.getProjects(token, 20);
    return projects.map((project: VercelProject) => ({
      id: project.id,
      type: 'project',
      name: project.name,
      framework: project.framework,
      updatedAt: new Date(project.updatedAt).toISOString(),
      deployments: (project.latestDeployments || []).map((deployment) => ({
        id: deployment.id,
        url: deployment.url,
        state: deployment.state,
        createdAt: deployment.createdAt,
      })),
    }));
  }
}

IntegrationRegistry.register(new GitHubIntegration());
IntegrationRegistry.register(new VercelIntegration());

export const integrations = IntegrationRegistry;
