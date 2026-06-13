import { supabase } from '../../../shared/lib/supabase';
import type { DetalleCarritoInsert, DetalleCarritoUpdate } from '../../../shared/types/database/detalle-carritos';

const tableName = 'detalle_carritos';
const table = supabase.from(tableName) as any;

export const detalleCarritosRepository = {
	list() {
		return table.select('*');
	},
	findById(idDetalle: string) {
		return table.select('*').eq('id_detalle', idDetalle).maybeSingle();
	},
	create(payload: DetalleCarritoInsert) {
		return table.insert(payload).select('*').single();
	},
	update(idDetalle: string, payload: DetalleCarritoUpdate) {
		return table.update(payload).eq('id_detalle', idDetalle).select('*').single();
	},
	remove(idDetalle: string) {
		return table.delete().eq('id_detalle', idDetalle);
	},
} as const;