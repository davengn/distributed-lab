'use client';

import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { formatMoney } from '@/lib/money';
import type { Cart } from '@/lib/types';

interface CartDrawerProps {
  cart: Cart;
  canCheckout: boolean;
  updateQuantity: (catalogItemId: string, quantity: number) => void;
  removeItem: (catalogItemId: string) => void;
}

export function CartDrawer({ cart, canCheckout, updateQuantity, removeItem }: CartDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          className="relative"
          aria-label={`Open cart with ${cart.itemCount} ${cart.itemCount === 1 ? 'item' : 'items'}`}
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Cart
          <Badge variant="success" className="ml-1">
            {cart.itemCount}
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetPortal>
        <SheetOverlay className="fixed inset-0 z-40 bg-slate-950/40" />
        <SheetContent className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background p-0 shadow-storefront">
          <SheetHeader className="border-b border-border p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <SheetTitle className="text-xl font-black">Your cart</SheetTitle>
                <SheetDescription className="mt-1 text-sm text-muted-foreground">
                  Review albums before checkout.
                </SheetDescription>
              </div>
              <SheetClose asChild>
                <Button type="button" variant="ghost" size="icon" aria-label="Close cart">
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-5">
            {cart.items.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <p className="font-semibold">Your cart is empty</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add an available album to start a checkout scenario.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {cart.items.map((item) => (
                  <li key={item.catalogItemId} className="rounded-lg border border-border p-4">
                    <div className="flex gap-3">
                      <img
                        src={item.coverRef ?? '/covers/catalog.svg'}
                        alt=""
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.artist}</p>
                        <p className="mt-1 text-sm font-semibold">{formatMoney(item.unitPrice)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2" aria-label={`${item.title} quantity`}>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          aria-label={`Decrease ${item.title} quantity`}
                          onClick={() => updateQuantity(item.catalogItemId, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          aria-label={`Increase ${item.title} quantity`}
                          onClick={() => updateQuantity(item.catalogItemId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label={`Remove ${item.title}`}
                        onClick={() => removeItem(item.catalogItemId)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <SheetFooter className="border-t border-border p-5">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-lg font-black">
                <span>Subtotal</span>
                <span>{formatMoney(cart.subtotal)}</span>
              </div>
              {canCheckout ? (
                <Button asChild variant="accent" className="w-full">
                  <Link href="/checkout">Continue to checkout</Link>
                </Button>
              ) : (
                <Button type="button" disabled className="w-full">
                  Continue to checkout
                </Button>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
