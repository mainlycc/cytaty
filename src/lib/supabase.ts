import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
onst supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!supabaseUrl || !supabaseAnonKey) {
 throw new Error('Brakuje zmiennych środowiskowych Supabase')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)