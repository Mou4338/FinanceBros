import { useEffect, useMemo, useState } from 'react'
import { Container, Row, Col, Form, Button, Nav, Tab, InputGroup } from 'react-bootstrap'
import { useStore, STATUSES, DEMO_ADMIN_PIN, fmtDate, fmtSlot } from '../services/store.jsx'
import { StatusBadge } from './Account.jsx'

const PRICE_GROUPS = [['all', 'Free'], ['loans', 'Loans & credit'], ['sip', 'SIP & mutual funds'], ['wealth', 'Investment & portfolio'], ['planning', 'Financial planning'], ['insurance', 'Insurance & tax']]
const LEGACY = { free: 'all', consult: 'planning', report: 'wealth', annual: 'planning' }

// run a save without blocking the UI; log failures
const safe = (p) => Promise.resolve(p).catch((e) => console.error('Save failed:', e))

const toCsv = (rows, cols) => [cols.join(','), ...rows.map((r) => cols.map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n')

function Gate({ onOk }) {
  const [pin, setPin] = useState(''), [err, setErr] = useState(false)
  return (
    <Row className="justify-content-center"><Col md={6} lg={4}>
      <div className="contact-card text-center">
        <div className="feature-icon mx-auto mb-3" style={{ width: 56, height: 56, fontSize: '1.5rem' }}><i className="bi bi-shield-lock" /></div>
        <h3 className="h4">Admin panel</h3>
        <p className="small" style={{ color: 'var(--muted)' }}>Restricted to administrators.</p>
        <Form onSubmit={(e) => { e.preventDefault(); pin === DEMO_ADMIN_PIN ? onOk() : setErr(true) }}>
          <Form.Control aria-label="Admin PIN" type="password" inputMode="numeric" placeholder="Enter PIN" value={pin} isInvalid={err} onChange={(e) => { setPin(e.target.value); setErr(false) }} className="mb-2 text-center" />
          <Form.Control.Feedback type="invalid" className="mb-2">Incorrect PIN.</Form.Control.Feedback>
          <Button type="submit" className="btn-olive w-100">Unlock</Button>
        </Form>
        <p className="small mt-3 mb-0" style={{ color: 'var(--muted)' }}>Demo PIN: {DEMO_ADMIN_PIN}. Replace with Supabase role-based login before launch.</p>
      </div>
    </Col></Row>
  )
}

// Who sent a record: a logged-in customer, an admin testing, or a guest (no login)
function accountOf(r, users) {
  const byId = r.userId && users.find((u) => u.id === r.userId)
  if (byId) return { kind: byId.role === 'admin' ? 'admin' : 'customer', label: byId.role === 'admin' ? 'Admin (test)' : 'Logged-in customer', user: byId }
  const byEmail = r.email && users.find((u) => u.email?.toLowerCase() === r.email.toLowerCase())
  if (byEmail) return { kind: 'guest-account', label: 'Guest · has account', user: byEmail }
  return { kind: 'guest', label: 'Guest', user: null }
}
const ACC_STYLE = { customer: 'st-success', admin: 'st-secondary', 'guest-account': 'st-info', guest: 'st-warning' }
function AccountBadge({ acc }) {
  return (
    <div>
      <span className={`st ${ACC_STYLE[acc.kind]}`}><i className={`bi ${acc.kind === 'guest' ? 'bi-person' : 'bi-person-check'} me-1`} />{acc.label}</span>
      {acc.user && acc.kind !== 'admin' && <div className="small text-muted mt-1">{acc.user.name || acc.user.email}</div>}
    </div>
  )
}
const ACC_FILTERS = [['all', 'Everyone'], ['customer', 'Logged-in customers'], ['guest', 'Guests (no login)']]

// Two-step delete: first click asks, second click deletes
function DeleteBtn({ onDelete }) {
  const [ask, setAsk] = useState(false)
  useEffect(() => { if (!ask) return; const t = setTimeout(() => setAsk(false), 4000); return () => clearTimeout(t) }, [ask])
  return ask
    ? <Button size="sm" variant="danger" onClick={() => { setAsk(false); onDelete() }}>Delete?</Button>
    : <Button size="sm" className="btn-ghost" aria-label="Delete" title="Delete (spam / duplicate)" onClick={() => setAsk(true)}><i className="bi bi-trash" /></Button>
}

// Internal note, saved when you click away. Customers never see it.
function NoteBox({ value, onSave }) {
  const [v, setV] = useState(value || '')
  const [saved, setSaved] = useState(false)
  useEffect(() => setV(value || ''), [value])
  return (
    <div className="note-box">
      <Form.Control as="textarea" rows={1} size="sm" placeholder="Add a note…" aria-label="Internal note" value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => { if (v !== (value || '')) { onSave(v); setSaved(true); setTimeout(() => setSaved(false), 1500) } }} />
      {saved && <span className="small text-olive">Saved</span>}
    </div>
  )
}

function TeamPane({ admins, me }) {
  const { setRole } = useStore()
  const [email, setEmail] = useState(''), [msg, setMsg] = useState(null), [busy, setBusy] = useState(false)
  const run = async (target, role) => {
    setBusy(true); setMsg(null)
    try {
      await setRole(target, role)
      setMsg({ ok: true, text: role === 'admin' ? `${target} is now an admin. They need to log out and in again.` : `${target} is no longer an admin.` })
      setEmail('')
    } catch (x) { setMsg({ ok: false, text: x.message }) } finally { setBusy(false) }
  }
  return (
    <>
      <p className="small text-muted mb-3">Admins can see every enquiry, booking and customer, and change prices. Only add people you trust.</p>
      <div className="scroll mb-3">
        <table className="table adm align-middle stack">
          <thead><tr><th>Admin</th><th>Mobile</th><th>Admin since</th><th></th></tr></thead>
          <tbody>{admins.map((u) => (
            <tr key={u.id}>
              <td><div className="fw-semibold">{u.name || '—'} {me?.id === u.id && <span className="tag ms-1">You</span>}</div><div className="small text-muted">{u.email}</div></td>
              <td>{u.phone || '—'}</td>
              <td className="text-nowrap">{fmtDate(u.created)}</td>
              <td className="text-end">{me?.id !== u.id && <Button size="sm" className="btn-ghost" disabled={busy} onClick={() => run(u.email, 'customer')}>Remove admin</Button>}</td>
            </tr>))}
            {admins.length === 0 && <tr><td colSpan={4} className="text-muted">No admin accounts yet{me ? '' : ' (demo mode uses the PIN)'}.</td></tr>}
          </tbody>
        </table>
      </div>
      <Form onSubmit={(e) => { e.preventDefault(); if (email.trim()) run(email.trim(), 'admin') }}>
        <Form.Label htmlFor="add-admin">Add an admin</Form.Label>
        <InputGroup>
          <Form.Control id="add-admin" type="email" required placeholder="their@email.com (they must sign up first)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" className="btn-olive" disabled={busy}><i className="bi bi-person-plus me-1" />Make admin</Button>
        </InputGroup>
      </Form>
      {msg && <div className={`form-result ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
    </>
  )
}

function Panel() {
  const { data, setEnquiry, setBooking, setPlan, resetDemo, mode, user, deleteEnquiry, deleteBooking, reload } = useStore()
  const [refreshing, setRefreshing] = useState(false)
  const [q, setQ] = useState(''), [fs, setFs] = useState('All'), [fa, setFa] = useState('all'), [copied, setCopied] = useState(''), [tab, setTab] = useState('enq')
  const customers = useMemo(() => data.users.filter((u) => u.role !== 'admin'), [data.users])
  const admins = useMemo(() => data.users.filter((u) => u.role === 'admin'), [data.users])
  const todayKey = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD, local time
  const todaysCalls = data.bookings.filter((b) => b.date === todayKey && ['Requested', 'Confirmed'].includes(b.status)).length
  const accMatch = (r) => {
    if (fa === 'all') return true
    const k = accountOf(r, data.users).kind
    return fa === 'customer' ? k === 'customer' : k === 'guest' || k === 'guest-account'
  }
  const match = (r) => (fs === 'All' || r.status === fs) && accMatch(r) && JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  const enq = useMemo(() => data.enquiries.filter(match), [data.enquiries, data.users, q, fs, fa]) // eslint-disable-line
  const bks = useMemo(() => data.bookings.filter(match), [data.bookings, data.users, q, fs, fa]) // eslint-disable-line
  const custRows = useMemo(() => customers
    .filter((u) => JSON.stringify(u).toLowerCase().includes(q.toLowerCase()))
    .map((u) => {
      const mine = (r) => r.userId === u.id || r.email?.toLowerCase() === u.email?.toLowerCase()
      return { ...u, enquiries: data.enquiries.filter(mine).length, bookings: data.bookings.filter(mine).length }
    }), [customers, data.enquiries, data.bookings, q])
  const withAcc = (rows) => rows.map((r) => ({ ...r, account: accountOf(r, data.users).label }))
  const copy = async (what, rows, cols) => { try { await navigator.clipboard.writeText(toCsv(rows, cols)); setCopied(what) } catch { setCopied('fail') } setTimeout(() => setCopied(''), 2500) }

  const kpis = [
    ['New enquiries', data.enquiries.filter((e) => e.status === 'New').length, 'bi-envelope-open'],
    ['Booking requests', data.bookings.filter((b) => b.status === 'Requested').length, 'bi-hourglass-split'],
    ['Today\'s calls', todaysCalls, 'bi-calendar-check', 'bk'],
    ['Customer accounts', customers.length, 'bi-people', 'cust'],
    ['Admin accounts', admins.length, 'bi-shield-lock', 'team'],
  ]
  const Filters = ({ statuses }) => (
    <Row className="g-2 mb-3">
      <Col md={6}><InputGroup><InputGroup.Text><i className="bi bi-search" /></InputGroup.Text><Form.Control aria-label="Search" placeholder="Search name, phone, reference, topic…" value={q} onChange={(e) => setQ(e.target.value)} /></InputGroup></Col>
      <Col md={3}><Form.Select aria-label="Filter by account" value={fa} onChange={(e) => setFa(e.target.value)}>{ACC_FILTERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Form.Select></Col>
      <Col md={3}><Form.Select aria-label="Filter by status" value={fs} onChange={(e) => setFs(e.target.value)}><option value="All">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}</Form.Select></Col>
    </Row>
  )

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div><h2 className="section-title mb-1">Admin dashboard</h2><p className="mb-0" style={{ color: 'var(--muted)' }}>Leads, bookings, consultants and pricing.</p></div>
        <div className="d-flex gap-2">
          <Button className="btn-ghost" disabled={refreshing} onClick={async () => { setRefreshing(true); try { await reload() } finally { setRefreshing(false) } }}><i className={`bi bi-arrow-clockwise me-1 ${refreshing ? 'spin' : ''}`} />Refresh</Button>
          {mode === 'demo' && <Button className="btn-ghost" onClick={() => resetDemo()}><i className="bi bi-arrow-counterclockwise me-1" />Reset demo data</Button>}
        </div>
      </div>
      <Row className="g-3 mb-4">
        {kpis.map(([l, n, i, t]) => (
          <Col xs={6} md={4} lg key={l}>
            {t ? <button type="button" className="kpi kpi-btn w-100 text-start" onClick={() => { setTab(t); setQ('') }}><i className={`bi ${i}`} /><div className="n">{n}</div><div className="l">{l} <i className="bi bi-arrow-right small" /></div></button>
               : <div className="kpi"><i className={`bi ${i}`} /><div className="n">{n}</div><div className="l">{l}</div></div>}
          </Col>
        ))}
      </Row>
      <Tab.Container activeKey={tab} onSelect={(k) => { if (k) setTab(k); setQ(''); setFs('All'); setFa('all') }}>
        <div className="calc-shell">
          <Nav className="calc-nav">
            <Nav.Link eventKey="enq"><i className="bi bi-inbox" />Enquiries</Nav.Link>
            <Nav.Link eventKey="bk"><i className="bi bi-calendar-week" />Bookings</Nav.Link>
            <Nav.Link eventKey="cust"><i className="bi bi-people" />Customers <span className="tag ms-1">{customers.length}</span></Nav.Link>
            <Nav.Link eventKey="price"><i className="bi bi-tag" />Services & pricing</Nav.Link>
            <Nav.Link eventKey="desks"><i className="bi bi-person-badge" />Consultants</Nav.Link>
            <Nav.Link eventKey="team"><i className="bi bi-shield-lock" />Admins <span className="tag ms-1">{admins.length}</span></Nav.Link>
          </Nav>
          <Tab.Content className="calc-body">
            <Tab.Pane eventKey="enq">
              <Filters statuses={STATUSES.enquiry} />
              <div className="scroll">
                <table className="table adm align-middle stack">
                  <thead><tr><th>Ref</th><th>Contact</th><th>Account</th><th>Topic</th><th>Source</th><th>Date</th><th>Status</th><th>Internal note</th><th></th></tr></thead>
                  <tbody>{enq.map((e) => (
                    <tr key={e.id}>
                      <td className="fw-semibold">{e.ref}</td>
                      <td><div className="fw-semibold">{e.name}</div><div className="small text-muted">{e.phone} · {e.email}</div></td>
                      <td><AccountBadge acc={accountOf(e, data.users)} /></td>
                      <td>{e.topic}{e.message && <div className="small text-muted">{e.message}</div>}</td>
                      <td>{e.source}</td><td className="text-nowrap">{fmtDate(e.created)}</td>
                      <td><Form.Select size="sm" aria-label="Enquiry status" value={e.status} onChange={(x) => safe(setEnquiry(e.id, { status: x.target.value }))}>{STATUSES.enquiry.map((s) => <option key={s}>{s}</option>)}</Form.Select></td>
                      <td><NoteBox value={e.admin_notes} onSave={(v) => safe(setEnquiry(e.id, { admin_notes: v }))} /></td>
                      <td><DeleteBtn onDelete={() => safe(deleteEnquiry(e.id))} /></td>
                    </tr>))}</tbody>
                </table>
              </div>
              {enq.length === 0 && <p className="text-center text-muted">No enquiries match.</p>}
              <Button size="sm" className="btn-ghost" onClick={() => copy('enq', withAcc(enq), ['ref', 'name', 'phone', 'email', 'city', 'account', 'topic', 'source', 'status', 'admin_notes', 'created'])}><i className="bi bi-clipboard me-1" />{copied === 'enq' ? 'Copied as CSV' : 'Copy as CSV'}</Button>
            </Tab.Pane>
            <Tab.Pane eventKey="bk">
              <Filters statuses={STATUSES.booking} />
              <div className="scroll">
                <table className="table adm align-middle stack">
                  <thead><tr><th>Ref</th><th>Customer</th><th>Account</th><th>Service</th><th>Slot</th><th>Consultant</th><th>Status</th><th>Internal note</th><th></th></tr></thead>
                  <tbody>{bks.map((b) => (
                    <tr key={b.id}>
                      <td className="fw-semibold">{b.ref}</td>
                      <td><div className="fw-semibold">{b.name}</div><div className="small text-muted">{b.phone} · {b.email}</div></td>
                      <td><AccountBadge acc={accountOf(b, data.users)} /></td>
                      <td>{b.service}<div className="small text-muted">{b.mode}</div></td>
                      <td className="text-nowrap">{b.date === todayKey ? <span className="st st-success">Today</span> : fmtDate(b.date)}<div className="small text-muted">{fmtSlot(b.slot)}</div></td>
                      <td><Form.Select size="sm" aria-label="Assign consultant" value={b.consultant || ''} onChange={(x) => safe(setBooking(b.id, { consultant: x.target.value }))}><option value="">Unassigned</option>{data.consultants.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Form.Select></td>
                      <td><Form.Select size="sm" aria-label="Booking status" value={b.status} onChange={(x) => safe(setBooking(b.id, { status: x.target.value }))}>{STATUSES.booking.map((s) => <option key={s}>{s}</option>)}</Form.Select></td>
                      <td><NoteBox value={b.admin_notes} onSave={(v) => safe(setBooking(b.id, { admin_notes: v }))} /></td>
                      <td><DeleteBtn onDelete={() => safe(deleteBooking(b.id))} /></td>
                    </tr>))}</tbody>
                </table>
              </div>
              {bks.length === 0 && <p className="text-center text-muted">No bookings match.</p>}
              <Button size="sm" className="btn-ghost" onClick={() => copy('bk', withAcc(bks), ['ref', 'name', 'phone', 'email', 'account', 'service', 'mode', 'date', 'slot', 'status', 'consultant', 'admin_notes'])}><i className="bi bi-clipboard me-1" />{copied === 'bk' ? 'Copied as CSV' : 'Copy as CSV'}</Button>
            </Tab.Pane>
            <Tab.Pane eventKey="cust">
              <p className="small text-muted mb-3">People who created an account on the website. Admin accounts are not counted.</p>
              <InputGroup className="mb-3"><InputGroup.Text><i className="bi bi-search" /></InputGroup.Text><Form.Control aria-label="Search customers" placeholder="Search name, email, phone, city…" value={q} onChange={(e) => setQ(e.target.value)} /></InputGroup>
              {custRows.length === 0 ? (
                <div className="text-center py-4"><i className="bi bi-people fs-1 text-olive" /><p className="mt-2 text-muted mb-0">{customers.length ? 'No customers match.' : 'No customer accounts yet. They appear here when someone signs up on the website.'}</p></div>
              ) : (
                <div className="scroll">
                  <table className="table adm align-middle stack">
                    <thead><tr><th>Customer</th><th>Mobile</th><th>City</th><th>Joined</th><th>Enquiries</th><th>Bookings</th></tr></thead>
                    <tbody>{custRows.map((u) => (
                      <tr key={u.id}>
                        <td><div className="fw-semibold">{u.name || '—'}</div><div className="small text-muted">{u.email}</div></td>
                        <td>{u.phone || '—'}</td><td>{u.city || '—'}</td><td className="text-nowrap">{fmtDate(u.created)}</td>
                        <td>{u.enquiries}</td><td>{u.bookings}</td>
                      </tr>))}</tbody>
                  </table>
                </div>
              )}
              {custRows.length > 0 && <Button size="sm" className="btn-ghost" onClick={() => copy('cust', custRows, ['name', 'email', 'phone', 'city', 'created', 'enquiries', 'bookings'])}><i className="bi bi-clipboard me-1" />{copied === 'cust' ? 'Copied as CSV' : 'Copy as CSV'}</Button>}
            </Tab.Pane>
            <Tab.Pane eventKey="price">
              <p className="small text-muted">Changes update the Pricing page on the website immediately.</p>
              {PRICE_GROUPS.map(([k, title]) => {
                const list = data.plans.filter((p) => (p.service || LEGACY[p.id] || 'planning') === k).sort((x, y) => (x.sort ?? 99) - (y.sort ?? 99))
                if (!list.length) return null
                return (
                  <div key={k} className="mb-4">
                    <h6 className="fw-bold mb-2">{title}</h6>
                    <Row className="g-3">
                      {list.map((p) => (
                        <Col md={6} xl={4} key={p.id}>
                          <div className="rec h-100">
                            <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
                              <Form.Label htmlFor={`pl-${p.id}`} className="fw-bold mb-0">{p.name}</Form.Label>
                              {k !== 'all' && <Form.Check type="switch" id={`ft-${p.id}`} label="Most booked" className="small" checked={!!p.featured} onChange={(e) => safe(setPlan(p.id, { featured: e.target.checked }))} />}
                            </div>
                            <InputGroup className="mb-2"><InputGroup.Text>₹</InputGroup.Text><Form.Control id={`pl-${p.id}`} type="number" min={0} value={p.price} onChange={(e) => safe(setPlan(p.id, { price: Math.max(0, Number(e.target.value) || 0) }))} /><InputGroup.Text>{p.per || 'free'}</InputGroup.Text></InputGroup>
                            <Form.Control aria-label={`${p.name} description`} value={p.d || ''} onChange={(e) => safe(setPlan(p.id, { d: e.target.value }))} />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )
              })}
              {data.plans.some((p) => !p.service) && <div className="note">Only the original 4 plans are in your database. Run <code>supabase/pricing.sql</code> in the Supabase SQL Editor to add the per-service plans.</div>}
            </Tab.Pane>
            <Tab.Pane eventKey="team"><TeamPane admins={admins} me={user} /></Tab.Pane>
            <Tab.Pane eventKey="desks">
              <Row className="g-3">{data.consultants.map((c) => {
                const n = data.bookings.filter((b) => b.consultant === c.id && b.status !== 'Cancelled').length
                return <Col md={4} key={c.id}><div className="rec"><div className="fw-bold">{c.name}</div><div className="small text-muted mb-2">{c.expertise}</div><span className="tag">{n} active booking{n === 1 ? '' : 's'}</span></div></Col>
              })}</Row>
            </Tab.Pane>
          </Tab.Content>
        </div>
      </Tab.Container>
      {copied === 'fail' && <p className="small text-danger mt-2">Copy was blocked by the browser.</p>}
      {mode === 'demo' && <p className="small mt-3" style={{ color: 'var(--muted)' }}>Demo mode: data lives in this browser. Rows marked "Sample" are example data.</p>}
    </>
  )
}

function NoAccess({ loggedIn }) {
  return (
    <Row className="justify-content-center"><Col md={6} lg={5}>
      <div className="contact-card text-center">
        <div className="feature-icon mx-auto mb-3" style={{ width: 56, height: 56, fontSize: '1.5rem' }}><i className="bi bi-shield-lock" /></div>
        <h3 className="h4">Admin panel</h3>
        <p style={{ color: 'var(--muted)' }}>{loggedIn ? 'Your account does not have admin access.' : 'Log in with an admin account to continue.'}</p>
        {!loggedIn && <Button className="btn-olive" href="#account">Log in</Button>}
      </div>
    </Col></Row>
  )
}

export default function Admin() {
  const { mode, user, isAdmin } = useStore()
  const [ok, setOk] = useState(false)
  let body
  if (mode === 'live') body = isAdmin ? <Panel /> : <NoAccess loggedIn={!!user} />
  else body = ok ? <Panel /> : <Gate onOk={() => setOk(true)} />
  return (
    <section className="section bg-olive-50 page-view" id="admin">
      <Container>{body}</Container>
    </section>
  )
}
