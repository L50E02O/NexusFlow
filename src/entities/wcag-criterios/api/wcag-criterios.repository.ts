import { supabase } from '../../../shared/lib/supabase';
import type { WcagCriterioUpdate } from '../../../shared/types/database/wcag-criterios';

const tableName = 'wcag_criterios';
const table = supabase.from(tableName) as any;

export const wcagCriteriosRepository = {
	list() {
		return table.select('*').order('criterio', { ascending: true });
	},
	update(id: string, payload: WcagCriterioUpdate) {
		return table.update(payload).eq('id', id).select('*').single();
	},
} as const;
