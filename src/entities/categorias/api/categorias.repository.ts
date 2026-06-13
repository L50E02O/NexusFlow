import { supabase } from '../../../shared/lib/supabase';
import type { CategoriaInsert, CategoriaUpdate } from '../../../shared/types/database/categorias';

const tableName = 'categorias';
const table = supabase.from(tableName) as any;

export const categoriasRepository = {
	list() {
		return table.select('*');
	},
	findById(idCategoria: string) {
		return table.select('*').eq('id_categoria', idCategoria).maybeSingle();
	},
	create(payload: CategoriaInsert) {
		return table.insert(payload).select('*').single();
	},
	update(idCategoria: string, payload: CategoriaUpdate) {
		return table.update(payload).eq('id_categoria', idCategoria).select('*').single();
	},
	remove(idCategoria: string) {
		return table.delete().eq('id_categoria', idCategoria);
	},
} as const;