import type { DetalleCarritoInsert, DetalleCarritoUpdate } from '../../../shared/types/database/detalle-carritos';
import { isSupabaseConfigured, requireSupabaseClient } from '../../../shared/lib/supabase';

const tableName = 'detalle_carritos';

function getTable() {
	return requireSupabaseClient().from(tableName) as any;
}

export const detalleCarritosRepository = {
	isConfigured: isSupabaseConfigured,
	list() {
		return getTable().select('*');
	},
	findById(idDetalle: string) {
		return getTable().select('*').eq('id_detalle', idDetalle).maybeSingle();
	},
	create(payload: DetalleCarritoInsert) {
		return getTable().insert(payload).select('*').single();
	},
	update(idDetalle: string, payload: DetalleCarritoUpdate) {
		return getTable().update(payload).eq('id_detalle', idDetalle).select('*').single();
	},
	remove(idDetalle: string) {
		return getTable().delete().eq('id_detalle', idDetalle);
	},
} as const;
