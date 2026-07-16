import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesPage } from './FavoritesPage';

const { mockUseFavorites, mockUseCart, mockUseProductos } = vi.hoisted(() => ({
  mockUseFavorites: vi.fn(),
  mockUseCart: vi.fn(),
  mockUseProductos: vi.fn(),
}));

vi.mock('@/shared/context/FavoritesContext', () => ({
  useFavorites: () => mockUseFavorites(),
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

vi.mock('@/shared/data/mock', async (importOriginal) => {
  const orig = await importOriginal<typeof import('@/shared/data/mock')>();
  return { ...orig, formatPrice: (v: number) => `$${v}` };
});

const productA = { id: 'pa', name: 'Alpha', price: 50, image: '/a.jpg', category: 'Tech', rating: 4, reviewCount: 10, stock: 'in_stock' as const };

describe('FavoritesPage', () => {
  it('shows loading state', () => {
    mockUseFavorites.mockReturnValue({ favoriteIds: [], removeFavorite: vi.fn() });
    mockUseCart.mockReturnValue({ addToCart: vi.fn() });
    mockUseProductos.mockReturnValue({ products: [], loading: true, error: null });
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Cargando favoritos/)).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseFavorites.mockReturnValue({ favoriteIds: [], removeFavorite: vi.fn() });
    mockUseCart.mockReturnValue({ addToCart: vi.fn() });
    mockUseProductos.mockReturnValue({ products: [], loading: false, error: 'fail' });
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/No se pudieron cargar tus favoritos/)).toBeInTheDocument();
  });

  it('shows empty favorites', () => {
    mockUseFavorites.mockReturnValue({ favoriteIds: [], removeFavorite: vi.fn() });
    mockUseCart.mockReturnValue({ addToCart: vi.fn() });
    mockUseProductos.mockReturnValue({ products: [], loading: false, error: null });
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Mis Favoritos')).toBeInTheDocument();
    expect(screen.getByText(/No tienes favoritos/)).toBeInTheDocument();
  });

  it('renders favorite products', () => {
    mockUseFavorites.mockReturnValue({ favoriteIds: ['pa'], removeFavorite: vi.fn() });
    mockUseCart.mockReturnValue({ addToCart: vi.fn() });
    mockUseProductos.mockReturnValue({ products: [productA], loading: false, error: null });
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText(/1 productos/)).toBeInTheDocument();
  });
});
