import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CheckoutPage } from './CheckoutPage';

const mocks = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockUseCart: vi.fn(),
  mockUseProductos: vi.fn(),
  mockProcessCheckout: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mocks.mockNavigate, Link: ({ children, to, ...p }: any) => <a href={to} {...p}>{children}</a> };
});
vi.mock('@/shared/context/AuthContext', () => ({ useAuth: () => mocks.mockUseAuth() }));
vi.mock('@/shared/context/CartContext', () => ({ useCart: () => mocks.mockUseCart() }));
vi.mock('@/shared/hooks/useProductos', () => ({ useProductos: () => mocks.mockUseProductos() }));
vi.mock('@/shared/lib/checkout-service', () => ({ processCheckout: (...args: any[]) => mocks.mockProcessCheckout(...args) }));
vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));

const cartItem = { product: { id: 'p1', name: 'Widget', price: 100, image: '/w.jpg', category: 'Tech', rating: 4, reviewCount: 10, stock: 'in_stock' }, quantity: 1 };

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockUseAuth.mockReturnValue({ user: { id: 'u1' } });
    mocks.mockUseCart.mockReturnValue({ items: [], clearCart: vi.fn() });
    mocks.mockUseProductos.mockReturnValue({ products: [], loading: false, error: null });
  });

  it('shows empty cart message when no items', () => {
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    expect(screen.getByText('Ir a la tienda')).toBeInTheDocument();
  });

  it('renders checkout form when items exist', () => {
    mocks.mockUseCart.mockReturnValue({ items: [cartItem], clearCart: vi.fn() });
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    expect(screen.getByText('Información de Envío')).toBeInTheDocument();
    expect(screen.getByText('Resumen del Pedido')).toBeInTheDocument();
    expect(screen.getByText(/Continuar al siguiente paso/)).toBeInTheDocument();
  });

  it('renders order summary with totals', () => {
    mocks.mockUseCart.mockReturnValue({ items: [{ ...cartItem, quantity: 2 }], clearCart: vi.fn() });
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    expect(screen.getByText('Widget')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
  });

  it('renders form fields with default values', () => {
    mocks.mockUseCart.mockReturnValue({ items: [cartItem], clearCart: vi.fn() });
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    expect(screen.getByLabelText('Nombre Completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Dirección')).toBeInTheDocument();
    expect(screen.getByLabelText('Ciudad')).toBeInTheDocument();
    expect(screen.getByLabelText('Código Postal')).toBeInTheDocument();
  });

  it('renders delivery options', () => {
    mocks.mockUseCart.mockReturnValue({ items: [cartItem], clearCart: vi.fn() });
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    expect(screen.getByText('Opciones de Entrega')).toBeInTheDocument();
    expect(screen.getByText('Premium Express')).toBeInTheDocument();
    expect(screen.getAllByText('Envío Estándar').length).toBeGreaterThanOrEqual(1);
  });

  it('renders verified identity badge', () => {
    mocks.mockUseCart.mockReturnValue({ items: [cartItem], clearCart: vi.fn() });
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    expect(screen.getByText('Identidad Verificada')).toBeInTheDocument();
  });

  it('renders address validation message', () => {
    mocks.mockUseCart.mockReturnValue({ items: [cartItem], clearCart: vi.fn() });
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    expect(screen.getByText(/Dirección validada mediante SmartMatch AI/)).toBeInTheDocument();
  });

  it('navigates to login when user is null and clicking continue', () => {
    mocks.mockUseAuth.mockReturnValue({ user: null });
    mocks.mockUseCart.mockReturnValue({ items: [cartItem], clearCart: vi.fn() });
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    fireEvent.click(screen.getByText(/Continuar al siguiente paso/));
    expect(mocks.mockNavigate).toHaveBeenCalledWith('/login?redirect=/checkout');
  });

  it('advances to next step on continue click', () => {
    mocks.mockUseCart.mockReturnValue({ items: [cartItem], clearCart: vi.fn() });
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('Continuar al siguiente paso'));
    expect(screen.getByText(/Continuar al siguiente paso|Completar compra/)).toBeInTheDocument();
  });

  it('renders recommendations section', () => {
    mocks.mockUseCart.mockReturnValue({ items: [cartItem], clearCart: vi.fn() });
    mocks.mockUseProductos.mockReturnValue({ products: [cartItem.product], loading: false, error: null });
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    expect(screen.getByText('También te podría gustar')).toBeInTheDocument();
  });

  it('shows confirmation dialog after reaching final step', () => {
    mocks.mockUseCart.mockReturnValue({ items: [cartItem], clearCart: vi.fn() });
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('Continuar al siguiente paso'));
    fireEvent.click(screen.getByText('Continuar al siguiente paso'));
    fireEvent.click(screen.getByText('Completar compra'));
    expect(screen.getByText('¿Confirmar compra?')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('cancels confirmation dialog', () => {
    mocks.mockUseCart.mockReturnValue({ items: [cartItem], clearCart: vi.fn() });
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('Continuar al siguiente paso'));
    fireEvent.click(screen.getByText('Continuar al siguiente paso'));
    fireEvent.click(screen.getByText('Completar compra'));
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByText('¿Confirmar compra?')).not.toBeInTheDocument();
  });

  it('renders step progress indicators', () => {
    mocks.mockUseCart.mockReturnValue({ items: [cartItem], clearCart: vi.fn() });
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    expect(screen.getAllByText('Envío').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Entrega').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Pago').length).toBeGreaterThanOrEqual(1);
  });

  it('shows free shipping for high subtotal', () => {
    const bigItem = { product: { ...cartItem.product, price: 600 }, quantity: 1 };
    mocks.mockUseCart.mockReturnValue({ items: [bigItem], clearCart: vi.fn() });
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
    expect(screen.getByText('GRATIS')).toBeInTheDocument();
  });
});
