# Circle13 — AI Build Lab
## Product Requirements Document (PRD)
**Version:** 1.0  
**Owner:** Circle13 Co-founder  
**Status:** Draft

---

## 1. Overview

Circle13 Build Lab is a live 2-hour hands-on AI execution workshop. Unlike traditional webinars or training sessions, participants leave with working AI systems, prompt vaults, and automation workflows they built themselves during the session.

**Category:** AI Build Lab / Execution Sprint (NOT a webinar, NOT a seminar)

**Core Promise:** You will build something real in 2 hours. No slides. No theory. Only systems.

---

## 2. Problem Statement

The market is flooded with AI "awareness" content — tools overviews, intro courses, YouTube tutorials. None of them produce builders. People watch, nod, and do nothing.

Circle13 fixes the execution gap. We force build-first learning where the output is a working system, not a certificate.

---

## 3. Goals

### Business Goals
- Run profitable workshops at ₹399–₹1499 per seat
- Build a recurring audience of AI builders
- Upsell to Prompt Vault, advanced labs, and builder community
- Establish Circle13 as the go-to AI execution brand in India

### Product Goals
- Seamless registration and payment flow (< 3 clicks to pay)
- Automated pre/post event communication (zero manual effort)
- AI agent on landing page to answer questions and drive conversions
- Workshop delivery infrastructure (Zoom/Meet + resource drops)

---

## 4. User Personas

### Primary: The Curious Builder
- Age 20–32, student or early-career
- Knows AI exists, wants to use it, doesn't know where to start
- Motivated by outcomes, not theory
- Price sensitive — needs clear ROI

### Secondary: The Founder/Freelancer
- Running a small business or solo venture
- Wants to automate ops, content, outreach with AI
- Will pay more for actionable templates
- Wants community and peer builders

### Tertiary: The Developer
- Already building, wants structured prompt systems
- Looking for workflows to integrate into existing products
- Will upsell to advanced labs easily

---

## 5. Workshop Tracks (SKUs)

| Track | Name | Focus | Duration |
|-------|------|--------|----------|
| A | AI Tools Build Lab | Build practical AI tool stacks | 2 hrs |
| B | Prompt Engineering Sprint | Create reusable prompt frameworks | 2 hrs |
| C | AI Automation Lab | Build no-code + AI workflows | 2 hrs |
| D | Idea → MVP Sprint | Turn raw ideas into AI-assisted MVPs | 2 hrs |
| E | Applied AI Systems | Future trends + live application | 2 hrs |

---

## 6. Workshop Structure (2 Hours)

```
00:00 – 00:15   Part 1: Hook + Live Demo
00:15 – 01:00   Part 2: Core Build Sprint (with checkpoints every 15 min)
01:00 – 01:25   Part 3: Vault + Templates Drop
01:25 – 01:45   Part 4: Guided Mini Build
01:45 – 02:00   Part 5: Q&A + Upgrade Path
```

---

## 7. Features Required

### 7.1 Landing Page
- Hero section with countdown timer to next lab
- Workshop tracks with descriptions
- Pricing tiers (Early Bird / Standard / Bundle)
- Deliverables section
- Social proof / testimonials (post-launch)
- FAQ section
- AI agent chatbot (auto-pop after 5 seconds)
- Registration CTA → Payment flow

### 7.2 Registration Flow
- Name, Email, Phone (mandatory)
- Track selection
- Payment tier selection
- Payment via Razorpay
- Auto-confirmation email + WhatsApp (optional)
- Add to Google Calendar link in confirmation

### 7.3 Automated Messages (AI Agent Driven)

| Trigger | Message | Channel |
|---------|---------|---------|
| Registration complete | Welcome + workshop link + resources preview | Email |
| T-24 hours | Reminder + what to prepare | Email + WhatsApp |
| T-1 hour | Final reminder + join link | Email + WhatsApp |
| Post-workshop (T+1 hour) | Replay link + upsell (Prompt Vault) | Email |
| T+3 days | Follow-up + community invite | Email |
| Payment failed | Retry link + support | Email |

### 7.4 Payment Gateway
- Razorpay standard checkout
- UPI, Cards, Net Banking, Wallets support
- Early Bird discount via coupon codes
- Bundle pricing (Workshop + Vault)
- Webhook-based confirmation (not redirect-based — more reliable)
- Refund handling within 7 days

### 7.5 Admin Dashboard (V2)
- Registrations list
- Revenue tracker
- Email send logs
- Coupon code management
- Export to CSV

---

## 8. Pricing Tiers

| Tier | Price | What's Included |
|------|-------|-----------------|
| Early Bird | ₹399 | Workshop access + basic resource sheet |
| Standard | ₹799 | Workshop + Prompt Vault Starter + Templates |
| Builder Bundle | ₹1499 | Workshop + Full Vault + Community + 1:1 Audit slot |

---

## 9. Deliverables Per Participant

- Prompt Vault Starter Pack (PDF + Notion template)
- AI Workflow Templates (n8n / Make JSON)
- Automation Blueprints
- Tool Stack Guide
- Replay Recording (48-hour access)
- Resource Sheet with links

---

## 10. Success Metrics

| Metric | Target (Launch) |
|--------|----------------|
| Registrations per workshop | 30–100 |
| Conversion rate (landing page → paid) | 8–15% |
| Email open rate (automated) | > 45% |
| Show-up rate (registered → attended) | > 60% |
| Upsell conversion (vault/community) | > 20% |
| NPS / satisfaction score | > 8/10 |

---

## 11. Out of Scope (V1)

- Mobile app
- Live chat during workshop (use Zoom chat)
- Affiliate/referral system
- Certificate generation
- Multi-instructor support

---

## 12. Launch Timeline

| Week | Milestone |
|------|-----------|
| Week 1 | Landing page live, payment integrated, domain set |
| Week 2 | Email automations live, AI agent on page |
| Week 3 | 7-day launch sprint (social posts, DMs, polls) |
| Week 4 | Workshop Day 1 |
| Week 5+ | Iterate based on feedback, run next lab |

---

## 13. Tech Stack Summary

See `TECH_STACK.md` for full breakdown.

- **Frontend:** Next.js 14
- **Backend:** Supabase (auth, DB, edge functions)
- **Payments:** Razorpay
- **Emails:** Resend (transactional) + React Email templates
- **Automations:** n8n (self-hosted or cloud)
- **AI Agents:** Claude API (Anthropic) via n8n or custom Node service
- **Hosting:** Vercel (frontend) + Railway or Render (n8n)
