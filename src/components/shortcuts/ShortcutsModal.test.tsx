import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ShortcutsModal } from './ShortcutsModal';

const { mockUseShortcuts } = vi.hoisted(() => ({
  mockUseShortcuts: vi.fn(),
}));

vi.mock('@/shared/i18n/I18nContext', () => ({
  useI18n: () => ({
    locale: 'es',
    setLocale: vi.fn(),
    t: (k: string) => k,
  }),
}));
vi.mock('@/shared/context/ShortcutsContext', () => ({
  useShortcuts: () => mockUseShortcuts(),
}));
vi.mock('@/shared/hooks/useFocusTrap', () => ({
  useFocusTrap: vi.fn(),
}));

describe('ShortcutsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    mockUseShortcuts.mockReturnValue({
      shortcutsOpen: false,
      closeShortcuts: vi.fn(),
    });
    const { container } = render(<ShortcutsModal />);
    expect(container.innerHTML).toBe('');
  });

  it('renders modal with shortcut groups when open', () => {
    mockUseShortcuts.mockReturnValue({
      shortcutsOpen: true,
      closeShortcuts: vi.fn(),
    });
    render(<ShortcutsModal />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('shortcuts.title')).toBeInTheDocument();
  });
});
