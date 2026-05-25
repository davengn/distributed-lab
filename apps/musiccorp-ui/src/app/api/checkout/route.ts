import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/musiccorp-api';
import type { OrderSubmission } from '@/lib/types';

export async function POST(request: Request) {
  const body = (await request.json()) as OrderSubmission;
  return NextResponse.json(await createOrder(body));
}
