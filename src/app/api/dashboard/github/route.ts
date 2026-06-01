import { GitHubClient } from '@/lib/integrations/github';

const github = new GitHubClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || process.env.GITHUB_TOKEN || '';
    const type = searchParams.get('type') || 'repos';
    const limit = Number(searchParams.get('limit') || '20');

    if (!token) {
      return Response.json({ error: 'Missing GitHub token' }, { status: 400 });
    }

    if (type === 'issues') {
      const issues = await github.getIssues(token, 'open', limit);
      return Response.json(
        issues.map((issue) => ({
          id: issue.id,
          number: issue.number,
          title: issue.title,
          state: issue.state,
          url: issue.html_url,
          createdAt: issue.created_at,
          updatedAt: issue.updated_at,
          pullRequest: issue.pull_request,
        }))
      );
    }

    const repos = await github.getRepos(token, limit);
    return Response.json(
      repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        private: repo.private,
        url: repo.html_url,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
      }))
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
