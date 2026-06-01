import { NextResponse } from 'next/server';
import { integrations } from '@/lib/integrations/registry';

export async function GET() {
  const list = integrations.list();
  return NextResponse.json({ integrations: list });
}
