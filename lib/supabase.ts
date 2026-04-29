import { createClient } from '@supabase/supabase-js'

// NEXT_PUBLIC_ vars are baked at build time (client-side).
// SUPABASE_URL / SUPABASE_ANON_KEY are read at runtime (server-side API routes).
const url =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://placeholder.supabase.co'

const anon =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder'

export const supabase = createClient(url, anon)

export function supabaseAdmin() {
  return createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder')
}
