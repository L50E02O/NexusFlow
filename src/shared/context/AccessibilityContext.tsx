import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'nexusflow-a11y';

type AccessibilitySettings = {
  darkMode: boolean;
  highContrast: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
  textScale: 'sm' | 'md' | 'lg';
};

type AccessibilityContextValue = AccessibilitySettings & {
  panelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  setDarkMode: (v: boolean) => void;
  setHighContrast: (v: boolean) => void;
  setGrayscale: (v: boolean) => void;
  setUnderlineLinks: (v: boolean) => void;
  setReduceMotion: (v: boolean) => void;
  setTextScale: (s: 'sm' | 'md' | 'lg') => void;
  resetAll: () => void;
};

const defaults: AccessibilitySettings = {
  darkMode: false,
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
  reduceMotion: false,
  textScale: 'md',
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function loadSettings(): AccessibilitySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

function persistSettings(settings: AccessibilitySettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// WCAG 2.2 — Menú de accesibilidad con persistencia en localStorage
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(loadSettings);
  const [panelOpen, setPanelOpen] = useState(false);
  const [darkMode, setDarkModeState] = useState(initial.darkMode);
  const [highContrast, setHighContrastState] = useState(initial.highContrast);
  const [grayscale, setGrayscaleState] = useState(initial.grayscale);
  const [underlineLinks, setUnderlineLinksState] = useState(initial.underlineLinks);
  const [reduceMotion, setReduceMotionState] = useState(initial.reduceMotion);
  const [textScale, setTextScaleState] = useState<'sm' | 'md' | 'lg'>(initial.textScale);

  const snapshot = useCallback(
    (): AccessibilitySettings => ({
      darkMode,
      highContrast,
      grayscale,
      underlineLinks,
      reduceMotion,
      textScale,
    }),
    [darkMode, highContrast, grayscale, underlineLinks, reduceMotion, textScale],
  );

  useEffect(() => {
    persistSettings(snapshot());
  }, [snapshot]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle('grayscale-mode', grayscale);
  }, [grayscale]);

  useEffect(() => {
    document.documentElement.classList.toggle('underline-links', underlineLinks);
  }, [underlineLinks]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
  }, [reduceMotion]);

  // WCAG 2.2 — 1.4.4 ✓ Escala de texto en rem vía font-size del root
  useEffect(() => {
    const sizes = { sm: '0.875rem', md: '1rem', lg: '1.125rem' };
    document.documentElement.style.fontSize = sizes[textScale];
  }, [textScale]);

  const setDarkMode = (v: boolean) => setDarkModeState(v);
  const setHighContrast = (v: boolean) => setHighContrastState(v);
  const setGrayscale = (v: boolean) => setGrayscaleState(v);
  const setUnderlineLinks = (v: boolean) => setUnderlineLinksState(v);
  const setReduceMotion = (v: boolean) => setReduceMotionState(v);
  const setTextScale = (s: 'sm' | 'md' | 'lg') => setTextScaleState(s);

  const resetAll = () => {
    setDarkModeState(defaults.darkMode);
    setHighContrastState(defaults.highContrast);
    setGrayscaleState(defaults.grayscale);
    setUnderlineLinksState(defaults.underlineLinks);
    setReduceMotionState(defaults.reduceMotion);
    setTextScaleState(defaults.textScale);
    localStorage.removeItem(STORAGE_KEY);
  };

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
        grayscale,
        setGrayscale,
        underlineLinks,
        setUnderlineLinks,
        reduceMotion,
        setReduceMotion,
        textScale,
        setTextScale,
        resetAll,
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
