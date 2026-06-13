import { useEffect, useState } from 'react';
import { menuAccesibilidadRepository } from '@/entities/menu-accesibilidad/api/menu-accesibilidad.repository';
import { groupBy } from '@/shared/lib/group-by';
import type { MenuAccesibilidadRow } from '@/shared/types/database/menu-accesibilidad';

export function useMenuAccesibilidad() {
	const [items, setItems] = useState<MenuAccesibilidadRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);

			const { data, error: fetchError } = await menuAccesibilidadRepository.list();

			if (cancelled) return;

			if (fetchError) {
				setError(fetchError.message);
				setItems([]);
			} else {
				setItems(data ?? []);
			}

			setLoading(false);
		}

		load();

		return () => {
			cancelled = true;
		};
	}, []);

	const groupedByCategoria = groupBy(items, 'nombre_categoria');

	return { items, groupedByCategoria, loading, error };
}
