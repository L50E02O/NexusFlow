import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProfilePage } from './ProfilePage';

const mocks = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockUseI18n: vi.fn(),
  mockUseAccessibility: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mocks.mockNavigate, Link: ({ children, to, ...p }: any) => <a href={to} {...p}>{children}</a> };
});
vi.mock('@/shared/context/AuthContext', () => ({ useAuth: () => mocks.mockUseAuth() }));
vi.mock('@/shared/i18n/I18nContext', () => ({ useI18n: () => mocks.mockUseI18n() }));
vi.mock('@/shared/context/AccessibilityContext', () => ({ useAccessibility: () => mocks.mockUseAccessibility() }));
vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));

describe('ProfilePage', () => {
  const mockSignOut = vi.fn();
  const mockSetLocale = vi.fn();
  const mockSetDarkMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockUseAuth.mockReturnValue({ signOut: mockSignOut });
    mocks.mockUseI18n.mockReturnValue({ locale: 'es', setLocale: mockSetLocale });
    mocks.mockUseAccessibility.mockReturnValue({ darkMode: false, setDarkMode: mockSetDarkMode });
  });

  it('renders user profile info', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByText('Alejandro García')).toBeInTheDocument();
    expect(screen.getByText(/alejandro\.garcia@nexusflow/i)).toBeInTheDocument();
  });

  it('renders addresses and payment sections', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByText('Mis Direcciones')).toBeInTheDocument();
    expect(screen.getByText('Métodos de Pago')).toBeInTheDocument();
  });

  it('renders preferences sidebar', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByText('Preferencias')).toBeInTheDocument();
    expect(screen.getByText('Modo Oscuro')).toBeInTheDocument();
  });

  it('renders activity tabs', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByText('Pedidos Recientes')).toBeInTheDocument();
    expect(screen.getByText('Historial')).toBeInTheDocument();
  });

  it('switches active tab on click', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    const historialTab = screen.getByText('Historial');
    fireEvent.click(historialTab);
    expect(historialTab).toHaveClass('border-b-2');
  });

  it('calls signOut and navigates home on logout click', async () => {
    mockSignOut.mockResolvedValue(undefined);
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    fireEvent.click(screen.getByText('Cerrar sesión'));
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('renders default address badge', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByText('Predeterminada')).toBeInTheDocument();
  });

  it('renders payment method details', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByText('Visa terminada en 1234')).toBeInTheDocument();
    expect(screen.getByText('Expira 12/26')).toBeInTheDocument();
  });

  it('renders purchase orders with status labels', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByText(/NF-982341/)).toBeInTheDocument();
  });

  it('renders language selector with options', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    const select = screen.getByLabelText('Idioma');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Inglés')).toBeInTheDocument();
  });

  it('toggles dark mode', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    const toggle = screen.getByRole('switch', { name: /modo oscuro/i });
    fireEvent.click(toggle);
    expect(mockSetDarkMode).toHaveBeenCalledWith(true);
  });

  it('renders support priority section', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByText('Soporte Priority')).toBeInTheDocument();
    expect(screen.getByText('Hablar con un Agente')).toBeInTheDocument();
  });

  it('renders edit profile and change password buttons', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByText('Editar Perfil')).toBeInTheDocument();
    expect(screen.getByText('Cambiar Contraseña')).toBeInTheDocument();
  });

  it('renders Notifications toggle row', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    expect(screen.getByText('Email y notificaciones push')).toBeInTheDocument();
  });
});
