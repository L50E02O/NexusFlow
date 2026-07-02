import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// WCAG 2.2 — 2.1.2 ✓ Focus trap en modales y drawers
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape?: () => void,
) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
      );

    const ensureFocusInside = () => {
      const items = focusables();
      const activeElement = document.activeElement as HTMLElement | null;
      if (!activeElement || !container.contains(activeElement)) {
        const first = items[0] ?? container;
        first.focus();
      }
    };

    ensureFocusInside();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape?.();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }

      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (e.shiftKey && activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    const handleFocusIn = () => {
      if (!container.contains(document.activeElement)) {
        ensureFocusInside();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [active, containerRef, onEscape]);
}
