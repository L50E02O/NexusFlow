import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PurchaseHistoryPage } from './PurchaseHistoryPage';

const mocks = vi.hoisted(() => ({
  mockUseCart: vi.fn(),
}));

vi.mock('@/shared/context/CartContext', () => ({ useCart: () => mocks.mockUseCart() }));
vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, Link: ({ children, to, ...p }: any) => <a href={to} {...p}>{children}</a> };
});

describe('PurchaseHistoryPage', () => {
  beforeEach(() => {
    mocks.mockUseCart.mockReturnValue({ addToCart: vi.fn() });
  });

  it('renders page heading', () => {
    render(<MemoryRouter><PurchaseHistoryPage /></MemoryRouter>);
    expect(screen.getByText('Historial de Compras')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<MemoryRouter><PurchaseHistoryPage /></MemoryRouter>);
    expect(screen.getByPlaceholderText(/Nº de pedido/)).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    render(<MemoryRouter><PurchaseHistoryPage /></MemoryRouter>);
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getAllByText('En camino').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Entregados')).toBeInTheDocument();
    expect(screen.getByText('Cancelados')).toBeInTheDocument();
  });

  it('renders recommendations section', () => {
    render(<MemoryRouter><PurchaseHistoryPage /></MemoryRouter>);
    expect(screen.getByText('Recomendaciones para ti')).toBeInTheDocument();
  });

  it('renders order cards with order data', () => {
    render(<MemoryRouter><PurchaseHistoryPage /></MemoryRouter>);
    expect(screen.getByText(/NF-88294/)).toBeInTheDocument();
    expect(screen.getByText(/NF-12345/)).toBeInTheDocument();
  });

  it('renders order status labels', () => {
    render(<MemoryRouter><PurchaseHistoryPage /></MemoryRouter>);
    expect(screen.getAllByText('En camino').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Entregado')).toBeInTheDocument();
  });

  it('renders track and buy buttons based on status', () => {
    render(<MemoryRouter><PurchaseHistoryPage /></MemoryRouter>);
    expect(screen.getByText('Rastrear Pedido')).toBeInTheDocument();
    expect(screen.getByText('Volver a Comprar')).toBeInTheDocument();
  });

  it('renders view details buttons', () => {
    render(<MemoryRouter><PurchaseHistoryPage /></MemoryRouter>);
    expect(screen.getAllByText('Ver Detalles').length).toBeGreaterThanOrEqual(1);
  });

  it('renders store link', () => {
    render(<MemoryRouter><PurchaseHistoryPage /></MemoryRouter>);
    expect(screen.getByText('Seguir comprando en la tienda')).toBeInTheDocument();
  });

  it('renders page description', () => {
    render(<MemoryRouter><PurchaseHistoryPage /></MemoryRouter>);
    expect(screen.getByText(/Revisa y gestiona todos tus pedidos/)).toBeInTheDocument();
  });

  it('renders order dates', () => {
    render(<MemoryRouter><PurchaseHistoryPage /></MemoryRouter>);
    expect(screen.getByText('24 Oct 2023')).toBeInTheDocument();
    expect(screen.getByText('12 Oct 2023')).toBeInTheDocument();
  });

  it('renders recommendations products', () => {
    render(<MemoryRouter><PurchaseHistoryPage /></MemoryRouter>);
    expect(screen.getByText('Recomendaciones para ti')).toBeInTheDocument();
  });
});
