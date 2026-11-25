# Finance Bros: launch guide

This guide takes the website from **demo mode** (data saved only in the visitor's browser) to **live**: a real database, real logins, email confirmations, online payments and your own domain.

Work through the stages in order. Expect about one day for stages 1–5. Payments in stage 7 also need Razorpay to approve your business KYC first.

| Stage | What you get | Cost to start |
|---|---|---|
| 1. Run it locally | The site on your laptop | Free |
| 2. Supabase | Database, logins, admin panel, privacy rules | Free tier |
| 3. Connect the site | Live bookings and enquiries | — |
| 4. Make yourself admin | Real admin login (no more PIN) | — |
| 5. Vercel + domain | Public website with HTTPS | Free hosting, ~₹800–1,000/yr domain |
| 6. Emails (Resend) | Confirmation emails to customers and to you | Free tier |
| 7. Payments (Razorpay) | "Pay now" for consultations | Per-transaction fee |
| 8. Before launch | Compliance, testing, SEO | — |

---

## 1. Run it locally
1. Install **Node.js 22 LTS** (nodejs.org), **Git** and **VS Code**.
2. Unzip the project and open the folder in VS Code. Open the terminal (Ctrl + `).
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open http://localhost:5173. The site runs in demo mode until you add keys in stage 3.

**Where to edit things**
| What | File |
|---|---|
| Phone, email, Instagram | `src/components/Header.jsx`, `src/components/Sections.jsx` |
| Colours | top of `src/styles.css` |
| Hero photo | `src/assets/hero.jpg` |
| Founders (names, photos) | `FOUNDERS` list at the top of `src/components/About.jsx` |
| Services text | `src/components/Services.jsx` |
| Guides | `src/components/Learn.jsx` |
| Legal text | `LEGAL` in `src/components/Learn.jsx` |

## 2. Create the Supabase backend
1. Sign up at **supabase.com**, then create a new project. Choose region **Mumbai (ap-south-1)** so data stays in India and the site is faster for Indian visitors.
2. Go to **SQL Editor**, then **New query**. Paste all of `supabase/schema.sql` and click **Run**.
   This creates every table, the privacy rules, the slot-checking functions and the starting prices.
3. Go to **Authentication → URL Configuration** and set **Site URL** to `http://localhost:5173` for now. Change it to your real domain in stage 5.
4. Go to **Authentication → Providers → Email**. Keep "Confirm email" **on**, so customers confirm their email address before logging in.

## 3. Connect the website to Supabase
1. Go to **Project Settings → API** and copy the **Project URL** and the **anon public** key.
2. In the project folder, copy `.env.example` to a new file called `.env` and fill in:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
3. Restart `npm run dev`. The site is now **live**: bookings, enquiries, accounts and reports are saved in Supabase.
   - The anon key is safe in the browser, because the privacy rules decide what each person can see.
   - The **service_role** key bypasses those rules. Never put it in `.env` or anywhere in the website code.

## 4. Make yourself an admin
1. On the site, click **Log in**, then **Create account**, using your own email. Then confirm the email.
2. In Supabase **SQL Editor**, run:
   ```sql
   update public.profiles set role = 'admin' where email = 'your@email.com';
   ```
3. Log out and log back in, then open `#admin`. You now have the full admin panel: enquiries, bookings, assigning consultants and editing prices.
   In live mode the demo PIN is switched off. Repeat this for your brother's account.

## 5. Put it online (Vercel) and connect your domain
1. Create a **GitHub** account and a new **private** repository. Push the project to it:
   ```bash
   git init && git add . && git commit -m "Finance Bros website"
   git branch -M main
   git remote add origin https://github.com/<you>/finance-bros.git
   git push -u origin main
   ```
   `.env` is in `.gitignore`, so your keys are never uploaded.
2. In **vercel.com**, choose **Add New → Project** and import the repository. Vercel detects Vite automatically.
3. Under **Environment Variables**, add the same `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and later `VITE_RAZORPAY_KEY_ID`. Then click **Deploy**.
4. Buy your domain (e.g. `financebros.in`) from GoDaddy, Hostinger or Namecheap.
   In Vercel go to **Settings → Domains** and add it, then copy the DNS records Vercel shows into your domain provider. HTTPS is set up automatically.
5. Back in Supabase, go to **Authentication → URL Configuration**. Set **Site URL** to `https://financebros.in` and add it to the Redirect URLs.

From now on, every `git push` updates the website automatically.

## 6. Confirmation emails (Resend)
1. Sign up at **resend.com**. Add and verify your domain by adding the DNS records it shows, then create an API key.
2. Install the Supabase CLI and deploy the email function:
   ```bash
   npm i -g supabase
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase secrets set RESEND_API_KEY=re_xxx FROM_EMAIL="Finance Bros <hello@financebros.in>" ADMIN_EMAIL=you@email.com NOTIFY_SECRET=<any-long-random-text>
   supabase functions deploy notify --no-verify-jwt
   ```
3. In Supabase go to **Database → Webhooks** and click **Create**. Create **two** webhooks, one for the `enquiries` table and one for `bookings`, each set like this:
   - **Event:** Insert
   - **Type:** Supabase Edge Functions, function `notify`
   - **HTTP header:** `x-webhook-secret` = the same `NOTIFY_SECRET` value

   Customers then get a confirmation email, and you get an alert for every new lead or booking.
4. Optional: use Supabase **Authentication → SMTP Settings** to send login emails through Resend as well, so they come from your domain.

**WhatsApp:** to start, link your WhatsApp Business number on the site (`https://wa.me/91XXXXXXXXXX`). Automatic WhatsApp messages need an approved Business API provider (e.g. Interakt, WATI or Gupshup) and customer consent, so add them later.

## 7. Online payments (Razorpay)
1. Sign up at **razorpay.com** and finish **KYC**: PAN, bank account, business details and GST if registered. Test in **Test Mode** first.
2. Deploy the two payment functions:
   ```bash
   supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxx RAZORPAY_KEY_SECRET=xxx RAZORPAY_WEBHOOK_SECRET=<any-long-random-text>
   supabase functions deploy razorpay-order
   supabase functions deploy razorpay-webhook --no-verify-jwt
   ```
3. In the Razorpay Dashboard go to **Webhooks → Add**:
   - **URL:** `https://<project-ref>.supabase.co/functions/v1/razorpay-webhook`
   - **Events:** `payment.captured`, `payment.failed`
   - **Secret:** the same `RAZORPAY_WEBHOOK_SECRET`
4. Add `VITE_RAZORPAY_KEY_ID=rzp_test_xxx` to `.env` and to Vercel, then redeploy.
   A **Pay now** button appears on unpaid bookings in My Account.
   The price comes from the Consultation plan you set in the admin panel, and a booking is marked **Paid** only after Razorpay's signed webhook confirms the payment.
5. When testing works, switch to **Live** keys (`rzp_live_…`) in the same places.

## 8. Before you announce it
**Compliance.** Please get professional advice on these points:
- Personalised investment advice needs a **SEBI-registered Investment Adviser** (or a partnership with one).
- Distributing mutual funds needs **NISM certification and an AMFI ARN**, and must be kept separate from advice.
- Loans must be referred only to **RBI-regulated** banks or NBFCs, under written partner agreements.
- Insurance must go only through **IRDAI-licensed** intermediaries.
- Have a lawyer review the Privacy Policy, Terms and Disclosures in `src/components/Learn.jsx`. India's **DPDP Act** covers personal data, so keep a way for customers to request deletion.

**Test on a phone and a laptop:**
- [ ] Callback form → email received → shows in admin
- [ ] Booking → slot shows as taken for the next person → confirmation email
- [ ] Register → confirm email → log in → see your own bookings only
- [ ] A second test customer cannot see the first customer's data
- [ ] Admin can change statuses, assign consultants and edit prices
- [ ] Test payment → booking shows **Paid**

**Get found:**
- [ ] Add **Google Analytics 4** (paste its tag into `index.html`) and **Google Search Console**
- [ ] Create a **Google Business Profile**
- [ ] Put the site link in the @finance.bros.in bio, and point reels at the calculators

## Running costs (to start)
- **Hosting (Vercel) and backend (Supabase):** free tiers are enough to launch. Upgrade only when traffic grows.
- **Domain:** about ₹800–1,000 a year.
- **Emails (Resend):** the free tier covers early volume.
- **Razorpay:** a fee per successful payment, no fixed cost.

## Project structure
```
src/
  App.jsx                 pages and routing (#home, #services, #calculators …)
  services/store.jsx      data layer: demo mode + Supabase live mode
  services/supabase.js    Supabase connection (reads .env)
  components/             one file per page section
  utils/finance.js        all calculator formulas
supabase/
  schema.sql              database, privacy rules, starting data
  functions/notify        confirmation emails
  functions/razorpay-*    payments
```
