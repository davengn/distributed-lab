import { NextResponse } from 'next/server';
import { getCatalogItem } from '@/lib/musiccorp-api';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return NextResponse.json(await getCatalogItem(id));
}
