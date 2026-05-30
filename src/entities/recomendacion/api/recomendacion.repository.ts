import type { RecomendacionInsert, RecomendacionUpdate } from '../../../shared/types/database/recomendacion';
import { isSupabaseConfigured, requireSupabaseClient } from '../../../shared/lib/supabase';

const tableName = 'recomendacion';

function getTable() {
	return requireSupabaseClient().from(tableName) as any;
}

export const recomendacionRepository = {
	isConfigured: isSupabaseConfigured,
	list() {
		return getTable().select('*');
	},
	findById(idRecomendacion: string) {
		return getTable().select('*').eq('id_recomendacion', idRecomendacion).maybeSingle();
	},
	create(payload: RecomendacionInsert) {
		return getTable().insert(payload).select('*').single();
	},
	update(idRecomendacion: string, payload: RecomendacionUpdate) {
		return getTable().update(payload).eq('id_recomendacion', idRecomendacion).select('*').single();
	},
	remove(idRecomendacion: string) {
		return getTable().delete().eq('id_recomendacion', idRecomendacion);
	},
} as const;
