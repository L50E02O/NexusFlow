import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePageTitle } from './usePageTitle';

describe('usePageTitle', () => {
  const originalTitle = document.title;

  afterEach(() => {
    document.title = originalTitle;
  });

  it('sets document title on mount', () => {
    renderHook(() => usePageTitle('Tienda'));
    expect(document.title).toBe('Tienda — NexusFlow');
  });

  it('updates title when section changes', () => {
    const { rerender } = renderHook(
      ({ section }) => usePageTitle(section),
      { initialProps: { section: 'Tienda' } },
    );
    expect(document.title).toBe('Tienda — NexusFlow');
    rerender({ section: 'Soporte' });
    expect(document.title).toBe('Soporte — NexusFlow');
  });

  it('restores title on unmount', () => {
    const { unmount } = renderHook(() => usePageTitle('Test'));
    unmount();
    expect(document.title).toBe('NexusFlow | Comercio adaptativo');
  });
});
