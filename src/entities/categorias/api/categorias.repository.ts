import type { CategoriaInsert, CategoriaUpdate } from '../../../shared/types/database/categorias';
import { isSupabaseConfigured, requireSupabaseClient } from '../../../shared/lib/supabase';

const tableName = 'categorias';

function getTable() {
	return requireSupabaseClient().from(tableName) as any;
}

export const categoriasRepository = {
	isConfigured: isSupabaseConfigured,
	list() {
		return getTable().select('*');
	},
	findById(idCategoria: string) {
		return getTable().select('*').eq('id_categoria', idCategoria).maybeSingle();
	},
	create(payload: CategoriaInsert) {
		return getTable().insert(payload).select('*').single();
	},
	update(idCategoria: string, payload: CategoriaUpdate) {
		return getTable().update(payload).eq('id_categoria', idCategoria).select('*').single();
	},
	remove(idCategoria: string) {
		return getTable().delete().eq('id_categoria', idCategoria);
	},
} as const;
