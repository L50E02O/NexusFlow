import { useEffect, useState } from 'react';
import { productosRepository } from '@/entities/productos/api/productos.repository';
import { categoriasRepository } from '@/entities/categorias/api/categorias.repository';
import { mapProductoRowToProduct } from '@/shared/lib/product-mappers';
import type { Product } from '@/shared/data/mock';

export function useProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const [productsResult, categoriesResult] = await Promise.all([
        productosRepository.list(),
        categoriasRepository.list(),
      ]);

      if (cancelled) return;

      if (productsResult.error) {
        setError(productsResult.error.message);
        setProducts([]);
        setLoading(false);
        return;
      }

      const categoriesMap = (categoriesResult.data ?? []).reduce<Record<string, string>>(
        (map, row) => {
          if (row.id_categoria && row.nombre) {
            map[row.id_categoria] = row.nombre;
          }
          return map;
        },
        {},
      );

      const mapped = (productsResult.data ?? []).map((row) =>
        mapProductoRowToProduct(row, categoriesMap),
      );

      setProducts(mapped);
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
}
