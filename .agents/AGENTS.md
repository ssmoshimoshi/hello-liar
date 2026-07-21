# Hello Liar - Agent Rules

## Token Efficiency Rules
1. **NO BROWSER EMULATION** unless the user explicitly says "coba di browser", "test di browser", or "lihat hasilnya di browser".
2. **NO UNSOLICITED RESEARCH** — don't search the web or read documentation unless the task requires it.
3. **DO EXACTLY WHAT IS ASKED** — don't add features, refactor code, or "improve" things that weren't requested.
4. **MINIMAL OUTPUT** — keep responses under 200 words unless the task naturally requires more (e.g., PRD, plan).
5. **NO REDUNDANT FILE READS** — if you already know the file content from context, don't re-read it.
6. **BATCH EDITS** — use `multi_replace_file_content` instead of multiple sequential single edits to the same file.
7. **DON'T SUMMARIZE ARTIFACTS** — after creating/updating an artifact, point to it. Don't re-explain.
8. **DON'T RE-READ FILES YOU JUST WROTE** — trust your own output.

## Brainstorming Modes
- **`br`** keyword at start = User/UX brainstorming mode. Think as an end-user, focus on experience, feelings, usability. NO CODE. NO FILE CHANGES.
- **`br dev`** keyword at start = Full developer team brainstorming mode. Think as CTO + Senior Dev + DevOps. Discuss architecture, trade-offs, implementation strategies. NO CODE. NO FILE CHANGES.
- In both modes: respond conversationally, use bullet points, ask clarifying questions, propose options with pros/cons.

## Code Execution Rules
1. Only run `npm run dev` when user asks to see results.
2. Only run `npm run build` when user asks to verify or deploy.
3. Don't install packages without stating why first.
4. Don't create files that weren't part of the requested task.
5. **MANDATORY PRE-CODING UX AUDIT**: Before writing or modifying any UI code, you MUST activate the `ux_audit` skill and evaluate the plan/feature from a layperson's perspective (Nielsen's Heuristics). NEVER skip this brainstorming/auditing phase.

## Project Context
- This is "Hello Liar" — an anonymous interactive storytelling platform.
- Stack: Next.js (App Router), Tailwind CSS v4, next-intl, Supabase (future).
- Color: Black, White, Gray + Living Coral (#FC766AFF) accent only.
- Fonts: Playfair Display (stories), Inter (UI).
- Languages: Indonesian (default) and English.

## Modern UI/UX Expertise & Design Guidelines
*(Derived from Shadcn, Radix, Mantine, Vercel Design, and Awesome Design Systems)*
When asked to design or brainstorm UI/UX, apply these principles:
1. **Accessibility First (Radix/Shadcn)**: Always consider keyboard navigation, ARIA labels, and screen readers. UI must be usable by everyone.
2. **Component Ownership**: Prefer building custom, copy-pasteable Tailwind components over heavy external UI libraries. Full control over markup and styles.
3. **Cathartic Minimalism (Vercel/Modern)**: Use massive negative space, high contrast, and subtle micro-interactions (e.g., breathing pulses, ripple effects, smooth transitions). Form follows emotion.
4. **Ergonomic Layouts**: Design for thumbs on mobile (bottom navigation pills) and distraction-free reading on desktop.
5. **Thematic Consistency (Mantine)**: Strict adherence to the color palette (Black, White, Gray, Living Coral). Ensure seamless dark/light mode compatibility if requested.
6. **Psychological UX**: Interactions should match the emotional weight of the action. (e.g., "Doubt" feels heavy/requires a hold, "Resonate" feels light/rewarding).
