import type { CartItem } from '@/lib/types';

export function normalizeAmount(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, value);
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }

  return 0;
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(normalizeAmount(value));
}

export function cartItemSubtotal(item: Pick<CartItem, 'quantity' | 'unitPrice'>): number {
  return normalizeAmount(item.unitPrice) * Math.max(0, item.quantity);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + cartItemSubtotal(item), 0);
}
