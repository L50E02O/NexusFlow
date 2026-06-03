import { supabase } from '../../../shared/lib/supabase';
import type { PedidoInsert, PedidoUpdate } from '../../../shared/types/database/pedidos';

const tableName = 'pedidos';
const table = supabase.from(tableName) as any;

export const pedidosRepository = {
	list() {
		return table.select('*');
	},
	findById(idPedido: string) {
		return table.select('*').eq('id_pedido', idPedido).maybeSingle();
	},
	create(payload: PedidoInsert) {
		return table.insert(payload).select('*').single();
	},
	update(idPedido: string, payload: PedidoUpdate) {
		return table.update(payload).eq('id_pedido', idPedido).select('*').single();
	},
	remove(idPedido: string) {
		return table.delete().eq('id_pedido', idPedido);
	},
} as const;