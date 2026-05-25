import { recalculateCart } from '@/lib/cart-store';
import type {
  BackendResult,
  Cart,
  CatalogItem,
  CheckoutDraft,
  CheckoutResult,
  OrderResult,
  PaymentResult,
  StorefrontEvent,
} from '@/lib/types';

export const catalogItems: CatalogItem[] = [
  {
    id: '1',
    title: 'Kind of Blue',
    artist: 'Miles Davis',
    genre: 'Jazz',
    price: 12.99,
    stockQuantity: 50,
    coverRef: '/covers/jazz.svg',
  },
  {
    id: '2',
    title: 'Blue Train',
    artist: 'John Coltrane',
    genre: 'Jazz',
    price: 10.99,
    stockQuantity: 2,
    coverRef: '/covers/jazz.svg',
  },
  {
    id: '3',
    title: 'Silent Radio',
    artist: 'The Circuits',
    genre: 'Electronic',
    price: 9.5,
    stockQuantity: 0,
    coverRef: '/covers/electronic.svg',
  },
];

export const activeCart: Cart = recalculateCart([
  {
    catalogItemId: '1',
    title: 'Kind of Blue',
    artist: 'Miles Davis',
    genre: 'Jazz',
    unitPrice: 12.99,
    quantity: 2,
    availableQuantity: 50,
    availabilityState: 'available',
    coverRef: '/covers/jazz.svg',
  },
]);

export const checkoutDraft: CheckoutDraft = {
  customerEmail: 'learner@distributedlab.dev',
  customerName: 'Learner',
  paymentMethod: 'CREDIT_CARD',
  termsAccepted: true,
};

export const orderResult: OrderResult = {
  orderId: '42',
  status: 'PENDING',
  totalAmount: 25.98,
  createdAt: '2026-05-25T00:00:00Z',
  customerEmail: 'learner@distributedlab.dev',
};

export const paymentResult: PaymentResult = {
  paymentId: '77',
  orderId: '42',
  status: 'COMPLETED',
  transactionReference: 'TXN-12345678',
  processedAt: '2026-05-25T00:00:01Z',
};

export const checkoutResult: CheckoutResult = {
  status: 'confirmed',
  order: orderResult,
  payment: paymentResult,
  message: 'Your MusicCorp order is confirmed.',
  nextAction: 'start_new_cart',
};

export const storefrontEvents: StorefrontEvent[] = [
  {
    clientActionId: 'catalog-1',
    label: 'Catalog load',
    status: 'succeeded',
    durationMs: 38,
    timestamp: '2026-05-25T00:00:00Z',
    businessSummary: 'Loaded 3 catalog items',
  },
  {
    clientActionId: 'payment-1',
    label: 'Payment submit',
    status: 'timed_out',
    durationMs: 5000,
    timestamp: '2026-05-25T00:01:00Z',
    businessSummary: 'payment is taking longer than expected.',
  },
];

export function okResult<T>(data: T): BackendResult<T> {
  return {
    ok: true,
    data,
    durationMs: 12,
    actionId: 'action-ok',
    statusCode: 200,
  };
}

export function failedResult<T = never>(): BackendResult<T> {
  return {
    ok: false,
    scope: 'catalog',
    category: 'unavailable',
    message: 'catalog is not reachable right now.',
    durationMs: 5000,
    actionId: 'action-failed',
    statusCode: 503,
  };
}
