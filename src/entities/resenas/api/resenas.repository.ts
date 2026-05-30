import type { ResenaInsert, ResenaUpdate } from '../../../shared/types/database/resenas';
import { isSupabaseConfigured, requireSupabaseClient } from '../../../shared/lib/supabase';

const tableName = 'resenas';

function getTable() {
	return requireSupabaseClient().from(tableName) as any;
}

export const resenasRepository = {
	isConfigured: isSupabaseConfigured,
	list() {
		return getTable().select('*');
	},
	findById(idResena: string) {
		return getTable().select('*').eq('id_resena', idResena).maybeSingle();
	},
	create(payload: ResenaInsert) {
		return getTable().insert(payload).select('*').single();
	},
	update(idResena: string, payload: ResenaUpdate) {
		return getTable().update(payload).eq('id_resena', idResena).select('*').single();
	},
	remove(idResena: string) {
		return getTable().delete().eq('id_resena', idResena);
	},
} as const;
