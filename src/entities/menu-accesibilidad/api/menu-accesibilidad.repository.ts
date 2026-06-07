import { supabase } from '../../../shared/lib/supabase';

const tableName = 'menu_accesibilidad';
const table = supabase.from(tableName);

export const menuAccesibilidadRepository = {
	list() {
		return table.select('*').order('nombre_categoria', { ascending: true });
	},
} as const;
