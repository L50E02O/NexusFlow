export interface CarritoRow {
	id_carrito: string;
	id_usuario: string | null;
}

export interface CarritoInsert {
	id_carrito?: string;
	id_usuario?: string | null;
}

export interface CarritoUpdate {
	id_carrito?: string;
	id_usuario?: string | null;
}