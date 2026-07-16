import { useEffect, useState } from 'react';
import { categoriasRepository } from '@/entities/categorias/api/categorias.repository';
import { mapCategoriaRowToCategory } from '@/shared/lib/product-mappers';
import type { Category } from '@/shared/data/mock';

const DEFAULT_CATEGORY: Category = {
  id: 'mas',
  label: 'Más',
  icon: 'menu',
};

export function useCategorias() {
  const [categories, setCategories] = useState<Category[]>([DEFAULT_CATEGORY]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await categoriasRepository.list();
      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setCategories([DEFAULT_CATEGORY]);
      } else {
        const mapped = (data ?? []).map(mapCategoriaRowToCategory);
        setCategories([DEFAULT_CATEGORY, ...mapped]);
      }

      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading, error };
}
