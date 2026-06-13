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
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					role: metadata?.role ?? 'consumer',
					first_name: metadata?.firstName,
					last_name: metadata?.lastName,
				},
			},
		});
		if (error) {
			throw error;
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
