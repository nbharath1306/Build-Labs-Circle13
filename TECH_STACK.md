# Circle13 — Tech Stack
**Version:** 1.0

---

## Stack at a Glance — PREMIUM vs FREE TIER

### PREMIUM STACK (Production)
```
Layer             Tool              Why
────────────────────────────────────────────────────────────
Frontend          Next.js 14        Full-stack React, SSR, API routes
Styling           Tailwind CSS      Fast utility-first, easy to theme
Backend/DB        Supabase          Postgres + Auth + Edge Functions
Payments          Razorpay          Best India coverage, UPI + cards
Email             Resend            Developer-friendly, React templates
Automation        n8n               Visual workflow builder, self-hostable
AI Agents         Claude API        Anthropic — best reasoning for agents
UI Framework      Stitch MCP        Modern animated components
Animation         Framer Motion     Smooth transitions & interactions
AI Framework      Vercel AI SDK     Streaming, tool calls, easy React hooks
Hosting           Vercel            Zero-config Next.js, preview deploys
n8n Hosting       Railway.app       Easy Docker deploys, cheap for India
Monitoring        Sentry            Error tracking
Analytics         Posthog           Product analytics (free tier)
```

### CHEAP/FREE STACK (For WhatsApp Bots & MVP)
```
Layer             Tool              Why                          Cost/Month
─────────────────────────────────────────────────────────────────────────────
Frontend          React/Vite        Lightweight, fast builds      FREE
Styling           Tailwind CSS      Utility-first                 FREE
Backend/DB        Supabase Tier 0   PostgreSQL 500MB + Auth       FREE
AI Model          Hugging Face      Free inference API            FREE (limited)
Alternative AI    Mistral/Llama2    Open-source models           FREE (self-host)
WhatsApp          Twilio Sandbox    Testing & dev                 FREE
Alternative SMS   Vonage SMS API    Pay-as-you-go (₹0.50/SMS)    ₹0-500
Email             Resend Free       5k emails/month               FREE
Deployment        Vercel Edge Func  Serverless runs              FREE
Database Backup   Supabase Auto     Included with tier 0         FREE
UI Framework      Stitch MCP        Lightweight components        FREE (open-source)
Animation         Framer Motion     Motion library               FREE
Monitoring        LogTail           Error logs (free tier)        FREE
Task Queue        Vercel Cron       Native scheduling            FREE
─────────────────────────────────────────────────────────────────────────────
TOTAL MONTHLY COST:                                              $0-5
```

---

---

## 1. Frontend — Next.js 14 (Production) OR Vite + React (FREE)

### Production: Next.js 14
**Why Next.js:**
- App Router handles both pages and API routes in one project
- Server Components = faster page loads (important for conversion)
- Built-in API routes handle Razorpay webhooks without separate backend
- Vercel deploys are instant and free for this scale

### FREE Alternative: Vite + React
```bash
npm create vite@latest my-app -- --template react
npm install tailwindcss framer-motion axios
npm run dev
```

**Pros:**
- Faster build times (< 100ms HMR)
- Simple file-based routing
- Direct API calls to serverless functions
- Deploy to Vercel for free (same as Next.js)

**Cons:**
- No built-in SSR (slightly slower initial load)
- Manual API route setup
- Good enough for WhatsApp bots & internal tools

**Key libraries:**
```json
{
  "react": "18.x",
  "tailwindcss": "3.x",
  "framer-motion": "11.x",     // Smooth animations
  "@stitch/core": "latest",    // Stitch MCP components
  "axios": "1.x",              // HTTP requests to AI
  "react-hook-form": "7.x",    // Forms
  "zod": "3.x"                 // Validation
}
```

---

## 8. Database — Supabase (FREE Tier is Great)

**What Supabase gives you for free:**
- PostgreSQL database (500MB free - perfect for MVP)
- Auto-generated REST and GraphQL APIs
- Row Level Security (fine-grained auth)
- Edge Functions (serverless, runs close to users)
- Auth (email/magic link/OAuth)
- Realtime subscriptions

**For WhatsApp bots:**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  user_message TEXT,
  ai_response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE,
  username TEXT,
  first_interaction TIMESTAMP,
  last_interaction TIMESTAMP
);
```

**Query from Node:**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Save message
await supabase.from('messages').insert({
  user_id: fromNumber,
  user_message: userInput,
  ai_response: aiOutput
});

// Get user history
const { data } = await supabase
  .from('messages')
  .select('*')
  .eq('user_id', fromNumber)
  .order('created_at', { ascending: false })
  .limit(10);
```

**Cost:** $0-$50/month (free tier covers most use cases)

---

## 9. Deployment — Vercel (FREE)

Deploy Vite + React app + API endpoints on Vercel for free:
```bash
vercel deploy --prod
```

**Cost:** FREE (includes 100GB bandwidth, unlimited functions)

---

## 10. Animation Library — Framer Motion (FREE)

Perfect for animated landing pages with Stitch components:
```jsx
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

export default function AnimatedPage() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
    >
      <motion.h1 variants={itemVariants}>
        Welcome to AI Automation
      </motion.h1>
    </motion.div>
  );
}
```

**Cost:** FREE (MIT license)

---

## Complete FREE Stack Summary

```
Component           Tool              Monthly Cost   Notes
─────────────────────────────────────────────────────────────
Frontend Hosting    Vercel            $0             Unlimited deploys
Database            Supabase Tier 0   $0             500MB PostgreSQL
AI Model            HF Inference      $0             Rate-limited free tier
WhatsApp API        Twilio Sandbox    $0             Free credits
Email               Console log       $0             Dev only
UI Components       Stitch MCP        $0             Open-source
Animations          Framer Motion     $0             Open-source
Task Scheduler      Cron-job.org      $0             Simple webhooks
─────────────────────────────────────────────────────────────
TOTAL:                                $0             Production-ready
```

---

## When to Upgrade (and why)

- **Supabase**: Upgrade when >500MB data or >100k requests/month (~$50/mo)
- **Twilio**: When sending >1000 WhatsApp messages/day (~₹500-1000/mo)
- **Vercel**: When traffic exceeds 100GB bandwidth/month (rare at early stage)

**TL;DR:** Build entire MVP for FREE, pay only as you scale.

---

## 3. Payments — Razorpay (Or Skip for MVP)

**Why Razorpay (not Stripe):**
- Stripe India has UPI disabled by default
- Razorpay has instant UPI, PhonePe, Paytm, all Indian wallets
- Indian KYC and settlements in INR natively
- Razorpay Standard Checkout — 1 line of JS to add payment modal
- Webhooks are reliable and well-documented

**Fees:**
- 2% + GST per transaction
- No monthly fees
- Payout to bank in 2 working days

**Integration flow:**
1. Create order server-side (`/api/register`)
2. Open Razorpay checkout client-side
3. On success → Razorpay fires webhook to your server
4. Server verifies signature, marks registration confirmed

**Key APIs you'll use:**
- `POST /v1/orders` — create order
- Webhook `payment.captured` — confirm payment
- `POST /v1/refunds` — handle refunds

### FREE Alternative: Skip Payments (For Internal Tools/Automation)
If building WhatsApp bots for internal use or MVP testing, skip Razorpay entirely:
- No payment processing overhead
- Deploy faster
- Add payments later when needed

---

## 4. AI Models — Claude API (Production) OR Free Models

### Production: Claude API via Anthropic
- Best reasoning for agents
- ~$0.01-0.05 per request (depends on model)
- Streaming support

### FREE Alternatives:

#### Option A: Hugging Face Inference API (FREE)
```javascript
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

async function generateResponse(prompt) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
    {
      headers: { Authorization: `Bearer ${HF_API_KEY}` },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  );
  const result = await response.json();
  return result[0].generated_text;
}
```

**Cost:** FREE, but rate-limited (inference calls throttled during peak)

#### Option B: Self-Hosted Llama2/Mistral (VERY FREE)
Use Ollama or LocalAI for completely local inference:
```bash
ollama pull mistral
ollama serve
# API runs on localhost:11434
```

**Cost:** Only compute (your server cost)

#### Option C: Together AI or Groq (FREE + FAST)
```javascript
const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${FIREWORKS_API_KEY}` },
  body: JSON.stringify({
    model: 'accounts/fireworks/models/mixtral-8x7b-instruct',
    messages: [{ role: 'user', content: prompt }]
  })
});
```

**Cost:** FREE tier available, blazing fast

---

## 5. UI Components — Stitch MCP (NEW)

### What is Stitch MCP?
Modern animated component library designed for AI-powered interfaces. Works seamlessly with Antigravity for bridging AI responses to UI.

### Installation
```bash
npm install @stitch/core @stitch/components framer-motion
```

### Basic Usage
```jsx
import { ResponseCard, AnimatedButton } from '@stitch/components';

export default function ChatUI() {
  const [response, setResponse] = useState('');

  return (
    <ResponseCard
      content={response}
      animation="slide-in-from-left"
      duration={0.6}
    >
      <AnimatedButton 
        onClick={() => navigator.clipboard.writeText(response)}
        label="Copy"
        variant="outlined"
      />
    </ResponseCard>
  );
}
```

### Stitch + Antigravity Bridge
Connect AI responses directly to Stitch components:
```javascript
import StitchAntigravityBridge from '@/lib/stitch-antigravity-bridge';

const bridge = new StitchAntigravityBridge();

const handleUserMessage = async (message) => {
  const stitchComponent = await bridge.processInput(message);
  // stitchComponent is ready to render
  setUI(stitchComponent);
};
```

**Cost:** FREE (open-source)

---

## 6. WhatsApp Automation — Twilio Sandbox (FREE)

### Twilio WhatsApp Sandbox Setup
```javascript
// POST /api/whatsapp-webhook
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  const { From, Body } = req.body;

  // Send to AI
  const aiResponse = await generateResponse(Body);

  // Send back on WhatsApp
  await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: From,
    body: aiResponse
  });

  res.status(200).json({ ok: true });
}
```

**Cost:**
- Sandbox: FREE ($10 free credits)
- Production: ₹0.50-1 per message (very cheap for India)

### Alternative: Vonage (Nexmo) WhatsApp
```bash
npm install vonage
# Even cheaper than Twilio in India
```

---

## 7. Email — Resend (Production) OR Console Logging (FREE Dev)

### Production: Resend
- React email templates
- 5k emails/month FREE tier
- Rest at $15/month for unlimited

### FREE Dev: Just Log to Console
```javascript
function sendEmail(to, subject, body) {
  console.log(`📧 EMAIL TO: ${to}\n📌 Subject: ${subject}\n📝 Body: ${body}`);
}
```

For WhatsApp bots, you likely don't need email anyway.

---

## 8. Database — Supabase (FREE Tier Perfect)

## 4. Email — Resend

**Why Resend (not SendGrid/Mailgun):**
- Built for developers — clean API, React Email templates
- Free tier: 3,000 emails/month (enough for early stage)
- You write email templates in React JSX — same codebase
- Deliverability is excellent (proper SPF/DKIM setup)

**Email types you'll build:**
```
welcome.tsx          → Sent on payment confirmed
reminder-24h.tsx     → Sent 24 hours before workshop
reminder-1h.tsx      → Sent 1 hour before workshop
post-workshop.tsx    → Replay + Prompt Vault upsell
community-invite.tsx → T+3 days, builder community
payment-failed.tsx   → Retry payment link
```

**Custom domain:** Set up `hello@circle13.in` as sender. Resend handles SPF/DKIM DNS records for you.

---

## 5. Automation — n8n

**Why n8n (not Zapier/Make):**
- Open-source, self-hostable (no per-task fees at scale)
- Visual drag-and-drop workflow builder
- Can run JavaScript inside nodes (custom logic)
- Built-in Webhook node (receives Supabase/Razorpay triggers)
- Supports Anthropic/Claude nodes for AI steps
- Can be hosted free on Railway.app at small scale

**Workflows to build:**

```
Workflow 1: New Registration (Webhook trigger)
  → Fetch workshop details from Supabase
  → Claude: personalize welcome message
  → Resend: send welcome email
  → (Optional) WATI: WhatsApp message

Workflow 2: 24h Reminder (Scheduled — cron)
  → Query Supabase: workshops starting in 24h
  → For each registration: send reminder email
  → Claude: add personalized tip based on track

Workflow 3: 1h Reminder (Scheduled — cron)
  → Query Supabase: workshops starting in 1h
  → Send final reminder with join link

Workflow 4: Post-Workshop (Scheduled — T+60min after end)
  → Query completed workshops
  → Send replay link + upsell sequence
  → Claude: generate personalized follow-up based on track attended

Workflow 5: Payment Failed (Webhook trigger)
  → Razorpay fires payment.failed webhook
  → Send retry email with new payment link

Workflow 6: T+3 Days (Scheduled)
  → Community invite
  → Prompt Vault upsell offer
```

**Hosting n8n on Railway:**
1. Deploy via Railway template (1 click)
2. Set `N8N_BASIC_AUTH_ACTIVE=true` for security
3. Configure PostgreSQL as n8n's own DB on Railway
4. Cost: ~$5–10/month

---

## 6. AI Agents — Claude API

**Why Claude (not GPT-4):**
- Better instruction following = more reliable agents
- Long context window = can hold full workshop knowledge base
- Tool use (function calling) = agents can take actions
- You're already on Antigravity which uses Sonnet/Opus

**3 AI agents you'll build:**

### Agent 1: Landing Page Chat Agent
Purpose: Answer visitor questions, drive registrations  
Model: claude-sonnet-4-5 (fast + cheap for chat)  
System prompt includes: workshop details, pricing, tracks, FAQ  
Tool calls: `get_upcoming_workshops()`, `apply_coupon()`  
Trigger: Auto-popup on page, user types question  

### Agent 2: Personalization Agent (inside n8n)
Purpose: Generate personalized email copy per user  
Model: claude-haiku-4-5 (fastest, for bulk emails)  
Input: user name, track selected, tier, workshop title  
Output: personalized subject line + first paragraph  

### Agent 3: Follow-up Agent
Purpose: Write post-workshop follow-up + upsell message  
Model: claude-sonnet-4-5  
Input: track attended, build completed in workshop  
Output: specific, relevant upsell email for that person  

**Cost estimate:**
- 100 registrations/workshop
- ~50 chat conversations/day @ 500 tokens each = ~$1–2/day
- Email personalization = ~$0.50 per workshop run
- Total AI cost per workshop: < ₹300

---

## 7. Hosting

| Service | What Runs There | Cost |
|---------|----------------|------|
| Vercel | Next.js frontend + API routes | Free (Hobby) |
| Supabase | Database + Edge Functions | Free (up to 500MB) |
| Railway | n8n automation engine | ~$5/month |
| Resend | Transactional email | Free (3k emails/mo) |
| Razorpay | Payments | 2% per transaction |

**Total monthly infra cost at early stage: ~₹500/month**

---

## 8. Domain + DNS

- Register `circle13.in` on GoDaddy or Namecheap (~₹800/year)
- Point to Vercel via nameservers
- Set up `hello@circle13.in` on Resend for transactional email
- Set up `circle13.in` on Razorpay for payment page branding

---

## 9. Alternatives Comparison

| Need | Chosen | Alternative | Why not alternative |
|------|--------|-------------|---------------------|
| Frontend | Next.js | Astro, SvelteKit | Less React ecosystem support |
| DB | Supabase | Firebase, PlanetScale | Firebase NoSQL = harder queries |
| Email | Resend | Brevo (Sendinblue) | Resend has better DX |
| Automation | n8n | Make.com, Zapier | Zapier too expensive at scale |
| Payments | Razorpay | Cashfree, Stripe | Stripe weak on UPI |
| AI | Claude | GPT-4o, Gemini | Claude better for agents |
