'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutForm } from '@/components/CheckoutForm';
import { StorefrontActivityPanel } from '@/components/StorefrontActivityPanel';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/lib/cart-store';
import { formatMoney } from '@/lib/money';
import { useStorefrontEvents } from '@/lib/storefront-events';

export default function CheckoutPage() {
  const { cart, updateQuantity, removeItem, canCheckout } = useCart();
  const { events, clear } = useStorefrontEvents();

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
      <section className="space-y-5">
        <Button asChild variant="ghost">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Return to catalog
          </Link>
        </Button>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h1 className="text-3xl font-black tracking-normal">Checkout</h1>
          <p className="mt-2 text-muted-foreground">
            Create a MusicCorp order and submit payment using the current cart.
          </p>
        </div>

        {!canCheckout ? (
          <Alert variant="warning">
            <AlertTitle>Cart review required</AlertTitle>
            <AlertDescription>
              Add at least one available album before submitting checkout.
            </AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Customer details</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckoutForm cart={cart} />
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>Cart review</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} selected.
              </p>
            </div>
            <CartDrawer
              cart={cart}
              canCheckout={canCheckout}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          </CardHeader>
          <CardContent>
            {cart.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">The cart is empty.</p>
            ) : (
              <ul className="space-y-3">
                {cart.items.map((item) => (
                  <li key={item.catalogItemId} className="flex justify-between gap-3 text-sm">
                    <span>
                      {item.title} x {item.quantity}
                    </span>
                    <span className="font-semibold">{formatMoney(item.unitPrice * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-lg font-black">
              <span>Total</span>
              <span>{formatMoney(cart.subtotal)}</span>
            </div>
          </CardContent>
        </Card>

        <StorefrontActivityPanel events={events} onClear={clear} />
      </aside>
    </main>
  );
}
