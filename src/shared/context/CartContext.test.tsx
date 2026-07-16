import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { type ReactNode } from 'react';
import { CartProvider, useCart } from './CartContext';

const { mockUseAuth } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
}));

vi.mock('@/shared/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

const { mockAddCartItem, mockClearDbCart, mockLoadCartItems, mockRemoveCartItem, mockUpdateCartItemQuantity } =
  vi.hoisted(() => ({
    mockAddCartItem: vi.fn(),
    mockClearDbCart: vi.fn(),
    mockLoadCartItems: vi.fn(),
    mockRemoveCartItem: vi.fn(),
    mockUpdateCartItemQuantity: vi.fn(),
  }));

vi.mock('@/shared/lib/cart-service', () => ({
  addCartItem: (...args: any[]) => mockAddCartItem(...args),
  clearCart: (...args: any[]) => mockClearDbCart(...args),
  loadCartItems: (...args: any[]) => mockLoadCartItems(...args),
  removeCartItem: (...args: any[]) => mockRemoveCartItem(...args),
  updateCartItemQuantity: (...args: any[]) => mockUpdateCartItemQuantity(...args),
}));

const { mockSupabaseFrom } = vi.hoisted(() => ({
  mockSupabaseFrom: vi.fn(),
}));

vi.mock('@/shared/lib/supabase', () => ({
  supabase: { from: mockSupabaseFrom },
}));

const sampleProduct = {
  id: 'prod-1',
  name: 'Test Product',
  price: 99,
  image: 'img.png',
  category: 'Tech',
  rating: 4.5,
  reviewCount: 10,
  stock: 'in_stock' as const,
};

const outOfStockProduct = {
  ...sampleProduct,
  id: 'prod-oos',
  name: 'Out of Stock',
  stock: 'out' as const,
};

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: null });
    mockLoadCartItems.mockResolvedValue({ items: [], error: null });
    mockAddCartItem.mockResolvedValue({ error: null });
    mockClearDbCart.mockResolvedValue({ error: null });
    mockRemoveCartItem.mockResolvedValue({ error: null });
    mockUpdateCartItemQuantity.mockResolvedValue({ error: null });

    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { stock: 10 }, error: null }),
    };
    mockSupabaseFrom.mockReturnValue(chain);
  });

  it('useCart throws outside provider', () => {
    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart debe usarse dentro de CartProvider');
  });

  it('starts with empty cart when not logged in', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
  });

  it('addToCart locally when not logged in', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addToCart(sampleProduct, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.items[0].product.id).toBe('prod-1');
    expect(result.current.itemCount).toBe(2);
  });

  it('addToCart accumulates quantity for same product locally', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addToCart(sampleProduct, 1);
    });
    await act(async () => {
      await result.current.addToCart(sampleProduct, 3);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(4);
  });

  it('addToCart rejects out-of-stock product', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addToCart(outOfStockProduct, 1);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('updateQuantity locally when not logged in', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addToCart(sampleProduct, 3);
    });

    await act(async () => {
      await result.current.updateQuantity('prod-1', -1);
    });

    expect(result.current.items[0].quantity).toBe(2);
  });

  it('removeItem locally when not logged in', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addToCart(sampleProduct, 1);
    });

    await act(async () => {
      await result.current.removeItem('prod-1');
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('clearCart locally when not logged in', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addToCart(sampleProduct, 2);
    });

    await act(async () => {
      await result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
  });

  it('itemCount returns total quantity', async () => {
    const product2 = { ...sampleProduct, id: 'prod-2', name: 'Product 2' };
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addToCart(sampleProduct, 2);
    });
    await act(async () => {
      await result.current.addToCart(product2, 5);
    });

    expect(result.current.itemCount).toBe(7);
  });

  it('loads cart from DB when logged in', async () => {
    const dbItems = [
      { product: sampleProduct, quantity: 2, detailId: 'det-1' },
    ];
    mockLoadCartItems.mockResolvedValue({ items: dbItems, error: null });

    mockUseAuth.mockReturnValue({ user: { id: 'user1' } });

    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockLoadCartItems).toHaveBeenCalledWith('user1');
    expect(result.current.items).toEqual(dbItems);
  });

  it('addToCart calls DB service when logged in', async () => {
    mockUseAuth.mockReturnValue({ user: { id: 'user1' } });
    mockLoadCartItems.mockResolvedValue({ items: [], error: null });

    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    await act(async () => {
      await result.current.addToCart(sampleProduct, 1);
    });

    expect(mockAddCartItem).toHaveBeenCalledWith('user1', sampleProduct, 1);
  });
});
