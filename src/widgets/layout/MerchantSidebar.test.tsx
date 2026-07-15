import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MerchantSidebar } from './MerchantSidebar';

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    NavLink: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
    Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
  };
});
vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('@/shared/data/merchantMock', () => ({
  merchantNav: [
    { to: '/merchant', icon: 'dashboard', label: 'Dashboard' },
    { to: '/merchant/productos', icon: 'inventory_2', label: 'Productos', end: true },
  ],
}));

function renderSidebar(variant: 'desktop' | 'mobile', onNavigate?: () => void) {
  return render(
    <MemoryRouter>
      <MerchantSidebar variant={variant} onNavigate={onNavigate} />
    </MemoryRouter>,
  );
}

describe('MerchantSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('desktop variant renders sidebar with heading', () => {
    renderSidebar('desktop');
    expect(screen.getByText('Portal del Comerciante')).toBeInTheDocument();
    expect(screen.getByText('Nivel Empresarial')).toBeInTheDocument();
  });

  it('desktop variant renders navigation links', () => {
    renderSidebar('desktop');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
  });

  it('desktop variant has "Añadir Producto" button', () => {
    renderSidebar('desktop');
    expect(screen.getByText('Añadir Producto')).toBeInTheDocument();
  });

  it('"Añadir Producto" button navigates to /merchant/productos', () => {
    renderSidebar('desktop');
    fireEvent.click(screen.getByText('Añadir Producto'));
    expect(mockNavigate).toHaveBeenCalledWith('/merchant/productos');
  });

  it('"Tienda pública" link goes to /', () => {
    renderSidebar('desktop');
    const link = screen.getByText('Tienda pública');
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });

  it('mobile variant renders navigation links', () => {
    renderSidebar('mobile');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Tienda pública')).toBeInTheDocument();
  });

  it('mobile "Añadir Producto" navigates and calls onNavigate', () => {
    const onNavigate = vi.fn();
    renderSidebar('mobile', onNavigate);
    fireEvent.click(screen.getByText('Añadir Producto'));
    expect(mockNavigate).toHaveBeenCalledWith('/merchant/productos');
    expect(onNavigate).toHaveBeenCalled();
  });
});
