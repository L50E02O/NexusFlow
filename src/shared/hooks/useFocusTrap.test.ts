import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';

describe('useFocusTrap', () => {
  let container: HTMLDivElement;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.tabIndex = -1;
    button1 = document.createElement('button');
    button1.textContent = 'First';
    Object.defineProperty(button1, 'offsetParent', { value: document.body });
    button2 = document.createElement('button');
    button2.textContent = 'Last';
    Object.defineProperty(button2, 'offsetParent', { value: document.body });
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('focuses first focusable element when activated', () => {
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));
    expect(document.activeElement).toBe(button1);
  });

  it('does nothing when not active', () => {
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, false));
    expect(document.activeElement).not.toBe(button1);
  });

  it('calls onEscape when Escape is pressed', () => {
    const onEscape = vi.fn();
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true, onEscape));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('wraps focus from last to first element on Tab', () => {
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));
    button2.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(document.activeElement).toBe(button1);
  });

  it('wraps focus from first to last on Shift+Tab', () => {
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));
    button1.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));
    expect(document.activeElement).toBe(button2);
  });

  it('focuses container when no focusable elements and Tab is pressed', () => {
    container.innerHTML = '<div>No focusable</div>';
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(document.activeElement).toBe(container);
  });

  it('returns focus to previously focused element on cleanup', () => {
    const previous = document.createElement('button');
    document.body.appendChild(previous);
    previous.focus();
    const ref = { current: container };
    const { unmount } = renderHook(() => useFocusTrap(ref, true));
    unmount();
    expect(document.activeElement).toBe(previous);
    document.body.removeChild(previous);
  });
});
