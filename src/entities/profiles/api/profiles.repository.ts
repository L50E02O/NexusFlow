import { supabase } from '../../../shared/lib/supabase';
import type { ProfileInsert, ProfileUpdate } from '../../../shared/types/database/profiles';

const tableName = 'profiles';
const table = supabase.from(tableName) as any;

export const profilesRepository = {
	list() {
		return table.select('*');
	},
	findById(id: string) {
		return table.select('*').eq('id', id).maybeSingle();
	},
	create(payload: ProfileInsert) {
		return table.insert(payload).select('*').single();
	},
	update(id: string, payload: ProfileUpdate) {
		return table.update(payload).eq('id', id).select('*').single();
	},
	remove(id: string) {
		return table.delete().eq('id', id);
	},
} as const;