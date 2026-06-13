import { Icon } from '@/shared/ui/Icon';
import {
  inventorySummary,
  inventoryProducts,
  lowStockItems,
} from '@/shared/data/merchantMock';

const statusBadge = {
  ok: { label: 'En stock', className: 'text-on-secondary-container' },
  low: { label: 'Bajo stock', className: 'text-error font-bold' },
  out: { label: 'Agotado', className: 'text-on-surface-variant' },
};

export function MerchantInventoryPage() {
  return (
    <div className="p-lg max-w-[1400px] mx-auto space-y-xl">
      <div className="flex flex-col md:flex-row justify-between items-end gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Gestión de Inventario</h2>
          <p className="text-on-surface-variant text-body-md">
            Control total de stock, reposiciones y análisis predictivo.
          </p>
        </div>
        <div className="flex gap-sm flex-wrap">
          <button type="button" className="flex items-center gap-sm px-lg py-sm border-2 border-primary text-primary rounded-xl font-button hover:bg-primary/5 focus-ring">
            <Icon name="file_download" /> Exportar
          </button>
          <button type="button" className="flex items-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-xl font-button hover:opacity-90 focus-ring">
            <Icon name="add" /> Nuevo Producto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        {inventorySummary.map((m) => (
          <div
            key={m.label}
            className={`p-lg rounded-xl shadow-sm border flex items-start justify-between gap-md hover:-translate-y-1 transition-transform ${
              'critical' in m && m.critical
                ? 'bg-error-container border-error/20'
                : 'bg-surface border-outline-variant'
            }`}
          >
            <div>
              <p className="text-on-surface-variant text-label-md">{m.label}</p>
              <p className="font-headline-md text-headline-md text-primary mt-xs">{m.value}</p>
              <p className={`text-xs mt-xs ${'critical' in m && m.critical ? 'text-error font-bold' : 'text-on-surface-variant'}`}>
                {m.note}
              </p>
            </div>
            <span className={`p-sm rounded-xl ${m.iconBg}`}>
              <Icon name={m.icon} filled={'critical' in m && m.critical} />
            </span>
          </div>
        ))}
      </div>

      <section className="bg-primary-container text-on-primary-container p-xl rounded-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row gap-xl items-center">
          <div className="flex-1 space-y-md">
            <div className="flex items-center gap-sm">
              <Icon name="auto_awesome" className="text-tertiary-fixed" filled />
              <h3 className="font-headline-md text-headline-md text-on-primary-fixed">Asistente NexusFlow</h3>
            </div>
            <p className="text-primary-fixed-dim text-body-md">
              Se predice un incremento del 22% en Electrónica el próximo fin de semana.
            </p>
            <div className="space-y-sm">
              {lowStockItems.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between items-center p-md bg-white/10 rounded-xl border border-white/5"
                >
                  <div>
                    <p className="font-label-md">{item.name}</p>
                    <p className="text-xs opacity-80">Stock: {item.stock} unidades</p>
                  </div>
                  <button type="button" className="bg-secondary-fixed text-on-secondary-fixed px-md py-xs rounded-lg text-xs font-button">
                    Reponer
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/3 bg-white/10 backdrop-blur-md rounded-xl p-lg border border-white/5">
            <p className="text-label-md text-tertiary-fixed uppercase mb-md">Predicción semanal</p>
            <div className="flex items-end justify-between h-32 gap-sm">
              {[40, 65, 50, 90, 75, 45, 30].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-secondary-fixed/60 rounded-t-sm transition-all hover:bg-secondary-fixed"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-lg">
        <div className="col-span-12 lg:col-span-8 bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="p-lg border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-headline-md text-headline-md text-primary">Lista de Productos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-label-md uppercase">
                <tr>
                  <th className="px-lg py-md">Producto</th>
                  <th className="px-lg py-md">Categoría</th>
                  <th className="px-lg py-md text-right">Stock</th>
                  <th className="px-lg py-md text-right">Precio</th>
                  <th className="px-lg py-md">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {inventoryProducts.map((p) => (
                  <tr key={p.sku} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <span className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center">
                          <Icon name={p.icon} className="text-primary" />
                        </span>
                        <div>
                          <p className="font-label-md text-primary">{p.name}</p>
                          <p className="text-xs text-on-surface-variant">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md text-on-surface-variant">{p.category}</td>
                    <td className={`px-lg py-md text-right font-bold ${p.status === 'low' ? 'text-error' : ''}`}>
                      {p.stock}
                    </td>
                    <td className="px-lg py-md text-right">{p.price}</td>
                    <td className="px-lg py-md">
                      <span className={`text-label-md ${statusBadge[p.status].className}`}>
                        {statusBadge[p.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-surface rounded-xl shadow-sm border border-outline-variant p-lg">
          <h3 className="font-headline-md text-headline-md text-primary mb-lg">Movimientos Recientes</h3>
          <div className="space-y-lg">
            <div className="flex gap-md">
              <span className="w-6 h-6 rounded-full bg-on-secondary-container flex items-center justify-center shrink-0">
                <Icon name="south_west" className="text-on-primary text-sm" />
              </span>
              <div>
                <p className="font-label-md">Entrada de Stock</p>
                <p className="text-xs text-on-surface-variant">15x Monitor 4K · hace 15m</p>
              </div>
            </div>
            <div className="flex gap-md">
              <span className="w-6 h-6 rounded-full bg-error flex items-center justify-center shrink-0">
                <Icon name="north_east" className="text-on-error text-sm" />
              </span>
              <div>
                <p className="font-label-md">Venta Realizada</p>
                <p className="text-xs text-on-surface-variant">2x iPhone 15 Pro · hace 42m</p>
              </div>
            </div>
          </div>
          <button type="button" className="w-full mt-lg text-center text-primary font-button text-sm hover:underline">
            Ver historial completo
          </button>
        </div>
      </div>
    </div>
  );
}
