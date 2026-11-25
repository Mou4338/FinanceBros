// Launch pricing for every service. Edit prices any time in the admin panel (live mode)
// or here (demo mode). `service` matches the service keys used across the site.
export const PLAN_CATALOGUE = [
  {
    "id": "free",
    "service": "all",
    "name": "Free",
    "price": 0,
    "per": "",
    "d": "For anyone getting started.",
    "f": [
      "All calculators & checklists",
      "Portfolio health check",
      "Learning centre guides",
      "Instagram explainers"
    ],
    "featured": false,
    "sort": 0
  },
  {
    "id": "loan-call",
    "service": "loans",
    "name": "Loan Advisory Call",
    "price": 499,
    "per": "/ session",
    "d": "45-min call to plan the right loan.",
    "f": [
      "Eligibility & EMI planning",
      "Compare lender offers",
      "Balance-transfer check",
      "Written summary after the call"
    ],
    "featured": false,
    "sort": 10
  },
  {
    "id": "loan-assist",
    "service": "loans",
    "name": "Loan Assistance",
    "price": 1999,
    "per": "/ loan",
    "d": "Hand-holding from application to disbursal.",
    "f": [
      "Everything in Advisory Call",
      "Document checklist & review",
      "Application with partner lenders",
      "Status tracking until disbursal"
    ],
    "featured": true,
    "sort": 11
  },
  {
    "id": "credit-fix",
    "service": "loans",
    "name": "Credit Score Fix-up",
    "price": 999,
    "per": "/ plan",
    "d": "Understand and improve your credit score.",
    "f": [
      "Credit report walkthrough",
      "Error & dispute guidance",
      "90-day improvement plan",
      "Follow-up review call"
    ],
    "featured": false,
    "sort": 12
  },
  {
    "id": "home-compare",
    "service": "loans",
    "name": "Home Loan Offer Comparison",
    "price": 799,
    "per": "/ comparison",
    "d": "Find the cheapest lender for your profile.",
    "f": [
      "Rates, fees & reset terms compared",
      "Fixed vs floating explained",
      "Tenure and EMI options",
      "Written recommendation"
    ],
    "featured": false,
    "sort": 13
  },
  {
    "id": "debt-plan",
    "service": "loans",
    "name": "Debt Consolidation Plan",
    "price": 1499,
    "per": "/ plan",
    "d": "Many EMIs and cards? One clear payoff order.",
    "f": [
      "All loans & cards on one sheet",
      "Payoff order (avalanche / snowball)",
      "Consolidation & balance-transfer options",
      "Monthly budget to stay debt-free"
    ],
    "featured": false,
    "sort": 14
  },
  {
    "id": "business-loan",
    "service": "loans",
    "name": "Business / MSME Loan Assist",
    "price": 2999,
    "per": "/ loan",
    "d": "Funding help for shops, startups and MSMEs.",
    "f": [
      "Udyam & document readiness",
      "Mudra / CGTMSE scheme fit",
      "Lender shortlisting & application",
      "Follow-up until sanction"
    ],
    "featured": false,
    "sort": 15,
    "fromPrice": true
  },
  {
    "id": "sip-start",
    "service": "sip",
    "name": "SIP Starter Session",
    "price": 499,
    "per": "/ session",
    "d": "Start your first SIP with confidence.",
    "f": [
      "Goal & time-horizon mapping",
      "Fund categories explained",
      "How much to invest each month",
      "Written summary after the call"
    ],
    "featured": true,
    "sort": 20
  },
  {
    "id": "sip-review",
    "service": "sip",
    "name": "SIP & Fund Review",
    "price": 999,
    "per": "/ review",
    "d": "Check the SIPs you already have.",
    "f": [
      "Overlap & category check",
      "Costs: direct vs regular",
      "Returns vs benchmark (XIRR)",
      "30-min walkthrough call"
    ],
    "featured": false,
    "sort": 21
  },
  {
    "id": "goal-sip",
    "service": "sip",
    "name": "Goal-based SIP Plan",
    "price": 1299,
    "per": "/ plan",
    "d": "A separate SIP for each goal, done right.",
    "f": [
      "Goals priced with inflation",
      "SIP amount & step-up per goal",
      "Fund categories per goal",
      "When to shift to safety"
    ],
    "featured": false,
    "sort": 22
  },
  {
    "id": "mf-cleanup",
    "service": "sip",
    "name": "MF Portfolio Clean-up",
    "price": 1499,
    "per": "/ plan",
    "d": "Too many funds? Cut overlap and costs.",
    "f": [
      "Overlap & duplicate fund check",
      "Regular → direct switch plan",
      "Exit load & tax-aware exit order",
      "Simple 3–5 fund structure"
    ],
    "featured": false,
    "sort": 23
  },
  {
    "id": "elss-setup",
    "service": "sip",
    "name": "Tax-saver ELSS Setup",
    "price": 399,
    "per": "/ session",
    "d": "Save tax under 80C (old regime) the smart way.",
    "f": [
      "Is ELSS right for your regime?",
      "Amount for your 80C gap",
      "Lock-in & tax on withdrawal explained",
      "Setup walkthrough"
    ],
    "featured": false,
    "sort": 24
  },
  {
    "id": "report",
    "service": "wealth",
    "name": "Portfolio Health Report",
    "price": 1499,
    "per": "/ report",
    "d": "A full report on everything you hold.",
    "f": [
      "Allocation & concentration analysis",
      "Fund overlap analysis",
      "Goal mapping",
      "PDF report + 30-min call"
    ],
    "featured": true,
    "sort": 30
  },
  {
    "id": "wealth-annual",
    "service": "wealth",
    "name": "Wealth Review Plan",
    "price": 5999,
    "per": "/ year",
    "d": "Ongoing portfolio reviews for the year.",
    "f": [
      "Portfolio Health Report",
      "Quarterly review calls",
      "Rebalancing reminders",
      "Priority WhatsApp support"
    ],
    "featured": false,
    "sort": 31
  },
  {
    "id": "rebalance",
    "service": "wealth",
    "name": "Rebalancing Session",
    "price": 799,
    "per": "/ session",
    "d": "Bring your mix back to plan.",
    "f": [
      "Current vs target allocation",
      "What to trim and add",
      "Tax-efficient way to rebalance",
      "Written action list"
    ],
    "featured": false,
    "sort": 32
  },
  {
    "id": "nri",
    "service": "wealth",
    "name": "NRI Investment Setup",
    "price": 2499,
    "per": "/ setup",
    "d": "Invest in India from abroad, properly.",
    "f": [
      "NRE vs NRO accounts",
      "KYC & FATCA for mutual funds",
      "Country restrictions explained",
      "Tax & repatriation basics"
    ],
    "featured": false,
    "sort": 33
  },
  {
    "id": "unclaimed-help",
    "service": "wealth",
    "name": "Unclaimed Money Recovery",
    "price": 999,
    "per": "/ case",
    "d": "Recover old deposits, shares, MF units or PF.",
    "f": [
      "Search on official portals",
      "Document & claim-form checklist",
      "Transmission help for family assets",
      "Follow-up until credited"
    ],
    "featured": false,
    "sort": 34
  },
  {
    "id": "consult",
    "service": "planning",
    "name": "Planning Consultation",
    "price": 499,
    "per": "/ session",
    "d": "One focused 45-min expert call.",
    "f": [
      "Budget, goals or debt topic",
      "Review of your numbers",
      "Written summary after the call",
      "WhatsApp follow-up for 7 days"
    ],
    "featured": false,
    "sort": 40
  },
  {
    "id": "plan-full",
    "service": "planning",
    "name": "Complete Financial Plan",
    "price": 2999,
    "per": "/ plan",
    "d": "One plan for budget, goals and retirement.",
    "f": [
      "Budget & emergency fund",
      "Goals & retirement corpus",
      "Debt repayment order",
      "Insurance gap check"
    ],
    "featured": true,
    "sort": 41
  },
  {
    "id": "annual",
    "service": "planning",
    "name": "Annual Plan",
    "price": 4999,
    "per": "/ year",
    "d": "Your plan, reviewed all year.",
    "f": [
      "Complete Financial Plan",
      "Quarterly reviews",
      "Loan & insurance check-ups",
      "Priority WhatsApp support"
    ],
    "featured": false,
    "sort": 42
  },
  {
    "id": "retire-plan",
    "service": "planning",
    "name": "Retirement Plan",
    "price": 1999,
    "per": "/ plan",
    "d": "Know your number and how to reach it.",
    "f": [
      "Retirement corpus with inflation",
      "SIP & step-up needed",
      "EPF, PPF & NPS fit",
      "Income plan after retirement (SWP)"
    ],
    "featured": false,
    "sort": 43
  },
  {
    "id": "child-plan",
    "service": "planning",
    "name": "Child Education & Marriage Plan",
    "price": 1499,
    "per": "/ plan",
    "d": "Fund your child's big milestones on time.",
    "f": [
      "Future cost of each milestone",
      "SIP per goal",
      "Sukanya / PPF / MF fit",
      "Safety shift before the goal year"
    ],
    "featured": false,
    "sort": 44
  },
  {
    "id": "family-kit",
    "service": "planning",
    "name": "Family Emergency & Nominee Kit",
    "price": 999,
    "per": "/ family",
    "d": "Get parents and family ready before a crisis.",
    "f": [
      "Nominees on every account",
      "One list of all assets & policies",
      "Will & joint-account guidance",
      "Emergency fund & health cover check"
    ],
    "featured": false,
    "sort": 45
  },
  {
    "id": "ins-review",
    "service": "insurance",
    "name": "Insurance Needs Review",
    "price": 699,
    "per": "/ review",
    "d": "Are you over- or under-insured?",
    "f": [
      "Term & health cover check",
      "Existing policy review",
      "Claim-process guidance",
      "Written summary"
    ],
    "featured": false,
    "sort": 50
  },
  {
    "id": "tax-check",
    "service": "insurance",
    "name": "Tax Regime & Savings Check",
    "price": 499,
    "per": "/ session",
    "d": "Old or new regime? Which tax savers?",
    "f": [
      "Regime comparison on your numbers",
      "Deductions you are missing",
      "PPF / ELSS / NPS fit",
      "Written summary"
    ],
    "featured": true,
    "sort": 51
  },
  {
    "id": "itr",
    "service": "insurance",
    "name": "ITR Filing Assistance",
    "price": 999,
    "per": "/ return",
    "d": "Filing done by our partner tax professional.",
    "f": [
      "Salary & simple returns",
      "Document checklist",
      "Filing & e-verification help",
      "Notice support guidance"
    ],
    "featured": false,
    "sort": 52,
    "fromPrice": true
  },
  {
    "id": "term-health",
    "service": "insurance",
    "name": "Term + Health Cover Selection",
    "price": 999,
    "per": "/ plan",
    "d": "The right cover amount and policy features.",
    "f": [
      "Cover amount for your family",
      "Term & health features compared",
      "Riders and top-ups explained",
      "Disclosure tips to avoid rejection"
    ],
    "featured": false,
    "sort": 53
  },
  {
    "id": "claim-help",
    "service": "insurance",
    "name": "Claim Rejection Support",
    "price": 1499,
    "per": "/ case",
    "d": "Help when a claim is rejected or cut short.",
    "f": [
      "Rejection letter & policy review",
      "Grievance letter drafted",
      "Bima Bharosa & Ombudsman filing help",
      "Deadline tracking"
    ],
    "featured": false,
    "sort": 54
  },
  {
    "id": "itr-cg",
    "service": "insurance",
    "name": "ITR with Capital Gains",
    "price": 1999,
    "per": "/ return",
    "d": "Shares, mutual funds or property sold this year.",
    "f": [
      "Capital gains statement review",
      "LTCG / STCG computed",
      "Loss set-off & carry-forward",
      "Filing & e-verification"
    ],
    "featured": false,
    "sort": 55,
    "fromPrice": true
  },
  {
    "id": "notice",
    "service": "insurance",
    "name": "Tax Notice Reply Help",
    "price": 1499,
    "per": "/ notice",
    "d": "Got an income-tax notice? Don't panic.",
    "f": [
      "Notice explained in plain words",
      "Documents to gather",
      "Reply drafted with our partner CA",
      "Follow-up support"
    ],
    "featured": false,
    "sort": 56,
    "fromPrice": true
  }
]
