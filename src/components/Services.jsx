import { Container, Row, Col, Tab, Nav, Button, Accordion } from 'react-bootstrap'
import { useStore } from '../services/store.jsx'
import { openTool } from '../utils/toolNav.js'
import { inr } from '../utils/finance.js'
import { ITEM_PRICING, findPlan, priceLabel } from '../services/plans.js'

export const SERVICES = [
  {
    key: 'loans', icon: 'bi-bank', title: 'Loans & credit', tag: 'Launching first',
    intro: 'Compare lenders, check eligibility and understand the true cost of a loan before you sign.',
    items: [
      ['Personal loan', 'Eligibility, lender comparison and EMI'],
      ['Home loan', 'Eligibility, EMI and interest-rate comparison'],
      ['Business loan', 'Business profile and eligibility assessment'],
      ['Loan against property', 'Basic eligibility and documentation'],
      ['Education loan', 'Domestic and overseas study loans'],
      ['Vehicle loan', 'Car and two-wheeler loan comparison'],
      ['Debt consolidation', 'Existing debt and repayment assessment'],
      ['Balance transfer', 'Existing vs proposed loan cost'],
      ['Credit cards', 'Card comparison, eligibility and benefits'],
      ['Credit score guidance', 'Credit profile education and improvement checklist'],
    ],
    extras: ['Loan rejection analysis', 'EMI reduction planning', 'Flat vs reducing rate check', 'Prepayment vs regular EMI', 'Foreclosure cost check', 'Documentation help', 'Application tracking'],
    note: 'Loans are facilitated through partner banks and NBFCs regulated by the RBI. We never pull your credit report without your written consent.',
  },
  {
    key: 'sip', icon: 'bi-graph-up-arrow', title: 'SIP & mutual funds', tag: 'Launching first',
    intro: 'Learn how SIPs, fund categories and costs work, then plan monthly investing around your goals.',
    items: [
      ['SIP planning', 'Monthly investment planning'],
      ['SIP review', 'Assess your existing SIP contributions'],
      ['Lumpsum planning', 'Understand one-time investment options'],
      ['Mutual fund education', 'Fund categories explained simply'],
      ['Fund comparison', 'Performance, costs and risk side by side'],
      ['ELSS education', 'How tax-saving funds work'],
      ['Debt & hybrid funds', 'Debt categories and equity-debt mixes'],
      ['Index funds', 'Passive investing explained'],
      ['Step-up SIP planning', 'Model rising contributions'],
      ['Goal-based investing', 'Retirement, education and home goals'],
    ],
    extras: ['Life-stage fund selection', '7-point fund check', '4-question investment check', 'SIP vs lumpsum', 'Fund overlap analysis', 'Expense ratio comparison', 'Rolling returns', 'Benchmark comparison', 'Investment horizon check'],
    note: 'Comparisons are educational. We do not label any fund as "best for you" unless delivered under the appropriate SEBI-registered advisory or AMFI distribution model.',
  },
  {
    key: 'wealth', icon: 'bi-pie-chart', title: 'Investment & portfolio', tag: 'High value',
    intro: 'A clear Portfolio Health Report: allocation, concentration, overlap and how it lines up with your goals.',
    items: [
      ['Portfolio health check', 'Overall portfolio assessment'],
      ['Asset allocation', 'Equity, debt, gold and cash mix'],
      ['Risk assessment', 'Risk tolerance and risk capacity'],
      ['Stock portfolio review', 'Sector and company concentration'],
      ['Mutual fund review', 'Overlap and category exposure'],
      ['Retirement portfolio', 'Retirement goal assessment'],
      ['Wealth planning', 'Long-term wealth goals'],
      ['Portfolio tracking', 'Monitor investment values'],
      ['Rebalancing education', 'Understand allocation drift'],
      ['Tax efficiency education', 'Relevant tax considerations'],
    ],
    extras: ['Portfolio Health Report (PDF)', 'Quarterly review calls', 'IPO homework checklist', 'Gold allocation check'],
    note: 'Personalised investment advice is provided only through a SEBI-registered Investment Adviser.',
  },
  {
    key: 'planning', icon: 'bi-clipboard-check', title: 'Financial planning', tag: 'Popular',
    intro: 'Budget, emergency fund, goals and retirement — one plan that fits your salary and your life.',
    items: [
      ['Budget creation', 'Monthly income and expense planning'],
      ['Emergency fund', 'How much, and where to park it'],
      ['Retirement planning', 'Corpus and monthly saving needed'],
      ["Children's education", 'Goal amount and timeline'],
      ['Marriage & home purchase', 'Big-ticket goal planning'],
      ['Debt repayment plan', 'Snowball vs avalanche, EMI order'],
      ['Tax regime comparison', 'Old vs new regime education'],
      ['Insurance needs', 'Cover you actually need'],
      ['Savings & wealth plan', 'Step-by-step wealth building'],
      ['Net worth tracking', 'Assets minus liabilities, yearly'],
    ],
    extras: ['NPS & PPF planning', 'FD/RD comparison', 'Gold ETF education', 'Parents 50+ emergency & nominee check', 'Unclaimed money recovery help'],
    note: 'Plans are based on the information you share and are reviewed with you on a call.',
  },
  {
    key: 'insurance', icon: 'bi-shield-check', title: 'Insurance & tax', tag: 'Protection',
    intro: 'Protect your family and your income, and connect with tax professionals for ITR filing.',
    items: [
      ['Term life insurance', 'Compare cover and premiums'],
      ['Health insurance', 'Individual and family floater plans'],
      ['Critical illness cover', 'What it pays and when'],
      ['Personal accident cover', 'Income protection basics'],
      ['Existing policy review', 'Are you over- or under-insured?'],
      ['Claim process guidance', 'Step-by-step help at claim time'],
      ['Tax planning', 'Understand tax-saving options'],
      ['ITR assistance', 'Filing via partner tax professionals'],
      ['Credit card consulting', 'Pick cards that fit your spending'],
      ['Financial literacy', 'Courses and learning resources'],
    ],
    extras: ['Premium comparison', 'Nominee & documentation checklist', 'Claim rejection & Ombudsman help'],
    note: 'Insurance is distributed only through IRDAI-licensed intermediaries; ITR filing is done by qualified tax professionals.',
  },
]


// Plain-language detail shown under each service
const CLARITY = {
  loans: {
    who: ['Buying a home, car or funding studies', 'Paying several EMIs or card bills at once', 'Rejected for a loan and unsure why'],
    steps: [['Free call', 'Tell us the amount, purpose and your income.'], ['Check', 'We check eligibility, credit report (with consent) and compare offers.'], ['Choose', 'You get a written comparison: rate, fees, EMI and total cost.'], ['Apply', 'If you want, we help with documents and track it to disbursal.']],
    get: ['Written lender comparison', 'EMI and total-cost sheet', 'Document checklist', 'Status updates till disbursal (Assistance plan)'],
    docs: ['PAN and Aadhaar', 'Last 3–6 months\' salary slips or ITRs', '6 months\' bank statements', 'Property papers (home loan / LAP)'],
    time: 'Call in 24 hours; comparison in 2–3 working days',
    tools: [['emi', 'EMI calculator'], ['elig', 'Loan eligibility'], ['rentbuy', 'Rent vs buy'], ['flatrate', 'Flat vs reducing rate']],
    faq: [['Will checking eligibility hurt my credit score?', 'No. Checking your own report is a soft enquiry. Only a lender\'s application is a hard enquiry, and we apply only when you say so.'], ['Do you earn anything from lenders?', 'Some partner lenders pay us a referral fee. We always tell you before you apply, and it never changes your rate.']],
  },
  sip: {
    who: ['Starting your first SIP', 'Holding many funds and unsure if they\'re right', 'Investing for a goal like a home or a child\'s education'],
    steps: [['Free call', 'Your goals, timeline and how much you can invest.'], ['Map', 'Each goal gets an amount, a time frame and a fund category.'], ['Review', 'We check existing funds for overlap, cost and consistency.'], ['Start', 'You get a written SIP plan and set it up in your own account.']],
    get: ['Goal-wise SIP amounts with step-up', 'Fund-category plan for each goal', 'Overlap and cost report on existing funds', 'Review reminder each year'],
    docs: ['PAN, and KYC status (check on any AMC site)', 'Consolidated Account Statement (CAS) from CAMS / KFintech', 'List of your goals and target years'],
    time: 'Call in 24 hours; plan in 2 working days',
    tools: [['sip', 'SIP calculator'], ['delay', 'Cost of delaying SIP'], ['lifestage', 'Life-stage fund guide'], ['mf7', '7 fund checks']],
    faq: [['Do I invest through you?', 'No. Your money stays in your own folio with the fund house. We never hold your money or passwords.'], ['Can I start with ₹500?', 'Yes. Many funds allow SIPs from ₹100–500. Starting early matters more than starting big.']],
  },
  wealth: {
    who: ['Holding stocks, funds, FDs and gold with no clear picture', 'Portfolio worth ₹5 lakh and above', 'Approaching a big goal and want a second opinion'],
    steps: [['Share', 'Upload your CAS / holdings statement securely.'], ['Analyse', 'We check allocation, concentration, overlap, cost and risk.'], ['Report', 'You get a Portfolio Health Report in PDF.'], ['Walkthrough', 'A 30-minute call to explain every finding and next step.']],
    get: ['Portfolio Health Report (PDF)', 'Asset-allocation and overlap charts', 'Goal-mapping of investments', 'Rebalancing action list'],
    docs: ['CAS from CAMS / KFintech or NSDL / CDSL', 'FD, PPF, EPF and gold details', 'Your goals and risk comfort'],
    time: 'Report in 3–5 working days',
    tools: [['health', 'Portfolio health check'], ['cagr', 'CAGR'], ['cg', 'Capital gains tax'], ['swp', 'SWP income']],
    faq: [['Do you tell me which stock to buy?', 'No stock tips. Personalised buy/sell advice is given only through a SEBI-registered Investment Adviser.'], ['Is my data safe?', 'Statements are used only for your report, never shared, and you can ask us to delete them anytime.']],
  },
  planning: {
    who: ['Salary comes in, money disappears', 'Newly married or expecting a child', 'Want to know your retirement number'],
    steps: [['Free call', 'Income, expenses, loans, savings and goals.'], ['Build', 'Budget, emergency fund, insurance gap and goal SIPs in one plan.'], ['Explain', 'A call to walk through the plan, step by step.'], ['Review', 'Quarterly check-ins on the Annual Plan.']],
    get: ['One-page money plan', 'Budget and emergency-fund target', 'Goal and retirement SIPs', 'Debt payoff order and insurance gaps'],
    docs: ['Monthly income and rough expenses', 'Loan EMIs and outstanding amounts', 'Current investments and policies'],
    time: 'Plan in 3–5 working days',
    tools: [['budget', 'Budget 50/30/20'], ['retire', 'Retirement'], ['child', 'Child education'], ['emergency', 'Emergency fund']],
    faq: [['I earn ₹30,000. Is this for me?', 'Yes. A plan matters most when money is tight. The Planning Consultation starts at ₹499.'], ['Do I have to buy any product?', 'No. The plan is yours to follow with any bank, fund house or insurer you like.']],
  },
  insurance: {
    who: ['No term or health cover yet', 'Holding endowment / ULIP policies and unsure of value', 'Old vs new tax regime confusion, or a claim rejected'],
    steps: [['Free call', 'Family, income, loans and existing policies.'], ['Gap check', 'How much term and health cover you need, and what you have.'], ['Compare', 'Policy features compared, including claim terms.'], ['Tax & claims', 'Regime check, ITR filing via partner CA, claim escalation help.']],
    get: ['Cover-needed calculation', 'Existing policy review', 'Tax regime comparison on your numbers', 'Claim and grievance support (if needed)'],
    docs: ['Existing policy documents', 'Form 16 / salary slips', 'Investment and rent proofs (for tax)', 'Rejection letter (for claims)'],
    time: 'Call in 24 hours; ITR filed in 3–5 working days after documents',
    tools: [['term', 'Term cover'], ['tax', 'Old vs new regime'], ['hra', 'HRA exemption'], ['claim', 'Claim rejected?']],
    faq: [['Should I surrender my old LIC / endowment policy?', 'Not always. Surrender value, remaining term and your cover needs decide it. We work it out on your numbers.'], ['Which regime is better for me?', 'It depends on your deductions. Many salaried people pay less in the new regime now; our free calculator shows both.']],
  },
}

function Clarity({ k, onBook }) {
  const c = CLARITY[k]
  const { data } = useStore()
  const prices = data.plans.filter((p) => p.service === k && p.price > 0).map((p) => p.price)
  const from = prices.length ? Math.min(...prices) : null
  return (
    <div className="clarity mt-4">
      <Row className="g-3 mb-3">
        <Col md={6}>
          <div className="cl-box h-100">
            <h6><i className="bi bi-person-check me-2" />Who this is for</h6>
            <ul className="cl-list">{c.who.map((w) => <li key={w}>{w}</li>)}</ul>
          </div>
        </Col>
        <Col md={6}>
          <div className="cl-box h-100">
            <h6><i className="bi bi-box-seam me-2" />What you get</h6>
            <ul className="cl-list">{c.get.map((w) => <li key={w}>{w}</li>)}</ul>
          </div>
        </Col>
      </Row>
      <h6 className="fw-bold mb-2">How it works</h6>
      <Row className="g-2 mb-3">
        {c.steps.map(([t, d], i) => (
          <Col sm={6} xl={3} key={t}>
            <div className="cl-step h-100"><span className="cl-num">{i + 1}</span><div className="fw-bold">{t}</div><div className="small" style={{ color: 'var(--muted)' }}>{d}</div></div>
          </Col>
        ))}
      </Row>
      <Row className="g-3 mb-3">
        <Col md={6}>
          <div className="cl-box h-100">
            <h6><i className="bi bi-folder2-open me-2" />Keep these ready</h6>
            <ul className="cl-list">{c.docs.map((w) => <li key={w}>{w}</li>)}</ul>
          </div>
        </Col>
        <Col md={6}>
          <div className="cl-box h-100">
            <h6><i className="bi bi-tools me-2" />Try free first</h6>
            <div className="d-flex flex-wrap gap-2">{c.tools.map(([t, l]) => <button type="button" key={t} className="tag cl-tool" onClick={() => (t === 'health' ? (window.location.hash = 'health-check') : openTool(t))}>{l} <i className="bi bi-arrow-right" /></button>)}</div>
            <div className="small mt-3" style={{ color: 'var(--muted)' }}><i className="bi bi-clock me-1" />{c.time}</div>
          </div>
        </Col>
      </Row>
      <Accordion className="mb-3 cl-faq">
        {c.faq.map(([q, a], i) => (
          <Accordion.Item eventKey={String(i)} key={q}><Accordion.Header>{q}</Accordion.Header><Accordion.Body>{a}</Accordion.Body></Accordion.Item>
        ))}
      </Accordion>
      <div className="cl-price d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <div className="small fw-semibold" style={{ color: 'var(--muted)' }}>{from != null ? 'Paid plans start at' : 'Pricing'}</div>
          <div className="h4 mb-0">{from != null ? inr(from) : 'Free first call'}<span className="small fw-normal ms-2" style={{ color: 'var(--muted)' }}>· first call is free</span></div>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Button variant="outline-dark" onClick={() => { window.location.hash = 'pricing' }}>See all prices</Button>
          <Button className="btn-olive" onClick={onBook}>Book a free call <i className="bi bi-arrow-right ms-1" /></Button>
        </div>
      </div>
    </div>
  )
}

export default function Services({ active, setActive, onBook }) {
  const { data } = useStore()
  const entry = (t) => findPlan(data.plans, ITEM_PRICING[t]?.[0])
  return (
    <section className="section bg-olive-50" id="services">
      <Container>
        <Row className="align-items-end mb-4 g-3">
          <Col lg={7}>
            <span className="eyebrow"><i className="bi bi-grid" />Our services</span>
            <h2 className="section-title mb-2">Five verticals. One place for your money questions.</h2>
            <p className="lead-sm mb-0">Start free with a calculator or assessment. Pay only when you want an expert to go deeper.</p>
          </Col>
          <Col lg={5} className="text-lg-end">
            <Button className="btn-olive" onClick={onBook}>Talk to an expert <i className="bi bi-arrow-right ms-1" /></Button>
          </Col>
        </Row>

        <Tab.Container activeKey={active} onSelect={(k) => k && setActive(k)}>
          <Row className="g-4">
            <Col lg={3}>
              <Nav variant="pills" className="flex-lg-column flex-row flex-nowrap overflow-auto gap-2 svc-tabs pb-1">
                {SERVICES.map((s) => (
                  <Nav.Item key={s.key} className="flex-none">
                    <Nav.Link eventKey={s.key} className="text-nowrap"><i className={`bi ${s.icon}`} />{s.title}</Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>
            <Col lg={9}>
              <Tab.Content>
                {SERVICES.map((s) => (
                  <Tab.Pane eventKey={s.key} key={s.key}>
                    <div className="svc-panel">
                      <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                        <h3 className="h4 mb-0">{s.title}</h3>
                        <span className="tag tag-lime">{s.tag}</span>
                      </div>
                      <p className="lead-sm mb-4">{s.intro}</p>
                      <Row className="g-3 mb-4">
                        {s.items.map(([t, d]) => (
                          <Col sm={6} xl={4} key={t}>
                            <div className="svc-item d-flex flex-column">
                              <h6><i className="bi bi-check2-circle text-olive me-1" />{t}</h6>
                              <p className="flex-grow-1">{d}</p>
                              {entry(t) && <span className="item-price">{Number(entry(t).price) === 0 ? 'Start free' : `From ${priceLabel(entry(t)).replace('from ', '')}`}</span>}
                            </div>
                          </Col>
                        ))}
                      </Row>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <span className="fw-bold small me-1 align-self-center">Also included:</span>
                        {s.extras.map((e) => <span className="tag" key={e}>{e}</span>)}
                      </div>
                      <div className="note"><i className="bi bi-info-circle me-2" />{s.note}</div>
                      <Clarity k={s.key} onBook={onBook} />
                    </div>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </section>
  )
}
