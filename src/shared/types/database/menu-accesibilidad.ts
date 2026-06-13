export interface MenuAccesibilidadRow {
	id: string;
	nombre_categoria: string;
	elemento_criterio: string;
	descripcion_criterio: string;
	aplica_todos_formularios: boolean;
	created_at: string;
}

export interface MenuAccesibilidadInsert {
	id?: string;
	nombre_categoria: string;
	elemento_criterio: string;
	descripcion_criterio: string;
	aplica_todos_formularios?: boolean;
	created_at?: string;
}

export interface MenuAccesibilidadUpdate {
	nombre_categoria?: string;
	elemento_criterio?: string;
	descripcion_criterio?: string;
	aplica_todos_formularios?: boolean;
}
