# Circle13 — Implementation Plan
**Version:** 1.0  
**Stack:** Next.js 14 + Supabase + Razorpay + n8n + Claude API + Stitch MCP  
**UI:** Already built (Stitch components ready)

---

## Overview — 4 Phases

```
Phase 1 (Week 1–2)    →   Foundation: DB + Auth + Payment wired to UI
Phase 2 (Week 2–3)    →   Automation: n8n workflows + Email + WhatsApp
Phase 3 (Week 3–4)    →   AI Agents: Chat widget + Personalization + Follow-up
Phase 4 (Week 4–5)    →   Launch: 1:1 Live Session feature + Go-live checklist
```

---

## Phase 1 — Foundation (Days 1–10)

### Goal: UI connected to real data. Registration works. Payment confirmed.

---

### Step 1.1 — Supabase Setup (Day 1)

**What to do:**
1. Create project at supabase.com
2. Go to SQL Editor → run this schema:

```sql
-- Run in Supabase SQL Editor

CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  track TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  zoom_link TEXT,
  replay_link TEXT,
  early_bird_ends_at TIMESTAMPTZ,
  price_early INT DEFAULT 399,
  price_standard INT DEFAULT 799,
  price_bundle INT DEFAULT 1499,
  max_seats INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES workshops(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  tier TEXT NOT NULL,
  amount_paid INT NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'pending',
  coupon_code TEXT,
  community_invite_sent BOOLEAN DEFAULT FALSE,
  upsell_sent BOOLEAN DEFAULT FALSE,
  session_type TEXT DEFAULT 'group',  -- group | 1on1
  session_booked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id),
  email_type TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent',
  resend_id TEXT
);

CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value INT NOT NULL,
  max_uses INT DEFAULT 50,
  used_count INT DEFAULT 0,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE one_on_one_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  goal TEXT,                          -- what they want from the session
  track_interest TEXT,                -- which track or topic
  preferred_slot TIMESTAMPTZ,
  confirmed_slot TIMESTAMPTZ,
  meet_link TEXT,
  status TEXT DEFAULT 'requested',    -- requested | confirmed | completed | cancelled
  notes TEXT,                         -- founder notes after session
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE one_on_one_sessions ENABLE ROW LEVEL SECURITY;

-- Public can read workshops
CREATE POLICY "Public read workshops" ON workshops FOR SELECT USING (true);

-- Service role can do everything (for backend/n8n)
CREATE POLICY "Service role all" ON registrations 
  USING (auth.role() = 'service_role');
CREATE POLICY "Service role all" ON email_logs 
  USING (auth.role() = 'service_role');
CREATE POLICY "Service role all" ON one_on_one_sessions 
  USING (auth.role() = 'service_role');

-- Helper function for coupon increment
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_code TEXT)
RETURNS void AS $$
  UPDATE coupons SET used_count = used_count + 1 WHERE code = coupon_code;
$$ LANGUAGE SQL;
```

3. Go to Settings → API → copy `URL` and `anon key` and `service_role key`
4. Insert a test workshop:

```sql
INSERT INTO workshops (title, track, scheduled_at, price_early, price_standard, price_bundle, max_seats)
VALUES (
  'AI Build Lab #1 — Prompt Engineering Sprint',
  'B',
  NOW() + INTERVAL '7 days',
  399, 799, 1499, 100
);
```

---

### Step 1.2 — Next.js Project Setup (Day 1–2)

**In your terminal:**

```bash
# If you don't have a Next.js project yet
npx create-next-app@latest circle13 --typescript --tailwind --app

cd circle13

# Install all dependencies at once
npm install @supabase/supabase-js razorpay groq-sdk resend \
  react-hook-form zod @hookform/resolvers \
  framer-motion \
  @radix-ui/react-dialog @radix-ui/react-select \
  date-fns
```

**Create `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

GROQ_API_KEY=gsk_xxx

RESEND_API_KEY=re_xxx
EMAIL_FROM=hello@circle13.in

N8N_WEBHOOK_BASE_URL=https://your-n8n.railway.app
N8N_WEBHOOK_SECRET=your-secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### Step 1.3 — Stitch MCP Setup (Day 2)

**Install Stitch:**
```bash
npm install --save-dev @stitch/mcp @stitch/core
```

**Create `.mcp.json` in project root:**
```json
{
  "mcpServers": {
    "stitch": {
      "command": "node",
      "args": ["node_modules/@stitch/mcp/server.js"],
      "env": {
        "STITCH_MODE": "components"
      }
    }
  }
}
```

**Create `lib/stitch-bridge.ts`** — this is the bridge between Claude responses and your Stitch UI:

```typescript
// lib/stitch-bridge.ts

export type StitchAction =
  | { type: "SHOW_REGISTER_CTA"; message: string }
  | { type: "SHOW_PRICING" }
  | { type: "SHOW_WORKSHOPS" }
  | { type: "SHOW_TRACKS" }

export function parseAgentAction(text: string): StitchAction | null {
  if (text.includes("action: SHOW_REGISTER_CTA")) {
    return { type: "SHOW_REGISTER_CTA", message: text }
  }
  if (text.includes("action: SHOW_PRICING")) {
    return { type: "SHOW_PRICING" }
  }
  return null
}

// Map agent action to Stitch component props
export function getStitchComponent(action: StitchAction) {
  switch (action.type) {
    case "SHOW_REGISTER_CTA":
      return {
        component: "AnimatedButton",
        props: {
          label: "Register Now →",
          href: "/register",
          variant: "primary",
          animate: "slide-in"
        }
      }
    case "SHOW_PRICING":
      return {
        component: "FeatureCard",
        props: {
          cards: [
            { title: "Early Bird", price: "₹399", highlight: false },
            { title: "Standard", price: "₹799", highlight: true },
            { title: "Bundle", price: "₹1499", highlight: false }
          ],
          animate: "stagger"
        }
      }
    default:
      return null
  }
}
```

---

### Step 1.4 — Connect Supabase to Stitch UI Components (Day 2–3)

**Create `lib/supabase.ts`:**
```typescript
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

**Connect your existing Stitch countdown component to live data:**
```typescript
// In your existing CountdownTimer Stitch component
// Replace hardcoded date with this:

import { supabase } from "@/lib/supabase"

export async function getNextWorkshop() {
  const { data } = await supabase
    .from("workshops")
    .select("*")
    .gt("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .single()
  return data
}
// Pass data.scheduled_at to your countdown timer
```

---

### Step 1.5 — Registration API + Razorpay (Day 3–5)

**Create `app/api/register/route.ts`** — see full code in `PAYMENT_GATEWAY.md` Step 3.

**Create `app/api/webhook/razorpay/route.ts`** — see full code in `PAYMENT_GATEWAY.md` Step 5.

**Wire your existing Stitch registration form to the API:**
```typescript
// In your existing RegistrationForm Stitch component
// Find your submit handler and replace with:

async function onSubmit(data: FormData) {
  setLoading(true)
  
  // 1. Create Razorpay order
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  const { order_id, amount } = await res.json()

  // 2. Open Razorpay (load script first if needed)
  // See full code in PAYMENT_GATEWAY.md Step 4
  openRazorpayCheckout({ order_id, amount, ...data })
}
```

**Test payment end-to-end:**
```bash
# 1. Start local server
npm run dev

# 2. Expose for Razorpay webhook
npx ngrok http 3000

# 3. In Razorpay dashboard → test webhook URL = https://xxx.ngrok.io/api/webhook/razorpay

# 4. Fill registration form → pay with test card:
# 4111 1111 1111 1111, any future date, any CVV

# 5. Check Supabase → registrations table → status should change to "confirmed"
```

**Phase 1 done when:** User fills form → pays → row in Supabase shows `status: confirmed`

---

## Phase 2 — Automation (Days 8–18)

### Goal: Zero manual emails. Every trigger fires automatically.

---

### Step 2.1 — Deploy n8n on Railway (Day 8)

```
1. railway.app → New Project → Add Template → search "n8n"
2. Add PostgreSQL database to the same project
3. Set env vars (see WORKFLOW.md Step 1)
4. Deploy → get URL like: https://n8n-production-xxx.up.railway.app
5. Set custom domain: n8n.circle13.in (in Railway settings)
6. Save this URL as N8N_WEBHOOK_BASE_URL in your .env
```

---

### Step 2.2 — Set Up Resend (Day 8)

```
1. resend.com → Create account
2. Add domain: circle13.in
3. Add DNS records they give you (3 TXT records for SPF/DKIM)
4. Create API key → save as RESEND_API_KEY
5. Test send:
```

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_xxx" \
  -H "Content-Type: application/json" \
  -d '{"from":"hello@circle13.in","to":"yourpersonal@gmail.com","subject":"Test","html":"<p>Works!</p>"}'
```

---

### Step 2.3 — Build n8n Workflows (Days 9–14)

Build in this order. Test each one before moving to next.

**Workflow 1 — Registration Confirmed** (build first, most important)
- Trigger: Webhook (POST from your Next.js webhook handler)
- See node-by-node instructions in `WORKFLOW.md` Step 3
- Test: Manually POST to the n8n webhook URL with a fake registration_id

**Workflow 2 — 24h Reminder**
- See `WORKFLOW.md` Step 4
- Test: Insert a workshop with scheduled_at = NOW() + 24 hours → trigger cron manually in n8n

**Workflow 3 — 1h Reminder**
- See `WORKFLOW.md` Step 5

**Workflow 4 — Post-Workshop Upsell**
- See `WORKFLOW.md` Step 6

**Workflow 5 — Payment Failed**
- See `WORKFLOW.md` Step 7

**Workflow 6 — Community Invite (T+3 days)**
- See `WORKFLOW.md` Step 8

---

### Step 2.4 — WhatsApp (Days 15–16, Optional)

For India, use WATI — easiest setup.

```
1. wati.io → Create account → connect WhatsApp Business number
2. Get API endpoint + token
3. In n8n: add HTTP Request node after each email node
   POST https://live-server.wati.io/api/v1/sendTemplateMessage
   Headers: Authorization: Bearer {token}
   Body: { phone: "91XXXXXXXXXX", template_name: "buildlab_reminder" }
4. Create message templates in WATI dashboard (needs WhatsApp approval, 24–48h)
```

**Phase 2 done when:** Register → welcome email arrives in 60 seconds. Manual cron test fires reminder.

---

## Phase 3 — AI Agents (Days 15–22)

### Goal: Chat widget live on page. Emails are personalized. Post-workshop upsell is AI-written.

---

### Step 3.1 — Landing Page Chat Agent (Days 15–17)

**Create `app/api/chat/route.ts`:**

```typescript
import Groq from "groq-sdk"

const client = new Groq()

const SYSTEM_PROMPT = `You are C13, the AI assistant for Circle13 Build Lab.
// ... paste full system prompt from AI_AGENTS.md Agent 1
`

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    max_tokens: 512,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ],
    stream: true
  })

  // Basic streaming setup for simple fetch reading
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          controller.enqueue(encoder.encode(content));
        }
      }
      controller.close();
    }
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream" }
  })
}
```

**Wire to your existing Stitch ChatWidget:**
```typescript
// In your existing ChatWidget Stitch component
// Find the message send handler and replace with:

import { parseAgentAction, getStitchComponent } from "@/lib/stitch-bridge"

async function sendMessage(text: string) {
  const newMessages = [...messages, { role: "user", content: text }]
  setMessages(newMessages)
  setLoading(true)

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: newMessages })
  })

  // Stream the response
  const reader = res.body?.getReader()
  let fullText = ""
  
  while (true) {
    const { done, value } = await reader!.read()
    if (done) break
    fullText += new TextDecoder().decode(value)
    setStreamingText(fullText)  // update UI as it streams
  }

  // Check if agent wants to show a Stitch component
  const action = parseAgentAction(fullText)
  if (action) {
    const stitchComponent = getStitchComponent(action)
    setInlineComponent(stitchComponent)  // render Stitch CTA inline in chat
  }

  setMessages([...newMessages, { role: "assistant", content: fullText }])
  setLoading(false)
}
```

**Auto-popup after 5 seconds:**
```typescript
// Already in your Stitch ChatWidget — just ensure this runs:
useEffect(() => {
  const timer = setTimeout(() => {
    setShowBubble(true)
    addBotMessage("Hey 👋 Building something with AI? Ask me what we build here.")
  }, 5000)
  return () => clearTimeout(timer)
}, [])
```

---

### Step 3.2 — Plug Agent 2 into n8n Workflow 1 (Day 18)

Already covered in `WORKFLOW.md` Step 3 — the HTTP Request node calls Claude Haiku.

**Test it:**
```bash
# Call n8n webhook manually
curl -X POST https://n8n.circle13.in/webhook/registration-confirmed \
  -H "X-Webhook-Secret: your-secret" \
  -H "Content-Type: application/json" \
  -d '{"registration_id": "uuid-from-supabase"}'

# Check your email — should arrive personalized within 60 seconds
```

---

### Step 3.3 — Plug Agent 3 into n8n Workflow 4 (Day 19)

Already covered in `WORKFLOW.md` Step 6.

**Test it:**
```sql
-- Set a workshop to have ended 1hr ago for testing
UPDATE workshops SET scheduled_at = NOW() - INTERVAL '3 hours' WHERE id = 'your-workshop-id';
-- Then manually trigger Workflow 4 in n8n
```

**Phase 3 done when:** Chat widget answers questions. Emails feel personal. Post-workshop upsell arrives automatically.

---

## Phase 4 — 1:1 Live Session Feature + Launch (Days 20–28)

### Goal: 1:1 sessions bookable. Everything live. First workshop runs.

---

### Step 4.1 — 1:1 Live Session Feature (Days 20–23)

This is the premium upsell tier — participants can book a live 1:1 session with a Circle13 founder.

**Two entry points:**
1. **Bundle tier** — included in ₹1499 Builder Bundle (1 session)
2. **Standalone** — bookable post-workshop at ₹999

#### Database already has `one_on_one_sessions` table (created in Step 1.1).

#### Create booking page: `app/1on1/page.tsx`

```typescript
// app/1on1/page.tsx
// Simple form that collects:
// - Name, email, phone
// - Goal (what do you want to work on?)
// - Track interest (which topic?)
// - Preferred time slots (3 options they choose from)

// On submit → POST /api/book-session
```

#### Create `app/api/book-session/route.ts`:

```typescript
export async function POST(req: Request) {
  const { name, email, phone, goal, track_interest, preferred_slot, registration_id } = await req.json()

  // Save to one_on_one_sessions table
  const { data } = await supabaseAdmin
    .from("one_on_one_sessions")
    .insert({ name, email, phone, goal, track_interest, preferred_slot, registration_id, status: "requested" })
    .select()
    .single()

  // Trigger n8n → notify founder (email/WhatsApp) of new booking request
  await fetch(process.env.N8N_WEBHOOK_BASE_URL + "/webhook/session-requested", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET! },
    body: JSON.stringify({ session_id: data.id, name, email, goal, track_interest, preferred_slot })
  })

  // Send confirmation to user
  await resend.emails.send({
    from: "Circle13 <hello@circle13.in>",
    to: email,
    subject: "Your 1:1 session request received",
    html: `<p>Hey ${name}, we got your session request. We'll confirm your slot within 24 hours at ${email}.</p>`
  })

  return Response.json({ success: true })
}
```

#### n8n Workflow 7 — Session Requested:

```
[Webhook: /webhook/session-requested]
    ↓
[Send Email to Founder]
    To: akhil@circle13.in + bharath@circle13.in
    Subject: "New 1:1 Session Request — {name}"
    Body: name, email, goal, track, preferred_slot
    ↓
[Optional: WhatsApp to founder's number]
    "New session request from {name}: {goal}"
```

#### Confirm a Session (Founder Action):

```typescript
// app/api/confirm-session/route.ts
// Called by founder from admin or directly

export async function POST(req: Request) {
  const { session_id, confirmed_slot, meet_link } = await req.json()

  // Update session in DB
  await supabaseAdmin
    .from("one_on_one_sessions")
    .update({ confirmed_slot, meet_link, status: "confirmed" })
    .eq("id", session_id)

  // Get session details for email
  const { data: session } = await supabaseAdmin
    .from("one_on_one_sessions")
    .select("*")
    .eq("id", session_id)
    .single()

  // Send confirmation email to user
  await resend.emails.send({
    from: "Circle13 <hello@circle13.in>",
    to: session.email,
    subject: "Your 1:1 session is confirmed ✓",
    html: `
      <p>Hey ${session.name},</p>
      <p>Your session is confirmed for ${new Date(confirmed_slot).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST.</p>
      <p>Join here: <a href="${meet_link}">${meet_link}</a></p>
      <p>Come prepared with: your goal ("${session.goal}"), any builds you've tried, specific questions.</p>
      <p>See you then.</p>
      <p>— Circle13 Team</p>
    `
  })

  return Response.json({ success: true })
}
```

#### Stitch UI for 1:1 Booking Page:

Use your existing Stitch `ResponseCard` component for the booking form. Wire the submit to `/api/book-session`. Show success state with `AnimatedButton` → "Request Received. We'll confirm within 24h."

---

### Step 4.2 — Add 1:1 to Pricing + Post-Workshop Email (Day 23)

**In your Stitch PricingCard for Builder Bundle tier:**
```
₹1499 — Everything included:
→ Full Prompt Vault
→ Community access
→ 1:1 Audit Session (30 min with founder)   ← add this
```

**In n8n Workflow 4 (Post-Workshop), add branch:**
```
[IF: tier === 'bundle']
  → Send email with 1:1 booking link included
[ELSE]
  → Send upsell: "Add a 1:1 session for ₹999 — limited slots"
  → Link to /1on1?ref=post-workshop
```

---

### Step 4.3 — Go-Live Checklist (Day 24–26)

**Tech:**
- [ ] Supabase: RLS policies verified, service role key in Vercel env only
- [ ] Razorpay: switched to LIVE keys in Vercel production env
- [ ] Webhook URL in Razorpay dashboard → production URL (not ngrok)
- [ ] All 7 n8n workflows active (not paused)
- [ ] Resend domain verified, SPF/DKIM passing
- [ ] Chat agent tested — 10 question types answered correctly
- [ ] Rate limit on `/api/chat` — 20 requests/minute per IP

**Content:**
- [ ] First workshop inserted in DB with real zoom link
- [ ] Early bird coupon code created: `EARLYBIRD` — 50% off, 48h validity, 30 uses
- [ ] All email templates tested on mobile (Gmail + Apple Mail)
- [ ] 1:1 booking page live at circle13.in/1on1

**Business:**
- [ ] Razorpay KYC approved
- [ ] Test ₹1 real transaction end-to-end
- [ ] Refund policy page added to site

---

### Step 4.4 — 7-Day Launch Sprint (Day 26–33)

```
Day 1 → Post event page URL on LinkedIn + Instagram
Day 2 → Share a 60-second demo video (screen record a mini build)
Day 3 → Post a poll: "What would you automate first with AI?"
Day 4 → DM 20 people personally (students, founders in your network)
Day 5 → Drop 5 free prompts publicly ("here's what you'd get in Track B")
Day 6 → "Only 12 early bird spots left" urgency post
Day 7 → Workshop day
```

---

## Summary Timeline

```
Day 1       Supabase schema live, env vars set
Day 2       Stitch MCP configured, Supabase client connected to UI
Day 3–5     Registration form → Razorpay → webhook confirmed
Day 6–7     Buffer / fix bugs from payment testing
Day 8       n8n deployed on Railway, Resend domain verified
Day 9–14    All 6 n8n workflows built and tested
Day 15–17   Chat agent API + wired to Stitch ChatWidget
Day 18–19   Agent 2 + 3 plugged into n8n workflows
Day 20–23   1:1 session feature: booking form, confirm flow, emails
Day 24–26   Go-live checklist, switch to live keys, final tests
Day 27–33   7-day launch sprint → Workshop Day 1
```

**Total time to launch: ~4 weeks**  
**Working hours needed: ~60–80 hours**  
**Infrastructure cost at launch: ~₹500/month**
