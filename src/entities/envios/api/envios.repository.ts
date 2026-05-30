import type { EnvioInsert, EnvioUpdate } from '../../../shared/types/database/envios';
import { isSupabaseConfigured, requireSupabaseClient } from '../../../shared/lib/supabase';

const tableName = 'envios';

function getTable() {
	return requireSupabaseClient().from(tableName) as any;
}

export const enviosRepository = {
	isConfigured: isSupabaseConfigured,
	list() {
		return getTable().select('*');
	},
	findById(idEnvio: string) {
		return getTable().select('*').eq('id_envio', idEnvio).maybeSingle();
	},
	create(payload: EnvioInsert) {
		return getTable().insert(payload).select('*').single();
	},
	update(idEnvio: string, payload: EnvioUpdate) {
		return getTable().update(payload).eq('id_envio', idEnvio).select('*').single();
	},
	remove(idEnvio: string) {
		return getTable().delete().eq('id_envio', idEnvio);
	},
} as const;
