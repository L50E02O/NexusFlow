import { useEffect } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;
type ShortcutMap = Record<string, ShortcutHandler>;

function matchShortcut(e: KeyboardEvent): string | null {
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
  if (e.shiftKey) parts.push('Shift');
  if (e.altKey) parts.push('Alt');

  const key = e.key === ' ' ? 'Space' : e.key === 'Escape' ? 'Esc' : e.key ?? '';
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
      const target = e.target as HTMLElement | null;
      const inputTag = target?.tagName;
      const isInput = inputTag === 'INPUT' || inputTag === 'TEXTAREA' || inputTag === 'SELECT';
      const isEditable = isInput || !!target?.isContentEditable;

      const combo = matchShortcut(e);
      if (!combo) return;

      if (combo === 'Esc' || combo === 'Ctrl+/') {
        shortcuts[combo]?.(e);
        if (e.defaultPrevented) return;
      }

      if (combo.startsWith('g+') && !isEditable) {
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
        isEditable && (combo === 'Esc' || combo.startsWith('Ctrl+'));
      if (isEditable && !inputSafe) return;

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
