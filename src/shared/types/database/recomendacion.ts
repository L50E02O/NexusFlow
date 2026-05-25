export interface RecomendacionRow {
	id_recomendacion: string;
	score: string | null;
	id_usuario: string | null;
	id_producto: string | null;
}

export interface RecomendacionInsert {
	id_recomendacion?: string;
	score?: string | null;
	id_usuario?: string | null;
	id_producto?: string | null;
}

export interface RecomendacionUpdate {
	id_recomendacion?: string;
	score?: string | null;
	id_usuario?: string | null;
	id_producto?: string | null;
}