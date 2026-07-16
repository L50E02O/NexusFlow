import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MerchantLayout } from './MerchantLayout';

const { mockUseAuth, mockUseAccessibility, mockUseShortcuts, mockNavigate } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockUseAccessibility: vi.fn(),
  mockUseShortcuts: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('@/shared/context/AccessibilityContext', () => ({ useAccessibility: () => mockUseAccessibility() }));
vi.mock('@/shared/context/AuthContext', () => ({ useAuth: () => mockUseAuth() }));
vi.mock('@/shared/context/ShortcutsContext', () => ({ useShortcuts: () => mockUseShortcuts() }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    NavLink: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
    Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
    Outlet: () => <div data-testid="outlet" />,
  };
});
vi.mock('./MerchantSidebar', () => ({
  MerchantSidebar: ({ variant }: any) => <div data-testid={`sidebar-${variant}`} />,
}));
vi.mock('@/components/accessibility/AccessibilityMenu', () => ({
  AccessibilityMenu: () => <div data-testid="accessibility-menu" />,
}));
vi.mock('@/shared/ui/SkipLink', () => ({ SkipLink: () => <div data-testid="skip-link" /> }));
vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));

function renderLayout() {
  return render(
    <MemoryRouter>
      <MerchantLayout />
    </MemoryRouter>,
  );
}

describe('MerchantLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAccessibility.mockReturnValue({ openPanel: vi.fn() });
    mockUseAuth.mockReturnValue({ signOut: vi.fn() });
    mockUseShortcuts.mockReturnValue({ openShortcuts: vi.fn() });
  });

  it('renders SkipLink and desktop MerchantSidebar', () => {
    renderLayout();
    expect(screen.getByTestId('skip-link')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-desktop')).toBeInTheDocument();
  });

  it('opens profile dropdown on button click', () => {
    renderLayout();
    const profileBtn = screen.getByRole('button', { name: /menú de perfil/i });
    fireEvent.click(profileBtn);
    expect(screen.getByText('Configuración')).toBeInTheDocument();
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
  });

  it('logout calls signOut and navigates to /login', async () => {
    const signOut = vi.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({ signOut });
    renderLayout();

    const profileBtn = screen.getByRole('button', { name: /menú de perfil/i });
    fireEvent.click(profileBtn);
    const logoutBtn = screen.getByText('Cerrar sesión');
    await fireEvent.click(logoutBtn);

    expect(signOut).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('opens mobile nav on hamburger click', () => {
    renderLayout();
    const menuBtn = screen.getByRole('button', { name: /abrir menú del portal/i });
    fireEvent.click(menuBtn);
    expect(screen.getByTestId('sidebar-mobile')).toBeInTheDocument();
  });
});
