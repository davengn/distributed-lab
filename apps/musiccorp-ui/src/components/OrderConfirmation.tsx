'use client';

import { CheckCircle2, CreditCard, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMoney } from '@/lib/money';
import type { CheckoutResult } from '@/lib/types';

interface OrderConfirmationProps {
  result: CheckoutResult | null;
  retrying?: boolean;
  onRetryPayment: () => void;
  onStartNewCart: () => void;
  onReturnToCatalog: () => void;
}

export function OrderConfirmation({
  result,
  retrying = false,
  onRetryPayment,
  onStartNewCart,
  onReturnToCatalog,
}: OrderConfirmationProps) {
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No checkout result found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Start from the catalog or return to checkout with the current cart.
          </p>
          <Button type="button" onClick={onReturnToCatalog}>
            Return to catalog
          </Button>
        </CardContent>
      </Card>
    );
  }

  const confirmed = result.status === 'confirmed';

  return (
    <div className="space-y-5">
      <Alert variant={confirmed ? 'success' : 'warning'}>
        <AlertTitle>{confirmed ? 'Order confirmed' : 'Order created, payment needs retry'}</AlertTitle>
        <AlertDescription>{result.message}</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            Order details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Order</p>
            <p className="font-semibold">{result.order?.orderId ?? 'Pending'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-semibold">{result.order?.status ?? result.status}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-semibold">{formatMoney(result.order?.totalAmount ?? 0)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment reference</p>
            <p className="font-semibold">{result.payment?.transactionReference ?? 'Not complete'}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        {result.nextAction === 'retry_payment' ? (
          <Button type="button" variant="accent" onClick={onRetryPayment} disabled={retrying}>
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            {retrying ? 'Retrying payment...' : 'Retry payment'}
          </Button>
        ) : (
          <Button type="button" variant="accent" onClick={onStartNewCart}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Start a new cart
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onReturnToCatalog}>
          Return to catalog
        </Button>
      </div>
    </div>
  );
}
