export type WcagEstado = 'P' | 'C' | 'En';

export interface WcagCriterioRow {
	id: string;
	principio: string;
	criterio: string;
	nombre: string;
	nivel: string;
	que_verificar: string;
	como_implementarlo: string;
	estado: WcagEstado;
	created_at: string;
}

export interface WcagCriterioInsert {
	id?: string;
	principio: string;
	criterio: string;
	nombre: string;
	nivel: string;
	que_verificar: string;
	como_implementarlo: string;
	estado?: WcagEstado;
	created_at?: string;
}

export interface WcagCriterioUpdate {
	principio?: string;
	criterio?: string;
	nombre?: string;
	nivel?: string;
	que_verificar?: string;
	como_implementarlo?: string;
	estado?: WcagEstado;
}
