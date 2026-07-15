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
import { ProtectedRoute } from './ProtectedRoute';

describe('ProtectedRoute', () => {
  it('shows spinner when loading', () => {
    mockUseAuth.mockReturnValue({ session: null, loading: true });
    render(
      <MemoryRouter>
        <ProtectedRoute>child</ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByRole('status').querySelector('span[data-icon="progress_activity"]')).toBeTruthy();
  });

  it('redirects to /login when no session', () => {
    mockUseAuth.mockReturnValue({ session: null, loading: false });
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute>child</ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText('child')).toBeNull();
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  });

  it('renders children when session exists', () => {
    mockUseAuth.mockReturnValue({ session: { user: 'test' }, loading: false });
    render(
      <MemoryRouter>
        <ProtectedRoute>child</ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('child')).toBeTruthy();
  });
});
