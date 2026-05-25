'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { cartSubtotal } from '@/lib/money';
import type { AvailabilityState, Cart, CartItem, CatalogItem } from '@/lib/types';

const CART_STORAGE_KEY = 'musiccorp.cart.v1';
const MAX_UNKNOWN_STOCK_QUANTITY = 99;

function nowIso() {
  return new Date().toISOString();
}

function availabilityFor(item: Pick<CatalogItem, 'stockQuantity'>): AvailabilityState {
  if (typeof item.stockQuantity === 'number') {
    if (item.stockQuantity <= 0) {
      return 'unavailable';
    }
    if (item.stockQuantity <= 3) {
      return 'limited';
    }
  }

  return 'available';
}

function quantityLimit(item: Pick<CatalogItem, 'stockQuantity'>): number | null {
  return typeof item.stockQuantity === 'number' ? Math.max(0, item.stockQuantity) : null;
}

function clampQuantity(quantity: number, availableQuantity: number | null): number {
  const integerQuantity = Math.max(1, Math.floor(quantity));
  if (availableQuantity === null) {
    return Math.min(integerQuantity, MAX_UNKNOWN_STOCK_QUANTITY);
  }

  return Math.min(integerQuantity, Math.max(1, availableQuantity));
}

export function createEmptyCart(persistenceState: Cart['persistenceState'] = 'fresh'): Cart {
  return {
    items: [],
    subtotal: 0,
    itemCount: 0,
    updatedAt: nowIso(),
    persistenceState,
  };
}

export function recalculateCart(
  items: CartItem[],
  persistenceState: Cart['persistenceState'] = 'fresh'
): Cart {
  const normalizedItems = items
    .filter((item) => item.catalogItemId && item.quantity > 0)
    .map((item) => ({
      ...item,
      quantity: clampQuantity(item.quantity, item.availableQuantity),
    }));

  return {
    items: normalizedItems,
    subtotal: cartSubtotal(normalizedItems),
    itemCount: normalizedItems.reduce((total, item) => total + item.quantity, 0),
    updatedAt: nowIso(),
    persistenceState,
  };
}

export function catalogItemToCartItem(item: CatalogItem, quantity = 1): CartItem {
  const availableQuantity = quantityLimit(item);
  return {
    catalogItemId: item.id,
    title: item.title,
    artist: item.artist,
    genre: item.genre,
    unitPrice: item.price,
    quantity: clampQuantity(quantity, availableQuantity),
    availableQuantity,
    availabilityState: availabilityFor(item),
    coverRef: item.coverRef,
  };
}

export function addCatalogItem(cart: Cart, item: CatalogItem, quantity = 1): Cart {
  if (availabilityFor(item) === 'unavailable') {
    return recalculateCart(cart.items, cart.persistenceState);
  }

  const nextItem = catalogItemToCartItem(item, quantity);
  const existing = cart.items.find((cartItem) => cartItem.catalogItemId === item.id);
  const nextItems = existing
    ? cart.items.map((cartItem) =>
        cartItem.catalogItemId === item.id
          ? {
              ...cartItem,
              quantity: clampQuantity(cartItem.quantity + quantity, cartItem.availableQuantity),
              availabilityState: nextItem.availabilityState,
              availableQuantity: nextItem.availableQuantity,
            }
          : cartItem
      )
    : [...cart.items, nextItem];

  return recalculateCart(nextItems);
}

export function updateCartItemQuantity(cart: Cart, catalogItemId: string, quantity: number): Cart {
  if (quantity < 1) {
    return removeCartItem(cart, catalogItemId);
  }

  return recalculateCart(
    cart.items.map((item) =>
      item.catalogItemId === catalogItemId
        ? { ...item, quantity: clampQuantity(quantity, item.availableQuantity) }
        : item
    ),
    cart.persistenceState
  );
}

export function removeCartItem(cart: Cart, catalogItemId: string): Cart {
  return recalculateCart(
    cart.items.filter((item) => item.catalogItemId !== catalogItemId),
    cart.items.length === 1 ? 'cleared' : cart.persistenceState
  );
}

export function canCheckout(cart: Cart): boolean {
  return (
    cart.items.length > 0 &&
    cart.items.every((item) => item.quantity > 0 && item.availabilityState !== 'unavailable')
  );
}

export function serializeCart(cart: Cart): string {
  return JSON.stringify({
    ...cart,
    persistenceState: 'fresh',
  });
}

export function deserializeCart(value: string | null): Cart {
  if (!value) {
    return createEmptyCart();
  }

  try {
    const parsed = JSON.parse(value) as Partial<Cart>;
    if (!Array.isArray(parsed.items)) {
      return createEmptyCart();
    }
    return recalculateCart(parsed.items as CartItem[], 'restored');
  } catch {
    return createEmptyCart();
  }
}

export function readCartFromStorage(): Cart {
  if (typeof window === 'undefined') {
    return createEmptyCart();
  }

  return deserializeCart(window.localStorage.getItem(CART_STORAGE_KEY));
}

export function saveCartToStorage(cart: Cart): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(cart));
}

export function clearCartStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(CART_STORAGE_KEY);
}

export function useCart() {
  const [cart, setCart] = useState<Cart>(() => createEmptyCart());

  useEffect(() => {
    setCart(readCartFromStorage());
  }, []);

  useEffect(() => {
    if (cart.persistenceState === 'fresh' && cart.items.length === 0) {
      return;
    }
    saveCartToStorage(cart);
  }, [cart]);

  const addItem = useCallback((item: CatalogItem, quantity = 1) => {
    setCart((current) => addCatalogItem(current, item, quantity));
  }, []);

  const updateQuantity = useCallback((catalogItemId: string, quantity: number) => {
    setCart((current) => updateCartItemQuantity(current, catalogItemId, quantity));
  }, []);

  const removeItem = useCallback((catalogItemId: string) => {
    setCart((current) => removeCartItem(current, catalogItemId));
  }, []);

  const clearCart = useCallback(() => {
    clearCartStorage();
    setCart(createEmptyCart('cleared'));
  }, []);

  return useMemo(
    () => ({
      cart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      canCheckout: canCheckout(cart),
    }),
    [addItem, cart, clearCart, removeItem, updateQuantity]
  );
}
