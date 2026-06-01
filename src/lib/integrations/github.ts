export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  pull_request?: {
    url: string;
    html_url: string;
    merged: boolean;
    title: string;
  };
}

export class GitHubClient {
  private readonly baseUrl = 'https://api.github.com';
  private cache = new Map<string, { data: unknown; expires: number }>();

  async getRepos(token: string, limit = 20): Promise<GitHubRepo[]> {
    const key = `github:repos:${token.slice(0, 8)}:${limit}`;
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) return cached.data as GitHubRepo[];

    const res = await fetch(`${this.baseUrl}/user/repos?sort=updated&per_page=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      next: { revalidate: 120 },
    });

    if (!res.ok) throw new Error(`GitHub error: ${res.status}`);
    const repos = (await res.json()) as GitHubRepo[];

    this.cache.set(key, { data: repos, expires: Date.now() + 120_000 });
    return repos;
  }

  async getIssues(token: string, state = 'open', limit = 20): Promise<GitHubIssue[]> {
    const key = `github:issues:${token.slice(0, 8)}:${state}:${limit}`;
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) return cached.data as GitHubIssue[];

    const res = await fetch(
      `${this.baseUrl}/issues?state=${state}&per_page=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        next: { revalidate: 120 },
      }
    );

    if (!res.ok) throw new Error(`GitHub error: ${res.status}`);
    const issues = (await res.json()) as GitHubIssue[];

    this.cache.set(key, { data: issues, expires: Date.now() + 120_000 });
    return issues;
  }
}
