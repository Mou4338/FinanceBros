import { useState } from 'react'
import { Container, Row, Col, Form, Offcanvas, Button, Modal, Nav, Tab } from 'react-bootstrap'

// Guides grouped by service. `tool` opens that calculator; `topic` pre-selects the booking topic.
export const LEARN_SERVICES = [
  { key: 'loans', title: 'Loans & credit', icon: 'bi-bank', topic: 'Home loan' },
  { key: 'sip', title: 'SIP & mutual funds', icon: 'bi-graph-up-arrow', topic: 'SIP & mutual funds' },
  { key: 'wealth', title: 'Investment & portfolio', icon: 'bi-pie-chart', topic: 'Portfolio review' },
  { key: 'planning', title: 'Financial planning', icon: 'bi-clipboard-check', topic: 'Financial planning' },
  { key: 'insurance', title: 'Insurance & tax', icon: 'bi-shield-check', topic: 'Insurance' },
  { key: 'basics', title: 'Money basics', icon: 'bi-lightbulb', topic: 'Other' },
]

export const ARTICLES = [
  /* ---------- Loans & credit ---------- */
  { id: 'emi-truth', service: 'loans', min: 4, title: 'The real cost of a home loan EMI', sum: 'Why the first years are mostly interest, and what a small prepayment does.', tool: ['emi', 'EMI calculator'],
    body: [
      ['Interest comes first', 'On a 20-year loan at 8.5%, about 80% of every EMI in the first year goes to interest. That is why the balance falls so slowly at the start.'],
      ['Small extra payments help most early', 'Paying even one extra EMI a year can cut several years off the loan. RBI rules say lenders cannot charge individuals a penalty for prepaying a floating-rate loan.'],
      ['When rates rise', 'Banks often stretch your tenure instead of raising the EMI. If you can afford it, ask them to raise the EMI instead; it saves a lot of interest.'],
    ] },
  { id: 'balance-transfer', service: 'loans', min: 3, title: 'Should you switch your home loan to another bank?', sum: 'When a balance transfer saves money, and the costs people forget.', tool: ['bt', 'Balance transfer calculator'],
    body: [
      ['When it is worth it', 'Usually when the new rate is at least 0.5% lower and you still have many years left. Near the end of a loan, most of the interest is already paid, so savings are small.'],
      ['Count every cost', 'Processing fee, legal and valuation charges, and stamp duty in some states. Add them all up and check how many months of lower EMIs it takes to recover them.'],
      ['Ask your bank first', 'Many lenders lower your rate for a small conversion fee if you ask. That is often cheaper than switching.'],
    ] },
  { id: 'credit-score', service: 'loans', min: 3, title: 'Credit score: 6 habits that move it', sum: 'What lenders look at, and simple habits that raise your score.', tool: ['elig', 'Loan eligibility calculator'],
    body: [
      ['What lenders look at', 'Paying on time matters most, then how much of your credit limit you use, how old your accounts are, and how many loans you applied for recently.'],
      ['Habits that help', 'Pay every EMI and card bill on time, keep card use under about 30% of the limit, avoid many loan applications at once, keep old cards open, and check your credit report for mistakes once a year.'],
    ] },
  { id: 'card-trap', service: 'loans', min: 3, title: 'The credit card “minimum due” trap', sum: 'Why paying only the minimum keeps you in debt for years.', tool: ['card', 'Credit card payoff calculator'],
    body: [
      ['How expensive it is', 'Cards charge roughly 3–3.75% a month on unpaid balances, around 36–45% a year. You also lose the interest-free period on new spending until the old balance is cleared.'],
      ['Getting out', 'Pay as much above the minimum as you can. If the balance is large, converting it to an EMI or a cheaper personal loan usually costs much less.'],
    ] },

  /* ---------- SIP & mutual funds ---------- */
  { id: 'sip-basics', service: 'sip', min: 4, title: 'SIP kya hai? How monthly investing works', sum: 'Rupee-cost averaging, compounding, and why starting early matters most.', tool: ['sip', 'SIP calculator'],
    body: [
      ['What a SIP is', 'A Systematic Investment Plan puts a fixed amount into a mutual fund every month. You buy more units when prices are low and fewer when they are high.'],
      ['Why time matters', '₹5,000 a month for 20 years puts in ₹12 lakh; at an assumed 12% a year it could grow to about ₹50 lakh. Start 10 years later and the same habit grows to only about ₹11.6 lakh. Returns are not guaranteed.'],
      ['Before you start', 'Build an emergency fund first, match the fund type to how long you will stay invested, and check the costs.'],
    ] },
  { id: 'fund-types', service: 'sip', min: 4, title: 'Equity, debt, hybrid, index: which fund for which goal?', sum: 'A simple way to match fund types to how soon you need the money.', tool: ['sip', 'SIP calculator'],
    body: [
      ['Match the fund to the time', 'Money needed within 3 years: debt or liquid funds, which move less. 3–5 years: a hybrid mix. More than 5–7 years: equity funds, which can swing a lot in the short term but have more room to grow.'],
      ['Index funds', 'They simply copy an index like the Nifty 50, so costs are low and there is no fund manager guessing. A good starting point for many beginners.'],
      ['Fewer is better', 'Three or four well-chosen funds are usually enough. Many funds often hold the same stocks.'],
    ] },
  { id: 'direct-regular', service: 'sip', min: 3, title: 'Direct vs regular plans and the expense ratio', sum: 'Small yearly costs that add up over 20 years.', tool: ['cagr', 'CAGR calculator'],
    body: [
      ['The difference', 'The same fund comes in two versions. Regular plans pay a commission to a distributor, so their expense ratio is higher. Direct plans have no commission.'],
      ['Why it matters', 'A 1% yearly difference in costs can mean lakhs less after 20 years, because the cost is taken every year from a growing amount.'],
      ['Choosing', 'Direct suits people who will research and track funds themselves. A regular plan can make sense if you value ongoing guidance from a registered distributor.'],
    ] },

  /* ---------- Investment & portfolio ---------- */
  { id: 'asset-allocation', service: 'wealth', min: 4, title: 'Asset allocation: why your mix matters more than your picks', sum: 'How much in equity, debt, gold and cash, and why.', tool: ['health', 'Portfolio health check'],
    body: [
      ['The idea', 'How you split money between equity, debt, gold and cash drives most of your ups and downs. Picking the “best” fund matters far less.'],
      ['A starting point', 'A common rule of thumb is about (100 − your age)% in equity, then adjusted for how comfortable you are with ups and downs and when you need the money.'],
      ['Check yearly', 'Markets change your mix over time. Review it once a year.'],
    ] },
  { id: 'returns', service: 'wealth', min: 3, title: 'CAGR vs XIRR vs absolute return', sum: 'Three ways to measure returns, and when each one is right.', tool: ['cagr', 'CAGR calculator'],
    body: [
      ['Absolute return', 'Total gain divided by what you put in. Simple, but it ignores time: 50% in 2 years and 50% in 10 years are very different.'],
      ['CAGR', 'The steady yearly rate for a one-time investment. Good for comparing a lump sum held for several years.'],
      ['XIRR', 'The right measure for SIPs or many deposits at different dates. Most fund apps and statements show it.'],
    ] },
  { id: 'rebalancing', service: 'wealth', min: 3, title: 'Rebalancing: the boring habit that protects you', sum: 'Bring your mix back to plan once a year.', tool: ['health', 'Portfolio health check'],
    body: [
      ['Why', 'After a strong year in equity, your portfolio becomes riskier than you planned. Rebalancing moves it back by trimming what grew and adding to what lagged.'],
      ['How', 'Once a year, or when a part drifts more than about 5–10% from plan. Use new SIP money where possible, and check the tax impact before selling.'],
    ] },

  /* ---------- Financial planning ---------- */
  { id: 'emergency', service: 'planning', min: 3, title: 'Emergency fund: how much and where', sum: '6 months of expenses, kept boring and easy to access.', tool: ['emergency', 'Emergency fund calculator'],
    body: [
      ['How much', 'Six months of essential expenses plus EMIs if your income is steady; 9–12 months if you are self-employed or the only earner.'],
      ['Where', 'Safe and quick to withdraw: a savings account, sweep-in FD or liquid fund. Not in equity, and not locked away.'],
    ] },
  { id: 'budget', service: 'planning', min: 3, title: 'The 50/30/20 budget, Indian salary edition', sum: 'A simple split for needs, wants and savings.', tool: ['budget', 'Budget planner'],
    body: [
      ['The split', 'About 50% of take-home pay for needs (rent, EMIs, groceries, bills), 30% for wants, and at least 20% for saving and investing.'],
      ['Pay yourself first', 'Set your SIP and RD to go out right after salary day. Spend what is left, not save what is left.'],
      ['High rent or EMIs?', 'If needs take more than 50%, cut wants first and set a date to fix the bigger costs.'],
    ] },
  { id: 'retirement', service: 'planning', min: 4, title: 'How much do you need to retire?', sum: 'Inflation is the number most people forget.', tool: ['retire', 'Retirement calculator'],
    body: [
      ['Start from expenses', 'Take your monthly expenses today and grow them with inflation until your retirement age. At 6% inflation, costs roughly double every 12 years.'],
      ['The corpus', 'Your savings must pay that rising expense for 25–30 years after you retire. The calculator works out the total and the monthly SIP that would build it.'],
      ['Start early', 'Starting 5 years later can raise the monthly SIP needed by roughly a third, and the gap grows the longer you wait.'],
    ] },

  /* ---------- Insurance & tax ---------- */
  { id: 'term-cover', service: 'insurance', min: 3, title: 'Term insurance: how much cover do you need?', sum: 'A simple rule of thumb, and why investment-linked policies are different.', tool: ['networth', 'Net worth calculator'],
    body: [
      ['How much', 'A common starting point is 10–15 times your yearly income, plus your loans, minus the savings your family could use. Review it after marriage, children or a home loan.'],
      ['Keep it separate', 'Pure term insurance gives the most cover for the money. Policies that mix insurance and investment usually give lower cover at a higher cost.'],
    ] },
  { id: 'health-insurance', service: 'insurance', min: 4, title: 'Health insurance: what to check before you buy', sum: 'Room-rent limits, waiting periods and co-pay, explained.', tool: null,
    body: [
      ['Don’t rely only on office cover', 'Employer cover ends when you change or lose your job. Keep a personal or family floater policy too.'],
      ['Read these lines', 'Room-rent limits, waiting periods for existing illnesses, co-payment, sub-limits on treatments, and the insurer’s network hospitals in your city.'],
      ['Tax', 'Under the old tax regime, premiums qualify for a deduction (up to ₹25,000 for yourself and family, more for senior-citizen parents). The new regime does not allow it.'],
    ] },
  { id: 'regime', service: 'insurance', min: 4, title: 'Old vs new tax regime for FY 2026-27', sum: 'The slabs are unchanged this year. Add up your deductions, then compare.', tool: ['tax', 'Tax regime calculator'],
    body: [
      ['New regime', 'Lower rates and few deductions. No tax up to ₹12 lakh of taxable income because of the rebate, and salaried people also get a ₹75,000 standard deduction.'],
      ['Old regime', 'Higher rates but allows deductions such as 80C, health insurance, HRA and home loan interest. It can win if your deductions are large.'],
      ['How to decide', 'List what you actually claim and run both. From April 2026 the Income-tax Act, 2025 replaced the 1961 Act and renumbered sections, but Budget 2026 kept the slabs the same. Confirm with a tax professional.'],
    ] },
  { id: 'tax-savers', service: 'insurance', min: 4, title: 'PPF vs ELSS vs NPS for saving tax', sum: 'Lock-in, risk and returns side by side.', tool: ['ppf', 'PPF calculator'],
    body: [
      ['PPF', 'Government-backed, 7.1% for Oct–Dec 2026, tax-free interest, 15-year term with partial withdrawals later. Up to ₹1.5 lakh a year.'],
      ['ELSS', 'Equity mutual funds with the shortest lock-in (3 years). Higher potential returns, with market ups and downs.'],
      ['NPS', 'For retirement; mostly locked until 60. In the old regime an extra deduction of up to ₹50,000 is available.'],
      ['These only help in the old regime', 'If you are better off in the new regime, invest for your goals and ignore the tax angle.'],
    ] },

  /* ---------- added from @finance.bros.in topics ---------- */
  { id: 'four-questions', service: 'sip', min: 3, title: 'Ask these 4 questions before you invest', sum: 'Goal, time, risk and safety net: answer these before buying anything.', tool: ['invest4', '4-questions checker'],
    body: [
      ['1. What is it for?', 'A clear goal (home, education, retirement) tells you how much you need and when.'],
      ['2. When will you need it?', 'Money needed within 3 years should not be in equity. The longer the time, the more ups and downs you can ride out.'],
      ['3. What if it falls 20%?', 'If you would panic and sell, choose something steadier. Selling in a fall is how most people lose money.'],
      ['4. Is your emergency fund ready?', 'Without one, a job loss or hospital bill forces you to sell investments at the wrong time.'],
    ] },
  { id: 'investor-mistakes', service: 'sip', min: 4, title: '5 mistakes new investors always make', sum: 'Chasing returns, stopping SIPs and other expensive habits.', tool: ['sip', 'SIP calculator'],
    body: [
      ['Chasing last year\'s top fund', 'Last year\'s winner is often not next year\'s. Look at 5–10 years and costs instead.'],
      ['Stopping SIPs when markets fall', 'Falls are when your SIP buys more units. Stopping then locks in the worst part.'],
      ['No emergency fund', 'You end up selling investments for emergencies.'],
      ['Too many funds and tips', 'Ten funds often hold the same stocks. Social-media tips are not research.'],
      ['Mixing insurance and investment', 'Buy pure term cover for protection and invest separately for growth.'],
    ] },
  { id: 'what-is-mf', service: 'sip', min: 3, title: 'What is a mutual fund? (from zero)', sum: 'Pooled money, run by a professional, regulated by SEBI.', tool: ['sip', 'SIP calculator'],
    body: [
      ['The idea', 'Many investors pool money. A fund manager invests it in shares, bonds or both, and you own units. The value of one unit is the NAV, updated every business day.'],
      ['Main types', 'Equity funds (shares, for 5+ years), debt funds (bonds, for stability), hybrid funds (a mix) and index funds (copy an index like the Nifty 50 at low cost).'],
      ['Why people use them', 'Diversification from ₹100–500, professional management, SEBI regulation and easy withdrawal. Returns are not guaranteed.'],
      ['Direct vs regular', 'Direct plans have no distributor commission, so the expense ratio is lower. Same fund, same manager.'],
    ] },
  { id: 'mf-7-checks', service: 'sip', min: 4, title: '7 checks before buying a mutual fund', sum: 'Category, consistency, falls, cost, manager, overlap, exit load.', tool: ['mf7', '7-check fund checklist'],
    body: [
      ['1–2. Fit and consistency', 'Pick the category for your goal and time first, then check returns against the benchmark over 5–10 years, using rolling returns.'],
      ['3. How it falls', 'A fund that falls less in bad years is easier to stay with.'],
      ['4–5. Cost and manager', 'Prefer the direct plan with a reasonable expense ratio, and a stable manager and process.'],
      ['6–7. Overlap and exit', 'Avoid funds that hold the same stocks as yours, and know the exit load and tax before you buy.'],
    ] },
  { id: 'find-best-mf', service: 'sip', min: 3, title: 'The free website to shortlist mutual funds', sum: 'Use AMFI\'s fund performance page with 3 filters.', tool: ['mf7', '7-check fund checklist'],
    body: [
      ['Where', 'AMFI (the mutual fund industry body) publishes every scheme\'s returns at amfiindia.com, under Research & Information, fund performance.'],
      ['The 3 filters', 'Choose the type (equity, debt, hybrid), the sub-category (for example flexi-cap or large-cap) and the period. You get every fund in that category with its benchmark returns side by side.'],
      ['How to use it', 'Shortlist funds that beat their benchmark over 5 and 10 years, not just 1. Then run the 7 checks before you invest.'],
    ] },
  { id: 'life-stage', service: 'sip', min: 4, title: 'Which mutual fund for which phase of life?', sum: 'From your first salary to retirement: how the mix changes.', tool: ['lifestage', 'Life-stage fund guide'],
    body: [
      ['20s and 30s', 'Mostly equity: index or flexi-cap funds as the core, an ELSS if you use 80C, and a liquid fund for emergencies.'],
      ['40s', 'Still growth, but add balanced advantage or hybrid funds and move each goal\'s money to debt about 3 years before it is due.'],
      ['50s and retirement', 'More debt and conservative hybrid funds, a liquid fund for 1–2 years of expenses, and an SWP for monthly income, while keeping some equity to beat inflation.'],
      ['The real rule', 'Time to the goal matters more than age. Money needed within 3 years stays out of equity at any age.'],
    ] },
  { id: 'capture-ratio', service: 'wealth', min: 3, title: 'Market up, portfolio more up. Market down, portfolio less down.', sum: 'What upside and downside capture mean, and why falling less matters.', tool: ['health', 'Portfolio health check'],
    body: [
      ['The two numbers', 'Upside capture shows how much of the market\'s rises a fund caught; downside capture shows how much of its falls. Above 100 up and below 100 down is the goal.'],
      ['Why falling less wins', 'A 50% fall needs a 100% rise to recover, but a 30% fall needs only about 43%. Losing less is half the game.'],
      ['How to get there', 'Diversify across equity, debt and gold, rebalance once a year, and pick funds with a steady record in bad years. Find capture ratios on fund factsheets.'],
    ] },
  { id: 'ipo-gmp', service: 'wealth', min: 4, title: 'Check these 5 things before any IPO (not the GMP)', sum: 'GMP is unofficial and unregulated. Read the documents instead.', tool: ['ipo', 'IPO checklist'],
    body: [
      ['What GMP really is', 'The grey market premium is an unofficial price from an unregulated market. SEBI does not recognise these deals, and a high GMP does not guarantee a good listing.'],
      ['The 5 checks', 'Where the money is going (fresh issue vs offer for sale), 3 years of profits and debt, price vs listed peers, what promoters keep and pledge, and whether you would hold it without listing gains.'],
      ['Where to read', 'The RHP (offer document) on the SEBI, NSE or BSE websites, especially the “Objects of the issue” and “Risk factors” sections.'],
    ] },
  { id: 'gold', service: 'wealth', min: 3, title: 'Gold fell for days. Buy now or wait?', sum: 'Why trying to time gold rarely works, and how to own it simply.', tool: ['health', 'Portfolio health check'],
    body: [
      ['Don\'t try to time it', 'Nobody knows the bottom. Decide how much gold you want in your portfolio (many planners keep about 5–15%) and add slowly.'],
      ['Simple ways to own it', 'Gold ETFs and gold mutual funds track the price without storage or purity worries. Jewellery has making charges that you don\'t get back.'],
      ['Be careful with app-based “digital gold”', 'It is not regulated by SEBI. Prefer regulated options like gold ETFs.'],
    ] },
  { id: 'parents-50', service: 'planning', min: 4, title: 'Parents over 50? Do these things before an emergency', sum: 'Insurance, nominees, a will and one list of everything.', tool: ['family', 'Family emergency checklist'],
    body: [
      ['Health insurance in their own name', 'Employer or retirement cover can be small or end. Check the sum insured against today\'s hospital costs.'],
      ['Nominees and joint accounts', 'Update nominees on every account, and keep one “either or survivor” account so bills can be paid in a crisis.'],
      ['One list and a will', 'Write down every account, policy and loan and where the papers are. A will avoids long fights later; nominees only receive the money.'],
      ['Emergency money', 'Keep 6–12 months of expenses where it can be withdrawn the same day.'],
    ] },
  { id: 'claim-rejected', service: 'insurance', min: 4, title: 'Insurance claim rejected? Do this', sum: 'The free 3-step escalation, and the one-year deadline people miss.', tool: ['claim', 'Claim deadline planner'],
    body: [
      ['1. Get it in writing', 'Ask for the exact clause used to reject the claim. Keep the policy, bills, reports and emails.'],
      ['2. Insurer\'s Grievance Officer', 'Reply point by point. IRDAI expects insurers to resolve complaints within 14 days.'],
      ['3. Bima Bharosa, then the Ombudsman', 'Escalate on IRDAI\'s Bima Bharosa portal. For claims up to ₹50 lakh, the Insurance Ombudsman is free and needs no lawyer. File within one year of the insurer\'s final rejection.'],
    ] },

  /* ---------- Money basics ---------- */
  { id: 'inflation', service: 'basics', min: 3, title: 'What is inflation, and why it eats your savings', sum: 'Why ₹1 lakh today buys less in 10 years.', tool: ['inflation', 'Inflation calculator'],
    body: [
      ['In simple words', 'Inflation is prices rising over time. At 6% a year, what costs ₹1 lakh today costs about ₹1.8 lakh in 10 years.'],
      ['The real return', 'If your FD gives 7% and inflation is 6%, your money grows only about 1% in real terms, and less after tax.'],
      ['What to do', 'Keep emergency money safe, but invest long-term money in assets that have historically beaten inflation, such as equity funds.'],
    ] },
  { id: 'fii-flows', service: 'basics', min: 3, title: 'World markets crashed, foreigners bought India. What does it mean?', sum: 'FIIs, DIIs and why their buying and selling move the market.', tool: ['invest4', '4-questions checker'],
    body: [
      ['Who they are', 'FIIs/FPIs are foreign investors such as global funds. DIIs are Indian institutions: mutual funds, insurers and pension funds. NSE publishes their daily buying and selling.'],
      ['Why it matters', 'Large foreign buying can lift the market; heavy selling can drag it down. Steady SIP money via DIIs now often balances foreign selling.'],
      ['What you should do', 'Nothing dramatic. Daily flows are news, not a plan. Stick to your asset allocation and continue your SIPs.'],
    ] },
  { id: 'payment-methods', service: 'basics', min: 4, title: 'Payment methods explained: UPI, IMPS, NEFT, RTGS and more', sum: 'Which one to use for which payment, with limits.', tool: ['pay', 'Payment method finder'],
    body: [
      ['Instant', 'UPI is free and usually allows up to ₹1 lakh (up to ₹5 lakh for some categories such as tax or IPOs). IMPS is instant up to ₹5 lakh.'],
      ['Large or routine', 'RTGS is for ₹2 lakh and above and settles in real time. NEFT moves in half-hourly batches with no RBI maximum. Both run 24×7 and are free online.'],
      ['Automatic', 'NACH and e-mandates auto-debit SIPs, EMIs and premiums on a set date.'],
      ['Paper and cards', 'Cheques and demand drafts for formal payments; debit cards spend your balance; credit cards are free only if you pay the full bill by the due date.'],
    ] },
  { id: 'costly-terms', service: 'basics', min: 3, title: '3 finance terms that quietly cost you money', sum: 'Flat interest rate, expense ratio and exit load.', tool: ['emi', 'EMI calculator'],
    body: [
      ['Flat interest rate', 'Some loans quote a “flat” rate on the original amount for the whole tenure. The real (reducing-balance) rate can be nearly double. Always ask for the APR.'],
      ['Expense ratio', 'The yearly fee a mutual fund charges, taken from your returns. Small differences add up to lakhs over 20 years.'],
      ['Exit load', 'A fee for selling a fund too early, often 1% if you sell within a year. Check it before you invest.'],
    ] },
  { id: 'unclaimed', service: 'basics', min: 4, title: 'Forgotten money: is yours stuck somewhere?', sum: 'Crores sit unclaimed in old accounts, shares, funds and policies. Here is where to look.', tool: ['unclaimed', 'Unclaimed money finder'],
    body: [
      ['Bank deposits', 'Accounts untouched for 10 years and FDs not claimed 10 years after maturity go to the RBI\'s DEA Fund. Search on the RBI UDGAM portal and claim at the bank.'],
      ['Shares and dividends', 'Unclaimed for 7 years, they move to the IEPF. Search on the IEPF portal.'],
      ['Mutual funds and insurance', 'Use SEBI\'s MITRA search for old folios, and the insurer\'s unclaimed-amount page (linked from IRDAI\'s Bima Bharosa) for policies.'],
      ['Stay safe', 'All these portals are free. Don\'t pay agents or share OTPs.'],
    ] },
  { id: 'export-sites', service: 'basics', min: 4, title: 'Free government websites to take your business global', sum: 'Official portals for exporters and small businesses.', tool: null,
    body: [
      ['DGFT (dgft.gov.in)', 'Get your Importer-Exporter Code (IEC), which is mandatory to export or import, and learn about export schemes.'],
      ['Trade Connect (trade.gov.in)', 'The government\'s one-stop export platform: tariff and free-trade-agreement explorer, global e-commerce guide, trade events and contact with Indian missions abroad.'],
      ['Indian Trade Portal (indiantradeportal.in)', 'Trade agreements, tariffs, rules and statistics for markets you want to enter.'],
      ['Udyam and ECGC', 'Udyam registration (udyamregistration.gov.in) gives MSME benefits; ECGC (ecgc.in) insures exporters against buyers who don\'t pay.'],
    ] },
]

export function LearningCentre({ onBook, onTool }) {
  const [svc, setSvc] = useState('all'), [q, setQ] = useState(''), [open, setOpen] = useState(null)
  const match = (a) => (svc === 'all' || a.service === svc) && (a.title + a.sum).toLowerCase().includes(q.toLowerCase())
  const groups = LEARN_SERVICES.map((s) => ({ ...s, items: ARTICLES.filter((a) => a.service === s.key && match(a)) })).filter((g) => g.items.length)
  const svcOf = (k) => LEARN_SERVICES.find((s) => s.key === k)
  const Card = ({ a }) => (
    <Col md={6} lg={4}>
      <button type="button" className="guide" onClick={() => setOpen(a)}>
        <span className="small fw-semibold d-block" style={{ color: 'var(--c-forest)' }}>{a.min} min read</span>
        <span className="h5 d-block mt-1 mb-2">{a.title}</span>
        <span className="small d-block" style={{ color: 'var(--muted)' }}>{a.sum}</span>
        <span className="d-flex flex-wrap gap-2 mt-3 align-items-center">
          <span className="fw-bold small text-olive">Read guide <i className="bi bi-arrow-right" /></span>
          {a.tool && <span className="tag"><i className="bi bi-calculator me-1" />{a.tool[1]}</span>}
        </span>
      </button>
    </Col>
  )
  return (
    <section className="section" id="learn">
      <Container>
        <Row className="g-3 align-items-end mb-4">
          <Col lg={7}>
            <span className="eyebrow"><i className="bi bi-book" />Learning centre · {ARTICLES.length} guides</span>
            <h2 className="section-title mb-2">Short guides for every service. No jargon.</h2>
            <p className="lead-sm mb-0">The same simple explainers as our reels, written down, each with a calculator to try your own numbers.</p>
          </Col>
          <Col lg={5}><Form.Control aria-label="Search guides" placeholder="Search guides…" value={q} onChange={(e) => setQ(e.target.value)} /></Col>
        </Row>
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button type="button" className={`chip ${svc === 'all' ? 'on' : ''}`} onClick={() => setSvc('all')} aria-pressed={svc === 'all'}>All services</button>
          {LEARN_SERVICES.map((s) => (
            <button type="button" key={s.key} className={`chip ${svc === s.key ? 'on' : ''}`} onClick={() => setSvc(s.key)} aria-pressed={svc === s.key}>
              <i className={`bi ${s.icon} me-1`} />{s.title} <span className="opacity-75">({ARTICLES.filter((a) => a.service === s.key).length})</span>
            </button>
          ))}
        </div>
        {groups.length === 0 && <p className="text-center" style={{ color: 'var(--muted)' }}>No guides match “{q}”.</p>}
        {groups.map((g) => (
          <div key={g.key} className="mb-5">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <h3 className="h4 mb-0 d-flex align-items-center gap-2"><span className="feature-icon" style={{ width: 38, height: 38, fontSize: '1rem' }}><i className={`bi ${g.icon}`} /></span>{g.title}</h3>
              <Button size="sm" className="btn-ghost" onClick={() => onBook(g.topic)}>Talk to us about {g.title.toLowerCase()} <i className="bi bi-arrow-right" /></Button>
            </div>
            <Row className="g-4">{g.items.map((a) => <Card a={a} key={a.id} />)}</Row>
          </div>
        ))}
      </Container>
      <Offcanvas show={!!open} onHide={() => setOpen(null)} placement="end" className="guide-panel">
        {open && <>
          <Offcanvas.Header closeButton><span className="tag">{svcOf(open.service).title} · {open.min} min read</span></Offcanvas.Header>
          <Offcanvas.Body>
            <h3 className="mb-3">{open.title}</h3>
            {open.body.map(([h, p]) => <div key={h} className="mb-3"><h6 className="fw-bold">{h}</h6><p style={{ color: 'var(--muted)' }}>{p}</p></div>)}
            <div className="note mb-3">Educational content only, not personal advice.</div>
            <div className="d-grid gap-2">
              {open.tool && <Button className="btn-ghost" onClick={() => { const t = open.tool[0]; setOpen(null); onTool(t) }}><i className="bi bi-calculator me-2" />Try the {open.tool[1].toLowerCase()}</Button>}
              <Button className="btn-olive" onClick={() => { const t = svcOf(open.service).topic; setOpen(null); onBook(t) }}>Discuss this with an expert</Button>
            </div>
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
