export interface EnvioRow {
	id_envio: string;
	direccion: string;
	estado: string;
	id_pedido: string | null;
}

export interface EnvioInsert {
	id_envio?: string;
	direccion: string;
	estado: string;
	id_pedido?: string | null;
}

export interface EnvioUpdate {
	id_envio?: string;
	direccion?: string;
	estado?: string;
	id_pedido?: string | null;
}