import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartRecoveryPage } from './CartRecoveryPage';

const mocks = vi.hoisted(() => ({
  mockUseCountdown: vi.fn(),
  mockUseCart: vi.fn(),
}));

vi.mock('@/shared/hooks/useCountdown', () => ({ useCountdown: () => mocks.mockUseCountdown() }));
vi.mock('@/shared/context/CartContext', () => ({ useCart: () => mocks.mockUseCart() }));
vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, Link: ({ children, to, ...p }: any) => <a href={to} {...p}>{children}</a> };
});

describe('CartRecoveryPage', () => {
  const mockTogglePause = vi.fn();
  const mockAddToCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockUseCountdown.mockReturnValue({
      pad: (n: number) => n.toString().padStart(2, '0'),
      minutes: 14, secs: 59, total: 899, paused: false, togglePause: mockTogglePause,
    });
    mocks.mockUseCart.mockReturnValue({ addToCart: mockAddToCart });
  });

  it('renders recovery heading', () => {
    render(<MemoryRouter><CartRecoveryPage /></MemoryRouter>);
    expect(screen.getByText(/Te extrañamos/)).toBeInTheDocument();
  });

  it('renders special offer section', () => {
    render(<MemoryRouter><CartRecoveryPage /></MemoryRouter>);
    expect(screen.getByText('OFERTA ESPECIAL')).toBeInTheDocument();
    expect(screen.getByText(/10% extra hoy/)).toBeInTheDocument();
    expect(screen.getByText('NEXUS10')).toBeInTheDocument();
  });

  it('renders order summary', () => {
    render(<MemoryRouter><CartRecoveryPage /></MemoryRouter>);
    expect(screen.getByText('Resumen del pedido')).toBeInTheDocument();
    expect(screen.getByText('Finalizar compra')).toBeInTheDocument();
  });

  it('renders countdown timer', () => {
    render(<MemoryRouter><CartRecoveryPage /></MemoryRouter>);
    expect(screen.getByText('Expira en:')).toBeInTheDocument();
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('renders abandoned cart products', () => {
    render(<MemoryRouter><CartRecoveryPage /></MemoryRouter>);
    expect(screen.getByText('Productos en tu carrito')).toBeInTheDocument();
    expect(screen.getByText('Nexus Watch Series S')).toBeInTheDocument();
    expect(screen.getByText('Acoustics Ultra Pro')).toBeInTheDocument();
  });

  it('renders discount and subtotal', () => {
    render(<MemoryRouter><CartRecoveryPage /></MemoryRouter>);
    expect(screen.getByText(/Subtotal/)).toBeInTheDocument();
    expect(screen.getByText(/Descuento/)).toBeInTheDocument();
    expect(screen.getByText('NEXUS10')).toBeInTheDocument();
  });

  it('calls togglePause on pause button click', () => {
    render(<MemoryRouter><CartRecoveryPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('Pausar'));
    expect(mockTogglePause).toHaveBeenCalled();
  });

  it('shows Reanudar when paused', () => {
    mocks.mockUseCountdown.mockReturnValue({
      pad: (n: number) => n.toString().padStart(2, '0'),
      minutes: 14, secs: 59, total: 899, paused: true, togglePause: mockTogglePause,
    });
    render(<MemoryRouter><CartRecoveryPage /></MemoryRouter>);
    expect(screen.getByText('Reanudar')).toBeInTheDocument();
  });

  it('renders cart link', () => {
    render(<MemoryRouter><CartRecoveryPage /></MemoryRouter>);
    expect(screen.getByText('Volver al carrito')).toBeInTheDocument();
  });

  it('renders secure transaction note', () => {
    render(<MemoryRouter><CartRecoveryPage /></MemoryRouter>);
    expect(screen.getByText('Transacción 100% segura y cifrada')).toBeInTheDocument();
  });

  it('renders product variants', () => {
    render(<MemoryRouter><CartRecoveryPage /></MemoryRouter>);
    expect(screen.getByText('Acabado Titanio / Correa de Cuero')).toBeInTheDocument();
    expect(screen.getByText('Cancelación de Ruido Activa / Negro Mate')).toBeInTheDocument();
  });
});
