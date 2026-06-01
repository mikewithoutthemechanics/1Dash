import { NextRequest, NextResponse } from 'next/server';
import { integrations } from '@/lib/integrations/registry';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  try {
    const provider = (await context.params).provider;
    const client = integrations.get(provider);

    if (!client) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
    }

    const token = request.headers.get('x-integration-token') || request.cookies.get(`integration_${provider}`)?.value || '';

    if (!token) {
      return NextResponse.json({ connected: false });
    }

    const status = await client.getStatus(token);
    return NextResponse.json(status);
  } catch {
    return NextResponse.json({ connected: false });
  }
}
