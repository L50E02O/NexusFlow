import { Icon } from '@/shared/ui/Icon';
import { reportKpis } from '@/shared/data/merchantMock';

export function MerchantReportsPage() {
  return (
    <div className="p-lg max-w-[1400px] mx-auto space-y-xl">
      <div className="flex flex-col md:flex-row justify-between items-end gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Reportes y Analíticas</h2>
          <p className="text-on-surface-variant text-body-md">
            Visualiza el rendimiento de tu negocio en tiempo real.
          </p>
        </div>
        <div className="flex flex-wrap gap-md">
          <button type="button" className="flex items-center gap-sm px-md py-2 border border-outline-variant rounded-lg font-label-md focus-ring">
            <Icon name="calendar_today" /> Últimos 30 días
          </button>
          <button type="button" className="flex items-center gap-sm px-lg py-2 bg-primary text-on-primary rounded-lg font-button focus-ring">
            <Icon name="download" /> Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md">
        {reportKpis.map((k) => (
          <div
            key={k.label}
            className="bg-white p-lg rounded-xl shadow-sm border border-transparent hover:border-primary-fixed transition-all"
          >
            <div className="flex justify-between mb-md">
              <span className="p-sm bg-primary-fixed text-primary rounded-lg">
                <Icon name={k.icon} />
              </span>
              <span className={`text-label-md flex items-center ${k.up ? 'text-green-600' : 'text-error'}`}>
                {k.up ? <Icon name="arrow_upward" className="text-sm" /> : <Icon name="arrow_downward" className="text-sm" />}
                {k.delta}
              </span>
            </div>
            <p className="text-on-surface-variant text-label-md uppercase tracking-wider">{k.label}</p>
            <h3 className="text-headline-md font-bold text-primary mt-xs">{k.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        <div className="lg:col-span-8 bg-white p-xl rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-center mb-xl">
            <div>
              <h4 className="font-headline-md text-primary">Ventas a lo largo del tiempo</h4>
              <p className="text-on-surface-variant text-body-md">Rendimiento de ingresos — últimos 30 días</p>
            </div>
            <div className="flex gap-sm bg-surface-container-low p-1 rounded-lg">
              <button type="button" className="px-md py-sm bg-white shadow-sm rounded-md text-label-md font-bold text-primary">
                Mes
              </button>
              <button type="button" className="px-md py-sm text-on-surface-variant text-label-md rounded-md">
                Semana
              </button>
            </div>
          </div>
          <div className="h-64 relative">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="reportGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#031635" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#031635" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 160 Q 50 140 100 150 T 200 120 T 300 80 T 400 100 T 500 60 T 600 40 T 700 70 T 800 30"
                fill="none"
                stroke="#031635"
                strokeWidth="3"
              />
              <path
                d="M0 160 Q 50 140 100 150 T 200 120 T 300 80 T 400 100 T 500 60 T 600 40 T 700 70 T 800 30 L 800 200 L 0 200 Z"
                fill="url(#reportGrad)"
              />
            </svg>
          </div>
        </div>

        <div className="lg:col-span-4 bg-primary-container text-on-primary-container p-lg rounded-xl shadow-lg">
          <div className="flex items-center gap-sm mb-md">
            <Icon name="auto_awesome" className="text-secondary-container" filled />
            <h4 className="font-headline-md text-on-primary-fixed">Predicciones de IA</h4>
          </div>
          <p className="text-primary-fixed-dim text-sm mb-lg">
            Ingresos estimados próximo mes: <strong className="text-white text-xl">$52,400</strong> (+15.8%)
          </p>
          <p className="text-sm text-primary-fixed-dim mb-md">
            Reponer stock en Electrónica según demanda proyectada.
          </p>
          <button type="button" className="w-full py-md bg-white text-primary rounded-xl font-button focus-ring">
            Ver reporte IA detallado
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="px-lg py-xl border-b border-outline-variant flex justify-between">
          <h4 className="font-headline-md text-primary">Productos más vendidos</h4>
          <button type="button" className="text-primary font-button hover:underline">
            Ver todo
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-lg py-md text-label-md text-outline uppercase">Producto</th>
                <th className="px-lg py-md text-label-md text-outline uppercase">Ventas</th>
                <th className="px-lg py-md text-label-md text-outline uppercase">Ingresos</th>
                <th className="px-lg py-md text-label-md text-outline uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr className="hover:bg-surface-container-lowest">
                <td className="px-lg py-md font-bold text-primary">Zenith Smartwatch Pro</td>
                <td className="px-lg py-md">1.240 unidades</td>
                <td className="px-lg py-md font-bold">$24,800.00</td>
                <td className="px-lg py-md">
                  <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold">
                    En Stock
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-lowest">
                <td className="px-lg py-md font-bold text-primary">Aura Noise Cancelling</td>
                <td className="px-lg py-md">890 unidades</td>
                <td className="px-lg py-md font-bold">$17,800.00</td>
                <td className="px-lg py-md">
                  <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold">
                    En Stock
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
