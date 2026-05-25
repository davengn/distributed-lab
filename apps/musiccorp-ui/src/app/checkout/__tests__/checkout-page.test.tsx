import CheckoutPage from '@/app/checkout/page';
import { serializeCart } from '@/lib/cart-store';
import { activeCart } from '@/test/fixtures';
import { renderWithProviders, screen } from '@/test/test-utils';

describe('CheckoutPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('musiccorp.cart.v1', serializeCart(activeCart));
  });

  it('reviews the cart and renders the checkout form', async () => {
    renderWithProviders(<CheckoutPage />);

    expect(await screen.findByText('Kind of Blue x 2')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /return to catalog/i })).toBeInTheDocument();
  });

  it('shows empty cart guidance when checkout cannot proceed', () => {
    window.localStorage.clear();
    renderWithProviders(<CheckoutPage />);

    expect(screen.getByText(/cart review required/i)).toBeInTheDocument();
    expect(screen.getByText(/the cart is empty/i)).toBeInTheDocument();
  });
});
