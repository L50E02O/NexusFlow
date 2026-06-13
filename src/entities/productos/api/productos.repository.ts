import { supabase } from '../../../shared/lib/supabase';
import type { ProductoInsert, ProductoUpdate } from '../../../shared/types/database/productos';

const tableName = 'productos';
const table = supabase.from(tableName) as any;

export const productosRepository = {
	list() {
		return table.select('*');
	},
	findById(idProducto: string) {
		return table.select('*').eq('id_producto', idProducto).maybeSingle();
	},
	create(payload: ProductoInsert) {
		return table.insert(payload).select('*').single();
	},
	update(idProducto: string, payload: ProductoUpdate) {
		return table.update(payload).eq('id_producto', idProducto).select('*').single();
	},
	remove(idProducto: string) {
		return table.delete().eq('id_producto', idProducto);
	},
} as const;