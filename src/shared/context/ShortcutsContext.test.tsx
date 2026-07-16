import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ShortcutsProvider, useShortcuts } from './ShortcutsContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return <ShortcutsProvider>{children}</ShortcutsProvider>;
}

describe('ShortcutsContext', () => {
  it('starts with shortcutsOpen false', () => {
    const { result } = renderHook(() => useShortcuts(), { wrapper });
    expect(result.current.shortcutsOpen).toBe(false);
  });

  it('openShortcuts sets to true', () => {
    const { result } = renderHook(() => useShortcuts(), { wrapper });
    act(() => { result.current.openShortcuts(); });
    expect(result.current.shortcutsOpen).toBe(true);
  });

  it('closeShortcuts sets to false', () => {
    const { result } = renderHook(() => useShortcuts(), { wrapper });
    act(() => { result.current.openShortcuts(); });
    act(() => { result.current.closeShortcuts(); });
    expect(result.current.shortcutsOpen).toBe(false);
  });

  it('toggleShortcuts toggles', () => {
    const { result } = renderHook(() => useShortcuts(), { wrapper });
    act(() => { result.current.toggleShortcuts(); });
    expect(result.current.shortcutsOpen).toBe(true);
    act(() => { result.current.toggleShortcuts(); });
    expect(result.current.shortcutsOpen).toBe(false);
  });

  it('throws when used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useShortcuts());
    }).toThrow('useShortcuts must be used within ShortcutsProvider');
    spy.mockRestore();
  });
});
