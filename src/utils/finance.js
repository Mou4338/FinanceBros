// Pure, formula-based calculators. No external data needed.

export const inr = (n, opts = {}) =>
  '₹' + Math.round(Number.isFinite(n) ? n : 0).toLocaleString('en-IN', opts)

// Short Indian notation: 12.5 L, 1.2 Cr
export const inrShort = (n) => {
  const a = Math.abs(n)
  if (a >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr'
  if (a >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L'
  return inr(n)
}

/** EMI for principal P, annual rate r (%), tenure n months */
export function emi(P, annualRate, months) {
  const r = annualRate / 12 / 100
  if (!months) return 0
  if (r === 0) return P / months
  const f = Math.pow(1 + r, months)
  return (P * r * f) / (f - 1)
}

/** Year-wise amortisation: principal paid, interest paid, closing balance */
export function amortisation(P, annualRate, months) {
  const r = annualRate / 12 / 100
  const e = emi(P, annualRate, months)
  let bal = P
  const years = []
  let yp = 0, yi = 0
  for (let m = 1; m <= months; m++) {
    const interest = bal * r
    const principal = Math.min(e - interest, bal)
    bal -= principal
    yp += principal
    yi += interest
    if (m % 12 === 0 || m === months) {
      years.push({ year: `Y${Math.ceil(m / 12)}`, principal: Math.round(yp), interest: Math.round(yi), balance: Math.max(0, Math.round(bal)) })
      yp = 0; yi = 0
    }
  }
  return years
}

/** Monthly SIP with optional annual step-up (%). Returns year-wise growth. */
export function sip(monthly, annualReturn, years, stepUp = 0) {
  const r = annualReturn / 12 / 100
  let value = 0, invested = 0, amt = monthly
  const rows = []
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      value = (value + amt) * (1 + r) // investment at start of month
      invested += amt
    }
    rows.push({ year: `Y${y}`, invested: Math.round(invested), value: Math.round(value) })
    amt = amt * (1 + stepUp / 100)
  }
  return { invested, value, gains: value - invested, rows }
}

export function lumpsum(amount, annualReturn, years) {
  const rows = []
  for (let y = 1; y <= years; y++) {
    rows.push({ year: `Y${y}`, invested: amount, value: Math.round(amount * Math.pow(1 + annualReturn / 100, y)) })
  }
  const value = amount * Math.pow(1 + annualReturn / 100, years)
  return { invested: amount, value, gains: value - amount, rows }
}

/** Corpus needed at retirement and the monthly SIP that would build it */
export function retirement({ age, retireAge, lifeTill, monthlyExpense, inflation, preReturn, postReturn }) {
  const yrsToRetire = Math.max(1, retireAge - age)
  const yrsInRetirement = Math.max(1, lifeTill - retireAge)
  const expenseAtRetire = monthlyExpense * Math.pow(1 + inflation / 100, yrsToRetire)
  // Present value of a growing annuity (expenses grow with inflation, corpus earns postReturn)
  const realR = (1 + postReturn / 100) / (1 + inflation / 100) - 1
  const annual = expenseAtRetire * 12
  const corpus = realR === 0 ? annual * yrsInRetirement : annual * (1 - Math.pow(1 + realR, -yrsInRetirement)) / realR * (1 + realR)
  const r = preReturn / 12 / 100
  const n = yrsToRetire * 12
  const monthlySip = r === 0 ? corpus / n : corpus * r / ((Math.pow(1 + r, n) - 1) * (1 + r))
  return { expenseAtRetire, corpus, monthlySip, yrsToRetire }
}

/** Indicative loan eligibility using a FOIR (fixed obligations to income) cap */
export function eligibility({ income, existingEmi, rate, years, foir }) {
  const room = Math.max(0, income * foir / 100 - existingEmi)
  const e1 = emi(100000, rate, years * 12) // EMI per lakh
  return { maxEmi: room, maxLoan: e1 ? (room / e1) * 100000 : 0 }
}

/* ---------------- more tools ---------------- */

/** Months needed to repay P at rate r% with fixed payment pay (Infinity if payment too small) */
export function monthsToRepay(P, annualRate, pay) {
  const r = annualRate / 12 / 100
  if (pay <= 0) return Infinity
  if (r === 0) return Math.ceil(P / pay)
  if (pay <= P * r) return Infinity
  return Math.ceil(-Math.log(1 - (r * P) / pay) / Math.log(1 + r))
}

/** Balance transfer: remaining cost now vs after moving to a new rate (with a one-time fee) */
export function balanceTransfer({ outstanding, curRate, newRate, months, feePct, feeFlat }) {
  const e1 = emi(outstanding, curRate, months), e2 = emi(outstanding, newRate, months)
  const fee = outstanding * feePct / 100 + feeFlat
  const cost1 = e1 * months, cost2 = e2 * months + fee
  const saving = cost1 - cost2
  const breakEven = e1 - e2 > 0 ? Math.ceil(fee / (e1 - e2)) : Infinity
  return { e1, e2, fee, cost1, cost2, saving, breakEven }
}

/** Prepayment: keep the EMI and shorten tenure, by a one-time lump sum and/or extra every month */
export function prepayment({ outstanding, rate, months, lump, extra }) {
  const e = emi(outstanding, rate, months)
  const base = e * months
  const r = rate / 12 / 100
  let bal = Math.max(0, outstanding - lump), m = 0, paid = lump
  while (bal > 0.5 && m < 1200) {
    const pay = Math.min(bal * (1 + r), e + extra)
    bal = bal * (1 + r) - pay
    paid += pay; m++
  }
  return { emi: e, monthsLeft: m, monthsSaved: Math.max(0, months - m), interestBase: base - outstanding, interestNew: paid - outstanding, saving: base - paid }
}

/** Credit card: months and interest to clear a balance with a fixed monthly payment */
export function cardPayoff({ balance, monthlyRate, pay }) {
  const r = monthlyRate / 100
  let bal = balance, m = 0, interest = 0
  if (pay <= bal * r) return { months: Infinity, interest: Infinity }
  while (bal > 0.5 && m < 600) { const i = bal * r; interest += i; bal = bal + i - Math.min(pay, bal + i); m++ }
  return { months: m, interest }
}

export const cagr = (start, end, years) => (start > 0 && end > 0 && years > 0 ? (Math.pow(end / start, 1 / years) - 1) * 100 : 0)

/** Fixed deposit / compound interest. freq = compounding times per year */
export function compound(P, annualRate, years, freq = 4) {
  const value = P * Math.pow(1 + annualRate / 100 / freq, freq * years)
  const rows = []
  for (let y = 1; y <= Math.ceil(years); y++) rows.push({ year: `Y${y}`, invested: P, value: Math.round(P * Math.pow(1 + annualRate / 100 / freq, freq * Math.min(y, years))) })
  return { value, interest: value - P, rows, effective: (Math.pow(1 + annualRate / 100 / freq, freq) - 1) * 100 }
}

export const futureCost = (today, inflation, years) => today * Math.pow(1 + inflation / 100, years)

/** PPF: yearly deposit at start of year, interest compounded yearly */
export function ppf(yearly, rate, years = 15) {
  let bal = 0, invested = 0
  const rows = []
  for (let y = 1; y <= years; y++) { bal = (bal + yearly) * (1 + rate / 100); invested += yearly; rows.push({ year: `Y${y}`, invested: Math.round(invested), value: Math.round(bal) }) }
  return { value: bal, invested, interest: bal - invested, rows }
}

/* Income tax, FY 2026-27 (unchanged in Budget 2026), resident individual below 60,
   income up to ₹50 lakh (no surcharge). Includes Sec 87A rebate and 4% cess. */
function slabTax(income, slabs) {
  let tax = 0, prev = 0
  for (const [upto, rate] of slabs) { if (income > prev) tax += (Math.min(income, upto) - prev) * rate; prev = upto }
  return tax
}
export function taxNew(gross, salaried = true) {
  const taxable = Math.max(0, gross - (salaried ? 75000 : 0))
  let tax = slabTax(taxable, [[400000, 0], [800000, 0.05], [1200000, 0.10], [1600000, 0.15], [2000000, 0.20], [2400000, 0.25], [Infinity, 0.30]])
  if (taxable <= 1200000) tax = 0                                       // 87A rebate up to ₹60,000
  else tax = Math.min(tax, taxable - 1200000)                            // marginal relief just above ₹12 lakh
  return { taxable, tax: tax * 1.04 }
}
export function taxOld(gross, deductions, salaried = true) {
  const taxable = Math.max(0, gross - (salaried ? 50000 : 0) - deductions)
  let tax = slabTax(taxable, [[250000, 0], [500000, 0.05], [1000000, 0.20], [Infinity, 0.30]])
  if (taxable <= 500000) tax = 0                                        // 87A rebate up to ₹12,500
  return { taxable, tax: tax * 1.04 }
}
