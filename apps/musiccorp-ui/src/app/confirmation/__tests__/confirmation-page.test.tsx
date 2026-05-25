import ConfirmationPage from '@/app/confirmation/page';
import { CHECKOUT_RESULT_KEY } from '@/lib/checkout-session';
import { checkoutResult, orderResult, okResult, paymentResult } from '@/test/fixtures';
import { fireEvent, renderWithProviders, screen, waitFor } from '@/test/test-utils';

describe('ConfirmationPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('shows confirmed checkout details', async () => {
    window.sessionStorage.setItem(CHECKOUT_RESULT_KEY, JSON.stringify(checkoutResult));

    renderWithProviders(<ConfirmationPage />);

    expect(await screen.findByText(/order confirmed/i)).toBeInTheDocument();
    expect(screen.getByText('TXN-12345678')).toBeInTheDocument();
  });

  it('shows missing context after refresh', async () => {
    renderWithProviders(<ConfirmationPage />);

    expect(await screen.findByText(/no checkout result found/i)).toBeInTheDocument();
  });

  it('retries payment after order was created', async () => {
    window.sessionStorage.setItem(
      CHECKOUT_RESULT_KEY,
      JSON.stringify({
        status: 'order_created_payment_failed',
        order: orderResult,
        paymentRequest: {
          orderId: orderResult.orderId,
          amount: orderResult.totalAmount,
          method: 'CREDIT_CARD',
          idempotencyKey: 'retry-42',
        },
        message: 'payment failed',
        nextAction: 'retry_payment',
      })
    );
    global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(okResult(paymentResult)) }) as unknown as typeof fetch;

    renderWithProviders(<ConfirmationPage />);
    fireEvent.click(await screen.findByRole('button', { name: /retry payment/i }));

    await waitFor(() => expect(screen.getByText(/payment is confirmed/i)).toBeInTheDocument());
  });
});
