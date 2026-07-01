import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts } from '@/shared/hooks/useKeyboardShortcuts';
import { useShortcuts } from '@/shared/context/ShortcutsContext';
import { useAuth } from '@/shared/context/AuthContext';

export function GlobalShortcuts() {
  const navigate = useNavigate();
  const { openShortcuts, closeShortcuts, shortcutsOpen } = useShortcuts();
  const { isMerchant } = useAuth();

  const toggleHelp = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (shortcutsOpen) {
        closeShortcuts();
      } else {
        openShortcuts();
      }
    },
    [shortcutsOpen, openShortcuts, closeShortcuts],
  );

  const closeModal = useCallback(
    (e: KeyboardEvent) => {
      if (shortcutsOpen) {
        e.preventDefault();
        closeShortcuts();
      }
    },
    [shortcutsOpen, closeShortcuts],
  );

  const shortcuts = useMemo(
    () => ({
      '?': toggleHelp,
      'Ctrl+/': toggleHelp,
      'g+H': (e: KeyboardEvent) => { e.preventDefault(); navigate('/'); },
      'g+S': (e: KeyboardEvent) => { e.preventDefault(); navigate('/tienda'); },
      'g+C': (e: KeyboardEvent) => { e.preventDefault(); navigate('/carrito'); },
      'g+M': (e: KeyboardEvent) => { e.preventDefault(); navigate(isMerchant ? '/merchant' : '/mensajeria'); },
      'Esc': closeModal,
    }),
    [toggleHelp, closeModal, navigate, isMerchant],
  );

  useKeyboardShortcuts(shortcuts, true);

  return null;
}
