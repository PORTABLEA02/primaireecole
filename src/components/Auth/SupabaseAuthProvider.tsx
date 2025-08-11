import React, { createContext, useContext } from 'react';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import type { UserProfile } from '../../lib/supabase';

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

interface SupabaseAuthProviderProps {
  children: React.ReactNode;
}

export const SupabaseAuthProvider: React.FC<SupabaseAuthProviderProps> = ({ children }) => {
  const auth = useSupabaseAuth();

  // Adapter l'interface pour correspondre à l'AuthProvider existant
  const adaptedAuth = {
    user: auth.profile ? {
      id: auth.user?.id || '',
      name: auth.profile.full_name,
      email: auth.user?.email || '',
      role: auth.profile.role,
      permissions: auth.profile.permissions || [],
      avatar: auth.profile.avatar_url
    } : null,
    profile: auth.profile,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    signIn: async (email: string, password: string) => {
      const result = await auth.signIn(email, password);
      return result.success;
    },
    signOut: auth.signOut,
    hasPermission: auth.hasPermission,
    isRole: auth.isRole,
    login: async (email: string, password: string, rememberMe?: boolean) => {
      const result = await auth.signIn(email, password);
      return result.success;
    },
    logout: auth.signOut
  };

  return (
    <AuthContext.Provider value={adaptedAuth}>
      {children}
    </AuthContext.Provider>
  );
};