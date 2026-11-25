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
export function Pricing({ onBook }) {
  const { data } = useStore()
  const PLANS = data.plans.map((p) => ({ ...p, price: p.price ? '₹' + p.price.toLocaleString('en-IN') : '₹0', cta: { free: 'Start free', consult: 'Book a session', report: 'Get my report', annual: 'Join annual plan' }[p.id] || 'Book', href: p.id === 'free' ? '#tools' : undefined }))
  return (
    <section className="section bg-olive-50" id="pricing">
      <Container>
        <div className="text-center mb-5">
          <span className="eyebrow"><i className="bi bi-tag" />Transparent pricing</span>
          <h2 className="section-title">Simple fees. No surprises.</h2>
          <p className="lead-sm mx-auto">Any commission or partner compensation is disclosed before you act.</p>
        </div>
        <Row className="g-4">
          {PLANS.map((p) => (
            <Col md={6} xl={3} key={p.name}>
              <div className={`price-card ${p.featured ? 'featured' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="h5 mb-0">{p.name}</h3>
                  {p.featured && <Badge bg="" className="tag-lime" style={{ color: 'var(--olive-950)' }}>Most booked</Badge>}
                </div>
                <div className="price">{p.price} <small>{p.per}</small></div>
                <p className="small mb-0" style={{ opacity: .8 }}>{p.d}</p>
                <ul>{p.f.map((x) => <li key={x}><i className="bi bi-check-lg" />{x}</li>)}</ul>
                {p.href
                  ? <Button className="btn-ghost w-100" href={p.href}>{p.cta}</Button>
                  : <Button className={`${p.featured ? 'btn-lime' : 'btn-olive'} w-100`} onClick={() => onBook(p.name)}>{p.cta}</Button>}
              </div>
            </Col>
          ))}
        </Row>
        <p className="text-center small mt-4 mb-0" style={{ color: 'var(--muted)' }}>Prices include GST where applicable. Sample pricing for launch.</p>
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

export function LeadForm({ defaultTopic = '', onDone, compact = false }) {
  const [validated, setValidated] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) { setValidated(true); return }
    const data = Object.fromEntries(new FormData(form))
    onDone(data)
    form.reset(); setValidated(false)
  }
  return (
    <Form noValidate validated={validated} onSubmit={submit}>
      <Row className="g-3">
        <Col sm={6}><Form.Label htmlFor="lf-name">Full name</Form.Label><Form.Control id="lf-name" name="name" required placeholder="e.g. Rahul Sharma" /><Form.Control.Feedback type="invalid">Please enter your name.</Form.Control.Feedback></Col>
        <Col sm={6}><Form.Label htmlFor="lf-phone">Mobile number</Form.Label><Form.Control id="lf-phone" name="phone" type="tel" required pattern="[6-9][0-9]{9}" placeholder="10-digit mobile" /><Form.Control.Feedback type="invalid">Enter a valid 10-digit Indian mobile number.</Form.Control.Feedback></Col>
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
        <Col xs={12}><Button type="submit" className="btn-olive w-100" size="lg"><i className="bi bi-send me-2" />Request a callback</Button></Col>
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
          <p className="mb-0">© {new Date().getFullYear()} Finance Bros. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  )
}
