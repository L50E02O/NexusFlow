import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { useCart } from '@/shared/context/CartContext';
import {
  orderHistoryExtended,
  catalogProducts,
  formatPrice,
  orderStatusLabel,
  type OrderStatus,
} from '@/shared/data/mock';

const filters = ['Todos', 'En camino', 'Entregados', 'Cancelados'] as const;
type Filter = (typeof filters)[number];

const filterToStatus: Record<Filter, OrderStatus | null> = {
  Todos: null,
  'En camino': 'shipping',
  Entregados: 'delivered',
  Cancelados: 'cancelled',
};

export function PurchaseHistoryPage() {
  const { addToCart } = useCart();
  const [filter, setFilter] = useState<Filter>('Todos');
  const [search, setSearch] = useState('');

  const orders = useMemo(() => {
    let list = orderHistoryExtended;
    const status = filterToStatus[filter];
    if (status) list = list.filter((o) => o.status === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.product.name.toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, search]);

  const recommendations = catalogProducts.slice(0, 4);

  return (
    <div className="max-w-container-max mx-auto px-lg py-xl min-h-screen">
      <header className="mb-xl">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">Historial de Compras</h1>
        <p className="font-body-md text-on-surface-variant">
          Revisa y gestiona todos tus pedidos anteriores y en curso.
        </p>
      </header>

      <section className="bg-surface-container-lowest p-lg rounded-xl shadow-sm mb-xxl flex flex-col lg:flex-row gap-lg items-end">
        <div className="flex-1 w-full">
          <label htmlFor="search-orders" className="block font-label-md text-on-surface-variant mb-xs">
            Buscar pedido
          </label>
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              id="search-orders"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nº de pedido o nombre de producto..."
              className="w-full h-12 pl-10 pr-4 bg-surface border border-outline-variant rounded-lg focus-ring text-body-md"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-sm">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-md py-xs rounded-full font-label-md transition-all min-h-11 ${
                filter === f
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <div className="space-y-lg mb-xxl">
        {orders.length === 0 ? (
          <p className="text-on-surface-variant text-center py-xl">No hay pedidos que coincidan con tu búsqueda.</p>
        ) : (
          orders.map((order) => (
            <article
              key={order.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 transition-all"
            >
              <div className="bg-surface-container-low p-md flex flex-col md:flex-row justify-between gap-md">
                <div className="flex flex-wrap gap-xl">
                  <div>
                    <p className="font-label-md text-on-surface-variant uppercase tracking-wider">Pedido</p>
                    <p className="font-headline-md text-primary">#{order.id}</p>
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface-variant uppercase tracking-wider">Fecha</p>
                    <p className="font-body-md font-bold">{order.date}</p>
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface-variant uppercase tracking-wider">Total</p>
                    <p className="font-body-md font-bold">{formatPrice(order.total)}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-sm px-md py-xs rounded-full font-label-md self-start ${
                    order.status === 'shipping'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : order.status === 'delivered'
                        ? 'bg-surface-container-high text-on-surface-variant'
                        : 'bg-error-container text-error'
                  }`}
                >
                  <Icon name={order.status === 'shipping' ? 'local_shipping' : 'check_circle'} className="text-[18px]" />
                  {orderStatusLabel(order.status)}
                </span>
              </div>
              <div className="p-lg flex flex-col lg:flex-row gap-xl">
                <div className="flex gap-md overflow-x-auto">
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="w-20 h-20 rounded-lg object-cover bg-surface-container-high shrink-0"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-md lg:ml-auto">
                  {order.status === 'shipping' ? (
                    <button type="button" className="h-11 px-lg bg-primary text-on-primary font-button rounded-xl hover:opacity-90 focus-ring">
                      Rastrear Pedido
                    </button>
                  ) : (
                    <button type="button" className="h-11 px-lg border-2 border-primary text-primary font-button rounded-xl hover:bg-surface-container-low focus-ring">
                      Volver a Comprar
                    </button>
                  )}
                  <button type="button" className="h-11 px-lg border-2 border-primary text-primary font-button rounded-xl hover:bg-surface-container-low focus-ring">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <section>
        <div className="flex items-center gap-md mb-xl">
          <Icon name="auto_awesome" className="text-primary text-[32px]" />
          <h2 className="font-headline-lg text-headline-lg text-primary">Recomendaciones para ti</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className="bg-surface-container-lowest p-md rounded-xl shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-outline-variant"
            >
              <div className="relative overflow-hidden rounded-lg mb-md">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="absolute bottom-md right-md bg-white p-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity focus-ring"
                  aria-label="Añadir al carrito"
                >
                  <Icon name="add_shopping_cart" className="text-primary" />
                </button>
              </div>
              <p className="text-label-md text-on-surface-variant">{product.category}</p>
              <h3 className="text-body-md font-bold text-primary truncate">{product.name}</h3>
              <p className="text-body-md font-bold mt-xs text-secondary">{formatPrice(product.price)}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-xl text-center">
        <Link to="/tienda" className="text-primary font-button hover:underline">
          Seguir comprando en la tienda
        </Link>
      </p>
    </div>
  );
}
