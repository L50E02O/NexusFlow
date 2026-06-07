import { Icon } from '@/shared/ui/Icon';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { useMenuAccesibilidad } from '@/shared/hooks/useMenuAccesibilidad';
import { DataStatus } from '@/shared/ui/DataStatus';

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`w-14 h-8 rounded-full relative transition-colors ${
        checked ? 'bg-primary' : 'bg-outline-variant'
      }`}
    >
      <span
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
    textScale,
    setTextScale,
  } = useAccessibility();
  const { groupedByCategoria, loading, error } = useMenuAccesibilidad();

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
        className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-surface-container-lowest shadow-2xl z-50 border-l border-outline-variant flex flex-col"
        aria-label="Panel de accesibilidad"
      >
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-primary text-on-primary">
          <div className="flex items-center gap-sm">
            <Icon name="accessibility_new" className="filled" />
            <h2 className="font-headline-md text-headline-md">Panel de Accesibilidad</h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar panel"
            onClick={closePanel}
            className="p-2 hover:bg-white/10 rounded-full focus-ring"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-lg flex flex-col gap-xl">
          <section className="flex flex-col gap-md">
            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-outline-variant pb-2">
              Configuración general
            </h3>
            <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl">
              <div className="flex gap-md items-center">
                <Icon name="dark_mode" className="text-primary" />
                <div>
                  <p className="font-button text-button text-on-surface">Modo oscuro</p>
                  <p className="text-[12px] text-on-surface-variant">Alternar entre tema claro y oscuro</p>
                </div>
              </div>
              <Toggle checked={darkMode} onChange={setDarkMode} label="Modo oscuro" />
            </div>
            <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl">
              <div className="flex gap-md items-center">
                <Icon name="contrast" className="text-primary" />
                <div>
                  <p className="font-button text-button text-on-surface">Alto contraste</p>
                  <p className="text-[12px] text-on-surface-variant">Mejora la visibilidad del texto</p>
                </div>
              </div>
              <Toggle checked={highContrast} onChange={setHighContrast} label="Alto contraste" />
            </div>
            <div className="flex flex-col gap-sm p-md bg-surface border border-outline-variant rounded-xl">
              <div className="flex gap-md items-center mb-2">
                <Icon name="format_size" className="text-primary" />
                <p className="font-button text-button text-on-surface">Tamaño de texto</p>
              </div>
              <div className="flex gap-sm">
                {(['sm', 'md', 'lg'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setTextScale(size)}
                    className={`flex-1 min-h-12 rounded-lg font-bold text-xl transition-all focus-ring ${
                      textScale === size
                        ? 'bg-primary text-on-primary shadow-md'
                        : 'bg-surface-container-high hover:bg-primary hover:text-on-primary'
                    }`}
                  >
                    {size === 'sm' ? 'A-' : size === 'md' ? '100%' : 'A+'}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-md">
            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-outline-variant pb-2">
              Criterios F1-3-UA-2026
            </h3>
            <DataStatus loading={loading} error={error} isEmpty={Object.keys(groupedByCategoria).length === 0}>
              <div className="flex flex-col gap-lg">
                {Object.entries(groupedByCategoria).map(([categoria, items]) => (
                  <div key={categoria} className="flex flex-col gap-sm">
                    <h4 className="font-button text-button text-primary">{categoria}</h4>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-md bg-surface border border-outline-variant rounded-xl space-y-xs"
                      >
                        <div className="flex items-center justify-between gap-sm">
                          <span className="font-label-md text-primary">{item.elemento_criterio}</span>
                          <span
                            className={`text-[10px] font-bold uppercase px-sm py-xs rounded-full ${
                              item.aplica_todos_formularios
                                ? 'bg-secondary-container text-on-secondary-container'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {item.aplica_todos_formularios ? 'Todos los formularios' : 'Formulario específico'}
                          </span>
                        </div>
                        <p className="text-[12px] text-on-surface-variant leading-snug">
                          {item.descripcion_criterio}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </DataStatus>
          </section>
        </div>

        <div className="p-lg border-t border-outline-variant bg-surface-container">
          <button
            type="button"
            onClick={closePanel}
            className="w-full bg-primary text-on-primary font-button text-button py-md rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all focus-ring min-h-11"
          >
            Guardar configuración
          </button>
          <p className="text-center text-[11px] text-on-surface-variant mt-md">
            Cumple con las pautas de accesibilidad WCAG 2.2 Nivel AAA.
          </p>
        </div>
      </aside>
    </>
  );
}
