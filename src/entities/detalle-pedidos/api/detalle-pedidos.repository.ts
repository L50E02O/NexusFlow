import { supabase } from '../../../shared/lib/supabase';
import type { DetallePedidoInsert, DetallePedidoUpdate } from '../../../shared/types/database/detalle-pedidos';

const tableName = 'detalle_pedidos';
const table = supabase.from(tableName) as any;

export const detallePedidosRepository = {
	list() {
		return table.select('*');
	},
	findById(idDetalle: string) {
		return table.select('*').eq('id_detalle', idDetalle).maybeSingle();
	},
	create(payload: DetallePedidoInsert) {
		return table.insert(payload).select('*').single();
	},
	update(idDetalle: string, payload: DetallePedidoUpdate) {
		return table.update(payload).eq('id_detalle', idDetalle).select('*').single();
	},
	remove(idDetalle: string) {
		return table.delete().eq('id_detalle', idDetalle);
	},
} as const;