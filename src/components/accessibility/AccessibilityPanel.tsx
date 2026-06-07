import { useRef } from 'react';
import { Icon } from '@/shared/ui/Icon';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { useMenuAccesibilidad } from '@/shared/hooks/useMenuAccesibilidad';
import { useFocusTrap } from '@/shared/hooks/useFocusTrap';
import { DataStatus } from '@/shared/ui/DataStatus';

function Toggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id: string;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`min-w-14 min-h-8 w-14 h-8 rounded-full relative transition-colors focus-ring ${
        checked ? 'bg-primary' : 'bg-outline-variant'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${
          checked ? 'right-1' : 'left-1'
        }`}
      />
    </button>
  );
}

export function AccessibilityPanel() {
  const {
    panelOpen,
    closePanel,
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
  } = useAccessibility();
  const { groupedByCategoria, loading, error } = useMenuAccesibilidad();
  const panelRef = useRef<HTMLElement>(null);

  // WCAG 2.2 — 2.1.2 ✓ Focus trap y Escape para cerrar
  useFocusTrap(panelRef, panelOpen, closePanel);

  if (!panelOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar panel de accesibilidad"
        className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40"
        onClick={closePanel}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-panel-title"
        className="fixed top-0 right-0 h-full w-full max-w-[25rem] bg-surface-container-lowest shadow-2xl z-50 border-l border-outline-variant flex flex-col"
        aria-label="Panel de accesibilidad"
      >
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-primary text-on-primary">
          <div className="flex items-center gap-sm">
            <Icon name="accessibility_new" className="filled" aria-hidden={false} />
            <h2 id="a11y-panel-title" className="font-headline-md text-headline-md">
              Menú de accesibilidad
            </h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar panel"
            onClick={closePanel}
            className="min-w-11 min-h-11 p-2 hover:bg-white/10 rounded-full focus-ring flex items-center justify-center"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-lg flex flex-col gap-xl">
          <section className="flex flex-col gap-md" aria-labelledby="a11y-general-heading">
            <h3
              id="a11y-general-heading"
              className="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-outline-variant pb-2"
            >
              Configuración general
            </h3>

            <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl gap-md">
              <div className="flex gap-md items-center">
                <Icon name="format_size" className="text-primary" />
                <p className="font-button text-button text-on-surface" id="text-scale-label">
                  Tamaño de texto
                </p>
              </div>
              <div className="flex gap-sm" role="group" aria-labelledby="text-scale-label">
                {(['sm', 'md', 'lg'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setTextScale(size)}
                    aria-pressed={textScale === size}
                    aria-label={
                      size === 'sm' ? 'Reducir tamaño de texto' : size === 'md' ? 'Tamaño normal' : 'Aumentar tamaño de texto'
                    }
                    className={`min-w-11 min-h-11 px-md rounded-lg font-bold text-xl transition-all focus-ring ${
                      textScale === size
                        ? 'bg-primary text-on-primary shadow-md'
                        : 'bg-surface-container-high hover:bg-primary hover:text-on-primary'
                    }`}
                  >
                    {size === 'sm' ? 'A−' : size === 'md' ? '100%' : 'A+'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl">
              <div className="flex gap-md items-center">
                <Icon name="contrast" className="text-primary" />
                <div>
                  <p className="font-button text-button text-on-surface" id="high-contrast-label">
                    Alto contraste
                  </p>
                  <p className="text-label-md text-on-surface-variant">Fondo negro y texto blanco</p>
                </div>
              </div>
              <Toggle
                id="toggle-high-contrast"
                checked={highContrast}
                onChange={setHighContrast}
                label="Alto contraste"
              />
            </div>

            <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl">
              <div className="flex gap-md items-center">
                <Icon name="tonality" className="text-primary" />
                <div>
                  <p className="font-button text-button text-on-surface" id="grayscale-label">
                    Escala de grises
                  </p>
                  <p className="text-label-md text-on-surface-variant">Desaturar colores de la interfaz</p>
                </div>
              </div>
              <Toggle id="toggle-grayscale" checked={grayscale} onChange={setGrayscale} label="Escala de grises" />
            </div>

            <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl">
              <div className="flex gap-md items-center">
                <Icon name="link" className="text-primary" />
                <div>
                  <p className="font-button text-button text-on-surface" id="underline-links-label">
                    Subrayar enlaces
                  </p>
                  <p className="text-label-md text-on-surface-variant">Resaltar todos los enlaces</p>
                </div>
              </div>
              <Toggle
                id="toggle-underline-links"
                checked={underlineLinks}
                onChange={setUnderlineLinks}
                label="Subrayar enlaces"
              />
            </div>

            <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl">
              <div className="flex gap-md items-center">
                <Icon name="motion_photos_paused" className="text-primary" />
                <div>
                  <p className="font-button text-button text-on-surface" id="reduce-motion-label">
                    Pausar animaciones
                  </p>
                  <p className="text-label-md text-on-surface-variant">Detener transiciones y animaciones</p>
                </div>
              </div>
              <Toggle
                id="toggle-reduce-motion"
                checked={reduceMotion}
                onChange={setReduceMotion}
                label="Pausar animaciones"
              />
            </div>

            <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl">
              <div className="flex gap-md items-center">
                <Icon name="dark_mode" className="text-primary" />
                <div>
                  <p className="font-button text-button text-on-surface">Modo oscuro</p>
                  <p className="text-label-md text-on-surface-variant">Alternar entre tema claro y oscuro</p>
                </div>
              </div>
              <Toggle id="toggle-dark-mode" checked={darkMode} onChange={setDarkMode} label="Modo oscuro" />
            </div>
          </section>

          <section className="flex flex-col gap-md" aria-labelledby="a11y-criteria-heading">
            <h3
              id="a11y-criteria-heading"
              className="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-outline-variant pb-2"
            >
              Criterios WCAG 2.2
            </h3>
            <DataStatus loading={loading} error={error} isEmpty={Object.keys(groupedByCategoria).length === 0}>
              <div className="flex flex-col gap-lg">
                {Object.entries(groupedByCategoria).map(([categoria, items]) => (
                  <div key={categoria} className="flex flex-col gap-sm">
                    <h4 className="font-button text-button text-primary">{categoria}</h4>
                    <ul className="flex flex-col gap-sm list-none p-0 m-0">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="p-md bg-surface border border-outline-variant rounded-xl space-y-xs"
                        >
                          <div className="flex items-center justify-between gap-sm">
                            <span className="font-label-md text-primary">{item.elemento_criterio}</span>
                            <span
                              className={`text-label-md font-bold uppercase px-sm py-xs rounded-full ${
                                item.aplica_todos_formularios
                                  ? 'bg-secondary-container text-on-secondary-container'
                                  : 'bg-surface-container-high text-on-surface-variant'
                              }`}
                            >
                              {item.aplica_todos_formularios ? 'Todos los formularios' : 'Formulario específico'}
                            </span>
                          </div>
                          <p className="text-label-md text-on-surface-variant leading-snug">
                            {item.descripcion_criterio}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </DataStatus>
          </section>
        </div>

        <div className="p-lg border-t border-outline-variant bg-surface-container flex flex-col gap-md">
          <button
            type="button"
            onClick={resetAll}
            className="w-full border-2 border-outline-variant text-on-surface font-button text-button py-md rounded-xl hover:bg-surface-container-high transition-all focus-ring min-h-11"
          >
            Restablecer configuración
          </button>
          <button
            type="button"
            onClick={closePanel}
            className="w-full bg-primary text-on-primary font-button text-button py-md rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all focus-ring min-h-11"
          >
            Cerrar menú
          </button>
          <p className="text-center text-label-md text-on-surface-variant" role="status">
            Cumple con las pautas de accesibilidad WCAG 2.2 Nivel AA.
          </p>
        </div>
      </aside>
    </>
  );
}
