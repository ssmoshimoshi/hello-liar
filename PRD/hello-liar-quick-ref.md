# HELLO LIAR - ONE PAGE QUICK REFERENCE

## 🎯 THE SHIFT

| What | Before | After |
|------|--------|-------|
| **Engagement** | I DOUBT IT (destructive) | ❤️ I FEEL IT (validating) |
| **Goal** | Destroy stories | Illustrate stories |
| **Metric** | doubt_count (50+ = destroyed) | resonate_count (25+ = illustrate) |
| **Outcome** | Story disappears | Story gets illustrated + shared |

---

## 🔄 THE FLOW

```
USER SUBMITS → COMMUNITY RESONATES → CREATOR ILLUSTRATES → VIRAL SHARE
   Anon        (25+ I FEEL IT)        (Upload to web)      (IG Stories)
```

---

## 📱 USER JOURNEYS

### Confessor (Writer)
1. `/write` → Type 10-500 chars → `Release` → Appears in feed

### Resonator (Engager)  
1. `/feed` → Read story → `❤️ I FEEL IT` → Count increments → [Optional] Share to IG

### Amplifier (Resharer)
1. `/illustrated` → View art → `Share to IG Story` → Copy template → Post to IG

### Creator (You)
1. `/admin/dashboard` → See stories with 25+ resonances → Choose → Create art → `/admin/upload` → Upload → Share to IG

---

## 📊 DATABASE CHANGES

```sql
ALTER TABLE lies ADD COLUMN resonate_count INT DEFAULT 0;
ALTER TABLE lies ADD COLUMN illustrated BOOLEAN DEFAULT FALSE;
ALTER TABLE lies ADD COLUMN illustration_url TEXT;
ALTER TABLE lies ADD COLUMN illustration_created_at TIMESTAMP;

-- New RPC functions:
-- increment_resonate(lie_id)
-- increment_doubt(lie_id) [keep existing]
-- mark_illustrated(lie_id, illustration_url)
```

---

## 🎨 KEY PAGES & COMPONENTS

### `/read/[id]` (Story Detail)
- **LEFT:** Story text + ❤️ I FEEL IT (primary) + ✗ Doubt (secondary) + Share buttons
- **RIGHT:** Illustration (if illustrated) or placeholder box
- **ACTION:** Click ❤️ → increment DB → show count

### `/` (Home Feed)
- Show stories with resonate_count (not doubt_count)
- Status badges: 🎨 ILLUSTRATED | ⏳ PENDING (23/25) | 🔥 TRENDING
- Sort options: [Recent] [Most Resonance] [Most Doubt] [Illustrated] [Pending]

### `/illustrated` (Gallery) [NEW]
- Grid: 2-3 columns
- Display only where `illustrated = true`
- Show illustration + story + counts + share buttons
- Sort by `illustration_created_at DESC`

### `/admin/dashboard` [NEW]
- **Section 1:** PENDING (20-24 resonances)
- **Section 2:** READY (25+ resonances) → [Illustrate] button
- **Section 3:** PUBLISHED (illustrated = true)
- **Metrics:** Total posts, illustrated count, avg resonance

### `/admin/upload` [NEW]
- Select story from dropdown (25+ resonances only)
- Upload illustration file (800x800px)
- Auto-fill Instagram caption
- Success → Story moves to gallery

---

## 🎬 RESONANCE THRESHOLD BEHAVIOR

```
resonate_count: 0-19
  Status: "PENDING" (gathering engagement)
  Dashboard: Hidden or in "low engagement" tab
  Action: Nothing (waiting)

resonate_count: 20-24
  Status: "⏳ PENDING 23/25" (near threshold)
  Dashboard: Show in "PENDING" section
  Action: Creator sees story and prepares

resonate_count: 25+
  Status: "READY FOR ILLUSTRATION"
  Dashboard: Show in "READY" section
  Action: [Illustrate] button appears → Creator uploads

illustrated: TRUE
  Status: "🎨 ILLUSTRATED"
  Location: Move to /illustrated gallery
  Share: Full IG Story template available
  Growth: resonate_count continues to grow
```

---

## 🎯 SHARING TEMPLATE

**What User Copies to IG Story:**
```
"I've lied to my best friend for 5 years"

— Hello Liar
helloliar.web/read/xyz123

[Illustration image]
[Living coral branding]
```

**Effect:**
- Original submitter sees story shared by others
- New users discover platform via IG Story
- Click link → Visit web → Submit own story
- **VIRAL LOOP**

---

## 🛠️ TECH STACK UNCHANGED

- Next.js 16 (App Router)
- Supabase (database + storage)
- Tailwind CSS v4
- next-intl (ID/EN bilingual)

---

## 📋 IMPLEMENTATION PRIORITY

### Phase 1 (Database)
- [ ] Add DB columns
- [ ] Create RPC functions

### Phase 2 (Core Logic)
- [ ] Update `lib/actions.ts` → addResonate(), markIllustrated()
- [ ] Refactor StoryReader.tsx → Replace destruction with resonance

### Phase 3 (UI)
- [ ] Update home feed → Show resonate_count + badges
- [ ] Create ShareModal → Copy-to-clipboard
- [ ] Update /read/[id] → 2-column layout

### Phase 4 (New Pages)
- [ ] Create /illustrated gallery
- [ ] Create /admin/dashboard
- [ ] Create /admin/upload

### Phase 5 (Polish)
- [ ] Styling (living coral #FF6B6B)
- [ ] Responsive design
- [ ] Bilingual copy review
- [ ] Testing

---

## 💡 GEMINI PRO PROMPTS (Summarized)

**1. Database Setup:**
```
"Update Supabase: add resonate_count, illustrated, illustration_url, 
illustration_created_at columns. Create RPC functions: increment_resonate, 
increment_doubt, mark_illustrated."
```

**2. Refactor StoryReader:**
```
"Replace destruction mechanic with resonance. Remove burn-fade/redaction. 
Add ❤️ I FEEL IT button (primary), keep ✗ Doubt (secondary). Add share buttons."
```

**3. Create Gallery:**
```
"Create /illustrated page showing stories where illustrated=true. 
Grid layout, 2-3 columns. Show illustration + story + counts + share buttons."
```

**4. Create Admin Dashboard:**
```
"Create /admin/dashboard with 3 sections: PENDING (20-24), READY (25+), 
PUBLISHED (illustrated). Add /admin/upload form for illustration uploads."
```

---

## 🎨 BRAND COLOR

**Living Coral:** #FF6B6B
- Use for: ❤️ I FEEL IT button hover, badges, highlights, accents
- IG Story share template branding

---

## ✅ READY TO IMPLEMENT

- ✅ PRD (hello-liar-prd.md) - Full detailed specification
- ✅ Flowcharts (hello-liar-flowchart.txt) - Visual workflows
- ✅ Gemini Guide (hello-liar-gemini-guide.md) - AI prompts
- ✅ This Quick Ref - One-page summary

**→ Copy all to Gemini Pro and start building!**

---

**Estimated Timeline:** 2-3 weeks (part-time)  
**Difficulty:** Medium (mostly UI refactor + new pages)  
**Risk:** Low (DB changes are additive, old code untouched initially)
