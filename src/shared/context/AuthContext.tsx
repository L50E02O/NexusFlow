// AuthContext.tsx
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
import type { ProfileRow } from '@/shared/types/database/profiles';
import type { ProfileRole } from '@/shared/types/database/common';

type SignUpMetadata = {
  role?: ProfileRole;
  firstName?: string;
  lastName?: string;
  demoRecords?: Array<{ title: string; description: string }>;
};

type SignUpResult = {
  userId: string;
  profileCreated: boolean;
  requiresEmailConfirmation: boolean;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  loading: boolean;
  isMerchant: boolean;
  signIn: (email: string, password: string) => Promise<void>;
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

  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    
    if (!error && data) {
      setProfile(data as ProfileRow);
    } else if (error?.code === 'PGRST116') {
      // Perfil no existe, intentar crearlo con rol por defecto 'cliente'
      const { data: authData } = await supabase.auth.getUser();
      const userMetadata = authData.user?.user_metadata ?? {};
      
      const { error: createError } = await supabase.from('profiles').insert({
        id: userId,
        nombres: userMetadata.nombres ?? null,
        apellidos: userMetadata.apellidos ?? null,
        rol: userMetadata.rol ?? 'cliente',
        demo_records: userMetadata.demo_records ?? null,
      } as any);
      
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
  }, []);

  useEffect(() => {
    let mounted = true;
    // Initial session load
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (mounted) {
        setSession(currentSession);
        if (currentSession?.user?.id) {
          loadProfile(currentSession.user.id);
        }
        setLoading(false);
      }
    });
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (nextSession?.user?.id) {
        loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
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
            demo_records: metadata?.demoRecords ?? null,
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

      // Crear el perfil directamente (sin requerir sesión)
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        nombres: metadata?.firstName ?? null,
        apellidos: metadata?.lastName ?? null,
        rol: metadata?.role ?? 'cliente',
        demo_records: metadata?.demoRecords ?? null,
      } as any);
      if (profileError) {
        console.error('Profile creation failed after sign-up:', profileError);
        throw profileError;
      }

      if (data.session) {
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
