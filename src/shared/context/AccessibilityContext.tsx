import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'nexusflow-a11y';

type AccessibilitySettings = {
  darkMode: boolean;
  highContrast: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
  textScale: number;
  lineHeight: number;
  paragraphSpacing: number;
  letterSpacing: number;
  wordSpacing: number;
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
  setTextScale: (s: number) => void;
  setLineHeight: (v: number) => void;
  setParagraphSpacing: (v: number) => void;
  setLetterSpacing: (v: number) => void;
  setWordSpacing: (v: number) => void;
  resetAll: () => void;
};

const defaults: AccessibilitySettings = {
  darkMode: false,
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
  reduceMotion: false,
  textScale: 1,
  lineHeight: 1.5,
  paragraphSpacing: 1.5,
  letterSpacing: 0,
  wordSpacing: 0,
};

function loadSettings(): AccessibilitySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

function persistSettings(settings: AccessibilitySettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(loadSettings);
  const [panelOpen, setPanelOpen] = useState(false);

  const [darkMode, setDarkModeState] = useState(initial.darkMode);
  const [highContrast, setHighContrastState] = useState(initial.highContrast);
  const [grayscale, setGrayscaleState] = useState(initial.grayscale);
  const [underlineLinks, setUnderlineLinksState] = useState(initial.underlineLinks);
  const [reduceMotion, setReduceMotionState] = useState(initial.reduceMotion);
  const [textScale, setTextScaleState] = useState(initial.textScale);
  const [lineHeight, setLineHeightState] = useState(initial.lineHeight);
  const [paragraphSpacing, setParagraphSpacingState] = useState(initial.paragraphSpacing);
  const [letterSpacing, setLetterSpacingState] = useState(initial.letterSpacing);
  const [wordSpacing, setWordSpacingState] = useState(initial.wordSpacing);

  const snapshot = useCallback((): AccessibilitySettings => ({
    darkMode,
    highContrast,
    grayscale,
    underlineLinks,
    reduceMotion,
    textScale,
    lineHeight,
    paragraphSpacing,
    letterSpacing,
    wordSpacing,
  }), [
    darkMode, highContrast, grayscale, underlineLinks, reduceMotion,
    textScale, lineHeight, paragraphSpacing, letterSpacing, wordSpacing,
  ]);

  useEffect(() => {
    persistSettings(snapshot());
  }, [snapshot]);

  useEffect(() => {
    const root = document.documentElement;
    const main = document.querySelector<HTMLElement>('main#main-content');

    root.style.fontSize = `${100 * textScale}%`;
    root.style.setProperty('--line-height-scale', String(lineHeight));
    root.style.setProperty('--paragraph-spacing', String(paragraphSpacing));
    root.style.setProperty('--letter-spacing', `${letterSpacing}em`);
    root.style.setProperty('--word-spacing', `${wordSpacing}em`);

    root.classList.toggle('dark', darkMode);
    root.classList.toggle('high-contrast', highContrast);
    root.classList.toggle('grayscale-mode', grayscale);
    root.classList.toggle('underline-links', underlineLinks);
    root.classList.toggle('reduce-motion', reduceMotion);
    root.classList.toggle('max-zoom', textScale >= 2);

    const spacingActive =
      lineHeight !== defaults.lineHeight ||
      paragraphSpacing !== defaults.paragraphSpacing ||
      letterSpacing !== defaults.letterSpacing ||
      wordSpacing !== defaults.wordSpacing;
    main?.classList.toggle('wcag-spacing', spacingActive);
  }, [textScale, lineHeight, paragraphSpacing, letterSpacing, wordSpacing, darkMode, highContrast, grayscale, underlineLinks, reduceMotion]);

  const openPanel = () => setPanelOpen(true);
  const closePanel = () => setPanelOpen(false);
  const togglePanel = () => setPanelOpen((o) => !o);

  const setDarkMode = (v: boolean) => setDarkModeState(v);
  const setHighContrast = (v: boolean) => setHighContrastState(v);
  const setGrayscale = (v: boolean) => setGrayscaleState(v);
  const setUnderlineLinks = (v: boolean) => setUnderlineLinksState(v);
  const setReduceMotion = (v: boolean) => setReduceMotionState(v);
  const setTextScale = (s: number) => setTextScaleState(s);
  const setLineHeight = (v: number) => setLineHeightState(v);
  const setParagraphSpacing = (v: number) => setParagraphSpacingState(v);
  const setLetterSpacing = (v: number) => setLetterSpacingState(v);
  const setWordSpacing = (v: number) => setWordSpacingState(v);

  const resetAll = () => {
    setDarkModeState(defaults.darkMode);
    setHighContrastState(defaults.highContrast);
    setGrayscaleState(defaults.grayscale);
    setUnderlineLinksState(defaults.underlineLinks);
    setReduceMotionState(defaults.reduceMotion);
    setTextScaleState(defaults.textScale);
    setLineHeightState(defaults.lineHeight);
    setParagraphSpacingState(defaults.paragraphSpacing);
    setLetterSpacingState(defaults.letterSpacing);
    setWordSpacingState(defaults.wordSpacing);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        panelOpen,
        openPanel,
        closePanel,
        togglePanel,
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
        lineHeight,
        setLineHeight,
        paragraphSpacing,
        setParagraphSpacing,
        letterSpacing,
        setLetterSpacing,
        wordSpacing,
        setWordSpacing,
        resetAll,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return ctx;
}
