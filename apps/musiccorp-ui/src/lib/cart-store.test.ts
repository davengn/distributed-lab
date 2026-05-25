import {
  addCatalogItem,
  canCheckout,
  createEmptyCart,
  deserializeCart,
  removeCartItem,
  serializeCart,
  updateCartItemQuantity,
} from '@/lib/cart-store';
import { catalogItems } from '@/test/fixtures';

describe('cart store', () => {
  it('adds available catalog items and calculates subtotal', () => {
    const cart = addCatalogItem(createEmptyCart(), catalogItems[0], 2);

    expect(cart.items).toHaveLength(1);
    expect(cart.itemCount).toBe(2);
    expect(cart.subtotal).toBe(25.98);
    expect(canCheckout(cart)).toBe(true);
  });

  it('updates quantities within stock limits', () => {
    const cart = addCatalogItem(createEmptyCart(), catalogItems[1], 1);
    const updated = updateCartItemQuantity(cart, '2', 10);

    expect(updated.items[0].quantity).toBe(2);
  });

  it('removes items from the cart', () => {
    const cart = addCatalogItem(createEmptyCart(), catalogItems[0], 1);
    const updated = removeCartItem(cart, '1');

    expect(updated.items).toHaveLength(0);
    expect(updated.persistenceState).toBe('cleared');
  });

  it('blocks unavailable items from being added', () => {
    const cart = addCatalogItem(createEmptyCart(), catalogItems[2], 1);

    expect(cart.items).toHaveLength(0);
    expect(canCheckout(cart)).toBe(false);
  });

  it('restores valid cart contents from storage text', () => {
    const cart = addCatalogItem(createEmptyCart(), catalogItems[0], 1);
    const restored = deserializeCart(serializeCart(cart));

    expect(restored.items[0].title).toBe('Kind of Blue');
    expect(restored.persistenceState).toBe('restored');
  });
});
