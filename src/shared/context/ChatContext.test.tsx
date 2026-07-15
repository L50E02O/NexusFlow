import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ChatProvider, useChat } from './ChatContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return <ChatProvider>{children}</ChatProvider>;
}

describe('ChatContext', () => {
  it('starts with isOpen false', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.isOpen).toBe(false);
  });

  it('open sets isOpen to true', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    act(() => { result.current.open(); });
    expect(result.current.isOpen).toBe(true);
  });

  it('close sets isOpen to false', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    act(() => { result.current.open(); });
    act(() => { result.current.close(); });
    expect(result.current.isOpen).toBe(false);
  });

  it('toggle toggles isOpen', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    act(() => { result.current.toggle(); });
    expect(result.current.isOpen).toBe(true);
    act(() => { result.current.toggle(); });
    expect(result.current.isOpen).toBe(false);
  });

  it('throws when used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useChat());
    }).toThrow('useChat debe usarse dentro de ChatProvider');
    spy.mockRestore();
  });
});
