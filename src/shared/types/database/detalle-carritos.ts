export interface DetalleCarritoRow {
	id_detalle: string;
	cantidad: number;
	id_carrito: string | null;
	id_producto: string | null;
}

export interface DetalleCarritoInsert {
	id_detalle?: string;
	cantidad: number;
	id_carrito?: string | null;
	id_producto?: string | null;
}

export interface DetalleCarritoUpdate {
	id_detalle?: string;
	cantidad?: number;
	id_carrito?: string | null;
	id_producto?: string | null;
}