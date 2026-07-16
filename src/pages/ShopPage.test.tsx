import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ShopPage } from './ShopPage';

const mocks = vi.hoisted(() => ({
  mockUseCart: vi.fn(),
  mockUseProductos: vi.fn(),
  mockUseCategorias: vi.fn(),
}));

vi.mock('@/shared/context/CartContext', () => ({ useCart: () => mocks.mockUseCart() }));
vi.mock('@/shared/hooks/useProductos', () => ({ useProductos: () => mocks.mockUseProductos() }));
vi.mock('@/shared/hooks/useCategorias', () => ({ useCategorias: () => mocks.mockUseCategorias() }));
vi.mock('@/components/product/ProductCard', () => ({
  ProductCard: ({ product }: any) => <div data-testid="product-card">{product.name}</div>,
}));

const categories = [
  { id: 'tech', label: 'Tech', icon: 'laptop_mac' },
  { id: 'home', label: 'Home', icon: 'home' },
];

const products = [
  { id: 'p1', name: 'Product One', price: 99, image: '/img1.jpg', category: 'Tech', rating: 4, reviewCount: 10, stock: 'in_stock' },
  { id: 'p2', name: 'Product Two', price: 49, image: '/img2.jpg', category: 'Home', rating: 3, reviewCount: 5, stock: 'in_stock' },
];

describe('ShopPage', () => {
  beforeEach(() => {
    mocks.mockUseCart.mockReturnValue({ addToCart: vi.fn() });
    mocks.mockUseProductos.mockReturnValue({ products, loading: false, error: null });
    mocks.mockUseCategorias.mockReturnValue({ categories, loading: false, error: null });
  });

  it('shows loading state', () => {
    mocks.mockUseProductos.mockReturnValue({ products: [], loading: true, error: null });
    render(<MemoryRouter><ShopPage /></MemoryRouter>);
    expect(screen.getByText(/Cargando catálogo/)).toBeInTheDocument();
  });

  it('shows error state', () => {
    mocks.mockUseProductos.mockReturnValue({ products: [], loading: false, error: 'err' });
    render(<MemoryRouter><ShopPage /></MemoryRouter>);
    expect(screen.getByText(/No se pudo cargar la tienda/)).toBeInTheDocument();
  });

  it('renders products when loaded', () => {
    render(<MemoryRouter><ShopPage /></MemoryRouter>);
    expect(screen.getByText('Accesorios de lujo')).toBeInTheDocument();
    expect(screen.getAllByTestId('product-card')).toHaveLength(2);
  });

  it('shows empty state when no products match', () => {
    mocks.mockUseProductos.mockReturnValue({ products: [], loading: false, error: null });
    render(<MemoryRouter><ShopPage /></MemoryRouter>);
    expect(screen.getByText(/No se encontraron productos/)).toBeInTheDocument();
  });

  it('shows loading when categories loading', () => {
    mocks.mockUseCategorias.mockReturnValue({ categories: [], loading: true, error: null });
    render(<MemoryRouter><ShopPage /></MemoryRouter>);
    expect(screen.getByText(/Cargando catálogo/)).toBeInTheDocument();
  });

  it('shows error when categories error', () => {
    mocks.mockUseCategorias.mockReturnValue({ categories: [], loading: false, error: 'cat-err' });
    render(<MemoryRouter><ShopPage /></MemoryRouter>);
    expect(screen.getByText(/No se pudo cargar la tienda/)).toBeInTheDocument();
  });

  it('renders filter sidebar with price range and sort', () => {
    render(<MemoryRouter><ShopPage /></MemoryRouter>);
    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByText('Limpiar todo')).toBeInTheDocument();
    expect(screen.getByLabelText(/Rango de precios/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ordenar por/)).toBeInTheDocument();
    expect(screen.getByText('Solo en stock')).toBeInTheDocument();
  });

  it('shows product count', () => {
    render(<MemoryRouter><ShopPage /></MemoryRouter>);
    expect(screen.getByText(/Mostrando 2 de 2 artículos/)).toBeInTheDocument();
  });

  it('renders categories error state with categories error', () => {
    mocks.mockUseCategorias.mockReturnValue({ categories: [], loading: false, error: 'err' });
    render(<MemoryRouter><ShopPage /></MemoryRouter>);
    expect(screen.getByText(/No se pudo cargar la tienda/)).toBeInTheDocument();
  });

  it('displays category label when cat param set', () => {
    render(
      <MemoryRouter initialEntries={['/tienda?cat=tech']}>
        <ShopPage />
      </MemoryRouter>,
    );
    expect(screen.getAllByText('Tech').length).toBeGreaterThanOrEqual(1);
  });
});
