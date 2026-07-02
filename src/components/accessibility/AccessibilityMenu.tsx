import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { useFocusTrap } from '@/shared/hooks/useFocusTrap';

const TEXT_SCALE_MIN = 1;
const TEXT_SCALE_MAX = 2;
const TEXT_SCALE_STEP = 0.05;
const LINE_HEIGHT_MIN = 1.5;
const LINE_HEIGHT_MAX = 2.5;
const LINE_HEIGHT_STEP = 0.1;
const SPACING_MIN = 1.5;
const SPACING_MAX = 2.5;
const SPACING_STEP = 0.1;
const LETTER_SPACING_MIN = 0;
const LETTER_SPACING_MAX = 0.18;
const LETTER_SPACING_STEP = 0.01;
const WORD_SPACING_MIN = 0;
const WORD_SPACING_MAX = 0.24;
const WORD_SPACING_STEP = 0.02;

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  decLabel,
  incLabel,
  slideLabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  decLabel: string;
  incLabel: string;
  slideLabel: string;
}) {
  return (
    <div className="accessibility-control-group">
      <label className="accessibility-control-label">{label}</label>
      <div className="accessibility-slider-row">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, +(value - step).toFixed(2)))}
          aria-label={decLabel}
          className="accessibility-value-button"
        >
          −
        </button>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={slideLabel}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, +(value + step).toFixed(2)))}
          aria-label={incLabel}
          className="accessibility-value-button"
        >
          +
        </button>
        <span className="accessibility-value-label">{format ? format(value) : value}</span>
      </div>
    </div>
  );
}

export function AccessibilityMenu() {
  const {
    panelOpen,
    openPanel,
    closePanel,
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
    highContrast,
    setHighContrast,
    darkMode,
    setDarkMode,
    grayscale,
    setGrayscale,
    reduceMotion,
    setReduceMotion,
    noColorReliance,
    setNoColorReliance,
    enhancedFocus,
    setEnhancedFocus,
    largeTargets,
    setLargeTargets,
    keyboardNavigation,
    setKeyboardNavigation,
    mediaAvailable,
    captionsAvailable,
    descriptionsAvailable,
    transcriptAvailable,
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
    resetAll,
  } = useAccessibility();
  const menuRef = useRef<HTMLDivElement>(null);
  const shortcutGuideRef = useRef<HTMLDivElement>(null);
  const [showShortcutGuide, setShowShortcutGuide] = useState(false);
  const navigate = useNavigate();

  useFocusTrap(menuRef, panelOpen, closePanel);

  useEffect(() => {
    if (!panelOpen) return;
    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        const button = document.querySelector('[aria-label*="menú de accesibilidad"], [aria-label*="accesibilidad"]');
        if (button && !button.contains(target)) {
          closePanel();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [panelOpen, closePanel]);

  useEffect(() => {
    document.body.style.overflow = panelOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [panelOpen]);

  useEffect(() => {
    const isTypingField = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tagName = target.tagName.toLowerCase();
      return (
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select' ||
        target.isContentEditable
      );
    };

    const handleGlobalShortcuts = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (isTypingField(target)) return;

      const key = event.key.toLowerCase();
      const prevent = [
        'a',
        'c',
        'm',
        'f',
        'g',
        'p',
        'r',
        'k',
        '=',
        '+',
        '-',
        '_',
      ].includes(key);
      if (!prevent) return;

      event.preventDefault();

      if (key === 'a') {
        if (panelOpen) closePanel();
        else openPanel();
        return;
      }

      if (key === 'c') {
        setHighContrast(!highContrast);
        return;
      }

      if (key === 'm') {
        setDarkMode(!darkMode);
        return;
      }

      if (key === 'f') {
        setEnhancedFocus(!enhancedFocus);
        return;
      }

      if (key === 'g') {
        setLargeTargets(!largeTargets);
        return;
      }

      if (key === 'p') {
        setReduceMotion(!reduceMotion);
        return;
      }

      if (key === 'r') {
        resetAll();
        return;
      }

      if (key === 'k') {
        if (!panelOpen) openPanel();
        setShowShortcutGuide((current) => !current);
        return;
      }

      if (key === '=' || key === '+') {
        setTextScale(Math.min(TEXT_SCALE_MAX, +(textScale + TEXT_SCALE_STEP).toFixed(2)));
        return;
      }

      if (key === '-' || key === '_') {
        setTextScale(Math.max(TEXT_SCALE_MIN, +(textScale - TEXT_SCALE_STEP).toFixed(2)));
      }
    };

    document.addEventListener('keydown', handleGlobalShortcuts);
    return () => document.removeEventListener('keydown', handleGlobalShortcuts);
  }, [panelOpen, closePanel, openPanel, highContrast, setHighContrast, darkMode, setDarkMode, enhancedFocus, setEnhancedFocus, largeTargets, setLargeTargets, reduceMotion, setReduceMotion, resetAll, setTextScale, textScale]);

  useEffect(() => {
    if (showShortcutGuide) {
      shortcutGuideRef.current?.focus();
    }
  }, [showShortcutGuide]);

  const mediaEnabled = mediaAvailable && (captionsAvailable || descriptionsAvailable || transcriptAvailable);

  return (
    <>
      <button
        type="button"
        aria-expanded={panelOpen}
        aria-controls="accessibility-menu"
        aria-label={panelOpen ? 'Cerrar menú de accesibilidad' : 'Abrir menú de accesibilidad'}
        className={`accessibility-menu-button ${panelOpen ? 'open' : ''}`}
        onClick={() => (panelOpen ? closePanel() : openPanel())}
      >
        <span aria-hidden="true">♿</span>
      </button>

      {panelOpen && (
        <div
          id="accessibility-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-menu-title"
          aria-describedby="accessibility-menu-description"
          tabIndex={-1}
          className="accessibility-menu-panel"
        >
          <div className="accessibility-menu-header">
            <div>
              <p className="accessibility-badge">✓ WCAG 2.2</p>
              <h2 id="accessibility-menu-title">Menú de accesibilidad</h2>
              <p id="accessibility-menu-description" className="accessibility-description">
                Controles globales para mejorar contraste, navegación y lectura en todo el sitio.
              </p>
              <button
                type="button"
                className="accessibility-shortcut-toggle"
                onClick={() => setShowShortcutGuide((current) => !current)}
                aria-expanded={showShortcutGuide}
                aria-controls="accessibility-shortcut-guide"
              >
                Ver atajos (Alt+K)
              </button>
            </div>
            <button type="button" onClick={closePanel} className="accessibility-close-button" aria-label="Cerrar menú de accesibilidad">
              ✕
            </button>
          </div>

          <div className="accessibility-menu-content">
            <div className="accessibility-menu-body">
              {showShortcutGuide && (
                <section
                  id="accessibility-shortcut-guide"
                  className="accessibility-section accessibility-shortcut-guide"
                  aria-labelledby="shortcut-guide-heading"
                  ref={shortcutGuideRef}
                  tabIndex={-1}
                >
                  <h3 id="shortcut-guide-heading">Guía de atajos</h3>
                  <p className="accessibility-note">Usa estos atajos desde cualquier parte del sitio, excepto cuando escribes en un campo.</p>
                  <h4 className="accessibility-shortcut-subheading">Atajos de accesibilidad</h4>
                  <ul className="accessibility-shortcut-list">
                    <li><strong>Alt + A</strong> — Abrir/cerrar menú</li>
                    <li><strong>Alt + C</strong> — Alternar Alto Contraste</li>
                    <li><strong>Alt + M</strong> — Alternar Modo Oscuro</li>
                    <li><strong>Alt + =</strong> / <strong>Alt + +</strong> — Aumentar tamaño de texto</li>
                    <li><strong>Alt + -</strong> — Reducir tamaño de texto</li>
                    <li><strong>Alt + F</strong> — Alternar Foco Mejorado</li>
                    <li><strong>Alt + G</strong> — Alternar Controles Grandes</li>
                    <li><strong>Alt + P</strong> — Pausar/reanudar animaciones</li>
                    <li><strong>Alt + R</strong> — Restablecer toda la configuración</li>
                    <li><strong>Alt + K</strong> — Mostrar/ocultar esta guía</li>
                  </ul>
                  <h4 className="accessibility-shortcut-subheading">Atajos de navegación</h4>
                  <ul className="accessibility-shortcut-list">
                    <li><strong>Alt + 1</strong> — Ir a Inicio</li>
                    <li><strong>Alt + 2</strong> — Ir a Tienda</li>
                    <li><strong>Alt + 3</strong> — Ir a Categorías</li>
                    <li><strong>Alt + 4</strong> — Ir a Sostenibilidad</li>
                    <li><strong>Alt + 5</strong> — Ir a Soporte</li>
                    <li><strong>Alt + S</strong> — Enfocar la búsqueda del header</li>
                    <li><strong>Alt + H</strong> — Ir a Historial de Compras</li>
                    <li><strong>Alt + 0</strong> — Ir a Carrito</li>
                    <li><strong>Alt + U</strong> — Ir a Mi Cuenta</li>
                    <li><strong>Alt + B</strong> — Volver atrás</li>
                  </ul>
                </section>
              )}
            <section className="accessibility-section" aria-labelledby="texto-heading">
              <h3 id="texto-heading">Texto</h3>
              <p className="accessibility-note">Ajusta el tamaño, el interlineado y el espaciado para mejorar la legibilidad.</p>

              <SliderRow
                label="Tamaño de texto"
                value={textScale}
                min={TEXT_SCALE_MIN}
                max={TEXT_SCALE_MAX}
                step={TEXT_SCALE_STEP}
                format={(v) => `${Math.round(v * 100)}%`}
                onChange={setTextScale}
                decLabel="Reducir tamaño de texto"
                incLabel="Aumentar tamaño de texto"
                slideLabel="Ajustar tamaño del texto"
              />

              <SliderRow
                label="Interlineado"
                value={lineHeight}
                min={LINE_HEIGHT_MIN}
                max={LINE_HEIGHT_MAX}
                step={LINE_HEIGHT_STEP}
                format={(v) => `${v.toFixed(1)}×`}
                onChange={setLineHeight}
                decLabel="Disminuir interlineado"
                incLabel="Aumentar interlineado"
                slideLabel="Ajustar interlineado"
              />

              <SliderRow
                label="Espaciado entre párrafos"
                value={paragraphSpacing}
                min={SPACING_MIN}
                max={SPACING_MAX}
                step={SPACING_STEP}
                format={(v) => `${v.toFixed(1)}×`}
                onChange={setParagraphSpacing}
                decLabel="Disminuir espaciado entre párrafos"
                incLabel="Aumentar espaciado entre párrafos"
                slideLabel="Ajustar espaciado entre párrafos"
              />

              <SliderRow
                label="Espaciado entre letras"
                value={letterSpacing}
                min={LETTER_SPACING_MIN}
                max={LETTER_SPACING_MAX}
                step={LETTER_SPACING_STEP}
                format={(v) => `${v.toFixed(2)}em`}
                onChange={setLetterSpacing}
                decLabel="Disminuir espaciado entre letras"
                incLabel="Aumentar espaciado entre letras"
                slideLabel="Ajustar espaciado entre letras"
              />

              <SliderRow
                label="Espaciado entre palabras"
                value={wordSpacing}
                min={WORD_SPACING_MIN}
                max={WORD_SPACING_MAX}
                step={WORD_SPACING_STEP}
                format={(v) => `${v.toFixed(2)}em`}
                onChange={setWordSpacing}
                decLabel="Disminuir espaciado entre palabras"
                incLabel="Aumentar espaciado entre palabras"
                slideLabel="Ajustar espaciado entre palabras"
              />
            </section>

            <section className="accessibility-section" aria-labelledby="color-heading">
              <h3 id="color-heading">Color y contraste</h3>
              <p className="accessibility-note">Cambia las ayudas visuales sin perder la consistencia de la interfaz.</p>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  className={`accessibility-toggle-button ${highContrast ? 'active' : ''}`}
                  aria-pressed={highContrast}
                >
                  Alto contraste {highContrast ? '✓' : ''}
                </button>
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`accessibility-toggle-button ${darkMode ? 'active' : ''}`}
                  aria-pressed={darkMode}
                >
                  Modo oscuro {darkMode ? '✓' : ''}
                </button>
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => setGrayscale(!grayscale)}
                  className={`accessibility-toggle-button ${grayscale ? 'active' : ''}`}
                  aria-pressed={grayscale}
                >
                  Escala de grises {grayscale ? '✓' : ''}
                </button>
              </div>
            </section>

            <section className="accessibility-section" aria-labelledby="preferencias-heading">
              <h3 id="preferencias-heading">Preferencias de interacción</h3>
              <p className="accessibility-note">Mejora la navegación y la detección de elementos con opciones visibles para teclado y foco.</p>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => setNoColorReliance(!noColorReliance)}
                  className={`accessibility-toggle-button ${noColorReliance ? 'active' : ''}`}
                  aria-pressed={noColorReliance}
                >
                  Sin dependencia del color {noColorReliance ? '✓' : ''}
                </button>
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => setEnhancedFocus(!enhancedFocus)}
                  className={`accessibility-toggle-button ${enhancedFocus ? 'active' : ''}`}
                  aria-pressed={enhancedFocus}
                >
                  Foco reforzado {enhancedFocus ? '✓' : ''}
                </button>
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => setLargeTargets(!largeTargets)}
                  className={`accessibility-toggle-button ${largeTargets ? 'active' : ''}`}
                  aria-pressed={largeTargets}
                >
                  Objetivos táctiles grandes {largeTargets ? '✓' : ''}
                </button>
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => setKeyboardNavigation(!keyboardNavigation)}
                  className={`accessibility-toggle-button ${keyboardNavigation ? 'active' : ''}`}
                  aria-pressed={keyboardNavigation}
                >
                  Navegación con teclado {keyboardNavigation ? '✓' : ''}
                </button>
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className={`accessibility-toggle-button ${reduceMotion ? 'active' : ''}`}
                  aria-pressed={reduceMotion}
                >
                  Pausar animaciones {reduceMotion ? '✓' : ''}
                </button>
              </div>
            </section>

            <section className="accessibility-section" aria-labelledby="multimedia-heading">
              <h3 id="multimedia-heading">Multimedia</h3>
              <p className="accessibility-note">Activa subtítulos y descripciones cuando el contenido multimedia esté disponible.</p>

              <div className="accessibility-status" role="status">
                {mediaEnabled ? 'Contenido multimedia detectado en la página.' : 'No se detectó contenido multimedia en la página.'}
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  disabled={!captionsAvailable}
                  onClick={() => setCaptions(!captions)}
                  className={`accessibility-toggle-button ${captions ? 'active' : ''}`}
                  aria-pressed={captions}
                >
                  Subtítulos {captions ? '✓' : ''}
                </button>
                {captionsAvailable || <span className="accessibility-note">Disponible solo si hay video con pistas de subtítulos.</span>}
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  disabled={!descriptionsAvailable}
                  onClick={() => setAudioDescriptions(!audioDescriptions)}
                  className={`accessibility-toggle-button ${audioDescriptions ? 'active' : ''}`}
                  aria-pressed={audioDescriptions}
                >
                  Descripciones de audio {audioDescriptions ? '✓' : ''}
                </button>
                {descriptionsAvailable || <span className="accessibility-note">Disponible solo si hay video con pista de descripciones.</span>}
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  disabled={!transcriptAvailable}
                  onClick={() => setTranscripts(!transcripts)}
                  className={`accessibility-toggle-button ${transcripts ? 'active' : ''}`}
                  aria-pressed={transcripts}
                >
                  Transcripciones visibles {transcripts ? '✓' : ''}
                </button>
                {transcriptAvailable || <span className="accessibility-note">Disponible solo si hay transcripciones de audio en la página.</span>}
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => setMuteAll(!muteAll)}
                  className={`accessibility-toggle-button ${muteAll ? 'active' : ''}`}
                  aria-pressed={muteAll}
                >
                  Silenciar multimedia {muteAll ? '✓' : ''}
                </button>
              </div>
            </section>

            <section className="accessibility-section" aria-labelledby="asistencia-heading">
              <h3 id="asistencia-heading">Asistencia</h3>
              <p className="accessibility-note">Muestra ayudas y errores claros durante las interacciones con formularios.</p>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => setShowHints(!showHints)}
                  className={`accessibility-toggle-button ${showHints ? 'active' : ''}`}
                  aria-pressed={showHints}
                >
                  Sugerencias visibles {showHints ? '✓' : ''}
                </button>
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => setValidationVisible(!validationVisible)}
                  className={`accessibility-toggle-button ${validationVisible ? 'active' : ''}`}
                  aria-pressed={validationVisible}
                >
                  Errores visibles {validationVisible ? '✓' : ''}
                </button>
              </div>

              <div className="accessibility-toggle-group">
                <button
                  type="button"
                  onClick={() => setConfirmationRequired(!confirmationRequired)}
                  className={`accessibility-toggle-button ${confirmationRequired ? 'active' : ''}`}
                  aria-pressed={confirmationRequired}
                >
                  Confirmación adicional {confirmationRequired ? '✓' : ''}
                </button>
              </div>
            </section>

            <section className="accessibility-section" aria-labelledby="acceso-heading">
              <h3 id="acceso-heading">Acceso rápido</h3>
              <div className="accessibility-quick-links" aria-label="Accesos rápidos">
                <a href="#main-content" onClick={closePanel} className="accessibility-link">
                  Saltar al contenido
                </a>
                <button
                  type="button"
                  onClick={() => {
                    closePanel();
                    navigate('/');
                  }}
                  className="accessibility-link accessibility-button-link"
                >
                  Ir al buscador
                </button>
                <Link to="/" className="accessibility-link" onClick={closePanel}>
                  Inicio
                </Link>
              </div>
            </section>
            </div>
          </div>

          <div className="accessibility-menu-footer">
            <button type="button" onClick={resetAll} className="accessibility-reset-button">
              Restablecer todo
            </button>
            <p className="accessibility-footer-note">Las opciones se guardan automáticamente en el dispositivo.</p>
          </div>
        </div>
      )}
    </>
  );
}
