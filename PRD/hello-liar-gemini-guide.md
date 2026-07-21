# HELLO LIAR - GEMINI PRO IMPLEMENTATION GUIDE

**Quick Reference for AI-Assisted Development**

---

## 🎯 PROJECT SUMMARY

Convert Hello Liar from **destruction-based** engagement to **resonance-based** curation.

| Aspect | Before | After |
|--------|--------|-------|
| **Primary Action** | "I Doubt It" (destructive) | "I FEEL IT" (validating) |
| **Engagement Metric** | doubt_count | resonate_count |
| **Illustration Trigger** | N/A | 25+ resonances |
| **Gallery** | None | /illustrated page |
| **Sharing** | Limited | Full Instagram Story template |
| **Creator Workflow** | Manual | Dashboard + upload system |

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Database (FIRST)

**Task:** Update Supabase schema

```sql
-- Add columns to lies table
ALTER TABLE lies ADD COLUMN resonate_count INT DEFAULT 0;
ALTER TABLE lies ADD COLUMN illustrated BOOLEAN DEFAULT FALSE;
ALTER TABLE lies ADD COLUMN illustration_url TEXT;
ALTER TABLE lies ADD COLUMN illustration_created_at TIMESTAMP;

-- Create RPC functions
CREATE OR REPLACE FUNCTION increment_resonate(lie_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE lies SET resonate_count = resonate_count + 1 WHERE id = lie_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_doubt(lie_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE lies SET doubt_count = doubt_count + 1 WHERE id = lie_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION mark_illustrated(
  lie_id UUID, 
  illustration_url TEXT
)
RETURNS void AS $$
BEGIN
  UPDATE lies SET 
    illustrated = TRUE,
    illustration_url = illustration_url,
    illustration_created_at = now()
  WHERE id = lie_id;
END;
$$ LANGUAGE plpgsql;
```

**Gemini Prompt:**
```
"Update my Supabase PostgreSQL database for Hello Liar:
1. Add these columns to 'lies' table:
   - resonate_count (INT, default 0)
   - illustrated (BOOLEAN, default FALSE)
   - illustration_url (TEXT, nullable)
   - illustration_created_at (TIMESTAMP, nullable)

2. Create RPC functions:
   - increment_resonate(lie_id UUID)
   - increment_doubt(lie_id UUID)  
   - mark_illustrated(lie_id UUID, illustration_url TEXT)

Provide SQL script ready to run in Supabase SQL Editor."
```

---

### Phase 2: Backend Logic (server actions)

**File:** `src/lib/actions.ts`

**Changes:**
1. Keep `submitLie()` (no change needed)
2. Rename/refactor engagement functions:
   - `addDoubt()` → stays the same
   - `addResonate()` → NEW (replaces destruction logic)
3. Add `markIllustrated()` → NEW

**Gemini Prompt:**
```
"Update src/lib/actions.ts for Hello Liar:

1. Keep submitLie() as-is
2. Rename doubt increment to maintain it
3. Add new server action: addResonate(lie_id: string)
   - Calls supabase.rpc('increment_resonate', { lie_id })
   - Returns {success, error}
   - Revalidates cache

4. Add new server action: markIllustrated(lie_id: string, illustration_url: string)
   - Calls supabase.rpc('mark_illustrated', { lie_id, illustration_url })
   - Sets illustrated = true in database
   - Revalidates cache for /illustrated, /read/[id]

Use same patterns as existing addDoubt() function."
```

---

### Phase 3: UI Components

#### 3A. Update StoryReader.tsx (Main engagement page)

**Gemini Prompt:**
```
"Refactor src/components/StoryReader.tsx:

REMOVE:
- Destruction mechanic (burn-fade, redaction, 4-stage animation)
- All CSS classes: destroyed-notice, burn-fade, redacted-word, blurred-word
- getStage() function
- Stage progress bar (the 4-stage progression visual)

ADD:
- 'I FEEL IT' button (primary, living coral #FF6B6B)
  Display: ❤️ I FEEL IT (127)
  On click: addResonate(lie_id)
  Style: white background, living coral border/text on hover
  
- Keep 'Doubt' button (secondary, gray)
  Display: ✗ Doubt (3)
  Style: smaller, less prominent
  
- Share buttons section:
  [Share to IG Story] [Copy Link] [More]
  
LAYOUT:
- 2 column grid: Left (text + buttons), Right (illustration or placeholder)
- On mobile: 1 column stacked
- Show resonate_count and doubt_count in metadata row

ILLUSTRATION DISPLAY:
- If illustrated = true: show illustration_url image
- If illustrated = false: show placeholder box 'Ilustrasi (800x800)'

Remove all OLD styling related to destruction effects."
```

#### 3B. Create ShareModal.tsx (New component)

**Gemini Prompt:**
```
"Create new component: src/components/ShareModal.tsx

This modal shows when user clicks 'Share to IG Story'

CONTENT:
1. Title: 'Share to Instagram Story'
2. Copy-to-clipboard text box with story text + link
3. QR code (optional, can use qrcode.react library)
4. Preview section showing what template looks like
5. Close button

TEMPLATE TEXT:
\"[STORY TEXT HERE]

— Hello Liar
helloliar.web.site/read/[storyId]

[Living coral branding]\"

STYLING:
- Modal dialog overlay
- Living coral accent color
- Responsive on mobile
- Copy button with success feedback

Make it shareable to IG Story captions."
```

#### 3C. Update home page (page.tsx)

**Gemini Prompt:**
```
"Update src/app/[locale]/page.tsx:

CHANGE story card display:

1. Replace doubt_count with resonate_count as primary metric
2. Show resonate_count prominently: ❤️ 127 I FEEL IT
3. Add status badge:
   - 🎨 ILLUSTRATED (if illustrated = true)
   - ⏳ PENDING 23/25 (if resonate_count is 20-24)
   - ✨ FEATURED (if creator marked it)
   
4. Add sorting/filter dropdown:
   Options: [Recent] [Most Resonance] [Most Doubt] [Illustrated] [Pending]
   Default: Recent

5. Display story cards:
   Nᵒ 01 | Story text | ❤️ 27 I FEEL IT | ✗ 2 Doubt | 🎨 ILLUSTRATED

6. Metadata row shows:
   Posted: 3 days ago — 27 I FEEL IT — [Badge]

Style: Keep existing editorial serif aesthetic, just swap metrics."
```

---

### Phase 4: New Pages

#### 4A. Create /illustrated gallery page

**File:** `src/app/[locale]/illustrated/page.tsx`

**Gemini Prompt:**
```
"Create new page: src/app/[locale]/illustrated/page.tsx

REQUIREMENTS:
1. Gallery grid layout (2-3 columns, responsive)
2. Display only stories where illustrated = true
3. Query: SELECT * FROM lies WHERE illustrated = true ORDER BY illustration_created_at DESC

CARD LAYOUT (2-3 column grid):
┌──────────────────────────┐
│   [ILLUSTRATION IMAGE]   │  Display illustration_url
│   (800x800)              │
├──────────────────────────┤
│ \"Story text goes here\"  │  Story content
│                          │
│ ❤️ 127 I FEEL IT        │  resonate_count
│ ✗ 3 Doubt              │  doubt_count
│                          │
│ [Share to IG]            │  Share button
│ [Copy Link]              │  Copy button
│                          │
│ Illustrated: 2 days ago  │  illustration_created_at
└──────────────────────────┘

4. Add filter/sort options:
   [Newest First] [Most Resonance] [Recently Illustrated]

5. Show empty state: 'No illustrated stories yet...'

6. Make responsive on mobile (1 column)"
```

#### 4B. Create /admin dashboard

**File:** `src/app/[locale]/admin/page.tsx`

**Gemini Prompt:**
```
"Create admin dashboard: src/app/[locale]/admin/page.tsx

THREE SECTIONS:

SECTION 1: PENDING (20-24 resonances)
┌─ Story Title
├─ Resonate count: 23/25
├─ Doubt count: 2
├─ Posted: 5 days ago
└─ [View] [Illustrate] [Skip]

SECTION 2: READY (25+ resonances)
┌─ Story Title  
├─ Resonate count: 32
├─ Doubt count: 1
├─ Posted: 2 days ago
└─ [Illustrate] [Preview] [Dismiss]

SECTION 3: PUBLISHED (illustrated = true)
┌─ [Illustration Thumbnail]
├─ Story text
├─ Resonate count: 127
├─ Illustrated: 3 days ago
└─ [View] [Repost to IG] [Delete]

METRICS SECTION:
- Total submissions this month
- Total illustrated this month
- Average resonance per story
- Doubt/Resonance ratio

Query logic:
- Pending: resonate_count BETWEEN 20 AND 24
- Ready: resonate_count >= 25 AND illustrated = false
- Published: illustrated = true

Creator-only view (requires auth)"
```

#### 4C. Create /admin/upload form

**File:** `src/app/[locale]/admin/upload/page.tsx`

**Gemini Prompt:**
```
"Create illustration upload form: src/app/[locale]/admin/upload/page.tsx

FORM FIELDS:
1. Story selector dropdown
   - Shows stories with resonate_count >= 25
   - Display as: '#5 - \"Story text preview...\" (32 resonances)'
   
2. Image upload
   - Accept: .jpg, .png, .webp
   - Max size: 5MB
   - Preview before upload
   
3. Caption generator (auto-filled, editable)
   - Pre-fills with story quote + link
   - User can edit before posting
   
4. Buttons:
   [Upload to Supabase] [Cancel] [Post to Instagram (manual)]

ON UPLOAD SUCCESS:
- Save illustration to Supabase Storage
- Call markIllustrated() server action
- Show success modal with:
  - Story + illustration preview
  - Link to /illustrated gallery
  - Button to post to Instagram

Validation:
- Story ID required
- Image file required
- File size limit"
```

---

### Phase 5: Styling & Branding

**Brand Color:**
```css
--living-coral: #FF6B6B
```

**Gemini Prompt:**
```
"Apply branding to Hello Liar components:

PRIMARY ELEMENTS:
1. 'I FEEL IT' button
   - Hover: living coral (#FF6B6B) background
   - Border: 2px solid on hover
   - Text: white on hover
   
2. Accent elements (badges, highlights):
   - High resonance count: living coral
   - Illustration badge: living coral text
   
3. Share template:
   - Use living coral as visual accent
   - Include living coral in IG Story template

4. Admin dashboard:
   - Ready section highlight: living coral border
   - Success messages: living coral text

REMOVE:
- All red/coral from destruction effects
- Reapply living coral consistently for resonance/positive actions

Keep existing serif typography and editorial aesthetic."
```

---

## 🚀 EXECUTION ORDER

**Week 1:**
1. Database schema update (migrations)
2. Server actions (`lib/actions.ts`)
3. Test DB interactions

**Week 2:**
1. Refactor StoryReader.tsx
2. Update home page
3. Create ShareModal

**Week 3:**
1. Create /illustrated gallery
2. Create /admin dashboard
3. Create /admin/upload

**Week 4:**
1. Styling & branding
2. Responsive design
3. Testing & refinement

---

## 💡 KEY GEMINI PROMPTS SUMMARY

### For Full Implementation (Give all to Gemini):

```
"You're helping me rebuild Hello Liar, a web platform where users submit anonymous lies/deeplies. 

CURRENT ISSUE: Destruction-based mechanic (stories get destroyed by doubts) is absurd.

NEW VISION: Resonance-based curation.
- Users click 'I FEEL IT' to validate stories (not destroy them)
- Stories with 25+ resonances → creator illustrates them
- Illustrated stories share-able to Instagram Stories
- Creates viral loop of community validation

TECH STACK: Next.js 16, Supabase, Tailwind CSS v4

HERE'S THE FULL PRD WITH WORKFLOWS AND SPECS: [PASTE FULL PRD]
HERE'S THE VISUAL FLOWCHARTS: [PASTE FLOWCHARTS]

HELP ME IMPLEMENT STEP BY STEP:
1. Database schema changes
2. Server actions for resonance tracking
3. UI component updates (primary: I FEEL IT button)
4. New pages (gallery, admin dashboard, upload)
5. Sharing system for IG Stories

Brand color: living coral (#FF6B6B)
Threshold: 25 resonances to trigger illustration
Current status: Ready to implement"
```

---

## 📊 TESTING CHECKLIST

- [ ] Submit story → appears in feed
- [ ] Click "I FEEL IT" → resonate_count increments
- [ ] Story reaches 25 → appears in /admin/pending
- [ ] Upload illustration → story moves to /illustrated
- [ ] Share to IG → copy-to-clipboard works
- [ ] Mobile responsive → all pages work on mobile
- [ ] Bilingual → Indonesian/English both work
- [ ] Performance → no N+1 queries

---

**Status:** Ready for Gemini Pro  
**Files Provided:** PRD + Flowcharts + This Guide  
**Delivery Format:** This document + linked PRD file
