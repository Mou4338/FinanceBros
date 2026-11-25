import { Container, Row, Col, Tab, Nav, Button } from 'react-bootstrap'

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
    extras: ['Loan rejection analysis', 'EMI reduction planning', 'Prepayment vs regular EMI', 'Foreclosure cost check', 'Documentation help', 'Application tracking'],
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
    extras: ['SIP vs lumpsum', 'Fund overlap analysis', 'Expense ratio comparison', 'Rolling returns', 'Benchmark comparison', 'Investment horizon check'],
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
    extras: ['Portfolio Health Report (PDF)', 'Quarterly review calls'],
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
    extras: ['NPS & PPF planning', 'FD/RD comparison', 'Gold ETF education'],
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
    extras: ['Premium comparison', 'Nominee & documentation checklist'],
    note: 'Insurance is distributed only through IRDAI-licensed intermediaries; ITR filing is done by qualified tax professionals.',
  },
]

export default function Services({ active, setActive, onBook }) {
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
                            <div className="svc-item">
                              <h6><i className="bi bi-check2-circle text-olive me-1" />{t}</h6>
                              <p>{d}</p>
                            </div>
                          </Col>
                        ))}
                      </Row>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <span className="fw-bold small me-1 align-self-center">Also included:</span>
                        {s.extras.map((e) => <span className="tag" key={e}>{e}</span>)}
                      </div>
                      <div className="note"><i className="bi bi-info-circle me-2" />{s.note}</div>
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
