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
