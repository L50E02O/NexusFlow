import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { ProductCard } from '@/components/product/ProductCard';
import { useCart } from '@/shared/context/CartContext';
import { catalogProducts } from '@/shared/data/mock';

export function ShopPage() {
  const { addToCart } = useCart();
  const [onlyStock, setOnlyStock] = useState(true);

  const filtered = onlyStock
    ? catalogProducts.filter((p) => p.stock !== 'out')
    : catalogProducts;

  return (
    <div className="max-w-container-max mx-auto px-lg py-xl">
      <nav aria-label="Miga de pan" className="flex items-center gap-xs text-on-surface-variant mb-xl font-label-md">
        <Link to="/" className="hover:text-primary transition-colors">
          Inicio
        </Link>
        <Icon name="chevron_right" className="text-base" />
        <span className="text-primary font-bold">Tienda</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <aside className="lg:col-span-3 space-y-xl">
          <div className="bg-surface-container-low p-lg rounded-xl shadow-sm space-y-xl">
            <div className="flex justify-between items-center border-b border-outline-variant pb-md">
              <h2 className="font-headline-md text-primary">Filtros</h2>
              <button type="button" className="text-on-surface-variant hover:text-primary underline font-label-md">
                Limpiar todo
              </button>
            </div>
            <div>
              <h3 className="font-label-md text-primary mb-md">Rango de precios</h3>
              <input type="range" min={0} max={5000} defaultValue={2500} className="w-full accent-primary" />
              <div className="flex justify-between mt-sm text-label-md text-on-surface-variant">
                <span>$0</span>
                <span>$5000+</span>
              </div>
            </div>
            <div className="flex items-center justify-between min-h-11">
              <h3 className="font-label-md text-primary">Solo en stock</h3>
              <button
                type="button"
                role="switch"
                aria-checked={onlyStock}
                onClick={() => setOnlyStock(!onlyStock)}
                className={`w-12 h-6 rounded-full relative p-xs transition-colors focus-ring ${
                  onlyStock ? 'bg-primary' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    onlyStock ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <div>
              <h3 className="font-label-md text-primary mb-md">Ordenar por</h3>
              <select className="w-full bg-surface-container-highest border-none rounded-lg p-md text-body-md focus:ring-2 focus:ring-primary h-12">
                <option>Más relevante</option>
                <option>Precio: Menor a mayor</option>
                <option>Precio: Mayor a menor</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
            <div>
              <h1 className="font-headline-lg text-primary">Accesorios de lujo</h1>
              <p className="text-body-md text-on-surface-variant">Mostrando 1-{filtered.length} de 248 artículos</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-lg">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
