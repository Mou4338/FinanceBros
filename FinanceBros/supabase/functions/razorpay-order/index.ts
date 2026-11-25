// Supabase Edge Function: razorpay-order
// Creates a Razorpay order for a booking. The price is read from the `plans` table
// on the server, so a customer cannot change what they pay.
// Secrets: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET  (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are built in)
import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const { booking_id } = await req.json()
    const url = Deno.env.get('SUPABASE_URL')!

    // Who is asking? (uses the customer's own login token)
    const asUser = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    })
    // RLS: this only returns the booking if it belongs to the logged-in customer
    const { data: booking, error } = await asUser.from('bookings').select('id, ref, payment_status, status').eq('id', booking_id).single()
    if (error || !booking) return json({ error: 'Booking not found' }, 404)
    if (booking.payment_status === 'paid') return json({ error: 'Already paid' }, 400)
    if (booking.status === 'Cancelled') return json({ error: 'Booking is cancelled' }, 400)

    const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: plan } = await admin.from('plans').select('price').eq('id', 'consult').single()
    const amount = (plan?.price ?? 499) * 100 // paise

    const auth = btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_KEY_SECRET')}`)
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency: 'INR', receipt: booking.ref, notes: { booking_id: booking.id } }),
    })
    const order = await r.json()
    if (!r.ok) return json({ error: order?.error?.description ?? 'Razorpay error' }, 502)

    await admin.from('payments').insert({ booking_id: booking.id, razorpay_order_id: order.id, amount, status: 'created' })
    return json({ order_id: order.id, amount })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
