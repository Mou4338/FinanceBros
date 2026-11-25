import { useState } from 'react'
import { Container, Row, Col, Button, Accordion, Form, Badge } from 'react-bootstrap'
import { Brand, IG_URL } from './Header.jsx'
import { useStore, SERVICE_OPTIONS } from '../services/store.jsx'
import { WhyWeAsk } from './Booking.jsx'

/* ---------- How it works ---------- */
const STEPS = [
  ['Use a free tool', 'Start with an EMI, SIP or retirement calculator.'],
  ['Take the assessment', 'Share income, goals and holdings in 3 minutes.'],
  ['Get your health report', 'An indicative score with clear observations.'],
  ['Talk to an expert', 'Book a call; we review your numbers with you.'],
  ['Follow up & review', 'Quarterly check-ins as life and markets change.'],
]
export function Journey() {
  return (
    <section className="section" id="how">
      <Container>
        <div className="text-center mb-5">
          <span className="eyebrow"><i className="bi bi-signpost-split" />How it works</span>
          <h2 className="section-title mx-auto" style={{ maxWidth: 720 }}>From confused to confident in five steps.</h2>
        </div>
        <Row className="g-3 row-cols-1 row-cols-sm-2 row-cols-lg-5">
          {STEPS.map(([t, d], i) => (
            <Col key={t}>
              <div className="step">
                <div className="n">{i + 1}</div>
                <h5 className="h6 fw-bold">{t}</h5>
                <p className="small mb-0" style={{ color: 'var(--muted)' }}>{d}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

/* ---------- Pricing ---------- */
const PRICE_SERVICES = [
  ['loans', 'Loans & credit', 'bi-bank', 'Home loan'],
  ['sip', 'SIP & mutual funds', 'bi-graph-up-arrow', 'SIP & mutual funds'],
  ['wealth', 'Investment & portfolio', 'bi-pie-chart', 'Portfolio review'],
  ['planning', 'Financial planning', 'bi-clipboard-check', 'Financial planning'],
  ['insurance', 'Insurance & tax', 'bi-shield-check', 'Insurance'],
]
// older databases may not have `service` yet
const LEGACY_SERVICE = { free: 'all', consult: 'planning', report: 'wealth', annual: 'planning' }
const TOPIC_BY_PLAN = { 'tax-check': 'Tax / ITR', itr: 'Tax / ITR', 'itr-cg': 'Tax / ITR', notice: 'Tax / ITR', 'credit-fix': 'Credit card / score' }

function PlanCard({ p, onBook, topic }) {
  return (
    <div className={`price-card ${p.featured ? 'featured' : ''}`}>
      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
        <h4 className="h5 mb-0">{p.name}</h4>
        {p.featured && <span className="badge tag-lime">Most booked</span>}
      </div>
      <div className="price">{(p.fromPrice || p.id === 'itr') && <small className="me-1">from</small>}₹{Number(p.price).toLocaleString('en-IN')} <small>{p.per}</small></div>
      <p className="small mb-0" style={{ opacity: .8 }}>{p.d}</p>
      <ul>{(p.f || []).map((x) => <li key={x}><i className="bi bi-check-lg" />{x}</li>)}</ul>
      <Button className={`${p.featured ? 'btn-lime' : 'btn-olive'} w-100`} onClick={() => onBook(TOPIC_BY_PLAN[p.id] || topic)}>Book this</Button>
    </div>
  )
}

export function Pricing({ onBook }) {
  const { data } = useStore()
  const [svc, setSvc] = useState('all')
  const plans = [...data.plans].map((p) => ({ ...p, service: p.service || LEGACY_SERVICE[p.id] || 'planning' })).sort((a, b) => (a.sort ?? 99) - (b.sort ?? 99))
  const free = plans.find((p) => p.service === 'all')
  const shown = PRICE_SERVICES.filter(([k]) => svc === 'all' || svc === k)
  return (
    <section className="section bg-olive-50" id="pricing">
      <Container>
        <div className="text-center mb-4">
          <span className="eyebrow"><i className="bi bi-tag" />Transparent pricing</span>
          <h2 className="section-title">Simple fees for every service.</h2>
          <p className="lead-sm mx-auto">Start free. Pay only for the help you choose. Any commission or partner fee is disclosed before you act.</p>
        </div>

        {free && (
          <div className="free-strip mb-4">
            <div className="d-flex align-items-center gap-3">
              <span className="feature-icon"><i className="bi bi-gift" /></span>
              <div><div className="fw-bold">Free, always: ₹0</div><div className="small" style={{ color: 'var(--muted)' }}>{free.f.join(' · ')}</div></div>
            </div>
            <Button className="btn-ghost" href="#calculators">Start free <i className="bi bi-arrow-right" /></Button>
          </div>
        )}

        <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
          <button type="button" className={`chip ${svc === 'all' ? 'on' : ''}`} onClick={() => setSvc('all')} aria-pressed={svc === 'all'}>All services</button>
          {PRICE_SERVICES.map(([k, t, icon]) => (
            <button type="button" key={k} className={`chip ${svc === k ? 'on' : ''}`} onClick={() => setSvc(k)} aria-pressed={svc === k}><i className={`bi ${icon} me-1`} />{t}</button>
          ))}
        </div>

        {shown.map(([k, title, icon, topic]) => {
          const list = plans.filter((p) => p.service === k)
          if (!list.length) return null
          return (
            <div className="mb-5" key={k}>
              <h3 className="h4 mb-3 d-flex align-items-center gap-2"><span className="feature-icon" style={{ width: 38, height: 38, fontSize: '1rem' }}><i className={`bi ${icon}`} /></span>{title}</h3>
              <Row className="g-4">
                {list.map((p) => <Col md={6} xl={4} key={p.id}><PlanCard p={p} onBook={onBook} topic={topic} /></Col>)}
              </Row>
            </div>
          )
        })}
        <p className="text-center small mb-0" style={{ color: 'var(--muted)' }}>Prices include GST where applicable. Launch pricing, which may change.</p>
      </Container>
    </section>
  )
}

/* ---------- FAQ ---------- */
const FAQS = [
  ['Are the calculators really free?', 'Yes. Every calculator and the basic health check are free and run in your browser. We do not store what you type there.'],
  ['Do you give personalised investment advice?', 'Personalised investment advice is provided only through a SEBI-registered Investment Adviser. Our mutual fund comparisons and content are educational. When we act as a mutual fund distributor (AMFI ARN), we say so clearly.'],
  ['Will checking loan eligibility affect my credit score?', 'No. Our eligibility calculator only uses the numbers you enter. A lender checks your credit report only when you formally apply, and only with your consent.'],
  ['How do you earn money?', 'Through consultation and report fees, and — where applicable — disclosed referral fees from partner lenders or commissions as a distributor. You always see these before you decide.'],
  ['Is my data safe?', 'We collect only what is needed for your request, store it securely, never sell it, and you can ask us to delete it at any time.'],
  ['Can I talk in Hindi?', 'Haan, bilkul! Consultations are available in Hindi, English and Hinglish.'],
]
export function Faq() {
  return (
    <section className="section" id="faq">
      <Container>
        <Row className="g-5">
          <Col lg={4}>
            <span className="eyebrow"><i className="bi bi-question-circle" />FAQ</span>
            <h2 className="section-title mb-3">Questions, answered.</h2>
            <p className="lead-sm">Still unsure? DM us on Instagram or send a message below.</p>
            <Button className="btn-ghost" href={IG_URL} target="_blank" rel="noreferrer"><i className="bi bi-instagram me-2" />@finance.bros.in</Button>
          </Col>
          <Col lg={8}>
            <Accordion defaultActiveKey="0">
              {FAQS.map(([q, a], i) => (
                <Accordion.Item eventKey={String(i)} key={q}>
                  <Accordion.Header>{q}</Accordion.Header>
                  <Accordion.Body style={{ color: 'var(--muted)' }}>{a}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

/* ---------- Contact / lead form ---------- */
export const TOPICS = SERVICE_OPTIONS

// keep only digits; turn "+91 98765 43210" or "098765 43210" into "9876543210"
const cleanPhone = (e) => {
  let d = e.target.value.replace(/\D/g, '')
  if (d.length > 10 && d.startsWith('91')) d = d.slice(2)
  if (d.length > 10 && d.startsWith('0')) d = d.slice(1)
  e.target.value = d.slice(0, 10)
}

export function LeadForm({ defaultTopic = '', onDone, compact = false }) {
  const [validated, setValidated] = useState(false)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null) // {ok, text}
  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    setResult(null)
    if (!form.checkValidity()) {
      setValidated(true)
      setResult({ ok: false, text: 'Please fix the fields marked in red above.' })
      return
    }
    const data = Object.fromEntries(new FormData(form))
    setBusy(true)
    try {
      const msg = await onDone(data)
      setResult({ ok: true, text: msg || 'Thanks! Your request has been received.' })
      form.reset(); setValidated(false)
    } catch (x) {
      console.error('[Finance Bros] form submit failed:', x)
      setResult({ ok: false, text: `Sorry, we couldn't send that: ${x.message || x}. Please try again or WhatsApp us.` })
    } finally { setBusy(false) }
  }
  return (
    <Form noValidate validated={validated} onSubmit={submit}>
      <Row className="g-3">
        <Col sm={6}><Form.Label htmlFor="lf-name">Full name</Form.Label><Form.Control id="lf-name" name="name" required placeholder="e.g. Rahul Sharma" /><Form.Control.Feedback type="invalid">Please enter your name.</Form.Control.Feedback></Col>
        <Col sm={6}><Form.Label htmlFor="lf-phone">Mobile number</Form.Label><Form.Control id="lf-phone" name="phone" type="tel" inputMode="numeric" required pattern="[6-9][0-9]{9}" placeholder="10-digit mobile" onInput={cleanPhone} /><Form.Control.Feedback type="invalid">Enter a valid 10-digit Indian mobile number.</Form.Control.Feedback></Col>
        <Col sm={6}><Form.Label htmlFor="lf-email">Email</Form.Label><Form.Control id="lf-email" name="email" type="email" required placeholder="you@email.com" /><Form.Control.Feedback type="invalid">Enter a valid email.</Form.Control.Feedback></Col>
        <Col sm={6}><Form.Label htmlFor="lf-city">City</Form.Label><Form.Control id="lf-city" name="city" placeholder="e.g. Pune" /></Col>
        <Col sm={6}>
          <Form.Label htmlFor="lf-topic">I need help with</Form.Label>
          <Form.Select id="lf-topic" name="topic" required defaultValue={TOPICS.includes(defaultTopic) ? defaultTopic : ''} key={defaultTopic}>
            <option value="" disabled>Choose a topic</option>
            {TOPICS.map((t) => <option key={t}>{t}</option>)}
          </Form.Select>
          <Form.Control.Feedback type="invalid">Pick a topic.</Form.Control.Feedback>
        </Col>
        <Col sm={6}>
          <Form.Label htmlFor="lf-emp">Employment</Form.Label>
          <Form.Select id="lf-emp" name="employment" defaultValue="Salaried">
            <option>Salaried</option><option>Self-employed</option><option>Business owner</option><option>Student</option><option>Retired</option>
          </Form.Select>
        </Col>
        {!compact && (
          <>
            <Col sm={6}>
              <Form.Label htmlFor="lf-inc">Monthly income range</Form.Label>
              <Form.Select id="lf-inc" name="income" defaultValue="">
                <option value="">Prefer not to say</option><option>Below ₹30,000</option><option>₹30,000–₹75,000</option><option>₹75,000–₹1.5 L</option><option>Above ₹1.5 L</option>
              </Form.Select>
            </Col>
            <Col sm={6}>
              <Form.Label htmlFor="lf-time">Preferred call time</Form.Label>
              <Form.Select id="lf-time" name="time" defaultValue="Evening (5–8 pm)">
                <option>Morning (10 am–1 pm)</option><option>Afternoon (1–5 pm)</option><option>Evening (5–8 pm)</option>
              </Form.Select>
            </Col>
          </>
        )}
        <Col xs={12}><Form.Label htmlFor="lf-msg">Message (optional)</Form.Label><Form.Control id="lf-msg" name="message" as="textarea" rows={compact ? 2 : 3} placeholder="Tell us briefly what you need" /></Col>
        <Col xs={12}><WhyWeAsk /></Col>
        <Col xs={12}>
          <Form.Check id="lf-consent" name="consent" required type="checkbox"
            label="I agree to be contacted by Finance Bros on phone, WhatsApp or email about my request, and I accept the Privacy Policy."
            feedback="Please give consent so we can contact you." feedbackType="invalid" />
        </Col>
        <Col xs={12}>
          <Button type="submit" className="btn-olive w-100" size="lg" disabled={busy}>
            {busy ? <><span className="spinner-border spinner-border-sm me-2" />Sending…</> : <><i className="bi bi-send me-2" />Request a callback</>}
          </Button>
          {result && <div className={`form-result ${result.ok ? 'ok' : 'err'}`} role="status"><i className={`bi ${result.ok ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`} />{result.text}</div>}
        </Col>
      </Row>
    </Form>
  )
}

export function Contact({ onDone }) {
  return (
    <section className="section bg-olive-50" id="contact">
      <Container>
        <Row className="g-4">
          <Col lg={5}>
            <span className="eyebrow"><i className="bi bi-chat-dots" />Contact us</span>
            <h2 className="section-title mb-3">Let's talk about your money.</h2>
            <p className="lead-sm mb-4">Share a few details and we'll call you back within one working day.</p>
            <div className="d-grid gap-3">
              {[
                ['bi-telephone', 'Call / WhatsApp', '+91 90000 00000'],
                ['bi-envelope', 'Email', 'hello@financebros.in'],
                ['bi-instagram', 'Instagram', '@finance.bros.in'],
                ['bi-clock', 'Hours', 'Mon–Sat, 10 am – 8 pm IST'],
              ].map(([i, t, v]) => (
                <div className="d-flex gap-3 align-items-center" key={t}>
                  <span className="feature-icon"><i className={`bi ${i}`} /></span>
                  <div><div className="small fw-semibold" style={{ color: 'var(--muted)' }}>{t}</div><div className="fw-bold">{v}</div></div>
                </div>
              ))}
            </div>
          </Col>
          <Col lg={7}>
            <div className="contact-card"><LeadForm onDone={onDone} /></div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

/* ---------- Footer ---------- */
function ModeBadge() {
  const { mode } = useStore()
  return <span className={`mode-badge ${mode}`} title={mode === 'live' ? 'Connected to the database' : 'Data is saved in this browser only'}>{mode === 'live' ? '● Live' : '● Demo mode'}</span>
}

export function Footer({ onLegal }) {
  const cols = {
    Services: ['Loans & credit', 'SIP & mutual funds', 'Portfolio review', 'Financial planning', 'Insurance & tax'],
    Tools: ['EMI calculator', 'SIP calculator', 'Loan eligibility', 'Retirement planner', 'Emergency fund'],
    Company: ['About us', 'Learning centre', 'Pricing', 'Contact', 'My account', 'Admin'],
    Legal: ['Privacy policy', 'Terms of use', 'Disclosures'],
  }
  const href = { Services: '#services', Tools: '#tools', Company: '#contact', Legal: '#disclosures' }
  const special = { 'About us': '#about', 'Learning centre': '#learn', Pricing: '#pricing', 'My account': '#account', Admin: '#admin' }
  const legalKey = { 'Privacy policy': 'privacy', 'Terms of use': 'terms', Disclosures: 'disclosures' }
  return (
    <footer className="footer pt-5">
      <Container>
        <Row className="g-4 pb-4">
          <Col lg={4}>
            <div className="mb-3"><Brand /></div>
            <p className="small">Money, made simple. Loans, SIPs, planning and protection — explained clearly for every Indian earner.</p>
            <div className="social d-flex gap-2">
              <a href={IG_URL} target="_blank" rel="noreferrer" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              <a href="#contact" aria-label="WhatsApp"><i className="bi bi-whatsapp" /></a>
              <a href="#contact" aria-label="YouTube"><i className="bi bi-youtube" /></a>
              <a href="#contact" aria-label="LinkedIn"><i className="bi bi-linkedin" /></a>
            </div>
          </Col>
          {Object.entries(cols).map(([h, list]) => (
            <Col xs={6} md={3} lg={2} key={h}>
              <h6>{h}</h6>
              <ul className="list-unstyled d-grid gap-2 small mb-0">{list.map((l) => <li key={l}>{legalKey[l] ? <button type="button" className="linkish" onClick={() => onLegal(legalKey[l])}>{l}</button> : <a href={special[l] || href[h]}>{l}</a>}</li>)}</ul>
            </Col>
          ))}
        </Row>
        <div className="disclaimer py-4" id="disclosures">
          <p className="mb-2"><strong className="text-white">Disclosures.</strong> Mutual fund investments are subject to market risks; read all scheme-related documents carefully. Past performance does not guarantee future returns. Calculator results are illustrative and based on assumed rates.</p>
          <p className="mb-2">Personalised investment advice is offered only through a SEBI-registered Investment Adviser. Mutual fund distribution, where offered, is under an AMFI-registered ARN and is kept separate from advisory services. Loans are provided by RBI-regulated banks and NBFCs; Finance Bros is not a lender. Insurance is distributed through IRDAI-licensed intermediaries.</p>
          <p className="mb-0 d-flex flex-wrap gap-2 align-items-center">© {new Date().getFullYear()} Finance Bros. All rights reserved.<ModeBadge /></p>
        </div>
      </Container>
    </footer>
  )
}
