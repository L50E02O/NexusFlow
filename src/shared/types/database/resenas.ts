export interface ResenaRow {
	id_resena: string;
	calificacion: number;
	comentario: string;
	id_usuario: string | null;
	id_producto: string | null;
}

export interface ResenaInsert {
	id_resena?: string;
	calificacion: number;
	comentario: string;
	id_usuario?: string | null;
	id_producto?: string | null;
}

export interface ResenaUpdate {
	id_resena?: string;
	calificacion?: number;
	comentario?: string;
	id_usuario?: string | null;
	id_producto?: string | null;
}