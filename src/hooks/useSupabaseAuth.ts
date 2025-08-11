import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../lib/supabase';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
}

export const useSupabaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true
  });

  useEffect(() => {
    // Récupérer la session initiale
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        setAuthState({
          user: session.user,
          profile,
          session,
          loading: false
        });
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    getInitialSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await getUserProfile(session.user.id);
          setAuthState({
            user: session.user,
            profile,
            session,
            loading: false
          });
        } else {
          setAuthState({
            user: null,
            profile: null,
            session: null,
            loading: false
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Mettre à jour la dernière connexion
      if (data.user) {
        await supabase
          .from('user_profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('user_id', data.user.id);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  const hasPermission = (permission: string): boolean => {
    if (!authState.profile) return false;
    if (authState.profile.permissions?.includes('all')) return true;
    return authState.profile.permissions?.includes(permission) || false;
  };

  const isRole = (role: string): boolean => {
    return authState.profile?.role === role;
  };

  return {
    ...authState,
    signIn,
    signOut,
    hasPermission,
    isRole,
    isAuthenticated: !!authState.user
  };
};