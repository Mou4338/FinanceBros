import { useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { inr } from '../utils/finance.js'

const muted = { color: 'var(--muted)' }

function Result({ label, value, items = [], warn }) {
  return (
    <div className="result-box mb-3">
      <div className="label">{label}</div>
      <div className="hero-val" style={warn ? { color: '#ffb4a2' } : {}}>{value}</div>
      {items.length > 0 && <Row className="mt-3 g-2">{items.map(([l, v]) => <Col xs={6} key={l}><div className="label">{l}</div><div className="sub" style={{ whiteSpace: 'normal' }}>{v}</div></Col>)}</Row>}
    </div>
  )
}

function Checklist({ items, state, setState }) {
  return (
    <div className="d-grid gap-2">
      {items.map(([k, title, why]) => (
        <label key={k} className={`check-row ${state[k] ? 'on' : ''}`}>
          <Form.Check.Input type="checkbox" checked={!!state[k]} onChange={(e) => setState((s) => ({ ...s, [k]: e.target.checked }))} />
          <span><span className="fw-bold d-block">{title}</span><span className="small" style={muted}>{why}</span></span>
        </label>
      ))}
    </div>
  )
}

const ExtLink = ({ href, children }) => <a href={href} target="_blank" rel="noreferrer">{children} <i className="bi bi-box-arrow-up-right small" /></a>

/* ---------- Which payment method? ---------- */
const METHODS = [
  { k: 'UPI', speed: 'Instant', limit: 'Usually up to ₹1 lakh (₹5 lakh for some categories, e.g. tax, IPOs)', best: 'Everyday payments, shops, friends', cost: 'Free' },
  { k: 'IMPS', speed: 'Instant, 24×7', limit: 'Up to ₹5 lakh per transaction', best: 'Urgent bank transfers', cost: 'Small fee at some banks' },
  { k: 'NEFT', speed: 'In half-hourly batches, 24×7', limit: 'No RBI minimum or maximum (bank limits apply)', best: 'Routine transfers, any amount', cost: 'Free online' },
  { k: 'RTGS', speed: 'Real time, 24×7', limit: 'Minimum ₹2 lakh, no RBI maximum', best: 'Large payments: property, car, fees', cost: 'Free online' },
  { k: 'NACH / e-mandate', speed: 'Auto-debit on a set date', limit: 'As per the mandate you sign', best: 'SIPs, EMIs, insurance premiums, bills', cost: 'Usually free' },
  { k: 'Cheque', speed: 'Clears in about a day', limit: 'Your account balance', best: 'Rent deposits, formal payments', cost: 'Free; bounce charges if unpaid' },
  { k: 'Demand draft', speed: 'Issued by the bank', limit: 'Prepaid, so payment is guaranteed', best: 'Admissions, govt deposits that ask for a DD', cost: 'Bank fee' },
  { k: 'Debit card', speed: 'Instant', limit: 'Your balance and card limit', best: 'Shopping, ATM cash', cost: 'Free; ATM fees beyond free uses' },
  { k: 'Credit card', speed: 'Instant (you pay later)', limit: 'Your credit limit', best: 'Purchases you can repay in full by the due date', cost: '~3–3.75% a month if you don\'t pay in full' },
]
export function PaymentMethodTool() {
  const [amt, setAmt] = useState(50000), [urgent, setUrgent] = useState(true), [recurring, setRecurring] = useState(false)
  let pick, why
  if (recurring) { pick = 'NACH / e-mandate'; why = 'Set it once and it pays automatically on the due date. Best for SIPs and EMIs.' }
  else if (amt >= 200000 && urgent) { pick = 'RTGS'; why = 'Large and urgent: RTGS settles in real time and starts at ₹2 lakh.' }
  else if (amt > 100000 && urgent) { pick = 'IMPS'; why = 'Instant transfers above the usual UPI limit, up to ₹5 lakh.' }
  else if (amt <= 100000 && urgent) { pick = 'UPI'; why = 'Instant and free for amounts up to ₹1 lakh.' }
  else { pick = 'NEFT'; why = 'Not urgent: NEFT is free online and has no RBI upper limit.' }
  return (
    <Row className="g-4">
      <Col lg={5}>
        <Form.Label htmlFor="pm-a">How much are you sending?</Form.Label>
        <Form.Control id="pm-a" type="number" min={1} step={1000} value={amt} onChange={(e) => setAmt(Math.max(0, Number(e.target.value) || 0))} className="mb-3" />
        <Form.Check type="switch" id="pm-u" label="It needs to reach right now" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} className="mb-2" />
        <Form.Check type="switch" id="pm-r" label="It repeats every month (SIP, EMI, bill)" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="mb-3" />
        <Result label={`Best for ${inr(amt)}`} value={pick} />
        <div className="note">{why} Banks can set lower limits than these, so check your bank app before a large transfer.</div>
      </Col>
      <Col lg={7}>
        <div className="scroll">
          <table className="table adm align-middle stack pay-table">
            <thead><tr><th>Method</th><th>Speed</th><th>Limit</th><th>Best for</th><th>Cost</th></tr></thead>
            <tbody>{METHODS.map((m) => (
              <tr key={m.k} className={m.k === pick ? 'pick' : ''}><td className="fw-bold">{m.k}</td><td>{m.speed}</td><td>{m.limit}</td><td>{m.best}</td><td>{m.cost}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </Col>
    </Row>
  )
}

/* ---------- Unclaimed money finder ---------- */
const UNCLAIMED = [
  ['bank', 'An old bank account or a matured FD', 'Bank deposits untouched for 10 years go to the RBI\'s DEA Fund.', 'RBI UDGAM portal', 'https://udgam.rbi.org.in', 'Register, search across participating banks, then claim at any branch of that bank with KYC.'],
  ['shares', 'Old shares, dividends or company deposits', 'Unclaimed for 7 years, they move to the IEPF.', 'IEPF portal', 'https://www.iepf.gov.in', 'Search “Unclaimed amounts”, then file the claim form (IEPF-5) with the company.'],
  ['mf', 'Mutual fund units you lost track of', 'Folios with an old address, bank or email go dormant.', 'SEBI MITRA (on MF Central)', 'https://app.mfcentral.com/links/inactive-folios', 'Search by PAN, then contact the fund house to update KYC and claim the units.'],
  ['ins', 'A matured or claim-pending insurance policy', 'Insurers must list unclaimed amounts on their websites.', 'IRDAI Bima Bharosa / your insurer\'s website', 'https://bimabharosa.irdai.gov.in', 'Use the insurer\'s “unclaimed amount” search with the policy number or PAN.'],
  ['pf', 'PF from an old job', 'Old PF often stays in a past employer\'s account.', 'EPFO member portal', 'https://unifiedportal-mem.epfindia.gov.in', 'Log in with your UAN, check the passbook and transfer old PF to your current account.'],
]
export function UnclaimedTool() {
  const [sel, setSel] = useState({ bank: true, shares: false, mf: false, ins: false, pf: false })
  const chosen = UNCLAIMED.filter(([k]) => sel[k])
  return (
    <Row className="g-4">
      <Col lg={5}>
        <p className="fw-semibold mb-2">Could you or your parents have any of these?</p>
        <Checklist items={UNCLAIMED.map(([k, t, w]) => [k, t, w])} state={sel} setState={setSel} />
      </Col>
      <Col lg={7}>
        <Result label="Places to check" value={`${chosen.length} official portal${chosen.length === 1 ? '' : 's'}`} />
        <div className="d-grid gap-2">
          {chosen.map(([k, , , name, url, how]) => (
            <div className="rec" key={k}>
              <div className="fw-bold"><ExtLink href={url}>{name}</ExtLink></div>
              <div className="small" style={muted}>{how}</div>
            </div>
          ))}
          {chosen.length === 0 && <p style={muted}>Tick at least one item.</p>}
        </div>
        <div className="note mt-3">These are free government or regulator portals. Never pay an agent to “search” for you, and never share OTPs. Keep PAN, Aadhaar and old account numbers ready; for a family member's money you will also need the death certificate and nominee or legal-heir documents.</div>
      </Col>
    </Row>
  )
}

/* ---------- IPO checklist ---------- */
const IPO_CHECKS = [
  ['use', 'Where is the money going?', 'In the RHP, check how much is fresh issue (money for the business) vs offer for sale (existing owners selling).'],
  ['fin', 'Are profits and cash flow growing?', 'Look at 3 years of revenue, profit and debt, not just the latest year.'],
  ['val', 'Is the price fair vs listed peers?', 'Compare the P/E or other valuation with similar listed companies.'],
  ['prom', 'What do the promoters do?', 'How much they keep after the IPO, any pledged shares, legal cases in “Risk factors”.'],
  ['self', 'Would you hold it if listing-day gains don\'t come?', 'Apply only with money you can stay invested with, not borrowed money.'],
]
export function IpoTool() {
  const [c, setC] = useState({})
  const done = IPO_CHECKS.filter(([k]) => c[k]).length
  const verdict = done === 5 ? 'Well researched' : done >= 3 ? 'Almost there' : 'Do more homework'
  return (
    <Row className="g-4">
      <Col lg={7}><Checklist items={IPO_CHECKS} state={c} setState={setC} /></Col>
      <Col lg={5}>
        <Result label={`${done} of 5 checks done`} value={verdict} warn={done < 3} />
        <div className="alloc-bar mb-3"><div style={{ width: `${done * 20}%`, background: '#1F7A45' }} /></div>
        <div className="note"><strong>About GMP:</strong> the grey market premium is an unofficial, unregulated price. SEBI does not recognise grey-market deals, so there is no protection if someone defaults, and a high GMP does not guarantee listing gains. Base your decision on the documents, not on GMP.</div>
      </Col>
    </Row>
  )
}

/* ---------- 4 questions before you invest ---------- */
export function BeforeInvestTool() {
  const [goal, setGoal] = useState('wealth'), [yrs, setYrs] = useState(7), [fall, setFall] = useState('hold'), [ef, setEf] = useState(true)
  let fit, color = false
  if (!ef) { fit = 'Build an emergency fund first'; color = true }
  else if (yrs < 3) fit = 'Safety first: FD, RD or liquid / short-duration debt funds'
  else if (yrs < 5 || fall === 'sell') fit = 'A balanced mix: hybrid funds or part equity, part debt'
  else fit = 'Growth: diversified equity or index funds, via SIP'
  return (
    <Row className="g-4">
      <Col lg={6}>
        <Form.Label htmlFor="bi-g">1. What is the money for?</Form.Label>
        <Form.Select id="bi-g" value={goal} onChange={(e) => setGoal(e.target.value)} className="mb-3">
          <option value="wealth">Long-term wealth</option><option value="home">Home down payment</option><option value="edu">Child's education</option><option value="retire">Retirement</option><option value="short">Something in the next year or two</option>
        </Form.Select>
        <Form.Label htmlFor="bi-y">2. When will you need it? <strong>{yrs} years</strong></Form.Label>
        <Form.Range id="bi-y" min={1} max={30} value={yrs} onChange={(e) => setYrs(Number(e.target.value))} className="mb-3" />
        <Form.Label>3. If it fell 20% in a month, you would…</Form.Label>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {[['sell', 'Sell in panic'], ['hold', 'Hold and wait'], ['buy', 'Invest more']].map(([k, l]) => <button type="button" key={k} className={`chip ${fall === k ? 'on' : ''}`} onClick={() => setFall(k)}>{l}</button>)}
        </div>
        <Form.Check type="switch" id="bi-e" label="4. I already have 6 months of expenses saved for emergencies" checked={ef} onChange={(e) => setEf(e.target.checked)} />
      </Col>
      <Col lg={6}>
        <Result label="What usually fits" value={fit} warn={color} />
        <div className="note">Answering these four questions before you buy any product (a fund, a policy, an IPO, gold) avoids most costly mistakes. This is an educational guide, not a recommendation for you.</div>
      </Col>
    </Row>
  )
}

/* ---------- Parents over 50: emergency readiness ---------- */
const FAMILY = [
  ['health', 'Health insurance in their own name', 'Not only employer cover. Check the sum insured against today\'s hospital costs.'],
  ['nominee', 'Nominees updated everywhere', 'Bank accounts, FDs, demat, mutual funds, insurance, PF.'],
  ['joint', 'A joint account (“either or survivor”)', 'So a family member can pay bills if one person is in hospital.'],
  ['ef', 'An emergency fund that\'s easy to reach', '6–12 months of expenses in savings, sweep-in FD or a liquid fund.'],
  ['list', 'One list of all accounts and policies', 'Banks, policies, investments, loans, and where the papers are kept.'],
  ['will', 'A written will', 'Nominees receive the money; a will decides who finally owns it.'],
  ['docs', 'Medical records and ID copies in one place', 'Prescriptions, reports, Aadhaar, PAN, insurance cards.'],
]
export function FamilyTool() {
  const [c, setC] = useState({})
  const done = FAMILY.filter(([k]) => c[k]).length
  const pct = Math.round((done / FAMILY.length) * 100)
  return (
    <Row className="g-4">
      <Col lg={7}><Checklist items={FAMILY} state={c} setState={setC} /></Col>
      <Col lg={5}>
        <Result label="Your family is" value={`${pct}% ready`} warn={pct < 60} items={[['Done', `${done} of ${FAMILY.length}`], ['Next step', FAMILY.find(([k]) => !c[k])?.[1] || 'All done!']]} />
        <div className="alloc-bar mb-3"><div style={{ width: `${pct}%`, background: '#1F7A45' }} /></div>
        <div className="note">Do this while everyone is healthy. Sorting out paperwork in a hospital corridor is much harder.</div>
      </Col>
    </Row>
  )
}

/* ---------- Insurance claim rejected: deadlines ---------- */
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
export function ClaimTool() {
  const today = new Date().toLocaleDateString('en-CA')
  const [rej, setRej] = useState(today), [amount, setAmount] = useState(300000)
  const r = new Date(rej + 'T00:00:00')
  const steps = [
    ['Get the rejection in writing', 'Ask for the exact clause the insurer relied on. Collect the policy, claim form, bills and all emails.', 'Now'],
    ['Write to the insurer\'s Grievance Officer', 'Explain why the rejection is wrong, clause by clause. IRDAI expects insurers to resolve complaints within 14 days.', `Reply expected by about ${fmt(addDays(r, 14))}`],
    ['Escalate on Bima Bharosa (IRDAI)', 'If there is no reply or it is unfair. Free and online; you get a token to track it.', 'If no fair reply in time'],
    [amount <= 5000000 ? 'File with the Insurance Ombudsman (Bima Lokpal)' : 'Go to the Consumer Commission', amount <= 5000000 ? 'Free, no lawyer needed, for claims up to ₹50 lakh. File within one year of the insurer\'s final rejection.' : 'Claims above ₹50 lakh are outside the Ombudsman\'s limit.', amount <= 5000000 ? `File by ${fmt(addDays(r, 365))} at the latest` : 'Consult a lawyer'],
  ]
  return (
    <Row className="g-4">
      <Col lg={5}>
        <Form.Label htmlFor="cl-d">Date the insurer finally rejected your claim or complaint</Form.Label>
        <Form.Control id="cl-d" type="date" value={rej} max={today} onChange={(e) => setRej(e.target.value || today)} className="mb-3" />
        <Form.Label htmlFor="cl-a">Claim amount (₹)</Form.Label>
        <Form.Control id="cl-a" type="number" min={0} step={1000} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))} className="mb-3" />
        <Result label="Last date for the Ombudsman" value={amount <= 5000000 ? fmt(addDays(r, 365)) : 'Not eligible'} warn={amount > 5000000} />
      </Col>
      <Col lg={7}>
        <ol className="claim-steps">
          {steps.map(([t, d, when], i) => (
            <li key={t}><span className="cs-n">{i + 1}</span><div><div className="fw-bold">{t}</div><div className="small" style={muted}>{d}</div><span className="tag mt-1 d-inline-block">{when}</span></div></li>
          ))}
        </ol>
        <p className="small mb-0" style={muted}>Portals: <ExtLink href="https://bimabharosa.irdai.gov.in">Bima Bharosa</ExtLink> · <ExtLink href="https://www.cioins.co.in">Insurance Ombudsman</ExtLink>. Educational guide, not legal advice.</p>
      </Col>
    </Row>
  )
}

/* ---------- Which mutual fund for which phase of life ---------- */
const STAGES = [
  { max: 30, name: 'Starting out (20s)', eq: [70, 90], funds: ['Index fund (Nifty 50) or flexi-cap fund for the core', 'ELSS if you need 80C tax saving (old regime)', 'Liquid fund for the emergency fund'], tip: 'Time is on your side. Start small, increase the SIP with every raise.' },
  { max: 40, name: 'Building a family (30s)', eq: [60, 80], funds: ['Index or flexi-cap fund as the core', 'Large & mid-cap fund for extra growth', 'Separate SIP per goal: home, child education'], tip: 'Term and health insurance first, then goal-wise SIPs.' },
  { max: 50, name: 'Peak earning (40s)', eq: [50, 70], funds: ['Large-cap / index funds', 'Balanced advantage or multi-asset fund', 'Short-duration debt for goals within 3–5 years'], tip: 'Start moving each goal\'s money to debt 3 years before you need it.' },
  { max: 60, name: 'Pre-retirement (50s)', eq: [30, 50], funds: ['Balanced advantage / conservative hybrid', 'Short-duration and corporate bond funds', 'Some large-cap or index exposure to beat inflation'], tip: 'Protect what you built; build a retirement income plan.' },
  { max: 200, name: 'Retired (60+)', eq: [20, 40], funds: ['Liquid fund for 1–2 years of expenses', 'Conservative hybrid / debt funds with an SWP for monthly income', 'A small equity part so money lasts 25+ years'], tip: 'Regular income and safety first, but don\'t go 0% equity.' },
]
export function LifeStageTool() {
  const [age, setAge] = useState(28), [yrs, setYrs] = useState(10)
  const st = STAGES.find((s) => age < s.max)
  const short = yrs < 3, mid = yrs < 5
  const range = short ? [0, 10] : mid ? [20, 40] : st.eq
  return (
    <Row className="g-4">
      <Col lg={5}>
        <Form.Label htmlFor="ls-age">Your age: <strong>{age}</strong></Form.Label>
        <Form.Range id="ls-age" min={18} max={75} value={age} onChange={(e) => setAge(Number(e.target.value))} className="mb-3" />
        <Form.Label htmlFor="ls-y">When do you need this money? <strong>{yrs} years</strong></Form.Label>
        <Form.Range id="ls-y" min={1} max={30} value={yrs} onChange={(e) => setYrs(Number(e.target.value))} className="mb-3" />
        <Result label={st.name} value={`${range[0]}–${range[1]}% equity`} items={[['Rest in', 'Debt / hybrid funds'], ['Time frame', short ? 'Short (<3 yrs)' : mid ? 'Medium (3–5 yrs)' : 'Long (5+ yrs)']]} />
      </Col>
      <Col lg={7}>
        <p className="fw-semibold mb-2">{short ? 'For money needed within 3 years' : 'Fund types that usually fit'}</p>
        <div className="d-grid gap-2 mb-3">
          {(short ? ['Liquid or money-market fund', 'Fixed deposit or RD', 'Arbitrage fund (low risk, equity taxation)'] : st.funds).map((f) => <div className="rec" key={f}><i className="bi bi-check2-circle me-2" style={{ color: '#1F7A45' }} />{f}</div>)}
        </div>
        <div className="note">{short ? 'Equity can fall 20–30% in a year, so short-term money should stay safe whatever your age.' : st.tip} This is a general guide by fund category, not a recommendation of any specific scheme.</div>
      </Col>
    </Row>
  )
}

/* ---------- 7 checks before buying a mutual fund ---------- */
const MF_CHECKS = [
  ['cat', 'The category fits your goal and time', 'Equity for 5+ years, hybrid for 3–5, debt or liquid for under 3.'],
  ['cons', 'Consistent vs its benchmark over 5–10 years', 'Look at rolling returns, not just last year\'s top number.'],
  ['down', 'It fell less in bad years', 'Check how it did in 2020 or other falls (downside capture, standard deviation).'],
  ['cost', 'Low expense ratio, direct plan', 'A 1% yearly cost difference can eat lakhs over 20 years.'],
  ['mgr', 'Stable fund manager and fund house', 'A new manager or a strategy change resets the track record.'],
  ['overlap', 'Doesn\'t repeat funds you already own', 'Two funds holding the same top stocks add cost, not diversification.'],
  ['exit', 'You know the exit load and tax', 'Exit load (often 1% within a year), and short vs long-term capital gains tax.'],
]
export function MfChecksTool() {
  const [c, setC] = useState({})
  const done = MF_CHECKS.filter(([k]) => c[k]).length
  const verdict = done === 7 ? 'Ready to invest' : done >= 5 ? 'Almost there' : 'Check more before buying'
  return (
    <Row className="g-4">
      <Col lg={7}><Checklist items={MF_CHECKS} state={c} setState={setC} /></Col>
      <Col lg={5}>
        <Result label={`${done} of 7 checks done`} value={verdict} warn={done < 5} />
        <div className="alloc-bar mb-3"><div style={{ width: `${(done / 7) * 100}%`, background: '#1F7A45' }} /></div>
        <div className="note mb-2"><strong>Free place to compare:</strong> AMFI's fund performance page lets you filter by category and sub-category and compare every scheme's returns against its benchmark. <ExtLink href="https://www.amfiindia.com/research-information/other-data/mf-scheme-performance-details">AMFI fund performance</ExtLink></div>
        <div className="note">Past returns don't guarantee future returns. Read the scheme's riskometer and factsheet before investing.</div>
      </Col>
    </Row>
  )
}
