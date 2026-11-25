import { Container, Row, Col, Button } from 'react-bootstrap'
import { REELS } from '../services/reels.js'
import { IG_URL } from './Header.jsx'
import { openTool } from '../utils/toolNav.js'

const TOOL_NAMES = { emi: 'EMI calculator', elig: 'Loan eligibility', bt: 'Balance transfer', prepay: 'Prepayment savings', card: 'Credit card payoff', sip: 'SIP calculator', cagr: 'CAGR calculator', fd: 'FD calculator', inflation: 'Inflation calculator', retire: 'Retirement calculator', goal: 'Savings goal', emergency: 'Emergency fund', budget: 'Budget planner', networth: 'Net worth', tax: 'Tax regime calculator', ppf: 'PPF calculator' }

/* Real Instagram reels, embedded with Instagram's own player */
export default function Reels({ compact = false }) {
  if (!REELS.length) return null
  return (
    <section className={`section reels ${compact ? 'pt-0' : 'bg-olive-50'}`} id="reels">
      <Container>
        <Row className="g-3 align-items-end mb-4">
          <Col lg={8}>
            <span className="eyebrow"><i className="bi bi-instagram" />Watch & learn</span>
            <h2 className="section-title mb-2">Money, explained in short reels.</h2>
            <p className="lead-sm mb-0">Simple explainers from @finance.bros.in. Watch here, then try the numbers yourself with our free tools.</p>
          </Col>
          <Col lg={4} className="text-lg-end">
            <Button className="btn-ghost" href={IG_URL} target="_blank" rel="noreferrer"><i className="bi bi-instagram me-2" />Follow on Instagram</Button>
          </Col>
        </Row>
        <Row className="g-4 justify-content-center">
          {REELS.map((r) => (
            <Col md={6} lg={4} key={r.id}>
              <div className="reel-card">
                <div className="reel-frame">
                  <iframe title="Finance Bros reel on Instagram" src={`https://www.instagram.com/reel/${r.id}/embed/captioned/`} loading="lazy" allowFullScreen scrolling="no" />
                </div>
                <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center p-3">
                  <a href={`https://www.instagram.com/reel/${r.id}/`} target="_blank" rel="noreferrer" className="small fw-semibold"><i className="bi bi-box-arrow-up-right me-1" />Open on Instagram</a>
                  {r.tool && TOOL_NAMES[r.tool] && <Button size="sm" className="btn-olive" onClick={() => openTool(r.tool)}><i className="bi bi-calculator me-1" />{TOOL_NAMES[r.tool]}</Button>}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}
