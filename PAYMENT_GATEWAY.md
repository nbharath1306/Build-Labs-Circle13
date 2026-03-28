# Circle13 — Razorpay Integration Guide
**Version:** 1.0

---

## 1. Account Setup

1. Go to razorpay.com → Create account
2. Complete KYC (PAN, bank account, business details)
3. Use **Test Mode** during development (no real money)
4. Switch to **Live Mode** before launch
5. Get API keys from: Dashboard → Settings → API Keys

```
Test keys:  rzp_test_xxxxxxxxxx  (safe to use in dev)
Live keys:  rzp_live_xxxxxxxxxx  (only on production)
```

---

## 2. How Razorpay Works (Circle13 Flow)

```
Step 1: User selects tier + clicks "Register Now"
        ↓
Step 2: Your server creates a Razorpay Order
        POST /v1/orders → returns { order_id, amount, currency }
        ↓
Step 3: Frontend opens Razorpay Checkout modal
        User pays via UPI / Card / Wallet
        ↓
Step 4: Razorpay calls your webhook (server-to-server)
        POST /api/webhook/razorpay
        Event: payment.captured
        ↓
Step 5: Your server verifies signature → marks registration confirmed
        ↓
Step 6: n8n fires → welcome email sent
```

**Why webhook (not redirect):**  
Redirects can fail if user closes browser. Webhook is server-to-server — always fires even if user's browser crashes.

---

## 3. Server-Side: Create Order

```typescript
// app/api/register/route.ts
import Razorpay from "razorpay"
import { createClient } from "@/lib/supabase"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  const { name, email, phone, workshop_id, tier, coupon_code } = await req.json()

  // 1. Calculate amount
  const prices = { early_bird: 39900, standard: 79900, bundle: 149900 }
  let amount = prices[tier]  // in paise (₹399 = 39900 paise)
  
  // 2. Apply coupon if provided
  if (coupon_code) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", coupon_code.toUpperCase())
      .single()
    
    if (coupon && coupon.used_count < coupon.max_uses) {
      if (coupon.discount_type === "percent") {
        amount = amount * (1 - coupon.discount_value / 100)
      } else {
        amount = amount - (coupon.discount_value * 100)
      }
    }
  }

  // 3. Create pending registration in Supabase
  const { data: registration } = await supabase
    .from("registrations")
    .insert({ name, email, phone, workshop_id, tier, amount_paid: amount / 100, status: "pending" })
    .select()
    .single()

  // 4. Create Razorpay order
  const order = await razorpay.orders.create({
    amount: Math.round(amount),
    currency: "INR",
    receipt: registration.id,  // use registration ID as receipt
    notes: {
      registration_id: registration.id,
      workshop_id,
      tier,
      name,
      email
    }
  })

  // 5. Save order ID to registration
  await supabase
    .from("registrations")
    .update({ razorpay_order_id: order.id })
    .eq("id", registration.id)

  return Response.json({ 
    order_id: order.id, 
    amount: order.amount,
    registration_id: registration.id 
  })
}
```

---

## 4. Client-Side: Open Checkout

```typescript
// components/RegistrationForm.tsx — payment trigger

declare global {
  interface Window { Razorpay: any }
}

async function handlePayment() {
  // 1. Create order on server
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, workshop_id, tier, coupon_code })
  })
  const { order_id, amount } = await res.json()

  // 2. Load Razorpay script (if not already loaded)
  if (!window.Razorpay) {
    await new Promise(resolve => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = resolve
      document.body.appendChild(script)
    })
  }

  // 3. Open checkout
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount,
    currency: "INR",
    name: "Circle13 Build Lab",
    description: `AI Build Lab — ${tier} tier`,
    image: "https://circle13.in/logo.png",  // your logo URL
    order_id,
    handler: function (response: any) {
      // This fires on SUCCESS in the browser
      // BUT don't rely on this alone — use webhook for confirmation
      // Just show success UI to user
      window.location.href = `/confirm?order=${order_id}`
    },
    prefill: {
      name,
      email,
      contact: phone
    },
    theme: {
      color: "#b8f23c"  // Circle13 green
    },
    modal: {
      ondismiss: function() {
        // User closed checkout without paying
        setPaymentStatus("cancelled")
      }
    }
  }

  const rzp = new window.Razorpay(options)
  rzp.on("payment.failed", function(response: any) {
    console.error("Payment failed:", response.error)
    setPaymentStatus("failed")
    setErrorMessage(response.error.description)
  })
  rzp.open()
}
```

---

## 5. Webhook Handler — The Critical Part

```typescript
// app/api/webhook/razorpay/route.ts
import crypto from "crypto"
import { createClient } from "@/lib/supabase"

export async function POST(req: Request) {
  const body = await req.text()  // raw body for signature verification
  const signature = req.headers.get("x-razorpay-signature")
  
  // 1. VERIFY SIGNATURE — never skip this
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex")
  
  if (signature !== expectedSignature) {
    console.error("Invalid Razorpay signature")
    return new Response("Unauthorized", { status: 401 })
  }

  const event = JSON.parse(body)

  // 2. Handle events
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity
    const order_id = payment.order_id
    const payment_id = payment.id
    const registration_id = payment.notes?.registration_id

    // 3. Update registration status
    await supabase
      .from("registrations")
      .update({ 
        status: "confirmed",
        razorpay_payment_id: payment_id,
        confirmed_at: new Date().toISOString()
      })
      .eq("razorpay_order_id", order_id)

    // 4. Increment coupon usage if applicable
    if (payment.notes?.coupon_code) {
      await supabase.rpc("increment_coupon_usage", { 
        coupon_code: payment.notes.coupon_code 
      })
    }

    // 5. Trigger n8n automation
    await fetch(process.env.N8N_WEBHOOK_BASE_URL + "/webhook/registration-confirmed", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET!
      },
      body: JSON.stringify({ registration_id, payment_id, order_id })
    })
  }

  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity
    
    await supabase
      .from("registrations")
      .update({ status: "failed" })
      .eq("razorpay_order_id", payment.order_id)

    // Trigger payment failure workflow in n8n
    await fetch(process.env.N8N_WEBHOOK_BASE_URL + "/webhook/payment-failed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        registration_id: payment.notes?.registration_id,
        email: payment.email
      })
    })
  }

  return new Response("OK", { status: 200 })
}
```

---

## 6. Setting Up Webhook in Razorpay Dashboard

1. Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://circle13.in/api/webhook/razorpay`
3. Select events:
   - `payment.captured` ✓
   - `payment.failed` ✓
   - `refund.created` ✓ (optional)
4. Set Webhook Secret — copy to `.env` as `RAZORPAY_WEBHOOK_SECRET`
5. For local development: use [ngrok](https://ngrok.com) to expose localhost

```bash
# Local testing
ngrok http 3000
# Copy the https URL → use as webhook URL in Razorpay dashboard
```

---

## 7. Pricing & Coupon Logic

### Tier Prices (paise — multiply ₹ by 100)
```typescript
const PRICES = {
  early_bird: 39900,   // ₹399
  standard:   79900,   // ₹799
  bundle:    149900,   // ₹1499
} as const
```

### Coupon Code Logic
```typescript
// Create coupons in Supabase:
// EARLY50 — 50% off (percent, value: 50)
// LAUNCH100 — ₹100 off (flat, value: 100)  
// BUILDER — ₹200 off (flat, value: 200)

async function applyCoupon(code: string, amount: number): Promise<number> {
  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .gt("used_count", -1)  // any valid record
    .gt("valid_until", new Date().toISOString())
    .single()

  if (!coupon) throw new Error("Invalid or expired coupon")
  if (coupon.used_count >= coupon.max_uses) throw new Error("Coupon limit reached")

  if (coupon.discount_type === "percent") {
    return Math.round(amount * (1 - coupon.discount_value / 100))
  } else {
    return Math.max(amount - coupon.discount_value * 100, 100)  // min ₹1
  }
}
```

---

## 8. Refund Flow

```typescript
// app/api/refund/route.ts — admin triggered
import Razorpay from "razorpay"

const razorpay = new Razorpay({ key_id: ..., key_secret: ... })

async function issueRefund(registration_id: string) {
  const { data: reg } = await supabase
    .from("registrations")
    .select("*")
    .eq("id", registration_id)
    .single()

  if (!reg || reg.status !== "confirmed") {
    throw new Error("Cannot refund — registration not confirmed")
  }

  // Create refund on Razorpay
  const refund = await razorpay.payments.refund(reg.razorpay_payment_id, {
    amount: reg.amount_paid * 100,  // full refund
    speed: "normal",  // 5-7 days OR use "optimum" for instant (higher fee)
    notes: { reason: "Requested by participant" }
  })

  // Update DB
  await supabase
    .from("registrations")
    .update({ status: "refunded" })
    .eq("id", registration_id)

  return refund
}
```

---

## 9. Test Cards (Test Mode Only)

```
Visa success:     4111 1111 1111 1111   Any future date   Any CVV
Mastercard fail:  5267 3181 8797 5449   Any future date   Any CVV
UPI success:      success@razorpay
UPI fail:         failure@razorpay
```

---

## 10. Go-Live Checklist

- [ ] KYC completed on Razorpay
- [ ] Live API keys set in Vercel environment variables
- [ ] Webhook URL updated to production URL (not ngrok)
- [ ] Signature verification working in production
- [ ] Test a real ₹1 transaction end-to-end
- [ ] Refund flow tested
- [ ] Failed payment email firing correctly
- [ ] Supabase RLS policy allows webhook to update registrations
