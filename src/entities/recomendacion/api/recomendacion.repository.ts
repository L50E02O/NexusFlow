import { supabase } from '../../../shared/lib/supabase';
import type { RecomendacionInsert, RecomendacionUpdate } from '../../../shared/types/database/recomendacion';

const tableName = 'recomendacion';
const table = supabase.from(tableName) as any;

export const recomendacionRepository = {
	list() {
		return table.select('*');
	},
	findById(idRecomendacion: string) {
		return table.select('*').eq('id_recomendacion', idRecomendacion).maybeSingle();
	},
	create(payload: RecomendacionInsert) {
		return table.insert(payload).select('*').single();
	},
	update(idRecomendacion: string, payload: RecomendacionUpdate) {
		return table.update(payload).eq('id_recomendacion', idRecomendacion).select('*').single();
	},
	remove(idRecomendacion: string) {
		return table.delete().eq('id_recomendacion', idRecomendacion);
	},
} as const;