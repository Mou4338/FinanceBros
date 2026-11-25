import { useState } from 'react'
import { Container, Row, Col, Form, Offcanvas, Button, Modal, Nav, Tab } from 'react-bootstrap'

const ARTICLES = [
  { id: 'sip-basics', cat: 'Investing', min: 4, icon: 'bi-graph-up-arrow', title: 'SIP kya hai? How monthly investing works', sum: 'Rupee-cost averaging, compounding and why starting early matters more than the amount.',
    body: [
      ['What a SIP is', 'A Systematic Investment Plan invests a fixed amount in a mutual fund on a set date every month. You buy more units when prices are low and fewer when they are high, which smooths your average cost over time.'],
      ['Why time matters', 'Compounding needs years. ₹5,000 a month for 20 years puts in ₹12 lakh; at an assumed 12% a year it could grow to roughly ₹50 lakh. Start 10 years later and the same habit grows to only about ₹11.6 lakh. Returns are not guaranteed.'],
      ['Before you start', 'Keep an emergency fund first, match the fund category to your goal horizon, check the expense ratio, and pick the direct or regular plan knowingly.'],
    ] },
  { id: 'emi-truth', cat: 'Loans', min: 5, icon: 'bi-house-door', title: 'The real cost of a home loan EMI', sum: 'Why the first years are mostly interest — and how prepayment changes the maths.',
    body: [
      ['Front-loaded interest', 'On a 20-year loan at 8.5%, more than 70% of each EMI in the first year goes to interest. That is why the outstanding balance falls slowly at the start.'],
      ['Prepayment', 'Paying even one extra EMI a year can cut several years off the tenure. Floating-rate home loans for individuals usually carry no prepayment penalty — confirm with your lender.'],
      ['Tenure vs EMI', 'When rates rise, lenders often extend tenure instead of raising the EMI. Ask for the EMI to be increased instead if you can afford it.'],
    ] },
  { id: 'credit-score', cat: 'Credit', min: 3, icon: 'bi-speedometer2', title: 'Credit score: 6 habits that move it', sum: 'Payment history, utilisation and why closing old cards can hurt.',
    body: [
      ['What lenders look at', 'Repayment history matters most, followed by how much of your credit limit you use, the age of your accounts, and how many new loans you have applied for recently.'],
      ['Habits that help', 'Pay every EMI and card bill on time, keep card use under about 30% of the limit, avoid many loan applications at once, keep old cards open, maintain a mix of credit, and check your report for errors once a year.'],
    ] },
  { id: 'emergency', cat: 'Planning', min: 3, icon: 'bi-life-preserver', title: 'Emergency fund: how much and where', sum: '6 months of expenses, kept boring and liquid.',
    body: [
      ['How much', 'Cover essential expenses plus EMIs for 6 months if your income is stable, and 9–12 months if you are self-employed or the only earner.'],
      ['Where to keep it', 'Safety and access come before returns: a savings account, sweep-in FD or liquid fund. Not in equity, and not locked away.'],
    ] },
  { id: 'regime', cat: 'Tax', min: 4, icon: 'bi-receipt', title: 'Old vs new tax regime: how to compare', sum: 'Add up your deductions first — then compare the tax under both.',
    body: [
      ['The idea', 'The new regime has lower slab rates but allows few deductions. The old regime has higher rates but allows deductions such as 80C, 80D and home-loan interest.'],
      ['How to decide', 'List every deduction you actually claim. If the total is small, the new regime usually wins. Slabs and rules change in each Budget, so check the current year on the Income Tax Department website or with a tax professional.'],
    ] },
  { id: 'term-cover', cat: 'Insurance', min: 3, icon: 'bi-shield-check', title: 'Term insurance: how much cover?', sum: 'A simple rule of thumb, and why ULIPs are not term plans.',
    body: [
      ['How much', 'A common starting point is 10–15 times your annual income, plus outstanding loans, minus existing investments. Revisit it after marriage, children or a home loan.'],
      ['Keep it separate', 'Pure term insurance gives the most cover per rupee. Products that mix insurance and investment usually give lower cover and higher costs.'],
    ] },
]
const CATS = ['All', ...new Set(ARTICLES.map((a) => a.cat))]

export function LearningCentre({ onBook }) {
  const [cat, setCat] = useState('All'), [q, setQ] = useState(''), [open, setOpen] = useState(null)
  const list = ARTICLES.filter((a) => (cat === 'All' || a.cat === cat) && (a.title + a.sum).toLowerCase().includes(q.toLowerCase()))
  return (
    <section className="section" id="learn">
      <Container>
        <Row className="g-3 align-items-end mb-4">
          <Col lg={7}>
            <span className="eyebrow"><i className="bi bi-book" />Learning centre</span>
            <h2 className="section-title mb-2">Short guides. No jargon.</h2>
            <p className="lead-sm mb-0">The same simple explainers as our reels, written down so you can come back to them.</p>
          </Col>
          <Col lg={5}><Form.Control aria-label="Search guides" placeholder="Search guides…" value={q} onChange={(e) => setQ(e.target.value)} /></Col>
        </Row>
        <div className="d-flex flex-wrap gap-2 mb-4">
          {CATS.map((c) => <button key={c} type="button" className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)} aria-pressed={cat === c}>{c}</button>)}
        </div>
        <Row className="g-4">
          {list.map((a) => (
            <Col md={6} lg={4} key={a.id}>
              <button type="button" className="guide" onClick={() => setOpen(a)}>
                <span className="feature-icon"><i className={`bi ${a.icon}`} /></span>
                <span className="small fw-semibold d-block mt-3" style={{ color: 'var(--olive)' }}>{a.cat} · {a.min} min read</span>
                <span className="h5 d-block mt-1 mb-2">{a.title}</span>
                <span className="small d-block" style={{ color: 'var(--muted)' }}>{a.sum}</span>
                <span className="fw-bold small mt-3 d-inline-block text-olive">Read guide <i className="bi bi-arrow-right" /></span>
              </button>
            </Col>
          ))}
          {list.length === 0 && <p className="text-center" style={{ color: 'var(--muted)' }}>No guides match "{q}".</p>}
        </Row>
      </Container>
      <Offcanvas show={!!open} onHide={() => setOpen(null)} placement="end" className="guide-panel">
        {open && <>
          <Offcanvas.Header closeButton><span className="tag">{open.cat} · {open.min} min read</span></Offcanvas.Header>
          <Offcanvas.Body>
            <h3 className="mb-3">{open.title}</h3>
            {open.body.map(([h, p]) => <div key={h} className="mb-3"><h6 className="fw-bold">{h}</h6><p style={{ color: 'var(--muted)' }}>{p}</p></div>)}
            <div className="note mb-3">Educational content only, not personal advice.</div>
            <Button className="btn-olive w-100" onClick={() => { setOpen(null); onBook() }}>Discuss this with an expert</Button>
          </Offcanvas.Body>
        </>}
      </Offcanvas>
    </section>
  )
}

const LEGAL = {
  privacy: ['Privacy policy', [
    ['What we collect', 'Contact details (name, mobile, email, city), your enquiry topic, and any financial ranges you choose to share. We do not ask for PAN, Aadhaar, bank account or card details, or credit reports during enquiry or booking.'],
    ['Why', 'To respond to your request, schedule consultations, send confirmations and, with separate consent, share educational updates.'],
    ['Sharing', 'Only with the consultant or regulated partner you ask us to connect you with, and with service providers who help run the website. We never sell personal data.'],
    ['Your choices', 'You can ask to access, correct or delete your data, or withdraw consent, by writing to hello@financebros.in.'],
    ['Security', 'Data is encrypted in transit, and access is limited by role.'],
  ]],
  terms: ['Terms of use', [
    ['Educational tools', 'Calculators, the health check and guides are for education. Results depend on your inputs and assumed rates and are not offers, approvals or recommendations.'],
    ['No guarantees', 'We do not guarantee investment returns or loan approval. Lenders, AMCs and insurers make their own decisions.'],
    ['Consultations', 'Bookings are requests until confirmed. Paid sessions may be rescheduled once free of charge with 12 hours\' notice.'],
  ]],
  disclosures: ['Disclosures', [
    ['Market risk', 'Mutual fund investments are subject to market risks; read all scheme-related documents carefully. Past performance does not indicate future returns.'],
    ['Advice vs distribution', 'Personalised investment advice is offered only through a SEBI-registered Investment Adviser. Mutual fund distribution, where offered, is under an AMFI-registered ARN and is kept separate from advisory services.'],
    ['Loans & insurance', 'Loans are provided by RBI-regulated banks and NBFCs; Finance Bros is not a lender. Insurance is distributed through IRDAI-licensed intermediaries.'],
    ['Compensation', 'Any referral fee or commission linked to a product is disclosed to you before you act.'],
  ]],
}

export function LegalModal({ which, onHide }) {
  return (
    <Modal show={!!which} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton className="border-0 px-4 pt-4"><Modal.Title className="fw-bold">Legal</Modal.Title></Modal.Header>
      <Modal.Body className="px-4 pb-4">
        {which && (
          <Tab.Container defaultActiveKey={which}>
            <Nav variant="pills" className="svc-tabs gap-2 mb-3 flex-nowrap overflow-auto">
              {Object.entries(LEGAL).map(([k, [t]]) => <Nav.Item key={k}><Nav.Link eventKey={k} className="text-nowrap">{t}</Nav.Link></Nav.Item>)}
            </Nav>
            <Tab.Content>
              {Object.entries(LEGAL).map(([k, [, secs]]) => (
                <Tab.Pane eventKey={k} key={k}>
                  {secs.map(([h, p]) => <div key={h} className="mb-3"><h6 className="fw-bold">{h}</h6><p className="mb-0" style={{ color: 'var(--muted)' }}>{p}</p></div>)}
                  <p className="small mb-0" style={{ color: 'var(--muted)' }}>Draft text for launch — have it reviewed by a legal/compliance professional.</p>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        )}
      </Modal.Body>
    </Modal>
  )
}
