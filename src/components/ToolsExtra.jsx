import { useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { inr, inrShort, emi, sip } from '../utils/finance.js'
import { SliderRow } from './Calculators.jsx'

const G = '#1F7A45', GL = '#8CC9A0'
const axis = { fontSize: 12, fill: '#5F6662' }
const muted = { color: 'var(--muted)' }

function Result({ label, value, items = [], warn }) {
  return (
    <div className="result-box mb-3">
      <div className="label">{label}</div>
      <div className="hero-val" style={warn ? { color: '#ffb4a2' } : {}}>{value}</div>
      {items.length > 0 && <Row className="mt-3 g-2">{items.map(([l, v]) => <Col xs={6} key={l}><div className="label">{l}</div><div className="sub">{v}</div></Col>)}</Row>}
    </div>
  )
}

function Lines({ rows, a, b }) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer>
        <AreaChart data={rows} margin={{ left: 4, right: 4 }}>
          <CartesianGrid vertical={false} stroke="#E4E8E5" />
          <XAxis dataKey="year" tick={axis} interval="preserveStartEnd" />
          <YAxis tick={axis} tickFormatter={(v) => inrShort(v).replace('₹', '')} width={60} />
          <Tooltip formatter={(v) => inr(v)} />
          <Area type="monotone" dataKey="a" name={a} stroke={G} fill={G} fillOpacity={0.18} strokeWidth={2.5} />
          {b && <Area type="monotone" dataKey="b" name={b} stroke={GL} fill={GL} fillOpacity={0.3} strokeWidth={2} />}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ---------- Rent vs buy ---------- */
export function RentBuyCalc() {
  const [price, setPrice] = useState(8000000), [down, setDown] = useState(20), [rate, setRate] = useState(8.5), [yrs, setYrs] = useState(20)
  const [rent, setRent] = useState(25000), [rentUp, setRentUp] = useState(5), [appr, setAppr] = useState(5), [ret, setRet] = useState(10), [costs, setCosts] = useState(7)
  const loan = price * (1 - down / 100), months = yrs * 12, e = emi(loan, rate, months)
  const r = rate / 1200, ir = ret / 1200
  let bal = loan, inv = price * down / 100 + price * costs / 100, rnt = rent
  const rows = []
  for (let m = 1; m <= months; m++) {
    bal = Math.max(0, bal * (1 + r) - e)
    inv = inv * (1 + ir) + (e - rnt)
    if (m % 12 === 0) { rows.push({ year: `Y${m / 12}`, a: Math.round(price * Math.pow(1 + appr / 100, m / 12) - bal), b: Math.round(inv) }); rnt *= 1 + rentUp / 100 }
  }
  const buyW = rows.at(-1).a, rentW = rows.at(-1).b, buyWins = buyW >= rentW
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="rb-p" label="Home price" prefix="₹" value={price} onChange={setPrice} min={1000000} max={50000000} step={100000} />
        <SliderRow id="rb-d" label="Down payment" suffix="%" value={down} onChange={setDown} min={10} max={90} />
        <SliderRow id="rb-r" label="Home loan rate" suffix="%" value={rate} onChange={setRate} min={6} max={14} step={0.05} />
        <SliderRow id="rb-y" label="Loan tenure" suffix="yrs" value={yrs} onChange={setYrs} min={5} max={30} />
        <SliderRow id="rb-rent" label="Rent for a similar home" prefix="₹" value={rent} onChange={setRent} min={2000} max={300000} step={1000} />
        <SliderRow id="rb-ru" label="Rent increase / year" suffix="%" value={rentUp} onChange={setRentUp} min={0} max={12} step={0.5} />
        <SliderRow id="rb-a" label="Home price growth / year" suffix="%" value={appr} onChange={setAppr} min={0} max={12} step={0.5} />
        <SliderRow id="rb-i" label="Return if you invest instead" suffix="%" value={ret} onChange={setRet} min={4} max={15} step={0.5} />
        <SliderRow id="rb-c" label="Stamp duty & registration" suffix="%" value={costs} onChange={setCosts} min={0} max={12} step={0.5} />
      </Col>
      <Col lg={6}>
        <Result label={`After ${yrs} years, ${buyWins ? 'buying' : 'renting and investing'} leaves you richer by`} value={inrShort(Math.abs(buyW - rentW))} items={[['Wealth if you buy', inrShort(buyW)], ['Wealth if you rent + invest', inrShort(rentW)], ['Monthly EMI', inr(e)], ['Rent today', inr(rent)]]} />
        <Lines rows={rows} a="Buy: home equity" b="Rent: investments" />
        <p className="small mt-2 mb-0" style={muted}>Renting assumes you invest the down payment, buying costs and the monthly EMI-minus-rent difference. Ignores maintenance, tax benefits and the comfort of owning your home.</p>
      </Col>
    </Row>
  )
}

/* ---------- Flat vs reducing rate ---------- */
export function FlatRateCalc() {
  const [P, setP] = useState(500000), [flat, setFlat] = useState(9), [yrs, setYrs] = useState(3)
  const months = yrs * 12, flatEmi = (P * (1 + flat / 100 * yrs)) / months
  let lo = 0, hi = 60
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (emi(P, mid, months) > flatEmi) hi = mid; else lo = mid }
  const real = (lo + hi) / 2
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="fr-p" label="Loan amount" prefix="₹" value={P} onChange={setP} min={10000} max={5000000} step={10000} />
        <SliderRow id="fr-f" label="Quoted flat rate" suffix="%" value={flat} onChange={setFlat} min={1} max={30} step={0.25} />
        <SliderRow id="fr-y" label="Tenure" suffix="yrs" value={yrs} onChange={setYrs} min={1} max={7} />
      </Col>
      <Col lg={6}>
        <Result label="The real (reducing balance) rate is" value={`${real.toFixed(2)}%`} warn={real > flat * 1.5} items={[['EMI', inr(flatEmi)], ['Total interest', inr(flatEmi * months - P)]]} />
        <div className="note">A flat rate charges interest on the full loan for the whole tenure, even as you repay. Car, personal and consumer loans are sometimes quoted this way. Always compare loans on the reducing rate (or APR) in the key fact statement.</div>
      </Col>
    </Row>
  )
}

/* ---------- SWP ---------- */
export function SwpCalc() {
  const [corpus, setCorpus] = useState(5000000), [w, setW] = useState(30000), [ret, setRet] = useState(8), [up, setUp] = useState(5)
  const r = ret / 1200
  let bal = corpus, amt = w, m = 0, total = 0
  const rows = [{ year: 'Y0', a: corpus }]
  while (bal > 0 && m < 600) {
    bal = bal * (1 + r) - amt; total += amt; m++
    if (m % 12 === 0) { rows.push({ year: `Y${m / 12}`, a: Math.max(0, Math.round(bal)) }); amt *= 1 + up / 100 }
  }
  const lasts = m >= 600 ? '50+ years' : `${Math.floor(m / 12)} yr ${m % 12} mo`
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="sw-c" label="Corpus invested" prefix="₹" value={corpus} onChange={setCorpus} min={100000} max={100000000} step={100000} />
        <SliderRow id="sw-w" label="Monthly withdrawal" prefix="₹" value={w} onChange={setW} min={1000} max={1000000} step={1000} />
        <SliderRow id="sw-u" label="Increase withdrawal / year (inflation)" suffix="%" value={up} onChange={setUp} min={0} max={10} step={0.5} />
        <SliderRow id="sw-r" label="Expected return" suffix="%" value={ret} onChange={setRet} min={3} max={14} step={0.5} />
      </Col>
      <Col lg={6}>
        <Result label="Your money lasts" value={lasts} warn={m < 240} items={[['Yearly withdrawal now', inr(w * 12)], ['Withdrawal rate', `${((w * 12) / corpus * 100).toFixed(1)}% a year`], ['Total withdrawn', inrShort(total)]]} />
        <Lines rows={rows.slice(0, 51)} a="Balance" />
        <p className="small mt-2 mb-0" style={muted}>A Systematic Withdrawal Plan pays you monthly from a mutual fund. Keeping the yearly withdrawal near 4–5% of the corpus helps it last longer.</p>
      </Col>
    </Row>
  )
}

/* ---------- Child education ---------- */
export function ChildEduCalc() {
  const [cost, setCost] = useState(2500000), [age, setAge] = useState(3), [at, setAt] = useState(18), [inf, setInf] = useState(8), [ret, setRet] = useState(11), [have, setHave] = useState(0)
  const n = Math.max(1, at - age), future = cost * Math.pow(1 + inf / 100, n)
  const haveF = have * Math.pow(1 + ret / 100, n), gap = Math.max(0, future - haveF)
  const per = sip(1, ret, n).value, need = gap / per
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="ce-c" label="Cost of the course today" prefix="₹" value={cost} onChange={setCost} min={100000} max={20000000} step={50000} />
        <SliderRow id="ce-a" label="Child's age now" suffix="yrs" value={age} onChange={setAge} min={0} max={17} />
        <SliderRow id="ce-t" label="Needed at age" suffix="yrs" value={at} onChange={setAt} min={Math.min(25, age + 1)} max={25} />
        <SliderRow id="ce-i" label="Education inflation" suffix="%" value={inf} onChange={setInf} min={4} max={12} step={0.5} />
        <SliderRow id="ce-r" label="Expected return" suffix="%" value={ret} onChange={setRet} min={5} max={14} step={0.5} />
        <SliderRow id="ce-h" label="Already saved for this" prefix="₹" value={have} onChange={setHave} min={0} max={10000000} step={10000} />
      </Col>
      <Col lg={6}>
        <Result label="Monthly SIP needed" value={inr(need)} items={[['Cost in ' + n + ' years', inrShort(future)], ['Your savings will grow to', inrShort(haveF)]]} />
        <div className="note">Education costs usually rise faster than general inflation. Move this money to safer debt funds about 3 years before the admission year.</div>
      </Col>
    </Row>
  )
}

/* ---------- HRA exemption ---------- */
export function HraCalc() {
  const [basic, setBasic] = useState(50000), [hra, setHra] = useState(20000), [rent, setRent] = useState(22000), [metro, setMetro] = useState(true)
  const a = hra, b = Math.max(0, rent - 0.1 * basic), c = (metro ? 0.5 : 0.4) * basic
  const ex = Math.min(a, b, c)
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="hr-b" label="Basic + DA (monthly)" prefix="₹" value={basic} onChange={setBasic} min={5000} max={500000} step={1000} />
        <SliderRow id="hr-h" label="HRA received (monthly)" prefix="₹" value={hra} onChange={setHra} min={0} max={250000} step={500} />
        <SliderRow id="hr-r" label="Rent paid (monthly)" prefix="₹" value={rent} onChange={setRent} min={0} max={300000} step={500} />
        <Form.Check type="switch" id="hr-m" label="I live in Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune or Ahmedabad" checked={metro} onChange={(e) => setMetro(e.target.checked)} />
      </Col>
      <Col lg={6}>
        <Result label="Tax-free HRA per year" value={inr(ex * 12)} items={[['Taxable HRA per year', inr((hra - ex) * 12)], ['Limited by', ex === a ? 'HRA received' : ex === b ? 'Rent minus 10% of basic' : `${metro ? 50 : 40}% of basic`]]} />
        <div className="note">Exempt HRA is the lowest of: HRA received, rent paid minus 10% of basic + DA, and 50% of basic (8 metro cities from FY 2026-27) or 40% elsewhere. Available only in the old tax regime. Give your landlord's PAN to your employer if rent is above ₹1 lakh a year.</div>
      </Col>
    </Row>
  )
}

/* ---------- Capital gains on mutual funds ---------- */
export function CapGainsCalc() {
  const [type, setType] = useState('equity'), [cost, setCost] = useState(300000), [val, setVal] = useState(500000), [months, setMonths] = useState(24), [used, setUsed] = useState(0), [slab, setSlab] = useState(30)
  const gain = Math.max(0, val - cost)
  let tax, kind, rateTxt
  if (type === 'equity') {
    if (months > 12) { const ex = Math.max(0, 125000 - used); tax = Math.max(0, gain - ex) * 0.125; kind = 'Long-term (LTCG)'; rateTxt = `12.5% above ₹1.25 lakh (${inr(Math.min(gain, ex))} tax-free)` }
    else { tax = gain * 0.2; kind = 'Short-term (STCG)'; rateTxt = '20%' }
  } else { tax = gain * slab / 100; kind = 'Taxed as income'; rateTxt = `Your slab: ${slab}%` }
  tax *= 1.04
  return (
    <Row className="g-4">
      <Col lg={6}>
        <Form.Label htmlFor="cg-t">Fund type</Form.Label>
        <Form.Select id="cg-t" value={type} onChange={(e) => setType(e.target.value)} className="mb-3">
          <option value="equity">Equity fund / ELSS / index / arbitrage (65%+ equity)</option>
          <option value="debt">Debt fund bought on or after 1 Apr 2023</option>
        </Form.Select>
        <SliderRow id="cg-c" label="Amount invested" prefix="₹" value={cost} onChange={setCost} min={1000} max={50000000} step={1000} />
        <SliderRow id="cg-v" label="Value when you sell" prefix="₹" value={val} onChange={setVal} min={1000} max={50000000} step={1000} />
        {type === 'equity'
          ? <><SliderRow id="cg-m" label="Held for" suffix="months" value={months} onChange={setMonths} min={1} max={240} />
              <SliderRow id="cg-u" label="Equity LTCG already booked this year" prefix="₹" value={used} onChange={setUsed} min={0} max={1000000} step={5000} /></>
          : <SliderRow id="cg-s" label="Your income-tax slab" suffix="%" value={slab} onChange={setSlab} min={0} max={30} step={5} />}
      </Col>
      <Col lg={6}>
        <Result label="Estimated tax (incl. 4% cess)" value={inr(tax)} items={[['Gain', inr(gain)], ['Type', kind], ['Rate', rateTxt], ['You keep', inr(val - tax)]]} />
        <div className="note">FY 2026-27 rules. Equity units held over 12 months are long-term; the ₹1.25 lakh exemption is shared across all your equity shares and funds in a year. SIP units are counted first-in, first-out, so each instalment has its own holding period. Surcharge not included.</div>
      </Col>
    </Row>
  )
}

/* ---------- Term insurance cover ---------- */
export function TermCoverCalc() {
  const [inc, setInc] = useState(1200000), [exp, setExp] = useState(50000), [age, setAge] = useState(32), [loans, setLoans] = useState(3000000), [goals, setGoals] = useState(2500000), [assets, setAssets] = useState(800000), [cover, setCover] = useState(0)
  const yrs = Math.max(0, 60 - age)
  const expNeed = exp * 12 * Math.min(yrs, 25)
  const need = Math.max(0, expNeed + loans + goals - assets - cover)
  const rule = inc * 12
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="tc-i" label="Your yearly income" prefix="₹" value={inc} onChange={setInc} min={100000} max={20000000} step={50000} />
        <SliderRow id="tc-e" label="Family's monthly expenses" prefix="₹" value={exp} onChange={setExp} min={5000} max={500000} step={1000} />
        <SliderRow id="tc-a" label="Your age" suffix="yrs" value={age} onChange={setAge} min={18} max={59} />
        <SliderRow id="tc-l" label="Loans outstanding" prefix="₹" value={loans} onChange={setLoans} min={0} max={50000000} step={50000} />
        <SliderRow id="tc-g" label="Big goals to fund (kids' education, marriage)" prefix="₹" value={goals} onChange={setGoals} min={0} max={50000000} step={50000} />
        <SliderRow id="tc-s" label="Savings & investments you have" prefix="₹" value={assets} onChange={setAssets} min={0} max={50000000} step={50000} />
        <SliderRow id="tc-x" label="Existing life cover" prefix="₹" value={cover} onChange={setCover} min={0} max={50000000} step={100000} />
      </Col>
      <Col lg={6}>
        <Result label="Term cover you need" value={inrShort(Math.ceil(need / 500000) * 500000)} items={[['Expenses until 60 (max 25 yrs)', inrShort(expNeed)], ['Quick rule: 10–15× income', `${inrShort(inc * 10)} – ${inrShort(inc * 15)}`]]} />
        <div className="note">Buy pure term insurance till about 60–65, not endowment or ULIP plans. Disclose health and habits honestly so claims aren't rejected, and add a nominee. Compare {inrShort(rule)}+ covers from insurers with a high claim settlement ratio.</div>
      </Col>
    </Row>
  )
}

/* ---------- Cost of delaying SIP ---------- */
export function SipDelayCalc() {
  const [m, setM] = useState(10000), [ret, setRet] = useState(12), [age, setAge] = useState(25), [delay, setDelay] = useState(5)
  const yrs = Math.max(1, 60 - age)
  const now = sip(m, ret, yrs).value, later = sip(m, ret, Math.max(1, yrs - delay)).value
  const catchUp = m * now / later
  return (
    <Row className="g-4">
      <Col lg={6}>
        <SliderRow id="sd-m" label="Monthly SIP" prefix="₹" value={m} onChange={setM} min={500} max={200000} step={500} />
        <SliderRow id="sd-a" label="Your age" suffix="yrs" value={age} onChange={setAge} min={18} max={55} />
        <SliderRow id="sd-d" label="If you start after" suffix="yrs" value={delay} onChange={setDelay} min={1} max={Math.min(15, yrs - 1)} />
        <SliderRow id="sd-r" label="Expected return" suffix="%" value={ret} onChange={setRet} min={6} max={15} step={0.5} />
      </Col>
      <Col lg={6}>
        <Result label={`Waiting ${delay} years costs you`} value={inrShort(now - later)} warn items={[['Start now, at 60', inrShort(now)], [`Start in ${delay} yrs, at 60`, inrShort(later)], ['SIP needed to catch up', inr(catchUp) + '/mo'], ['Extra you invest by starting now', inrShort(m * 12 * delay)]]} />
        <div className="note">The last years of compounding add the most. Starting small today beats starting big later.</div>
      </Col>
    </Row>
  )
}
