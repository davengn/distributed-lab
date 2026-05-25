import { NextResponse } from 'next/server';
import { submitPayment } from '@/lib/musiccorp-api';
import type { PaymentSubmission } from '@/lib/types';

export async function POST(request: Request) {
  const body = (await request.json()) as PaymentSubmission;
  return NextResponse.json(await submitPayment(body));
}
