// Supabase Edge Function: notify
// Sends confirmation emails (via Resend) when a new enquiry or booking is saved.
// Trigger: Supabase → Database → Webhooks → on INSERT into `enquiries` and `bookings`
//          → type "Supabase Edge Functions" → function "notify".
// Secrets: RESEND_API_KEY, FROM_EMAIL (e.g. "Finance Bros <hello@financebros.in>"), ADMIN_EMAIL, NOTIFY_SECRET
// In the webhook, add an HTTP header  x-webhook-secret: <NOTIFY_SECRET>  so nobody else can trigger emails.

const RESEND = Deno.env.get('RESEND_API_KEY')!
const FROM = Deno.env.get('FROM_EMAIL') ?? 'Finance Bros <onboarding@resend.dev>'
const ADMIN = Deno.env.get('ADMIN_EMAIL')

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

async function send(to: string, subject: string, html: string) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })
  if (!r.ok) console.error('Resend error', r.status, await r.text())
}

const shell = (title: string, body: string) => `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#121513">
    <div style="background:#121513;padding:18px 24px;border-radius:12px 12px 0 0">
      <span style="color:#fff;font-weight:700;font-size:18px">Finance<span style="color:#5CC48A">Bros</span></span>
    </div>
    <div style="border:1px solid #E4E7E5;border-top:0;padding:24px;border-radius:0 0 12px 12px">
      <h2 style="margin:0 0 12px">${title}</h2>${body}
      <p style="color:#5F6662;font-size:12px;margin-top:24px">Calculator results and guides are educational. Mutual fund investments are subject to market risks.</p>
    </div>
  </div>`

Deno.serve(async (req) => {
  if (req.headers.get('x-webhook-secret') !== Deno.env.get('NOTIFY_SECRET')) return new Response('forbidden', { status: 403 })
  const payload = await req.json()
  const { table, type, record: r } = payload
  if (type !== 'INSERT' || !r) return new Response('ignored')

  if (table === 'bookings') {
    const when = `${esc(r.date)} at ${esc(r.slot)} IST`
    await send(r.email, `Booking received — ${r.ref}`, shell('We got your booking request',
      `<p>Hi ${esc(r.name)},</p><p>Thanks for booking a <b>${esc(r.service)}</b> consultation (${esc(r.mode)}) on <b>${when}</b>.</p>
       <p>Reference: <b>${esc(r.ref)}</b>. Our team will confirm the slot by phone or WhatsApp shortly.</p>`))
    if (ADMIN) await send(ADMIN, `New booking ${r.ref}: ${r.service}`, shell('New booking',
      `<p>${esc(r.name)} · ${esc(r.phone)} · ${esc(r.email)}</p><p>${esc(r.service)} · ${esc(r.mode)} · ${when}</p><p>${esc(r.notes)}</p>`))
  }

  if (table === 'enquiries') {
    await send(r.email, `We received your request — ${r.ref}`, shell('Thanks for reaching out',
      `<p>Hi ${esc(r.name)},</p><p>We received your request about <b>${esc(r.topic)}</b>. A Finance Bros expert will call you within one working day.</p>
       <p>Reference: <b>${esc(r.ref)}</b></p>`))
    if (ADMIN) await send(ADMIN, `New enquiry ${r.ref}: ${r.topic}`, shell('New enquiry',
      `<p>${esc(r.name)} · ${esc(r.phone)} · ${esc(r.email)} · ${esc(r.city)}</p><p>${esc(r.topic)} · ${esc(r.employment)} · ${esc(r.income)} · prefers ${esc(r.time)}</p><p>${esc(r.message)}</p><p>Source: ${esc(r.source)}</p>`))
  }
  return new Response('ok')
})
