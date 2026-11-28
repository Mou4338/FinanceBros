import { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { inr, inrShort, emi } from '../utils/finance.js'
import { SliderRow } from './Calculators.jsx'

const muted = { color: 'var(--muted)' }
const yrs = (m) => (m === Infinity ? 'Never' : `${Math.floor(m / 12)} yr ${m % 12} mo`)

function Result({ label, value, items = [], warn }) {
  return (
    <div className="result-box mb-3">
      <div className="label">{label}</div>
      <div className="hero-val" style={warn ? { color: '#ffb4a2' } : {}}>{value}</div>
      {items.length > 0 && (
        <Row className="mt-3 g-2">
          {items.map(([l, v]) => <Col xs={6} key={l}><div className="label">{l}</div><div className="sub">{v}</div></Col>)}
        </Row>
      )}
    </div>
  )
}

/* ---------- XIRR: true yearly return for SIPs / irregular investments ---------- */
function xirr(flows) {
  // flows: [{ date: Date, amount }], investments negative, value received positive
  const t0 = flows[0].date
  const yearsOf = (d) => (d - t0) / (365 * 864e5)
  const npv = (r) => flows.reduce((s, f) => s + f.amount / Math.pow(1 + r, yearsOf(f.date)), 0)
  let lo = -0.99, hi = 10
  if (npv(lo) * npv(hi) > 0) return null
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    if (npv(lo) * npv(mid) <= 0) hi = mid; else lo = mid
  }
  return ((lo + hi) / 2) * 100
}
const today = () => new Date().toISOString().slice(0, 10)
const monthsAgo = (n) => { const d = new Date(); d.setMonth(d.getMonth() - n); return d.toISOString().slice(0, 10) }

export function XirrCalc() {
  const [rows, setRows] = useState([
    { date: monthsAgo(36), amount: 100000 },
    { date: monthsAgo(24), amount: 50000 },
    { date: monthsAgo(12), amount: 50000 },
  ])
  const [value, setValue] = useState(260000), [valDate, setValDate] = useState(today())
  const set = (i, k, v) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)))
  const valid = rows.filter((r) => r.date && r.amount > 0)
  const flows = [...valid.map((r) => ({ date: new Date(r.date), amount: -r.amount })), { date: new Date(valDate), amount: value }].sort((a, b) => a.date - b.date)
  const invested = valid.reduce((s, r) => s + Number(r.amount), 0)
  const rate = valid.length && value > 0 ? xirr(flows) : null
  return (
    <Row className="g-4">
      <Col lg={7}>
        <h6 className="fw-bold">Money you put in</h6>
        {rows.map((r, i) => (
          <Row className="g-2 mb-2 align-items-end" key={i}>
            <Col xs={5}><Form.Label htmlFor={`xd-${i}`} className="small mb-1">Date</Form.Label><Form.Control id={`xd-${i}`} type="date" value={r.date} max={valDate} onChange={(e) => set(i, 'date', e.target.value)} /></Col>
            <Col xs={5}><Form.Label htmlFor={`xa-${i}`} className="small mb-1">Amount (₹)</Form.Label><Form.Control id={`xa-${i}`} type="number" min={0} step={500} value={r.amount} onChange={(e) => set(i, 'amount', Number(e.target.value) || 0)} /></Col>
            <Col xs={2}><Button className="btn-ghost w-100" aria-label="Remove row" disabled={rows.length === 1} onClick={() => setRows((x) => x.filter((_, j) => j !== i))}><i className="bi bi-x-lg" /></Button></Col>
          </Row>
        ))}
        <Button size="sm" className="btn-ghost mb-4" onClick={() => setRows((r) => [...r, { date: today(), amount: 5000 }])}><i className="bi bi-plus-lg me-1" />Add investment</Button>
        <h6 className="fw-bold">What it's worth now</h6>
        <Row className="g-2">
          <Col xs={6}><Form.Label htmlFor="xv" className="small mb-1">Current value (₹)</Form.Label><Form.Control id="xv" type="number" min={0} step={1000} value={value} onChange={(e) => setValue(Number(e.target.value) || 0)} /></Col>
          <Col xs={6}><Form.Label htmlFor="xvd" className="small mb-1">As on</Form.Label><Form.Control id="xvd" type="date" value={valDate} onChange={(e) => setValDate(e.target.value)} /></Col>
        </Row>
      </Col>
      <Col lg={5}>
        <Result label="Your XIRR (true yearly return)" value={rate == null ? '—' : `${rate.toFixed(2)}%`} warn={rate != null && rate < 0}
          items={[['Total invested', inr(invested)], ['Gain', inr(value - invested)]]} />
        <div className="note">XIRR accounts for <em>when</em> each rupee went in, so it's the right return for SIPs and top-ups. Compare it with an FD rate or the fund's benchmark over the same period.</div>
      </Col>
    </Row>
  )
}

/* ---------- Debt payoff planner: avalanche vs snowball ---------- */
function payoff(debts, extra, order) {
  let ds = debts.filter((d) => d.balance > 0).map((d) => ({ ...d }))
  if (!ds.length) return { months: 0, interest: 0, order: [] }
  const sorted = (arr) => [...arr].sort(order === 'avalanche' ? (a, b) => b.rate - a.rate : (a, b) => a.balance - b.balance)
  const budget = ds.reduce((s, d) => s + d.min, 0) + extra
  if (budget <= ds.reduce((s, d) => s + d.balance * d.rate / 1200, 0)) return { months: Infinity, interest: Infinity, order: [] }
  let m = 0, interest = 0
  const done = []
  while (ds.some((d) => d.balance > 0.5) && m < 600) {
    m++
    ds.forEach((d) => { if (d.balance > 0) { const i = d.balance * d.rate / 1200; interest += i; d.balance += i } })
    let left = budget
    ds.forEach((d) => { if (d.balance > 0) { const p = Math.min(d.min, d.balance); d.balance -= p; left -= p } })
    for (const d of sorted(ds.filter((x) => x.balance > 0))) { const p = Math.min(left, d.balance); d.balance -= p; left -= p; if (left <= 0) break }
    ds.forEach((d) => { if (d.balance <= 0.5 && !done.includes(d.name)) { d.balance = 0; done.push(d.name) } })
  }
  if (ds.some((d) => d.balance > 0.5)) return { months: Infinity, interest: Infinity, order: done }
  return { months: m, interest, order: done }
}

export function DebtPayoffCalc() {
  const [debts, setDebts] = useState([
    { name: 'Credit card', balance: 80000, rate: 42, min: 4000 },
    { name: 'Personal loan', balance: 300000, rate: 14, min: 10000 },
    { name: 'Two-wheeler loan', balance: 40000, rate: 11, min: 3000 },
  ])
  const [extra, setExtra] = useState(5000)
  const set = (i, k, v) => setDebts((r) => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)))
  const av = payoff(debts, extra, 'avalanche'), sb = payoff(debts, extra, 'snowball')
  const saved = sb.interest - av.interest
  return (
    <Row className="g-4">
      <Col lg={7}>
        <h6 className="fw-bold">Your debts</h6>
        <div className="scroll">
          <table className="table align-middle mb-2 debt-table">
            <thead><tr><th>Name</th><th>Balance ₹</th><th>Rate %/yr</th><th>Min ₹/mo</th><th></th></tr></thead>
            <tbody>{debts.map((d, i) => (
              <tr key={i}>
                <td><Form.Control size="sm" aria-label="Debt name" value={d.name} onChange={(e) => set(i, 'name', e.target.value)} /></td>
                <td><Form.Control size="sm" type="number" aria-label="Balance" min={0} step={1000} value={d.balance} onChange={(e) => set(i, 'balance', Number(e.target.value) || 0)} /></td>
                <td><Form.Control size="sm" type="number" aria-label="Interest rate" min={0} step={0.5} value={d.rate} onChange={(e) => set(i, 'rate', Number(e.target.value) || 0)} /></td>
                <td><Form.Control size="sm" type="number" aria-label="Minimum payment" min={0} step={500} value={d.min} onChange={(e) => set(i, 'min', Number(e.target.value) || 0)} /></td>
                <td><Button size="sm" className="btn-ghost" aria-label="Remove debt" disabled={debts.length === 1} onClick={() => setDebts((x) => x.filter((_, j) => j !== i))}><i className="bi bi-x-lg" /></Button></td>
              </tr>))}
            </tbody>
          </table>
        </div>
        <Button size="sm" className="btn-ghost mb-4" disabled={debts.length >= 6} onClick={() => setDebts((r) => [...r, { name: 'Other loan', balance: 50000, rate: 12, min: 2000 }])}><i className="bi bi-plus-lg me-1" />Add debt</Button>
        <SliderRow id="dp-x" label="Extra you can pay each month" prefix="₹" value={extra} onChange={setExtra} min={0} max={100000} step={500} />
      </Col>
      <Col lg={5}>
        {av.months === Infinity ? (
          <Result label="Your payments don't cover the interest" value="Pay more" warn items={[['Total minimums', inr(debts.reduce((s, d) => s + d.min, 0))]]} />
        ) : (
          <Result label="Debt-free in (avalanche method)" value={yrs(av.months)}
            items={[['Interest · avalanche', inr(av.interest)], ['Interest · snowball', inr(sb.interest)], ['Avalanche saves', inr(Math.max(0, saved))], ['Snowball done in', yrs(sb.months)]]} />
        )}
        <div className="note mb-2"><b>Avalanche:</b> pay minimums on all, put every extra rupee on the <b>highest-rate</b> debt first. It costs the least.</div>
        <div className="note"><b>Snowball:</b> clear the <b>smallest balance</b> first for quick wins. It costs a little more, but helps some people stay motivated.</div>
        {av.order.length > 0 && av.months !== Infinity && <p className="small mt-3 mb-0" style={muted}>Avalanche order: {av.order.join(' → ')}</p>}
      </Col>
    </Row>
  )
}

/* ---------- Home affordability ---------- */
// RBI loan-to-value caps for housing loans: up to ₹30 L → 90%, ₹30–75 L → 80%, above ₹75 L → 75%
const ltv = (price) => (price <= 3000000 ? 0.9 : price <= 7500000 ? 0.8 : 0.75)
export function AffordCalc() {
  const [inc, setInc] = useState(120000), [ex, setEx] = useState(10000), [down, setDown] = useState(1500000)
  const [rate, setRate] = useState(8.5), [years, setYears] = useState(20), [foir, setFoir] = useState(45), [costs, setCosts] = useState(7)
  const maxEmi = Math.max(0, inc * foir / 100 - ex)
  const perLakh = emi(100000, rate, years * 12)
  const maxLoan = perLakh ? maxEmi / perLakh * 100000 : 0
  // highest price where: loan needed ≤ maxLoan, loan ≤ LTV × price, and down payment covers the rest + registration costs
  let price = 0
  for (let p = 100000; p <= 100000000; p += 50000) {
    const loan = Math.min(maxLoan, ltv(p) * p)
    if (loan + down - p * costs / 100 >= p) price = p; else if (p > (maxLoan + down) * 1.2) break
  }
  const loanUsed = Math.max(0, Math.min(maxLoan, price * (1 + costs / 100) - down))
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="af-i" label="Household take-home income / month" prefix="₹" value={inc} onChange={setInc} min={20000} max={1000000} step={5000} />
        <SliderRow id="af-e" label="Existing EMIs / month" prefix="₹" value={ex} onChange={setEx} min={0} max={300000} step={1000} />
        <SliderRow id="af-d" label="Savings for down payment & costs" prefix="₹" value={down} onChange={setDown} min={0} max={20000000} step={50000} />
        <SliderRow id="af-r" label="Home loan rate" suffix="%" value={rate} onChange={setRate} min={6} max={14} step={0.05} />
        <SliderRow id="af-y" label="Loan tenure" suffix="yrs" value={years} onChange={setYears} min={5} max={30} />
        <SliderRow id="af-f" label="Max share of income for all EMIs" suffix="%" value={foir} onChange={setFoir} min={30} max={60} />
        <SliderRow id="af-c" label="Stamp duty, registration & other costs" suffix="%" value={costs} onChange={setCosts} min={0} max={12} step={0.5} />
      </Col>
      <Col lg={6}>
        <Result label="Home price you can afford" value={inrShort(price)} warn={price === 0}
          items={[['Home loan', inrShort(loanUsed)], ['New EMI', inr(emi(loanUsed, rate, years * 12))], ['Your money in', inrShort(Math.min(down, price * (1 + costs / 100)))], ['Loan-to-value cap', `${Math.round(ltv(price) * 100)}%`]]} />
        <div className="note">Banks lend at most 75–90% of the property value (RBI rules), and stamp duty and registration are paid from your own pocket. Keep 6 months of expenses aside as an emergency fund even after the down payment.</div>
      </Col>
    </Row>
  )
}

/* ---------- EPF corpus ---------- */
export function EpfCalc() {
  const [basic, setBasic] = useState(40000), [age, setAge] = useState(28), [retire, setRetire] = useState(58)
  const [bal, setBal] = useState(200000), [hike, setHike] = useState(6), [rate, setRate] = useState(8.25), [vpf, setVpf] = useState(0)
  let b = bal, w = basic, invested = 0
  const years = Math.max(0, retire - age)
  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      const eps = Math.min(0.0833 * w, 1250)            // pension (EPS) share of the employer's 12%
      const c = 0.12 * w + (0.12 * w - eps) + (vpf / 100) * w
      invested += c
      b = b * (1 + rate / 1200) + c
    }
    w *= 1 + hike / 100
  }
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="ep-b" label="Basic + DA per month" prefix="₹" value={basic} onChange={setBasic} min={5000} max={500000} step={1000} />
        <Row className="g-0 gx-3">
          <Col sm={6}><SliderRow id="ep-a" label="Your age" suffix="yrs" value={age} onChange={setAge} min={18} max={57} /></Col>
          <Col sm={6}><SliderRow id="ep-r" label="Retire at" suffix="yrs" value={retire} onChange={setRetire} min={45} max={60} /></Col>
        </Row>
        <SliderRow id="ep-c" label="Current EPF balance" prefix="₹" value={bal} onChange={setBal} min={0} max={10000000} step={10000} />
        <SliderRow id="ep-h" label="Yearly salary increase" suffix="%" value={hike} onChange={setHike} min={0} max={15} step={0.5} />
        <SliderRow id="ep-v" label="Voluntary PF (VPF), % of basic" suffix="%" value={vpf} onChange={setVpf} min={0} max={50} />
        <SliderRow id="ep-i" label="EPF interest rate" suffix="%" value={rate} onChange={setRate} min={6} max={10} step={0.05} />
        <p className="small" style={muted}>EPF paid 8.25% for FY 2025-26. You put in 12% of basic; your employer's 12% is split between EPF and the pension scheme (EPS).</p>
      </Col>
      <Col lg={6}>
        <Result label={`EPF corpus at ${retire}`} value={inrShort(b)}
          items={[['Contributions from now', inrShort(invested)], ['Interest earned', inrShort(b - bal - invested)], ['This month into EPF', inr(0.12 * basic + 0.12 * basic - Math.min(0.0833 * basic, 1250) + vpf / 100 * basic)], ['Years to go', `${years}`]]} />
        <div className="note">Leave EPF untouched when you switch jobs (transfer it, don't withdraw). It's one of the safest, tax-efficient pieces of your retirement. Interest on employee contributions above ₹2.5 lakh a year is taxable.</div>
      </Col>
    </Row>
  )
}

/* ---------- Gratuity ---------- */
export function GratuityCalc() {
  const [w, setW] = useState(50000), [y, setY] = useState(7), [mo, setMo] = useState(4), [govt, setGovt] = useState(false)
  const years = y + (mo > 6 ? 1 : 0)          // more than 6 months counts as a full year
  const amount = (15 / 26) * w * years
  const exempt = govt ? amount : Math.min(amount, 2000000)
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="gr-w" label="Last drawn monthly wages (basic + DA)" prefix="₹" value={w} onChange={setW} min={5000} max={1000000} step={1000} />
        <SliderRow id="gr-y" label="Completed years of service" suffix="yrs" value={y} onChange={setY} min={1} max={45} />
        <SliderRow id="gr-m" label="Extra months in the last year" suffix="mo" value={mo} onChange={setMo} min={0} max={11} />
        <Form.Check type="switch" id="gr-g" label="Government employee" checked={govt} onChange={(e) => setGovt(e.target.checked)} />
      </Col>
      <Col lg={6}>
        <Result label="Gratuity amount" value={inr(amount)} items={[['Years counted', `${years}`], ['Tax-free part', inr(exempt)], ['Taxable part', inr(amount - exempt)]]} />
        <div className="note">Formula: 15 days' wages for every completed year, with a month taken as 26 working days (15/26 × wages × years). Most employees qualify after 5 years of continuous service; under the labour codes in force from 21 Nov 2025, fixed-term employees qualify after 1 year. For private-sector employees, up to ₹20 lakh is tax-free. Your employer's policy and wage definition can change the exact figure.</div>
      </Col>
    </Row>
  )
}
