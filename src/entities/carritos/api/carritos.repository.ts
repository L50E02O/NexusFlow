import type { CarritoInsert, CarritoUpdate } from '../../../shared/types/database/carritos';
import { isSupabaseConfigured, requireSupabaseClient } from '../../../shared/lib/supabase';

const tableName = 'carritos';

function getTable() {
	return requireSupabaseClient().from(tableName) as any;
}

export const carritosRepository = {
	isConfigured: isSupabaseConfigured,
	list() {
		return getTable().select('*');
	},
	findById(idCarrito: string) {
		return getTable().select('*').eq('id_carrito', idCarrito).maybeSingle();
	},
	create(payload: CarritoInsert) {
		return getTable().insert(payload).select('*').single();
	},
	update(idCarrito: string, payload: CarritoUpdate) {
		return getTable().update(payload).eq('id_carrito', idCarrito).select('*').single();
	},
	remove(idCarrito: string) {
		return getTable().delete().eq('id_carrito', idCarrito);
	},
} as const;
