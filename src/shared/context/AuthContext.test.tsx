import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { type ReactNode } from 'react';
import { AuthProvider, useAuth } from './AuthContext';

const { mockSupabase } = vi.hoisted(() => ({
  mockSupabase: {
    from: vi.fn(),
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  },
}));

vi.mock('@/shared/lib/supabase', () => ({ supabase: mockSupabase }));

function chainable(returnValue: unknown = { data: null, error: null }) {
  const chain: Record<string, vi.Mock> = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(returnValue),
    update: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
  };
  return chain;
}

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    mockSupabase.from.mockReturnValue(chainable());
  });

  it('useAuth throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within AuthProvider');
  });

  it('initializes with loading=true and session=null', () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it('loads profile and sets loading=false when session exists on mount', async () => {
    const mockSession = {
      user: { id: 'user-1', user_metadata: { rol: 'comerciante' } },
      access_token: 'tok',
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
    });

    const profileChain = chainable({
      data: { id: 'user-1', rol: 'comerciante' },
      error: null,
    });
    mockSupabase.from.mockReturnValue(profileChain);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.session).toBe(mockSession);
    expect(result.current.user).toBe(mockSession.user);
  });

  it('sets loading=false when no session on mount', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.session).toBeNull();
  });

  it('signIn calls supabase.auth.signInWithPassword and returns session+user', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    const mockUser = { id: 'user-2', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'tok2' };
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { session: mockSession, user: mockUser },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    let signInResult: any;
    await act(async () => {
      signInResult = await result.current.signIn('test@example.com', 'pass123');
    });

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'pass123',
    });
    expect(signInResult.session).toBe(mockSession);
    expect(signInResult.user).toBe(mockUser);
  });

  it('signUp with session creates profile and returns userId', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    const userId = 'new-user-1';
    mockSupabase.auth.signUp.mockResolvedValue({
      data: {
        user: { id: userId },
        session: { user: { id: userId }, access_token: 'tok3' },
      },
      error: null,
    });

    const updateChain = chainable({ data: null, error: null });
    mockSupabase.from.mockReturnValue(updateChain);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    let signUpResult: any;
    await act(async () => {
      signUpResult = await result.current.signUp('new@example.com', 'pass', {
        role: 'comerciante',
        firstName: 'John',
      });
    });

    expect(signUpResult.userId).toBe(userId);
    expect(signUpResult.requiresEmailConfirmation).toBe(false);
  });

  it('signUp without session returns requiresEmailConfirmation=true', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'pending-user' }, session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    let signUpResult: any;
    await act(async () => {
      signUpResult = await result.current.signUp('pending@example.com', 'pass');
    });

    expect(signUpResult.userId).toBe('pending-user');
    expect(signUpResult.requiresEmailConfirmation).toBe(true);
  });

  it('signOut calls supabase.auth.signOut', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSupabase.auth.signOut).toHaveBeenCalledOnce();
  });

  it('resetPassword calls supabase.auth.resetPasswordForEmail', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    await act(async () => {
      await result.current.resetPassword('user@example.com');
    });

    expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'user@example.com',
      expect.objectContaining({ redirectTo: expect.any(String) }),
    );
  });

  it('isMerchant is true when profile.rol is "comerciante"', async () => {
    const mockSession = {
      user: { id: 'merchant-1', user_metadata: { rol: 'comerciante' } },
      access_token: 'tok4',
    };
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
    });

    const profileChain = chainable({
      data: { id: 'merchant-1', rol: 'comerciante' },
      error: null,
    });
    mockSupabase.from.mockReturnValue(profileChain);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isMerchant).toBe(true);
  });
});
