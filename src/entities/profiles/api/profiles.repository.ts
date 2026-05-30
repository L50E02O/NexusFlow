import type { ProfileInsert, ProfileUpdate } from '../../../shared/types/database/profiles';
import { isSupabaseConfigured, requireSupabaseClient } from '../../../shared/lib/supabase';

const tableName = 'profiles';

function getTable() {
	return requireSupabaseClient().from(tableName) as any;
}

export const profilesRepository = {
	isConfigured: isSupabaseConfigured,
	list() {
		return getTable().select('*');
	},
	findById(id: string) {
		return getTable().select('*').eq('id', id).maybeSingle();
	},
	create(payload: ProfileInsert) {
		return getTable().insert(payload).select('*').single();
	},
	update(id: string, payload: ProfileUpdate) {
		return getTable().update(payload).eq('id', id).select('*').single();
	},
	remove(id: string) {
		return getTable().delete().eq('id', id);
	},
} as const;
