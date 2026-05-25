'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderConfirmation } from '@/components/OrderConfirmation';
import {
  clearCheckoutResult,
  readCheckoutResult,
  saveCheckoutResult,
} from '@/lib/checkout-session';
import { useCart } from '@/lib/cart-store';
import { createActionId, recordStorefrontEvent, toEventStatus } from '@/lib/storefront-events';
import type { BackendResult, CheckoutResult, PaymentResult } from '@/lib/types';

export default function ConfirmationPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    setResult(readCheckoutResult());
  }, []);

  async function retryPayment() {
    if (!result?.paymentRequest) {
      return;
    }

    setRetrying(true);
    const startedAt = performance.now();
    const retryRequest = {
      ...result.paymentRequest,
      clientActionId: createActionId('payment-retry'),
    };

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(retryRequest),
      });
      const paymentResult = (await response.json()) as BackendResult<PaymentResult>;
      recordStorefrontEvent({
        clientActionId: paymentResult.actionId,
        label: 'Retry payment',
        status: toEventStatus(paymentResult.ok, paymentResult.ok ? undefined : paymentResult.category),
        durationMs: paymentResult.durationMs || Math.round(performance.now() - startedAt),
        timestamp: new Date().toISOString(),
        businessSummary: paymentResult.ok ? 'Payment retry succeeded' : paymentResult.message,
      });

      const nextResult: CheckoutResult = paymentResult.ok
        ? {
            status: 'confirmed',
            order: result.order,
            payment: paymentResult.data,
            message: 'Your MusicCorp payment is confirmed.',
            nextAction: 'start_new_cart',
          }
        : {
            ...result,
            message: paymentResult.message,
            nextAction: 'retry_payment',
          };
      saveCheckoutResult(nextResult);
      setResult(nextResult);
    } finally {
      setRetrying(false);
    }
  }

  function startNewCart() {
    clearCart();
    clearCheckoutResult();
    router.push('/');
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <OrderConfirmation
        result={result}
        retrying={retrying}
        onRetryPayment={() => void retryPayment()}
        onStartNewCart={startNewCart}
        onReturnToCatalog={() => router.push('/')}
      />
    </main>
  );
}
