import { Container, Row, Col, Button } from 'react-bootstrap'
import { SERVICES } from './Services.jsx'
import { LeadForm } from './Sections.jsx'

/* Banner at the top of every inner page */
export function PageHeader({ crumb, title, sub, icon }) {
  return (
    <header className="page-header">
      <svg className="ph-shapes" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="0,0 560,0 0,260" fill="#1F7A45" opacity=".95" />
        <polygon points="0,0 280,0 0,130" fill="#15603A" opacity=".7" />
        <polygon points="1440,260 1440,60 1120,260" fill="#2A2F2C" />
      </svg>
      <Container className="position-relative">
        <nav aria-label="Breadcrumb" className="ph-crumb"><a href="#home">Home</a><i className="bi bi-chevron-right" /><span>{crumb}</span></nav>
        <h1 className="ph-title">{icon && <i className={`bi ${icon} me-3`} />}{title}</h1>
        {sub && <p className="ph-sub">{sub}</p>}
      </Container>
    </header>
  )
}

/* Home: callback form */
export function HomeForm({ onDone }) {
  return (
    <section className="section" id="callback">
      <Container>
        <Row className="g-5 align-items-center">
          <Col lg={5}>
            <span className="eyebrow"><i className="bi bi-telephone-inbound" />Free callback</span>
            <h2 className="section-title mb-3">Tell us what you need. We'll call you back.</h2>
            <p className="lead-sm mb-4">Share a few details and a Finance Bros expert will call within one working day — no obligation, no spam.</p>
            <div className="d-grid gap-3">
              {[
                ['bi-lightning-charge', 'Quick', 'Takes under a minute to fill.'],
                ['bi-shield-lock', 'Private', 'No PAN, Aadhaar or bank details needed.'],
                ['bi-translate', 'Your language', 'Hindi, English or Hinglish.'],
              ].map(([i, t, d]) => (
                <div className="d-flex gap-3 align-items-center" key={t}>
                  <span className="feature-icon"><i className={`bi ${i}`} /></span>
                  <div><div className="fw-bold">{t}</div><div className="small" style={{ color: 'var(--muted)' }}>{d}</div></div>
                </div>
              ))}
            </div>
          </Col>
          <Col lg={7}>
            <div className="contact-card"><LeadForm onDone={onDone} compact /></div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

/* Home: services overview cards */
export function HomeServices({ setService }) {
  return (
    <section className="section bg-olive-50">
      <Container>
        <Row className="align-items-end g-3 mb-4">
          <Col lg={8}>
            <span className="eyebrow"><i className="bi bi-grid" />What we do</span>
            <h2 className="section-title mb-0">Everything your money needs, in one place.</h2>
          </Col>
          <Col lg={4} className="text-lg-end"><Button className="btn-ghost" href="#services">All services <i className="bi bi-arrow-right ms-1" /></Button></Col>
        </Row>
        <Row className="g-3">
          {SERVICES.map((s) => (
            <Col md={6} xl key={s.key}>
              <a className="svc-card" href="#services" onClick={() => setService(s.key)}>
                <span className="feature-icon"><i className={`bi ${s.icon}`} /></span>
                <span className="h5 d-block mt-3 mb-2">{s.title}</span>
                <span className="small d-block" style={{ color: 'var(--muted)' }}>{s.intro}</span>
                <span className="small fw-bold text-olive mt-3 d-inline-block">Explore <i className="bi bi-arrow-right" /></span>
              </a>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

/* Home: calculator shortcuts */
export function HomeTools() {
  const tools = [
    ['bi-house-door', 'EMI calculator', 'Monthly EMI, total interest, yearly breakdown'],
    ['bi-graph-up-arrow', 'SIP & lumpsum', 'Including step-up SIP'],
    ['bi-patch-check', 'Loan eligibility', 'How much you can borrow'],
    ['bi-sunset', 'Retirement', 'Corpus and monthly SIP needed'],
    ['bi-wallet2', 'Budget 50/30/20', 'Needs, wants and savings'],
    ['bi-heart-pulse', 'Portfolio health check', 'Score out of 100 in a minute'],
  ]
  return (
    <section className="section pt-0">
      <Container>
        <div className="tools-band">
          <Row className="g-4 align-items-center">
            <Col lg={4}>
              <span className="eyebrow"><i className="bi bi-calculator" />Free tools</span>
              <h2 className="section-title text-white mb-3">Run your numbers before you decide.</h2>
              <p className="mb-4" style={{ color: '#A9B0AB' }}>Free, private, and calculated in your browser.</p>
              <Button className="btn-lime" href="#calculators">Open calculators <i className="bi bi-arrow-right ms-1" /></Button>
            </Col>
            <Col lg={8}>
              <Row className="g-3">
                {tools.map(([i, t, d]) => (
                  <Col sm={6} key={t}>
                    <a className="tool-tile" href={t.includes('health') ? '#health-check' : '#calculators'}>
                      <i className={`bi ${i}`} />
                      <span><strong>{t}</strong><small>{d}</small></span>
                      <i className="bi bi-arrow-up-right ms-auto arrow" />
                    </a>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  )
}

/* Closing call-to-action used at the bottom of inner pages */
export function PageCta({ onBook }) {
  return (
    <section className="pb-5">
      <Container>
        <div className="cta-band p-4 p-md-5">
          <svg className="position-absolute end-0 top-0 h-100 d-none d-md-block" viewBox="0 0 300 300" preserveAspectRatio="xMaxYMid slice" aria-hidden="true" style={{ width: '40%' }}>
            <polygon points="120,0 300,0 300,300 0,300" fill="#1F7A45" /><polygon points="200,0 230,0 130,300 100,300" fill="#8CC9A0" />
          </svg>
          <Row className="position-relative align-items-center g-3">
            <Col md={7}>
              <h2 className="section-title mb-2">Not sure where to start?</h2>
              <p className="mb-0" style={{ color: '#E4E8E5' }}>Book a free 15-minute intro call. We'll tell you honestly whether you need a paid session at all.</p>
            </Col>
            <Col md={5} className="text-md-end"><Button className="btn-lime" size="lg" onClick={onBook}>Book a free call <i className="bi bi-arrow-right ms-1" /></Button></Col>
          </Row>
        </div>
      </Container>
    </section>
  )
}
