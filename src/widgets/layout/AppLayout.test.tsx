import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';

const { mockUseShortcuts, mockUseAuth, mockUseCart, mockUseI18n, mockUseAccessibility, mockUseChat, mockNavigate } = vi.hoisted(() => ({
  mockUseShortcuts: vi.fn(),
  mockUseAuth: vi.fn(),
  mockUseCart: vi.fn(),
  mockUseI18n: vi.fn(),
  mockUseAccessibility: vi.fn(),
  mockUseChat: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('@/shared/context/ShortcutsContext', () => ({ useShortcuts: () => mockUseShortcuts() }));
vi.mock('@/shared/context/AuthContext', () => ({ useAuth: () => mockUseAuth() }));
vi.mock('@/shared/context/CartContext', () => ({ useCart: () => mockUseCart() }));
vi.mock('@/shared/i18n/I18nContext', () => ({ useI18n: () => mockUseI18n() }));
vi.mock('@/shared/context/AccessibilityContext', () => ({ useAccessibility: () => mockUseAccessibility() }));
vi.mock('@/shared/context/ChatContext', () => ({ useChat: () => mockUseChat() }));
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
vi.mock('./TopNav', () => ({ TopNav: () => <div data-testid="topnav" /> }));
vi.mock('./Footer', () => ({ Footer: () => <div data-testid="footer" /> }));
vi.mock('@/components/chat/AiChatWidget', () => ({ AiChatWidget: () => <div data-testid="ai-chat-widget" /> }));
vi.mock('@/components/accessibility/AccessibilityMenu', () => ({ AccessibilityMenu: () => <div data-testid="accessibility-menu" /> }));
vi.mock('@/shared/ui/SkipLink', () => ({ SkipLink: () => <div data-testid="skip-link" /> }));
vi.mock('@/shared/ui/Breadcrumbs', () => ({ Breadcrumbs: () => <div data-testid="breadcrumbs" /> }));
vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));

function renderLayout(props: Record<string, any> = {}) {
  return render(
    <MemoryRouter>
      <AppLayout {...props} />
    </MemoryRouter>,
  );
}

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseShortcuts.mockReturnValue({ openShortcuts: vi.fn() });
    mockUseAuth.mockReturnValue({ session: null });
    mockUseCart.mockReturnValue({ itemCount: 0 });
    mockUseI18n.mockReturnValue({ locale: 'es', t: (k: string) => k });
    mockUseAccessibility.mockReturnValue({ openPanel: vi.fn() });
    mockUseChat.mockReturnValue({ open: vi.fn() });
  });

  it('renders TopNav, Breadcrumbs, and Footer by default', () => {
    renderLayout();
    expect(screen.getByTestId('topnav')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('hides Footer when showFooter=false', () => {
    renderLayout({ showFooter: false });
    expect(screen.getByTestId('topnav')).toBeInTheDocument();
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('hides AiChatWidget when showFab=false', () => {
    renderLayout({ showFab: false });
    expect(screen.queryByTestId('ai-chat-widget')).not.toBeInTheDocument();
  });

  it('keyboard shortcuts button exists and calls openShortcuts', () => {
    const openShortcuts = vi.fn();
    mockUseShortcuts.mockReturnValue({ openShortcuts });
    renderLayout();
    const btn = screen.getByRole('button', { name: /atajos de teclado/i });
    fireEvent.click(btn);
    expect(openShortcuts).toHaveBeenCalled();
  });
});
