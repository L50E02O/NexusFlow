import { supabase } from '../../../shared/lib/supabase';
import type { EnvioInsert, EnvioUpdate } from '../../../shared/types/database/envios';

const tableName = 'envios';
const table = supabase.from(tableName) as any;

export const enviosRepository = {
	list() {
		return table.select('*');
	},
	findById(idEnvio: string) {
		return table.select('*').eq('id_envio', idEnvio).maybeSingle();
	},
	create(payload: EnvioInsert) {
		return table.insert(payload).select('*').single();
	},
	update(idEnvio: string, payload: EnvioUpdate) {
		return table.update(payload).eq('id_envio', idEnvio).select('*').single();
	},
	remove(idEnvio: string) {
		return table.delete().eq('id_envio', idEnvio);
	},
} as const;