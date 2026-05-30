import { createClient } from '@supabase/supabase-js';
import type { ProductoInsert, ProductoUpdate } from '../../../shared/types/database/productos';
import type { Database } from '../../../shared/types/database/database';

const tableName = 'productos';

function getSupabaseClient() {
	const url = import.meta.env.VITE_SUPABASE_URL;
	const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!url || !anon) return null;

	return createClient<Database>(url, anon);
}

function getTable() {
	const client = getSupabaseClient();
	if (!client) {
		throw new Error('Supabase no configurado: falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY');
	}

	return client.from(tableName) as any;
}

export const productosRepository = {
	isConfigured() {
		return !!getSupabaseClient();
	},
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