# Circle13 — AI Agents Design
**Version:** 2.0 - Added WhatsApp Automation + Stitch MCP UI Integration

---

## Overview

Circle13 uses 3+ AI agents built on Claude API (or free Hugging Face models) that work together across different stages. Agents share the same Supabase database and can be triggered via webhooks, WhatsApp, or scheduled tasks.

```
ORCHESTRATION OVERVIEW (with WhatsApp automation)

User visits website OR sends WhatsApp message
      │                          │
      ▼                          ▼
[Agent 1: Chat]            [Agent 4: WhatsApp Bot]
Landing page widget    ◄────  Handles inquiries
      │                      Auto-responds
      ▼                          │
User pays                        │
      │          ┌──────────────┘
      ▼          ▼
[Agent 2: Personalization] ◄── Segments users
      │ writes email copy
      ▼
[Agent 3: Follow-up] ◄────── [Agent 5: Stitch UI Bridge]
      │ writes upsell copy  Animates all responses
      ▼
[Agent 6: Community Manager]
      │ nurtures relationships (optional)
      ▼
User becomes repeat customer / community member
```

---

## Agent 1 — Landing Page Chat Agent

### Purpose
Convert landing page visitors into registrations by answering questions, handling objections, and surfacing the right CTA at the right moment.

### Where it runs
Next.js API route: `POST /api/chat`  
Streamed response using Vercel AI SDK.

### Model
`claude-sonnet-4-20250514` — fast enough for chat, smart enough for nuance.

### System Prompt (copy this exactly)

```
You are C13, the AI assistant for Circle13 Build Lab.

Circle13 runs hands-on 2-hour AI Build Labs — not webinars, not seminars. 
Participants actually build real AI systems: prompt vaults, automation workflows, tool stacks.

Your job is to help visitors understand what Circle13 is, answer their questions, 
and guide them to register. Be direct, energetic, and technical. 
Never be salesy — be helpful.

WORKSHOP DETAILS:
- Duration: 2 hours, fully hands-on
- What they build: prompt systems, AI workflows, automation blueprints
- Deliverables: Prompt Vault starter, workflow templates, replay recording

TRACKS:
- Track A: AI Tools Build Lab — build your AI tool stack
- Track B: Prompt Engineering Sprint — create reusable prompt frameworks  
- Track C: AI Automation Lab — no-code + AI workflows
- Track D: Idea → MVP Sprint — turn ideas into AI-assisted MVPs
- Track E: Applied AI Systems — trends + live application

PRICING:
- Early Bird: ₹399 (first 24-48 hrs, 40% off)
- Standard: ₹799 (workshop + Prompt Vault + Templates)
- Builder Bundle: ₹1499 (everything + community + 1:1 audit slot)

RULES:
1. Never make up details. If you don't know, say "Let me get you the right info — email us at hello@circle13.in"
2. If someone asks "how do I register" — return action: SHOW_REGISTER_CTA
3. If someone asks about pricing — return action: SHOW_PRICING
4. Keep responses under 80 words unless a detailed answer is necessary
5. Never use the words "webinar", "seminar", or "training" — always "Build Lab" or "execution sprint"
6. Tone: sharp, builder-to-builder. No corporate fluff.
```

### Tool Calls (function calling)

```typescript
const tools = [
  {
    name: "get_upcoming_workshops",
    description: "Get list of upcoming workshops with dates and available seats",
    input_schema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "check_coupon",
    description: "Check if a coupon code is valid and return discount",
    input_schema: {
      type: "object",
      properties: {
        code: { type: "string", description: "The coupon code to check" }
      },
      required: ["code"]
    }
  },
  {
    name: "show_registration_cta",
    description: "Show the registration button to the user",
    input_schema: {
      type: "object",
      properties: {
        message: { type: "string", description: "Message to show with CTA" }
      },
      required: ["message"]
    }
  }
]
```

### API Route Code (Next.js)

```typescript
// app/api/chat/route.ts
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase"

const client = new Anthropic()

export async function POST(req: Request) {
  const { messages } = await req.json()

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system: SYSTEM_PROMPT,  // paste system prompt above
    messages,
    tools: tools
  })

  // Return as readable stream
  return new Response(stream.toReadableStream(), {
    headers: { "Content-Type": "text/event-stream" }
  })
}
```

### Frontend Widget Logic (React)

```typescript
// components/ChatWidget.tsx — key logic
useEffect(() => {
  // Auto-popup after 5 seconds
  const timer = setTimeout(() => {
    setShowBubble(true)
    // Show greeting message
    addMessage("bot", "Hey 👋 Building something with AI? I can tell you exactly what we build here in 2 hours — or answer any question.")
  }, 5000)
  return () => clearTimeout(timer)
}, [])

// Auto-dismiss bubble after 8 seconds
useEffect(() => {
  if (showBubble) {
    const t = setTimeout(() => setShowBubble(false), 8000)
    return () => clearTimeout(t)
  }
}, [showBubble])
```

---

## Agent 2 — Personalization Agent (Email Copy)

### Purpose
Generate personalized email subject lines and opening paragraphs for each registrant based on their track, tier, and name. Runs inside n8n via HTTP Request node.

### Where it runs
Called from n8n workflows via direct Anthropic API call in an n8n HTTP node.

### Model
`claude-haiku-4-5-20251001` — cheapest, fastest. Email personalization is simple enough.

### n8n HTTP Request Node Setup

```
Method: POST
URL: https://api.anthropic.com/v1/messages
Headers:
  x-api-key: {{ $env.ANTHROPIC_API_KEY }}
  anthropic-version: 2023-06-01
  Content-Type: application/json

Body (JSON):
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 300,
  "messages": [
    {
      "role": "user",
      "content": "Generate a personalized email for this Circle13 registrant.\n\nName: {{ $json.name }}\nTrack: {{ $json.track }}\nTier: {{ $json.tier }}\nWorkshop: {{ $json.workshop_title }}\nDate: {{ $json.workshop_date }}\n\nWrite:\n1. Subject line (max 8 words, no emojis, punchy)\n2. Opening paragraph (2-3 sentences, personal, specific to their track)\n\nReturn as JSON: {\"subject\": \"...\", \"opening\": \"...\"}\nReturn ONLY the JSON, nothing else."
    }
  ]
}
```

### Example Output

```json
{
  "subject": "Your AI Automation Lab starts in 24 hours",
  "opening": "Hey Rahul, tomorrow you're building real automation workflows — not watching someone else do it. In Track C you'll wire together no-code tools with Claude to create systems that actually run. Make sure you have n8n open and ready to go."
}
```

---

## Agent 3 — Follow-up & Upsell Agent

### Purpose
After a workshop, write a personalized follow-up email that references what was built in that specific track and suggests the most relevant upsell (Prompt Vault, advanced lab, or community).

### Where it runs
n8n Workflow 4, fired T+60 minutes after workshop ends.

### Model
`claude-sonnet-4-20250514` — more nuanced, handles longer copy.

### Prompt Structure

```
You are writing a post-workshop follow-up email for Circle13 Build Lab.

WORKSHOP CONTEXT:
Track: {{ track }}
Track Description: {{ track_description }}
Workshop Date: {{ date }}
Attendee Name: {{ name }}

UPSELL OPTIONS:
1. Prompt Vault (₹499) — 150+ plug-and-play prompts across business, research, content, outreach
2. Advanced Lab (₹1999) — deeper 4-hour sprint, smaller group, 1:1 audit
3. Builder Community (₹299/month) — peer builders, weekly builds, resource drops

Write a follow-up email that:
1. Celebrates what they built today (be specific to the track)
2. Gives them 1 actionable next step they can do TODAY with what they built
3. Introduces the most relevant upsell for their track (choose one):
   - Track A → Prompt Vault
   - Track B → Prompt Vault  
   - Track C → Advanced Lab
   - Track D → Advanced Lab + Community
   - Track E → Community
4. Includes a clear CTA with urgency (48-hour offer)

Tone: peer-to-peer, energetic, not salesy. Like a builder friend texting.
Length: 150-200 words max.
Format: Plain text, no markdown, just line breaks.
```

---

## Agent Orchestration Flow (Visual)

```
User registers
     │
     ▼
Razorpay webhook → Supabase updated
     │
     ▼
n8n Workflow 1 fires
     │
     ├── Query Supabase for user + workshop details
     │
     ├── Call Agent 2 (Personalization)
     │   └── Returns: { subject, opening }
     │
     ├── Build full email from template + AI copy
     │
     └── Resend → Email delivered
     
     [Later: T-24h, T-1h scheduled workflows repeat Agent 2 call]
     
     [Post-workshop: T+60min]
          │
          ▼
     n8n Workflow 4 fires
          │
          ├── Query all confirmed registrations for completed workshop
          │
          ├── For each user: Call Agent 3 (Follow-up)
          │   └── Returns: personalized follow-up email body
          │
          └── Resend → Email delivered
```

---

## Rate Limits & Cost Control

### Haiku (Agent 2) — email personalization
- Input: ~150 tokens per email
- Output: ~100 tokens
- Cost per email: ~$0.00008 (essentially free)
- 100 registrations = < $0.01

### Sonnet (Agent 1 + Agent 3)
- Agent 1 (chat): ~500 tokens per conversation, ~50 conversations/day = ~$0.15/day
- Agent 3 (follow-up): ~400 tokens per email, 100 emails = ~$0.60 per workshop run

### Total AI cost per workshop run (100 attendees): < ₹100

### Rate limit protection
```typescript
// Add to /api/chat route — simple IP-based rate limit
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),  // 20 req/min per IP
})
```

---

## Testing Your Agents

### Agent 1 — test these questions manually
- "What is Circle13?"
- "How is this different from a YouTube tutorial?"
- "What will I actually build?"
- "I'm a student with no coding experience — is this for me?"
- "What's the cheapest option?"
- "Do I get a recording?"
- "I have a coupon code EARLY50"

### Agent 2 — test with mock data
```bash
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-haiku-4-5-20251001",
    "max_tokens": 300,
    "messages": [{
      "role": "user",
      "content": "Name: Priya, Track: Track C - AI Automation Lab, Tier: standard, Workshop: AI Build Lab #3, Date: 29 March 2026. Generate subject + opening para as JSON."
    }]
  }'
```

---

## Agent 4 — WhatsApp Bot (NEW)

### Purpose
Automate customer support and engagement via WhatsApp. Responds to common questions, gathers user data, and qualifies leads for workshops.

### Where it runs
Vercel Serverless Function: `POST /api/whatsapp-webhook`  
Triggered by Twilio webhook on each incoming WhatsApp message.

### Model
`claude-haiku-4-5-20251001` (free HuggingFace Mistral-7B for cost optimization)

### System Prompt

```
You are a WhatsApp support bot for Circle13 AI Build Labs.

Your job:
1. Answer questions about workshops, pricing, tracks, and timing
2. Collect user info (name, experience level, track interest)
3. Send workshop reminders and updates
4. Handle registrations and issues

RULES:
- Be friendly but conversational — like texting a friend
- Keep messages under 160 chars when possible (WhatsApp limits)
- If user wants to register, collect: name, email, phone, track
- If complex question, offer: "Let me connect you with our team → hello@circle13.in"
- Never invent details. If unsure, defer to human.
- Save all conversations to Supabase for follow-up

TRACKS & PRICING (as of March 2026):
- Track A: AI Tools Build Lab — ₹799 | Early: ₹399
- Track B: Prompt Engineering Sprint — ₹799 | Early: ₹399
- Track C: AI Automation Lab (n8n + Claude) — ₹999 | Early: ₹499
- Track D: Idea → MVP Sprint — ₹1499
- Track E: Applied AI Systems Trends — ₹599

Next workshops:
- March 27 (All Tracks)
- April 3 (All except Track D)
- April 10 (All Tracks)
```

### Code (Node.js + Twilio)

```javascript
// api/whatsapp-webhook.js
import twilio from 'twilio';
import { generateText } from '@huggingface/inference';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { From, Body } = req.body;

  try {
    // Get AI response from Hugging Face free API
    const aiResponse = await generateText({
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
      inputs: Body,
      parameters: {
        max_length: 100,
        temperature: 0.7
      },
      accessToken: process.env.HUGGINGFACE_API_KEY
    });

    const message = aiResponse[0].generated_text;

    // Save to Supabase
    await supabase.from('whatsapp_messages').insert({
      phone: From,
      user_message: Body,
      bot_response: message,
      timestamp: new Date()
    });

    // Send back via WhatsApp
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: From,
      body: message.substring(0, 1600)  // WhatsApp message limit
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.status(500).json({ error: error.message });
  }
}
```

### Cost Breakdown (Monthly)
- Twilio Sandbox: **$0** (free credits)
- HuggingFace: **$0** (free inference tier)
- Supabase: **$0** (included)
- **Total: FREE**

---

## Agent 5 — Stitch MCP UI Bridge (NEW)

### Purpose
Bridge AI responses (from all agents) to animated Stitch UI components. Unifies the chat interface across web, email previews, and dashboard analytics.

### Where it runs
React component layer + Stitch MCP component library  
Works with all agents — adapts responses to UI.

### Architecture

```javascript
// lib/stitch-antigravity-bridge.js
import { motion } from 'framer-motion';
import { ResponseCard, AnimatedButton, LoadingState } from '@stitch/components';

class StitchBridge {
  constructor() {
    this.cache = new Map();
  }

  // Convert AI response to Stitch component
  formatResponse(aiOutput, agentType) {
    const variants = {
      chat: {
        animation: 'slide-in-from-left',
        duration: 0.4,
        color: 'indigo'
      },
      email: {
        animation: 'fade-in',
        duration: 0.3,
        color: 'slate'
      },
      whatsapp: {
        animation: 'pop-in',
        duration: 0.2,
        color: 'green'
      }
    };

    const variant = variants[agentType] || variants.chat;

    return {
      type: 'response-card',
      content: aiOutput,
      metadata: {
        agent: agentType,
        timestamp: new Date(),
        animation: variant.animation,
        duration: variant.duration,
        color: variant.color
      },
      actions: [
        { label: 'Copy', action: 'copy' },
        { label: 'Share', action: 'share' },
        { label: 'Save', action: 'save' }
      ]
    };
  }

  async processInput(userMessage, context = {}) {
    // Get response from appropriate agent
    const agentType = context.channel || 'chat';  // chat, whatsapp, email
    
    // Call agent API
    const response = await fetch('/api/agents', {
      method: 'POST',
      body: JSON.stringify({ message: userMessage, type: agentType, context })
    });

    const { data } = await response.json();
    
    // Format for Stitch
    return this.formatResponse(data, agentType);
  }
}

export default StitchBridge;
```

### Usage in React Component

```jsx
import { StitchBridge } from '@/lib/stitch-antigravity-bridge';
import { ResponseCard } from '@stitch/components';
import { motion } from 'framer-motion';

export default function ChatUI() {
  const bridge = new StitchBridge();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (message) => {
    setLoading(true);
    const stitchComponent = await bridge.processInput(message, {
      channel: 'chat'
    });
    setResponse(stitchComponent);
    setLoading(false);
  };

  return (
    <motion.div
      className="space-y-4 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {loading && <LoadingState />}
      
      {response && (
        <ResponseCard
          content={response.content}
          animation={response.metadata.animation}
          duration={response.metadata.duration}
          actions={response.actions}
        />
      )}

      <input
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSendMessage(e.target.value);
        }}
        placeholder="Ask about our workshops..."
        className="w-full p-3 border border-indigo-200 rounded-lg"
      />
    </motion.div>
  );
}
```

### Stitch Components Available

```jsx
<ResponseCard />      // AI response container
<AnimatedButton />    // CTA with micro-interactions
<LoadingState />      // Skeleton + pulsing spinner
<FeatureCard />       // Workshop feature showcase
<TestimonialCard />   // User testimonial with avatar fade
<CountdownTimer />    // Urgency (sales deadline)
<FormInput />         // Animated form fields
<SuccessAnimation />  // Confetti on conversion
```

### Cost
- Stitch MCP: **FREE** (open-source MIT)
- Framer Motion: **FREE** (MIT license)
- **Total: FREE**

---

## Complete Agent Deployment Checklist

- [ ] Agent 1: Landing page chat widget (Next.js or Vite)
- [ ] Agent 2: Email personalization (n8n HTTP node)
- [ ] Agent 3: Follow-up copy (n8n HTTP node)
- [ ] Agent 4: WhatsApp bot (Vercel function + Twilio)
- [ ] Agent 5: Stitch UI bridge (React component)
- [ ] Database: Supabase setup + tables
- [ ] Secrets: All API keys in `.env.local`
- [ ] Testing: Run through sample workflow manually
- [ ] Deploy: `vercel deploy --prod`

**Total setup time:** ~2 hours  
**Monthly cost:** **$0-50** (scales with usage)
