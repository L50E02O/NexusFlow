import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type AccessibilityContextValue = {
  panelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  textScale: 'sm' | 'md' | 'lg';
  setTextScale: (s: 'sm' | 'md' | 'lg') => void;
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textScale, setTextScale] = useState<'sm' | 'md' | 'lg'>('md');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    const sizes = { sm: '14px', md: '16px', lg: '18px' };
    document.documentElement.style.fontSize = sizes[textScale];
  }, [textScale]);

  return (
    <AccessibilityContext.Provider
      value={{
        panelOpen,
        openPanel: () => setPanelOpen(true),
        closePanel: () => setPanelOpen(false),
        togglePanel: () => setPanelOpen((o) => !o),
        darkMode,
        setDarkMode,
        highContrast,
        setHighContrast,
        textScale,
        setTextScale,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
