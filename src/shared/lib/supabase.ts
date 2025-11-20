import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validación de variables de entorno
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please configure in Vercel:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')

  // En desarrollo, dar instrucciones más específicas
  if (process.env.NODE_ENV === 'development') {
    console.error('\nCreate .env.local with:')
    console.error('NEXT_PUBLIC_SUPABASE_URL=your_url')
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key')
  }
}

// Usar valores placeholder solo si faltan (evita crash total)
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseAnonKey || 'placeholder-key'

export const supabase = createClient(url, key)
