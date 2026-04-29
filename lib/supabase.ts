import { createClient } from '@supabase/supabase-js'

// Falls back to placeholders at build time; real values are needed at runtime
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(url, anon)

export function supabaseAdmin() {
  return createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder')
}
