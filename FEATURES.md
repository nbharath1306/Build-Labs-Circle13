# Circle13 — Features Specification
**Version:** 1.0  
**All features, phase by phase, with acceptance criteria**

---

## Phase 1 Features — Foundation

### F1.1 — Live Workshop Countdown Timer
**What it does:** Hero section shows a live countdown to the next Build Lab.  
**Data source:** `workshops.scheduled_at` from Supabase.  
**Stitch component:** `CountdownTimer` — already built, wire to real data.  
**Acceptance criteria:**
- Shows days / hours / minutes / seconds
- Pulls next upcoming workshop from DB (not hardcoded)
- On expiry: shows "Workshop is live — Join now" with zoom link
- Updates every second client-side

---

### F1.2 — Multi-Step Registration Form
**What it does:** 3-step form to collect user info, select track, select tier.  
**Stitch component:** `RegistrationForm` — already built.  
**Steps:**
1. Name + Email + Phone
2. Track selection (A/B/C/D/E with description)
3. Tier selection (Early Bird / Standard / Bundle) + optional coupon code

**Acceptance criteria:**
- All fields validated (email format, phone 10 digits, required fields)
- Track descriptions visible on hover/select
- Coupon code field: validates live (green check / red X as they type)
- Shows price after coupon applied
- Disabled state during API call

---

### F1.3 — Razorpay Payment Flow
**What it does:** Opens Razorpay checkout modal after form submit.  
**Acceptance criteria:**
- Supports UPI, Cards, Net Banking, Wallets
- Circle13 branding (logo + green color) in checkout modal
- On success: redirect to `/confirm` page
- On failure: show error message inline, allow retry
- On dismiss (close without paying): form stays filled, can re-attempt
- Webhook confirms payment server-side (not just redirect)

---

### F1.4 — Confirmation Page
**What it does:** Post-payment success page with all details.  
**Stitch component:** `ResponseCard` with animated success state.  
**Acceptance criteria:**
- Shows: name, workshop title, date/time, tier, amount paid
- "Add to Google Calendar" link (auto-generated with workshop details)
- "Join our WhatsApp community" link
- States: welcome email sent to {email}

---

### F1.5 — Coupon Code System
**What it does:** Discount codes for early bird and promotions.  
**Acceptance criteria:**
- Codes: case-insensitive (EARLY50 = early50)
- Types: percent (50%) or flat (₹100 off)
- Max uses enforced (once limit hit → "code expired" error)
- Expiry date enforced
- Usage count increments atomically (no double-use race condition)

---

## Phase 2 Features — Automation

### F2.1 — Welcome Email (Automated)
**Trigger:** Razorpay `payment.captured` webhook → n8n Workflow 1  
**Sent to:** Registrant's email  
**Content:**
- AI-personalized subject line (Agent 2)
- AI-personalized opening paragraph (specific to their track)
- Workshop details: title, date, time, duration
- "Add to Google Calendar" link
- Preview of deliverables they'll get
- No zoom link yet (sent T-1h)

**Acceptance criteria:**
- Arrives within 60 seconds of payment confirmation
- Subject line is unique per registrant (not a template)
- Sent from `hello@circle13.in` (not a generic domain)
- Mobile renders correctly

---

### F2.2 — 24-Hour Reminder Email
**Trigger:** Cron (every hour) — finds workshops starting in ~24 hours  
**Content:**
- AI-personalized subject + opening
- What to prepare (laptop, tools, browser tabs)
- Track-specific prep tip
- Zoom link NOT yet included (sent T-1h)
- Excitement builder

**Acceptance criteria:**
- Fires for all confirmed registrations of upcoming workshops
- Does NOT fire twice for same registrant (duplicate check)
- Personalization is track-specific

---

### F2.3 — 1-Hour Reminder Email
**Trigger:** Cron (every 30 min) — finds workshops starting in ~1 hour  
**Content:**
- Simple template (no AI, speed matters)
- Subject: "Your Build Lab starts in 1 hour — join link inside"
- Zoom link (from `workshops.zoom_link`)
- 3-bullet "have ready" list
- No fluff

**Acceptance criteria:**
- Arrives ~1 hour before workshop
- Zoom link is correct and clickable
- Under 150 words

---

### F2.4 — Post-Workshop Follow-up + Upsell (T+60 min)
**Trigger:** Cron (every hour) — finds workshops that ended ~60 minutes ago  
**Content:**
- AI-written follow-up (Agent 3) — track-specific, personal
- Replay link (48-hour access)
- One actionable next step (AI-generated, specific to track)
- Upsell offer (track-matched):
  - Track A/B → Prompt Vault (₹499)
  - Track C/D → Advanced Lab (₹1999)
  - Track E → Community (₹299/month)
- "Offer expires in 48 hours" urgency
- For Bundle tier: 1:1 session booking link included

**Acceptance criteria:**
- `upsell_sent` flag in DB prevents duplicate sends
- Upsell is relevant to track attended
- Bundle-tier users get 1:1 booking link automatically

---

### F2.5 — Payment Failed Email
**Trigger:** Razorpay `payment.failed` webhook → n8n Workflow 5  
**Content:**
- Subject: "Your spot is held — complete payment to confirm"
- New Razorpay payment link (24h expiry)
- Urgency: "Seats are filling up"
- Support contact

**Acceptance criteria:**
- New payment link generated via Razorpay Payment Links API
- Link expires in 24 hours
- Fires within 2 minutes of failed payment

---

### F2.6 — Community Invite (T+3 days)
**Trigger:** Cron (daily 10am) — finds workshops from 3 days ago  
**Content:**
- AI-written community invite (Agent 3)
- WhatsApp group / Discord link
- Builder Community upsell: ₹299/month
- Social proof: "X builders already inside"

**Acceptance criteria:**
- `community_invite_sent` flag prevents duplicate sends
- Only sent to confirmed registrations
- Fires at 10am IST regardless of when workshop was

---

## Phase 3 Features — AI Agents

### F3.1 — Landing Page Chat Agent (C13 Bot)
**What it does:** Floating chat widget that answers visitor questions and drives registrations.  
**Stitch component:** `ChatWidget` — already built, wire to `/api/chat`.  

**Behavior:**
- Auto-popup bubble after 5 seconds: "Hey 👋 Building something with AI? Ask me what we build here."
- Bubble auto-dismisses after 8 seconds if no interaction
- Notification dot on chat button
- Full chat window on click
- Streaming response (types out in real-time)
- When agent returns `action: SHOW_REGISTER_CTA` → inline Stitch `AnimatedButton` appears in chat
- When agent returns `action: SHOW_PRICING` → inline Stitch `FeatureCard` appears in chat

**Acceptance criteria:**
- Answers correctly: pricing, tracks, what gets built, who it's for, refund policy
- Never says "webinar" or "seminar"
- Never hallucinates details not in system prompt
- Surfaces CTA after 2–3 messages if user seems interested
- Under 80 words per response (unless detailed answer needed)
- Rate limited: 20 requests/minute per IP
- Mobile-friendly widget

**Quick chips (pre-built questions in UI):**
- "What will I build?"
- "How much does it cost?"
- "Which track is for me?"
- "Is it recorded?"

---

### F3.2 — AI Email Personalization (Agent 2)
**What it does:** Generates unique subject + opening for each registrant's emails.  
**Runs inside:** n8n HTTP Request node → Claude Haiku API  

**Acceptance criteria:**
- Subject line feels personal (includes name or track reference)
- Opening paragraph is track-specific (not generic)
- Returns valid JSON: `{ "subject": "...", "opening": "..." }`
- Fallback: if Claude fails → use hardcoded template (never drop the email)

---

### F3.3 — AI Follow-up Writer (Agent 3)
**What it does:** Writes post-workshop follow-up + community invite emails.  
**Runs inside:** n8n HTTP Request node → Claude Sonnet API  

**Acceptance criteria:**
- Body is 150–200 words
- Includes one specific actionable next step for that track
- Upsell recommendation matches track attended
- Tone: builder-to-builder, not corporate

---

## Phase 4 Features — 1:1 Live Session

### F4.1 — 1:1 Session Booking Form
**URL:** `/1on1`  
**Stitch component:** `ResponseCard` form layout  

**Fields:**
- Name (pre-filled if coming from post-workshop email link)
- Email (pre-filled)
- Phone
- "What do you want to work on?" (textarea — goal)
- "Which topic/track?" (dropdown: A/B/C/D/E or "Not sure")
- "Preferred time slot" (3 options — founder manually updates these in DB weekly)

**Two entry points:**
1. Bundle tier confirmation page (included free)
2. Post-workshop email → "Add 1:1 session for ₹999" link (paid)

**Acceptance criteria:**
- Form validates all fields
- Submits to `/api/book-session`
- Success state: "Request received. We'll confirm within 24 hours."
- Founder gets email + WhatsApp notification within 2 minutes
- User gets confirmation email immediately

---

### F4.2 — Session Confirmation by Founder
**How it works:** Founder receives email with session details + a "Confirm Slot" link.  
**URL:** `/api/confirm-session?session_id=xxx&slot=ISO_DATE&meet=GOOGLE_MEET_URL`  

**Acceptance criteria:**
- Clicking "Confirm Slot" in founder's email → updates DB, sends confirmation to user
- Confirmation email to user includes: exact date/time IST, Google Meet link, prep instructions
- Session status updates: `requested → confirmed`

---

### F4.3 — Session Reminder (T-1h)
**Trigger:** n8n Workflow 8 — cron every 30 min, finds sessions starting in ~1h  
**Sends to:** Both user AND founder  

**User email:**
- "Your 1:1 with Circle13 starts in 1 hour"
- Meet link
- "Come prepared with: your goal, specific questions, anything you've built"

**Founder email/WhatsApp:**
- "1:1 session with {name} in 1 hour"
- Their goal: {goal}
- Track interest: {track}

**Acceptance criteria:**
- Both user and founder notified
- Fires once per session (not twice)

---

### F4.4 — Post-Session Follow-up
**Trigger:** n8n Workflow 9 — cron, finds sessions that completed ~30 min ago  

**User receives:**
- "Thanks for the session" email
- Resources relevant to their goal (founder pre-fills `notes` field in DB or it auto-generates)
- Invite to next Build Lab
- Community link

**Acceptance criteria:**
- Fires after session `confirmed_slot` + 1.5 hours
- Only fires if `status = confirmed` (not cancelled)

---

### F4.5 — 1:1 Pricing + Upsell Placement

**Placement 1:** Bundle tier pricing card  
```
Builder Bundle — ₹1499
✓ Workshop access
✓ Full Prompt Vault (150+ prompts)
✓ Community access (lifetime)
✓ 1:1 Audit Session with founder  ← key differentiator
```

**Placement 2:** Post-workshop email (non-bundle users)  
```
Want personalized feedback on your build?
Book a 30-min 1:1 with our team — ₹999
[Book Your Session →]
(Only 5 slots available this week)
```

**Placement 3:** Chat agent (C13 Bot)  
When user asks about bundle or advanced help → agent mentions 1:1 option.

---

## Feature Status Tracker

| Feature | Phase | Status | Priority |
|---------|-------|--------|----------|
| F1.1 Countdown Timer (live data) | 1 | 🔲 Todo | High |
| F1.2 Registration Form (wired) | 1 | 🔲 Todo | High |
| F1.3 Razorpay Payment | 1 | 🔲 Todo | High |
| F1.4 Confirmation Page | 1 | 🔲 Todo | High |
| F1.5 Coupon Codes | 1 | 🔲 Todo | Medium |
| F2.1 Welcome Email | 2 | 🔲 Todo | High |
| F2.2 24h Reminder | 2 | 🔲 Todo | High |
| F2.3 1h Reminder | 2 | 🔲 Todo | High |
| F2.4 Post-Workshop Upsell | 2 | 🔲 Todo | Medium |
| F2.5 Payment Failed Email | 2 | 🔲 Todo | High |
| F2.6 Community Invite | 2 | 🔲 Todo | Low |
| F3.1 Chat Agent (C13 Bot) | 3 | 🔲 Todo | High |
| F3.2 Email Personalization | 3 | 🔲 Todo | Medium |
| F3.3 Follow-up Writer | 3 | 🔲 Todo | Medium |
| F4.1 1:1 Booking Form | 4 | 🔲 Todo | High |
| F4.2 Session Confirmation | 4 | 🔲 Todo | High |
| F4.3 Session Reminders | 4 | 🔲 Todo | Medium |
| F4.4 Post-Session Follow-up | 4 | 🔲 Todo | Low |
| F4.5 1:1 Upsell Placement | 4 | 🔲 Todo | High |

**Legend:** 🔲 Todo → 🔄 In Progress → ✅ Done → ❌ Blocked

---

## Out of Scope (V1 — Do Not Build Yet)

- Affiliate / referral system
- Certificate generation
- Admin dashboard (manage from Supabase Table Editor for now)
- Mobile app
- Multi-instructor support
- Live chat during workshop (use Zoom chat)
- Video hosting (use Zoom recording + Google Drive for now)
- Stripe (add only if you get international registrations)
