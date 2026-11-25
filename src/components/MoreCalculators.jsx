import { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { inr, inrShort, balanceTransfer, prepayment, cardPayoff, cagr, compound, futureCost, ppf, taxNew, taxOld } from '../utils/finance.js'
import { SliderRow } from './Calculators.jsx'

const OLIVE = '#1F7A45', OLIVE_L = '#8CC9A0'
const axis = { fontSize: 12, fill: '#5F6662' }
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

function Growth({ rows }) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer>
        <AreaChart data={rows} margin={{ left: 4, right: 4 }}>
          <CartesianGrid vertical={false} stroke="#E4E8E5" />
          <XAxis dataKey="year" tick={axis} interval="preserveStartEnd" />
          <YAxis tick={axis} tickFormatter={(v) => inrShort(v).replace('₹', '')} width={60} />
          <Tooltip formatter={(v) => inr(v)} />
          <Area type="monotone" dataKey="value" name="Value" stroke={OLIVE} fill={OLIVE} fillOpacity={0.18} strokeWidth={2.5} />
          <Area type="monotone" dataKey="invested" name="Invested" stroke={OLIVE_L} fill={OLIVE_L} fillOpacity={0.35} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ---------- Loans ---------- */
export function BalanceTransferCalc() {
  const [o, setO] = useState(3000000), [cr, setCr] = useState(9.5), [nr, setNr] = useState(8.5), [y, setY] = useState(15), [fp, setFp] = useState(0.5), [ff, setFf] = useState(0)
  const r = balanceTransfer({ outstanding: o, curRate: cr, newRate: nr, months: y * 12, feePct: fp, feeFlat: ff })
  const good = r.saving > 0
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="bt-o" label="Outstanding loan" prefix="₹" value={o} onChange={setO} min={100000} max={20000000} step={50000} />
        <SliderRow id="bt-c" label="Current interest rate" suffix="%" value={cr} onChange={setCr} min={6} max={18} step={0.05} />
        <SliderRow id="bt-n" label="New lender's rate" suffix="%" value={nr} onChange={setNr} min={6} max={18} step={0.05} />
        <SliderRow id="bt-y" label="Remaining tenure" suffix="yrs" value={y} onChange={setY} min={1} max={30} />
        <SliderRow id="bt-f" label="Processing fee" suffix="%" value={fp} onChange={setFp} min={0} max={3} step={0.05} />
        <SliderRow id="bt-ff" label="Other one-time charges (legal, valuation)" prefix="₹" value={ff} onChange={setFf} min={0} max={100000} step={1000} />
      </Col>
      <Col lg={6}>
        <Result label={good ? 'You could save' : 'Switching would cost you more'} value={inr(Math.abs(r.saving))} warn={!good}
          items={[['EMI now', inr(r.e1)], ['EMI after switch', inr(r.e2)], ['Switching cost', inr(r.fee)], ['Fee recovered in', r.breakEven === Infinity ? '—' : `${r.breakEven} months`]]} />
        <div className="note">A balance transfer usually makes sense when the rate gap is at least 0.5% and plenty of tenure remains. Also ask your current bank to match the new rate first: many do, for a small fee.</div>
      </Col>
    </Row>
  )
}

export function PrepaymentCalc() {
  const [o, setO] = useState(3000000), [rt, setRt] = useState(8.5), [y, setY] = useState(20), [lump, setLump] = useState(200000), [extra, setExtra] = useState(5000)
  const r = prepayment({ outstanding: o, rate: rt, months: y * 12, lump: Math.min(lump, o), extra })
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="pp-o" label="Outstanding loan" prefix="₹" value={o} onChange={setO} min={100000} max={20000000} step={50000} />
        <SliderRow id="pp-r" label="Interest rate" suffix="%" value={rt} onChange={setRt} min={6} max={18} step={0.05} />
        <SliderRow id="pp-y" label="Remaining tenure" suffix="yrs" value={y} onChange={setY} min={1} max={30} />
        <SliderRow id="pp-l" label="One-time prepayment now" prefix="₹" value={lump} onChange={setLump} min={0} max={5000000} step={10000} />
        <SliderRow id="pp-e" label="Extra every month" prefix="₹" value={extra} onChange={setExtra} min={0} max={100000} step={500} />
      </Col>
      <Col lg={6}>
        <Result label="Interest you save" value={inr(r.saving)}
          items={[['Loan closes in', yrs(r.monthsLeft)], ['Time saved', yrs(r.monthsSaved)], ['Interest without prepaying', inrShort(r.interestBase)], ['Interest with prepaying', inrShort(r.interestNew)]]} />
        <div className="note">This keeps your EMI the same ({inr(r.emi)}) and shortens the loan. Individuals usually pay no prepayment penalty on floating-rate home loans, but confirm with your lender.</div>
      </Col>
    </Row>
  )
}

export function CardPayoffCalc() {
  const [b, setB] = useState(100000), [mr, setMr] = useState(3.5), [pay, setPay] = useState(5000)
  const r = cardPayoff({ balance: b, monthlyRate: mr, pay })
  const minPay = Math.ceil(b * mr / 100) + 1
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="cc-b" label="Card balance" prefix="₹" value={b} onChange={setB} min={5000} max={1000000} step={1000} />
        <SliderRow id="cc-r" label="Monthly interest rate" suffix="%" value={mr} onChange={setMr} min={1} max={4.5} step={0.05} />
        <SliderRow id="cc-p" label="You pay every month" prefix="₹" value={pay} onChange={setPay} min={500} max={200000} step={500} />
        <p className="small" style={muted}>Cards typically charge about 3–3.75% a month (around 36–45% a year). Check your statement for your card's rate.</p>
      </Col>
      <Col lg={6}>
        {r.months === Infinity ? (
          <Result label="At this payment the balance never reduces" value="Pay more" warn items={[['Interest each month', inr(b * mr / 100)], ['Pay at least', inr(minPay) + '/mo']]} />
        ) : (
          <Result label="Interest you will pay" value={inr(r.interest)} warn={r.interest > b * 0.3}
            items={[['Debt-free in', yrs(r.months)], ['Total paid', inr(b + r.interest)]]} />
        )}
        <div className="note">Paying only the "minimum due" keeps you in debt for years. Converting the balance to an EMI or a personal loan at a lower rate can cut the interest sharply.</div>
      </Col>
    </Row>
  )
}

/* ---------- Investing ---------- */
export function CagrCalc() {
  const [s, setS] = useState(100000), [e, setE] = useState(200000), [y, setY] = useState(5)
  const g = cagr(s, e, y)
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="cg-s" label="Starting value" prefix="₹" value={s} onChange={setS} min={1000} max={10000000} step={1000} />
        <SliderRow id="cg-e" label="Ending value" prefix="₹" value={e} onChange={setE} min={1000} max={50000000} step={1000} />
        <SliderRow id="cg-y" label="Years held" suffix="yrs" value={y} onChange={setY} min={1} max={40} />
      </Col>
      <Col lg={6}>
        <Result label="Compound annual growth rate (CAGR)" value={`${g.toFixed(2)}%`} warn={g < 0}
          items={[['Total growth', `${(((e / s) - 1) * 100).toFixed(1)}%`], ['Money multiplied', `${(e / s).toFixed(2)}×`]]} />
        <div className="note">CAGR is the steady yearly rate that turns the starting value into the ending value. It suits a one-time investment; for SIPs with many instalments, XIRR is the right measure.</div>
      </Col>
    </Row>
  )
}

export function FdCalc() {
  const [p, setP] = useState(100000), [r, setR] = useState(7), [y, setY] = useState(5), [f, setF] = useState(4)
  const res = compound(p, r, y, f)
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="fd-p" label="Deposit amount" prefix="₹" value={p} onChange={setP} min={1000} max={10000000} step={1000} />
        <SliderRow id="fd-r" label="Interest rate" suffix="%" value={r} onChange={setR} min={1} max={10} step={0.05} />
        <SliderRow id="fd-y" label="Tenure" suffix="yrs" value={y} onChange={setY} min={1} max={10} />
        <Form.Label htmlFor="fd-f">Compounding</Form.Label>
        <Form.Select id="fd-f" value={f} onChange={(e) => setF(Number(e.target.value))}>
          <option value={1}>Yearly</option><option value={2}>Half-yearly</option><option value={4}>Quarterly (most bank FDs)</option><option value={12}>Monthly</option>
        </Form.Select>
      </Col>
      <Col lg={6}>
        <Result label="Maturity value" value={inr(res.value)} items={[['Interest earned', inr(res.interest)], ['Effective yearly yield', `${res.effective.toFixed(2)}%`]]} />
        <Growth rows={res.rows} />
        <p className="small mt-2 mb-0" style={muted}>FD interest is taxed at your income-tax slab rate. Before tax.</p>
      </Col>
    </Row>
  )
}

export function InflationCalc() {
  const [c, setC] = useState(50000), [i, setI] = useState(6), [y, setY] = useState(10)
  const fut = futureCost(c, i, y)
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="in-c" label="Cost today (or your monthly expenses)" prefix="₹" value={c} onChange={setC} min={1000} max={10000000} step={1000} />
        <SliderRow id="in-i" label="Inflation" suffix="%" value={i} onChange={setI} min={1} max={12} step={0.5} />
        <SliderRow id="in-y" label="Years from now" suffix="yrs" value={y} onChange={setY} min={1} max={40} />
      </Col>
      <Col lg={6}>
        <Result label={`The same thing will cost in ${y} years`} value={inr(fut)}
          items={[['Price rise', `${((fut / c - 1) * 100).toFixed(0)}%`], [`₹${c.toLocaleString('en-IN')} today will buy`, `${inr(c * c / fut)} worth`]]} />
        <div className="note">Money kept in a savings account earning less than inflation quietly loses value. Long goals need investments that can beat inflation over time.</div>
      </Col>
    </Row>
  )
}

/* ---------- Planning & tax ---------- */
export function PpfCalc() {
  const [a, setA] = useState(150000), [r, setR] = useState(7.1), [y, setY] = useState(15)
  const res = ppf(Math.min(a, 150000), r, y)
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="pf-a" label="Yearly deposit (max ₹1.5 lakh)" prefix="₹" value={a} onChange={setA} min={500} max={150000} step={500} />
        <SliderRow id="pf-r" label="Interest rate" suffix="%" value={r} onChange={setR} min={6} max={9} step={0.05} />
        <SliderRow id="pf-y" label="Years (15, extendable in 5-year blocks)" suffix="yrs" value={y} onChange={setY} min={15} max={50} step={5} />
        <p className="small" style={muted}>The PPF rate is 7.1% for Oct–Dec 2026. The government reviews it every quarter.</p>
      </Col>
      <Col lg={6}>
        <Result label={`PPF value after ${y} years`} value={inrShort(res.value)} items={[['You deposit', inrShort(res.invested)], ['Interest earned (tax-free)', inrShort(res.interest)]]} />
        <Growth rows={res.rows} />
        <p className="small mt-2 mb-0" style={muted}>Assumes you deposit at the start of each year (before 5 April) and the rate stays the same.</p>
      </Col>
    </Row>
  )
}

function NwInputs({ list, state, set }) {
  return (
    <Row className="g-2">
      {list.map(([k, lbl]) => (
        <Col sm={6} key={k}>
          <Form.Label htmlFor={`nw-${k}`} className="small mb-1">{lbl}</Form.Label>
          <Form.Control id={`nw-${k}`} type="number" min={0} step={1000} value={state[k]} onChange={(e) => set((o) => ({ ...o, [k]: Math.max(0, Number(e.target.value) || 0) }))} />
        </Col>
      ))}
    </Row>
  )
}

export function NetWorthCalc() {
  const [a, setA] = useState({ cash: 150000, fd: 200000, mf: 400000, stocks: 150000, epf: 300000, gold: 100000, property: 0, other: 0 })
  const [l, setL] = useState({ home: 0, car: 300000, personal: 0, card: 20000, other: 0 })
  const A = [['cash', 'Bank & cash'], ['fd', 'FDs & RDs'], ['mf', 'Mutual funds'], ['stocks', 'Stocks'], ['epf', 'EPF / PPF / NPS'], ['gold', 'Gold'], ['property', 'Property (market value)'], ['other', 'Other assets']]
  const L = [['home', 'Home loan'], ['car', 'Car / vehicle loan'], ['personal', 'Personal loan'], ['card', 'Credit card dues'], ['other', 'Other debts']]
  const ta = Object.values(a).reduce((s, v) => s + v, 0), tl = Object.values(l).reduce((s, v) => s + v, 0), nw = ta - tl
  return (
    <Row className="g-4">
      <Col lg={7}>
        <h6 className="fw-bold">What you own</h6>
        <NwInputs list={A} state={a} set={setA} />
        <h6 className="fw-bold mt-4">What you owe</h6>
        <NwInputs list={L} state={l} set={setL} />
      </Col>
      <Col lg={5}>
        <Result label="Your net worth" value={inr(nw)} warn={nw < 0} items={[['Assets', inrShort(ta)], ['Liabilities', inrShort(tl)]]} />
        <div className="fw-semibold small mb-1">Debt is {ta ? Math.round((tl / ta) * 100) : 0}% of your assets</div>
        <div className="alloc-bar"><div style={{ width: `${Math.min(100, ta ? (tl / ta) * 100 : 0)}%`, background: OLIVE }} /></div>
        <p className="small mt-3 mb-0" style={muted}>Work it out once a year, on the same date, to see whether you are moving forward.</p>
      </Col>
    </Row>
  )
}

export function TaxRegimeCalc() {
  const [g, setG] = useState(1500000), [sal, setSal] = useState(true)
  const [d, setD] = useState({ c80: 150000, d80: 25000, hra: 0, homeInt: 0, nps: 0, other: 0 })
  const D = [['c80', '80C (EPF, PPF, ELSS, LIC…) max ₹1.5 L', 150000], ['d80', '80D health insurance', 100000], ['hra', 'HRA exemption', 2000000], ['homeInt', 'Home loan interest (self-occupied) max ₹2 L', 200000], ['nps', '80CCD(1B) NPS max ₹50,000', 50000], ['other', 'Other deductions', 2000000]]
  const ded = D.reduce((s, [k, , max]) => s + Math.min(d[k], max), 0)
  const n = taxNew(g, sal), o = taxOld(g, ded, sal)
  const better = n.tax <= o.tax ? 'New regime' : 'Old regime'
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="tx-g" label="Gross yearly income" prefix="₹" value={g} onChange={setG} min={300000} max={5000000} step={10000} />
        <Form.Check type="switch" id="tx-sal" className="mb-3" label="Salaried or pensioner (gets the standard deduction)" checked={sal} onChange={(e) => setSal(e.target.checked)} />
        <h6 className="fw-bold">Deductions you claim (old regime only)</h6>
        <Row className="g-2">
          {D.map(([k, lbl, max]) => (
            <Col sm={6} key={k}>
              <Form.Label htmlFor={`tx-${k}`} className="small mb-1">{lbl}</Form.Label>
              <Form.Control id={`tx-${k}`} type="number" min={0} max={max} step={1000} value={d[k]} onChange={(e) => setD((x) => ({ ...x, [k]: Math.max(0, Number(e.target.value) || 0) }))} />
            </Col>
          ))}
        </Row>
      </Col>
      <Col lg={6}>
        <Result label={`${better} saves you`} value={inr(Math.abs(n.tax - o.tax))}
          items={[['Tax · new regime', inr(n.tax)], ['Tax · old regime', inr(o.tax)], ['Taxable · new', inrShort(n.taxable)], ['Taxable · old', inrShort(o.taxable)]]} />
        <div className="note">FY 2026-27 slabs, unchanged in Budget 2026. New regime: nil up to ₹4 L, then 5% → 30%; no tax up to ₹12 L taxable income (Sec 87A rebate), ₹75,000 standard deduction. Old regime: nil up to ₹2.5 L, 5% / 20% / 30%; ₹50,000 standard deduction. Includes 4% cess. For residents below 60 with income up to ₹50 L; capital gains and surcharge are not included. Section names follow the old Act, which most people still use. Educational estimate, so confirm with a tax professional.</div>
      </Col>
    </Row>
  )
}
