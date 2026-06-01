import { NextRequest, NextResponse } from 'next/server';
import { integrations } from '@/lib/integrations/registry';

export async function GET(request: NextRequest) {
  try {
    const provider = request.nextParams.provider as string;
    const client = integrations.get(provider);

    if (!client) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
    }

    const token = request.headers.get('x-integration-token') || request.cookies.get(`integration_${provider}`)?.value || '';

    if (!token) {
      return NextResponse.json({ error: 'Not connected' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const params: Record<string, string | undefined> = {
      type: searchParams.get('type') || undefined,
      limit: searchParams.get('limit') || undefined,
      projectId: searchParams.get('projectId') || undefined,
    };

    const data = await client.fetchData(token, params);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch integration data' }, { status: 500 });
  }
}
