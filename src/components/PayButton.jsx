import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useStore } from '../services/store.jsx'
import { supabase } from '../services/supabase.js'

const KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

function loadCheckout() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve()
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = resolve
    s.onerror = () => reject(new Error('Could not load Razorpay'))
    document.body.appendChild(s)
  })
}

/* "Pay now" for a booking (FR-08). Shown only in LIVE mode with a Razorpay key.
   The amount is decided on the server (razorpay-order function), and the booking is
   marked paid only by the verified Razorpay webhook — never by the browser. */
export default function PayButton({ booking }) {
  const { mode, user } = useStore()
  const [state, setState] = useState('')
  if (mode !== 'live' || !KEY_ID) return null
  if (booking.payment_status === 'paid') return <span className="st st-success align-self-center"><i className="bi bi-check2 me-1" />Paid</span>

  const pay = async () => {
    try {
      setState('Opening payment…')
      await loadCheckout()
      const { data, error } = await supabase.functions.invoke('razorpay-order', { body: { booking_id: booking.id } })
      if (error) throw error
      const rzp = new window.Razorpay({
        key: KEY_ID,
        order_id: data.order_id,
        amount: data.amount,
        currency: 'INR',
        name: 'Finance Bros',
        description: `${booking.service} consultation · ${booking.ref}`,
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        theme: { color: '#1F7A45' },
        handler: () => setState('Payment received — confirming…'),
        modal: { ondismiss: () => setState('') },
      })
      rzp.open()
    } catch (e) {
      setState(`Payment could not start: ${e.message}`)
    }
  }
  return (
    <>
      <Button size="sm" className="btn-olive" onClick={pay}><i className="bi bi-credit-card me-1" />Pay now</Button>
      {state && <span className="small align-self-center" style={{ color: 'var(--muted)' }}>{state}</span>}
    </>
  )
}
