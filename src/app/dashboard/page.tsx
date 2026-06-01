'use client';

import { useMemo, useState } from 'react';

interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  updatedAt: string;
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: string;
  htmlUrl: string;
  createdAt: string;
}

interface VercelProject {
  id: string;
  name: string;
  framework: string | null;
  updatedAt: string;
  latestDeployments: Array<{ id: string; url: string; state: string; createdAt: string }>;
}

function loadTokens() {
  if (typeof window === 'undefined') return { github: '', vercel: '' };
  try {
    const stored = localStorage.getItem('dashboard-tokens');
    return stored ? JSON.parse(stored) : { github: '', vercel: '' };
  } catch {
    return { github: '', vercel: '' };
  }
}

export default function DashboardPage() {
  const [tokens, setTokens] = useState(loadTokens);
  const [status, setStatus] = useState('Ready');
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [githubIssues, setGithubIssues] = useState<GitHubIssue[]>([]);
  const [vercelProjects, setVercelProjects] = useState<VercelProject[]>([]);

  const hasTokens = useMemo(
    () => Boolean(tokens.github || tokens.vercel),
    [tokens]
  );

  const githubStars = useMemo(
    () => githubRepos.reduce((sum, repo) => sum + repo.stars, 0),
    [githubRepos]
  );

  function updateToken(provider: 'github' | 'vercel', value: string) {
    const next = { ...tokens, [provider]: value };
    setTokens(next);
    localStorage.setItem('dashboard-tokens', JSON.stringify(next));
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Unified Dashboard</h1>
            <p className="text-gray-400 text-sm">
              {hasTokens ? 'Connected integrations appear below.' : 'Add tokens to start pulling data from supported services.'}
            </p>
          </div>

          <DashboardStatus status={status} tokens={tokens} onRefresh={refresh({ setStatus, tokens, setGithubRepos, setGithubIssues, setVercelProjects })} />
        </header>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="GitHub Repositories" description="Stars and forks across repos">
            <InputRow label="GitHub token" value={tokens.github} onChange={(value) => updateToken('github', value)} />
            <MetricsRow
              items={[
                { label: 'Repos', value: String(githubRepos.length) },
                { label: 'Stars', value: String(githubStars) },
                { label: 'Open issues', value: String(githubIssues.length) },
              ]}
            />
            <ul className="mt-4 space-y-2 max-h-72 overflow-y-auto text-sm text-gray-200">
              {githubRepos.map((repo) => (
                <li key={repo.id} className="rounded-md border border-gray-800 p-3">
                  <a href={repo.htmlUrl} target="_blank" rel="noreferrer" className="font-medium text-white hover:underline">
                    {repo.fullName}
                  </a>
                  <p className="text-xs text-gray-400">{repo.description || 'No description'}</p>
                  <div className="mt-1 text-xs text-gray-300">
                    <span>⭐ {repo.stars}</span>
                    <span className="ml-3">⑂ {repo.forks}</span>
                    <span className="ml-3">⚠ {repo.openIssues}</span>
                  </div>
                </li>
              ))}
              {githubRepos.length === 0 && <EmptyState message="No repositories loaded yet." />}
            </ul>
          </Card>

          <Card title="Vercel Projects" description="Deployments and project health">
            <InputRow label="Vercel token" value={tokens.vercel} onChange={(value) => updateToken('vercel', value)} />
            <MetricsRow
              items={[
                { label: 'Projects', value: String(vercelProjects.length) },
                {
                  label: 'Ready',
                  value: String(vercelProjects.reduce((count, p) => count + p.latestDeployments.filter((dep) => dep.state === 'READY').length || 0, 0)),
                },
                {
                  label: 'Failed',
                  value: String(vercelProjects.reduce((count, p) => count + p.latestDeployments.filter((dep) => dep.state === 'ERROR').length || 0, 0)),
                },
              ]}
            />
            <ul className="mt-4 space-y-2 max-h-72 overflow-y-auto text-sm text-gray-200">
              {vercelProjects.map((project) => (
                <li key={project.id} className="rounded-md border border-gray-800 p-3">
                  <p className="font-medium text-white">{project.name}</p>
                  <p className="text-xs text-gray-400">{project.framework || 'unknown'}</p>
                  <ul className="mt-2 space-y-1">
                    {(project.latestDeployments || []).slice(0, 3).map((deployment) => (
                      <li key={deployment.id || deployment.url} className="flex items-center justify-between text-xs text-gray-300">
                        <a href={deployment.url} target="_blank" rel="noreferrer" className="hover:underline">
                          {deployment.url}
                        </a>
                        <span className="ml-2">{deployment.state}</span>
                      </li>
                    ))}
                    {((project.latestDeployments || []).length === 0) && <li className="text-xs text-gray-500">No recent deployments</li>}
                  </ul>
                </li>
              ))}
              {vercelProjects.length === 0 && <EmptyState message="No projects loaded yet." />}
            </ul>
          </Card>
        </section>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="GitHub Issues" description="Open pull requests and issues">
            <ul className="max-h-80 overflow-y-auto space-y-2 text-sm text-gray-200">
              {githubIssues.map((issue) => (
                <li key={issue.id} className="rounded-md border border-gray-800 p-3">
                  <a href={issue.htmlUrl} target="_blank" rel="noreferrer" className="font-medium text-white hover:underline">
                    {issue.title}
                  </a>
                  <p className="text-xs text-gray-400">#{issue.number} · {issue.state.toLowerCase()}</p>
                </li>
              ))}
              {githubIssues.length === 0 && <EmptyState message="No open issues or PRs." />}
            </ul>
          </Card>

          <Card title="More integrations" description="Coming soon for Slack, Linear, and AWS.">
            <EmptyState message="Add the connector after wiring the API routes." />
          </Card>
        </section>
      </div>
    </main>
  );
}

function refresh({ setStatus, tokens, setGithubRepos, setGithubIssues, setVercelProjects }: {
  setStatus: (status: string) => void,
  tokens: { github: string; vercel: string },
  setGithubRepos: (repos: GitHubRepo[]) => void,
  setGithubIssues: (issues: GitHubIssue[]) => void,
  setVercelProjects: (projects: VercelProject[]) => void
}) {
  return async function refreshInner() {
    setStatus('Refreshing...');
    try {
      const results = await Promise.allSettled([
        tokens.github
          ? fetch(`/api/dashboard/github?token=${encodeURIComponent(tokens.github)}&limit=20`).then((r) => r.json())
          : Promise.resolve(null),
        tokens.github
          ? fetch(`/api/dashboard/github?token=${encodeURIComponent(tokens.github)}&type=issues&limit=15`).then((r) => r.json())
          : Promise.resolve(null),
        tokens.vercel
          ? fetch(`/api/dashboard/vercel?token=${encodeURIComponent(tokens.vercel)}&limit=20`).then((r) => r.json())
          : Promise.resolve(null),
      ]);

      const reposResult = results[0];
      const issuesResult = results[1];
      const vercelResult = results[2];

      type ApiResponse = { items?: GitHubRepo[] } | { items?: GitHubIssue[] } | { items?: VercelProject[] };

      if (reposResult.status === 'fulfilled' && Array.isArray((reposResult.value as ApiResponse).items)) {
        setGithubRepos((reposResult.value as ApiResponse).items as GitHubRepo[]);
      }
      if (issuesResult.status === 'fulfilled' && Array.isArray((issuesResult.value as ApiResponse).items)) {
        setGithubIssues((issuesResult.value as ApiResponse).items as GitHubIssue[]);
      }
      if (vercelResult.status === 'fulfilled' && Array.isArray((vercelResult.value as ApiResponse).items)) {
        setVercelProjects((vercelResult.value as ApiResponse).items as VercelProject[]);
      }

      setStatus(results.some((r) => r.status === 'rejected') ? 'Partial refresh' : 'Updated');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed');
    }
  };
}

function DashboardStatus({ status, tokens, onRefresh }: { status: string; tokens: { github: string; vercel: string }; onRefresh: () => void }) {
  const hasTokens = Boolean(tokens.github || tokens.vercel);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400">{status}</span>
      <button
        onClick={onRefresh}
        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-gray-200"
      >
        Refresh
      </button>
    </div>
  );
}

function Card({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-950/70 p-5">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      {children}
    </div>
  );
}

function InputRow({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-200">
      <span className="text-xs text-gray-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Paste your ${label.toLowerCase()} token`}
        className="rounded-md border border-gray-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
    </label>
  );
}

function MetricsRow({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-gray-800 bg-neutral-900 p-3">
          <p className="text-gray-400">{item.label}</p>
          <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="rounded-md border border-dashed border-gray-800 p-3 text-xs text-gray-500">{message}</p>;
}
