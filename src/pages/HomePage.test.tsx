import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';

const { mockUseCategorias, mockUseCart, mockUseCountdown } = vi.hoisted(() => ({
  mockUseCategorias: vi.fn(),
  mockUseCart: vi.fn(),
  mockUseCountdown: vi.fn(),
}));

vi.mock('@/shared/hooks/useCategorias', () => ({
  useCategorias: () => mockUseCategorias(),
}));

vi.mock('@/shared/context/CartContext', () => ({
  useCart: () => mockUseCart(),
}));

vi.mock('@/shared/hooks/useCountdown', () => ({
  useCountdown: () => mockUseCountdown(),
}));

vi.mock('@/shared/ui/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid="icon">{name}</span>,
}));

vi.mock('@/components/product/ProductCard', () => ({
  ProductCard: ({ product }: any) => <div data-testid="product-card">{product.name}</div>,
}));

vi.mock('@/shared/data/mock', async (importOriginal) => {
  const orig = await importOriginal<typeof import('@/shared/data/mock')>();
  return {
    ...orig,
    featuredProduct: { id: 'fp1', name: 'Featured', price: 199, image: '/feat.jpg', category: 'Tech', rating: 5, reviewCount: 100, badge: 'Best', stock: 'in_stock' },
    aiPicks: [
      { id: 'ai1', name: 'AI Pick 1', price: 89, image: '/ai1.jpg', category: 'Home', rating: 4, reviewCount: 20, stock: 'in_stock' },
    ],
    trendingProducts: [
      { id: 'tp1', name: 'Trending 1', price: 59, image: '/tp1.jpg', category: 'Tech', rating: 3, reviewCount: 8, stock: 'in_stock' },
    ],
    heroImage: '/hero.jpg',
    flashSaleProduct: { id: 'fs1', name: 'Flash Sale', price: 29, originalPrice: 79, image: '/fs.jpg', category: 'Tech', rating: 4, reviewCount: 30, stock: 'in_stock' },
    recentlyViewed: [
      { name: 'Recent 1', image: '/r1.jpg' },
    ],
    formatPrice: (v: number) => `$${v}`,
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    mockUseCart.mockReturnValue({ addToCart: vi.fn() });
    mockUseCountdown.mockReturnValue({
      hours: 4,
      minutes: 12,
      secs: 45,
      pad: (n: number) => n.toString().padStart(2, '0'),
      paused: false,
      togglePause: vi.fn(),
    });
  });

  it('shows loading state', () => {
    mockUseCategorias.mockReturnValue({ categories: [], loading: true, error: null });
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Cargando página principal/)).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseCategorias.mockReturnValue({ categories: [], loading: false, error: 'err' });
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/No se pudieron cargar las categorías/)).toBeInTheDocument();
  });

  it('renders the full page when loaded', () => {
    mockUseCategorias.mockReturnValue({
      categories: [
        { id: 'tech', label: 'Tech', icon: 'laptop_mac' },
        { id: 'home', label: 'Home', icon: 'home' },
        { id: 'mas', label: 'Mas', icon: 'menu' },
      ],
      loading: false,
      error: null,
    });
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Perfección a medida para tu estilo de vida/)).toBeInTheDocument();
    expect(screen.getByText('Descubrir por Categoría')).toBeInTheDocument();
    expect(screen.getByText('Seleccionado Para Ti')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(screen.getByText('AI Pick 1')).toBeInTheDocument();
    expect(screen.getByText('Oferta Relámpago')).toBeInTheDocument();
    expect(screen.getByText('Tendencias Actuales')).toBeInTheDocument();
    expect(screen.getByText('Continuar Navegando')).toBeInTheDocument();
    expect(screen.getAllByTestId('product-card')).toHaveLength(1);
  });
});
