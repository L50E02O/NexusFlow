import type { DetallePedidoInsert, DetallePedidoUpdate } from '../../../shared/types/database/detalle-pedidos';
import { isSupabaseConfigured, requireSupabaseClient } from '../../../shared/lib/supabase';

const tableName = 'detalle_pedidos';

function getTable() {
	return requireSupabaseClient().from(tableName) as any;
}

export const detallePedidosRepository = {
	isConfigured: isSupabaseConfigured,
	list() {
		return getTable().select('*');
	},
	findById(idDetalle: string) {
		return getTable().select('*').eq('id_detalle', idDetalle).maybeSingle();
	},
	create(payload: DetallePedidoInsert) {
		return getTable().insert(payload).select('*').single();
	},
	update(idDetalle: string, payload: DetallePedidoUpdate) {
		return getTable().update(payload).eq('id_detalle', idDetalle).select('*').single();
	},
	remove(idDetalle: string) {
		return getTable().delete().eq('id_detalle', idDetalle);
	},
} as const;
