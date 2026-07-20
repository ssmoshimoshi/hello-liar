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

## Project Context
- This is "Hello Liar" — an anonymous interactive storytelling platform.
- Stack: Next.js (App Router), Tailwind CSS v4, next-intl, Supabase (future).
- Color: Black, White, Gray + Living Coral (#FC766AFF) accent only.
- Fonts: Playfair Display (stories), Inter (UI).
- Languages: Indonesian (default) and English.
