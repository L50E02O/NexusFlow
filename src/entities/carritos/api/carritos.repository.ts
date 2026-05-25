import { supabase } from '../../../shared/lib/supabase';
import type { CarritoInsert, CarritoUpdate } from '../../../shared/types/database/carritos';

const tableName = 'carritos';
const table = supabase.from(tableName) as any;

export const carritosRepository = {
	list() {
		return table.select('*');
	},
	findById(idCarrito: string) {
		return table.select('*').eq('id_carrito', idCarrito).maybeSingle();
	},
	create(payload: CarritoInsert) {
		return table.insert(payload).select('*').single();
	},
	update(idCarrito: string, payload: CarritoUpdate) {
		return table.update(payload).eq('id_carrito', idCarrito).select('*').single();
	},
	remove(idCarrito: string) {
		return table.delete().eq('id_carrito', idCarrito);
	},
} as const;