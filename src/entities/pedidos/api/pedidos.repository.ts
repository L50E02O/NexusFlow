import type { PedidoInsert, PedidoUpdate } from '../../../shared/types/database/pedidos';
import { isSupabaseConfigured, requireSupabaseClient } from '../../../shared/lib/supabase';

const tableName = 'pedidos';

function getTable() {
	return requireSupabaseClient().from(tableName) as any;
}

export const pedidosRepository = {
	isConfigured: isSupabaseConfigured,
	list() {
		return getTable().select('*');
	},
	findById(idPedido: string) {
		return getTable().select('*').eq('id_pedido', idPedido).maybeSingle();
	},
	create(payload: PedidoInsert) {
		return getTable().insert(payload).select('*').single();
	},
	update(idPedido: string, payload: PedidoUpdate) {
		return getTable().update(payload).eq('id_pedido', idPedido).select('*').single();
	},
	remove(idPedido: string) {
		return getTable().delete().eq('id_pedido', idPedido);
	},
} as const;
