export type BackendScope = 'catalog' | 'cart' | 'order' | 'payment' | 'checkout';

export type BackendCategory = 'unavailable' | 'validation' | 'timeout' | 'unexpected';

export type BackendSeverity = 'info' | 'warning' | 'error' | 'success';

export type BackendStatus = 'idle' | 'submitting' | 'succeeded' | 'failed' | 'timed_out';

export type PaymentMethod = 'CREDIT_CARD' | 'PAYPAL' | 'GIFT_CARD';

export type CheckoutStatus =
  | 'confirmed'
  | 'order_created_payment_failed'
  | 'failed'
  | 'pending';

export type CartPersistenceState = 'fresh' | 'restored' | 'cleared';

export type AvailabilityState = 'available' | 'limited' | 'unavailable';

export type StorefrontEventStatus = 'pending' | 'succeeded' | 'failed' | 'timed_out';

export type BackendResult<T> =
  | {
      ok: true;
      data: T;
      durationMs: number;
      actionId: string;
      statusCode?: number;
    }
  | {
      ok: false;
      scope: Exclude<BackendScope, 'cart' | 'checkout'>;
      category: BackendCategory;
      message: string;
      durationMs: number;
      actionId: string;
      statusCode?: number;
    };

export interface CatalogItem {
  id: string;
  title: string;
  artist: string;
  genre: string;
  price: number;
  stockQuantity: number | null;
  coverRef?: string;
}

export interface CatalogFilter {
  query: string;
  genre: string;
  availableOnly: boolean;
}

export interface CartItem {
  catalogItemId: string;
  title: string;
  artist: string;
  genre: string;
  unitPrice: number;
  quantity: number;
  availableQuantity: number | null;
  availabilityState: AvailabilityState;
  coverRef?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  updatedAt: string;
  persistenceState: CartPersistenceState;
}

export interface CheckoutDraft {
  customerEmail: string;
  customerName: string;
  paymentMethod: PaymentMethod;
  termsAccepted: boolean;
  validationErrors?: Record<string, string>;
}

export interface OrderSubmission {
  clientActionId?: string;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
}

export interface OrderResult {
  orderId: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
  customerEmail?: string;
}

export interface PaymentSubmission {
  clientActionId?: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  idempotencyKey: string;
}

export interface PaymentResult {
  paymentId: string;
  orderId: string;
  status: string;
  transactionReference?: string;
  processedAt?: string;
}

export interface CheckoutResult {
  status: CheckoutStatus;
  order?: OrderResult;
  payment?: PaymentResult;
  paymentRequest?: PaymentSubmission;
  message: string;
  nextAction: 'start_new_cart' | 'retry_payment' | 'retry_checkout' | 'return_to_catalog';
}

export interface StorefrontEvent {
  clientActionId: string;
  label: string;
  status: StorefrontEventStatus;
  durationMs: number;
  timestamp: string;
  businessSummary: string;
}

export interface BackendStatusMessage {
  scope: BackendScope;
  severity: BackendSeverity;
  title: string;
  message: string;
  retryAvailable: boolean;
  technicalHint?: string;
}
