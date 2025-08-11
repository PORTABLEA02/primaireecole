import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Types pour l'application
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Types spécifiques
export type Student = Tables<'students'>;
export type Teacher = Tables<'teachers'>;
export type Class = Tables<'classes'>;
export type Payment = Tables<'payments'>;
export type Grade = Tables<'grades'>;
export type UserProfile = Tables<'user_profiles'>;
export type AcademicYear = Tables<'academic_years'>;
export type Level = Tables<'levels'>;
export type Subject = Tables<'subjects'>;