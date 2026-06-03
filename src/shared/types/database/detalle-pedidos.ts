export interface DetallePedidoRow {
	id_detalle: string;
	cantidad: number;
	precio_unitario: string;
	id_pedido: string | null;
	id_producto: string | null;
}

export interface DetallePedidoInsert {
	id_detalle?: string;
	cantidad: number;
	precio_unitario: string;
	id_pedido?: string | null;
	id_producto?: string | null;
}

export interface DetallePedidoUpdate {
	id_detalle?: string;
	cantidad?: number;
	precio_unitario?: string;
	id_pedido?: string | null;
	id_producto?: string | null;
}