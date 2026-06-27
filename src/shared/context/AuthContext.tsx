// AuthContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/shared/lib/supabase';
import type { ProfileRow } from '@/shared/types/database/profiles';
import type { ProfileRole } from '@/shared/types/database/common';

type SignUpMetadata = {
  role?: ProfileRole;
  firstName?: string;
  lastName?: string;
};

type SignUpResult = {
  userId: string;
  profileCreated: boolean;
  requiresEmailConfirmation: boolean;
};

type SignInResult = {
  session: Session | null;
  user: User | null;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  loading: boolean;
  isMerchant: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (
    email: string,
    password: string,
    metadata?: SignUpMetadata,
  ) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  const loadingRef = useRef(false);

  const loadProfile = useCallback(async (userId: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (!error && data) {
        const profile = data as ProfileRow;
        const { data: { session } } = await supabase.auth.getSession();
        const metadataRol = session?.user?.user_metadata?.rol as string | undefined;

        if (metadataRol && metadataRol !== profile.rol) {
          await (supabase.from('profiles') as any).update({ rol: metadataRol }).eq('id', userId);
          const { data: updated } = await supabase.from('profiles').select('*').eq('id', userId).single();
          if (updated) {
            setProfile(updated as ProfileRow);
            return;
          }
        }

        setProfile(profile);
      } else if (error?.code === 'PGRST116') {
        const { data: { session } } = await supabase.auth.getSession();
        const userMetadata = session?.user?.user_metadata ?? {};

        const { error: createError } = await (supabase.from('profiles') as any).insert({
          id: userId,
          nombres: userMetadata.nombres ?? null,
          apellidos: userMetadata.apellidos ?? null,
          rol: userMetadata.rol ?? 'cliente',
        });

        if (!createError) {
          const { data: newProfile } = await supabase.from('profiles').select('*').eq('id', userId).single();
          if (newProfile) {
            setProfile(newProfile as ProfileRow);
          }
        } else {
          console.error('Profile creation failed:', createError);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    } finally {
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      if (currentSession?.user?.id) {
        await loadProfile(currentSession.user.id);
      }
      if (mounted) setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (nextSession?.user?.id) {
        setLoading(true);
        loadProfile(nextSession.user.id).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { session: data.session, user: data.user };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, metadata?: SignUpMetadata) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            nombres: metadata?.firstName ?? null,
            apellidos: metadata?.lastName ?? null,
            rol: metadata?.role ?? 'cliente',
          },
        },
      });
      if (error) {
        console.error('SignUp error (full response):', error);
        throw error;
      }
      if (!data?.user?.id) {
        throw new Error('No se pudo obtener el ID de usuario después del registro.');
      }

      const userId = data.user.id;
      const requiresEmailConfirmation = !data.session;

      if (data.session) {
        const { error: updateError } = await (supabase.from('profiles') as any).update({
          nombres: metadata?.firstName ?? null,
          apellidos: metadata?.lastName ?? null,
          rol: metadata?.role ?? 'cliente',
        }).eq('id', userId);

        if (updateError) {
          console.error('Profile update after sign-up failed:', updateError);
        }

        await loadProfile(userId);
        return { userId, profileCreated: true, requiresEmailConfirmation };
      }

      return { userId, profileCreated: false, requiresEmailConfirmation };
    },
    [loadProfile],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
  }, []);

  const user = session?.user ?? null;
  const isMerchant = profile?.rol === 'comerciante';

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      loading,
      isMerchant,
      signIn,
      signUp,
      signOut,
      resetPassword,
    }),
    [session, user, profile, loading, isMerchant, signIn, signUp, signOut, resetPassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
