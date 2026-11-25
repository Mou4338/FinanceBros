import { useState } from 'react'
import { Container, Row, Col, Form, Button, Nav, Tab, Badge, Alert } from 'react-bootstrap'
import { useStore, fmtDate, fmtSlot } from '../services/store.jsx'
import { inr } from '../utils/finance.js'

export const statusColor = { New: 'info', Contacted: 'primary', 'In progress': 'warning', Closed: 'secondary', Requested: 'warning', Confirmed: 'primary', Completed: 'success', Cancelled: 'secondary' }
export function StatusBadge({ s }) { return <span className={`st st-${(statusColor[s] || 'secondary')}`}>{s}</span> }

const FLOW = ['Requested', 'Confirmed', 'Completed']
function Timeline({ status }) {
  if (status === 'Cancelled') return <div className="small text-danger fw-semibold"><i className="bi bi-x-circle me-1" />Cancelled</div>
  const at = FLOW.indexOf(status)
  return (
    <div className="tl">
      {FLOW.map((s, i) => <div key={s} className={`tl-step ${i <= at ? 'on' : ''}`}><span />{s}</div>)}
    </div>
  )
}

function Auth() {
  const { login, register } = useStore()
  const [tab, setTab] = useState('login')
  const [err, setErr] = useState('')
  const [validated, setValidated] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setErr('')
    const form = e.currentTarget
    if (!form.checkValidity()) { setValidated(true); return }
    const v = Object.fromEntries(new FormData(form))
    try {
      if (tab === 'login') await login(v.email, v.password)
      else {
        if (v.password !== v.password2) throw new Error('Passwords do not match.')
        await register(v)
      }
    } catch (x) { setErr(x.message) }
  }
  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <div className="contact-card">
          <Nav variant="pills" className="svc-tabs mb-4 gap-2" activeKey={tab} onSelect={(k) => { setTab(k); setErr(''); setValidated(false) }}>
            <Nav.Item className="flex-fill"><Nav.Link eventKey="login" className="justify-content-center">Log in</Nav.Link></Nav.Item>
            <Nav.Item className="flex-fill"><Nav.Link eventKey="register" className="justify-content-center">Create account</Nav.Link></Nav.Item>
          </Nav>
          {err && <Alert variant="danger" className="py-2">{err}</Alert>}
          <Form noValidate validated={validated} onSubmit={submit} key={tab}>
            <Row className="g-3">
              {tab === 'register' && <>
                <Col xs={12}><Form.Label htmlFor="au-name">Full name</Form.Label><Form.Control id="au-name" name="name" required /></Col>
                <Col sm={6}><Form.Label htmlFor="au-phone">Mobile</Form.Label><Form.Control id="au-phone" name="phone" type="tel" pattern="[6-9][0-9]{9}" required /><Form.Control.Feedback type="invalid">10-digit Indian mobile.</Form.Control.Feedback></Col>
                <Col sm={6}><Form.Label htmlFor="au-city">City</Form.Label><Form.Control id="au-city" name="city" /></Col>
              </>}
              <Col xs={12}><Form.Label htmlFor="au-email">Email</Form.Label><Form.Control id="au-email" name="email" type="email" required autoComplete="email" /></Col>
              <Col xs={12}><Form.Label htmlFor="au-pw">Password</Form.Label><Form.Control id="au-pw" name="password" type="password" required minLength={8} autoComplete={tab === 'login' ? 'current-password' : 'new-password'} /><Form.Control.Feedback type="invalid">At least 8 characters.</Form.Control.Feedback></Col>
              {tab === 'register' && <>
                <Col xs={12}><Form.Label htmlFor="au-pw2">Confirm password</Form.Label><Form.Control id="au-pw2" name="password2" type="password" required minLength={8} autoComplete="new-password" /></Col>
                <Col xs={12}><Form.Check id="au-consent" required label="I accept the Terms of Use and Privacy Policy." feedback="Required." feedbackType="invalid" /></Col>
              </>}
              <Col xs={12}><Button type="submit" className="btn-olive w-100" size="lg">{tab === 'login' ? 'Log in' : 'Create free account'}</Button></Col>
            </Row>
          </Form>
          <p className="small mt-3 mb-0" style={{ color: 'var(--muted)' }}>Demo mode: accounts are stored in this browser only. Bookings made with the same email appear in your dashboard.</p>
        </div>
      </Col>
    </Row>
  )
}

function Dashboard({ onBook }) {
  const { user, data, logout, updateProfile, setBooking } = useStore()
  const [edit, setEdit] = useState(false)
  const mine = (r) => r.userId === user.id || r.email?.toLowerCase() === user.email
  const bookings = data.bookings.filter(mine)
  const enquiries = data.enquiries.filter(mine)
  const reports = data.reports.filter((r) => r.userId === user.id)
  const upcoming = bookings.filter((b) => ['Requested', 'Confirmed'].includes(b.status))

  return (
    <>
      <Row className="g-3 mb-4 align-items-center">
        <Col>
          <h2 className="section-title mb-1">Namaste, {user.name.split(' ')[0]}</h2>
          <p className="mb-0" style={{ color: 'var(--muted)' }}>Your bookings, enquiries and saved reports in one place.</p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button className="btn-olive" onClick={() => onBook()}><i className="bi bi-plus-lg me-1" />New booking</Button>
          <Button className="btn-ghost" onClick={logout}><i className="bi bi-box-arrow-right me-1" />Log out</Button>
        </Col>
      </Row>
      <Row className="g-3 mb-4">
        {[['Upcoming calls', upcoming.length, 'bi-calendar-event'], ['All bookings', bookings.length, 'bi-journal-check'], ['Enquiries', enquiries.length, 'bi-chat-left-text'], ['Saved reports', reports.length, 'bi-file-earmark-bar-graph']].map(([l, n, i]) => (
          <Col xs={6} lg={3} key={l}><div className="kpi"><i className={`bi ${i}`} /><div className="n">{n}</div><div className="l">{l}</div></div></Col>
        ))}
      </Row>
      <Row className="g-4">
        <Col lg={8}>
          <Tab.Container defaultActiveKey="bookings">
            <div className="calc-shell">
              <Nav className="calc-nav">
                <Nav.Link eventKey="bookings"><i className="bi bi-calendar-check" />Bookings</Nav.Link>
                <Nav.Link eventKey="enquiries"><i className="bi bi-chat-left-text" />Enquiries</Nav.Link>
                <Nav.Link eventKey="reports"><i className="bi bi-file-earmark-bar-graph" />Reports</Nav.Link>
              </Nav>
              <Tab.Content className="calc-body">
                <Tab.Pane eventKey="bookings">
                  {bookings.length === 0 ? <Empty text="No bookings yet." action={<Button className="btn-olive" onClick={() => onBook()}>Book your first call</Button>} /> :
                    <div className="d-grid gap-3">{bookings.map((b) => (
                      <div className="rec" key={b.id}>
                        <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                          <div><div className="fw-bold">{b.service}</div><div className="small" style={{ color: 'var(--muted)' }}>{b.ref} · {b.mode} · {fmtDate(b.date)}, {fmtSlot(b.slot)}</div></div>
                          <StatusBadge s={b.status} />
                        </div>
                        <Timeline status={b.status} />
                        {['Requested', 'Confirmed'].includes(b.status) && <Button size="sm" className="btn-ghost mt-2" onClick={() => setBooking(b.id, { status: 'Cancelled' })}>Cancel booking</Button>}
                      </div>
                    ))}</div>}
                </Tab.Pane>
                <Tab.Pane eventKey="enquiries">
                  {enquiries.length === 0 ? <Empty text="No enquiries yet." /> :
                    <div className="d-grid gap-2">{enquiries.map((e) => (
                      <div className="rec d-flex justify-content-between gap-2 flex-wrap" key={e.id}>
                        <div><div className="fw-bold">{e.topic}</div><div className="small" style={{ color: 'var(--muted)' }}>{e.ref} · {fmtDate(e.created)}</div></div>
                        <StatusBadge s={e.status} />
                      </div>
                    ))}</div>}
                </Tab.Pane>
                <Tab.Pane eventKey="reports">
                  {reports.length === 0 ? <Empty text="Save a result from the free health check to see it here." action={<Button className="btn-olive" href="#health-check">Take the health check</Button>} /> :
                    <div className="d-grid gap-2">{reports.map((r) => (
                      <div className="rec" key={r.id}>
                        <div className="d-flex justify-content-between flex-wrap gap-2"><div className="fw-bold">{r.type}</div><span className="tag">Score {r.score}/100</span></div>
                        <div className="small mb-2" style={{ color: 'var(--muted)' }}>{r.ref} · {fmtDate(r.created)} · {inr(r.total)} declared · {r.profile} risk profile</div>
                        <div className="alloc-bar" style={{ height: 10 }}>{r.alloc.map(([k, p, c]) => <div key={k} style={{ width: `${p}%`, background: c }} />)}</div>
                        <ul className="small mt-2 mb-0" style={{ color: 'var(--muted)' }}>{r.notes.map((n) => <li key={n}>{n}</li>)}</ul>
                      </div>
                    ))}</div>}
                </Tab.Pane>
              </Tab.Content>
            </div>
          </Tab.Container>
        </Col>
        <Col lg={4}>
          <div className="contact-card">
            <div className="d-flex justify-content-between align-items-center mb-3"><h5 className="mb-0">Profile</h5><Button size="sm" className="btn-ghost" onClick={() => setEdit(!edit)}>{edit ? 'Close' : 'Edit'}</Button></div>
            {edit ? (
              <Form onSubmit={(e) => { e.preventDefault(); updateProfile(Object.fromEntries(new FormData(e.currentTarget))); setEdit(false) }}>
                <Form.Label htmlFor="pf-name">Name</Form.Label><Form.Control id="pf-name" name="name" defaultValue={user.name} required className="mb-2" />
                <Form.Label htmlFor="pf-phone">Mobile</Form.Label><Form.Control id="pf-phone" name="phone" defaultValue={user.phone} pattern="[6-9][0-9]{9}" className="mb-2" />
                <Form.Label htmlFor="pf-city">City</Form.Label><Form.Control id="pf-city" name="city" defaultValue={user.city} className="mb-3" />
                <Button type="submit" className="btn-olive w-100">Save</Button>
              </Form>
            ) : (
              <dl className="mb-0 small prof">
                <dt>Name</dt><dd>{user.name}</dd><dt>Email</dt><dd>{user.email}</dd><dt>Mobile</dt><dd>{user.phone || '—'}</dd><dt>City</dt><dd>{user.city || '—'}</dd><dt>Member since</dt><dd>{fmtDate(user.created)}</dd>
              </dl>
            )}
            <div className="note mt-3"><i className="bi bi-lock me-1" />Only you can see your bookings and reports.</div>
          </div>
        </Col>
      </Row>
    </>
  )
}

function Empty({ text, action }) {
  return <div className="text-center py-4"><i className="bi bi-inbox fs-1 text-olive" /><p className="mt-2" style={{ color: 'var(--muted)' }}>{text}</p>{action}</div>
}

export default function Account({ onBook }) {
  const { user } = useStore()
  return (
    <section className="section bg-olive-50 page-view" id="account">
      <Container>
        {!user && <div className="text-center mb-4"><span className="eyebrow"><i className="bi bi-person-circle" />My Account</span><h2 className="section-title">Track bookings and saved reports.</h2></div>}
        {user ? <Dashboard onBook={onBook} /> : <Auth />}
      </Container>
    </section>
  )
}
