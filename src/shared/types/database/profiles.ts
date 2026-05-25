import type { ProfileRole } from './common';

export interface ProfileRow {
	id: string;
	nombres: string | null;
	apellidos: string | null;
	created_at: string | null;
	rol: ProfileRole;
}

export interface ProfileInsert {
	id?: string;
	nombres?: string | null;
	apellidos?: string | null;
	created_at?: string | null;
	rol?: ProfileRole;
}

export interface ProfileUpdate {
	id?: string;
	nombres?: string | null;
	apellidos?: string | null;
	created_at?: string | null;
	rol?: ProfileRole;
}