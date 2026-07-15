import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import type { Product } from '@/shared/data/mock';

const { mockUseFavorites, mockUseAuth, mockUseNavigate } = vi.hoisted(() => ({
  mockUseFavorites: vi.fn(),
  mockUseAuth: vi.fn(),
  mockUseNavigate: vi.fn(),
}));

vi.mock('@/shared/context/FavoritesContext', () => ({
  useFavorites: () => mockUseFavorites(),
}));
vi.mock('@/shared/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockUseNavigate,
    Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
  };
});
vi.mock('@/shared/ui/Icon', () => ({
  Icon: (props: any) => <span data-icon={props.name} data-filled={props.filled} />,
}));

const baseProduct: Product = {
  id: 'test-product',
  name: 'Test Product',
  price: 299,
  image: 'https://example.com/image.jpg',
  category: 'Tech',
  rating: 4.5,
  reviewCount: 10,
  stock: 'in_stock',
};

function renderCard(props: Partial<Parameters<typeof ProductCard>[0]> = {}) {
  return render(
    <MemoryRouter>
      <ProductCard product={baseProduct} {...props} />
    </MemoryRouter>,
  );
}

describe('ProductCard', () => {
  const toggleFavorite = vi.fn();
  const navigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFavorites.mockReturnValue({ isFavorite: () => false, toggleFavorite });
    mockUseAuth.mockReturnValue({ session: { user: {} } });
    mockUseNavigate.mockReturnValue(navigate);
  });

  it('renders product name and price', () => {
    renderCard();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$299.00')).toBeInTheDocument();
  });

  it('shows in-stock badge', () => {
    renderCard();
    expect(screen.getByText('En stock')).toBeInTheDocument();
  });

  it('shows low stock badge', () => {
    renderCard({ product: { ...baseProduct, stock: 'low' } });
    expect(screen.getByText('Poco stock')).toBeInTheDocument();
  });

  it('shows out of stock badge', () => {
    renderCard({ product: { ...baseProduct, stock: 'out' } });
    expect(screen.getByText('Agotado')).toBeInTheDocument();
  });

  it('disables add-to-cart button when out of stock', () => {
    renderCard({ product: { ...baseProduct, stock: 'out' } });
    const btn = screen.getByRole('button', { name: /añadir rápido/i });
    expect(btn).toBeDisabled();
  });

  it('enables add-to-cart button when in stock', () => {
    renderCard();
    const btn = screen.getByRole('button', { name: /añadir rápido/i });
    expect(btn).not.toBeDisabled();
  });

  it('calls onAddToCart with product id when add button is clicked', () => {
    const onAddToCart = vi.fn();
    renderCard({ onAddToCart });
    fireEvent.click(screen.getByRole('button', { name: /añadir rápido/i }));
    expect(onAddToCart).toHaveBeenCalledWith('test-product');
  });

  it('renders product image', () => {
    renderCard();
    const img = screen.getByAltText('Test Product');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('favorite button shows not-favorited state', () => {
    renderCard();
    const favBtn = screen.getByRole('button', { name: /añadir.*a favoritos/i });
    expect(favBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('favorite button shows favorited state when favorited', () => {
    mockUseFavorites.mockReturnValue({
      isFavorite: (id: string) => id === 'test-product',
      toggleFavorite,
    });
    renderCard();
    const favBtn = screen.getByRole('button', { name: /quitar.*de favoritos/i });
    expect(favBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls toggleFavorite when favorite button is clicked with session', () => {
    renderCard();
    const favBtn = screen.getByRole('button', { name: /añadir.*a favoritos/i });
    fireEvent.click(favBtn);
    expect(toggleFavorite).toHaveBeenCalledWith('test-product');
  });

  it('redirects to login when favorite button is clicked without session', () => {
    mockUseAuth.mockReturnValue({ session: null });
    renderCard();
    const favBtn = screen.getByRole('button', { name: /añadir.*a favoritos/i });
    fireEvent.click(favBtn);
    expect(mockUseNavigate).toHaveBeenCalledWith('/login', expect.anything());
  });

  it('renders rating stars', () => {
    renderCard();
    expect(screen.getByLabelText('Valoración: 4.5 de 5')).toBeInTheDocument();
  });

  it('renders review count', () => {
    renderCard();
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('renders compact variant', () => {
    renderCard({ variant: 'compact' });
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$299.00')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /añadir rápido/i })).not.toBeInTheDocument();
  });

  it('renders links to product page', () => {
    renderCard();
    const links = screen.getAllByRole('link');
    const storeLinks = links.filter((l) => l.getAttribute('href')?.includes('/tienda'));
    expect(storeLinks.length).toBeGreaterThanOrEqual(1);
  });
});
