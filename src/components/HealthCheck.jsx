import { useState } from 'react'
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap'
import { inr } from '../utils/finance.js'
import { useStore } from '../services/store.jsx'

const ASSETS = [
  ['equity', 'Equity (stocks, equity MFs)', '#1F7A45'],
  ['debt', 'Debt (FD, PPF, debt MFs)', '#8CC9A0'],
  ['gold', 'Gold (SGB, ETF, jewellery)', '#B9C2BC'],
  ['cash', 'Cash & savings', '#1C201E'],
]

const QUIZ = [
  ['If your investments fell 20% in a month, you would…', ['Sell everything', 'Wait and watch', 'Invest more']],
  ['When will you need most of this money?', ['Within 3 years', '3–7 years', 'After 7+ years']],
  ['How stable is your income?', ['Uncertain', 'Fairly stable', 'Very stable']],
  ['Your investing experience', ['New to it', 'Some MFs/FDs', 'Stocks & MFs for years']],
]

function Ring({ score }) {
  const r = 58, c = 2 * Math.PI * r
  return (
    <svg className="score-ring" viewBox="0 0 140 140" role="img" aria-label={`Score ${score} out of 100`}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="#E4E8E5" strokeWidth="14" />
      <circle cx="70" cy="70" r={r} fill="none" stroke="#1F7A45" strokeWidth="14" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset .4s' }} />
      <text x="70" y="68" textAnchor="middle" fontSize="34" fontWeight="800" fill="#1C201E">{score}</text>
      <text x="70" y="90" textAnchor="middle" fontSize="12" fill="#5F6662">out of 100</text>
    </svg>
  )
}

export default function HealthCheck({ onBook }) {
  const [amt, setAmt] = useState({ equity: 467500, debt: 212500, gold: 85000, cash: 85000 })
  const [age, setAge] = useState(30)
  const [monthlyExp, setMonthlyExp] = useState(40000)
  const [answers, setAnswers] = useState([1, 2, 1, 1])
  const { user, addReport } = useStore()
  const [saved, setSaved] = useState(null)

  const total = Object.values(amt).reduce((a, b) => a + b, 0)
  const pct = (k) => (total ? (amt[k] / total) * 100 : 0)
  const riskScore = answers.reduce((a, b) => a + b, 0) // 0..8
  const profile = riskScore <= 2 ? 'Conservative' : riskScore <= 5 ? 'Moderate' : 'Aggressive'
  // Educational reference band for equity (age-based rule of thumb, tilted by risk profile)
  const base = Math.max(20, Math.min(80, 100 - age))
  const tilt = profile === 'Conservative' ? -15 : profile === 'Aggressive' ? 10 : 0
  const ref = Math.max(10, Math.min(85, base + tilt))
  const eq = pct('equity')
  const efMonths = monthlyExp ? amt.cash / monthlyExp : 0

  const checks = [
    { ok: Math.abs(eq - ref) <= 10, t: 'Equity exposure', d: `${eq.toFixed(0)}% vs an educational reference of ~${ref}% for a ${profile.toLowerCase()} ${age}-year-old.` },
    { ok: efMonths >= 6, t: 'Emergency cushion', d: `Cash covers ${efMonths.toFixed(1)} months of expenses (6+ months is a common guideline).` },
    { ok: pct('gold') <= 15, t: 'Gold share', d: `${pct('gold').toFixed(0)}% in gold. Many planners keep gold around 5–15%.` },
    { ok: pct('cash') <= 20, t: 'Idle cash', d: `${pct('cash').toFixed(0)}% sitting in cash, which loses value to inflation over time.` },
  ]
  const score = Math.round(40 + checks.filter((c) => c.ok).length * 15)

  return (
    <section className="section bg-olive-50" id="health-check">
      <Container>
        <Row className="mb-4">
          <Col lg={8}>
            <span className="eyebrow"><i className="bi bi-heart-pulse" />Free portfolio health check</span>
            <h2 className="section-title mb-2">See your money's health score in one minute.</h2>
            <p className="lead-sm mb-0">Enter what you hold today and answer four quick questions. You get an indicative score and plain-language observations.</p>
          </Col>
        </Row>
        <Row className="g-4">
          <Col lg={7}>
            <div className="contact-card h-100">
              <h5 className="mb-3">1. What do you hold today?</h5>
              <Row className="g-3 mb-3">
                {ASSETS.map(([k, l, c]) => (
                  <Col sm={6} key={k}>
                    <Form.Label htmlFor={`hc-${k}`}><span className="legend-dot" style={{ background: c }} />{l}</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control id={`hc-${k}`} type="number" min={0} step={1000} value={amt[k]}
                        onChange={(e) => setAmt((o) => ({ ...o, [k]: Math.max(0, Number(e.target.value) || 0) }))} />
                    </InputGroup>
                  </Col>
                ))}
                <Col sm={6}>
                  <Form.Label htmlFor="hc-age">Your age</Form.Label>
                  <Form.Control id="hc-age" type="number" min={18} max={80} value={age} onChange={(e) => setAge(Number(e.target.value) || 18)} />
                </Col>
                <Col sm={6}>
                  <Form.Label htmlFor="hc-exp">Monthly expenses</Form.Label>
                  <InputGroup><InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control id="hc-exp" type="number" min={0} step={1000} value={monthlyExp} onChange={(e) => setMonthlyExp(Number(e.target.value) || 0)} />
                  </InputGroup>
                </Col>
              </Row>
              <h5 className="mb-3 mt-4">2. Your risk profile</h5>
              {QUIZ.map(([q, opts], qi) => (
                <fieldset className="mb-3" key={q}>
                  <legend className="form-label fs-6">{q}</legend>
                  <Row className="g-2">
                    {opts.map((o, oi) => (
                      <Col sm={4} key={o}>
                        <label className="quiz-opt h-100">
                          <Form.Check.Input type="radio" name={`q${qi}`} className="me-2" checked={answers[qi] === oi}
                            onChange={() => { setSaved(null); setAnswers((a) => a.map((v, i) => (i === qi ? oi : v))) }} />
                          {o}
                        </label>
                      </Col>
                    ))}
                  </Row>
                </fieldset>
              ))}
            </div>
          </Col>
          <Col lg={5}>
            <div className="contact-card h-100 d-flex flex-column">
              <div className="d-flex align-items-center gap-3 mb-3">
                <Ring score={score} />
                <div>
                  <div className="small fw-semibold" style={{ color: 'var(--muted)' }}>Total declared investments</div>
                  <div className="fs-3 fw-bold" style={{ color: 'var(--olive-950)' }}>{inr(total)}</div>
                  <span className="tag tag-lime">Risk profile: {profile}</span>
                </div>
              </div>
              <div className="alloc-bar mb-2">
                {ASSETS.map(([k, , c]) => <div key={k} style={{ width: `${pct(k)}%`, background: c }} title={`${k} ${pct(k).toFixed(0)}%`} />)}
              </div>
              <div className="d-flex flex-wrap gap-3 small fw-semibold mb-3" style={{ color: 'var(--muted)' }}>
                {ASSETS.map(([k, l, c]) => <span key={k}><span className="legend-dot" style={{ background: c }} />{l.split(' ')[0]} {pct(k).toFixed(0)}%</span>)}
              </div>
              <div className="d-grid gap-2 mb-3">
                {checks.map((c) => (
                  <div key={c.t} className="d-flex gap-2 p-2 rounded-3" style={{ background: c.ok ? 'var(--olive-50)' : '#fbf6e6' }}>
                    <i className={`bi ${c.ok ? 'bi-check-circle-fill text-olive' : 'bi-exclamation-circle-fill'} mt-1`} style={c.ok ? {} : { color: '#a07a10' }} />
                    <div><div className="fw-bold small">{c.t}</div><div className="small" style={{ color: 'var(--muted)' }}>{c.d}</div></div>
                  </div>
                ))}
              </div>
              <p className="small mt-auto" style={{ color: 'var(--muted)' }}>Indicative and educational only. It does not assess suitability or recommend changes — that needs a professional review.</p>
              {user ? (
                <Button className="btn-ghost w-100 mb-2" disabled={!!saved} onClick={() => setSaved(addReport({ type: 'Portfolio health check', score, total, profile, alloc: ASSETS.map(([k, , c]) => [k, Math.round(pct(k)), c]), notes: checks.map((c) => `${c.ok ? '✓' : '!'} ${c.t}: ${c.d}`) }))}>
                  <i className="bi bi-bookmark-plus me-2" />{saved ? `Saved to My Account (${saved.ref})` : 'Save this result to My Account'}
                </Button>
              ) : (
                <Button className="btn-ghost w-100 mb-2" href="#account"><i className="bi bi-person me-2" />Log in to save this result</Button>
              )}
              <Button className="btn-olive w-100" onClick={() => onBook('Portfolio review')}>Get a detailed Portfolio Health Report</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
