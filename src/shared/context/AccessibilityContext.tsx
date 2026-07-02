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
  noColorReliance: boolean;
  enhancedFocus: boolean;
  largeTargets: boolean;
  keyboardNavigation: boolean;
  transcripts: boolean;
  captions: boolean;
  audioDescriptions: boolean;
  muteAll: boolean;
  showHints: boolean;
  validationVisible: boolean;
  confirmationRequired: boolean;
};

type AccessibilityContextValue = AccessibilitySettings & {
  panelOpen: boolean;
  mediaAvailable: boolean;
  captionsAvailable: boolean;
  descriptionsAvailable: boolean;
  transcriptAvailable: boolean;
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
  setNoColorReliance: (v: boolean) => void;
  setEnhancedFocus: (v: boolean) => void;
  setLargeTargets: (v: boolean) => void;
  setKeyboardNavigation: (v: boolean) => void;
  setTranscripts: (v: boolean) => void;
  setCaptions: (v: boolean) => void;
  setAudioDescriptions: (v: boolean) => void;
  setMuteAll: (v: boolean) => void;
  setShowHints: (v: boolean) => void;
  setValidationVisible: (v: boolean) => void;
  setConfirmationRequired: (v: boolean) => void;
  saveSettings: () => void;
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
  noColorReliance: false,
  enhancedFocus: false,
  largeTargets: false,
  keyboardNavigation: false,
  transcripts: false,
  captions: false,
  audioDescriptions: false,
  muteAll: false,
  showHints: false,
  validationVisible: false,
  confirmationRequired: false,
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore write errors in private or restricted browser modes.
  }
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
  const [noColorReliance, setNoColorRelianceState] = useState(initial.noColorReliance);
  const [enhancedFocus, setEnhancedFocusState] = useState(initial.enhancedFocus);
  const [largeTargets, setLargeTargetsState] = useState(initial.largeTargets);
  const [keyboardNavigation, setKeyboardNavigationState] = useState(initial.keyboardNavigation);
  const [transcripts, setTranscriptsState] = useState(initial.transcripts);
  const [captions, setCaptionsState] = useState(initial.captions);
  const [audioDescriptions, setAudioDescriptionsState] = useState(initial.audioDescriptions);
  const [muteAll, setMuteAllState] = useState(initial.muteAll);
  const [showHints, setShowHintsState] = useState(initial.showHints);
  const [validationVisible, setValidationVisibleState] = useState(initial.validationVisible);
  const [confirmationRequired, setConfirmationRequiredState] = useState(initial.confirmationRequired);

  const [mediaAvailable, setMediaAvailable] = useState(false);
  const [captionsAvailable, setCaptionsAvailable] = useState(false);
  const [descriptionsAvailable, setDescriptionsAvailable] = useState(false);
  const [transcriptAvailable, setTranscriptAvailable] = useState(false);

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
    noColorReliance,
    enhancedFocus,
    largeTargets,
    keyboardNavigation,
    transcripts,
    captions,
    audioDescriptions,
    muteAll,
    showHints,
    validationVisible,
    confirmationRequired,
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
    noColorReliance,
    enhancedFocus,
    largeTargets,
    keyboardNavigation,
    transcripts,
    captions,
    audioDescriptions,
    muteAll,
    showHints,
    validationVisible,
    confirmationRequired,
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
    root.classList.toggle('no-color-reliance', noColorReliance);
    root.classList.toggle('enhanced-focus', enhancedFocus);
    root.classList.toggle('large-targets', largeTargets);
    root.classList.toggle('keyboard-navigation', keyboardNavigation);
    root.classList.toggle('transcript-visible', transcripts);
    root.classList.toggle('captions-active', captions);
    root.classList.toggle('audio-descriptions-active', audioDescriptions);
    root.classList.toggle('mute-all', muteAll);
    root.classList.toggle('show-hints', showHints);
    root.classList.toggle('validation-visible', validationVisible);
    root.classList.toggle('confirmation-required', confirmationRequired);
    root.classList.toggle('max-zoom', textScale >= 2);

    const spacingActive =
      lineHeight !== defaults.lineHeight ||
      paragraphSpacing !== defaults.paragraphSpacing ||
      letterSpacing !== defaults.letterSpacing ||
      wordSpacing !== defaults.wordSpacing;
    main?.classList.toggle('wcag-spacing', spacingActive);

    if (muteAll) {
      document.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
        video.muted = true;
        video.pause();
      });
      document.querySelectorAll<HTMLAudioElement>('audio').forEach((audio) => {
        audio.pause();
      });
    } else {
      document.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
        video.muted = false;
      });
    }

    document.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
      Array.from(video.textTracks || []).forEach((track) => {
        if (track.kind === 'subtitles') {
          track.mode = captions ? 'showing' : 'disabled';
        }
        if (track.kind === 'descriptions') {
          track.mode = audioDescriptions ? 'showing' : 'disabled';
        }
      });
    });
  }, [
    textScale,
    lineHeight,
    paragraphSpacing,
    letterSpacing,
    wordSpacing,
    darkMode,
    highContrast,
    grayscale,
    underlineLinks,
    reduceMotion,
    noColorReliance,
    enhancedFocus,
    largeTargets,
    keyboardNavigation,
    transcripts,
    captions,
    audioDescriptions,
    muteAll,
    showHints,
    validationVisible,
    confirmationRequired,
  ]);

  useEffect(() => {
    const updateMedia = () => {
      const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video'));
      const audios = Array.from(document.querySelectorAll<HTMLAudioElement>('audio'));
      const hasMedia = videos.length > 0 || audios.length > 0;
      setMediaAvailable(hasMedia);
      setCaptionsAvailable(videos.some((video) =>
        Array.from(video.textTracks || []).some((track) => track.kind === 'subtitles'),
      ));
      setDescriptionsAvailable(videos.some((video) =>
        Array.from(video.textTracks || []).some((track) => track.kind === 'descriptions'),
      ));
      setTranscriptAvailable(Boolean(document.querySelector('div.transcripcion')));
    };

    updateMedia();
    const observer = new MutationObserver(updateMedia);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanupValidationHints = () => {
      document.querySelectorAll<HTMLElement>('.validation-hint').forEach((element) => {
        element.remove();
      });
    };

    const updateValidationHints = () => {
      document.querySelectorAll<HTMLElement>('[aria-invalid="true"]').forEach((element) => {
        const next = element.nextElementSibling as HTMLElement | null;
        if (next?.classList.contains('validation-hint')) return;
        const hint = document.createElement('div');
        hint.className = 'validation-hint';
        hint.setAttribute('role', 'alert');
        hint.textContent = 'Revise el contenido del campo y corrija el error.';
        element.insertAdjacentElement('afterend', hint);
      });
    };

    if (!validationVisible) {
      cleanupValidationHints();
      return;
    }

    updateValidationHints();
    const observer = new MutationObserver(updateValidationHints);
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['aria-invalid'] });
    return () => {
      observer.disconnect();
      cleanupValidationHints();
    };
  }, [validationVisible]);

  const openPanel = () => setPanelOpen(true);
  const closePanel = () => setPanelOpen(false);
  const togglePanel = () => setPanelOpen((open) => !open);

  const setDarkMode = (value: boolean) => setDarkModeState(value);
  const setHighContrast = (value: boolean) => setHighContrastState(value);
  const setGrayscale = (value: boolean) => setGrayscaleState(value);
  const setUnderlineLinks = (value: boolean) => setUnderlineLinksState(value);
  const setReduceMotion = (value: boolean) => setReduceMotionState(value);
  const setTextScale = (value: number) => setTextScaleState(value);
  const setLineHeight = (value: number) => setLineHeightState(value);
  const setParagraphSpacing = (value: number) => setParagraphSpacingState(value);
  const setLetterSpacing = (value: number) => setLetterSpacingState(value);
  const setWordSpacing = (value: number) => setWordSpacingState(value);
  const setNoColorReliance = (value: boolean) => setNoColorRelianceState(value);
  const setEnhancedFocus = (value: boolean) => setEnhancedFocusState(value);
  const setLargeTargets = (value: boolean) => setLargeTargetsState(value);
  const setKeyboardNavigation = (value: boolean) => setKeyboardNavigationState(value);
  const setTranscripts = (value: boolean) => setTranscriptsState(value);
  const setCaptions = (value: boolean) => setCaptionsState(value);
  const setAudioDescriptions = (value: boolean) => setAudioDescriptionsState(value);
  const setMuteAll = (value: boolean) => setMuteAllState(value);
  const setShowHints = (value: boolean) => setShowHintsState(value);
  const setValidationVisible = (value: boolean) => setValidationVisibleState(value);
  const setConfirmationRequired = (value: boolean) => setConfirmationRequiredState(value);

  const saveSettings = useCallback(() => {
    persistSettings(snapshot());
  }, [snapshot]);

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
    setNoColorRelianceState(defaults.noColorReliance);
    setEnhancedFocusState(defaults.enhancedFocus);
    setLargeTargetsState(defaults.largeTargets);
    setKeyboardNavigationState(defaults.keyboardNavigation);
    setTranscriptsState(defaults.transcripts);
    setCaptionsState(defaults.captions);
    setAudioDescriptionsState(defaults.audioDescriptions);
    setMuteAllState(defaults.muteAll);
    setShowHintsState(defaults.showHints);
    setValidationVisibleState(defaults.validationVisible);
    setConfirmationRequiredState(defaults.confirmationRequired);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        panelOpen,
        mediaAvailable,
        captionsAvailable,
        descriptionsAvailable,
        transcriptAvailable,
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
        noColorReliance,
        setNoColorReliance,
        enhancedFocus,
        setEnhancedFocus,
        largeTargets,
        setLargeTargets,
        keyboardNavigation,
        setKeyboardNavigation,
        transcripts,
        setTranscripts,
        captions,
        setCaptions,
        audioDescriptions,
        setAudioDescriptions,
        muteAll,
        setMuteAll,
        showHints,
        setShowHints,
        validationVisible,
        setValidationVisible,
        confirmationRequired,
        setConfirmationRequired,
        saveSettings,
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
