'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  readCheckoutDraft,
  saveCheckoutDraft,
  saveCheckoutResult,
} from '@/lib/checkout-session';
import { canCheckout as cartCanCheckout } from '@/lib/cart-store';
import { createActionId, recordStorefrontEvent, toEventStatus } from '@/lib/storefront-events';
import type {
  BackendResult,
  Cart,
  CheckoutDraft,
  CheckoutResult,
  OrderResult,
  PaymentMethod,
  PaymentResult,
  PaymentSubmission,
} from '@/lib/types';

const paymentMethods: Array<{ value: PaymentMethod; label: string }> = [
  { value: 'CREDIT_CARD', label: 'Credit card' },
  { value: 'PAYPAL', label: 'PayPal' },
  { value: 'GIFT_CARD', label: 'Gift card' },
];

function validateDraft(cart: Cart, draft: CheckoutDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!cartCanCheckout(cart)) {
    errors.cart = 'Add at least one available album before checkout.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.customerEmail.trim())) {
    errors.customerEmail = 'Enter a valid email address.';
  }
  if (!draft.paymentMethod) {
    errors.paymentMethod = 'Select a payment method.';
  }
  if (!draft.termsAccepted) {
    errors.termsAccepted = 'Confirm that this lab checkout can create backend traffic.';
  }
  return errors;
}

interface CheckoutFormProps {
  cart: Cart;
}

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<CheckoutDraft>(readCheckoutDraft);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    saveCheckoutDraft(draft);
  }, [draft]);

  const errors = useMemo(() => draft.validationErrors ?? {}, [draft.validationErrors]);
  const checkoutReady = cartCanCheckout(cart) && !submitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateDraft(cart, draft);
    if (Object.keys(validationErrors).length > 0) {
      setDraft((current) => ({ ...current, validationErrors }));
      setStatusMessage('Fix the highlighted checkout details.');
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);
    const orderActionId = createActionId('order');
    const orderStartedAt = performance.now();

    try {
      const orderResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientActionId: orderActionId,
          customerEmail: draft.customerEmail.trim(),
          items: cart.items,
          totalAmount: cart.subtotal,
        }),
      });
      const orderResult = (await orderResponse.json()) as BackendResult<OrderResult>;
      recordStorefrontEvent({
        clientActionId: orderResult.actionId,
        label: 'Order submit',
        status: toEventStatus(orderResult.ok, orderResult.ok ? undefined : orderResult.category),
        durationMs: orderResult.durationMs || Math.round(performance.now() - orderStartedAt),
        timestamp: new Date().toISOString(),
        businessSummary: orderResult.ok
          ? `Created order ${orderResult.data.orderId}`
          : orderResult.message,
      });

      if (!orderResult.ok) {
        setStatusMessage(orderResult.message);
        return;
      }

      const paymentActionId = createActionId('payment');
      const paymentRequest: PaymentSubmission = {
        clientActionId: paymentActionId,
        orderId: orderResult.data.orderId,
        amount: cart.subtotal,
        method: draft.paymentMethod,
        idempotencyKey: `checkout-${orderResult.data.orderId}-${Date.now()}`,
      };
      const paymentStartedAt = performance.now();
      const paymentResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRequest),
      });
      const paymentResult = (await paymentResponse.json()) as BackendResult<PaymentResult>;
      recordStorefrontEvent({
        clientActionId: paymentResult.actionId,
        label: 'Payment submit',
        status: toEventStatus(paymentResult.ok, paymentResult.ok ? undefined : paymentResult.category),
        durationMs: paymentResult.durationMs || Math.round(performance.now() - paymentStartedAt),
        timestamp: new Date().toISOString(),
        businessSummary: paymentResult.ok
          ? `Payment ${paymentResult.data.status.toLowerCase()} for order ${orderResult.data.orderId}`
          : paymentResult.message,
      });

      const checkoutResult: CheckoutResult = paymentResult.ok
        ? {
            status: 'confirmed',
            order: orderResult.data,
            payment: paymentResult.data,
            message: 'Your MusicCorp order is confirmed.',
            nextAction: 'start_new_cart',
          }
        : {
            status: 'order_created_payment_failed',
            order: orderResult.data,
            paymentRequest,
            message: paymentResult.message,
            nextAction: 'retry_payment',
          };

      saveCheckoutResult(checkoutResult);
      router.push('/confirmation');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {statusMessage ? (
        <Alert variant="warning">
          <AlertTitle>Checkout needs attention</AlertTitle>
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      ) : null}
      {errors.cart ? (
        <Alert variant="destructive">
          <AlertTitle>Cart unavailable</AlertTitle>
          <AlertDescription>{errors.cart}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customer-email">Email</Label>
          <Input
            id="customer-email"
            type="email"
            value={draft.customerEmail}
            aria-invalid={Boolean(errors.customerEmail)}
            aria-describedby={errors.customerEmail ? 'customer-email-error' : undefined}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                customerEmail: event.target.value,
                validationErrors: { ...current.validationErrors, customerEmail: '' },
              }))
            }
            placeholder="learner@distributedlab.dev"
          />
          {errors.customerEmail ? (
            <p id="customer-email-error" className="text-sm font-medium text-red-700">
              {errors.customerEmail}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-name">Name</Label>
          <Input
            id="customer-name"
            value={draft.customerName}
            onChange={(event) => setDraft((current) => ({ ...current, customerName: event.target.value }))}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment-method">Payment method</Label>
        <Select
          id="payment-method"
          value={draft.paymentMethod}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              paymentMethod: event.target.value as PaymentMethod,
              validationErrors: { ...current.validationErrors, paymentMethod: '' },
            }))
          }
        >
          {paymentMethods.map((method) => (
            <option value={method.value} key={method.value}>
              {method.label}
            </option>
          ))}
        </Select>
      </div>

      <label className="flex cursor-pointer gap-3 rounded-lg border border-border p-4 text-sm">
        <input
          type="checkbox"
          checked={draft.termsAccepted}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              termsAccepted: event.target.checked,
              validationErrors: { ...current.validationErrors, termsAccepted: '' },
            }))
          }
          className="mt-1 h-4 w-4 rounded border-input accent-indigo-700"
        />
        <span>
          Use this checkout to create MusicCorp backend activity.
          {errors.termsAccepted ? (
            <span className="mt-1 block font-medium text-red-700">{errors.termsAccepted}</span>
          ) : null}
        </span>
      </label>

      <Button type="submit" variant="accent" className="w-full" disabled={!checkoutReady}>
        {submitting ? 'Submitting checkout...' : 'Place order and pay'}
      </Button>
    </form>
  );
}
