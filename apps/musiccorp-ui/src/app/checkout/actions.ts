'use server';

import { createOrder, submitPayment } from '@/lib/musiccorp-api';
import type { OrderSubmission, PaymentSubmission } from '@/lib/types';

export async function submitCheckout(input: OrderSubmission) {
  return createOrder(input);
}

export async function retryPayment(input: PaymentSubmission) {
  return submitPayment(input);
}
