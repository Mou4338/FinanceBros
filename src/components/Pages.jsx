import { Container, Row, Col, Button } from 'react-bootstrap'
import { SERVICES } from './Services.jsx'
import { LeadForm } from './Sections.jsx'
import { IG_URL } from './Header.jsx'
import { openTool } from '../utils/toolNav.js'
import { useStore } from '../services/store.jsx'
import { ARTICLES, LEARN_SERVICES } from './Learn.jsx'

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

/* Home: intro (who we are) */
export function HomeIntro() {
  const pillars = [
    ['bi-calculator', 'Understand', 'Free calculators and a health check show where you stand.'],
    ['bi-chat-square-text', 'Decide', 'Talk it through with an expert before you sign anything.'],
    ['bi-graph-up-arrow', 'Grow', 'Regular reviews as your income and goals change.'],
  ]
  return (
    <section className="section intro" id="intro">
      <Container>
        <Row className="g-5 align-items-center">
          <Col lg={6}>
            <span className="eyebrow"><i className="bi bi-hand-thumbs-up" />Welcome to Finance Bros</span>
            <h2 className="section-title mb-3">Money made simple, by two brothers who do this for a living.</h2>
            <p className="lead-sm mb-4">
              Loans, SIPs, insurance, tax — most people decide without anyone explaining the numbers honestly.
              We're a Chartered Accountant and an MBA who started explaining money in plain Hinglish on Instagram,
              and built Finance Bros so you can get that same clarity for your own finances.
            </p>
            <div className="intro-pillars mb-4">
              {pillars.map(([i, t, d], n) => (
                <div className="pillar" key={t}>
                  <span className="pillar-n">{n + 1}</span>
                  <div><div className="fw-bold"><i className={`bi ${i} me-2 text-olive`} />{t}</div><div className="small" style={{ color: 'var(--muted)' }}>{d}</div></div>
                </div>
              ))}
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Button className="btn-olive" href="#about">Meet the founders <i className="bi bi-arrow-right ms-1" /></Button>
              <Button className="btn-ghost" href="#services">Explore services</Button>
            </div>
          </Col>
          <Col lg={6}>
            <div className="intro-card">
              <div className="small fw-semibold mb-3" style={{ color: '#A9B0AB' }}>Founded by</div>
              {[
                ['CA', 'Chartered Accountant', 'Tax, accounts, loan documentation and compliance — done by the book.'],
                ['MBA', 'Management & strategy', 'Goal-based planning, investing and comparing options like a business case.'],
              ].map(([b, t, d]) => (
                <div className="intro-row" key={b}>
                  <span className="intro-badge">{b}</span>
                  <div><div className="fw-bold text-white">{t}</div><div className="small" style={{ color: '#A9B0AB' }}>{d}</div></div>
                </div>
              ))}
              <a className="intro-ig" href={IG_URL} target="_blank" rel="noreferrer">
                <i className="bi bi-instagram" />
                <span><strong>@finance.bros.in</strong><small>Simple Hinglish explainers on loans, SIPs and markets</small></span>
                <i className="bi bi-arrow-up-right ms-auto" />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

/* Home: callback form (closing section) */
export function HomeForm({ onDone }) {
  return (
    <section className="section bg-olive-50" id="callback">
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
  const { data } = useStore()
  const fromPrice = (k) => {
    const ps = data.plans.filter((p) => p.service === k && Number(p.price) > 0).map((p) => Number(p.price))
    return ps.length ? Math.min(...ps) : null
  }
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
                <span className="d-flex justify-content-between align-items-center mt-3 gap-2 flex-wrap">
                  <span className="small fw-bold text-olive">Explore <i className="bi bi-arrow-right" /></span>
                  {fromPrice(s.key) && <span className="item-price mt-0">From ₹{fromPrice(s.key).toLocaleString('en-IN')}</span>}
                </span>
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
    ['emi', 'bi-house-door', 'EMI calculator', 'Monthly EMI, total interest, yearly breakdown'],
    ['tax', 'bi-receipt', 'Old vs new tax regime', 'FY 2026-27 slabs, on your numbers'],
    ['sip', 'bi-graph-up-arrow', 'SIP & lumpsum', 'Including step-up SIP'],
    ['prepay', 'bi-skip-forward', 'Loan prepayment', 'Interest and years you save'],
    ['retire', 'bi-sunset', 'Retirement', 'Corpus and monthly SIP needed'],
    ['health', 'bi-heart-pulse', 'Portfolio health check', 'Score out of 100 in a minute'],
  ]
  return (
    <section className="section pt-0">
      <Container>
        <div className="tools-band">
          <Row className="g-4 align-items-center">
            <Col lg={4}>
              <span className="eyebrow"><i className="bi bi-calculator" />38 free tools</span>
              <h2 className="section-title text-white mb-3">Run your numbers before you decide.</h2>
              <p className="mb-4" style={{ color: '#A9B0AB' }}>Free, private, and calculated in your browser.</p>
              <Button className="btn-lime" href="#calculators">Open calculators <i className="bi bi-arrow-right ms-1" /></Button>
            </Col>
            <Col lg={8}>
              <Row className="g-3">
                {tools.map(([k, i, t, d]) => (
                  <Col sm={6} key={t}>
                    <a className="tool-tile" href={k === 'health' ? '#health-check' : '#calculators'} onClick={(e) => { if (k !== 'health') { e.preventDefault(); openTool(k) } }}>
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

/* Home: help for life events */
const EVENTS = [
  ['bi-cash-coin', 'First salary', 'Budget, emergency fund and your first SIP, set up the right way from month one.', 'budget', 'Budget planner', 'Financial planning'],
  ['bi-house-heart', 'Buying a home', 'How much you can really afford, the best loan offer and the true cost of the EMI.', 'afford', 'Home affordability', 'Home loan'],
  ['bi-heart', 'Getting married', 'Merge money goals, plan the wedding budget and update nominees and insurance.', 'goal', 'Savings goal', 'Financial planning'],
  ['bi-balloon-heart', 'A new baby', 'Term and health cover for the family, and a plan for education costs.', 'child', 'Child education', 'Insurance'],
  ['bi-briefcase', 'Changing jobs', 'Transfer your EPF (don’t withdraw), check gratuity, and update your SIPs.', 'gratuity', 'Gratuity', 'Financial planning'],
  ['bi-ladder', 'Stuck in debt', 'An order to repay cards and loans that costs the least, and options to lower rates.', 'debtplan', 'Debt payoff planner', 'Personal loan'],
  ['bi-gift', 'Bonus or windfall', 'Prepay a loan, invest a lump sum, or both? Compare on your numbers.', 'prepay', 'Prepayment savings', 'SIP & mutual funds'],
  ['bi-sunset', 'Nearing retirement', 'Your retirement number, and a steady monthly income from your savings.', 'swp', 'SWP monthly income', 'Financial planning'],
]
export function HomeLifeEvents({ onBook }) {
  return (
    <section className="section">
      <Container>
        <Row className="align-items-end g-3 mb-4">
          <Col lg={8}>
            <span className="eyebrow"><i className="bi bi-signpost" />Life moments</span>
            <h2 className="section-title mb-2">Big money decision coming up? Start here.</h2>
            <p className="lead-sm mb-0">Every life stage has a few money moves that matter most. Try the free tool, or talk it through with us.</p>
          </Col>
        </Row>
        <Row className="g-3">
          {EVENTS.map(([icon, t, d, tool, toolName, topic]) => (
            <Col sm={6} lg={3} key={t}>
              <div className="event-card">
                <span className="feature-icon"><i className={`bi ${icon}`} /></span>
                <h3 className="h6 fw-bold mt-3 mb-1">{t}</h3>
                <p className="small mb-3" style={{ color: 'var(--muted)' }}>{d}</p>
                <div className="d-flex flex-wrap gap-2 mt-auto">
                  <button type="button" className="ev-link" onClick={() => openTool(tool)}><i className="bi bi-calculator me-1" />{toolName}</button>
                  <button type="button" className="ev-link" onClick={() => onBook(topic)}><i className="bi bi-telephone me-1" />Talk to us</button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

/* Home: how we compare */
const COMPARE = [
  ['Explains the numbers in plain Hinglish', 'yes', 'some', 'no'],
  ['Free calculators before you pay anything', 'yes', 'no', 'some'],
  ['Compares options across banks and fund houses', 'yes', 'no', 'some'],
  ['Shows total cost (fees, interest) up front', 'yes', 'some', 'some'],
  ['Fees and commissions disclosed before you act', 'yes', 'some', 'na'],
  ['A plan for all your goals, not one product', 'yes', 'no', 'some'],
]
const MARK = { yes: ['bi-check-circle-fill', 'Yes', 'c-yes'], some: ['bi-dash-circle', 'Sometimes', 'c-some'], no: ['bi-x-circle', 'Rarely', 'c-no'], na: ['bi-dash', '—', 'c-some'] }
export function HomeCompare() {
  return (
    <section className="section bg-olive-50">
      <Container>
        <Row className="g-5 align-items-center">
          <Col lg={4}>
            <span className="eyebrow"><i className="bi bi-columns-gap" />Why people choose us</span>
            <h2 className="section-title mb-3">Independent help, not a sales desk.</h2>
            <p className="lead-sm mb-0">A bank relationship manager usually offers that bank's products. Doing it alone means hours of research. We sit in between: clear numbers, options compared, and fees shown before you decide.</p>
          </Col>
          <Col lg={8}>
            <div className="compare-wrap scroll">
              <table className="table compare-table mb-0">
                <thead><tr><th></th><th className="hl">Finance Bros</th><th>Bank relationship manager</th><th>Doing it alone</th></tr></thead>
                <tbody>
                  {COMPARE.map(([row, ...cells]) => (
                    <tr key={row}>
                      <td className="fw-semibold">{row}</td>
                      {cells.map((c, i) => { const [ic, label, cls] = MARK[c]; return <td key={i} className={i === 0 ? 'hl' : ''}><span className={cls}><i className={`bi ${ic} me-1`} />{label}</span></td> })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="small mt-2 mb-0" style={{ color: 'var(--muted)' }}>A general comparison of typical experiences, not a rating of any specific bank or person.</p>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

/* Home: latest guides */
const PICKS = ['regime', 'sip-basics', 'emi-truth']
export function HomeGuides() {
  const picks = PICKS.map((id) => ARTICLES.find((a) => a.id === id)).filter(Boolean)
  const list = picks.length === 3 ? picks : ARTICLES.slice(0, 3)
  const svc = (k) => LEARN_SERVICES.find((s) => s.key === k)
  return (
    <section className="section">
      <Container>
        <Row className="align-items-end g-3 mb-4">
          <Col lg={8}>
            <span className="eyebrow"><i className="bi bi-book" />Learning centre · {ARTICLES.length} guides</span>
            <h2 className="section-title mb-0">Popular guides this month</h2>
          </Col>
          <Col lg={4} className="text-lg-end"><Button className="btn-ghost" href="#learn">All guides <i className="bi bi-arrow-right ms-1" /></Button></Col>
        </Row>
        <Row className="g-4">
          {list.map((a) => (
            <Col md={4} key={a.id}>
              <a className="guide d-block text-decoration-none" href="#learn">
                <span className="small fw-semibold d-block" style={{ color: 'var(--c-forest)' }}><i className={`bi ${svc(a.service)?.icon} me-1`} />{svc(a.service)?.title} · {a.min} min read</span>
                <span className="h5 d-block mt-2 mb-2">{a.title}</span>
                <span className="small d-block" style={{ color: 'var(--muted)' }}>{a.sum}</span>
                <span className="fw-bold small text-olive mt-3 d-inline-block">Read in the learning centre <i className="bi bi-arrow-right" /></span>
              </a>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}
