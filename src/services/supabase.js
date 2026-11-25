import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

/** LIVE = real backend configured; otherwise the site runs in demo mode */
export const LIVE = Boolean(url && key)
export const supabase = LIVE ? createClient(url, key) : null
