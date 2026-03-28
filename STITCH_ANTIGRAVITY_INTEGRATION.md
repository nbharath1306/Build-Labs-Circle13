# Stitch MCP + Antigravity Integration
**Quick Setup Guide**

---

## What is Stitch MCP?

Stitch MCP is a Model Context Protocol server that provides UI components. You integrate it with Antigravity (your AI agent) to bridge AI responses to animated website components.

---

## Integration Steps

### 1. Install Stitch MCP Server

If using Stitch as an MCP server:

```bash
npm install --save-dev @stitch/mcp @stitch/core
```

### 2. Configure in .mcp.json (or claude_desktop_config.json)

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

### 3. Call Stitch MCP from Antigravity

When Antigravity generates a response, route it through Stitch MCP to get animated UI components.

---

## More Info

- [Stitch MCP Docs](https://github.com/stitchui/stitch-mcp)
- [Antigravity Docs](https://antigravity.ai)

---

# Animated AI Tools Carousel/Rotation Section

**Prompt to generate animated rotating logos of AI tools for your landing page:**

```
Create an animated rotating carousel section for Circle13 landing page showing the AI tools we use and teach.

PURPOSE:
Display the AI ecosystem tools in an eye-catching, animated way that shows our tech stack and what students will work with.

SECTION TITLE:
"The AI Stack We Teach"

TOOLS TO INCLUDE (with logos):
1. OpenAI (ChatGPT/GPT-4)
2. Anthropic (Claude)
3. Hugging Face
4. n8n (automation)
5. Vercel (deployment)
6. Supabase (database)
7. Mistral AI
8. Zapier
9. Make (formerly Integromat)
10. LangChain
11. Stripe/Razorpay (payments)
12. Figma (design)

ANIMATION REQUIREMENTS:
- Infinite rotating carousel
- Logos move in a smooth circular/horizontal rotation
- Speed: ~20-30 seconds per full rotation (not too fast, readable)
- Smooth infinite loop (no pause)
- On hover: Logo zooms in slightly (1.1x scale)
- Tooltip on hover: Show tool name + brief description
- Responsive: Works on mobile (adjust size)

CAROUSEL STYLE:
- Background: Minimal, clean (dark slate or transparent)
- Logos: Actual brand logos (professional, colored)
- Size: Each logo ~80-100px
- Spacing: 30-40px between logos
- Layout: Horizontal infinite scroll (looks like it never ends)
- Glow effect on hover (subtle teal glow)

ANIMATION TIMING:
- Rotation: Smooth, continuous 20-30s per loop
- Hover effect: 0.3s transition to zoom
- No easing jumps - pure smooth rotation

DESCRIPTION BELOW CAROUSEL (optional):
"Master the tools that power AI products:
- Claude API for intelligent responses
- n8n for workflow automation
- Vercel for instant deployment
- Supabase for production databases
- Open-source models for cost optimization"

TECHNICAL IMPLEMENTATION:
- Use Framer Motion for smooth infinite rotation
- CSS or React animation (Tailwind compatible)
- Responsive grid layout that adapts to screen size
- Performance optimized (no lag on scroll)
- Touch-friendly for mobile (swipe support)

MOBILE RESPONSIVE:
- Desktop: Full 12 logos visible in rotation
- Tablet: 8 logos visible
- Mobile: 4-5 logos visible (smaller size)
- Touch swipe to manually rotate (optional)

COLOR & STYLE:
- Keep logos in original brand colors
- Minimal background
- Subtle shadow under logos
- Smooth, professional feel
- No clashing colors

OUTPUT:
- React component ready to drop into landing page
- Uses Tailwind CSS styling
- Framer Motion for animations
- Mobile-first responsive design
- Performance optimized (~50KB bundle)
```

---

## How to Use This Prompt

1. **With Claude**: 
   - Paste this prompt
   - Ask for React component code using Framer Motion
   - Get ready-to-use animated carousel

2. **With Stitch**:
   - Paste this prompt to UI generator
   - Upload company logos (PNG format)
   - Generate visual design + component

3. **With Gemini**:
   - Paste prompt
   - Upload logo images
   - Get HTML/CSS animation code

---

## Example Tools to Feature

| Tool | Purpose | Why We Use It |
|------|---------|--------------|
| **Claude (Anthropic)** | LLM backbone | Best reasoning for agents |
| **OpenAI (GPT-4)** | Alternative LLM | Vision + multimodal support |
| **HuggingFace** | Open-source models | Cost-effective, privacy-focused |
| **n8n** | Automation workflows | No-code AI automation |
| **Vercel** | Deployment | Instant, free, serverless |
| **Supabase** | Database + Auth | PostgreSQL, real-time, free tier |
| **Mistral** | Open LLM | Fast, efficient alternative |
| **LangChain** | LLM framework | Building complex AI systems |
| **Stripe/Razorpay** | Payments | Registration & subscriptions |
| **Figma** | Design | UI/UX for AI products |

---

This animated carousel makes your landing page **dynamic, engaging, and shows the real tech stack students will actually use**. 🎯

# Professional Landing Page Prompt

**Use this prompt with Stitch, Claude, or any AI to generate a professional, premium landing page for Circle13:**

```
Create a professional, premium landing page for Circle13 Build Lab.

DESIGN PHILOSOPHY:
- Premium, corporate feel (like Figma, Vercel, or Stripe landing pages)
- Inspired by professional Webflow designs: smooth interactions, polished micro-animations, premium spacing
- No pink, no purple - use professional color palette
- Minimalist, clean design with plenty of whitespace
- Premium typography and spacing
- Dark mode with strategic accent colors
- Professional photography style
- Zero AI-ish vibes - feels hand-crafted
- Design reference: https://webflow.com/made-in-webflow/website/zair-figma-to-webflow (clean layout, smooth scrolling, polished interactions)

COLOR PALETTE:
- Primary: Pure black (#0a0a0a) or Deep black (#1a1a1a)
- Secondary: Charcoal (#2a2a2a)
- Accent: Rich gold (#d4af37) or Dark gold (#b8860b)
- Text: Off-white/Cream (#f5f5f5)
- Background: Black (#0a0a0a)
- Borders: Gold accent (#d4af37)
- Hover/Active: Gold glow (#daa520)

TYPOGRAPHY:
- Headlines: Clean, bold sans-serif (like Inter, Poppins)
- Body: Readable sans-serif with good line height
- Font weights: 600 for leaders, 400 for body, 700 for CTAs

---

## PAGE STRUCTURE (TAB-BASED NAVIGATION):

The landing page should have a **primary navigation with tabs**. Users click tabs to see different sections (not scrolling through everything).

### TAB NAVIGATION:
- **Tab 1: Home** (Hero + Problem + CTA)
- **Tab 2: Buildlabs** (What you'll build + Timeline + Pricing)
- **Tab 3: Tools** (Animated AI tools carousel)
- **Tab 4: About** (Team section + credentials)
- **Tab 5: FAQ** (Common questions)
- **Tab 6: Contact** (Get in touch form + email)

Each tab should have smooth fade-in animation when clicked. Active tab should have teal underline indicator.

---

## DETAILED TAB CONTENT:

### TAB 1: HOME

**Navigation Bar (Fixed at top):**
- Logo: "Circle13" in clean sans-serif
- Tab buttons: Home | Buildlabs | Tools | About | FAQ | Contact
- Active tab: Underlined in gold
- Mobile: Hamburger menu
- CTA: "Register Now" button (gold)

**Hero Section**
- Headline: "Learn Real AI. Build Real Systems."
- Subheading: "2-hour hands-on Buildlabs for engineers who want to ship AI products"
- Description: 1-2 sentences about what happens in a Buildlab (practical, no BS)
- CTA Button 1: "View Upcoming Buildlabs" (primary)
- CTA Button 2: "See What You'll Build" (secondary)
- Hero Image: Professional photo of Buildlab in progress (team working together, diverse group, real code on screen)
- Background: Subtle gradient (charcoal to dark slate), no moving elements
- Layout: Split design (text left, image right on desktop)

### 3. PROBLEM SECTION
- Headline: "AI tools are everywhere. But knowing how to use them?"
- 3-column grid:
  1. Icon: 📚 "Lots of tutorials" → "Most stop at theory"
  2. Icon: 🎯 "Build fast" → "But how to actually ship?"
  3. Icon: 💼 "Want skills" → "None of the bootcamps teach current AI"
- Tone: Honest, relatable, not preachy

**CTA Section (Bottom of Home tab):**
- Headline: "Ready to learn? Next Buildlab starts March 29."
- Countdown timer: "Registrations close in [X hours]"
- 2 buttons side-by-side:
  - Primary: "Register Now"
  - Secondary: "View All Buildlabs" → Goes to Buildlabs tab
- Copy: "No credit card needed. Seats limited. Reserve yours now."

---

### TAB 2: BUILDLABS

**What You'll Build (4 Buildlab Tracks):**
  
  **Track A: AI Tools & Automations**
  - Image: Dashboard screenshot or tool interface
  - Description: Learn the AI stack. Build your first automation.
  - What you build: A working bot + automation blueprint
  - Icon: ⚙️
  
  **Track B: Prompt Engineering**
  - Image: Code editor showing prompts
  - Description: Master prompt frameworks that actually work
  - What you build: 5+ reusable prompt templates, personal vault
  - Icon: 🎯
  
  **Track C: AI Automation Lab**
  - Image: n8n workflow screenshot
  - Description: Wire AI into your actual workflows
  - What you build: End-to-end automation pipeline
  - Icon: 🔗
  
  **Track D: Idea to MVP**
  - Image: Before/after product mockup
  - Description: Take your idea from concept to working MVP
  - What you build: Demo-ready AI product
  - Icon: 🚀

- Cards: Clean borders, hover effect (slight lift), no shadows
- Each card: Icon + title + description + "Learn more" link

**How It Works (Timeline):**
- Headline: "The 2-Hour Experience"
- 4-step horizontal timeline:
  1. Icon: 🎓 "Learn" (15 min) → "Understand the foundations"
  2. Icon: 🛠️ "Build" (70 min) → "Get your hands dirty with real code"
  3. Icon: 🎬 "Demo" (20 min) → "See what you built, share it"
  4. Icon: ⚡ "Next Steps" (15 min) → "We help you ship it"
- Connected with a line, icons at top
- Professional, minimal design

**Testimonials (Social Proof):**
- Headline: "Engineers are shipping with Circle13"
- 3-4 testimonial cards:
  - Name, role, company
  - Quote: Short, specific (1-2 sentences max)
  - Photo: Real people, professional headshots
  - No stars, no BS - just real feedback

**Pricing Table:**
- Simple, clean pricing section
- 3 tiers:
  1. **Early Bird** - ₹399 | "First 24-48 hours" | ✓ Buildlab | ✓ Recording | ✓ Resources
  2. **Standard** - ₹799 | "Regular price" | ✓ Buildlab | ✓ Recording | ✓ Prompt Vault | ✓ Templates
  3. **Builder Bundle** - ₹1,499 | "Go all-in" | ✓ Everything | ✓ 1:1 Audit | ✓ Community Access | ✓ Next Buildlab free

- Highlight "Standard" as most popular
- All include: Recording, Slack channel access, Buildlab materials
- Clean, no colors - just teal accent for highlights
- CTA: "Register" button for each tier

---

### TAB 3: TOOLS

**Animated AI Tools Carousel:**
- Section title: "The AI Stack We Teach"
- Display the AI ecosystem tools in an animated rotating carousel
- Tools to showcase (with logos):
  1. OpenAI (ChatGPT/GPT-4)
  2. Anthropic (Claude)
  3. Mistral AI
  4. Hugging Face
  5. Google AI Studio
  6. n8n (automation)
  7. Make (automation)
  8. Zapier
  9. Antigravity
  10. Notion
  11. LangChain
  12. LlamaIndex
  13. Vercel (deployment)
  14. Railway
  15. Netlify
  16. Supabase (database)
  17. Firebase
  18. MongoDB
  19. Pinecone
  20. Figma (design)
  21. Stripe (payments)
  22. Razorpay
  23. Twilio
  24. Ollama
  25. AWS

**Carousel Features:**
- Infinite rotating carousel with actual brand logos
- Speed: ~20-30 seconds per full rotation
- Logo size: ~80-100px each
- Spacing: 30-40px between logos
- On hover: Logo zooms to 1.1x, shows tooltip with tool name + brief description
- Smooth glow effect on hover (gold glow)
- Responsive: Adjusts for mobile (smaller logos)
- Animation: Smooth continuous rotation, no pause, 0.3s hover transition

---

### TAB 4: ABOUT
- Section headline: "Built by engineers, for engineers"
- Grid layout (2 people):

  **Person 1: Akhil Vipin Nair (CTO)**
  - Large professional headshot (clean, well-lit)
  - Title: "Akhil Vipin Nair, CTO"
  - Bio: 1-2 sentences about background + vision (e.g., "2+ years building AI systems. Believes everyone should learn to ship AI products.")
  - Social icons:
    - LinkedIn: https://www.linkedin.com/in/akhil-vipin-nair-a5692635b/
    - (Icon: LinkedIn logo in gold)
  
  **Person 2: N Bharath (CEO)**
  - Large professional headshot (same style as above)
  - Title: "N Bharath, CEO"
  - Bio: 1-2 sentences (e.g., "2+ years starting companies. Now building the best AI education for technical people.")
  - Social icons:
    - LinkedIn: https://www.linkedin.com/in/n-bharath-2b86311b9/
    - Company page: https://www.linkedin.com/company/circle13ai/
    - (Icons: LinkedIn + Globe icon in gold)

- Additional company social:
  - Instagram: https://www.instagram.com/circle13.signal/
  - Icon: Instagram logo in gold
  - Below photos with link "Follow us for updates"

- Background: Subtle texture or gradient (nothing busy)
- No badges, no fake metrics - just authentic team photos and links

---

### TAB 5: FAQ
- Headline: "Questions? We got you."
- 8-10 common questions:
  1. "What's the difference between your tracks?"
  2. "I'm a beginner, is this for me?"
  3. "Will I get a recording?"
  4. "What if I can't attend live?"
  5. "Can I register on the day?"
  6. "What should I prepare?"
  7. "Is there a refund policy?"
  8. "What about job placement?"
  9. "Can companies sponsor team attendance?"
  10. "What's included in Builder Bundle?"

- Style: Accordion (expand/collapse), clean design
- Answers: 2-3 sentences max, direct and helpful

---

### TAB 6: CONTACT

**Contact Form & Information:**
- Headline: "Get in Touch"
- Contact form with fields:
  - Name (text input)
  - Email (email input)
  - Subject (dropdown or text)
  - Message (textarea)
  - Submit button (teal)
- Confirmation message on submit

**Direct Contact:**
- Email: signal.circle13@gmail.com (clickable mailto link)
- Social links:
  - LinkedIn company: https://www.linkedin.com/company/circle13ai/
  - Instagram: https://www.instagram.com/circle13.signal/

---

### FOOTER (Fixed at bottom across all tabs)
- Company info:
  - Logo
  - "Building the best AI education for technical people."
  - Email contact: signal.circle13@gmail.com (clickable mailto link)
  - Socials: LinkedIn, Instagram (icons + links)
    - LinkedIn company: https://www.linkedin.com/company/circle13ai/
    - Instagram: https://www.instagram.com/circle13.signal/

- Links column 1: Home, About, Buildlabs, FAQ, Contact
- Links column 2: Terms, Privacy, Refund Policy, Contact us
- Newsletter signup: "Stay updated" email input (optional)
- Copyright: "© 2026 Circle13. All rights reserved."

---

## DESIGN REQUIREMENTS:

**Colors to use:**
- Primary dark: #0a0a0a (pure black backgrounds)
- Secondary: #2a2a2a (charcoal for cards/sections)
- Accent: #d4af37 (rich gold - buttons, highlights, active states)
- Text: #f5f5f5 (off-white/cream)
- Muted: #b0b0b0 (subtle gray text)
- Borders: #d4af37 (gold for premium feel)
- Hover/Glow: #daa520 (darker gold for hover states)

**No colors to use:**
- Pink
- Purple
- Red
- Bright colors
- Anything "playful" - keep it professional

**Icons (use these services):**
- Icons: Feather Icons or Heroicons (clean, professional)
- Social: Use official brand icons (LinkedIn, Instagram)
- Team: icons in top-right (LinkedIn icon, Instagram icon)

**Typography:**
- Headlines: 42-64px, bold (700), line-height 1.2
- Subheadings: 24-32px, semi-bold (600)
- Body: 16-18px, regular (400), line-height 1.6
- Labels/CTA: 14-16px, semi-bold (600)

**Spacing & Layout:**
- Section padding: 80-120px top/bottom
- Container max-width: 1200px
- Card spacing: 24-32px gap
- Button padding: 12-16px vertical, 24-32px horizontal

**Images:**
1. Hero: Professional Buildlab photo (real people, coding, diverse)
2. Track A: Dashboard/tool interface
3. Track B: Code editor with prompts
4. Track C: Workflow screenshot
5. Track D: Product mockup before/after
6. Akhil: Professional headshot (aligned, clean background)
7. Bharath: Professional headshot (same style)

**Photography Style:**
- Clean lighting
- Solid backgrounds (no busy patterns)
- Real, authentic (not stock photo vibes)
- Professional but approachable
- High contrast, good color grading

**Animations (minimal but polished - Webflow style):**
- Buttons: Smooth hover effect (background color transition 0.3s, subtle scale 1.02x, gold glow shadow)
- Cards: Hover effect (smooth border color change to gold, slight shadow increase, no jarring lifts)
- Scroll: Fade-in on section visibility (smooth 0.6s fade as sections enter viewport)
- Accordion: Smooth expand/collapse (300ms cubic-bezier easing)
- Links: Underline animation on hover (smooth slide from left to right)
- No bouncing, no floating, no spinning - just professional smooth transitions
- All animations should feel like Webflow quality: polished, purposeful, never distracting

**Responsive Design:**
- Mobile: Single column, touch-friendly buttons, large text
- Tablet: 2 columns for cards, stacked about section
- Desktop: Full layout, 3-4 columns where appropriate

---

## OUTPUT SPECIFICATIONS:

- Framework: React + Vite
- Styling: Tailwind CSS
- Icons: Heroicons or Feather Icons
- No external animation library (use Tailwind transitions)
- Clean, semantic HTML
- Mobile-first responsive design
- Fast performance (lighthouse 90+)
- Accessibility: WCAG AA compliant, good contrast, proper headings

---

## TONE & COPY:

- Professional but human
- No sales-y language ("Transform your career", "Join thousands", etc.)
- Direct and honest ("Yes, we teach current AI. Yes, you'll build real things.")
- Technical but accessible
- Confident, not arrogant
- Action-oriented CTAs ("Register Now", "Learn More", not "Discover" or "Explore")

---

## THAT'S IT.

Build a clean, premium landing page that looks like it was built by a serious company. The kind that feels professional on the first visit. No fluff, no over-design, just good content + good design.

Make it feel like Vercel, Figma, or Stripe - not like an online course or bootcamp.
```

---

## Icons You'll Need

**Font Awesome or Heroicons:**
- ⚙️ Cog (for automation)
- 📚 Book (for learning)
- 🎯 Target (for prompts)
- 🔗 Link (for integration)
- 🚀 Rocket (for MVP)
- 🎓 Graduation cap (for education)
- 🛠️ Wrench (for building)
- 🎬 Film (for demo)
- ⚡ Lightning (for next steps)
- 📞 Phone (for contact)
- 💼 Briefcase (for professional)

**Social Icons:**
- LinkedIn logo (use official icon)
- Instagram logo (use official icon)
- Globe/link icon (optional)

---

## That's all you need!

This prompt is ready for:
- **Stitch** (UI gen tool)
- **Claude** with vision (paste this + upload your team photos)
- **Google AI** / **Gemini**
- Any modern LLM

Just paste, add your team photos, and you'll get a professional landing page.

---

## What Users Learn — Complete List

### **Automation Workflows** (New - in every track)
- **n8n workflow blueprints** (JSON ready to deploy)
- **Pre-built automation patterns:**
  * Email workflows (triggered, scheduled, conditional)
  * WhatsApp bot automation
  * Slack integration workflows
  * Data processing pipelines
  * Webhook triggers & webhook responses
  * Scheduled/cron triggers
  * Multi-step conditional logic
  * Database connections & data fetching
- **Copy-paste ready:**
  * Register → Welcome email workflow
  * Buildlab reminder workflows (T-24h, T-1h)
  * Payment webhook handling
  * Lead scoring workflows
  * Customer support automation
- **Tools covered:** n8n, Make, Zapier patterns (transferable)

### **Emerging AI Technologies** (New - updated regularly)
**Core LLMs:**
- Claude 4 & Sonnet capabilities
- Mistral 7B/MoE (open-source option)
- Llama 3 (Meta's open model)
- GPT-4 Turbo (OpenAI)
- Best use cases for each model

**Advanced Techniques:**
- Function calling & tool use patterns
- RAG (Retrieval Augmented Generation) systems
- Agent loops & autonomous decision-making
- Chain-of-thought prompting at scale
- Fine-tuning vs. prompt optimization trade-offs
- Vector embeddings & semantic search

**Infrastructure:**
- Vector databases (Pinecone, Supabase pgvector, Weaviate)
- LLM APIs (HuggingFace, Together AI, Groq)
- Cost optimization & rate limiting
- Streaming responses & real-time systems
- Context window management (4K → 200K tokens)

**Multimodal AI:**
- Vision models (Claude vision, GPT-4 Vision)
- Getting embeddings from images
- Audio transcription & understanding
- Video frame analysis
- Text + image + audio combined systems

**Real-World Patterns:**
- Building chatbots that don't hallucinate
- Fact-checking AI systems
- Building AI APIs for products
- Performance monitoring & logging
- A/B testing AI outputs
- Cost tracking per user/feature

### **Before Buildlab - What They Bring**
- Laptop (any OS)
- Discord/Slack account (community)
- GitHub account (optional, for code examples)

### **After Buildlab - What They Have**
- Working automation workflows (n8n JSON exports)
- AI tech stack guide (what to use when)
- Prompt templates (industry-specific)
- Resource links (APIs, tools, docs)
- 48-hour Buildlab recording
- Slack channel access (community)
- Prompt vault (if purchased)

---

# Professional Banner Prompt

**Use this prompt to generate a professional banner featuring Akhil & Bharath:**

```
Create a professional, premium banner image for Circle13 Build Lab founders.

SPECIFICATIONS:

1. LAYOUT:
   - Dimensions: 1200x400px (16:9 aspect ratio)
   - Split design: 60% content left, 40% photos right
   - Professional, corporate feel

2. LEFT SIDE (Text Content):
   - Headline: "Built by Engineers. For Engineers."
   - Subheading: "Learn AI from people who actually ship it."
   - 2-3 credibility points:
     * "Akhil Vipin Nair (CTO) — 2+ years building AI systems at scale"
     * "N Bharath (CEO) — 2+ years founding & scaling tech companies"
     * "Teaching what actually works in production"
   - Small label: "Circle13 Founders"
   - All text on dark background

3. RIGHT SIDE (Team Photos):
   - Two professional headshots displayed side by side
   - Left photo: Akhil Vipin Nair
   - Right photo: N Bharath
   - Format: Circular photo frames (professional portraits)
   - Style: Clean, well-lit, studio lighting
   - Consistent pose & framing between both photos
   - Subtle teal border around each photo circle (3-4px)
   - Names printed below each photo in small text
   - Titles optional (CTO / CEO)

4. COLOR SCHEME:
   - Background: Dark slate gradient (#0f172a → #1a202c)
   - Text: Off-white (#f7fafc)
   - Photo borders: Teal/emerald (#059669)
   - Accent highlights: Subtle teal
   - No pink, no purple

5. TYPOGRAPHY:
   - Headline: 32-40px, bold (700)
   - Subheading: 18-22px, regular (400)
   - Body text: 14-16px, regular (400)
   - Names under photos: 12px, semi-bold (600)
   - Font: Clean sans-serif (Inter, Poppins, or equivalent)

6. STYLING & POLISH:
   - Headshot frames: Round (circle) with 3-4px teal border
   - No effects or filters on photos (keep authentic)
   - High contrast for readability
   - Generous spacing & padding
   - Professional, not overdone
   - Subtle spacing between the two photos

7. TONE & FEEL:
   - Authoritative yet approachable
   - "These people know AI"
   - Corporate but human
   - Confident without arrogance
   - Like a Stripe, Figma, or Vercel team photo

8. OUTPUT:
   - File format: PNG (high quality)
   - Size: ~400-600KB (optimized for web)
   - Resolution: 1200x400px minimum
   - Responsive: Can scale up to 2400x800px without loss of quality
   - Ready for: Website hero, email headers, social media, presentations

NOTES:
- Both Akhil and Bharath should look equally prominent
- Professional headshots (no casual/selfie photos)
- Consistent styling between both photos
- Text should be readable at 50% scale
- Make it feel premium and trustworthy at first glance
```

---

## How to Generate This Banner

**Option 1: Use Claude with Vision**
1. Take professional headshots of Akhil and Bharath
2. Paste the prompt into Claude.ai
3. Upload both photos
4. Claude will describe the exact design layout

**Option 2: Use Stitch/Figma**
1. Paste this prompt into your design tool
2. Add both photos
3. Arrange in circular frames with teal borders
4. Use the color palette provided

**Option 3: Use Online Banner Maker (Canva)**
1. Create 1200x400px design
2. Add background: Dark slate gradient
3. Insert both headshots in circles
4. Add text on left side
5. Download as PNG

**Option 4: Use AI Image Generator with Text Placement**
1. Describe both photos
2. Paste prompt
3. Generate and download

---

## Banner Use Cases

- ✅ Landing page hero section (right below navigation)
- ✅ Buildlab confirmation emails (header image)
- ✅ LinkedIn posts about the Buildlab
- ✅ Instagram story templates
- ✅ PDF Buildlab materials (cover page)
- ✅ YouTube thumbnail credits
- ✅ Twitter banner
- ✅ Slack workspace icon/header
- ✅ Pitch deck opening slide

This establishes immediate credibility and shows real founders behind Circle13.

