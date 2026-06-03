import { Icon } from '@/shared/ui/Icon';
import {
  merchantMetrics,
  merchantOrders,
  lowStockItems,
  merchantAiTips,
} from '@/shared/data/merchantMock';
import { merchantOrderStatus } from '@/shared/data/merchantMock';

export function MerchantDashboardPage() {
  return (
    <div className="p-lg max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        {merchantMetrics.map((m) => (
          <div
            key={m.label}
            className={`p-lg rounded-xl shadow-sm border hover:shadow-md transition-shadow ${
              'critical' in m && m.critical
                ? 'bg-error-container border-error/20'
                : 'bg-surface-container-lowest border-outline-variant/10'
            }`}
          >
            <div className="flex justify-between items-start mb-md">
              <span className={`p-sm rounded-lg ${m.iconBg}`}>
                <Icon name={m.icon} filled={'critical' in m && m.critical} />
              </span>
              <span
                className={`text-label-md flex items-center gap-xs ${
                  'critical' in m && m.critical
                    ? 'text-error font-bold'
                    : 'up' in m && m.up
                      ? 'text-green-600'
                      : 'text-error'
                }`}
              >
                {'critical' in m && m.critical ? null : 'up' in m && m.up ? (
                  <Icon name="trending_up" className="text-sm" />
                ) : (
                  <Icon name="trending_down" className="text-sm" />
                )}
                {m.delta}
              </span>
            </div>
            <p className="text-on-surface-variant text-label-md uppercase tracking-wider">{m.label}</p>
            <h3 className="text-display-lg text-primary mt-xs leading-none">{m.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-lg mb-xl">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex items-center justify-between mb-xl">
            <div>
              <h2 className="text-headline-md text-primary">Analíticas de Ventas</h2>
              <p className="text-on-surface-variant text-body-md">Rendimiento de ingresos en los últimos 30 días</p>
            </div>
            <div className="flex gap-sm">
              <button type="button" className="px-md py-sm bg-surface-container text-on-surface-variant text-label-md rounded-lg">
                Diario
              </button>
              <button type="button" className="px-md py-sm bg-primary text-on-primary text-label-md rounded-lg">
                Mensual
              </button>
            </div>
          </div>
          <div className="h-64 w-full relative flex items-end gap-sm px-md">
            {[40, 65, 50, 90, 75, 45, 30].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-secondary-container/40 rounded-t-sm hover:bg-secondary-container transition-colors"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-lg">
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-md">
              <h4 className="font-headline-md text-primary">Control de Inventario</h4>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed px-sm py-xs rounded text-[10px] font-bold">
                {lowStockItems.length} LOW
              </span>
            </div>
            <div className="space-y-md">
              {lowStockItems.map((item) => (
                <div key={item.name} className="flex items-center gap-md p-sm hover:bg-surface-container rounded-lg">
                  <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-label-md text-primary truncate">{item.name}</p>
                    <p className="text-xs text-error font-bold">Solo {item.stock} unidades</p>
                  </div>
                  <button type="button" className="p-xs text-primary hover:bg-primary-fixed rounded focus-ring">
                    <Icon name="refresh" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-primary p-lg rounded-xl text-on-primary">
            <h4 className="font-headline-md mb-lg">Segmentos de Clientes</h4>
            <p className="text-xs text-primary-fixed-dim opacity-80">
              Tu tasa de clientes recurrentes es un 12% más alta que el promedio de la industria.
            </p>
          </div>
        </div>
      </div>

      <section className="bg-surface-container-highest/30 p-xl rounded-xl border border-dashed border-primary-container/30 mb-xl">
        <div className="flex items-center gap-md mb-lg">
          <Icon name="auto_awesome" className="text-primary-container text-[32px]" />
          <h2 className="text-headline-md text-primary">Recomendaciones de Estrategia de IA</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {merchantAiTips.map((tip) => (
            <div
              key={tip.title}
              className="bg-surface-container-lowest p-lg rounded-xl hover:shadow-md transition-shadow group"
            >
              <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-sm">{tip.tag}</span>
              <h4 className="text-label-md font-bold text-primary mb-md">{tip.title}</h4>
              <p className="text-body-md text-on-surface-variant mb-lg">{tip.body}</p>
              <button
                type="button"
                className="text-primary font-button flex items-center gap-sm group-hover:translate-x-1 transition-transform"
              >
                {tip.action}
                <Icon name="arrow_forward" className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/10 overflow-x-auto">
        <div className="flex items-center justify-between mb-xl">
          <h2 className="text-headline-md text-primary">Pedidos Recientes</h2>
          <button type="button" className="text-primary font-button flex items-center gap-xs">
            Exportar CSV
            <Icon name="download" />
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-surface-container-highest">
              <th className="py-md text-label-md text-on-surface-variant">ID</th>
              <th className="py-md text-label-md text-on-surface-variant">Cliente</th>
              <th className="py-md text-label-md text-on-surface-variant">Producto</th>
              <th className="py-md text-label-md text-on-surface-variant">Monto</th>
              <th className="py-md text-label-md text-on-surface-variant">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {merchantOrders.map((o) => {
              const st = merchantOrderStatus[o.status];
              return (
                <tr key={o.id} className="hover:bg-surface-container-low">
                  <td className="py-lg font-label-md text-primary">#{o.id}</td>
                  <td className="py-lg">
                    <div className="flex items-center gap-md">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-xs font-bold">
                        {o.customerInitials}
                      </div>
                      <span className="font-bold text-primary">{o.customer}</span>
                    </div>
                  </td>
                  <td className="py-lg">{o.product}</td>
                  <td className="py-lg font-bold text-primary">${o.amount.toFixed(2)}</td>
                  <td className="py-lg">
                    <span className={`px-md py-1 rounded-full text-xs font-bold uppercase ${st.className}`}>
                      {st.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
