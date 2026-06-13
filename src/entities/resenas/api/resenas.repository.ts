import { supabase } from '../../../shared/lib/supabase';
import type { ResenaInsert, ResenaUpdate } from '../../../shared/types/database/resenas';

const tableName = 'resenas';
const table = supabase.from(tableName) as any;

export const resenasRepository = {
	list() {
		return table.select('*');
	},
	findById(idResena: string) {
		return table.select('*').eq('id_resena', idResena).maybeSingle();
	},
	create(payload: ResenaInsert) {
		return table.insert(payload).select('*').single();
	},
	update(idResena: string, payload: ResenaUpdate) {
		return table.update(payload).eq('id_resena', idResena).select('*').single();
	},
	remove(idResena: string) {
		return table.delete().eq('id_resena', idResena);
	},
} as const;