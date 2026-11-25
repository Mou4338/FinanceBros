import { useMemo, useState } from 'react'
import { Container, Row, Col, Form, Button, Nav, Tab, InputGroup } from 'react-bootstrap'
import { useStore, STATUSES, DEMO_ADMIN_PIN, fmtDate, fmtSlot } from '../services/store.jsx'
import { StatusBadge } from './Account.jsx'

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

function Panel() {
  const { data, setEnquiry, setBooking, setPlan, resetDemo } = useStore()
  const [q, setQ] = useState(''), [fs, setFs] = useState('All'), [copied, setCopied] = useState('')
  const match = (r) => (fs === 'All' || r.status === fs) && JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  const enq = useMemo(() => data.enquiries.filter(match), [data.enquiries, q, fs]) // eslint-disable-line
  const bks = useMemo(() => data.bookings.filter(match), [data.bookings, q, fs]) // eslint-disable-line
  const copy = async (what, rows, cols) => { try { await navigator.clipboard.writeText(toCsv(rows, cols)); setCopied(what) } catch { setCopied('fail') } setTimeout(() => setCopied(''), 2500) }

  const kpis = [
    ['New enquiries', data.enquiries.filter((e) => e.status === 'New').length, 'bi-envelope-open'],
    ['Booking requests', data.bookings.filter((b) => b.status === 'Requested').length, 'bi-hourglass-split'],
    ['Confirmed calls', data.bookings.filter((b) => b.status === 'Confirmed').length, 'bi-calendar-check'],
    ['Customers', data.users.length, 'bi-people'],
  ]
  const Filters = ({ statuses }) => (
    <Row className="g-2 mb-3">
      <Col md={8}><InputGroup><InputGroup.Text><i className="bi bi-search" /></InputGroup.Text><Form.Control aria-label="Search" placeholder="Search name, phone, reference, topic…" value={q} onChange={(e) => setQ(e.target.value)} /></InputGroup></Col>
      <Col md={4}><Form.Select aria-label="Filter by status" value={fs} onChange={(e) => setFs(e.target.value)}><option>All</option>{statuses.map((s) => <option key={s}>{s}</option>)}</Form.Select></Col>
    </Row>
  )

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div><h2 className="section-title mb-1">Admin dashboard</h2><p className="mb-0" style={{ color: 'var(--muted)' }}>Leads, bookings, consultants and pricing.</p></div>
        <Button className="btn-ghost" onClick={() => resetDemo()}><i className="bi bi-arrow-counterclockwise me-1" />Reset demo data</Button>
      </div>
      <Row className="g-3 mb-4">
        {kpis.map(([l, n, i]) => <Col xs={6} lg={3} key={l}><div className="kpi"><i className={`bi ${i}`} /><div className="n">{n}</div><div className="l">{l}</div></div></Col>)}
      </Row>
      <Tab.Container defaultActiveKey="enq" onSelect={() => { setQ(''); setFs('All') }}>
        <div className="calc-shell">
          <Nav className="calc-nav">
            <Nav.Link eventKey="enq"><i className="bi bi-inbox" />Enquiries</Nav.Link>
            <Nav.Link eventKey="bk"><i className="bi bi-calendar-week" />Bookings</Nav.Link>
            <Nav.Link eventKey="price"><i className="bi bi-tag" />Services & pricing</Nav.Link>
            <Nav.Link eventKey="team"><i className="bi bi-person-badge" />Consultants</Nav.Link>
          </Nav>
          <Tab.Content className="calc-body">
            <Tab.Pane eventKey="enq">
              <Filters statuses={STATUSES.enquiry} />
              <div className="scroll">
                <table className="table adm align-middle stack">
                  <thead><tr><th>Ref</th><th>Contact</th><th>Topic</th><th>Source</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>{enq.map((e) => (
                    <tr key={e.id}>
                      <td className="fw-semibold">{e.ref}</td>
                      <td><div className="fw-semibold">{e.name}</div><div className="small text-muted">{e.phone} · {e.email}</div></td>
                      <td>{e.topic}{e.message && <div className="small text-muted">{e.message}</div>}</td>
                      <td>{e.source}</td><td className="text-nowrap">{fmtDate(e.created)}</td>
                      <td><Form.Select size="sm" aria-label="Enquiry status" value={e.status} onChange={(x) => setEnquiry(e.id, { status: x.target.value })}>{STATUSES.enquiry.map((s) => <option key={s}>{s}</option>)}</Form.Select></td>
                    </tr>))}</tbody>
                </table>
              </div>
              {enq.length === 0 && <p className="text-center text-muted">No enquiries match.</p>}
              <Button size="sm" className="btn-ghost" onClick={() => copy('enq', enq, ['ref', 'name', 'phone', 'email', 'city', 'topic', 'source', 'status', 'created'])}><i className="bi bi-clipboard me-1" />{copied === 'enq' ? 'Copied as CSV' : 'Copy as CSV'}</Button>
            </Tab.Pane>
            <Tab.Pane eventKey="bk">
              <Filters statuses={STATUSES.booking} />
              <div className="scroll">
                <table className="table adm align-middle stack">
                  <thead><tr><th>Ref</th><th>Customer</th><th>Service</th><th>Slot</th><th>Consultant</th><th>Status</th></tr></thead>
                  <tbody>{bks.map((b) => (
                    <tr key={b.id}>
                      <td className="fw-semibold">{b.ref}</td>
                      <td><div className="fw-semibold">{b.name}</div><div className="small text-muted">{b.phone}</div></td>
                      <td>{b.service}<div className="small text-muted">{b.mode}</div></td>
                      <td className="text-nowrap">{fmtDate(b.date)}<div className="small text-muted">{fmtSlot(b.slot)}</div></td>
                      <td><Form.Select size="sm" aria-label="Assign consultant" value={b.consultant} onChange={(x) => setBooking(b.id, { consultant: x.target.value })}><option value="">Unassigned</option>{data.consultants.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Form.Select></td>
                      <td><Form.Select size="sm" aria-label="Booking status" value={b.status} onChange={(x) => setBooking(b.id, { status: x.target.value })}>{STATUSES.booking.map((s) => <option key={s}>{s}</option>)}</Form.Select></td>
                    </tr>))}</tbody>
                </table>
              </div>
              {bks.length === 0 && <p className="text-center text-muted">No bookings match.</p>}
              <Button size="sm" className="btn-ghost" onClick={() => copy('bk', bks, ['ref', 'name', 'phone', 'email', 'service', 'mode', 'date', 'slot', 'status', 'consultant'])}><i className="bi bi-clipboard me-1" />{copied === 'bk' ? 'Copied as CSV' : 'Copy as CSV'}</Button>
            </Tab.Pane>
            <Tab.Pane eventKey="price">
              <p className="small text-muted">Changes update the Pricing section on the website immediately.</p>
              <Row className="g-3">
                {data.plans.map((p) => (
                  <Col md={6} key={p.id}>
                    <div className="rec">
                      <Form.Label htmlFor={`pl-${p.id}`} className="fw-bold">{p.name}</Form.Label>
                      <InputGroup className="mb-2"><InputGroup.Text>₹</InputGroup.Text><Form.Control id={`pl-${p.id}`} type="number" min={0} value={p.price} onChange={(e) => setPlan(p.id, { price: Math.max(0, Number(e.target.value) || 0) })} /><InputGroup.Text>{p.per || 'free'}</InputGroup.Text></InputGroup>
                      <Form.Control aria-label={`${p.name} description`} value={p.d} onChange={(e) => setPlan(p.id, { d: e.target.value })} />
                    </div>
                  </Col>
                ))}
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="team">
              <Row className="g-3">{data.consultants.map((c) => {
                const n = data.bookings.filter((b) => b.consultant === c.id && b.status !== 'Cancelled').length
                return <Col md={4} key={c.id}><div className="rec"><div className="fw-bold">{c.name}</div><div className="small text-muted mb-2">{c.expertise}</div><span className="tag">{n} active booking{n === 1 ? '' : 's'}</span></div></Col>
              })}</Row>
            </Tab.Pane>
          </Tab.Content>
        </div>
      </Tab.Container>
      {copied === 'fail' && <p className="small text-danger mt-2">Copy was blocked by the browser.</p>}
      <p className="small mt-3" style={{ color: 'var(--muted)' }}>Demo mode: data lives in this browser. Rows marked "Sample" are example data.</p>
    </>
  )
}

export default function Admin() {
  const [ok, setOk] = useState(false)
  return (
    <section className="section bg-olive-50 page-view" id="admin">
      <Container>{ok ? <Panel /> : <Gate onOk={() => setOk(true)} />}</Container>
    </section>
  )
}
