/* @refresh reset */
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/shared/lib/supabase';

type SignUpMetadata = {
	role?: 'merchant' | 'consumer';
	firstName?: string;
	lastName?: string;
};

type AuthContextValue = {
	session: Session | null;
	user: User | null;
	loading: boolean;
	isMerchant: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, metadata?: SignUpMetadata) => Promise<void>;
	signOut: () => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function resolveIsMerchant(user: User | null): boolean {
	if (!user) return false;
	const role = user.user_metadata?.role as string | undefined;
	return role === 'merchant';
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
			if (mounted) {
				setSession(currentSession);
				setLoading(false);
			}
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, nextSession) => {
			setSession(nextSession);
			setLoading(false);
		});

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);

	const signIn = useCallback(async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			throw error;
		}
	}, []);

	const signUp = useCallback(async (email: string, password: string, metadata?: SignUpMetadata) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${window.location.origin}/login`,
			},
		});

		// If Supabase returns an error, log the full object (includes details) and re‑throw.
		if (error) {
			console.error('SignUp error (full response):', error);
			throw error;
		}

		// After the user is created we also create a corresponding profile row (empty demo_records for now).
		if (data?.user?.id) {
			try {
				await supabase.from('profiles').upsert({
					id: data.user.id,
					demo_records: [],
				} as any);
			} catch (profileErr) {
				console.error('Error creating profile after sign‑up:', profileErr);
				// We do not re‑throw because the auth succeeded; the UI can handle the missing profile later.
			}
		}
	}, []);

	const signOut = useCallback(async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			throw error;
		}
	}, []);

	const resetPassword = useCallback(async (email: string) => {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/login`,
		});
		if (error) {
			throw error;
		}
	}, []);

	const user = session?.user ?? null;
	const isMerchant = resolveIsMerchant(user);

	const value = useMemo(
		() => ({
			session,
			user,
			loading,
			isMerchant,
			signIn,
			signUp,
			signOut,
			resetPassword,
		}),
		[session, user, loading, isMerchant, signIn, signUp, signOut, resetPassword],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error('useAuth debe usarse dentro de AuthProvider');
	}
	return ctx;
}
