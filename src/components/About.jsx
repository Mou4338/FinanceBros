import { Container, Row, Col, Button } from 'react-bootstrap'
import { IG_URL } from './Header.jsx'

/*
  FOUNDERS — edit here.
  name:  leave '' to show the role title only; add the real name when ready
  photo: import an image (e.g. import caPhoto from '../assets/founder-ca.jpg') and set photo: caPhoto
*/
const FOUNDERS = [
  {
    name: '',
    role: 'Co-founder',
    degree: 'Chartered Accountant (CA)',
    badge: 'CA',
    icon: 'bi-journal-check',
    focus: ['Tax planning & regime choice', 'Reading financial statements', 'Loan documentation & eligibility', 'Compliance & disclosures'],
    note: 'Brings the rigour of the CA profession: numbers checked twice, tax rules applied correctly, and every recommendation backed by the paperwork.',
    photo: '',
  },
  {
    name: '',
    role: 'Co-founder',
    degree: 'MBA',
    badge: 'MBA',
    icon: 'bi-graph-up-arrow',
    focus: ['Investing & SIP strategy', 'Goal-based financial planning', 'Lender & partner relationships', 'Simple explainers on @finance.bros.in'],
    note: 'Brings a management lens: turning goals into a clear plan, comparing options like a business case, and explaining it all in plain Hinglish.',
    photo: '',
  },
]

const VALUES = [
  ['bi-eye', 'Transparent', 'Fees, partner arrangements and commissions are disclosed before you decide.'],
  ['bi-person-heart', 'Your interest first', 'We tell you when you don\'t need a product — or a paid session.'],
  ['bi-calculator', 'Numbers, not hype', 'Every suggestion starts with your actual income, EMIs and goals.'],
  ['bi-translate', 'Plain language', 'Hindi, English or Hinglish — no jargon, no fine-print surprises.'],
]

function Avatar({ f }) {
  if (f.photo) return <img src={f.photo} alt={f.name || f.degree} className="founder-photo" />
  return (
    <div className="founder-photo founder-mono" aria-hidden="true">
      <svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <rect width="200" height="200" fill="#1C201E" />
        <polygon points="0,0 120,0 0,150" fill="#1F7A45" opacity=".9" />
        <circle cx="100" cy="82" r="34" fill="#3A3F3C" />
        <path d="M38 200 q6 -70 62 -72 q56 2 62 72z" fill="#2A2F2C" />
        <path d="M88 132 h24 l-12 40z" fill="#E4E8E5" />
      </svg>
      <span className="founder-badge">{f.badge}</span>
    </div>
  )
}

export default function About({ onBook }) {
  return (
    <section className="section about" id="about">
      <Container>
        <Row className="g-5 align-items-center mb-5">
          <Col lg={6}>
            <span className="eyebrow"><i className="bi bi-people" />About us</span>
            <h2 className="section-title mb-3">Two brothers. One CA, one MBA. One mission.</h2>
            <p className="lead-sm mb-3">
              Finance Bros started with a simple frustration: friends and family were taking loans, buying policies and starting SIPs without anyone explaining the numbers to them honestly.
            </p>
            <p className="lead-sm mb-4">
              So we combined what we know best — a Chartered Accountant's discipline with tax, accounts and compliance, and an MBA's approach to planning and strategy — and started explaining money simply on <a href={IG_URL} target="_blank" rel="noreferrer">@finance.bros.in</a>. This website takes that one step further: free tools to understand your finances, and real experts when you need one.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Button className="btn-olive" onClick={onBook}>Talk to the founders' team <i className="bi bi-arrow-right ms-1" /></Button>
              <Button className="btn-ghost" href={IG_URL} target="_blank" rel="noreferrer"><i className="bi bi-instagram me-2" />Follow our explainers</Button>
            </div>
          </Col>
          <Col lg={6}>
            <div className="mission-card">
              <i className="bi bi-quote quote-mark" />
              <p className="mission-text">Our goal is simple: every Indian earner should understand their loan, their SIP and their plan <em>before</em> they sign anything.</p>
              <div className="d-flex align-items-center gap-2 mt-3">
                <span className="brand-mark" style={{ width: 34, height: 34, fontSize: '.8rem' }}>FB</span>
                <span className="fw-semibold small">The Finance Bros founders</span>
              </div>
              <div className="cred-row mt-4">
                <div><i className="bi bi-mortarboard" /><strong>CA</strong><span>Qualified Chartered Accountant</span></div>
                <div><i className="bi bi-briefcase" /><strong>MBA</strong><span>Management &amp; strategy</span></div>
                <div><i className="bi bi-people" /><strong>2</strong><span>Brothers, one family business</span></div>
              </div>
            </div>
          </Col>
        </Row>

        <h3 className="h4 mb-3">Meet the founders</h3>
        <Row className="g-4 mb-5">
          {FOUNDERS.map((f) => (
            <Col md={6} key={f.badge}>
              <article className="founder-card">
                <Avatar f={f} />
                <div className="founder-body">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                    <span className="tag"><i className={`bi ${f.icon} me-1`} />{f.degree}</span>
                  </div>
                  <h4 className="h5 mb-1">{f.name || `${f.role} · ${f.badge}`}</h4>
                  <p className="small mb-3" style={{ color: 'var(--muted)' }}>{f.note}</p>
                  <div className="small fw-bold mb-2">Leads on</div>
                  <ul className="founder-focus">{f.focus.map((x) => <li key={x}><i className="bi bi-check2" />{x}</li>)}</ul>
                </div>
              </article>
            </Col>
          ))}
        </Row>

        <Row className="g-3">
          {VALUES.map(([i, t, d]) => (
            <Col sm={6} lg={3} key={t}>
              <div className="value-card">
                <span className="feature-icon"><i className={`bi ${i}`} /></span>
                <h5 className="h6 fw-bold mt-3 mb-1">{t}</h5>
                <p className="small mb-0" style={{ color: 'var(--muted)' }}>{d}</p>
              </div>
            </Col>
          ))}
        </Row>
        <p className="small mt-4 mb-0" style={{ color: 'var(--muted)' }}>
          Professional qualifications are listed for transparency. Regulated services (investment advice, mutual fund distribution, lending and insurance) are provided only through appropriately registered entities, as set out in our Disclosures.
        </p>
      </Container>
    </section>
  )
}
