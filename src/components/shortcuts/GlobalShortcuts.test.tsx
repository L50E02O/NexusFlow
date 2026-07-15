import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GlobalShortcuts } from './GlobalShortcuts';

const { mockUseKeyboardShortcuts } = vi.hoisted(() => ({
  mockUseKeyboardShortcuts: vi.fn(),
}));

vi.mock('@/shared/hooks/useKeyboardShortcuts', () => ({
  useKeyboardShortcuts: (...args: any[]) => mockUseKeyboardShortcuts(...args),
}));
vi.mock('@/shared/context/ShortcutsContext', () => ({
  useShortcuts: () => ({
    openShortcuts: vi.fn(),
    closeShortcuts: vi.fn(),
    shortcutsOpen: false,
  }),
}));
vi.mock('@/shared/context/AuthContext', () => ({
  useAuth: () => ({
    isMerchant: false,
  }),
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

describe('GlobalShortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing and registers shortcuts', () => {
    render(
      <MemoryRouter>
        <GlobalShortcuts />
      </MemoryRouter>,
    );
    expect(mockUseKeyboardShortcuts).toHaveBeenCalled();
  });
});
