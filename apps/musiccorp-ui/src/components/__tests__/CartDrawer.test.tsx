import { CartDrawer } from '@/components/CartDrawer';
import { createEmptyCart } from '@/lib/cart-store';
import { activeCart } from '@/test/fixtures';
import { fireEvent, renderWithProviders, screen } from '@/test/test-utils';

describe('CartDrawer', () => {
  it('shows restored cart state and allows quantity changes', () => {
    const updateQuantity = jest.fn();
    renderWithProviders(
      <CartDrawer
        cart={activeCart}
        canCheckout
        updateQuantity={updateQuantity}
        removeItem={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /open cart/i }));
    expect(screen.getByText('Kind of Blue')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /increase kind of blue quantity/i }));
    expect(updateQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('removes items and disables checkout when cart is empty', () => {
    const removeItem = jest.fn();
    const { unmount } = renderWithProviders(
      <CartDrawer
        cart={activeCart}
        canCheckout
        updateQuantity={jest.fn()}
        removeItem={removeItem}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /open cart/i }));
    fireEvent.click(screen.getByRole('button', { name: /remove kind of blue/i }));
    expect(removeItem).toHaveBeenCalledWith('1');
    unmount();

    renderWithProviders(
      <CartDrawer
        cart={createEmptyCart('restored')}
        canCheckout={false}
        updateQuantity={jest.fn()}
        removeItem={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /open cart/i }));
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue to checkout/i })).toBeDisabled();
  });
});
