import { useEffect, useMemo, useState } from 'react'
import { Modal, Row, Col, Form, Button, Collapse } from 'react-bootstrap'
import { useStore, SERVICE_OPTIONS, fmtSlot } from '../services/store.jsx'

const SLOTS = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
const MODES = [['Phone call', 'bi-telephone'], ['Video call', 'bi-camera-video'], ['WhatsApp', 'bi-whatsapp']]

// Next 14 days, Monday–Saturday
function nextDays() {
  const out = []
  const d = new Date()
  while (out.length < 12) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) out.push(new Date(d))
  }
  return out
}
const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function WhyWeAsk() {
  const [open, setOpen] = useState(false)
  return (
    <div className="small">
      <button type="button" className="btn btn-link p-0 small fw-semibold" onClick={() => setOpen(!open)} aria-expanded={open}>
        <i className="bi bi-shield-check me-1" />Why we ask for these details
      </button>
      <Collapse in={open}>
        <div className="note mt-2">
          We use your name and mobile to call you back, your email for the confirmation, and your topic to route you to the right desk.
          We don't ask for PAN, Aadhaar, bank details or credit reports at this stage, and we never sell your data.
        </div>
      </Collapse>
    </div>
  )
}

export default function BookingModal({ show, onHide, topic, onBooked }) {
  const { user, addBooking, getTakenSlots, mode } = useStore()
  const days = useMemo(nextDays, [show])
  const [step, setStep] = useState(1)
  const [f, setF] = useState({})
  const [validated, setValidated] = useState(false)
  const [done, setDone] = useState(null)
  const [taken, setTaken] = useState([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (show) {
      setStep(1); setDone(null); setValidated(false); setErr('')
      setF({ service: SERVICE_OPTIONS.includes(topic) ? topic : '', mode: 'Phone call', date: key(days[0]), slot: '', name: user?.name || '', phone: user?.phone || '', email: user?.email || '', notes: '', consent: false })
    }
  }, [show]) // eslint-disable-line

  const set = (k) => (v) => setF((o) => ({ ...o, [k]: v }))
  useEffect(() => {
    let on = true
    if (show && f.date) getTakenSlots(f.date).then((t) => on && setTaken(t)).catch(() => on && setTaken([]))
    return () => { on = false }
  }, [show, f.date]) // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault()
    if (!e.currentTarget.checkValidity()) { setValidated(true); return }
    setBusy(true); setErr('')
    try {
      const rec = await addBooking({ service: f.service, mode: f.mode, date: f.date, slot: f.slot, name: f.name, phone: f.phone, email: f.email.trim().toLowerCase(), notes: f.notes })
      setDone(rec)
      onBooked?.(rec)
    } catch (x) { setErr(x.message || 'Something went wrong. Please try again.') } finally { setBusy(false) }
  }

  const steps = ['Topic', 'Date & time', 'Your details']
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0 px-4 pt-4">
        <Modal.Title className="fw-bold">{done ? 'Booking requested' : 'Book a consultation'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        {done ? (
          <div className="text-center py-3">
            <div className="feature-icon mx-auto mb-3" style={{ width: 64, height: 64, fontSize: '1.8rem' }}><i className="bi bi-calendar2-check" /></div>
            <h4 className="mb-1">Reference {done.ref}</h4>
            <p style={{ color: 'var(--muted)' }}>{done.service} · {done.mode} · {new Date(done.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}, {fmtSlot(done.slot)}</p>
            <div className="note text-start mb-3">Status: <strong>Requested</strong>. Our team confirms the slot by phone or WhatsApp. {user ? 'You can track it under My Account.' : 'Create a free account with the same email to track it.'}</div>
            {mode === 'demo' && <p className="small" style={{ color: 'var(--muted)' }}>Demo mode: the booking is saved in this browser only until the backend is connected.</p>}
            <div className="d-flex gap-2 justify-content-center flex-wrap">
              <Button className="btn-ghost" onClick={() => { navigator.clipboard?.writeText(done.ref).catch(() => {}) }}><i className="bi bi-clipboard me-2" />Copy reference</Button>
              <Button className="btn-olive" href="#account" onClick={onHide}>Go to My Account</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="steps-bar mb-4" aria-label="Booking steps">
              {steps.map((s, i) => (
                <div key={s} className={`sb ${step > i ? 'on' : ''}`}><span>{i + 1}</span>{s}</div>
              ))}
            </div>
            <Form noValidate validated={validated} onSubmit={submit}>
              {step === 1 && (
                <>
                  <Form.Label>What do you need help with?</Form.Label>
                  <div className="chip-grid mb-3">
                    {SERVICE_OPTIONS.map((s) => (
                      <button type="button" key={s} className={`chip ${f.service === s ? 'on' : ''}`} onClick={() => set('service')(s)} aria-pressed={f.service === s}>{s}</button>
                    ))}
                  </div>
                  <Form.Label>How should we talk?</Form.Label>
                  <Row className="g-2 mb-4">
                    {MODES.map(([m, i]) => (
                      <Col xs={4} key={m}>
                        <button type="button" className={`chip w-100 ${f.mode === m ? 'on' : ''}`} onClick={() => set('mode')(m)} aria-pressed={f.mode === m}><i className={`bi ${i} me-1`} />{m}</button>
                      </Col>
                    ))}
                  </Row>
                  <Button className="btn-olive w-100" disabled={!f.service} onClick={() => setStep(2)}>Continue</Button>
                </>
              )}
              {step === 2 && (
                <>
                  <Form.Label>Pick a day</Form.Label>
                  <div className="day-row mb-3">
                    {days.map((d) => (
                      <button type="button" key={key(d)} className={`day ${f.date === key(d) ? 'on' : ''}`} onClick={() => setF((o) => ({ ...o, date: key(d), slot: '' }))}>
                        <small>{d.toLocaleDateString('en-IN', { weekday: 'short' })}</small>
                        <strong>{d.getDate()}</strong>
                        <small>{d.toLocaleDateString('en-IN', { month: 'short' })}</small>
                      </button>
                    ))}
                  </div>
                  <Form.Label>Pick a time (IST)</Form.Label>
                  <div className="chip-grid mb-4">
                    {SLOTS.map((s) => {
                      const off = taken.includes(s)
                      return <button type="button" key={s} disabled={off} className={`chip ${f.slot === s ? 'on' : ''}`} onClick={() => set('slot')(s)}>{fmtSlot(s)}{off && ' · booked'}</button>
                    })}
                  </div>
                  <div className="d-flex gap-2">
                    <Button className="btn-ghost" onClick={() => setStep(1)}>Back</Button>
                    <Button className="btn-olive flex-grow-1" disabled={!f.slot} onClick={() => setStep(3)}>Continue</Button>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <Row className="g-3">
                    <Col sm={6}><Form.Label htmlFor="bk-name">Full name</Form.Label><Form.Control id="bk-name" required value={f.name} onChange={(e) => set('name')(e.target.value)} /><Form.Control.Feedback type="invalid">Please enter your name.</Form.Control.Feedback></Col>
                    <Col sm={6}><Form.Label htmlFor="bk-phone">Mobile number</Form.Label><Form.Control id="bk-phone" type="tel" required pattern="[6-9][0-9]{9}" value={f.phone} onChange={(e) => set('phone')(e.target.value)} placeholder="10-digit mobile" /><Form.Control.Feedback type="invalid">Enter a valid 10-digit Indian mobile number.</Form.Control.Feedback></Col>
                    <Col xs={12}><Form.Label htmlFor="bk-email">Email</Form.Label><Form.Control id="bk-email" type="email" required value={f.email} onChange={(e) => set('email')(e.target.value)} /><Form.Control.Feedback type="invalid">Enter a valid email.</Form.Control.Feedback></Col>
                    <Col xs={12}><Form.Label htmlFor="bk-notes">Anything we should know? (optional)</Form.Label><Form.Control id="bk-notes" as="textarea" rows={2} value={f.notes} onChange={(e) => set('notes')(e.target.value)} placeholder="e.g. Existing home loan at 9.2%, want to check balance transfer" /></Col>
                    <Col xs={12}><WhyWeAsk /></Col>
                    <Col xs={12}>
                      <Form.Check id="bk-consent" required checked={f.consent} onChange={(e) => set('consent')(e.target.checked)}
                        label="I agree to be contacted about this booking and accept the Privacy Policy." feedback="Consent is needed to book." feedbackType="invalid" />
                    </Col>
                  </Row>
                  {err && <div className="alert alert-danger py-2 mt-3 mb-0">{err}</div>}
                  <div className="summary-line my-3"><i className="bi bi-calendar-event me-2" />{f.service} · {f.mode} · {new Date(f.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}, {fmtSlot(f.slot)}</div>
                  <div className="d-flex gap-2">
                    <Button className="btn-ghost" onClick={() => setStep(2)}>Back</Button>
                    <Button type="submit" className="btn-olive flex-grow-1" disabled={busy}><i className="bi bi-check2-circle me-2" />{busy ? 'Booking…' : 'Confirm booking request'}</Button>
                  </div>
                </>
              )}
            </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}
