import CatalogPage from '@/app/page';
import { CheckoutForm } from '@/components/CheckoutForm';
import { CHECKOUT_DRAFT_KEY, CHECKOUT_RESULT_KEY } from '@/lib/checkout-session';
import { activeCart, checkoutDraft, failedResult, okResult, orderResult } from '@/test/fixtures';
import { fireEvent, renderWithProviders, screen, waitFor } from '@/test/test-utils';

describe('storefront degraded states', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('shows degraded catalog status and retry without raw request controls', async () => {
    global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(failedResult()) }) as unknown as typeof fetch;

    renderWithProviders(<CatalogPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/not reachable/i);
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    expect(screen.queryByText(/request body/i)).not.toBeInTheDocument();
  });

  it('preserves checkout draft on failed order retry path', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          ok: false,
          scope: 'order',
          category: 'unavailable',
          message: 'order failed during the lab.',
          durationMs: 30,
          actionId: 'order-failed',
        }),
    }) as unknown as typeof fetch;

    renderWithProviders(<CheckoutForm cart={activeCart} />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: checkoutDraft.customerEmail },
    });
    fireEvent.click(screen.getByLabelText(/create MusicCorp backend activity/i));
    fireEvent.click(screen.getByRole('button', { name: /place order and pay/i }));

    expect(await screen.findByText(/order failed during the lab/i)).toBeInTheDocument();
    expect(window.localStorage.getItem(CHECKOUT_DRAFT_KEY)).toContain(checkoutDraft.customerEmail);
  });

  it('preserves partial order context when payment times out', async () => {
    window.localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(checkoutDraft));
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve(okResult(orderResult)) })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            ok: false,
            scope: 'payment',
            category: 'timeout',
            message: 'payment timeout.',
            durationMs: 5000,
            actionId: 'payment-timeout',
          }),
      }) as unknown as typeof fetch;

    renderWithProviders(<CheckoutForm cart={activeCart} />);
    fireEvent.click(screen.getByRole('button', { name: /place order and pay/i }));

    await waitFor(() => expect(window.sessionStorage.getItem(CHECKOUT_RESULT_KEY)).toContain('retry_payment'));
  });
});
