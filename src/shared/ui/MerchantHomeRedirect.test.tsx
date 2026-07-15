import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';

const { mockUseAuth } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
}));

vi.mock('@/shared/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/shared/ui/Icon', () => ({
  Icon: (props: any) => <span data-icon={props.name} />,
}));

vi.mock('@/pages/HomePage', () => ({
  HomePage: () => <div data-testid="home-page" />,
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    Navigate: ({ to, replace }: { to: string; replace?: boolean }) => (
      <span data-testid="navigate" data-to={to} data-replace={String(replace)} />
    ),
  };
});

import { MemoryRouter } from 'react-router-dom';
import { MerchantHomeRedirect } from './MerchantHomeRedirect';

describe('MerchantHomeRedirect', () => {
  it('shows spinner when loading', () => {
    mockUseAuth.mockReturnValue({ session: null, loading: true, isMerchant: false });
    render(
      <MemoryRouter>
        <MerchantHomeRedirect />
      </MemoryRouter>
    );
    expect(screen.getByRole('status').querySelector('span[data-icon="progress_activity"]')).toBeTruthy();
  });

  it('redirects to /merchant when session and isMerchant', () => {
    mockUseAuth.mockReturnValue({ session: { user: 'test' }, loading: false, isMerchant: true });
    render(
      <MemoryRouter initialEntries={['/']}>
        <MerchantHomeRedirect />
      </MemoryRouter>
    );
    expect(screen.queryByTestId('home-page')).toBeNull();
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/merchant');
  });

  it('renders HomePage when not merchant', () => {
    mockUseAuth.mockReturnValue({ session: { user: 'test' }, loading: false, isMerchant: false });
    render(
      <MemoryRouter>
        <MerchantHomeRedirect />
      </MemoryRouter>
    );
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });
});
