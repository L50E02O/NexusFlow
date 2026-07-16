import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDraggable } from './useDraggable';

function pointerEvent(type: string, overrides: Partial<PointerEvent> = {}) {
  return new PointerEvent(type, { bubbles: true, cancelable: true, ...overrides });
}

describe('useDraggable', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
  });

  it('returns initial position from props', () => {
    const { result } = renderHook(() => useDraggable({ initial: { x: 50, y: 100 } }));
    expect(result.current.position).toEqual({ x: 50, y: 100 });
  });

  it('returns null position when no initial provided', () => {
    const { result } = renderHook(() => useDraggable());
    expect(result.current.position).toBeNull();
  });

  it('fixedStyle returns correct CSS when position is set', () => {
    const { result } = renderHook(() => useDraggable({ initial: { x: 10, y: 20 } }));
    expect(result.current.fixedStyle).toEqual({
      position: 'fixed',
      left: 10,
      top: 20,
      right: 'auto',
      bottom: 'auto',
      zIndex: 60,
    });
  });

  it('fixedStyle is undefined when position is null', () => {
    const { result } = renderHook(() => useDraggable());
    expect(result.current.fixedStyle).toBeUndefined();
  });

  it('onPointerDown sets drag state', () => {
    const { result } = renderHook(() => useDraggable({ initial: { x: 50, y: 50 } }));
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ left: 50, top: 50, width: 200, height: 100, right: 250, bottom: 150, x: 50, y: 50, toJSON: () => {} });
    el.setPointerCapture = vi.fn();

    act(() => {
      result.current.onPointerDown({
        currentTarget: el,
        button: 0,
        pointerId: 1,
        clientX: 100,
        clientY: 100,
      } as any);
    });

    expect(el.setPointerCapture).toHaveBeenCalledWith(1);
  });

  it('onPointerDown ignores right-click', () => {
    const { result } = renderHook(() => useDraggable({ initial: { x: 50, y: 50 } }));
    const el = document.createElement('div');
    el.setPointerCapture = vi.fn();

    act(() => {
      result.current.onPointerDown({
        currentTarget: el,
        button: 2,
        pointerId: 1,
        clientX: 100,
        clientY: 100,
      } as any);
    });

    expect(el.setPointerCapture).not.toHaveBeenCalled();
  });

  it('onPointerMove does not update position below threshold', () => {
    const { result } = renderHook(() => useDraggable({ initial: { x: 50, y: 50 }, dragThreshold: 6 }));
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ left: 50, top: 50, width: 200, height: 100, right: 250, bottom: 150, x: 50, y: 50, toJSON: () => {} });
    el.setPointerCapture = vi.fn();

    act(() => {
      result.current.onPointerDown({
        currentTarget: el,
        button: 0,
        pointerId: 1,
        clientX: 100,
        clientY: 100,
      } as any);
    });

    act(() => {
      result.current.onPointerMove({
        currentTarget: el,
        pointerId: 1,
        clientX: 102,
        clientY: 102,
      } as any);
    });

    expect(result.current.position).toEqual({ x: 50, y: 50 });
  });

  it('onPointerMove updates position after threshold', () => {
    const { result } = renderHook(() => useDraggable({ initial: { x: 50, y: 50 }, dragThreshold: 6 }));
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ left: 50, top: 50, width: 200, height: 100, right: 250, bottom: 150, x: 50, y: 50, toJSON: () => {} });
    el.setPointerCapture = vi.fn();

    act(() => {
      result.current.onPointerDown({
        currentTarget: el,
        button: 0,
        pointerId: 1,
        clientX: 100,
        clientY: 100,
      } as any);
    });

    act(() => {
      result.current.onPointerMove({
        currentTarget: el,
        pointerId: 1,
        clientX: 110,
        clientY: 110,
      } as any);
    });

    expect(result.current.position?.x).toBe(60);
    expect(result.current.position?.y).toBe(60);
  });

  it('onPointerEnd clears drag state', () => {
    const { result } = renderHook(() => useDraggable({ initial: { x: 50, y: 50 } }));
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ left: 50, top: 50, width: 200, height: 100, right: 250, bottom: 150, x: 50, y: 50, toJSON: () => {} });
    el.setPointerCapture = vi.fn();
    el.releasePointerCapture = vi.fn();

    act(() => {
      result.current.onPointerDown({
        currentTarget: el,
        button: 0,
        pointerId: 1,
        clientX: 100,
        clientY: 100,
      } as any);
    });

    act(() => {
      result.current.onPointerEnd({
        currentTarget: el,
        pointerId: 1,
      } as any);
    });

    expect(el.releasePointerCapture).toHaveBeenCalledWith(1);
  });

  it('wasDragged returns true after drag exceeding threshold', () => {
    const { result } = renderHook(() => useDraggable({ initial: { x: 50, y: 50 }, dragThreshold: 6 }));
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ left: 50, top: 50, width: 200, height: 100, right: 250, bottom: 150, x: 50, y: 50, toJSON: () => {} });
    el.setPointerCapture = vi.fn();

    act(() => {
      result.current.onPointerDown({
        currentTarget: el,
        button: 0,
        pointerId: 1,
        clientX: 100,
        clientY: 100,
      } as any);
    });

    expect(result.current.wasDragged()).toBe(false);

    act(() => {
      result.current.onPointerMove({
        currentTarget: el,
        pointerId: 1,
        clientX: 115,
        clientY: 115,
      } as any);
    });

    expect(result.current.wasDragged()).toBe(true);
  });

  it('clamps position within viewport bounds', () => {
    const { result } = renderHook(() => useDraggable({ initial: { x: 0, y: 0 }, dragThreshold: 6 }));
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0, toJSON: () => {} });
    el.setPointerCapture = vi.fn();

    act(() => {
      result.current.onPointerDown({
        currentTarget: el,
        button: 0,
        pointerId: 1,
        clientX: 0,
        clientY: 0,
      } as any);
    });

    act(() => {
      result.current.onPointerMove({
        currentTarget: el,
        pointerId: 1,
        clientX: -100,
        clientY: -200,
      } as any);
    });

    expect(result.current.position?.x).toBeGreaterThanOrEqual(8);
    expect(result.current.position?.y).toBeGreaterThanOrEqual(8);
  });
});
