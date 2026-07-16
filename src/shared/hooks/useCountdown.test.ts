import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountdown } from './useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with totalSeconds', () => {
    const { result } = renderHook(() => useCountdown(120));
    expect(result.current.total).toBe(120);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(2);
    expect(result.current.secs).toBe(0);
    expect(result.current.paused).toBe(false);
  });

  it('counts down every second', () => {
    const { result } = renderHook(() => useCountdown(5));
    act(() => { vi.advanceTimersByTime(3000); });
    expect(result.current.total).toBe(2);
  });

  it('stops at 0', () => {
    const { result } = renderHook(() => useCountdown(1));
    act(() => { vi.advanceTimersByTime(5000); });
    expect(result.current.total).toBe(0);
  });

  it('pause stops countdown', () => {
    const { result } = renderHook(() => useCountdown(10));
    act(() => { result.current.pause(); });
    expect(result.current.paused).toBe(true);
    act(() => { vi.advanceTimersByTime(3000); });
    expect(result.current.total).toBe(10);
  });

  it('resume restarts countdown', () => {
    const { result } = renderHook(() => useCountdown(10));
    act(() => { result.current.pause(); });
    act(() => { result.current.resume(); });
    expect(result.current.paused).toBe(false);
    act(() => { vi.advanceTimersByTime(2000); });
    expect(result.current.total).toBe(8);
  });

  it('togglePause toggles', () => {
    const { result } = renderHook(() => useCountdown(10));
    act(() => { result.current.togglePause(); });
    expect(result.current.paused).toBe(true);
    act(() => { result.current.togglePause(); });
    expect(result.current.paused).toBe(false);
  });

  it('pad returns zero-padded string', () => {
    const { result } = renderHook(() => useCountdown(10));
    expect(result.current.pad(5)).toBe('05');
    expect(result.current.pad(12)).toBe('12');
  });

  it('calculates hours correctly', () => {
    const { result } = renderHook(() => useCountdown(3661));
    expect(result.current.hours).toBe(1);
    expect(result.current.minutes).toBe(1);
    expect(result.current.secs).toBe(1);
  });
});
