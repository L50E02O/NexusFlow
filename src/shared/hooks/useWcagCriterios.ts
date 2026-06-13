import { useEffect, useState } from 'react';
import { wcagCriteriosRepository } from '@/entities/wcag-criterios/api/wcag-criterios.repository';
import { groupBy } from '@/shared/lib/group-by';
import type { WcagCriterioRow } from '@/shared/types/database/wcag-criterios';

export function useWcagCriterios() {
	const [criterios, setCriterios] = useState<WcagCriterioRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);

			const { data, error: fetchError } = await wcagCriteriosRepository.list();

			if (cancelled) return;

			if (fetchError) {
				setError(fetchError.message);
				setCriterios([]);
			} else {
				setCriterios(data ?? []);
			}

			setLoading(false);
		}

		load();

		return () => {
			cancelled = true;
		};
	}, []);

	const groupedByPrincipio = groupBy(criterios, 'principio');

	return { criterios, groupedByPrincipio, loading, error };
}
