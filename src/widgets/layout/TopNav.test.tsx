import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TopNav } from './TopNav';

const { mockUseAuth, mockUseCart, mockUseI18n, mockUseAccessibility, mockUseChat, mockUseShortcuts, mockNavigate } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockUseCart: vi.fn(),
  mockUseI18n: vi.fn(),
  mockUseAccessibility: vi.fn(),
  mockUseChat: vi.fn(),
  mockUseShortcuts: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('@/shared/context/AuthContext', () => ({ useAuth: () => mockUseAuth() }));
vi.mock('@/shared/context/CartContext', () => ({ useCart: () => mockUseCart() }));
vi.mock('@/shared/i18n/I18nContext', () => ({ useI18n: () => mockUseI18n() }));
vi.mock('@/shared/context/AccessibilityContext', () => ({ useAccessibility: () => mockUseAccessibility() }));
vi.mock('@/shared/context/ChatContext', () => ({ useChat: () => mockUseChat() }));
vi.mock('@/shared/context/ShortcutsContext', () => ({ useShortcuts: () => mockUseShortcuts() }));
vi.mock('@/shared/data/mock', () => ({
  navLinks: [
    { to: '/tienda', key: 'nav.shop' },
    { to: '/categorias', key: 'nav.categories' },
    { to: '/sostenibilidad', key: 'nav.sustainability' },
    { to: '/soporte', key: 'nav.support' },
  ],
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
vi.mock('@/shared/hooks/useFocusTrap', () => ({ useFocusTrap: () => {} }));

const defaultI18n = {
  t: (k: string) => k,
  locale: 'es',
  setLocale: vi.fn(),
};

function renderTopNav(props: Record<string, any> = {}) {
  return render(
    <MemoryRouter>
      <TopNav {...props} />
    </MemoryRouter>,
  );
}

describe('TopNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseI18n.mockReturnValue(defaultI18n);
    mockUseCart.mockReturnValue({ itemCount: 0 });
    mockUseAuth.mockReturnValue({ session: null, signOut: vi.fn() });
    mockUseAccessibility.mockReturnValue({ openPanel: vi.fn() });
    mockUseChat.mockReturnValue({ open: vi.fn() });
  });

  it('renders NexusFlow brand link', () => {
    renderTopNav();
    const brand = screen.getByText('NexusFlow');
    expect(brand).toBeInTheDocument();
    expect(brand.closest('a')).toHaveAttribute('href', '/');
  });

  it('shows cart badge when itemCount > 0', () => {
    mockUseCart.mockReturnValue({ itemCount: 3 });
    renderTopNav();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('hides cart badge when itemCount is 0', () => {
    mockUseCart.mockReturnValue({ itemCount: 0 });
    renderTopNav();
    const cartLink = screen.getByRole('link', { name: /cart\.label/i });
    expect(cartLink.querySelector('[data-icon="shopping_cart"]')).toBeInTheDocument();
    expect(cartLink.textContent).not.toMatch(/\d/);
  });

  it('shows login link when no session', () => {
    mockUseAuth.mockReturnValue({ session: null, signOut: vi.fn() });
    renderTopNav();
    const accountBtn = screen.getByRole('button', { name: /account\.menu/i });
    fireEvent.click(accountBtn);
    expect(screen.getByText('nav.login')).toBeInTheDocument();
  });

  it('shows account links when session exists', () => {
    mockUseAuth.mockReturnValue({ session: { user: { id: '1' } }, signOut: vi.fn() });
    renderTopNav();
    const accountBtn = screen.getByRole('button', { name: /account\.menu/i });
    fireEvent.click(accountBtn);
    expect(screen.getByText('nav.profile')).toBeInTheDocument();
    expect(screen.getByText('nav.favorites')).toBeInTheDocument();
    expect(screen.getByText('nav.logout')).toBeInTheDocument();
  });

  it('search form navigates to /tienda?q=...', () => {
    renderTopNav();
    const searchInput = screen.getAllByRole('searchbox')[0];
    fireEvent.change(searchInput, { target: { value: 'laptop' } });
    fireEvent.submit(searchInput.closest('form')!);
    expect(mockNavigate).toHaveBeenCalledWith('/tienda?q=laptop');
  });

  it('opens mobile nav on menu button click', () => {
    renderTopNav();
    const menuBtn = screen.getByRole('button', { name: /menu\.open/i });
    fireEvent.click(menuBtn);
    expect(screen.getByRole('dialog', { name: /mobile\.nav\.label/i })).toBeInTheDocument();
  });

  it('language dropdown toggles locale', () => {
    const setLocale = vi.fn();
    mockUseI18n.mockReturnValue({ ...defaultI18n, setLocale });
    renderTopNav();
    const langBtn = screen.getByRole('button', { name: /language\.select/i });
    fireEvent.click(langBtn);
    const enBtn = screen.getByRole('button', { name: /language\.en/i });
    fireEvent.click(enBtn);
    expect(setLocale).toHaveBeenCalledWith('en');
  });
});
