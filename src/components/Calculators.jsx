import { useMemo, useState } from 'react'
import { Container, Row, Col, Form, Nav, Tab, Button } from 'react-bootstrap'
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts'
import { emi, amortisation, sip, lumpsum, retirement, eligibility, inr, inrShort } from '../utils/finance.js'

const OLIVE = '#1F7A45', OLIVE_L = '#8CC9A0', LIME = '#B9C2BC', DEEP = '#1C201E'

function SliderRow({ id, label, value, onChange, min, max, step = 1, prefix = '', suffix = '' }) {
  return (
    <div className="slider-row">
      <div className="top">
        <Form.Label htmlFor={id} className="mb-0">{label}</Form.Label>
        <div className="d-flex align-items-center gap-1">
          {prefix && <span className="fw-bold text-olive">{prefix}</span>}
          <Form.Control id={id} type="number" inputMode="decimal" value={value} min={min} max={max} step={step}
            onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />
          {suffix && <span className="fw-bold text-olive small">{suffix}</span>}
        </div>
      </div>
      <Form.Range aria-label={label} min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))} onChange={(e) => onChange(Number(e.target.value))} />
      <div className="d-flex justify-content-between small" style={{ color: 'var(--muted)' }}>
        <span>{prefix}{min.toLocaleString('en-IN')}{suffix}</span><span>{prefix}{max.toLocaleString('en-IN')}{suffix}</span>
      </div>
    </div>
  )
}

const tip = (v) => inr(v)
const axis = { fontSize: 12, fill: '#5F6662' }

function Donut({ a, b, la, lb }) {
  const data = [{ name: la, value: Math.max(0, a) }, { name: lb, value: Math.max(0, b) }]
  return (
    <div style={{ height: 190 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="none">
            <Cell fill={OLIVE_L} /><Cell fill={OLIVE} />
          </Pie>
          <Tooltip formatter={tip} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

function Legend({ items }) {
  return (
    <div className="d-flex flex-wrap gap-3 small fw-semibold mb-2" style={{ color: 'var(--muted)' }}>
      {items.map(([c, l]) => <span key={l}><span className="legend-dot" style={{ background: c }} />{l}</span>)}
    </div>
  )
}

/* ---------- EMI ---------- */
function EmiCalc() {
  const [P, setP] = useState(2500000), [r, setR] = useState(8.5), [y, setY] = useState(20)
  const e = emi(P, r, y * 12), total = e * y * 12, interest = total - P
  const rows = useMemo(() => amortisation(P, r, y * 12), [P, r, y])
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="emi-p" label="Loan amount" prefix="₹" value={P} onChange={setP} min={50000} max={20000000} step={50000} />
        <SliderRow id="emi-r" label="Interest rate (p.a.)" suffix="%" value={r} onChange={setR} min={5} max={24} step={0.05} />
        <SliderRow id="emi-y" label="Tenure" suffix="yrs" value={y} onChange={setY} min={1} max={30} />
        <div className="d-flex flex-wrap gap-2">
          {[['Personal', 500000, 12, 5], ['Car', 800000, 9, 7], ['Home', 5000000, 8.5, 20]].map(([l, a, b, c]) => (
            <Button key={l} size="sm" className="btn-ghost" onClick={() => { setP(a); setR(b); setY(c) }}>{l} loan preset</Button>
          ))}
        </div>
      </Col>
      <Col lg={6}>
        <div className="result-box mb-3">
          <div className="label">Monthly EMI</div>
          <div className="hero-val">{inr(e)}</div>
          <Row className="mt-3 g-2">
            <Col xs={6}><div className="label">Total interest</div><div className="sub">{inrShort(interest)}</div></Col>
            <Col xs={6}><div className="label">Total payable</div><div className="sub">{inrShort(total)}</div></Col>
          </Row>
        </div>
        <Row className="align-items-center">
          <Col sm={6}><Donut a={P} b={interest} la="Principal" lb="Interest" /></Col>
          <Col sm={6}><Legend items={[[OLIVE_L, 'Principal'], [OLIVE, 'Interest']]} /><p className="small mb-0" style={{ color: 'var(--muted)' }}>Interest is {Math.round((interest / P) * 100)}% of what you borrow. A shorter tenure or prepayment cuts it sharply.</p></Col>
        </Row>
      </Col>
      <Col xs={12}>
        <h6 className="fw-bold">Year-wise repayment</h6>
        <Legend items={[[OLIVE_L, 'Principal paid'], [OLIVE, 'Interest paid']]} />
        <div className="chart-wrap">
          <ResponsiveContainer>
            <BarChart data={rows} margin={{ left: 4, right: 4 }}>
              <CartesianGrid vertical={false} stroke="#E4E8E5" />
              <XAxis dataKey="year" tick={axis} interval="preserveStartEnd" />
              <YAxis tick={axis} tickFormatter={(v) => inrShort(v).replace('₹', '')} width={60} />
              <Tooltip formatter={tip} />
              <Bar dataKey="principal" name="Principal" stackId="a" fill={OLIVE_L} />
              <Bar dataKey="interest" name="Interest" stackId="a" fill={OLIVE} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Col>
    </Row>
  )
}

/* ---------- SIP / Step-up / Lumpsum ---------- */
function GrowthChart({ rows }) {
  return (
    <>
      <Legend items={[[OLIVE_L, 'Amount invested'], [OLIVE, 'Estimated value']]} />
      <div className="chart-wrap">
        <ResponsiveContainer>
          <AreaChart data={rows} margin={{ left: 4, right: 4 }}>
            <CartesianGrid vertical={false} stroke="#E4E8E5" />
            <XAxis dataKey="year" tick={axis} interval="preserveStartEnd" />
            <YAxis tick={axis} tickFormatter={(v) => inrShort(v).replace('₹', '')} width={60} />
            <Tooltip formatter={tip} />
            <Area type="monotone" dataKey="value" name="Estimated value" stroke={OLIVE} fill={OLIVE} fillOpacity={0.18} strokeWidth={2.5} />
            <Area type="monotone" dataKey="invested" name="Invested" stroke={OLIVE_L} fill={OLIVE_L} fillOpacity={0.35} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

function SipCalc() {
  const [mode, setMode] = useState('sip')
  const [m, setM] = useState(10000), [L, setL] = useState(500000), [r, setR] = useState(12), [y, setY] = useState(15), [s, setS] = useState(10)
  const res = mode === 'lump' ? lumpsum(L, r, y) : sip(m, r, y, mode === 'step' ? s : 0)
  return (
    <Row className="g-4">
      <Col lg={6}>
        <div className="btn-group w-100 mb-4" role="group" aria-label="SIP mode">
          {[['sip', 'SIP'], ['step', 'Step-up SIP'], ['lump', 'Lumpsum']].map(([k, l]) => (
            <Button key={k} className={mode === k ? 'btn-olive' : 'btn-ghost'} onClick={() => setMode(k)} aria-pressed={mode === k}>{l}</Button>
          ))}
        </div>
        {mode === 'lump'
          ? <SliderRow id="sip-l" label="One-time investment" prefix="₹" value={L} onChange={setL} min={5000} max={10000000} step={5000} />
          : <SliderRow id="sip-m" label="Monthly investment" prefix="₹" value={m} onChange={setM} min={500} max={200000} step={500} />}
        <SliderRow id="sip-r" label="Expected return (p.a.)" suffix="%" value={r} onChange={setR} min={1} max={20} step={0.5} />
        <SliderRow id="sip-y" label="Time period" suffix="yrs" value={y} onChange={setY} min={1} max={40} />
        {mode === 'step' && <SliderRow id="sip-s" label="Annual step-up" suffix="%" value={s} onChange={setS} min={0} max={30} />}
      </Col>
      <Col lg={6}>
        <div className="result-box mb-3">
          <div className="label">Estimated value after {y} years</div>
          <div className="hero-val">{inrShort(res.value)}</div>
          <Row className="mt-3 g-2">
            <Col xs={6}><div className="label">You invest</div><div className="sub">{inrShort(res.invested)}</div></Col>
            <Col xs={6}><div className="label">Estimated gains</div><div className="sub">{inrShort(res.gains)}</div></Col>
          </Row>
        </div>
        <Row className="align-items-center">
          <Col sm={6}><Donut a={res.invested} b={res.gains} la="Invested" lb="Gains" /></Col>
          <Col sm={6}><Legend items={[[OLIVE_L, 'Invested'], [OLIVE, 'Est. gains']]} /><p className="small mb-0" style={{ color: 'var(--muted)' }}>Mutual fund returns are market-linked and not guaranteed. This uses a constant assumed rate for illustration.</p></Col>
        </Row>
      </Col>
      <Col xs={12}><GrowthChart rows={res.rows} /></Col>
    </Row>
  )
}

/* ---------- Eligibility ---------- */
function EligibilityCalc() {
  const [income, setIncome] = useState(80000), [ex, setEx] = useState(5000), [rate, setRate] = useState(8.75), [years, setYears] = useState(20), [foir, setFoir] = useState(50)
  const res = eligibility({ income, existingEmi: ex, rate, years, foir })
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="el-i" label="Net monthly income" prefix="₹" value={income} onChange={setIncome} min={10000} max={1000000} step={1000} />
        <SliderRow id="el-e" label="Existing EMIs per month" prefix="₹" value={ex} onChange={setEx} min={0} max={300000} step={500} />
        <SliderRow id="el-r" label="Interest rate (p.a.)" suffix="%" value={rate} onChange={setRate} min={6} max={20} step={0.05} />
        <SliderRow id="el-y" label="Tenure" suffix="yrs" value={years} onChange={setYears} min={1} max={30} />
        <SliderRow id="el-f" label="Max share of income for EMIs (FOIR)" suffix="%" value={foir} onChange={setFoir} min={30} max={65} />
      </Col>
      <Col lg={6}>
        <div className="result-box mb-3">
          <div className="label">Indicative loan you may be eligible for</div>
          <div className="hero-val">{inrShort(res.maxLoan)}</div>
          <Row className="mt-3 g-2">
            <Col xs={6}><div className="label">Max new EMI</div><div className="sub">{inr(res.maxEmi)}</div></Col>
            <Col xs={6}><div className="label">EMI room used</div><div className="sub">{income ? Math.round((ex / income) * 100) : 0}% today</div></Col>
          </Row>
        </div>
        <div className="note">Lenders typically cap total EMIs at about 40–60% of net income (FOIR). Actual eligibility also depends on credit score, employer, age and the lender's policy.</div>
        <ul className="small mt-3 mb-0" style={{ color: 'var(--muted)' }}>
          <li>Closing a small existing loan can raise eligibility quickly.</li>
          <li>Adding a co-applicant's income increases the EMI room.</li>
          <li>A longer tenure raises eligibility but increases total interest.</li>
        </ul>
      </Col>
    </Row>
  )
}

/* ---------- Retirement ---------- */
function RetirementCalc() {
  const [v, setV] = useState({ age: 28, retireAge: 60, lifeTill: 85, monthlyExpense: 40000, inflation: 6, preReturn: 11, postReturn: 7 })
  const set = (k) => (x) => setV((o) => ({ ...o, [k]: x }))
  const res = retirement(v)
  return (
    <Row className="g-4">
      <Col lg={6}>
        <Row className="g-0 gx-3">
          <Col sm={6}><SliderRow id="rt-a" label="Current age" suffix="yrs" value={v.age} onChange={set('age')} min={18} max={59} /></Col>
          <Col sm={6}><SliderRow id="rt-r" label="Retire at" suffix="yrs" value={v.retireAge} onChange={set('retireAge')} min={40} max={70} /></Col>
        </Row>
        <SliderRow id="rt-e" label="Current monthly expenses" prefix="₹" value={v.monthlyExpense} onChange={set('monthlyExpense')} min={10000} max={500000} step={1000} />
        <SliderRow id="rt-i" label="Inflation" suffix="%" value={v.inflation} onChange={set('inflation')} min={3} max={10} step={0.5} />
        <SliderRow id="rt-p" label="Return before retirement" suffix="%" value={v.preReturn} onChange={set('preReturn')} min={4} max={15} step={0.5} />
        <SliderRow id="rt-q" label="Return after retirement" suffix="%" value={v.postReturn} onChange={set('postReturn')} min={3} max={10} step={0.5} />
        <SliderRow id="rt-l" label="Plan till age" suffix="yrs" value={v.lifeTill} onChange={set('lifeTill')} min={70} max={100} />
      </Col>
      <Col lg={6}>
        <div className="result-box mb-3">
          <div className="label">Retirement corpus needed at {v.retireAge}</div>
          <div className="hero-val">{inrShort(res.corpus)}</div>
          <Row className="mt-3 g-2">
            <Col xs={6}><div className="label">Monthly SIP needed</div><div className="sub">{inr(res.monthlySip)}</div></Col>
            <Col xs={6}><div className="label">Expenses at {v.retireAge}</div><div className="sub">{inr(res.expenseAtRetire)}/mo</div></Col>
          </Row>
        </div>
        <div className="note">Your ₹{v.monthlyExpense.toLocaleString('en-IN')}/month lifestyle will cost about {inr(res.expenseAtRetire)}/month in {res.yrsToRetire} years at {v.inflation}% inflation. Starting 5 years later roughly raises the SIP needed by {Math.round((retirement({ ...v, age: v.age + 5 }).monthlySip / res.monthlySip - 1) * 100)}%.</div>
      </Col>
    </Row>
  )
}

/* ---------- Emergency fund ---------- */
function EmergencyCalc() {
  const [exp, setExp] = useState(35000), [emis, setEmis] = useState(10000), [months, setMonths] = useState(6), [saved, setSaved] = useState(80000)
  const target = (exp + emis) * months, gap = Math.max(0, target - saved), pct = Math.min(100, (saved / target) * 100 || 0)
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="ef-e" label="Monthly essential expenses" prefix="₹" value={exp} onChange={setExp} min={5000} max={300000} step={1000} />
        <SliderRow id="ef-m" label="Monthly EMIs" prefix="₹" value={emis} onChange={setEmis} min={0} max={200000} step={1000} />
        <SliderRow id="ef-n" label="Months of cover" suffix="mo" value={months} onChange={setMonths} min={3} max={12} />
        <SliderRow id="ef-s" label="Already saved" prefix="₹" value={saved} onChange={setSaved} min={0} max={3000000} step={5000} />
      </Col>
      <Col lg={6}>
        <div className="result-box mb-3">
          <div className="label">Emergency fund target</div>
          <div className="hero-val">{inr(target)}</div>
          <Row className="mt-3 g-2">
            <Col xs={6}><div className="label">Still to save</div><div className="sub">{inr(gap)}</div></Col>
            <Col xs={6}><div className="label">Save in 12 months</div><div className="sub">{inr(gap / 12)}/mo</div></Col>
          </Row>
        </div>
        <div className="fw-semibold small mb-1">{Math.round(pct)}% funded</div>
        <div className="alloc-bar"><div style={{ width: `${pct}%`, background: OLIVE }} /></div>
        <p className="small mt-3 mb-0" style={{ color: 'var(--muted)' }}>Keep it liquid: a savings account, sweep-in FD or liquid fund. Salaried with stable jobs: 6 months. Self-employed or single income: 9–12 months.</p>
      </Col>
    </Row>
  )
}

/* ---------- Budget 50/30/20 ---------- */
function BudgetCalc() {
  const [inc, setInc] = useState(75000)
  const [needs, setNeeds] = useState(38000), [wants, setWants] = useState(20000)
  const save = inc - needs - wants
  const rows = [['Needs', needs, 50, 'Rent, EMIs, groceries, bills', OLIVE], ['Wants', wants, 30, 'Eating out, shopping, trips', OLIVE_L], ['Savings & investing', save, 20, 'SIPs, emergency fund, prepayment', LIME]]
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="bd-i" label="Monthly take-home income" prefix="₹" value={inc} onChange={setInc} min={10000} max={1000000} step={1000} />
        <SliderRow id="bd-n" label="Needs (rent, EMIs, bills, groceries)" prefix="₹" value={needs} onChange={setNeeds} min={0} max={inc} step={500} />
        <SliderRow id="bd-w" label="Wants (lifestyle spending)" prefix="₹" value={wants} onChange={setWants} min={0} max={inc} step={500} />
      </Col>
      <Col lg={6}>
        <div className="result-box mb-3">
          <div className="label">Left to save & invest</div>
          <div className="hero-val" style={save < 0 ? { color: '#ffb4a2' } : {}}>{inr(save)}</div>
          <div className="label mt-2">{inc ? Math.round((save / inc) * 100) : 0}% of income · 50/30/20 target: {inr(inc * 0.2)}</div>
        </div>
        <div className="d-grid gap-3">
          {rows.map(([l, v, t, d, c]) => {
            const p = inc ? (v / inc) * 100 : 0
            return (
              <div key={l}>
                <div className="d-flex justify-content-between small fw-semibold"><span><span className="legend-dot" style={{ background: c }} />{l}</span><span>{Math.round(p)}% <span style={{ color: 'var(--muted)' }}>/ target {t}%</span></span></div>
                <div className="alloc-bar mt-1" style={{ height: 10 }}><div style={{ width: `${Math.max(0, Math.min(100, p))}%`, background: c }} /></div>
                <div className="small" style={{ color: 'var(--muted)' }}>{d}</div>
              </div>
            )
          })}
        </div>
        {save < inc * 0.2 && <div className="note mt-3">You're {inr(inc * 0.2 - save)} short of the 20% savings target. Trimming wants first is usually the easiest lever.</div>}
      </Col>
    </Row>
  )
}

/* ---------- Savings goal ---------- */
function GoalCalc() {
  const goals = [['Home down payment', 1500000, 5], ['Car', 800000, 3], ["Child's education", 2500000, 12], ['Wedding', 1200000, 4], ['Foreign trip', 300000, 2]]
  const [g, setG] = useState(0)
  const [cost, setCost] = useState(goals[0][1]), [yrs, setYrs] = useState(goals[0][2]), [infl, setInfl] = useState(6), [ret, setRet] = useState(10), [have, setHave] = useState(100000)
  const future = cost * Math.pow(1 + infl / 100, yrs)
  const fromHave = have * Math.pow(1 + ret / 100, yrs)
  const gap = Math.max(0, future - fromHave)
  const r = ret / 12 / 100, n = yrs * 12
  const monthly = gap === 0 ? 0 : r === 0 ? gap / n : (gap * r) / ((Math.pow(1 + r, n) - 1) * (1 + r))
  return (
    <Row className="g-4">
      <Col lg={6}>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {goals.map(([l, c, y], i) => <button type="button" key={l} className={`chip ${g === i ? 'on' : ''}`} onClick={() => { setG(i); setCost(c); setYrs(y) }}>{l}</button>)}
        </div>
        <SliderRow id="gl-c" label="Cost in today's money" prefix="₹" value={cost} onChange={setCost} min={50000} max={20000000} step={10000} />
        <SliderRow id="gl-y" label="Years to goal" suffix="yrs" value={yrs} onChange={setYrs} min={1} max={25} />
        <SliderRow id="gl-h" label="Already saved for it" prefix="₹" value={have} onChange={setHave} min={0} max={10000000} step={10000} />
        <SliderRow id="gl-i" label="Inflation" suffix="%" value={infl} onChange={setInfl} min={0} max={12} step={0.5} />
        <SliderRow id="gl-r" label="Expected return" suffix="%" value={ret} onChange={setRet} min={1} max={15} step={0.5} />
      </Col>
      <Col lg={6}>
        <div className="result-box mb-3">
          <div className="label">Save every month</div>
          <div className="hero-val">{inr(monthly)}</div>
          <Row className="mt-3 g-2">
            <Col xs={6}><div className="label">Goal cost in {yrs} yrs</div><div className="sub">{inrShort(future)}</div></Col>
            <Col xs={6}><div className="label">Savings will grow to</div><div className="sub">{inrShort(fromHave)}</div></Col>
          </Row>
        </div>
        <div className="note">{yrs <= 3 ? 'For goals under 3 years, debt options like FDs or short-duration funds are generally less volatile than equity.' : 'Longer goals can take some equity exposure; shift towards safer options as the goal date nears.'} Returns are assumed, not guaranteed.</div>
      </Col>
    </Row>
  )
}

const TABS = [
  ['emi', 'bi-house-door', 'EMI', EmiCalc],
  ['sip', 'bi-graph-up-arrow', 'SIP & Lumpsum', SipCalc],
  ['elig', 'bi-patch-check', 'Loan eligibility', EligibilityCalc],
  ['retire', 'bi-sunset', 'Retirement', RetirementCalc],
  ['emergency', 'bi-life-preserver', 'Emergency fund', EmergencyCalc],
  ['budget', 'bi-wallet2', 'Budget 50/30/20', BudgetCalc],
  ['goal', 'bi-flag', 'Savings goal', GoalCalc],
]

const LIBRARY = {
  'Loan': ['Balance transfer', 'Prepayment savings', 'Debt consolidation', 'Credit card repayment'],
  'Investment': ['SIP vs lumpsum', 'CAGR', 'XIRR', 'Inflation', 'Compound interest'],
  'Planning & funds': ['Net worth', 'Tax regime comparison', 'Fund overlap checker', 'NPS / PPF planner'],
}

export default function Calculators({ onBook }) {
  return (
    <section className="section" id="tools">
      <Container>
        <Row className="mb-4 g-3 align-items-end">
          <Col lg={8}>
            <span className="eyebrow"><i className="bi bi-calculator" />Free financial calculators</span>
            <h2 className="section-title mb-2">Run your numbers in seconds.</h2>
            <p className="lead-sm mb-0">Drag the sliders or type exact values. Everything is calculated in your browser — nothing is stored.</p>
          </Col>
        </Row>
        <Tab.Container defaultActiveKey="emi">
          <div className="calc-shell mb-4">
            <Nav className="calc-nav" role="tablist">
              {TABS.map(([k, icon, l]) => (
                <Nav.Link key={k} eventKey={k}><i className={`bi ${icon}`} />{l}</Nav.Link>
              ))}
            </Nav>
            <Tab.Content className="calc-body">
              {TABS.map(([k, , , C]) => <Tab.Pane eventKey={k} key={k} mountOnEnter><C /></Tab.Pane>)}
            </Tab.Content>
          </div>
        </Tab.Container>

        <Row className="g-4 align-items-stretch">
          {Object.entries(LIBRARY).map(([cat, list]) => (
            <Col md={4} key={cat}>
              <h6 className="fw-bold mb-3">{cat} tools</h6>
              <div className="d-grid gap-2 tool-list">
                {list.map((t) => <div className="tool-item" key={t}><i className="bi bi-calculator text-olive" />{t}<span className="soon">Coming soon</span></div>)}
              </div>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button className="btn-olive" onClick={onBook}>Get these numbers reviewed by an expert <i className="bi bi-arrow-right ms-1" /></Button>
        </div>
      </Container>
    </section>
  )
}
