import { createClient } from '@supabase/supabase-js'

/**
 * Get Supabase client for API routes
 * Creates client lazily to avoid build-time initialization
 * Returns null if environment variables are missing (enables mock data fallback)
 */
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('Supabase environment variables not configured - using mock data mode')
    return null
  }

  return createClient(supabaseUrl, supabaseKey)
}
