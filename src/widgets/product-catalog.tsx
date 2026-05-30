import React, { useEffect, useState } from 'react';

type ProductRow = {
  id_producto?: string;
  id?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number | string;
  stock?: number;
  categoria?: string;
  id_categoria?: string;
  url?: string;
  imagen?: string;
  name?: string;
  summary?: string;
};

interface ProductCatalogProps {
  readonly query?: string;
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function ProductCatalog({ query }: ProductCatalogProps) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState<boolean | null>(null);

  const normalizedQuery = normalizeSearchText(query ?? '');
  const filteredProducts = products.filter(product => {
    if (!normalizedQuery) return true;

    const searchable = normalizeSearchText(
      [
        product.nombre,
        product.descripcion,
        product.categoria,
        product.id_categoria,
        product.name,
        product.summary,
      ]
        .filter(Boolean)
        .join(' '),
    );

    return searchable.includes(normalizedQuery);
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const repoModule = await import('../entities/productos/api/productos.repository');
        const configured = Boolean(repoModule.productosRepository.isConfigured?.());

        if (!mounted) return;
        setDbConfigured(configured);

        if (!configured) {
          setProducts([]);
          return;
        }

        const res = await repoModule.productosRepository.list();
        const data = res?.data ?? res?.body ?? res ?? [];

        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setDbConfigured(false);
        setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="section product-catalog" id="catalogo" aria-labelledby="catalogo-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h2 id="catalogo-title">Catálogo de Productos</h2>
        </div>
        <p>
          Explora los productos reales guardados en Supabase. La vista se alimenta de la base de datos y
          no usa datos simulados.
        </p>
      </div>

      {dbConfigured === false ? (
        <div className="empty-state" role="status" aria-live="polite">
          <h3>Supabase no está configurado</h3>
          <p>
            Define <strong>VITE_SUPABASE_URL</strong> y <strong>VITE_SUPABASE_ANON_KEY</strong> para
            consumir la base de datos real.
          </p>
        </div>
      ) : null}

      {loading ? (
        <p role="status">Cargando productos…</p>
      ) : products.length === 0 ? (
        <div className="empty-state" role="status" aria-live="polite">
          <h3>No hay productos visibles</h3>
          <p>
            La conexión está lista, pero todavía no hay registros en `productos` o no son accesibles con la
            cuenta actual.
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state" role="status" aria-live="polite">
          <h3>No encontramos coincidencias</h3>
          <p>
            La búsqueda <strong>{query}</strong> no coincide con productos cargados. Prueba otro término o limpia el filtro.
          </p>
        </div>
      ) : (
        <ul className="atlas-grid" aria-label="Listado de productos">
          {filteredProducts.map(product => {
            const id = product.id_producto ?? product.id ?? String(product.name ?? Math.random());
            const imageUrl = product.url ?? product.imagen ?? '';
            const categoryLabel = product.categoria ?? product.id_categoria ?? 'general';
            const price = Number(product.precio ?? 0);

            return (
              <li className="atlas-card" key={id}>
                <div className="atlas-card-media" aria-hidden={imageUrl ? 'false' : 'true'}>
                  {imageUrl ? (
                    <img src={imageUrl} alt={`Imagen de ${product.nombre ?? product.name}`} />
                  ) : (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>Sin imagen</div>
                  )}
                </div>

                <div className="atlas-card-body">
                  <div className="atlas-card-topline">
                    <span className="atlas-chip">Producto</span>
                    <span className="atlas-folder">/{categoryLabel}</span>
                  </div>

                  <h3>{product.nombre ?? product.name ?? 'Producto sin nombre'}</h3>
                  <p>{product.descripcion ?? product.summary ?? ''}</p>

                  <p className="atlas-screen-id">Precio: ${price.toLocaleString('es-ES')}</p>
                  <p className="atlas-screen-id">Stock: {product.stock ?? 0}</p>
                  <p className="atlas-screen-id">ID: {id}</p>

                  <div className="atlas-card-actions">
                    <button
                      className="button button-primary"
                      onClick={() => alert('Ver detalle - integrar ruta de producto')}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.currentTarget.click();
                        }
                      }}
                      aria-label={`Ver detalle de ${product.nombre ?? product.name}`}
                    >
                      Ver detalle
                    </button>
                    <button
                      className="button button-secondary"
                      onClick={() => alert('Añadir al carrito - integrar acción')}
                      aria-label={`Añadir ${product.nombre ?? product.name} al carrito`}
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
