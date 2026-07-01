import { useEffect } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;
type ShortcutMap = Record<string, ShortcutHandler>;

function matchShortcut(e: KeyboardEvent): string | null {
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
  if (e.shiftKey) parts.push('Shift');
  if (e.altKey) parts.push('Alt');

  const key = e.key === ' ' ? 'Space' : e.key === 'Escape' ? 'Esc' : e.key;
  if (!['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
    parts.push(key.length === 1 ? key.toUpperCase() : key);
  }

  return parts.length > 0 ? parts.join('+') : null;
}

export function useKeyboardShortcuts(
  shortcuts: ShortcutMap,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    let buffer = '';
    let timer: ReturnType<typeof setTimeout> | null = null;

    const handler = (e: KeyboardEvent) => {
      const inputTag = (e.target as HTMLElement)?.tagName;
      const isInput = inputTag === 'INPUT' || inputTag === 'TEXTAREA' || inputTag === 'SELECT';

      const combo = matchShortcut(e);
      if (!combo) return;

      if (combo === 'Esc' || combo === 'Ctrl+/') {
        if (combo === 'Esc' || combo === 'Ctrl+/') {
          shortcuts[combo]?.(e);
          if (e.defaultPrevented) return;
        }
      }

      if (combo.startsWith('g+') && !isInput) {
        buffer += combo[2];
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => { buffer = ''; }, 1000);
        const full = `g+${buffer}`;
        if (shortcuts[full]) {
          shortcuts[full](e);
          buffer = '';
          if (timer) clearTimeout(timer);
        }
        return;
      }

      const inputSafe =
        isInput && (combo === 'Esc' || combo.startsWith('Ctrl+'));
      if (isInput && !inputSafe) return;

      if (shortcuts[combo]) {
        shortcuts[combo](e);
      }
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      if (timer) clearTimeout(timer);
    };
  }, [shortcuts, enabled]);
}
