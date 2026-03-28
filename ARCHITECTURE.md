# Circle13 — System Architecture
**Version:** 2.0 - Added WhatsApp Automation + Stitch MCP UI Bridge

---

## 1. High-Level Architecture (with WhatsApp & Stitch)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        USERS (Multiple Channels)                         │
│     Web: circle13.in    |    WhatsApp: +91-xxxx-xxxxx    |   Email      │
└────────────────────────┬────────────────────────┬─────────────────────┘
                         │                        │
        ┌────────────────┴─────────────┐          │
        ▼                              ▼          ▼
┌──────────────────────────┐  ┌─────────────────────────────────────────┐
│  FRONTEND — React + Vite │  │  WHATSAPP BOT — Twilio Webhook          │
│  (or Next.js 14)         │  │  POST /api/whatsapp-webhook             │
│  Hosted on Vercel        │  │                                         │
│                          │  │  ┌───────────────────────────────────┐  │
│  ┌────────────────────┐  │  │  │  Agent 4: WhatsApp Bot (Claude) │  │
│  │  Landing Page      │  │  │  │  - Answer questions             │  │
│  │  ┌──────────────┐  │  │  │  │  - Collect user data            │  │
│  │  │  Stitch UI   │  │  │  │  │  - Send reminders               │  │
│  │  │  Components  │  │  │  │  │  - Qualify leads                │  │
│  │  │ (animated)   │  │  │  │  └───────────────────────────────────┘  │
│  │  └──────────────┘  │  │  │                                         │
│  │  ┌────────────────┐ │  │  │  HuggingFace Inference (FREE)          │
│  │  │ Framer Motion  │ │  │  │  Mistral-7B or Llama2                  │
│  │  │ Animations     │ │  │  └─────────────────────────────────────────┘
│  │  └────────────────┘ │  │
│  │                     │  │
│  │  Chat Widget        │  │
│  │  (Agent 1 Claude API)  │
│  └────────────────────┘  │
└────────┬─────────────────┘
         │ API calls
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend + DB)                          │
│  PostgreSQL 500MB FREE tier (or upgrade to Pro)                     │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Data Models:                                                │  │
│  │  ├── registrations (workshop_id, user_id, status, tier)      │  │
│  │  ├── users (name, email, phone, track_interest)              │  │
│  │  ├── whatsapp_messages (phone, user_msg, bot_response)       │  │
│  │  ├── payments (order_id, amount, status)                     │  │
│  │  ├── workshops (date, track, capacity)                       │  │
│  │  └── analytics (event_type, user_id, timestamp)              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Edge Functions (Serverless APIs):                           │  │
│  │  ├── POST /register       (create registration)              │  │
│  │  ├── POST /verify-payment (after Razorpay)                   │  │
│  │  ├── POST /webhook        (payment confirmed)                │  │
│  │  └── GET /user-history    (fetch past interactions)          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Supabase Auth (optional admin dashboard)                          │
└────────────────┬──────────────┬──────────────────────────────────┘
         │                      │
         │ Webhook triggers     │ API queries
         ▼                      ▼
    ┌─────────────────┐   ┌──────────────────────┐
    │  n8n AUTOMATION │   │ ANTHROPIC (Claude)   │
    │  (Railway.app)  │   │ API                  │
    │                 │   │                      │
    │ Workflows:      │   │ Agent 1: Landing     │
    │ ├─ Welcome msg  │   │ page chat            │
    │ ├─ Reminders    │   │                      │
    │ ├─ Follow-ups   │   │ Agent 2: Email       │
    │ └─ Upsells      │   │ personalization      │
    │                 │   │                      │
    │ Calls Agents 2,3│   │ Agent 3: Follow-up   │
    └────────┬────────┘   │ writer               │
             │            │                      │
             ▼            └──────────────────────┘
    ┌─────────────────┐
    │  RESEND (Email) │
    │                 │
    │  - Welcome      │
    │  - Reminders    │
    │  - Promotions   │
    └─────────────────┘

    [Optional: Razorpay for paid registration]
    ┌─────────────────────┐
    │    RAZORPAY         │
    │  Payment Gateway    │
    │  (2% + GST/txn)     │
    └─────────────────────┘
```

### New: Stitch MCP UI Bridge

```
┌────────────────────────────────────────────────┐
│  STITCH MCP BRIDGE (New Layer)                 │
│                                                │
│  Converts AI responses → Animated UI:          │
│                                                │
│  Agent Response (text)                         │
│         │                                      │
│         ▼                                      │
│  StitchBridge.formatResponse()                 │
│         │                                      │
│         ▼                                      │
│  Stitch Component (with animation)             │
│  ├── ResponseCard (slide-in)                   │
│  ├── AnimatedButton (hover effects)            │
│  ├── LoadingState (pulsing)                    │
│  └── FeatureCard (stagger animation)           │
│         │                                      │
│         ▼                                      │
│  Framer Motion applies transitions             │
│         │                                      │
│         ▼                                      │
│  User sees smooth animation                    │
└────────────────────────────────────────────────┘
```

---

## 2. Data Flow — Registration

```
1. User fills form on /register
   └─> Frontend validates (name, email, phone, track, tier)
   
2. Frontend calls Supabase Edge Function: POST /register
   └─> Creates pending registration in DB
   └─> Returns Razorpay order_id
   
3. Razorpay checkout opens (in-page)
   └─> User pays via UPI/Card/Wallet
   
4. Payment success → Razorpay fires webhook to Supabase
   POST /webhook/razorpay
   └─> Verifies signature (HMAC SHA256)
   └─> Updates registration status: pending → confirmed
   └─> Triggers n8n webhook
   
5. n8n Workflow 1 fires:
   └─> Fetches registration details from Supabase
   └─> Calls Claude API to personalize welcome message
   └─> Sends email via Resend
   └─> (Optional) Sends WhatsApp via Twilio/WATI
   
6. Scheduled n8n workflows fire at T-24h, T-1h, T+1h, T+3d
```

---

## 3. Data Flow — AI Chat Agent

```
1. User opens chat widget on landing page
   └─> Auto-popup after 5 seconds with greeting
   
2. User types a question
   └─> Frontend sends to: POST /api/chat (Next.js API route)
   
3. API route calls Claude API with:
   └─> System prompt: Circle13 knowledge base
   └─> Conversation history
   └─> User message
   
4. Claude responds → streamed back to frontend
   └─> Displayed in chat widget
   
5. If user asks "how to register" or "what's the price"
   └─> Agent surfaces CTA button inline
```

---

## 4. Database Schema (Supabase / PostgreSQL)

```sql
-- Workshops table
CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  track TEXT NOT NULL,  -- A, B, C, D, E
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

-- Registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES workshops(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  tier TEXT NOT NULL,   -- early_bird | standard | bundle
  amount_paid INT NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'pending',  -- pending | confirmed | refunded | failed
  coupon_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- Email logs
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id),
  email_type TEXT NOT NULL,  -- welcome | reminder_24h | reminder_1h | post_workshop | upsell
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent',  -- sent | failed | bounced
  resend_id TEXT
);

-- Coupon codes
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL,  -- percent | flat
  discount_value INT NOT NULL,
  max_uses INT DEFAULT 50,
  used_count INT DEFAULT 0,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # backend only, never expose

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx  # backend only
RAZORPAY_WEBHOOK_SECRET=xxx  # for signature verification

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# Resend (email)
RESEND_API_KEY=re_xxx
EMAIL_FROM=hello@circle13.in

# n8n
N8N_WEBHOOK_BASE_URL=https://your-n8n.railway.app
N8N_WEBHOOK_SECRET=xxx  # shared secret for auth

# App
NEXT_PUBLIC_APP_URL=https://circle13.in
```

---

## 6. Folder Structure (Next.js App)

```
circle13/
├── app/
│   ├── page.tsx              # Landing page
│   ├── register/
│   │   └── page.tsx          # Registration + payment
│   ├── confirm/
│   │   └── page.tsx          # Post-payment confirmation
│   └── api/
│       ├── chat/
│       │   └── route.ts      # AI agent endpoint
│       ├── register/
│       │   └── route.ts      # Create Razorpay order
│       └── webhook/
│           └── razorpay/
│               └── route.ts  # Razorpay webhook handler
├── components/
│   ├── ChatWidget.tsx         # AI agent floating widget
│   ├── CountdownTimer.tsx     # Hero countdown
│   ├── RegistrationForm.tsx   # Multi-step form
│   └── PricingCard.tsx
├── lib/
│   ├── supabase.ts
│   ├── razorpay.ts
│   ├── claude.ts             # Anthropic client
│   └── resend.ts
├── emails/                   # React Email templates
│   ├── Welcome.tsx
│   ├── Reminder24h.tsx
│   └── PostWorkshop.tsx
└── n8n-workflows/            # Exported n8n JSON files
    ├── workflow-welcome.json
    ├── workflow-reminder.json
    └── workflow-upsell.json
```

---

## 7. Security Checklist

- [ ] Razorpay webhook signature verification (HMAC SHA256)
- [ ] Supabase Row Level Security (RLS) enabled on all tables
- [ ] Service role key never exposed to frontend
- [ ] Rate limiting on /api/chat (prevent API abuse)
- [ ] Input validation + sanitization on all forms
- [ ] HTTPS enforced everywhere
- [ ] n8n webhook has shared secret header check
