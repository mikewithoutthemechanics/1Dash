import { VercelClient } from '@/lib/integrations/vercel';

const vercel = new VercelClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || process.env.VERCEL_TOKEN || '';
    const type = searchParams.get('type') || 'projects';
    const limit = Number(searchParams.get('limit') || '20');
    const projectId = searchParams.get('projectId') || '';

    if (!token) {
      return Response.json({ error: 'Missing Vercel token' }, { status: 400 });
    }

    if (type === 'deployments' && projectId) {
      const deployments = await vercel.getDeployments(token, projectId, limit);
      return Response.json(
        deployments.map((deployment) => ({
          id: deployment.id,
          url: deployment.url,
          state: deployment.state,
          createdAt: deployment.createdAt,
          ready: deployment.ready ?? null,
          buildingAt: deployment.buildingAt ?? null,
          inspectorUrl: deployment.inspectorUrl ?? null,
        }))
      );
    }

    const projects = await vercel.getProjects(token, limit);
    return Response.json(
      projects.map((project) => ({
        id: project.id,
        name: project.name,
        framework: project.framework,
        createdAt: new Date(project.createdAt).toISOString(),
        updatedAt: new Date(project.updatedAt).toISOString(),
        latestDeployments: project.latestDeployments.map((dep) => ({
          id: dep.id,
          url: dep.url,
          state: dep.state,
          createdAt: dep.createdAt,
          ready: dep.ready ?? null,
          buildingAt: dep.buildingAt ?? null,
          inspectorUrl: dep.inspectorUrl ?? null,
        })),
      }))
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
