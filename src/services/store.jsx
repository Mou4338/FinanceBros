/*
  Data layer — two interchangeable back ends behind one useStore() API.

  • DEMO mode (default): everything lives in this browser's localStorage.
  • LIVE mode: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env and the
    same API talks to Supabase (see supabase/schema.sql and DEPLOY.md).

  All write functions return Promises in both modes, so components never change.
*/
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, LIVE } from './supabase.js'

const KEY = 'fb-data-v1'
export const STATUSES = { enquiry: ['New', 'Contacted', 'In progress', 'Closed'], booking: ['Requested', 'Confirmed', 'Completed', 'Cancelled'] }
export const SERVICE_OPTIONS = ['Personal loan', 'Home loan', 'Business loan', 'Education loan', 'Credit card / score', 'SIP & mutual funds', 'Portfolio review', 'Financial planning', 'Insurance', 'Tax / ITR', 'Other']
export const DEMO_ADMIN_PIN = '2580'

const today = new Date()
const iso = (d) => d.toISOString()
const daysAgo = (n) => iso(new Date(today.getTime() - n * 864e5))

const SEED = {
  users: [],
  session: null,
  plans: [
    { id: 'free', name: 'Free', price: 0, per: '', d: 'For anyone getting started.', f: ['All calculators', 'Indicative health check', 'Learning centre & guides', 'Instagram explainers'] },
    { id: 'consult', name: 'Consultation', price: 499, per: '/ session', d: 'One focused 45-min expert call.', f: ['Loan, SIP or planning topic', 'Review of your numbers', 'Written summary after the call', 'WhatsApp follow-up for 7 days'], featured: true },
    { id: 'report', name: 'Portfolio Report', price: 1499, per: '/ report', d: 'A full Portfolio Health Report.', f: ['Allocation & overlap analysis', 'Goal mapping', 'PDF report', '30-min walkthrough call'] },
    { id: 'annual', name: 'Annual Plan', price: 4999, per: '/ year', d: 'Ongoing planning for the year.', f: ['Complete financial plan', 'Quarterly reviews', 'Loan & insurance check-ups', 'Priority WhatsApp support'] },
  ],
  consultants: [
    { id: 'c1', name: 'Loans desk', expertise: 'Loans & credit', active: true },
    { id: 'c2', name: 'Investments desk', expertise: 'SIP, mutual funds, portfolio', active: true },
    { id: 'c3', name: 'Planning desk', expertise: 'Budgeting, retirement, insurance', active: true },
  ],
  // Sample records so the admin panel is not empty in the demo
  enquiries: [
    { id: 'e1', ref: 'FB-E-1001', name: 'Sample: Ananya K.', phone: '9800000001', email: 'ananya@example.com', city: 'Pune', topic: 'Home loan', source: 'Contact form', status: 'New', created: daysAgo(0), sample: true, message: 'Comparing balance transfer offers.' },
    { id: 'e2', ref: 'FB-E-1002', name: 'Sample: Rohit M.', phone: '9800000002', email: 'rohit@example.com', city: 'Indore', topic: 'SIP & mutual funds', source: 'Instagram', status: 'Contacted', created: daysAgo(1), sample: true, message: 'First SIP, ₹5,000/month.' },
    { id: 'e3', ref: 'FB-E-1003', name: 'Sample: Priya S.', phone: '9800000003', email: 'priya@example.com', city: 'Jaipur', topic: 'Financial planning', source: 'Health check', status: 'In progress', created: daysAgo(3), sample: true, message: '' },
  ],
  bookings: [
    { id: 'b1', ref: 'FB-B-2001', name: 'Sample: Karan P.', phone: '9800000004', email: 'karan@example.com', service: 'Personal loan', mode: 'Phone call', date: iso(today).slice(0, 10), slot: '18:00', status: 'Confirmed', consultant: 'c1', created: daysAgo(2), sample: true, userId: null },
  ],
  reports: [],
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...SEED, ...JSON.parse(raw) }
  } catch { /* storage unavailable */ }
  return structuredClone(SEED)
}
function persist(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

const uid = () => Math.random().toString(36).slice(2, 10)
const ref = (p) => `FB-${p}-${Math.floor(1000 + Math.random() * 9000)}`
async function hash(s) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch { return 'plain:' + s }
}

const Ctx = createContext(null)

function DemoProvider({ children }) {
  const [data, setData] = useState(load)
  useEffect(() => persist(data), [data])
  const update = useCallback((fn) => setData((d) => ({ ...d, ...fn(d) })), [])

  const user = data.users.find((u) => u.id === data.session) || null

  const api = {
    mode: 'demo', data, user, isAdmin: false,
    // ---------- auth (FR-06) ----------
    async register({ name, email, phone, city, password }) {
      email = email.trim().toLowerCase()
      if (data.users.some((u) => u.email === email)) throw new Error('An account with this email already exists. Please log in.')
      const u = { id: uid(), name: name.trim(), email, phone, city, role: 'customer', pw: await hash(password), created: iso(new Date()) }
      update((d) => ({ users: [...d.users, u], session: u.id }))
      return u
    },
    async login(email, password) {
      const u = data.users.find((x) => x.email === email.trim().toLowerCase())
      if (!u || u.pw !== (await hash(password))) throw new Error('Email or password is incorrect.')
      update(() => ({ session: u.id }))
    },
    logout() { update(() => ({ session: null })) },
    updateProfile(patch) { update((d) => ({ users: d.users.map((u) => (u.id === d.session ? { ...u, ...patch } : u)) })) },

    // ---------- enquiries (FR-04) ----------
    addEnquiry(e) {
      const rec = { id: uid(), ref: ref('E'), status: 'New', created: iso(new Date()), userId: data.session, source: 'Website', ...e }
      update((d) => ({ enquiries: [rec, ...d.enquiries] }))
      return Promise.resolve(rec)
    },
    setEnquiry(id, patch) { update((d) => ({ enquiries: d.enquiries.map((e) => (e.id === id ? { ...e, ...patch } : e)) })) },

    // ---------- bookings (FR-07) ----------
    addBooking(b) {
      const rec = { id: uid(), ref: ref('B'), status: 'Requested', consultant: '', created: iso(new Date()), userId: data.session, ...b }
      update((d) => ({ bookings: [rec, ...d.bookings] }))
      return Promise.resolve(rec)
    },
    setBooking(id, patch) { update((d) => ({ bookings: d.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) })) },
    getTakenSlots(date) { return Promise.resolve(data.bookings.filter((b) => b.date === date && b.status !== 'Cancelled').map((b) => b.slot)) },

    // ---------- reports (FR-09) ----------
    addReport(r) {
      const rec = { id: uid(), ref: ref('R'), created: iso(new Date()), userId: data.session, ...r }
      update((d) => ({ reports: [rec, ...d.reports] }))
      return Promise.resolve(rec)
    },

    // ---------- admin (FR-10) ----------
    setPlan(id, patch) { update((d) => ({ plans: d.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)) })) },
    resetDemo() { update(() => structuredClone(SEED)) },
  }
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

/* ===================================================================
   LIVE mode — Supabase
   DB columns are snake_case; the app uses the same names as demo mode.
   =================================================================== */
const fromDb = (r) => (r ? { ...r, userId: r.user_id } : r)
const toDb = ({ userId, ...r }) => ({ ...r, user_id: userId ?? null })
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : uid() + uid() + uid() + uid())

function SupabaseProvider({ children }) {
  const [data, setData] = useState({ users: [], session: null, plans: SEED.plans, consultants: [], enquiries: [], bookings: [], reports: [] })
  const [user, setUser] = useState(null)
  const isAdmin = user?.role === 'admin'
  const patch = (p) => setData((d) => ({ ...d, ...p }))

  const loadPublic = useCallback(async () => {
    const [plans, consultants] = await Promise.all([
      supabase.from('plans').select('*').order('sort'),
      supabase.from('consultants').select('*').eq('active', true),
    ])
    patch({ plans: plans.data?.length ? plans.data : SEED.plans, consultants: consultants.data || [] })
  }, [])

  // RLS decides what comes back: own rows for customers, everything for admins
  const loadPrivate = useCallback(async (profile) => {
    if (!profile) { patch({ enquiries: [], bookings: [], reports: [], users: [] }); return }
    const q = [
      supabase.from('enquiries').select('*').order('created', { ascending: false }),
      supabase.from('bookings').select('*').order('date', { ascending: false }),
      supabase.from('reports').select('*').order('created', { ascending: false }),
    ]
    if (profile.role === 'admin') q.push(supabase.from('profiles').select('id,name,email,role,created'))
    const [e, b, r, u] = await Promise.all(q)
    patch({ enquiries: (e.data || []).map(fromDb), bookings: (b.data || []).map(fromDb), reports: (r.data || []).map(fromDb), users: u?.data || [] })
  }, [])

  const loadProfile = useCallback(async (session) => {
    if (!session) { setUser(null); patch({ session: null }); loadPrivate(null); return }
    const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    const profile = { ...(p || {}), id: session.user.id, email: session.user.email, name: p?.name || session.user.email }
    setUser(profile); patch({ session: profile.id })
    loadPrivate(profile)
  }, [loadPrivate])

  useEffect(() => {
    loadPublic()
    supabase.auth.getSession().then(({ data: s }) => loadProfile(s.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => loadProfile(session))
    return () => sub.subscription.unsubscribe()
  }, [loadPublic, loadProfile])

  const fail = (error) => { if (error) throw new Error(error.message) }
  const refresh = () => user && loadPrivate(user)

  const api = {
    mode: 'live', data, user, isAdmin,
    async register({ name, email, phone, city, password }) {
      const { data: r, error } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password, options: { data: { name, phone, city } } })
      fail(error)
      if (!r.session) throw new Error('Almost done! Check your email and click the confirmation link, then log in.')
    },
    async login(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
      if (error) throw new Error(error.message === 'Invalid login credentials' ? 'Email or password is incorrect.' : error.message)
    },
    async logout() { await supabase.auth.signOut() },
    async updateProfile(p) {
      const { error } = await supabase.from('profiles').update({ name: p.name, phone: p.phone, city: p.city }).eq('id', user.id)
      fail(error); setUser((u) => ({ ...u, ...p }))
    },

    async addEnquiry(e) {
      const rec = { id: newId(), ref: ref('E'), status: 'New', created: iso(new Date()), userId: user?.id || null, source: 'Website', ...e }
      const { status, created, ...row } = rec // DB fills status & created
      const { error } = await supabase.from('enquiries').insert(toDb(row))
      fail(error); refresh(); return rec
    },
    async setEnquiry(id, p) {
      patch({ enquiries: data.enquiries.map((e) => (e.id === id ? { ...e, ...p } : e)) })
      const { error } = await supabase.from('enquiries').update(p).eq('id', id); fail(error)
    },

    async addBooking(b) {
      const rec = { id: newId(), ref: ref('B'), status: 'Requested', consultant: '', created: iso(new Date()), userId: user?.id || null, ...b }
      const { status, consultant, created, ...row } = rec
      const { error } = await supabase.from('bookings').insert(toDb(row))
      if (error?.code === '23505') throw new Error('Sorry, that slot was just booked. Please pick another time.')
      fail(error); refresh(); return rec
    },
    async setBooking(id, p) {
      patch({ bookings: data.bookings.map((b) => (b.id === id ? { ...b, ...p } : b)) })
      if (!isAdmin && p.status === 'Cancelled') { const { error } = await supabase.rpc('cancel_booking', { bid: id }); fail(error); return }
      const { error } = await supabase.from('bookings').update({ ...p, consultant: p.consultant === '' ? null : p.consultant }).eq('id', id); fail(error)
    },
    async getTakenSlots(date) {
      const { data: rows } = await supabase.rpc('taken_slots', { d: date })
      return (rows || []).map((r) => (typeof r === 'string' ? r : r.taken_slots ?? r.slot))
    },

    async addReport(r) {
      const rec = { id: newId(), ref: ref('R'), created: iso(new Date()), userId: user.id, ...r }
      const { created, ...row } = rec
      const { error } = await supabase.from('reports').insert(toDb(row)); fail(error)
      patch({ reports: [rec, ...data.reports] }); return rec
    },

    async setPlan(id, p) {
      patch({ plans: data.plans.map((x) => (x.id === id ? { ...x, ...p } : x)) })
      const { error } = await supabase.from('plans').update(p).eq('id', id); fail(error)
    },
    resetDemo() {},
  }
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function StoreProvider({ children }) {
  return LIVE ? <SupabaseProvider>{children}</SupabaseProvider> : <DemoProvider>{children}</DemoProvider>
}

export const useStore = () => useContext(Ctx)

export const fmtDate = (s) => new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
export const fmtSlot = (t) => { const [h, m] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}` }
