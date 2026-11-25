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
  }
]
