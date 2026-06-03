import { useMemo, useState } from 'react';
import { Icon } from '@/shared/ui/Icon';
import { notifications } from '@/shared/data/mock';
import { formatPrice } from '@/shared/data/mock';

type Tab = 'Todas' | 'Pedidos' | 'Promociones' | 'Seguridad';

export function NotificationsPage() {
  const [tab, setTab] = useState<Tab>('Todas');
  const [query, setQuery] = useState('');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchesTab =
        tab === 'Todas' ||
        (tab === 'Pedidos' && n.type === 'order') ||
        (tab === 'Promociones' && n.type === 'promo') ||
        (tab === 'Seguridad' && n.type === 'security');
      const matchesQuery =
        !query ||
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.body.toLowerCase().includes(query.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [tab, query]);

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const markRead = (id: string) => {
    setReadIds((prev) => new Set(prev).add(id));
  };

  return (
    <main className="max-w-container-max mx-auto px-lg py-xl flex-grow">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-8 space-y-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
            <h1 className="font-headline-lg text-headline-lg text-primary">Centro de Notificaciones</h1>
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-xs px-md py-2 text-primary border border-primary rounded-xl hover:bg-primary-fixed font-button"
            >
              <Icon name="done_all" className="text-xl" /> Marcar todas como leídas
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-md items-center justify-between bg-surface-container-low p-md rounded-xl shadow-sm">
            <div className="flex gap-xs overflow-x-auto w-full sm:w-auto">
              {(['Todas', 'Pedidos', 'Promociones', 'Seguridad'] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-md py-2 rounded-lg font-label-md whitespace-nowrap transition-colors ${
                    tab === t ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrar mensajes..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface-container-lowest"
              />
            </div>
          </div>

          <div className="space-y-md">
            {filtered.map((n) => {
              const isUnread = n.unread && !readIds.has(n.id);
              return (
                <article
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`notification-card group rounded-xl p-lg shadow-sm border transition-all flex gap-md relative cursor-pointer ${
                    n.type === 'security'
                      ? 'bg-error-container/20 hover:border-error'
                      : 'bg-surface hover:border-primary-container'
                  }`}
                >
                  <div
                    className={`min-w-11 h-11 rounded-full flex items-center justify-center ${
                      n.type === 'order'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : n.type === 'security'
                          ? 'bg-error-container text-error'
                          : n.type === 'promo'
                            ? 'bg-tertiary-container text-tertiary-fixed'
                            : 'bg-secondary-fixed text-on-secondary-fixed'
                    }`}
                  >
                    <Icon
                      name={
                        n.type === 'order'
                          ? 'local_shipping'
                          : n.type === 'security'
                            ? 'warning'
                            : n.type === 'promo'
                              ? 'smart_toy'
                              : 'payments'
                      }
                    />
                  </div>
                  <div className="flex-grow space-y-sm">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-label-md ${n.type === 'security' ? 'text-error' : 'text-primary'}`}>
                        {n.title}
                      </h3>
                      <span className="text-xs text-outline">{n.time}</span>
                    </div>
                    <p className="text-on-surface-variant text-body-md">{n.body}</p>
                    {n.type === 'order' && (
                      <button type="button" className="px-md py-2 bg-primary-container text-on-primary-container rounded-lg text-sm font-bold">
                        Rastrear pedido
                      </button>
                    )}
                    {n.type === 'promo' && n.product && (
                      <div className="flex items-center gap-md p-sm bg-surface-container rounded-lg">
                        <div>
                          <p className="text-sm font-bold text-primary">{n.product.name}</p>
                          <p className="text-xs text-secondary line-through">{formatPrice(n.product.was)}</p>
                          <p className="text-sm font-bold text-tertiary-container">{formatPrice(n.product.price)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {isUnread && (
                    <div className="w-2 h-2 rounded-full bg-[#2563EB] absolute top-6 right-6" aria-hidden />
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-lg">
          <div className="bg-primary-container text-on-primary-container p-xl rounded-2xl shadow-lg relative overflow-hidden">
            <h2 className="font-headline-md text-headline-md flex items-center gap-sm mb-md">
              <Icon name="auto_awesome" className="text-tertiary-fixed" /> Sugerencias IA
            </h2>
            <p className="text-primary-fixed-dim text-sm mb-md">
              NexusFlow ha analizado tu actividad reciente para estas alertas personalizadas:
            </p>
            <div className="space-y-sm">
              <div className="p-md bg-white/10 rounded-xl border border-white/5">
                <p className="text-xs font-bold uppercase text-tertiary-fixed">Alerta de Stock</p>
                <p className="text-sm mt-1">El &quot;Soporte Ergonómico M1&quot; solo tiene 2 unidades restantes.</p>
              </div>
            </div>
            <button type="button" className="w-full py-3 bg-white text-primary rounded-xl font-bold mt-md">
              Ver todas las sugerencias
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
