import { normalizeAmount } from '@/lib/money';
import type {
  BackendCategory,
  BackendResult,
  BackendScope,
  CatalogItem,
  OrderResult,
  OrderSubmission,
  PaymentResult,
  PaymentSubmission,
} from '@/lib/types';

const DEFAULT_BACKEND_BASE_URL = 'http://localhost:8080';
const DEFAULT_TIMEOUT_MS = 5000;

function getBackendBaseUrl(): string {
  return (process.env.MUSICCORP_BACKEND_BASE_URL ?? DEFAULT_BACKEND_BASE_URL).replace(/\/$/, '');
}

function getTimeoutMs(): number {
  const configured = Number.parseInt(process.env.MUSICCORP_BACKEND_TIMEOUT_MS ?? '', 10);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_TIMEOUT_MS;
}

function createActionId(scope: string): string {
  const random = Math.random().toString(36).slice(2, 9);
  return `${scope}-${Date.now().toString(36)}-${random}`;
}

function durationSince(startedAt: number): number {
  return Math.max(0, Math.round(performance.now() - startedAt));
}

function categoryForStatus(status: number): BackendCategory {
  if (status >= 400 && status < 500) {
    return 'validation';
  }
  if (status >= 500) {
    return 'unavailable';
  }
  return 'unexpected';
}

function messageFor(scope: BackendScope, category: BackendCategory, statusCode?: number): string {
  if (category === 'timeout') {
    return `${scope} is taking longer than expected. Try again when the lab service catches up.`;
  }
  if (category === 'validation') {
    return `${scope} could not use the submitted details. Check the highlighted information and retry.`;
  }
  if (category === 'unavailable') {
    return `${scope} is not reachable right now. The current cart and form details are preserved.`;
  }
  return statusCode
    ? `${scope} returned an unexpected response (${statusCode}).`
    : `${scope} returned an unexpected response.`;
}

function jsonHeaders(actionId: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Correlation-ID': actionId,
  };
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

async function requestBackend<T>(
  scope: Exclude<BackendScope, 'cart' | 'checkout'>,
  path: string,
  init: RequestInit,
  normalize: (raw: unknown) => T,
  providedActionId?: string
): Promise<BackendResult<T>> {
  const actionId = providedActionId ?? createActionId(scope);
  const startedAt = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getTimeoutMs());

  try {
    const response = await fetch(`${getBackendBaseUrl()}${path}`, {
      ...init,
      headers: {
        ...jsonHeaders(actionId),
        ...(init.headers ?? {}),
      },
      signal: controller.signal,
    });

    const durationMs = durationSince(startedAt);
    const raw = await parseJson(response);

    if (!response.ok) {
      const category = categoryForStatus(response.status);
      return {
        ok: false,
        scope,
        category,
        message: messageFor(scope, category, response.status),
        durationMs,
        actionId,
        statusCode: response.status,
      };
    }

    try {
      return {
        ok: true,
        data: normalize(raw),
        durationMs,
        actionId,
        statusCode: response.status,
      };
    } catch {
      return {
        ok: false,
        scope,
        category: 'unexpected',
        message: messageFor(scope, 'unexpected', response.status),
        durationMs,
        actionId,
        statusCode: response.status,
      };
    }
  } catch (error) {
    const durationMs = durationSince(startedAt);
    const category = error instanceof Error && error.name === 'AbortError' ? 'timeout' : 'unavailable';
    return {
      ok: false,
      scope,
      category,
      message: messageFor(scope, category),
      durationMs,
      actionId,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function asRecord(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  throw new Error('Expected object response');
}

function asString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  throw new Error('Expected string-like value');
}

function optionalString(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  return asString(value);
}

function normalizeCatalogItem(raw: unknown, index = 0): CatalogItem {
  const record = asRecord(raw);
  const stockValue = record.stockQuantity;
  const stockQuantity =
    typeof stockValue === 'number'
      ? stockValue
      : typeof stockValue === 'string'
        ? Number.parseInt(stockValue, 10)
        : null;
  const id = asString(record.id ?? index + 1);
  const genre = asString(record.genre ?? 'Catalog');

  return {
    id,
    title: asString(record.title),
    artist: asString(record.artist),
    genre,
    price: normalizeAmount(record.price),
    stockQuantity: Number.isFinite(stockQuantity) ? stockQuantity : null,
    coverRef: `/covers/${coverForGenre(genre)}`,
  };
}

function coverForGenre(genre: string): string {
  const normalized = genre.toLowerCase();
  if (normalized.includes('jazz')) {
    return 'jazz.svg';
  }
  if (normalized.includes('rock')) {
    return 'rock.svg';
  }
  if (normalized.includes('electronic') || normalized.includes('dance')) {
    return 'electronic.svg';
  }
  return 'catalog.svg';
}

function normalizeCatalogList(raw: unknown): CatalogItem[] {
  if (!Array.isArray(raw)) {
    throw new Error('Expected array response');
  }
  return raw.map((item, index) => normalizeCatalogItem(item, index));
}

function normalizeOrder(raw: unknown): OrderResult {
  const record = asRecord(raw);
  return {
    orderId: asString(record.orderId ?? record.id),
    status: asString(record.status ?? 'CREATED'),
    totalAmount: normalizeAmount(record.totalAmount),
    createdAt: optionalString(record.createdAt),
    customerEmail: optionalString(record.customerEmail),
  };
}

function normalizePayment(raw: unknown): PaymentResult {
  const record = asRecord(raw);
  return {
    paymentId: asString(record.paymentId ?? record.id),
    orderId: asString(record.orderId),
    status: asString(record.status ?? 'COMPLETED'),
    transactionReference: optionalString(record.transactionReference ?? record.transactionRef),
    processedAt: optionalString(record.processedAt ?? record.createdAt),
  };
}

export async function listCatalogItems(): Promise<BackendResult<CatalogItem[]>> {
  return requestBackend('catalog', '/api/catalog', { method: 'GET' }, normalizeCatalogList);
}

export async function getCatalogItem(id: string): Promise<BackendResult<CatalogItem>> {
  return requestBackend(
    'catalog',
    `/api/catalog/${encodeURIComponent(id)}`,
    { method: 'GET' },
    normalizeCatalogItem
  );
}

export async function createOrder(input: OrderSubmission): Promise<BackendResult<OrderResult>> {
  const actionId = input.clientActionId ?? createActionId('order');
  return requestBackend(
    'order',
    '/api/orders',
    {
      method: 'POST',
      body: JSON.stringify({
        customerEmail: input.customerEmail,
        items: input.items.map((item) => ({
          catalogItemId: item.catalogItemId,
          title: item.title,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        totalAmount: input.totalAmount,
      }),
    },
    normalizeOrder,
    actionId
  );
}

export async function submitPayment(
  input: PaymentSubmission
): Promise<BackendResult<PaymentResult>> {
  const actionId = input.clientActionId ?? createActionId('payment');
  return requestBackend(
    'payment',
    '/api/payments',
    {
      method: 'POST',
      body: JSON.stringify({
        orderId: input.orderId,
        amount: input.amount,
        method: input.method,
        idempotencyKey: input.idempotencyKey,
      }),
    },
    normalizePayment,
    actionId
  );
}
