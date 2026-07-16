import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartPage } from './CartPage';

const { mockUseCart, mockUseProductos } = vi.hoisted(() => ({
  mockUseCart: vi.fn(),
  mockUseProductos: vi.fn(),
}));

vi.mock('@/shared/context/CartContext', () => ({
  useCart: () => mockUseCart(),
}));

vi.mock('@/shared/hooks/useProductos', () => ({
  useProductos: () => mockUseProductos(),
}));

vi.mock('@/shared/ui/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid="icon">{name}</span>,
}));

vi.mock('@/components/product/ProductCard', () => ({
  ProductCard: ({ product }: any) => <div data-testid="product-card">{product.name}</div>,
}));

vi.mock('@/shared/data/mock', async (importOriginal) => {
  const orig = await importOriginal<typeof import('@/shared/data/mock')>();
  return { ...orig, formatPrice: (v: number) => `$${v}` };
});

const mockProduct = { id: 'p1', name: 'Widget', price: 100, image: '/w.jpg', category: 'Tech', rating: 4, reviewCount: 10, stock: 'in_stock' as const };

describe('CartPage', () => {
  it('renders empty cart', () => {
    mockUseCart.mockReturnValue({ items: [], updateQuantity: vi.fn(), removeItem: vi.fn(), addToCart: vi.fn() });
    mockUseProductos.mockReturnValue({ products: [], loading: false, error: null });
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
    expect(screen.getByText(/Tienes 0 artículos/)).toBeInTheDocument();
    expect(screen.getByText('Resumen del Pedido')).toBeInTheDocument();
  });

  it('renders cart with items', () => {
    mockUseCart.mockReturnValue({
      items: [{ product: mockProduct, quantity: 2, detailId: 'd1' }],
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      addToCart: vi.fn(),
    });
    mockUseProductos.mockReturnValue({ products: [mockProduct], loading: false, error: null });
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );
    expect(screen.getAllByText('Widget').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Tienes 1 artículo/)).toBeInTheDocument();
    expect(screen.getAllByText('$200').length).toBeGreaterThanOrEqual(1);
  });

  it('renders recommendations section', () => {
    mockUseCart.mockReturnValue({ items: [], updateQuantity: vi.fn(), removeItem: vi.fn(), addToCart: vi.fn() });
    mockUseProductos.mockReturnValue({
      products: [
        { id: 'r1', name: 'Rec 1', price: 10, image: '/r1.jpg', category: 'X', rating: 4, reviewCount: 1, stock: 'in_stock' as const },
      ],
      loading: false,
      error: null,
    });
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Recomendado para ti')).toBeInTheDocument();
    expect(screen.getByTestId('product-card')).toHaveTextContent('Rec 1');
  });
});
