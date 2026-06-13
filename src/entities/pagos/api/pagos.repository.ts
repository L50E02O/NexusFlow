import { supabase } from '../../../shared/lib/supabase';
import type { PagoInsert, PagoUpdate } from '../../../shared/types/database/pagos';

const tableName = 'pagos';
const table = supabase.from(tableName) as any;

export const pagosRepository = {
	list() {
		return table.select('*');
	},
	findById(idPago: string) {
		return table.select('*').eq('id_pago', idPago).maybeSingle();
	},
	create(payload: PagoInsert) {
		return table.insert(payload).select('*').single();
	},
	update(idPago: string, payload: PagoUpdate) {
		return table.update(payload).eq('id_pago', idPago).select('*').single();
	},
	remove(idPago: string) {
		return table.delete().eq('id_pago', idPago);
	},
} as const;