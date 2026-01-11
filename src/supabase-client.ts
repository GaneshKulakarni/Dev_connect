import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Supabase credentials missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  if (import.meta.env.DEV) {
    throw new Error(errorMessage)
  }
  console.error(errorMessage)
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
)