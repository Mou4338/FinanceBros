# Finance Bros – React + React-Bootstrap website

    npm install
    npm run dev      # local dev server
    npm run build    # dist/index.html (single self-contained file)

Structure
- src/components/Header.jsx       top bar + sticky navbar
- src/components/Hero.jsx         hero (diagonal olive planes + dashboard cards)
- src/components/Services.jsx     5 service verticals (tabbed catalogue)
- src/components/Features.jsx     stats strip + "why us" + dashboard mock
- src/components/Calculators.jsx  EMI, SIP/Step-up/Lumpsum, eligibility, retirement, emergency fund
- src/components/HealthCheck.jsx  portfolio health score + risk quiz
- src/components/Sections.jsx     how it works, pricing, FAQ, contact/lead form, footer
- src/utils/finance.js            all formulas
- src/styles.css                  olive/white theme (CSS variables at the top)

The lead form only shows a confirmation for now; connect it to Supabase/Resend/your CRM in App.jsx `done()`.
Replace the placeholder phone, email and pricing before launch.
