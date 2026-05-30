import type { ProductoInsert, ProductoUpdate } from '../../../shared/types/database/productos';
import { isSupabaseConfigured, requireSupabaseClient } from '../../../shared/lib/supabase';

const tableName = 'productos';

function getTable() {
	return requireSupabaseClient().from(tableName) as any;
}

export const productosRepository = {
	isConfigured: isSupabaseConfigured,
	list() {
		return getTable().select('*');
	},
	findById(idProducto: string) {
		return getTable().select('*').eq('id_producto', idProducto).maybeSingle();
	},
	create(payload: ProductoInsert) {
		return getTable().insert(payload).select('*').single();
	},
	update(idProducto: string, payload: ProductoUpdate) {
		return getTable().update(payload).eq('id_producto', idProducto).select('*').single();
	},
	remove(idProducto: string) {
		return getTable().delete().eq('id_producto', idProducto);
	},
} as const;
