export interface ProductoRow {
	id_producto: string;
	nombre: string;
	descripcion: string;
	precio: string;
	stock: number;
	id_categoria: string | null;
	url: string | null;
}

export interface ProductoInsert {
	id_producto?: string;
	nombre: string;
	descripcion: string;
	precio: string;
	stock: number;
	id_categoria?: string | null;
	url?: string | null;
}

export interface ProductoUpdate {
	id_producto?: string;
	nombre?: string;
	descripcion?: string;
	precio?: string;
	stock?: number;
	id_categoria?: string | null;
	url?: string | null;
}