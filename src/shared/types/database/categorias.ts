export interface CategoriaRow {
	id_categoria: string;
	nombre: string;
	descripcion: string | null;
}

export interface CategoriaInsert {
	id_categoria?: string;
	nombre: string;
	descripcion?: string | null;
}

export interface CategoriaUpdate {
	id_categoria?: string;
	nombre?: string;
	descripcion?: string | null;
}