# HELLO LIAR - Product Requirements Document (PRD)

**Version:** 2.0 (Resonance Model)  
**Date:** July 2026  
**Platform:** Next.js 16 + Supabase + Tailwind CSS v4  
**Target:** Gemini Pro AI Implementation  
**Language:** Bilingual (Indonesian / English)  

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Core Concept & Vision](#core-concept--vision)
3. [User Personas & Flows](#user-personas--flows)
4. [Feature Specifications](#feature-specifications)
5. [Database Schema](#database-schema)
6. [Workflow Diagrams](#workflow-diagrams)
7. [UI/UX Specifications](#uiux-specifications)
8. [Technical Architecture](#technical-architecture)
9. [Implementation Roadmap](#implementation-roadmap)

---

## 🎯 PROJECT OVERVIEW

### What is Hello Liar?

**Hello Liar** is an interactive web platform where anonymous users submit personal lies/deeplies. Community members validate stories through resonance ("I FEEL IT"), and stories reaching engagement thresholds are illustrated by the creator and shared across Instagram & web platforms.

### Goal

Create a viral loop that:
- Validates emotional truth in personal stories
- Builds community around shared deeplies
- Generates illustration content for creator's portfolio
- Enables democratized sharing (anyone can repost)

### Success Metrics

- Resonance count (primary engagement)
- Illustration frequency (content output)
- Repost rate (viral coefficient)
- Community growth (new submitters)

---

## 🧠 CORE CONCEPT & VISION

### Problem Statement

Users submit anonymous stories but have no incentive or feedback loop. "Destruction" mechanic doesn't serve the creator's illustration goal.

### Solution

**Resonance-Based Curation Model:**
- Users click "**I FEEL IT**" when story resonates
- High resonance (25+ votes) signals illustration worthiness
- Illustrated stories + templates enable sharing
- Anyone can repost to Instagram Stories (democratized)
- Creates viral network effect

### Key Principles

1. **Authenticity Over Conflict**: Resonance > Destruction (validate, don't judge)
2. **Anonymous Contribution**: Submit without credit concerns
3. **Shared Ownership**: Anyone can amplify stories
4. **Visual Storytelling**: Illustrations → Instagram → Viral Loop
5. **Community Curation**: Engagement = Signal for creator

---

## 👥 USER PERSONAS & FLOWS

### Persona 1: The Confessor (Submitter)

**Goal:** Share a personal lie/deeplie anonymously  
**Motivation:** Cathartic, find others like them, see story illustrated  
**Flow:**
```
1. Visit /write page
2. Type anonymous confession (10-500 chars)
3. Click "Release"
4. See confirmation → Redirected to /feed
5. Later: See story appear in feed with resonance count
6. (Optional) See own story illustrated in gallery
```

### Persona 2: The Resonator (Engager)

**Goal:** Validate stories that resonate with them  
**Motivation:** "I also felt this", build community, share authenticity  
**Flow:**
```
1. Browse /feed (home page)
2. Read story
3. Click "❤️ I FEEL IT" if resonant
4. Resonance count increments
5. (Optional) Repost to their Instagram Story
6. Optionally click "✗ Doubt" if skeptical
```

### Persona 3: The Amplifier (Resharer)

**Goal:** Share stories to their own social media  
**Motivation:** Content they relate to, build their own audience, spread message  
**Flow:**
```
1. Read story in /feed or /illustrated
2. Click "Share to IG Story" button
3. Copy pre-formatted template (with illustration)
4. Paste to their IG Story
5. Original submitter sees their story spread organically
```

### Persona 4: The Creator (Illustrator - You)

**Goal:** Curate and illustrate stories  
**Motivation:** Portfolio building, community engagement, content creation  
**Flow:**
```
1. Monitor /dashboard or /pending (stories near 25 resonances)
2. Select story to illustrate
3. Create illustration
4. Upload illustration to /illustrated page
5. Link story + illustration
6. Auto-post illustration to Instagram
7. Monitor resonance growth on illustrated piece
```

---

## ⚙️ FEATURE SPECIFICATIONS

### Feature 1: Story Submission

**Page:** `/write` (Client: WritePage.tsx)

**Requirements:**
- Anonymous submission (no identity tracking)
- Textarea: 10-500 character limit
- Real-time character count display
- Bilingual placeholders
- Submit button validation
- Success confirmation modal
- Redirect to /feed after submission

**Form Fields:**
```
Textarea {
  placeholder: "Cerita bohong apa yang paling mendalam...?" (ID)
  minLength: 10
  maxLength: 500
  autoFocus: true
  required: true
}

Button {
  label: "Release" (EN) / "Lepaskan" (ID)
  disabled: if empty or < 10 chars
  loading state: "..."
}
```

**Database Action:**
```typescript
submitLie(content_id, content_en) 
→ Insert into lies table
→ Initialize: resonate_count = 0, doubt_count = 0, illustrated = false
→ Revalidate /feed cache
```

---

### Feature 2: Feed & Story Discovery

**Page:** `/` (home page, Client: page.tsx)

**Requirements:**
- Display all stories in reverse chronological order
- Show story text + engagement metrics
- Show story status (pending illustration vs illustrated)
- Clickable cards → Link to /read/[id]
- "No stories yet" state with CTA to /write

**Story Card Display:**
```
┌────────────────────────────────────┐
│ Nᵒ 01                              │
│ "I've been lying about..."         │
│                                    │
│ ❤️ 27 I FEEL IT  ✗ 2 DOUBT         │
│ 🎨 ILLUSTRATED                     │
│ Posted: 3 days ago                 │
└────────────────────────────────────┘
```

**Sorting Options:**
- Recent (default)
- Most Resonance
- Most Doubt
- Most Likely to Illustrate (25+ pending)

**Database Query:**
```typescript
SELECT * FROM lies 
WHERE illustrated = false 
ORDER BY created_at DESC
LIMIT 20 (with pagination)
```

---

### Feature 3: Story Reading & Resonance/Doubt Engagement

**Page:** `/read/[id]` (Client: StoryReader.tsx)

**Requirements:**
- Display full story text
- Show engagement counts
- Primary button: "❤️ I FEEL IT"
- Secondary button: "✗ Doubt"
- Share buttons: "Share to IG Story", "Copy Link"
- Illustration placeholder (if not yet illustrated)
- Illustration display (if already illustrated)

**Button Specifications:**

**"I FEEL IT" Button:**
```
- Label: "Saya Rasakan Ini" (ID) / "I FEEL IT" (EN)
- Color: living-coral (on hover)
- Disabled after 1 click per user (localStorage check)
- Shows count: (127)
- Cooldown: 1 second between clicks
- Increments resonate_count in DB
```

**"Doubt" Button:**
```
- Label: "Ragu" (ID) / "Doubt" (EN)
- Color: gray (secondary)
- Disabled after 1 click per user
- Shows count: (3)
- Increments doubt_count in DB
- Less prominent than I FEEL IT
```

**Share Buttons:**
```
[Share to IG Story]  → Copy formatted template to clipboard
[Copy Link]          → Copy shareable URL
[More]              → QR Code, Direct Share (future)
```

**Layout (Two Column):**
```
LEFT COLUMN (Text + Buttons):
- Story text (serif font, large)
- Engagement metrics
- ❤️ I FEEL IT button
- ✗ Doubt button
- Share options

RIGHT COLUMN (Illustration):
- If illustrated: Display illustration image
- If not illustrated: Placeholder box with "Ilustrasi" text
```

**Database Actions:**
```typescript
addResonate(id) → Increment resonate_count
addDoubt(id) → Increment doubt_count
trackEngagement(id, user_id, type) → Optional analytics
```

---

### Feature 4: Illustration Gallery

**Page:** `/illustrated` or `/gallery` (New page)

**Requirements:**
- Display only stories that have been illustrated
- Show illustration + original story text
- Display resonance count (cumulative)
- Show date illustrated
- Share buttons for each piece
- Filter/sort options

**Card Display (Gallery Grid - 2-3 columns):**
```
┌──────────────────────────┐
│   [ILLUSTRATION IMAGE]   │
│   (800x800 placeholder)  │
│                          │
│ "Story text goes here"   │
│                          │
│ ❤️ 127 I FEEL IT        │
│ ✗ 3 Doubt              │
│                          │
│ [Share to IG]  [Copy]    │
│ Illustrated: 2 days ago  │
└──────────────────────────┘
```

**Database Query:**
```typescript
SELECT * FROM lies 
WHERE illustrated = true 
AND illustration_url IS NOT NULL
ORDER BY illustration_created_at DESC
```

---

### Feature 5: Share to Instagram Story Template

**Trigger:** User clicks "Share to IG Story" button

**What Happens:**
1. Copy-to-clipboard modal appears
2. Pre-formatted text ready to paste to IG Story caption
3. User copies → Opens Instagram → Pastes → Posts Story

**Template Format:**
```
[Illustration Image Link or QR]

"[STORY TEXT]"

— Hello Liar
helloliar.web.site/read/[id]

[Living Coral Color Branding]
```

**Example (Indonesian):**
```
"Aku sudah bohong ke sahabat terbaikku selama 5 tahun"

— Hello Liar
helloliar.web.site/read/xyz123

🌐 Submit your deeplie at helloliar.web
```

**UI for Share Modal:**
```
┌─────────────────────────────────┐
│ Share to Instagram Story        │
├─────────────────────────────────┤
│ [Copy to Clipboard]             │
│ [QR Code]                       │
│                                 │
│ ─────────────────────────────   │
│ Preview:                        │
│ "Story text"                    │
│ — Hello Liar                    │
│ helloliar.web.site/read/abc123  │
│ ─────────────────────────────   │
│                                 │
│ [Close]                         │
└─────────────────────────────────┘
```

---

### Feature 6: Creator Dashboard (Admin View)

**Page:** `/admin/dashboard` (Creator only)

**Requirements:**
- Monitor stories approaching 25 resonances
- Categorize: Pending Illustration vs Illustrated
- Sort by resonance, doubt, date
- Quick action: "Illustrate This" → Upload illustration

**Dashboard Sections:**

**Section A: Pending Illustrations**
```
Shows stories with:
- 20-24 resonances (close to threshold)
- 25+ resonances (ready to illustrate)
- Sorted by resonate_count DESC

Columns:
[Story] [Resonance] [Doubt] [Status] [Action]

Action Buttons:
[Illustrate] → Upload image
[Preview] → View story detail
[Dismiss] → Mark as "skip for now"
```

**Section B: Illustrated (Published)**
```
Shows stories with illustration_url populated

Columns:
[Illustration Thumb] [Story] [Resonance] [Posted Date] [IG Link]

Actions:
[View] [Repost to IG] [Analytics] [Delete]
```

**Section C: Metrics**
```
- Total submissions this month
- Stories illustrated this month
- Avg resonance per story
- Top resonance story
- Doubt vs I FEEL IT ratio
```

---

## 📊 DATABASE SCHEMA

### Table: `lies`

```sql
CREATE TABLE lies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  content_id TEXT NOT NULL,                    -- Indonesian text
  content_en TEXT NOT NULL,                    -- English text
  
  -- Engagement
  resonate_count INT DEFAULT 0,                -- NEW: Primary metric
  doubt_count INT DEFAULT 0,                   -- Secondary metric
  
  -- Illustration Status
  illustrated BOOLEAN DEFAULT FALSE,           -- Has illustration?
  illustration_url TEXT,                       -- URL to illustration image
  illustration_created_at TIMESTAMP,           -- When illustrated
  
  -- Metadata
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  
  -- Analytics (Optional)
  total_shares INT DEFAULT 0,
  instagram_shares INT DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_illustrated ON lies(illustrated);
CREATE INDEX idx_resonate_count ON lies(resonate_count DESC);
CREATE INDEX idx_created_at ON lies(created_at DESC);
```

### Table: `engagement_log` (Optional - Analytics)

```sql
CREATE TABLE engagement_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  lie_id UUID REFERENCES lies(id),
  engagement_type VARCHAR(20),                 -- 'resonate', 'doubt', 'share'
  
  user_ip_hash VARCHAR(64),                    -- Anonymous tracking
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_lie_engagement ON engagement_log(lie_id);
```

### Supabase RPC Functions

```sql
-- Increment resonate count
CREATE OR REPLACE FUNCTION increment_resonate(lie_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE lies 
  SET resonate_count = resonate_count + 1,
      updated_at = now()
  WHERE id = lie_id;
END;
$$ LANGUAGE plpgsql;

-- Increment doubt count
CREATE OR REPLACE FUNCTION increment_doubt(lie_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE lies 
  SET doubt_count = doubt_count + 1,
      updated_at = now()
  WHERE id = lie_id;
END;
$$ LANGUAGE plpgsql;

-- Mark as illustrated
CREATE OR REPLACE FUNCTION mark_illustrated(
  lie_id UUID, 
  illustration_url TEXT
)
RETURNS void AS $$
BEGIN
  UPDATE lies 
  SET illustrated = TRUE,
      illustration_url = illustration_url,
      illustration_created_at = now(),
      updated_at = now()
  WHERE id = lie_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔄 WORKFLOW DIAGRAMS

### Workflow 1: Story Submission & Resonance Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 USER SUBMISSION WORKFLOW                    │
└─────────────────────────────────────────────────────────────┘

1. SUBMISSION PHASE
┌──────────────┐
│ /write page  │  User types lie (10-500 chars)
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ Click "Release" button   │  Validate length
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ submitLie() server action            │  Insert to DB
│ - Sanitize HTML                      │  resonate_count = 0
│ - Revalidate /feed cache             │  doubt_count = 0
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ ✅ Success Modal                     │  Show confirmation
│ "Terima kasih!"                      │
│ [Redirect to /feed]                  │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Story appears in /feed               │  Nᵒ 01 - Fresh submission
│ resonate_count: 0                    │
│ doubt_count: 0                       │
└──────────────────────────────────────┘


2. RESONANCE ENGAGEMENT PHASE
┌──────────────────────────────────────┐
│ User reads story at /read/[id]       │  View story detail
└──────┬───────────────────────────────┘
       │
       ├─────────────────────────────────────────────┐
       │                                             │
       ▼                                             ▼
┌────────────────────────┐           ┌────────────────────────┐
│ Click "I FEEL IT" ❤️   │           │ Click "Doubt" ✗        │
└──────┬─────────────────┘           └──────┬─────────────────┘
       │                                     │
       ▼                                     ▼
┌──────────────────────────────────┐ ┌──────────────────────────────┐
│ Check localStorage               │ │ Check localStorage           │
│ If already clicked: disable btn  │ │ If already clicked: disable  │
└──────┬─────────────────────────────────┬──────────────────────────┘
       │                                 │
       ▼                                 ▼
┌──────────────────────────────────────────────────────────┐
│ Call addResonate(id) or addDoubt(id) RPC function       │
│ Increment resonate_count or doubt_count                 │
│ Save to localStorage: ['resonated_lies'] or ['doubted'] │
└──────┬─────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Optimistic UI Update             │  resonate_count: 26
│ Button disabled                  │  doubt_count: 3
│ Cooldown 1 second                │
└──────────────────────────────────┘


3. ILLUSTRATION TRIGGER PHASE (When resonate_count ≥ 25)
┌──────────────────────────────────┐
│ Story reaches 25 "I FEEL IT"     │  Trigger: automated check or manual
└──────┬─────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│ Notification to Creator (You)                        │
│ "Story #5 ready for illustration (25 resonances)"   │
│ [Link to /admin/dashboard or /read/[id]]            │
└──────┬─────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Creator illustrates story        │  Manual process (your art)
└──────┬─────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ Upload illustration via /admin/upload    │  illustration_url = URL
│ illustration_created_at = now()          │  illustrated = true
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ Story moves to /illustrated gallery      │
│ Original /read/[id] shows illustration   │
│ Share buttons enabled on illustration    │
└──────────────────────────────────────────┘


4. SHARING & VIRAL LOOP PHASE
┌──────────────────────────────────┐
│ User clicks "Share to IG Story"  │  From /illustrated or /read
└──────┬─────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ Copy-to-Clipboard Modal appears          │
│ Pre-formatted share template ready       │
│ [Copy] button copies to clipboard        │
└──────┬──────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ User opens Instagram → Compose Story             │
│ Pastes template text + optionally image          │
│ Posts to their IG Story                          │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ Story shared to User's followers (Viral Loop)   │
│ Followers see story + link to hello-liar.web    │
│ New users discover platform & submit stories    │
└──────────────────────────────────────────────────┘
```

---

### Workflow 2: Creator Illustration Dashboard

```
┌────────────────────────────────────────────────────────┐
│          CREATOR ILLUSTRATION WORKFLOW                │
└────────────────────────────────────────────────────────┘

1. MONITOR PHASE
┌──────────────────────────────────────┐
│ Creator visits /admin/dashboard      │  Daily check
└──────┬───────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Dashboard shows:                                       │
│ - Pending: Stories 20-24 resonances                   │
│ - Ready: Stories 25+ resonances (sorted by count)     │
│ - Published: Illustrated stories with links           │
└──────┬────────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Creator selects story to illustrate                    │
│ [View] [Illustrate] [Skip] buttons                    │
└──────┬────────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Creator reads full story at /read/[id]                │
│ Reviews resonance count & doubt ratio                 │
│ Determines illustration worthiness                    │
└──────┬────────────────────────────────────────────────┘
       │
       ▼
┌───────────────────────────────────────────────────────┐
│ Creator creates illustration (external tools)         │
│ - Procreate, Photoshop, Figma, etc.                 │
│ - Saves at 800x800px (living coral theme)            │
└──────┬──────────────────────────────────────────────┘
       │
       ▼
┌───────────────────────────────────────────────────────┐
│ Creator uploads via /admin/upload                     │
│ - Select story ID                                    │
│ - Upload image file                                  │
│ - Auto-generate Instagram post caption               │
└──────┬──────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────┐
│ Backend processes:                             │
│ - Store image (Supabase storage)              │
│ - Update lies.illustration_url                │
│ - Set illustrated = true                      │
│ - Update illustration_created_at              │
│ - Revalidate cache (/illustrated, /read/[id]) │
└──────┬───────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────┐
│ ✅ Success notification                        │
│ "Ilustrasi berhasil diupload!"                │
│ [View in Gallery] [Post to Instagram] [Done]  │
└──────┬───────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────┐
│ Creator shares to Instagram:                   │
│ - Post illustration to Instagram Feed or Story│
│ - Caption includes story quote + link         │
│ - Tag: #HelloLiar #Deeplie                   │
└──────┬───────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│ Story now appears in:                           │
│ - /illustrated gallery (pinned to top)          │
│ - /read/[id] (shows illustration)               │
│ - Instagram Feed/Story                          │
│ - Shareable to audience via IG Story repost    │
└─────────────────────────────────────────────────┘
```

---

### Workflow 3: Home Page Feed Sorting & Categorization

```
┌──────────────────────────────────────────────────────┐
│              HOME FEED CATEGORIZATION                │
└──────────────────────────────────────────────────────┘

VIEW: Home Feed (/ or /feed)
┌──────────────────────────────────────────────────────┐
│ Story Cards Display                                  │
├──────────────────────────────────────────────────────┤
│ Nᵒ 01  "Story text..."                              │
│ ❤️ 27 I FEEL IT  ✗ 2 DOUBT                          │
│ 🎨 ILLUSTRATED                                      │
│                                                      │
│ Nᵒ 02  "Another story..."                           │
│ ❤️ 19 I FEEL IT  ✗ 5 DOUBT                          │
│ ⏳ PENDING (will illustrate at 25+)                 │
│                                                      │
│ Nᵒ 03  "Lie about..."                               │
│ ❤️ 8 I FEEL IT  ✗ 28 DOUBT                          │
│ ⚠️ HIGH DOUBT (controversial)                       │
└──────────────────────────────────────────────────────┘

SORTING OPTIONS (Dropdowns/Tabs):
┌──────────────────────────────────────────────────────┐
│ [Recent] [Most Resonance] [Most Doubt] [Illustrated]│
└──────────────────────────────────────────────────────┘

SORT 1: Recent (DEFAULT)
ORDER BY created_at DESC
Shows newest submissions first

SORT 2: Most Resonance
ORDER BY resonate_count DESC
Top stories by community validation

SORT 3: Most Doubt
ORDER BY doubt_count DESC
Most controversial/disagreed stories

SORT 4: Illustrated Only
WHERE illustrated = true
Gallery view of completed work

SORT 5: Pending Illustration
WHERE illustrated = false AND resonate_count >= 20
Stories likely to be illustrated soon

STATUS BADGES:
┌─────────────────────────────────────────┐
│ 🎨 ILLUSTRATED                          │  Already illustrated
│ ⏳ PENDING (23/25)                      │  Approaching threshold
│ ✨ FEATURED                             │  Creator's pick
│ 🔥 TRENDING                             │  High engagement
│ ⚠️ HIGH DOUBT                           │  More doubts than resonance
└─────────────────────────────────────────┘
```

---

## 🎨 UI/UX SPECIFICATIONS

### Color Palette

```css
--living-coral: #FF6B6B (primary brand color)
--foreground: #000000 (text)
--background: #FFFFFF
--gray-100: #F5F5F5 (borders, backgrounds)
--gray-200: #ECECEC
--gray-300: #D0D0D0
--gray-400: #999999 (meta text)
```

### Typography

```css
/* Headlines */
font-family: Georgia, serif
font-size: 2.5rem - 7rem
font-weight: 700
letter-spacing: -0.02em

/* Body Text */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
font-size: 0.875rem - 1.25rem
line-height: 1.6

/* Mono (for counts, metadata) */
font-family: 'Monaco', monospace
font-size: 0.75rem
```

### Component Styles

#### Button: "I FEEL IT"
```css
background: transparent
border: 2px solid var(--foreground)
color: var(--foreground)
padding: 1rem 1.5rem
font-weight: bold
text-transform: uppercase
letter-spacing: 0.15em

hover:
  background: var(--living-coral)
  border-color: var(--living-coral)
  color: white

active (clicked):
  opacity: 0.6
  cursor: not-allowed

disabled:
  opacity: 0.3
```

#### Button: "Doubt" (Secondary)
```css
background: transparent
border: 1px solid var(--gray-300)
color: var(--gray-400)
padding: 0.75rem 1rem
font-size: smaller
opacity: 0.7

hover:
  opacity: 1
  border-color: var(--foreground)
```

#### Story Card
```css
border-bottom: 1px solid var(--gray-100)
padding: 3rem 0
transition: transform 200ms, color 200ms

hover:
  .story-text {
    transform: translateX(0.5rem)
  }
```

### Responsive Design

```css
/* Mobile (< 768px) */
font-sizes: reduced by 20%
padding: halved
column layout: 1 column (text + illustration stacked)

/* Tablet (768px - 1024px) */
font-sizes: 85% of desktop
padding: 75% of desktop
2 column layout (text left, illustration right)

/* Desktop (> 1024px) */
Full design as specified
Max-width: 1200px centered
```

---

## 🏗️ TECHNICAL ARCHITECTURE

### Tech Stack

```
Frontend:
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- next-intl (i18n)
- TypeScript

Backend:
- Supabase (PostgreSQL)
- Supabase Storage (for illustrations)
- Supabase RPC functions
- Serverless functions (Node.js runtime)

Infrastructure:
- Vercel (deployment)
- Supabase (database + auth)
- CDN (image delivery)
```

### File Structure

```
/src
  /app
    /[locale]
      /page.tsx              (Home feed)
      /write/page.tsx        (Submit page)
      /read/[id]/page.tsx    (Story detail + resonance)
      /illustrated/page.tsx  (Gallery)
      /admin/page.tsx        (Creator dashboard)
      /admin/upload.tsx      (Upload illustration)
  /components
    /StoryCard.tsx
    /StoryReader.tsx
    /RespondButton.tsx
    /ShareModal.tsx
    /IllustrationGallery.tsx
    /AdminDashboard.tsx
  /lib
    /supabase.ts
    /actions.ts
    /constants.ts
  /types
    /database.ts
```

### API Endpoints & Server Actions

```typescript
// Server Actions (lib/actions.ts)

submitLie(content_id: string, content_en: string)
→ Validate, sanitize, insert to DB
→ Return {success, id}

addResonate(lie_id: string)
→ Increment resonate_count
→ Return updated count

addDoubt(lie_id: string)
→ Increment doubt_count
→ Return updated count

markIllustrated(lie_id: string, image_url: string)
→ Set illustrated=true, illustration_url, illustration_created_at
→ Return success

uploadIllustration(lie_id: string, image_file: File)
→ Upload to Supabase Storage
→ Call markIllustrated()
→ Return success + URL
```

### Caching Strategy

```
Revalidation Triggers:

/feed (home):
- revalidatePath('/') after submitLie
- revalidatePath('/') after addResonate/addDoubt
- Cache: 60s (ISR)

/read/[id]:
- revalidatePath(`/read/[id]`) after addResonate/addDoubt
- Cache: 60s

/illustrated:
- revalidatePath('/illustrated') after markIllustrated
- Cache: 1h (stable content)

/admin:
- No caching (fresh data always)
```

---

## 📈 IMPLEMENTATION ROADMAP

### Phase 1: Database & Core Logic (Week 1)

- [ ] Update lies table schema (add resonate_count, illustrated, illustration_url, illustration_created_at)
- [ ] Create Supabase RPC functions (increment_resonate, increment_doubt, mark_illustrated)
- [ ] Update server actions (lib/actions.ts)
- [ ] Test DB interactions

**Deliverable:** Backend ready, no UI changes

---

### Phase 2: UI Updates (Week 2)

- [ ] Refactor StoryReader.tsx:
  - [ ] Replace destruction mechanic with "I FEEL IT" button
  - [ ] Keep "Doubt" as secondary
  - [ ] Add resonate count display
  - [ ] Add share buttons (Copy Link, Share to IG)
  
- [ ] Update home page card display:
  - [ ] Show resonate_count instead of doubt_count
  - [ ] Add illustration status badge (🎨 ILLUSTRATED / ⏳ PENDING)
  - [ ] Add sorting/filtering options

- [ ] Remove old CSS (burn-fade, redaction effects)

**Deliverable:** UI matches new resonance model

---

### Phase 3: Gallery & Admin Pages (Week 3)

- [ ] Create `/illustrated` gallery page
  - [ ] Grid layout (2-3 columns)
  - [ ] Display illustration + story + counts
  - [ ] Share buttons
  
- [ ] Create `/admin/dashboard` page
  - [ ] Monitor pending stories (20-24 resonances)
  - [ ] Show ready stories (25+ resonances)
  - [ ] Display published illustrations
  - [ ] Metrics summary
  
- [ ] Create `/admin/upload` form
  - [ ] Story selector dropdown
  - [ ] File upload (illustration)
  - [ ] Auto-generate social caption
  - [ ] Preview + publish

**Deliverable:** Full admin workflow functional

---

### Phase 4: Polish & Testing (Week 4)

- [ ] Share modal UI refinement
- [ ] Responsive design (mobile-first)
- [ ] Bilingual copy review (ID/EN)
- [ ] Performance testing
- [ ] User testing & feedback

**Deliverable:** Production-ready version

---

### Phase 5: Launch & Promotion (Ongoing)

- [ ] Announce redesign to Instagram followers
- [ ] Populate gallery with existing illustrations (3-5 pieces)
- [ ] Monitor engagement metrics
- [ ] Iterate based on user feedback
- [ ] Consider: notification system for stories nearing 25

---

## 📝 NOTES FOR GEMINI PRO IMPLEMENTATION

### Key Prompts for AI

1. **Database Schema Update:**
   ```
   "Update Supabase table 'lies' to add:
   - resonate_count (INT, default 0)
   - illustrated (BOOLEAN, default FALSE)
   - illustration_url (TEXT, nullable)
   - illustration_created_at (TIMESTAMP, nullable)
   
   Create RPC functions:
   - increment_resonate(lie_id UUID)
   - increment_doubt(lie_id UUID)
   - mark_illustrated(lie_id UUID, illustration_url TEXT)"
   ```

2. **UI Component Refactor:**
   ```
   "Refactor StoryReader.tsx:
   - Replace 'destruction' mechanic (burn-fade, redaction)
   - Add 'I FEEL IT' button (primary, living coral color)
   - Keep 'Doubt' button (secondary, gray)
   - Add share buttons: 'Share to IG Story', 'Copy Link'
   - Display resonate_count and doubt_count
   - Layout: 2 columns (text left, illustration right)"
   ```

3. **Gallery Page:**
   ```
   "Create new /illustrated page:
   - Grid layout (2-3 columns responsive)
   - Display only stories where illustrated = true
   - Show: [illustration image] [story text] [counts] [share buttons]
   - Sort by illustration_created_at DESC
   - Query: SELECT * FROM lies WHERE illustrated = true"
   ```

4. **Admin Dashboard:**
   ```
   "Create /admin/dashboard page:
   - Section 1: Pending (20-24 resonate count)
   - Section 2: Ready (25+ resonate count)
   - Section 3: Published (illustrated = true)
   - Quick actions: [Illustrate] [Preview] [Dismiss]
   - Metrics: Total submissions, illustrated count, avg resonance"
   ```

---

## 🎯 SUCCESS CRITERIA

- [x] User can submit stories (existing)
- [x] User can resonate ("I FEEL IT") and doubt (existing, repurposed)
- [x] Creator receives indicator when story hits 25 resonances
- [x] Gallery displays illustrated stories
- [x] Admin dashboard allows illustration upload
- [x] Share template enables Instagram Story reposting
- [x] Viral loop functional (story → illustration → share → discovery)

---

## 📞 QUESTIONS FOR CLARIFICATION

1. **Illustration Upload:** Where should illustrations be stored? Supabase Storage or external CDN?
2. **Notifications:** Should creator get email/push notifications when story hits 25 resonances?
3. **Illustration Caption:** Should caption be auto-generated or manually entered by creator?
4. **Archive Strategy:** What happens to stories after they're illustrated? Keep in feed or archive?
5. **Social Metrics:** Track Instagram reposts? Or just web-based sharing?

---

**End of PRD Document**

**Version:** 2.0  
**Last Updated:** July 2026  
**Status:** Ready for Implementation
