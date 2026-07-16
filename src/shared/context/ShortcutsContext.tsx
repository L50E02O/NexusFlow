import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type ShortcutsContextValue = {
  shortcutsOpen: boolean;
  openShortcuts: () => void;
  closeShortcuts: () => void;
  toggleShortcuts: () => void;
};

const ShortcutsContext = createContext<ShortcutsContextValue | null>(null);

export function ShortcutsProvider({ children }: { children: ReactNode }) {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const openShortcuts = useCallback(() => setShortcutsOpen(true), []);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);
  const toggleShortcuts = useCallback(() => setShortcutsOpen((o) => !o), []);

  const value = useMemo(
    () => ({ shortcutsOpen, openShortcuts, closeShortcuts, toggleShortcuts }),
    [shortcutsOpen, openShortcuts, closeShortcuts, toggleShortcuts],
  );

  return <ShortcutsContext.Provider value={value}>{children}</ShortcutsContext.Provider>;
}

export function useShortcuts() {
  const ctx = useContext(ShortcutsContext);
  if (!ctx) throw new Error('useShortcuts must be used within ShortcutsProvider');
  return ctx;
}
