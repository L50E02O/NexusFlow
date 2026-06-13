import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/product/ProductCard';
import { useCart } from '@/shared/context/CartContext';
import { categories } from '@/shared/data/mock';
import {
  filterProducts,
  getFullProductCatalog,
  searchCategories,
} from '@/shared/lib/searchCatalog';

type SortOption = 'relevance' | 'price-asc' | 'price-desc';

export function ShopPage() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') ?? '';
  const qParam = searchParams.get('q') ?? '';

  const [onlyStock, setOnlyStock] = useState(true);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState<SortOption>('relevance');

  const fullCatalog = useMemo(() => getFullProductCatalog(), []);
  const matchedCategories = useMemo(
    () => (qParam.trim() ? searchCategories(qParam) : []),
    [qParam],
  );
  const activeCategory = categories.find((c) => c.id === catParam);

  const filtered = useMemo(() => {
    let list = filterProducts(fullCatalog, { query: qParam, categoryId: catParam });

    if (onlyStock) {
      list = list.filter((p) => p.stock !== 'out');
    }

    list = list.filter((p) => p.price <= maxPrice);

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);

    return list;
  }, [fullCatalog, catParam, qParam, onlyStock, maxPrice, sort]);

  const clearFilters = () => {
    setOnlyStock(true);
    setMaxPrice(5000);
    setSort('relevance');
    setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-container-max px-lg py-xl">
      <div className="grid grid-cols-1 gap-xl lg:grid-cols-12">
        <aside className="space-y-xl lg:col-span-3">
          <div className="space-y-xl rounded-xl bg-surface-container-low p-lg shadow-sm">
            <div className="flex items-center justify-between gap-sm border-b border-outline-variant pb-md">
              <h2 className="font-headline-md text-primary">Filtros</h2>
              <button
                type="button"
                onClick={clearFilters}
                className="whitespace-nowrap font-label-md text-on-surface-variant underline hover:text-primary"
              >
                Limpiar todo
              </button>
            </div>
            {activeCategory && (
              <p className="text-label-md text-on-surface-variant">
                Categoría: <span className="font-bold text-primary">{activeCategory.label}</span>
              </p>
            )}
            {qParam && (
              <p className="break-words text-label-md text-on-surface-variant">
                Búsqueda: <span className="font-bold text-primary">&quot;{qParam}&quot;</span>
              </p>
            )}
            {matchedCategories.length > 0 && (
              <div className="space-y-sm">
                <p className="font-label-md text-primary">Categorías relacionadas</p>
                <ul className="flex flex-wrap gap-xs">
                  {matchedCategories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/tienda?cat=${cat.id}${qParam ? `&q=${encodeURIComponent(qParam)}` : ''}`}
                        className="inline-flex min-h-9 items-center rounded-full bg-surface-container-high px-md py-xs text-label-md text-primary hover:bg-primary hover:text-on-primary"
                      >
                        {cat.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <label htmlFor="price-range" className="mb-md block font-label-md text-primary">
                Rango de precios (máximo ${maxPrice})
              </label>
              <input
                id="price-range"
                type="range"
                min={0}
                max={5000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary"
                aria-valuemin={0}
                aria-valuemax={5000}
                aria-valuenow={maxPrice}
              />
              <div className="mt-sm flex justify-between text-label-md text-on-surface-variant">
                <span>$0</span>
                <span>$5000+</span>
              </div>
            </div>
            <div className="flex min-h-11 items-center justify-between gap-md">
              <h3 className="font-label-md text-primary">Solo en stock</h3>
              <button
                type="button"
                role="switch"
                aria-checked={onlyStock}
                aria-label="Filtrar solo productos en stock"
                onClick={() => setOnlyStock(!onlyStock)}
                className={`relative h-6 w-12 shrink-0 rounded-full p-xs transition-colors focus-ring ${
                  onlyStock ? 'bg-primary' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                    onlyStock ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <div>
              <label htmlFor="sort-select" className="mb-md block font-label-md text-primary">
                Ordenar por
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-12 w-full rounded-lg border-none bg-surface-container-highest p-md text-body-md focus:ring-2 focus:ring-primary"
              >
                <option value="relevance">Más relevante</option>
                <option value="price-asc">Precio: Menor a mayor</option>
                <option value="price-desc">Precio: Mayor a menor</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-lg lg:col-span-9">
          <div className="flex flex-col justify-between gap-md md:flex-row md:items-center">
            <div className="min-w-0">
              <h1 className="break-words font-headline-lg text-primary">
                {activeCategory
                  ? activeCategory.label
                  : qParam
                    ? `Resultados para "${qParam}"`
                    : 'Accesorios de lujo'}
              </h1>
              <p className="text-body-md text-on-surface-variant">
                Mostrando {filtered.length} de {fullCatalog.length} artículos
              </p>
            </div>
          </div>
          {filtered.length === 0 ? (
            <p className="py-xxl text-center text-on-surface-variant">
              No se encontraron productos con los filtros actuales.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
