import { createClient } from '@supabase/supabase-js'

// Accept the URL even if it was copied with extra parts (e.g. ".../rest/v1/"):
// Supabase needs only "https://<project>.supabase.co".
function cleanUrl(raw) {
  try { return raw ? new URL(raw.trim()).origin : '' } catch { return '' }
}

const url = cleanUrl(import.meta.env.VITE_SUPABASE_URL)
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

/** LIVE = real backend configured; otherwise the site runs in demo mode */
export const LIVE = Boolean(url && key)
export const supabase = LIVE ? createClient(url, key) : null
