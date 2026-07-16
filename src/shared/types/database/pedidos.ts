export interface PedidoRow {
	id_pedido: string;
	fecha: string;
	estado: string | null;
	total: string;
	id_usuario: string | null;
}

export interface PedidoInsert {
	id_pedido?: string;
	fecha?: string;
	estado?: string | null;
	total: string;
	id_usuario?: string | null;
}

export interface PedidoUpdate {
	id_pedido?: string;
	fecha?: string;
	estado?: string | null;
	total?: string;
	id_usuario?: string | null;
}