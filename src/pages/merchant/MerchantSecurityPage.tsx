import { useState } from 'react';
import { Icon } from '@/shared/ui/Icon';
import { securitySummary, securityLogs } from '@/shared/data/merchantMock';

export function MerchantSecurityPage() {
  const [toggles, setToggles] = useState({
    dark: false,
    contrast: true,
    autoBlock: false,
    session: true,
  });

  const flip = (key: keyof typeof toggles) =>
    setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <div className="p-lg max-w-[1400px] mx-auto space-y-xl">
      <div className="flex flex-col md:flex-row justify-between items-end gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Seguridad y Detección de Fraude</h2>
          <p className="text-on-surface-variant text-body-md">
            Monitoreo de red en tiempo real impulsado por NexusFlow AI.
          </p>
        </div>
        <div className="flex gap-sm">
          <button type="button" className="border-2 border-primary text-primary px-lg py-md rounded-xl font-button focus-ring">
            Exportar Reporte
          </button>
          <button type="button" className="bg-primary text-on-primary px-lg py-md rounded-xl font-button focus-ring">
            Acción Crítica
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {securitySummary.map((s) => (
          <div key={s.label} className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant">
            <p className="text-on-surface-variant text-label-md">{s.label}</p>
            <p className="font-headline-md text-headline-md text-primary">{s.value}</p>
            <p
              className={`text-xs mt-xs font-semibold ${
                'stable' in s && s.stable
                  ? 'text-on-surface-variant'
                  : s.up
                    ? 'text-green-600'
                    : 'text-secondary'
              }`}
            >
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 space-y-lg">
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant">
            <h3 className="font-headline-md text-headline-md text-primary mb-lg">Tráfico de Seguridad</h3>
            <div className="h-48 flex items-end gap-sm px-md">
              {[40, 65, 50, 90, 75, 45, 30].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary-fixed rounded-t-lg hover:bg-secondary transition-colors"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
            <div className="p-lg border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md text-primary">Registros del Sistema</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-on-surface-variant text-label-md uppercase">
                  <tr>
                    <th className="px-lg py-md">Evento</th>
                    <th className="px-lg py-md">Usuario</th>
                    <th className="px-lg py-md">Ubicación</th>
                    <th className="px-lg py-md">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {securityLogs.map((log) => (
                    <tr key={log.time + log.event} className="hover:bg-surface-container-low/50">
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-sm">
                          <span className={`w-2 h-2 rounded-full ${log.ok ? 'bg-green-500' : 'bg-error'}`} />
                          {log.event}
                        </div>
                      </td>
                      <td className="px-lg py-md">{log.user}</td>
                      <td className="px-lg py-md text-on-surface-variant">{log.location}</td>
                      <td className="px-lg py-md text-on-surface-variant">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-lg">
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant">
            <h3 className="font-headline-md text-headline-md text-primary mb-md">Controles</h3>
            <div className="space-y-md">
              {(
                [
                  { key: 'dark' as const, label: 'Modo Oscuro', sub: 'Tema claro u oscuro' },
                  { key: 'contrast' as const, label: 'Alto Contraste', sub: 'Mejora legibilidad' },
                  { key: 'autoBlock' as const, label: 'Bloqueo Automático', sub: 'Detección de anomalías' },
                  { key: 'session' as const, label: 'Expiración Sesión', sub: 'Cierre por inactividad' },
                ] as const
              ).map((item) => (
                <div key={item.key} className="flex justify-between items-center p-md border border-outline-variant rounded-xl">
                  <div>
                    <p className="font-label-md">{item.label}</p>
                    <p className="text-xs text-on-surface-variant">{item.sub}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={toggles[item.key]}
                    onClick={() => flip(item.key)}
                    className={`w-14 h-8 rounded-full relative transition-colors focus-ring ${
                      toggles[item.key] ? 'bg-primary' : 'bg-outline-variant'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                        toggles[item.key] ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary-container text-on-primary-container p-lg rounded-xl relative overflow-hidden">
            <div className="flex items-center gap-sm mb-md relative z-10">
              <Icon name="smart_toy" filled className="text-tertiary-fixed" />
              <h3 className="font-headline-md">AI Intelligence</h3>
            </div>
            <p className="text-sm text-primary-fixed-dim relative z-10 mb-md">
              Confianza de detección: <strong className="text-white text-2xl">99.4%</strong>
            </p>
            <div className="w-full bg-white/10 h-1 rounded-full mb-lg relative z-10">
              <div className="bg-secondary-fixed h-full w-[99%]" />
            </div>
            <button type="button" className="w-full py-md bg-secondary-fixed text-on-secondary-fixed rounded-xl font-button relative z-10 focus-ring">
              Ver Análisis Completo
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
