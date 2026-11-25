-- =====================================================================
-- Per-service pricing (safe to run again; updates existing rows)
-- =====================================================================
alter table public.plans add column if not exists service text default 'planning';
insert into public.plans (id, service, name, price, per, d, f, featured, sort) values
  ('free', 'all', 'Free', 0, '', 'For anyone getting started.', array['All calculators & checklists','Portfolio health check','Learning centre guides','Instagram explainers'], false, 0),
  ('loan-call', 'loans', 'Loan Advisory Call', 499, '/ session', '45-min call to plan the right loan.', array['Eligibility & EMI planning','Compare lender offers','Balance-transfer check','Written summary after the call'], false, 10),
  ('loan-assist', 'loans', 'Loan Assistance', 1999, '/ loan', 'Hand-holding from application to disbursal.', array['Everything in Advisory Call','Document checklist & review','Application with partner lenders','Status tracking until disbursal'], true, 11),
  ('credit-fix', 'loans', 'Credit Score Fix-up', 999, '/ plan', 'Understand and improve your credit score.', array['Credit report walkthrough','Error & dispute guidance','90-day improvement plan','Follow-up review call'], false, 12),
  ('sip-start', 'sip', 'SIP Starter Session', 499, '/ session', 'Start your first SIP with confidence.', array['Goal & time-horizon mapping','Fund categories explained','How much to invest each month','Written summary after the call'], true, 20),
  ('sip-review', 'sip', 'SIP & Fund Review', 999, '/ review', 'Check the SIPs you already have.', array['Overlap & category check','Costs: direct vs regular','Returns vs benchmark (XIRR)','30-min walkthrough call'], false, 21),
  ('report', 'wealth', 'Portfolio Health Report', 1499, '/ report', 'A full report on everything you hold.', array['Allocation & concentration analysis','Fund overlap analysis','Goal mapping','PDF report + 30-min call'], true, 30),
  ('wealth-annual', 'wealth', 'Wealth Review Plan', 5999, '/ year', 'Ongoing portfolio reviews for the year.', array['Portfolio Health Report','Quarterly review calls','Rebalancing reminders','Priority WhatsApp support'], false, 31),
  ('consult', 'planning', 'Planning Consultation', 499, '/ session', 'One focused 45-min expert call.', array['Budget, goals or debt topic','Review of your numbers','Written summary after the call','WhatsApp follow-up for 7 days'], false, 40),
  ('plan-full', 'planning', 'Complete Financial Plan', 2999, '/ plan', 'One plan for budget, goals and retirement.', array['Budget & emergency fund','Goals & retirement corpus','Debt repayment order','Insurance gap check'], true, 41),
  ('annual', 'planning', 'Annual Plan', 4999, '/ year', 'Your plan, reviewed all year.', array['Complete Financial Plan','Quarterly reviews','Loan & insurance check-ups','Priority WhatsApp support'], false, 42),
  ('ins-review', 'insurance', 'Insurance Needs Review', 699, '/ review', 'Are you over- or under-insured?', array['Term & health cover check','Existing policy review','Claim-process guidance','Written summary'], false, 50),
  ('tax-check', 'insurance', 'Tax Regime & Savings Check', 499, '/ session', 'Old or new regime? Which tax savers?', array['Regime comparison on your numbers','Deductions you are missing','PPF / ELSS / NPS fit','Written summary'], true, 51),
  ('itr', 'insurance', 'ITR Filing Assistance', 999, '/ return', 'Filing done by our partner tax professional.', array['Salary & simple returns','Document checklist','Filing & e-verification help','Notice support guidance'], false, 52)
on conflict (id) do update set service = excluded.service, name = excluded.name, price = excluded.price,
  per = excluded.per, d = excluded.d, f = excluded.f, featured = excluded.featured, sort = excluded.sort;
