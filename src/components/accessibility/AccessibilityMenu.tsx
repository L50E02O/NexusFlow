import { useEffect, useRef } from 'react';
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
    panelOpen, openPanel, closePanel,
    textScale, setTextScale,
    lineHeight, setLineHeight,
    paragraphSpacing, setParagraphSpacing,
    letterSpacing, setLetterSpacing,
    wordSpacing, setWordSpacing,
    highContrast, setHighContrast,
    darkMode, setDarkMode,
    grayscale, setGrayscale,
    reduceMotion, setReduceMotion,
    resetAll,
  } = useAccessibility();
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useFocusTrap(menuRef, panelOpen, closePanel);

  useEffect(() => {
    if (!panelOpen) return;
    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        const button = document.querySelector('[aria-label*="accesibilidad"]');
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
    return () => { document.body.style.overflow = ''; };
  }, [panelOpen]);

  return (
    <>
      <button
        type="button"
        aria-expanded={panelOpen}
        aria-controls="accessibility-menu"
        aria-label="Abrir menú de accesibilidad"
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
          aria-label="Menú de accesibilidad"
          aria-labelledby="accessibility-menu-title"
          className="accessibility-menu-panel"
        >
          <div className="accessibility-menu-header">
            <div>
              <p className="accessibility-badge">✓ WCAG 2.2</p>
              <h2 id="accessibility-menu-title">Menú de accesibilidad</h2>
              <p className="accessibility-description">Controles globales aplicados al DOM.</p>
            </div>
            <button type="button" onClick={closePanel} className="accessibility-close-button" aria-label="Cerrar menú de accesibilidad">
              ✕
            </button>
          </div>

          <div className="accessibility-menu-body">
            <section className="accessibility-section" aria-labelledby="texto-heading">
              <h3 id="texto-heading">Texto</h3>

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
              <h3 id="color-heading">Color y Contraste</h3>

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

            <section className="accessibility-section" aria-labelledby="orientacion-heading">
              <h3 id="orientacion-heading">Orientación y Diseño</h3>
              <p className="accessibility-note">El menú no bloquea la orientación y adapta su diseño en landscape.</p>
              <p className="accessibility-note">Al zoom máximo, el diseño principal se reordena para evitar scroll horizontal.</p>
            </section>

            <section className="accessibility-section" aria-labelledby="navegacion-heading">
              <h3 id="navegacion-heading">Navegación y Foco</h3>

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

              <div className="accessibility-quick-links" aria-label="Accesos rápidos">
                <a href="#main-content" onClick={closePanel} className="accessibility-link">
                  Saltar al contenido
                </a>
                <a href="#search" onClick={(e) => { e.preventDefault(); closePanel(); navigate('/'); }} className="accessibility-link">
                  Ir al buscador
                </a>
                <Link to="/" className="accessibility-link" onClick={closePanel}>
                  Inicio
                </Link>
              </div>
            </section>
          </div>

          <div className="accessibility-menu-footer">
            <button
              type="button"
              onClick={resetAll}
              className="accessibility-reset-button"
            >
              Restablecer todo
            </button>
            <p className="accessibility-footer-note">Las opciones se guardan en localStorage.</p>
          </div>
        </div>
      )}
    </>
  );
}
