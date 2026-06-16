import { useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { useFocusTrap } from '@/shared/hooks/useFocusTrap';

interface AccessibilitySettings {
  textScale: number;
  lineHeight: number;
  paragraphSpacing: number;
  letterSpacing: number;
  wordSpacing: number;
  highContrast: boolean;
  inverted: boolean;
  protanopia: boolean;
  deuteranopia: boolean;
  reduceMotion: boolean;
  showTranscripts: boolean;
  showSubtitles: boolean;
  audioMuted: boolean;
}

const STORAGE_KEY = 'accessibility-menu-settings';
const SESSION_AUDIO_KEY = 'accessibility-menu-audio-muted';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  textScale: 1,
  lineHeight: 1.5,
  paragraphSpacing: 1.5,
  letterSpacing: 0,
  wordSpacing: 0,
  highContrast: false,
  inverted: false,
  protanopia: false,
  deuteranopia: false,
  reduceMotion: false,
  showTranscripts: false,
  showSubtitles: false,
  audioMuted: false,
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function getStoredSettings(): AccessibilitySettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const audioMuted = sessionStorage.getItem(SESSION_AUDIO_KEY);
    const parsed = stored ? (JSON.parse(stored) as Partial<AccessibilitySettings>) : {};
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      audioMuted: audioMuted === 'true' || parsed.audioMuted || DEFAULT_SETTINGS.audioMuted,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function AccessibilityMenu() {
  const { panelOpen, openPanel, closePanel } = useAccessibility();
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [subtitleNotice, setSubtitleNotice] = useState<string | null>(null);
  const [transcriptNotice, setTranscriptNotice] = useState<string | null>(null);
  const menuRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const open = panelOpen;

  const spacingEnabled = useMemo(
    () =>
      settings.lineHeight !== DEFAULT_SETTINGS.lineHeight ||
      settings.paragraphSpacing !== DEFAULT_SETTINGS.paragraphSpacing ||
      settings.letterSpacing !== DEFAULT_SETTINGS.letterSpacing ||
      settings.wordSpacing !== DEFAULT_SETTINGS.wordSpacing,
    [settings],
  );

  useFocusTrap(menuRef, open, closePanel);

  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.style.setProperty('--font-scale', String(settings.textScale));
    root.style.setProperty('--line-height-scale', String(settings.lineHeight));
    root.style.setProperty('--paragraph-spacing', String(settings.paragraphSpacing));
    root.style.setProperty('--letter-spacing', `${settings.letterSpacing}em`);
    root.style.setProperty('--word-spacing', `${settings.wordSpacing}em`);

    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('inverted', settings.inverted);
    root.classList.toggle('protanopia', settings.protanopia);
    root.classList.toggle('deuteranopia', settings.deuteranopia);
    root.classList.toggle('reduce-motion', settings.reduceMotion);
    root.classList.toggle('max-zoom', settings.textScale >= 2);

    body.classList.toggle('wcag-spacing', spacingEnabled);
    body.classList.toggle('show-transcripts', settings.showTranscripts);

    body.style.overflow = open ? 'hidden' : '';

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    sessionStorage.setItem(SESSION_AUDIO_KEY, String(settings.audioMuted));
  }, [settings, open, spacingEnabled]);

  useEffect(() => {
    const mediaElements = Array.from(document.querySelectorAll<HTMLMediaElement>('audio, video'));
    mediaElements.forEach((media) => {
      media.muted = settings.audioMuted;
      if (settings.audioMuted) {
        media.pause();
      }
    });
  }, [settings.audioMuted]);

  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video'));
    let tracksAvailable = false;

    videos.forEach((video) => {
      Array.from(video.textTracks).forEach((track) => {
        if (track.kind === 'subtitles' || track.kind === 'captions') {
          tracksAvailable = true;
          track.mode = settings.showSubtitles ? 'showing' : 'disabled';
        } else {
          track.mode = 'disabled';
        }
      });
    });

    setSubtitleNotice(settings.showSubtitles && !tracksAvailable ? 'No hay subtítulos disponibles en esta página.' : null);
  }, [settings.showSubtitles]);

  useEffect(() => {
    const hasTranscript = Boolean(document.querySelector('.transcript'));
    setTranscriptNotice(settings.showTranscripts && !hasTranscript ? 'No hay transcripciones disponibles en esta página.' : null);
  }, [settings.showTranscripts]);

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const adjustSetting = (
    key: keyof Pick<AccessibilitySettings, 'textScale' | 'lineHeight' | 'paragraphSpacing' | 'letterSpacing' | 'wordSpacing'>,
    delta: number,
    min: number,
    max: number,
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: clamp((current[key] as number) + delta, min, max),
    }));
  };

  const resetAll = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SESSION_AUDIO_KEY);
  };

  const handleQuickLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    closePanel();

    if (href === '#search') {
      const target = document.querySelector('#search');
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
        return;
      }
      navigate('/');
      return;
    }

    navigate(href);
  };

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="accessibility-menu"
        aria-label="Abrir menú de accesibilidad"
        className={`accessibility-menu-button ${open ? 'open' : ''}`}
        onClick={() => (open ? closePanel() : openPanel())}
      >
        <span aria-hidden="true">♿</span>
      </button>

      {open && (
        <div
          id="accessibility-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de accesibilidad"
          aria-labelledby="accessibility-menu-title"
          className="accessibility-menu-panel"
        >
          <div className="accessibility-menu-header">
            <div>
              <p className="accessibility-badge">✓ Texto real</p>
              <h2 id="accessibility-menu-title">Menú de accesibilidad</h2>
              <p className="accessibility-description">Controles globales WCAG 2.2 aplicados al DOM.</p>
            </div>
            <button type="button" onClick={closePanel} className="accessibility-close-button" aria-label="Cerrar menú de accesibilidad">
              ✕
            </button>
          </div>

          <div className="accessibility-menu-body">
            <section className="accessibility-section" aria-labelledby="texto-heading">
              <h3 id="texto-heading">Texto</h3>

              <div className="accessibility-control-group">
                <label className="accessibility-control-label">Tamaño de texto (1.0× a 2.0×)</label>
                <div className="accessibility-slider-row">
                  <button type="button" onClick={() => adjustSetting('textScale', -0.05, 1, 2)} aria-label="Reducir tamaño de texto" className="accessibility-value-button">
                    −
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.05"
                    value={settings.textScale}
                    aria-label="Ajustar tamaño del texto"
                    onChange={(event) => updateSetting('textScale', Number(event.target.value))}
                  />
                  <button type="button" onClick={() => adjustSetting('textScale', 0.05, 1, 2)} aria-label="Aumentar tamaño de texto" className="accessibility-value-button">
                    +
                  </button>
                  <span className="accessibility-value-label">{Math.round(settings.textScale * 100)}%</span>
                </div>
              </div>

              <div className="accessibility-control-group">
                <label className="accessibility-control-label">Interlineado</label>
                <div className="accessibility-slider-row">
                  <button type="button" onClick={() => adjustSetting('lineHeight', -0.1, 1.5, 2.5)} aria-label="Disminuir interlineado" className="accessibility-value-button">
                    −
                  </button>
                  <input
                    type="range"
                    min="1.5"
                    max="2.5"
                    step="0.1"
                    value={settings.lineHeight}
                    aria-label="Ajustar interlineado"
                    onChange={(event) => updateSetting('lineHeight', Number(event.target.value))}
                  />
                  <button type="button" onClick={() => adjustSetting('lineHeight', 0.1, 1.5, 2.5)} aria-label="Aumentar interlineado" className="accessibility-value-button">
                    +
                  </button>
                  <span className="accessibility-value-label">{settings.lineHeight.toFixed(1)}×</span>
                </div>
              </div>

              <div className="accessibility-control-group">
                <label className="accessibility-control-label">Espaciado entre párrafos</label>
                <div className="accessibility-slider-row">
                  <button type="button" onClick={() => adjustSetting('paragraphSpacing', -0.1, 1.5, 2.5)} aria-label="Disminuir espaciado entre párrafos" className="accessibility-value-button">
                    −
                  </button>
                  <input
                    type="range"
                    min="1.5"
                    max="2.5"
                    step="0.1"
                    value={settings.paragraphSpacing}
                    aria-label="Ajustar espaciado entre párrafos"
                    onChange={(event) => updateSetting('paragraphSpacing', Number(event.target.value))}
                  />
                  <button type="button" onClick={() => adjustSetting('paragraphSpacing', 0.1, 1.5, 2.5)} aria-label="Aumentar espaciado entre párrafos" className="accessibility-value-button">
                    +
                  </button>
                  <span className="accessibility-value-label">{settings.paragraphSpacing.toFixed(1)}×</span>
                </div>
              </div>

              <div className="accessibility-control-group">
                <label className="accessibility-control-label">Espaciado entre letras</label>
                <div className="accessibility-slider-row">
                  <button type="button" onClick={() => adjustSetting('letterSpacing', -0.01, 0, 0.18)} aria-label="Disminuir espaciado entre letras" className="accessibility-value-button">
                    −
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="0.18"
                    step="0.01"
                    value={settings.letterSpacing}
                    aria-label="Ajustar espaciado entre letras"
                    onChange={(event) => updateSetting('letterSpacing', Number(event.target.value))}
                  />
                  <button type="button" onClick={() => adjustSetting('letterSpacing', 0.01, 0, 0.18)} aria-label="Aumentar espaciado entre letras" className="accessibility-value-button">
                    +
                  </button>
                  <span className="accessibility-value-label">{settings.letterSpacing.toFixed(2)}em</span>
                </div>
              </div>

              <div className="accessibility-control-group">
                <label className="accessibility-control-label">Espaciado entre palabras</label>
                <div className="accessibility-slider-row">
                  <button type="button" onClick={() => adjustSetting('wordSpacing', -0.02, 0, 0.24)} aria-label="Disminuir espaciado entre palabras" className="accessibility-value-button">
                    −
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="0.24"
                    step="0.02"
                    value={settings.wordSpacing}
                    aria-label="Ajustar espaciado entre palabras"
                    onChange={(event) => updateSetting('wordSpacing', Number(event.target.value))}
                  />
                  <button type="button" onClick={() => adjustSetting('wordSpacing', 0.02, 0, 0.24)} aria-label="Aumentar espaciado entre palabras" className="accessibility-value-button">
                    +
                  </button>
                  <span className="accessibility-value-label">{settings.wordSpacing.toFixed(2)}em</span>
                </div>
              </div>
            </section>

            <section className="accessibility-section" aria-labelledby="color-heading">
              <h3 id="color-heading">Color y Contraste</h3>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                  className={`accessibility-toggle-button ${settings.highContrast ? 'active' : ''}`}
                  aria-pressed={settings.highContrast}
                  aria-label="Activar alto contraste"
                >
                  Alto contraste {settings.highContrast ? '✓' : ''}
                </button>
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => updateSetting('inverted', !settings.inverted)}
                  className={`accessibility-toggle-button ${settings.inverted ? 'active' : ''}`}
                  aria-pressed={settings.inverted}
                  aria-label="Activar contraste invertido"
                >
                  Contraste invertido {settings.inverted ? '✓' : ''}
                </button>
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => updateSetting('protanopia', !settings.protanopia)}
                  className={`accessibility-toggle-button ${settings.protanopia ? 'active' : ''}`}
                  aria-pressed={settings.protanopia}
                  aria-label="Activar daltonismo protanopia"
                >
                  Daltonismo protanopia {settings.protanopia ? '✓' : ''}
                </button>
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => updateSetting('deuteranopia', !settings.deuteranopia)}
                  className={`accessibility-toggle-button ${settings.deuteranopia ? 'active' : ''}`}
                  aria-pressed={settings.deuteranopia}
                  aria-label="Activar daltonismo deuteranopia"
                >
                  Daltonismo deuteranopia {settings.deuteranopia ? '✓' : ''}
                </button>
              </div>
            </section>

            <section className="accessibility-section" aria-labelledby="orientacion-heading">
              <h3 id="orientacion-heading">Orientación y Diseño</h3>
              <p className="accessibility-note">El menú no bloquea la orientación y adapta su diseño en landscape.</p>
              <p className="accessibility-note">Al zoom máximo, el diseño principal se reordena para evitar scroll horizontal.</p>
            </section>

            <section className="accessibility-section" aria-labelledby="navegacion-heading">
              <h3 id="navegacion-heading">Navegación y Foco</h3>

              <div className="accessibility-quick-links" aria-label="Accesos rápidos">
                    <a href="#main-content" onClick={closePanel} className="accessibility-link">
                  Saltar al contenido
                </a>
                <a href="#search" onClick={(event) => handleQuickLink(event, '#search')} className="accessibility-link">
                  Ir al buscador
                </a>
                <Link to="/sitemap" className="accessibility-link" onClick={closePanel}>
                  Mapa del sitio
                </Link>
                <Link to="/" className="accessibility-link" onClick={closePanel}>
                  Inicio
                </Link>
              </div>
            </section>

            <section className="accessibility-section" aria-labelledby="multimedia-heading">
              <h3 id="multimedia-heading">Multimedia y Audio</h3>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => updateSetting('showTranscripts', !settings.showTranscripts)}
                  className={`accessibility-toggle-button ${settings.showTranscripts ? 'active' : ''}`}
                  aria-pressed={settings.showTranscripts}
                  aria-label="Mostrar transcripciones"
                >
                  Mostrar transcripciones {settings.showTranscripts ? '✓' : ''}
                </button>
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => updateSetting('showSubtitles', !settings.showSubtitles)}
                  className={`accessibility-toggle-button ${settings.showSubtitles ? 'active' : ''}`}
                  aria-pressed={settings.showSubtitles}
                  aria-label="Activar subtítulos"
                >
                  Activar subtítulos {settings.showSubtitles ? '✓' : ''}
                </button>
                {subtitleNotice && (
                  <p className="accessibility-status" role="status">
                    {subtitleNotice}
                  </p>
                )}
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => updateSetting('audioMuted', !settings.audioMuted)}
                  className={`accessibility-toggle-button ${settings.audioMuted ? 'active' : ''}`}
                  aria-pressed={settings.audioMuted}
                  aria-label={settings.audioMuted ? 'Activar audio' : 'Silenciar todo el audio'}
                >
                  {settings.audioMuted ? '🔇 Silenciar audio' : '🔊 Silenciar audio'} {settings.audioMuted ? '(activo)' : ''}
                </button>
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => updateSetting('reduceMotion', !settings.reduceMotion)}
                  className={`accessibility-toggle-button ${settings.reduceMotion ? 'active' : ''}`}
                  aria-pressed={settings.reduceMotion}
                  aria-label="Pausar animaciones"
                >
                  Pausar animaciones {settings.reduceMotion ? '✓' : ''}
                </button>
              </div>
              {transcriptNotice && (
                <p className="accessibility-status" role="status">
                  {transcriptNotice}
                </p>
              )}
            </section>
          </div>

          <div className="accessibility-menu-footer">
            <button type="button" onClick={resetAll} className="accessibility-reset-button">
              Restablecer todo
            </button>
            <p className="accessibility-footer-note">Las opciones se guardan en localStorage y audio en sessionStorage.</p>
          </div>
        </div>
      )}
    </>
  );
}
