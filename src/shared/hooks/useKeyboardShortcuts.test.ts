import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

function fireKey(target: EventTarget, init: KeyboardEventInit) {
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }));
}

describe('useKeyboardShortcuts', () => {
  let handler: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    handler = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createShortcuts(map: Record<string, ReturnType<typeof vi.fn>>) {
    const result: Record<string, (e: KeyboardEvent) => void> = {};
    for (const [key, fn] of Object.entries(map)) {
      result[key] = fn as unknown as (e: KeyboardEvent) => void;
    }
    return result;
  }

  it('calls handler for matching shortcut', () => {
    renderHook(() => useKeyboardShortcuts(createShortcuts({ 'Ctrl+S': handler })));
    fireKey(document, { key: 's', ctrlKey: true });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call handler when disabled', () => {
    renderHook(() => useKeyboardShortcuts(createShortcuts({ 'Ctrl+S': handler }), false));
    fireKey(document, { key: 's', ctrlKey: true });
    expect(handler).not.toHaveBeenCalled();
  });

  it('handles Esc shortcut once', () => {
    const escHandler = vi.fn();
    renderHook(() => useKeyboardShortcuts(createShortcuts({ 'Esc': escHandler })));
    fireKey(document, { key: 'Escape' });
    expect(escHandler).toHaveBeenCalledTimes(1);
  });

  it('handles Ctrl+/ shortcut once', () => {
    const handlerSlash = vi.fn();
    renderHook(() => useKeyboardShortcuts(createShortcuts({ 'Ctrl+/': handlerSlash })));
    fireKey(document, { key: '/', ctrlKey: true });
    expect(handlerSlash).toHaveBeenCalledTimes(1);
  });

  it('does not trigger for non-mapped keys', () => {
    renderHook(() => useKeyboardShortcuts(createShortcuts({ 'Ctrl+S': handler })));
    fireKey(document, { key: 'a', ctrlKey: true });
    expect(handler).not.toHaveBeenCalled();
  });

  it('matches Ctrl key', () => {
    renderHook(() => useKeyboardShortcuts(createShortcuts({ 'Ctrl+K': handler })));
    fireKey(document, { key: 'k', ctrlKey: true });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not trigger g+ when target is editable', () => {
    vi.useFakeTimers();
    const gHandler = vi.fn();
    renderHook(() => useKeyboardShortcuts(createShortcuts({ 'g+a': gHandler })));
    const editable = document.createElement('div');
    editable.contentEditable = 'true';
    fireKey(editable, { key: 'g' });
    fireKey(editable, { key: 'a' });
    expect(gHandler).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('ignores Control, Shift, Alt, Meta keys', () => {
    renderHook(() => useKeyboardShortcuts(createShortcuts({ 'Ctrl+S': handler })));
    fireKey(document, { key: 'Control' });
    fireKey(document, { key: 'Shift' });
    fireKey(document, { key: 'Alt' });
    fireKey(document, { key: 'Meta' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', () => {
    const { unmount } = renderHook(() => useKeyboardShortcuts(createShortcuts({ 'Ctrl+S': handler })));
    unmount();
    fireKey(document, { key: 's', ctrlKey: true });
    expect(handler).not.toHaveBeenCalled();
  });
});
