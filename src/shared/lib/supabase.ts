import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../types/database/database';

let cachedClient: SupabaseClient<Database> | null = null;

export function isSupabaseConfigured() {
	return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export function getSupabaseClient() {
	if (!isSupabaseConfigured()) return null;

	if (!cachedClient) {
		cachedClient = createClient<Database>(
			import.meta.env.VITE_SUPABASE_URL,
			import.meta.env.VITE_SUPABASE_ANON_KEY,
		);
	}

	return cachedClient;
}

export function requireSupabaseClient() {
	const client = getSupabaseClient();

	if (!client) {
		throw new Error('Supabase no configurado: falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY');
	}

	return client;
}
