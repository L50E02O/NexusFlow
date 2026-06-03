import { useState } from 'react';
import { Icon } from '@/shared/ui/Icon';
import { invoiceSummary, invoices, formatPrice } from '@/shared/data/mock';

const statusStyles = {
  completed: { label: 'Completado', className: 'bg-[#e6f4ea] text-[#1e7e34]' },
  processing: { label: 'Procesando', className: 'bg-[#fff4e5] text-[#b05a00]' },
  pending: { label: 'Pendiente', className: 'bg-error-container text-error' },
};

export function InvoicesPage() {
  const [search, setSearch] = useState('');

  const filtered = invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.method.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xl">
      <div className="flex flex-col gap-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
          <h1 className="font-headline-lg text-headline-lg text-primary">Facturas y Pagos</h1>
          <div className="flex gap-sm flex-wrap">
            <button
              type="button"
              className="h-11 px-lg bg-surface-container-high text-primary font-button rounded-xl hover:bg-surface-variant transition-colors flex items-center gap-sm focus-ring"
            >
              <Icon name="download" />
              Descargar todo (PDF)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-surface-variant flex flex-col gap-sm">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">
              Total pagado este mes
            </span>
            <span className="font-headline-md text-headline-md text-primary">
              {formatPrice(invoiceSummary.paidThisMonth)}
            </span>
            <span className="text-xs text-green-600 font-bold flex items-center gap-xs">
              <Icon name="trending_up" className="text-sm" />
              +12% vs mes anterior
            </span>
          </div>
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-surface-variant flex flex-col gap-sm">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">
              Pagos pendientes
            </span>
            <span className="font-headline-md text-headline-md text-error">
              {formatPrice(invoiceSummary.pendingRefunds)}
            </span>
            <span className="text-xs text-on-surface-variant">Vence en 3 días</span>
          </div>
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-surface-variant flex flex-col gap-sm">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">
              Método predeterminado
            </span>
            <div className="flex items-center gap-sm">
              <Icon name="credit_card" className="text-primary" />
              <span className="font-body-md font-semibold">{invoiceSummary.defaultMethod}</span>
            </div>
            <button type="button" className="text-primary text-sm font-semibold hover:underline text-left">
              Gestionar métodos
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
          <div className="p-lg border-b border-surface-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
            <h2 className="font-headline-md text-headline-md text-primary">Historial de pagos</h2>
            <div className="relative w-full sm:w-48">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ID de factura..."
                className="w-full pl-9 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-lg py-md font-label-md text-on-surface-variant uppercase">Factura</th>
                  <th className="px-lg py-md font-label-md text-on-surface-variant uppercase">Fecha</th>
                  <th className="px-lg py-md font-label-md text-on-surface-variant uppercase">Método</th>
                  <th className="px-lg py-md font-label-md text-on-surface-variant uppercase">Total</th>
                  <th className="px-lg py-md font-label-md text-on-surface-variant uppercase text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-lg py-lg">
                      <div className="font-bold text-primary">{row.id}</div>
                      <button type="button" className="text-xs text-secondary font-semibold flex items-center gap-xs hover:underline mt-1">
                        <Icon name="download" className="text-xs" />
                        PDF
                      </button>
                    </td>
                    <td className="px-lg py-lg text-on-surface-variant">{row.date}</td>
                    <td className="px-lg py-lg">
                      <div className="flex items-center gap-sm">
                        <Icon name="credit_card" className="text-on-surface-variant" />
                        {row.method}
                      </div>
                    </td>
                    <td className="px-lg py-lg font-bold text-primary">{formatPrice(row.amount)}</td>
                    <td className="px-lg py-lg text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusStyles[row.status].className}`}
                      >
                        {statusStyles[row.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
