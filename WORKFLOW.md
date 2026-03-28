# Circle13 — Automation Workflow Guide
**Version:** 1.0  
**Automation Engine:** n8n (self-hosted on Railway)

---

## 1. Setup n8n on Railway

### Deploy in 5 minutes

1. Go to railway.app → New Project → Deploy from template
2. Search "n8n" → select official template
3. Set environment variables:
   ```
   N8N_BASIC_AUTH_ACTIVE=true
   N8N_BASIC_AUTH_USER=admin
   N8N_BASIC_AUTH_PASSWORD=your-strong-password
   N8N_HOST=0.0.0.0
   N8N_PORT=5678
   DB_TYPE=postgresdb
   DB_POSTGRESDB_HOST=[Railway Postgres host]
   DB_POSTGRESDB_DATABASE=n8n
   DB_POSTGRESDB_USER=postgres
   DB_POSTGRESDB_PASSWORD=[Railway Postgres password]
   ANTHROPIC_API_KEY=sk-ant-xxx
   RESEND_API_KEY=re_xxx
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_KEY=eyJ...
   ```
4. Add a custom domain like `n8n.circle13.in` or use Railway's generated URL

---

## 2. Complete Workflow Map

```
TRIGGER                     WORKFLOW              AGENT USED     OUTPUT

payment.captured            Workflow 1            Agent 2        Welcome email
(webhook from app)          Registration          (Haiku)        + WhatsApp (optional)
                            Confirmed

T-24h before workshop       Workflow 2            Agent 2        Reminder email
(cron: every hour)          24h Reminder          (Haiku)        + WhatsApp

T-1h before workshop        Workflow 3            None           Final reminder email
(cron: every 30 min)        1h Reminder                         (template only)

T+60min after end           Workflow 4            Agent 3        Follow-up + upsell
(cron: every hour)          Post-Workshop         (Sonnet)       email

payment.failed              Workflow 5            None           Retry payment email
(webhook from app)          Payment Failed                       with new link

T+3 days                    Workflow 6            Agent 3        Community invite
(cron: daily 10am)          Community Invite      (Sonnet)       email
```

---

## 3. Workflow 1 — Registration Confirmed

### Trigger: Webhook (POST from your Next.js app)

```json
{
  "registration_id": "uuid",
  "payment_id": "pay_xxx",
  "order_id": "order_xxx"
}
```

### Nodes:

```
[Webhook] 
    ↓
[Supabase: Select registration]
    SELECT r.*, w.title, w.scheduled_at, w.zoom_link, w.track
    FROM registrations r
    JOIN workshops w ON r.workshop_id = w.id
    WHERE r.id = '{{ $json.registration_id }}'
    ↓
[HTTP Request: Claude API — Agent 2]
    POST https://api.anthropic.com/v1/messages
    Body: personalization prompt (see AI_AGENTS.md)
    Returns: { subject, opening }
    ↓
[Code Node: Build email HTML]
    Merge AI copy + registration data + template
    ↓
[Resend: Send Email]
    from: hello@circle13.in
    to: {{ registration.email }}
    subject: {{ aiOutput.subject }}
    html: {{ builtEmailHTML }}
    ↓
[Supabase: Insert email log]
    INSERT INTO email_logs (registration_id, email_type, status)
    ↓
[Respond to Webhook: 200 OK]
```

### Resend node config (n8n):
```json
{
  "from": "Circle13 <hello@circle13.in>",
  "to": "{{ $('Supabase').item.json.email }}",
  "subject": "{{ $('Claude').item.json.subject }}",
  "html": "{{ $('Code').item.json.emailHtml }}"
}
```

---

## 4. Workflow 2 — 24h Reminder

### Trigger: Schedule (Cron — every hour)

### Logic:
Find workshops starting in 24 hours (±30 min window), get all confirmed registrations.

```
[Schedule Trigger: Every hour]
    ↓
[Supabase: Query workshops in next 24h]
    SELECT * FROM workshops 
    WHERE scheduled_at BETWEEN NOW() + INTERVAL '23.5 hours' 
    AND NOW() + INTERVAL '24.5 hours'
    ↓
[IF: workshops found?]
  YES ↓
[Supabase: Get registrations for workshop]
    SELECT r.*, w.* FROM registrations r
    JOIN workshops w ON r.workshop_id = w.id
    WHERE r.workshop_id = '{{ $json.id }}'
    AND r.status = 'confirmed'
    ↓
[Split In Batches: Process each registrant]
    ↓
[HTTP Request: Claude API — Agent 2]
    Generate personalized reminder copy
    ↓
[Resend: Send reminder email]
    ↓
[Supabase: Log email sent]
```

---

## 5. Workflow 3 — 1h Reminder

### Trigger: Schedule (Cron — every 30 minutes)

Same structure as Workflow 2 but:
- Time window: 1 hour before workshop
- Uses a simpler template (no Claude call — just inject name + zoom link)
- Subject: "Your Build Lab starts in 1 hour — join link inside"

```typescript
// Code node: Build 1h reminder HTML
const { name, zoom_link, workshop_title } = $input.item.json

const html = `
<p>Hey ${name},</p>
<p>Your AI Build Lab starts in <strong>1 hour</strong>.</p>
<p>Join here: <a href="${zoom_link}">${zoom_link}</a></p>
<p>What to have ready:</p>
<ul>
  <li>Laptop open</li>
  <li>Browser tab with Claude.ai or your AI tool</li>
  <li>Notepad for quick notes</li>
</ul>
<p>See you inside — we start on time.</p>
<p>— Circle13 Team</p>
`

return { html, subject: `Join link: ${workshop_title} starts in 1 hour` }
```

---

## 6. Workflow 4 — Post-Workshop (Upsell)

### Trigger: Schedule (Cron — every hour)

Find workshops that ended 60 minutes ago.

```
[Schedule Trigger: Every hour]
    ↓
[Supabase: Find workshops that ended ~1hr ago]
    SELECT * FROM workshops
    WHERE scheduled_at + INTERVAL '2 hours' 
    BETWEEN NOW() - INTERVAL '90 minutes' 
    AND NOW() - INTERVAL '30 minutes'
    ↓
[Supabase: Get confirmed registrations]
    ↓
[Split In Batches]
    ↓
[HTTP Request: Claude API — Agent 3]
    POST to Anthropic with follow-up prompt
    Passes: name, track, workshop_title, date
    Returns: personalized follow-up body
    ↓
[Code Node: Build upsell email]
    Append upsell section + CTA button to Claude output
    ↓
[Resend: Send follow-up email]
    ↓
[Supabase: Log + mark upsell_sent = true]
```

---

## 7. Workflow 5 — Payment Failed

### Trigger: Webhook (POST from your Next.js app)

```json
{
  "registration_id": "uuid",
  "email": "user@example.com",
  "name": "User Name"
}
```

### Nodes:
```
[Webhook]
    ↓
[Supabase: Get registration details]
    ↓
[Code Node: Generate new payment link]
    // Create a new Razorpay payment link via API
    POST https://api.razorpay.com/v1/payment_links
    {
      amount: original_amount,
      currency: "INR",
      description: "Circle13 Build Lab Registration",
      customer: { name, email, contact: phone },
      notify: { email: true },
      reminder_enable: true,
      expire_by: Math.floor(Date.now()/1000) + 86400  // 24h expiry
    }
    ↓
[Resend: Send payment retry email]
    Subject: "Your spot is held — complete payment to confirm"
    Body: Link to retry + urgency (seats limited)
```

---

## 8. Workflow 6 — Community Invite (T+3 days)

### Trigger: Schedule (Cron — daily at 10:00 AM)

```
[Schedule: Daily 10am]
    ↓
[Supabase: Find workshops from 3 days ago]
    SELECT * FROM workshops
    WHERE DATE(scheduled_at) = CURRENT_DATE - INTERVAL '3 days'
    ↓
[Supabase: Get registrations where community_invite_sent = false]
    ↓
[HTTP Request: Claude API — Agent 3]
    Generate community invite message for their track
    ↓
[Resend: Send community invite]
    CTA: Join WhatsApp/Discord community
    Offer: ₹299/month Builder Community
    ↓
[Supabase: Update community_invite_sent = true]
```

---

## 9. WhatsApp Automation (Optional — Add Later)

### Option A: WATI (easiest for India)
- Connect WATI node in n8n
- WhatsApp Business API
- ₹999/month base plan
- Use for T-24h and T-1h reminders

### Option B: Twilio
- More expensive but reliable globally
- $0.05 per WhatsApp message

### Option C: Free Bootstrap (manual + Zapier shortcut)
- Collect WhatsApp opt-in at registration
- Send messages manually for first 3 workshops
- Automate once you hit 30+ registrations per workshop

---

## 10. Email Templates Structure

### Template: Welcome Email

```
Subject: [AI-generated by Agent 2]

Hey {name},

{AI-generated opening paragraph — 2-3 sentences, specific to track}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR BUILD LAB DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Workshop:  {workshop_title}
Track:     {track}
Date:      {formatted_date}
Time:      {time} IST
Duration:  2 hours
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You'll receive the Zoom link 1 hour before we start.

What you'll walk away with:
→ Prompt Vault Starter Pack
→ AI Workflow Templates
→ Automation Blueprints
→ Tool Stack Guide
→ Replay Recording (48hr access)

[ADD TO GOOGLE CALENDAR]  ← link

See you inside.

— Circle13 Team
circle13.in
```

### Template: Upsell Email (Post-workshop)

```
Subject: Here's your replay + what's next

Hey {name},

{AI-generated follow-up body — 150 words, specific to track, 
 includes one actionable next step}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR REPLAY (expires in 48h)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[WATCH REPLAY] ← button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WANT TO GO DEEPER?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{AI-generated upsell recommendation based on track}

[GET PROMPT VAULT — ₹499]  ← or whichever upsell fits their track

Offer expires in 48 hours.

— Circle13 Team
```

---

## 11. Testing Checklist

### Before going live, test every workflow:

- [ ] Workflow 1: Submit test registration → check email arrives within 60 seconds
- [ ] Workflow 2: Manually set a workshop time to +24h → trigger cron manually → email arrives
- [ ] Workflow 3: Same but +1h
- [ ] Workflow 4: Manually set workshop end to -1h ago → trigger → upsell email arrives
- [ ] Workflow 5: Trigger payment failed webhook manually → retry email arrives
- [ ] All emails render correctly on mobile (test with Litmus or Email on Acid)
- [ ] All Supabase queries return correct data
- [ ] Duplicate prevention: run workflow twice for same user — only one email sent

### Duplicate prevention pattern:
```sql
-- Add to all workflows before sending
SELECT id FROM email_logs 
WHERE registration_id = 'xxx' 
AND email_type = 'welcome'
-- If row exists → skip, don't send again
```
