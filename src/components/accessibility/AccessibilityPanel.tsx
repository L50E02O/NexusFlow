import { useRef, type ReactNode } from 'react';
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
      className={`relative h-8 min-h-8 w-14 min-w-14 shrink-0 rounded-full transition-colors focus-ring ${
        checked ? 'bg-primary' : 'bg-outline-variant'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-all ${
          checked ? 'right-1' : 'left-1'
        }`}
      />
    </button>
  );
}

function SettingRow({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-md rounded-xl border border-outline-variant bg-surface p-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-md">
        <Icon name={icon} className="mt-0.5 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="font-button text-button text-on-surface">{title}</p>
          {description && (
            <p className="text-label-md leading-snug text-on-surface-variant">{description}</p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-end sm:justify-center">{children}</div>
    </div>
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

  useFocusTrap(panelRef, panelOpen, closePanel);

  if (!panelOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar panel de accesibilidad"
        className="fixed inset-0 z-40 bg-primary/20 backdrop-blur-sm"
        onClick={closePanel}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-panel-title"
        className="fixed top-0 right-0 z-50 flex h-full w-full max-w-[min(100vw,25rem)] flex-col border-l border-outline-variant bg-surface-container-lowest shadow-2xl"
        aria-label="Panel de accesibilidad"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-outline-variant bg-primary p-lg text-on-primary">
          <div className="flex min-w-0 items-center gap-sm">
            <Icon name="accessibility_new" className="shrink-0 filled" aria-hidden={false} />
            <h2 id="a11y-panel-title" className="truncate font-headline-md text-headline-md">
              Menú de accesibilidad
            </h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar panel"
            onClick={closePanel}
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full p-2 hover:bg-white/10 focus-ring"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex flex-grow flex-col gap-xl overflow-y-auto p-lg">
          <section className="flex flex-col gap-md" aria-labelledby="a11y-general-heading">
            <h3
              id="a11y-general-heading"
              className="border-b border-outline-variant pb-2 font-label-md text-label-md uppercase tracking-widest text-primary"
            >
              Configuración general
            </h3>

            <div className="flex flex-col gap-md rounded-xl border border-outline-variant bg-surface p-md">
              <div className="flex min-w-0 items-center gap-md">
                <Icon name="format_size" className="shrink-0 text-primary" />
                <p className="font-button text-button text-on-surface" id="text-scale-label">
                  Tamaño de texto
                </p>
              </div>
              <div className="flex flex-wrap gap-sm" role="group" aria-labelledby="text-scale-label">
                {(['sm', 'md', 'lg'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setTextScale(size)}
                    aria-pressed={textScale === size}
                    aria-label={
                      size === 'sm'
                        ? 'Reducir tamaño de texto'
                        : size === 'md'
                          ? 'Tamaño normal'
                          : 'Aumentar tamaño de texto'
                    }
                    className={`min-h-11 min-w-11 flex-1 rounded-lg px-md text-xl font-bold transition-all focus-ring sm:flex-none ${
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

            <SettingRow icon="contrast" title="Alto contraste" description="Fondo negro y texto blanco">
              <Toggle
                id="toggle-high-contrast"
                checked={highContrast}
                onChange={setHighContrast}
                label="Alto contraste"
              />
            </SettingRow>

            <SettingRow icon="tonality" title="Escala de grises" description="Desaturar colores de la interfaz">
              <Toggle id="toggle-grayscale" checked={grayscale} onChange={setGrayscale} label="Escala de grises" />
            </SettingRow>

            <SettingRow icon="link" title="Subrayar enlaces" description="Resaltar todos los enlaces">
              <Toggle
                id="toggle-underline-links"
                checked={underlineLinks}
                onChange={setUnderlineLinks}
                label="Subrayar enlaces"
              />
            </SettingRow>

            <SettingRow icon="motion_photos_paused" title="Pausar animaciones" description="Detener transiciones y animaciones">
              <Toggle
                id="toggle-reduce-motion"
                checked={reduceMotion}
                onChange={setReduceMotion}
                label="Pausar animaciones"
              />
            </SettingRow>

            <SettingRow icon="dark_mode" title="Modo oscuro" description="Alternar entre tema claro y oscuro">
              <Toggle id="toggle-dark-mode" checked={darkMode} onChange={setDarkMode} label="Modo oscuro" />
            </SettingRow>
          </section>

          <section className="flex flex-col gap-md" aria-labelledby="a11y-criteria-heading">
            <h3
              id="a11y-criteria-heading"
              className="border-b border-outline-variant pb-2 font-label-md text-label-md uppercase tracking-widest text-primary"
            >
              Criterios WCAG 2.2
            </h3>
            <DataStatus loading={loading} error={error} isEmpty={Object.keys(groupedByCategoria).length === 0}>
              <div className="flex flex-col gap-lg">
                {Object.entries(groupedByCategoria).map(([categoria, items]) => (
                  <div key={categoria} className="flex flex-col gap-sm">
                    <h4 className="font-button text-button leading-snug text-primary">{categoria}</h4>
                    <ul className="m-0 flex list-none flex-col gap-sm p-0">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="space-y-xs rounded-xl border border-outline-variant bg-surface p-md"
                        >
                          <div className="flex flex-col gap-sm sm:flex-row sm:items-start sm:justify-between">
                            <span className="min-w-0 break-words font-label-md text-primary">
                              {item.elemento_criterio}
                            </span>
                            <span
                              className={`shrink-0 self-start rounded-full px-sm py-xs text-label-md font-bold uppercase ${
                                item.aplica_todos_formularios
                                  ? 'bg-secondary-container text-on-secondary-container'
                                  : 'bg-surface-container-high text-on-surface-variant'
                              }`}
                            >
                              {item.aplica_todos_formularios ? 'Todos los formularios' : 'Formulario específico'}
                            </span>
                          </div>
                          <p className="break-words text-label-md leading-relaxed text-on-surface-variant">
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

        <div className="flex shrink-0 flex-col gap-md border-t border-outline-variant bg-surface-container p-lg">
          <button
            type="button"
            onClick={resetAll}
            className="min-h-11 w-full rounded-xl border-2 border-outline-variant py-md font-button text-button text-on-surface transition-all hover:bg-surface-container-high focus-ring"
          >
            Restablecer configuración
          </button>
          <button
            type="button"
            onClick={closePanel}
            className="min-h-11 w-full rounded-xl bg-primary py-md font-button text-button text-on-primary shadow-lg transition-all hover:scale-[1.02] active:scale-95 focus-ring"
          >
            Cerrar menú
          </button>
          <p className="text-center text-label-md leading-snug text-on-surface-variant" role="status">
            Cumple con las pautas de accesibilidad WCAG 2.2 Nivel AA.
          </p>
        </div>
      </aside>
    </>
  );
}
