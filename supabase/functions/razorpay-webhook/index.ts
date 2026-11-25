// Supabase Edge Function: razorpay-webhook
// Razorpay calls this after a payment. We verify the signature, then mark the booking paid.
// Razorpay Dashboard → Webhooks → URL: https://<project>.supabase.co/functions/v1/razorpay-webhook
//   events: payment.captured, payment.failed   secret: same as RAZORPAY_WEBHOOK_SECRET
// Deploy with:  supabase functions deploy razorpay-webhook --no-verify-jwt
// Secrets: RAZORPAY_WEBHOOK_SECRET
import { createClient } from 'npm:@supabase/supabase-js@2'

async function hmacHex(secret: string, body: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  const raw = await req.text()
  const expected = await hmacHex(Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!, raw)
  if (expected !== req.headers.get('x-razorpay-signature')) return new Response('bad signature', { status: 401 })

  const evt = JSON.parse(raw)
  const p = evt?.payload?.payment?.entity
  if (!p?.order_id) return new Response('ignored')

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const status = evt.event === 'payment.captured' ? 'captured' : evt.event === 'payment.failed' ? 'failed' : p.status
  const { data: pay } = await db.from('payments')
    .update({ razorpay_payment_id: p.id, status })
    .eq('razorpay_order_id', p.order_id)
    .select('booking_id').single()

  if (status === 'captured' && pay?.booking_id) {
    await db.from('bookings').update({ payment_status: 'paid' }).eq('id', pay.booking_id)
  }
  return new Response('ok')
})
