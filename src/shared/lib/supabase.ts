import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Solo validar en runtime, no durante el build
if (typeof window !== 'undefined' && (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder'))) {
  console.error('Missing Supabase environment variables. Please configure .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
