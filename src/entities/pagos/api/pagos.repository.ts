import type { PagoInsert, PagoUpdate } from '../../../shared/types/database/pagos';
import { isSupabaseConfigured, requireSupabaseClient } from '../../../shared/lib/supabase';

const tableName = 'pagos';

function getTable() {
	return requireSupabaseClient().from(tableName) as any;
}

export const pagosRepository = {
	isConfigured: isSupabaseConfigured,
	list() {
		return getTable().select('*');
	},
	findById(idPago: string) {
		return getTable().select('*').eq('id_pago', idPago).maybeSingle();
	},
	create(payload: PagoInsert) {
		return getTable().insert(payload).select('*').single();
	},
	update(idPago: string, payload: PagoUpdate) {
		return getTable().update(payload).eq('id_pago', idPago).select('*').single();
	},
	remove(idPago: string) {
		return getTable().delete().eq('id_pago', idPago);
	},
} as const;
