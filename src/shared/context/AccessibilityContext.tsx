// AccessibilityContext.tsx
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'nexusflow-a11y';

type AccessibilitySettings = {
  darkMode: boolean;
  highContrast: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
  textScale: 'sm' | 'md' | 'lg';
  lineHeight: number;
  paragraphSpacing: number;
  letterSpacing: number;
  wordSpacing: number;
  audioMuted: boolean;
  subtitlesEnabled: boolean;
  transcriptsEnabled: boolean;
  quickSearch: boolean;
  quickSitemap: boolean;
  quickIndex: boolean;
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
  setLineHeight: (v: number) => void;
  setParagraphSpacing: (v: number) => void;
  setLetterSpacing: (v: number) => void;
  setWordSpacing: (v: number) => void;
  setAudioMuted: (v: boolean) => void;
  setSubtitlesEnabled: (v: boolean) => void;
  setTranscriptsEnabled: (v: boolean) => void;
  setQuickSearch: (v: boolean) => void;
  setQuickSitemap: (v: boolean) => void;
  setQuickIndex: (v: boolean) => void;
  resetAll: () => void;
};

const defaults: AccessibilitySettings = {
  darkMode: false,
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
  reduceMotion: false,
  textScale: 'md',
  lineHeight: 1,
  paragraphSpacing: 1,
  letterSpacing: 1,
  wordSpacing: 1,
  audioMuted: false,
  subtitlesEnabled: false,
  transcriptsEnabled: false,
  quickSearch: false,
  quickSitemap: false,
  quickIndex: false,
};

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

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(loadSettings);
  const [panelOpen, setPanelOpen] = useState(false);

  const [darkMode, setDarkModeState] = useState(initial.darkMode);
  const [highContrast, setHighContrastState] = useState(initial.highContrast);
  const [grayscale, setGrayscaleState] = useState(initial.grayscale);
  const [underlineLinks, setUnderlineLinksState] = useState(initial.underlineLinks);
  const [reduceMotion, setReduceMotionState] = useState(initial.reduceMotion);
  const [textScale, setTextScaleState] = useState<'sm' | 'md' | 'lg'>(initial.textScale);
  const [lineHeight, setLineHeightState] = useState(initial.lineHeight);
  const [paragraphSpacing, setParagraphSpacingState] = useState(initial.paragraphSpacing);
  const [letterSpacing, setLetterSpacingState] = useState(initial.letterSpacing);
  const [wordSpacing, setWordSpacingState] = useState(initial.wordSpacing);
  const [audioMuted, setAudioMutedState] = useState(initial.audioMuted);
  const [subtitlesEnabled, setSubtitlesEnabledState] = useState(initial.subtitlesEnabled);
  const [transcriptsEnabled, setTranscriptsEnabledState] = useState(initial.transcriptsEnabled);
  const [quickSearch, setQuickSearchState] = useState(initial.quickSearch);
  const [quickSitemap, setQuickSitemapState] = useState(initial.quickSitemap);
  const [quickIndex, setQuickIndexState] = useState(initial.quickIndex);

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
    audioMuted,
    subtitlesEnabled,
    transcriptsEnabled,
    quickSearch,
    quickSitemap,
    quickIndex,
  }), [
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
    audioMuted,
    subtitlesEnabled,
    transcriptsEnabled,
    quickSearch,
    quickSitemap,
    quickIndex,
  ]);

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

  useEffect(() => {
    document.documentElement.style.setProperty('--line-height-mult', lineHeight.toString());
    document.documentElement.style.setProperty('--paragraph-spacing-mult', paragraphSpacing.toString());
    document.documentElement.style.setProperty('--letter-spacing-mult', letterSpacing.toString());
    document.documentElement.style.setProperty('--word-spacing-mult', wordSpacing.toString());
  }, [lineHeight, paragraphSpacing, letterSpacing, wordSpacing]);

  useEffect(() => {
    document.documentElement.classList.toggle('audio-muted', audioMuted);
    document.documentElement.classList.toggle('subtitles-enabled', subtitlesEnabled);
    document.documentElement.classList.toggle('transcripts-enabled', transcriptsEnabled);
  }, [audioMuted, subtitlesEnabled, transcriptsEnabled]);

  useEffect(() => {
    document.documentElement.classList.toggle('quick-search', quickSearch);
    document.documentElement.classList.toggle('quick-sitemap', quickSitemap);
    document.documentElement.classList.toggle('quick-index', quickIndex);
  }, [quickSearch, quickSitemap, quickIndex]);

  useEffect(() => {
    const sizes: Record<'sm' | 'md' | 'lg', string> = {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
    };
    document.documentElement.style.fontSize = sizes[textScale];
  }, [textScale]);

  const openPanel = () => setPanelOpen(true);
  const closePanel = () => setPanelOpen(false);
  const togglePanel = () => setPanelOpen((o) => !o);

  const setDarkMode = (v: boolean) => setDarkModeState(v);
  const setHighContrast = (v: boolean) => setHighContrastState(v);
  const setGrayscale = (v: boolean) => setGrayscaleState(v);
  const setUnderlineLinks = (v: boolean) => setUnderlineLinksState(v);
  const setReduceMotion = (v: boolean) => setReduceMotionState(v);
  const setTextScale = (s: 'sm' | 'md' | 'lg') => setTextScaleState(s);
  const setLineHeight = (v: number) => setLineHeightState(v);
  const setParagraphSpacing = (v: number) => setParagraphSpacingState(v);
  const setLetterSpacing = (v: number) => setLetterSpacingState(v);
  const setWordSpacing = (v: number) => setWordSpacingState(v);
  const setAudioMuted = (v: boolean) => setAudioMutedState(v);
  const setSubtitlesEnabled = (v: boolean) => setSubtitlesEnabledState(v);
  const setTranscriptsEnabled = (v: boolean) => setTranscriptsEnabledState(v);
  const setQuickSearch = (v: boolean) => setQuickSearchState(v);
  const setQuickSitemap = (v: boolean) => setQuickSitemapState(v);
  const setQuickIndex = (v: boolean) => setQuickIndexState(v);

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
    setAudioMutedState(defaults.audioMuted);
    setSubtitlesEnabledState(defaults.subtitlesEnabled);
    setTranscriptsEnabledState(defaults.transcriptsEnabled);
    setQuickSearchState(defaults.quickSearch);
    setQuickSitemapState(defaults.quickSitemap);
    setQuickIndexState(defaults.quickIndex);
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
        audioMuted,
        setAudioMuted,
        subtitlesEnabled,
        setSubtitlesEnabled,
        transcriptsEnabled,
        setTranscriptsEnabled,
        quickSearch,
        setQuickSearch,
        quickSitemap,
        setQuickSitemap,
        quickIndex,
        setQuickIndex,
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
