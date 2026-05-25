import { createOrder, submitPayment } from '@/lib/musiccorp-api';
import { activeCart, orderResult, paymentResult } from '@/test/fixtures';
import { jsonResponse } from '@/test/test-utils';

describe('MusicCorp checkout adapter', () => {
  beforeEach(() => {
    process.env.MUSICCORP_BACKEND_BASE_URL = 'http://backend.test';
  });

  it('creates orders with backend-compatible fields and correlation id', async () => {
    const fetchMock = jest.fn().mockResolvedValue(jsonResponse({ id: 42, status: 'PENDING', totalAmount: 25.98 }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await createOrder({
      clientActionId: 'order-1',
      customerEmail: 'learner@distributedlab.dev',
      items: activeCart.items,
      totalAmount: activeCart.subtotal,
    });

    expect(result.ok).toBe(true);
    expect(result.ok ? result.data.orderId : '').toBe('42');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://backend.test/api/orders',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'X-Correlation-ID': 'order-1' }),
      })
    );
  });

  it('submits payment for an order', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse({ id: 77, orderId: 42, status: 'COMPLETED', transactionRef: 'TXN-1' })) as unknown as typeof fetch;

    const result = await submitPayment({
      clientActionId: 'payment-1',
      orderId: orderResult.orderId,
      amount: orderResult.totalAmount,
      method: 'CREDIT_CARD',
      idempotencyKey: 'checkout-42',
    });

    expect(result.ok).toBe(true);
    expect(result.ok ? result.data.transactionReference : '').toBe('TXN-1');
  });

  it('maps validation errors for order submission', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse({ error: 'bad email' }, 400)) as unknown as typeof fetch;

    const result = await createOrder({
      customerEmail: 'bad',
      items: activeCart.items,
      totalAmount: activeCart.subtotal,
    });

    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.category).toBe('validation');
  });

  it('maps unavailable payment backends for partial checkout handling', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse({ error: 'down' }, 503)) as unknown as typeof fetch;

    const result = await submitPayment({
      orderId: paymentResult.orderId,
      amount: 25.98,
      method: 'CREDIT_CARD',
      idempotencyKey: 'retry-1',
    });

    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.category).toBe('unavailable');
  });

  it('maps timeout failures', async () => {
    const error = new Error('aborted');
    error.name = 'AbortError';
    global.fetch = jest.fn().mockRejectedValue(error) as unknown as typeof fetch;

    const result = await createOrder({
      customerEmail: 'learner@distributedlab.dev',
      items: activeCart.items,
      totalAmount: activeCart.subtotal,
    });

    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.category).toBe('timeout');
  });

  it('maps malformed checkout responses', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse({ status: 'PENDING' })) as unknown as typeof fetch;

    const result = await createOrder({
      customerEmail: 'learner@distributedlab.dev',
      items: activeCart.items,
      totalAmount: activeCart.subtotal,
    });

    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.category).toBe('unexpected');
  });
});
