import { Container, Row, Col, ProgressBar } from 'react-bootstrap'
import { IG_URL } from './Header.jsx'

export function StatsStrip() {
  const stats = [
    ['₹0', 'to start — calculators & basic assessment are free'],
    ['25', 'free calculators, tools & checklists'],
    ['5', 'service verticals under one roof'],
    ['15 min', 'free intro call with an expert'],
  ]
  return (
    <div className="stats">
      <Container>
        <div className="stats-card">
          <Row className="g-0">
            {stats.map(([n, l]) => (
              <Col xs={6} md={3} key={n} className="stat">
                <div className="num">{n}</div>
                <div className="lbl">{l}</div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  )
}

const FEATURES = [
  ['bi-lightning-charge', 'Understand first, pay later', 'Free calculators and an indicative health report show where you stand before any paid session.'],
  ['bi-people', 'Independent & transparent', 'Fees, partner arrangements and commissions are disclosed up front. No hidden charges.'],
  ['bi-shield-lock', 'Privacy by default', 'We collect only what we need, never sell your data, and ask before every credit check.'],
]

export default function Features() {
  return (
    <section className="section" id="why-us">
      <Container>
        <Row className="g-5 align-items-center mb-5">
          <Col lg={6}>
            <span className="eyebrow"><i className="bi bi-stars" />Why Finance Bros</span>
            <h2 className="section-title mb-3">Guidance that grows with your salary.</h2>
            <p className="lead-sm mb-4">From your first SIP to your first home loan, we explain the numbers in plain Hinglish-friendly language — the same way we do on <a href={IG_URL} target="_blank" rel="noreferrer">@finance.bros.in</a>.</p>
            <div className="d-grid gap-4">
              {FEATURES.map(([icon, t, d]) => (
                <div className="d-flex gap-3" key={t}>
                  <span className="feature-icon"><i className={`bi ${icon}`} /></span>
                  <div>
                    <h5 className="mb-1">{t}</h5>
                    <p className="mb-0" style={{ color: 'var(--muted)' }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col lg={6}>
            {/* dashboard mock, after reference 2 */}
            <div className="dash-mock">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="brand-mark" style={{ width: 32, height: 32, fontSize: '.8rem' }}>FB</span>
                  <span className="fw-bold">My Dashboard</span>
                </div>
                <span className="tag">Sample view</span>
              </div>
              <Row className="g-3">
                <Col sm={6}>
                  <div className="p-3 rounded-4" style={{ background: 'var(--olive-50)' }}>
                    <div className="small fw-semibold" style={{ color: 'var(--muted)' }}>Financial health score</div>
                    <div className="d-flex align-items-end gap-2"><span className="fs-1 fw-bold" style={{ color: 'var(--olive-900)' }}>72</span><span className="mb-2 small fw-semibold">/ 100</span></div>
                    <ProgressBar now={72} style={{ height: 8 }} className="olive-progress" />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="p-3 rounded-4 h-100" style={{ background: 'var(--olive-900)', color: '#fff' }}>
                    <div className="small fw-semibold" style={{ color: '#A9B0AB' }}>Next goal</div>
                    <div className="fw-bold fs-5">Emergency fund</div>
                    <div className="small" style={{ color: '#A9B0AB' }}>₹1.8 L of ₹3 L · 60%</div>
                    <ProgressBar now={60} style={{ height: 8, background: 'rgba(255,255,255,.15)' }} className="lime-progress mt-2" />
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="border rounded-4 p-3">
                    {[
                      ['bi-house-door', 'Home loan', 'Balance-transfer saving found', '₹2.1 L'],
                      ['bi-graph-up-arrow', 'SIPs', '3 funds · overlap 41%', 'Review'],
                      ['bi-shield-check', 'Term cover', 'Cover gap vs 10× income', '₹45 L'],
                    ].map(([i, t, d, v]) => (
                      <div className="d-flex align-items-center gap-3 py-2 border-bottom last-0" key={t}>
                        <span className="feature-icon" style={{ width: 38, height: 38, fontSize: '1rem' }}><i className={`bi ${i}`} /></span>
                        <div className="flex-grow-1"><div className="fw-bold">{t}</div><div className="small" style={{ color: 'var(--muted)' }}>{d}</div></div>
                        <span className="fw-bold text-olive text-nowrap">{v}</span>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <div className="dark-band p-4 p-md-5">
          <Row className="g-4 align-items-center">
            <Col lg={4}>
              <h3 className="h2 mb-2">Built for how India actually earns and borrows.</h3>
              <p className="muted mb-0">Salaried, self-employed or a small-business owner — the tools and advice adapt to you.</p>
            </Col>
            <Col lg={8}>
              <Row className="g-3">
                {[
                  ['bi-person-badge', 'Salaried', 'Home loans, SIPs, tax regime choice, term cover.'],
                  ['bi-briefcase', 'Self-employed', 'Business loans, irregular-income budgeting, retirement.'],
                  ['bi-mortarboard', 'Students & first jobbers', 'Education loans, first SIP, credit score basics.'],
                ].map(([i, t, d]) => (
                  <Col md={4} key={t}>
                    <div className="mini-card">
                      <i className={`bi ${i} fs-3`} style={{ color: 'var(--lime)' }} />
                      <h5 className="mt-2 mb-1 text-white">{t}</h5>
                      <p className="muted small mb-0">{d}</p>
                    </div>
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
