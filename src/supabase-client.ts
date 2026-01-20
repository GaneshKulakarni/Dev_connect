import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read environment variables (do NOT force-cast)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Optional demo mode flag
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

// Error handling for missing credentials
if (!isDemoMode && (!supabaseUrl || !supabaseAnonKey)) {
  const errorMessage = 'Supabase credentials missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env or deployment environment variables.';
  if (import.meta.env.DEV) {
    throw new Error(errorMessage);
  }
  console.error(errorMessage);
}

/**
 * Supabase client
 *
 * - Available when env vars exist and demo mode is disabled
 * - Null in demo mode or when env vars are missing
 */
export const supabase: SupabaseClient | null =
  !isDemoMode && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null;

/**
 * Helper flag to check if backend is available
 */
export const isBackendAvailable = Boolean(supabase);
