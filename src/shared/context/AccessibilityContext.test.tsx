import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AccessibilityProvider, useAccessibility } from './AccessibilityContext';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'nexusflow-a11y';

function wrapper({ children }: { children: ReactNode }) {
  return <AccessibilityProvider>{children}</AccessibilityProvider>;
}

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '';
  document.documentElement.className = '';
  document.documentElement.style.cssText = '';
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useAccessibility', () => {
  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useAccessibility())).toThrow(
      'useAccessibility must be used within AccessibilityProvider',
    );
  });
});

describe('AccessibilityProvider', () => {
  it('provides default settings', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    expect(result.current.darkMode).toBe(false);
    expect(result.current.highContrast).toBe(false);
    expect(result.current.grayscale).toBe(false);
    expect(result.current.reduceMotion).toBe(false);
    expect(result.current.textScale).toBe(1);
    expect(result.current.lineHeight).toBe(1.5);
    expect(result.current.noColorReliance).toBe(false);
    expect(result.current.enhancedFocus).toBe(false);
    expect(result.current.largeTargets).toBe(false);
    expect(result.current.keyboardNavigation).toBe(false);
    expect(result.current.transcripts).toBe(false);
    expect(result.current.captions).toBe(false);
    expect(result.current.audioDescriptions).toBe(false);
    expect(result.current.muteAll).toBe(false);
    expect(result.current.showHints).toBe(false);
    expect(result.current.validationVisible).toBe(false);
    expect(result.current.confirmationRequired).toBe(false);
    expect(result.current.panelOpen).toBe(false);
  });

  it('loads settings from localStorage', () => {
    const saved = { darkMode: true, highContrast: true, textScale: 1.5 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    expect(result.current.darkMode).toBe(true);
    expect(result.current.highContrast).toBe(true);
    expect(result.current.textScale).toBe(1.5);
  });

  it('falls back to defaults on corrupt localStorage', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid json}');
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    expect(result.current.darkMode).toBe(false);
    expect(result.current.textScale).toBe(1);
  });

  it('persists settings to localStorage when they change', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.setDarkMode(true));
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.darkMode).toBe(true);
  });

  it('handles localStorage write errors gracefully', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    expect(() => act(() => result.current.setDarkMode(true))).not.toThrow();
  });

  it('handles localStorage removeItem errors gracefully', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.setDarkMode(true));
    expect(() => act(() => result.current.resetAll())).not.toThrow();
  });

  it('openPanel, closePanel, togglePanel work', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    expect(result.current.panelOpen).toBe(false);
    act(() => result.current.openPanel());
    expect(result.current.panelOpen).toBe(true);
    act(() => result.current.closePanel());
    expect(result.current.panelOpen).toBe(false);
    act(() => result.current.togglePanel());
    expect(result.current.panelOpen).toBe(true);
    act(() => result.current.togglePanel());
    expect(result.current.panelOpen).toBe(false);
  });

  it('toggles all boolean settings', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.setDarkMode(true));
    expect(result.current.darkMode).toBe(true);
    act(() => result.current.setHighContrast(true));
    expect(result.current.highContrast).toBe(true);
    act(() => result.current.setGrayscale(true));
    expect(result.current.grayscale).toBe(true);
    act(() => result.current.setUnderlineLinks(true));
    expect(result.current.underlineLinks).toBe(true);
    act(() => result.current.setReduceMotion(true));
    expect(result.current.reduceMotion).toBe(true);
    act(() => result.current.setNoColorReliance(true));
    expect(result.current.noColorReliance).toBe(true);
    act(() => result.current.setEnhancedFocus(true));
    expect(result.current.enhancedFocus).toBe(true);
    act(() => result.current.setLargeTargets(true));
    expect(result.current.largeTargets).toBe(true);
    act(() => result.current.setKeyboardNavigation(true));
    expect(result.current.keyboardNavigation).toBe(true);
    act(() => result.current.setTranscripts(true));
    expect(result.current.transcripts).toBe(true);
    act(() => result.current.setCaptions(true));
    expect(result.current.captions).toBe(true);
    act(() => result.current.setAudioDescriptions(true));
    expect(result.current.audioDescriptions).toBe(true);
    act(() => result.current.setMuteAll(true));
    expect(result.current.muteAll).toBe(true);
    act(() => result.current.setShowHints(true));
    expect(result.current.showHints).toBe(true);
    act(() => result.current.setValidationVisible(true));
    expect(result.current.validationVisible).toBe(true);
    act(() => result.current.setConfirmationRequired(true));
    expect(result.current.confirmationRequired).toBe(true);
  });

  it('sets numeric settings', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.setTextScale(1.5));
    expect(result.current.textScale).toBe(1.5);
    act(() => result.current.setLineHeight(2));
    expect(result.current.lineHeight).toBe(2);
    act(() => result.current.setParagraphSpacing(2));
    expect(result.current.paragraphSpacing).toBe(2);
    act(() => result.current.setLetterSpacing(0.1));
    expect(result.current.letterSpacing).toBe(0.1);
    act(() => result.current.setWordSpacing(0.1));
    expect(result.current.wordSpacing).toBe(0.1);
  });

  it('resetAll restores defaults', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => {
      result.current.setDarkMode(true);
      result.current.setHighContrast(true);
      result.current.setTextScale(2);
    });
    act(() => result.current.resetAll());
    expect(result.current.darkMode).toBe(false);
    expect(result.current.highContrast).toBe(false);
    expect(result.current.textScale).toBe(1);
  });

  it('applies CSS classes to documentElement', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.setDarkMode(true));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    act(() => result.current.setDarkMode(false));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('applies high-contrast class to documentElement', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.setHighContrast(true));
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
  });

  it('applies font size to documentElement', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.setTextScale(1.5));
    expect(document.documentElement.style.fontSize).toBe('150%');
  });

  it('applies grayscale and underline-links classes', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.setGrayscale(true));
    expect(document.documentElement.classList.contains('grayscale-mode')).toBe(true);
    act(() => result.current.setUnderlineLinks(true));
    expect(document.documentElement.classList.contains('underline-links')).toBe(true);
  });

  it('toggles wcag-spacing on main element', () => {
    const main = document.createElement('main');
    main.id = 'main-content';
    document.body.appendChild(main);
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.setLineHeight(2));
    expect(main.classList.contains('wcag-spacing')).toBe(true);
    act(() => result.current.setLineHeight(1.5));
    expect(main.classList.contains('wcag-spacing')).toBe(false);
    document.body.removeChild(main);
  });

  it('applies media detection classes on video elements', () => {
    const video = document.createElement('video');
    document.body.appendChild(video);
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    expect(result.current.mediaAvailable).toBe(true);
    document.body.removeChild(video);
  });

  it('saveSettings persists current state', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.setDarkMode(true));
    act(() => result.current.saveSettings());
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.darkMode).toBe(true);
  });
});
