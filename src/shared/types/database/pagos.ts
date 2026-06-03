export interface PagoRow {
	id_pago: string;
	metodo_pago: string;
	estado: string;
	id_pedido: string | null;
}

export interface PagoInsert {
	id_pago?: string;
	metodo_pago: string;
	estado: string;
	id_pedido?: string | null;
}

export interface PagoUpdate {
	id_pago?: string;
	metodo_pago?: string;
	estado?: string;
	id_pedido?: string | null;
}