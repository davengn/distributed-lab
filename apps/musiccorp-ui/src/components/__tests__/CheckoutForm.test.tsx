import { CheckoutForm } from '@/components/CheckoutForm';
import { CHECKOUT_DRAFT_KEY, CHECKOUT_RESULT_KEY } from '@/lib/checkout-session';
import { createEmptyCart } from '@/lib/cart-store';
import { activeCart, checkoutDraft, orderResult, paymentResult, okResult } from '@/test/fixtures';
import { fireEvent, renderWithProviders, screen, waitFor } from '@/test/test-utils';

describe('CheckoutForm', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('validates empty cart and invalid email before backend submission', async () => {
    renderWithProviders(<CheckoutForm cart={createEmptyCart()} />);

    expect(screen.getByRole('button', { name: /place order and pay/i })).toBeDisabled();
  });

  it('validates an invalid email before backend submission', async () => {
    renderWithProviders(<CheckoutForm cart={activeCart} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'not-email' } });
    fireEvent.click(screen.getByLabelText(/create MusicCorp backend activity/i));
    fireEvent.click(screen.getByRole('button', { name: /place order and pay/i }));

    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
  });

  it('selects payment method and submits order then payment once', async () => {
    window.localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(checkoutDraft));
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve(okResult(orderResult)) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(okResult(paymentResult)) });
    global.fetch = fetchMock as unknown as typeof fetch;

    renderWithProviders(<CheckoutForm cart={activeCart} />);
    fireEvent.change(screen.getByLabelText(/payment method/i), { target: { value: 'PAYPAL' } });
    fireEvent.click(screen.getByRole('button', { name: /place order and pay/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(window.sessionStorage.getItem(CHECKOUT_RESULT_KEY)).toContain('confirmed');
  });

  it('preserves draft state when order creation fails', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          ok: false,
          scope: 'order',
          category: 'unavailable',
          message: 'order is not reachable right now.',
          durationMs: 20,
          actionId: 'order-failed',
        }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    renderWithProviders(<CheckoutForm cart={activeCart} />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: checkoutDraft.customerEmail },
    });
    fireEvent.click(screen.getByLabelText(/create MusicCorp backend activity/i));
    fireEvent.click(screen.getByRole('button', { name: /place order and pay/i }));

    expect(await screen.findByText(/order is not reachable/i)).toBeInTheDocument();
    expect(window.localStorage.getItem(CHECKOUT_DRAFT_KEY)).toContain(checkoutDraft.customerEmail);
  });

  it('hands off partial payment failure to confirmation context', async () => {
    window.localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(checkoutDraft));
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve(okResult(orderResult)) })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            ok: false,
            scope: 'payment',
            category: 'timeout',
            message: 'payment is taking longer than expected.',
            durationMs: 5000,
            actionId: 'payment-timeout',
          }),
      });
    global.fetch = fetchMock as unknown as typeof fetch;

    renderWithProviders(<CheckoutForm cart={activeCart} />);
    fireEvent.click(screen.getByRole('button', { name: /place order and pay/i }));

    await waitFor(() => expect(window.sessionStorage.getItem(CHECKOUT_RESULT_KEY)).toContain('order_created_payment_failed'));
  });
});
