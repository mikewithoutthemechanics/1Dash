export interface VercelProject {
  id: string;
  name: string;
  framework: string | null;
  createdAt: number;
  updatedAt: number;
  latestDeployments: VercelDeployment[];
}

export interface VercelDeployment {
  id: string;
  url: string;
  state: string;
  createdAt: string;
  ready?: number | null;
  buildingAt?: number | null;
  inspectorUrl?: string | null;
}

export class VercelClient {
  private readonly baseUrl = 'https://api.vercel.com';
  private cache = new Map<string, { data: unknown; expires: number }>();

  async getProjects(token: string, limit = 20): Promise<VercelProject[]> {
    const key = `vercel:projects:${token.slice(0, 8)}:${limit}`;
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) return cached.data as VercelProject[];

    const res = await fetch(`${this.baseUrl}/v9/projects?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 120 },
    });

    if (!res.ok) throw new Error(`Vercel error: ${res.status}`);
    const projects = (await res.json()).projects as VercelProject[];

    this.cache.set(key, { data: projects, expires: Date.now() + 120_000 });
    return projects;
  }

  async getDeployments(token: string, projectId: string, limit = 10): Promise<VercelDeployment[]> {
    const key = `vercel:deployments:${token.slice(0, 8)}:${projectId}:${limit}`;
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) return cached.data as VercelDeployment[];

    const res = await fetch(
      `${this.baseUrl}/v6/deployments?projectId=${projectId}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 120 },
      }
    );

    if (!res.ok) throw new Error(`Vercel error: ${res.status}`);
    const deployments = (await res.json()).deployments as VercelDeployment[];

    this.cache.set(key, { data: deployments, expires: Date.now() + 120_000 });
    return deployments;
  }
}
