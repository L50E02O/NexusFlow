import { Icon } from '@/shared/ui/Icon';
import { returnRequests, returnStatusLabels } from '@/shared/data/merchantMock';

export function MerchantReturnsPage() {
  return (
    <div className="p-lg max-w-[1400px] mx-auto space-y-xl">
      <div className="flex flex-col md:flex-row justify-between items-end gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Gestión de Devoluciones</h2>
          <p className="text-on-surface-variant text-body-md">
            Monitorea y procesa las solicitudes de tus clientes en tiempo real.
          </p>
        </div>
        <button type="button" className="flex items-center gap-sm px-lg py-md bg-primary text-on-primary rounded-lg font-button focus-ring">
          <Icon name="download" /> Exportar Reporte
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="bg-surface p-lg rounded-lg shadow-sm border border-outline-variant flex gap-lg">
          <span className="w-14 h-14 bg-secondary-fixed rounded-xl flex items-center justify-center text-primary">
            <Icon name="assignment_return" className="text-3xl" />
          </span>
          <div>
            <p className="text-on-surface-variant text-label-md uppercase">Total Devoluciones</p>
            <p className="font-headline-md text-headline-md">1,284</p>
            <p className="text-xs text-green-600 font-bold flex items-center gap-xs mt-xs">
              <Icon name="trending_up" className="text-sm" /> +12% vs mes anterior
            </p>
          </div>
        </div>
        <div className="bg-surface p-lg rounded-lg shadow-sm border border-outline-variant flex gap-lg">
          <span className="w-14 h-14 bg-tertiary-fixed rounded-xl flex items-center justify-center">
            <Icon name="pending_actions" className="text-3xl" />
          </span>
          <div>
            <p className="text-on-surface-variant text-label-md uppercase">Reembolsos en Proceso</p>
            <p className="font-headline-md text-headline-md">42</p>
            <p className="text-xs text-on-surface-variant mt-xs">Tiempo medio: 2.4 días</p>
          </div>
        </div>
        <div className="bg-surface p-lg rounded-lg shadow-sm border border-outline-variant flex gap-lg">
          <span className="w-14 h-14 bg-error-container rounded-xl flex items-center justify-center text-error">
            <Icon name="priority_high" className="text-3xl" filled />
          </span>
          <div>
            <p className="text-on-surface-variant text-label-md uppercase">Casos Críticos</p>
            <p className="font-headline-md text-headline-md text-error">08</p>
            <p className="text-xs text-error font-bold mt-xs">Requieren atención inmediata</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 bg-surface rounded-lg shadow-sm border border-outline-variant overflow-hidden">
          <div className="p-lg border-b border-outline-variant flex justify-between">
            <h3 className="font-headline-md text-headline-md text-primary">Solicitudes Recientes</h3>
            <button type="button" className="text-primary font-label-md hover:underline">
              Ver todo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-label-md uppercase">
                <tr>
                  <th className="px-lg py-md">ID Pedido</th>
                  <th className="px-lg py-md">Producto</th>
                  <th className="px-lg py-md">Motivo</th>
                  <th className="px-lg py-md">Estado</th>
                  <th className="px-lg py-md" />
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {returnRequests.map((r) => {
                  const st = returnStatusLabels[r.status];
                  return (
                    <tr key={r.id} className="hover:bg-surface-container-low">
                      <td className="px-lg py-md font-bold text-primary">#{r.id}</td>
                      <td className="px-lg py-md">{r.product}</td>
                      <td className="px-lg py-md text-on-surface-variant">{r.reason}</td>
                      <td className="px-lg py-md">
                        <span className={`px-sm py-1 rounded-full text-xs font-bold uppercase ${st.className}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-lg py-md">
                        <button type="button" className="p-sm hover:bg-secondary-fixed rounded-lg focus-ring" aria-label="Ver">
                          <Icon name="visibility" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-lg">
          <div className="bg-primary-container text-on-primary-container p-lg rounded-xl shadow-lg space-y-md">
            <div className="flex items-center gap-sm">
              <Icon name="auto_awesome" className="text-secondary-container" filled />
              <h3 className="font-headline-md">Intelligence: Análisis de Incidencias</h3>
            </div>
            <p className="text-sm text-primary-fixed-dim">
              Patrón detectado en <strong className="text-tertiary-fixed">Laptop Ultra Pro X1</strong>: 85% reportan fallos de píxeles.
            </p>
            <button type="button" className="w-full py-md bg-secondary-fixed text-on-secondary-fixed rounded-lg font-button focus-ring">
              Ejecutar Acción
            </button>
          </div>
          <div className="bg-surface rounded-lg border border-outline-variant p-lg space-y-md">
            <h4 className="font-label-md text-primary uppercase">Acciones Rápidas</h4>
            {[
              { icon: 'check_circle', label: 'Aprobar Devolución' },
              { icon: 'cancel', label: 'Rechazar Solicitud', error: true },
              { icon: 'payments', label: 'Gestionar Reembolso', primary: true },
            ].map((a) => (
              <button
                key={a.label}
                type="button"
                className={`w-full flex justify-between items-center p-md rounded-lg border border-outline-variant hover:border-primary transition-all focus-ring ${
                  a.primary ? 'bg-primary text-on-primary' : ''
                }`}
              >
                <span className="flex items-center gap-md font-label-md">
                  <Icon name={a.icon} className={a.error ? 'text-error' : ''} />
                  {a.label}
                </span>
                <Icon name="arrow_forward_ios" className="text-sm" />
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
