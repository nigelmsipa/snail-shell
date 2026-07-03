# WolfenWord — Architecture & UX Decisions

## Status: In Progress — 2026-02-16

## The Ecosystem

WolfenWord is the center of a Bible engagement ecosystem. The standalone apps are entry points/funnels; WolfenWord is the full experience.

| App | Purpose | Relationship to WolfenWord |
|-----|---------|---------------------------|
| **WolfenWord** (spearhead) | Chapter-oriented memorization | The hub — all modes integrated |
| **Seraph's Song** (YouTube/Suno) | Word-for-word Bible books as choir music | Familiarization — drives people to WolfenWord |
| **Bible Teleprompter** | Customizable reading experience | Standalone lightweight reader; reading mode extracted |
| **Bible Typing App** | Type through the Bible | Standalone typing practice; typing mode extracted |
| **Scripture Posters** | Visual scripture posters | Standalone; poster/print feature extracted |
| **Tiny Owl** | SDA theologian LLM | Retrieval — answering questions from scripture |

### Architecture: Micro, not Monolith
- Each app stays independent and focused
- Cohesion comes from shared design system + shared Supabase auth
- WolfenWord absorbs the *essence* of each mode
- Standalone apps exist for people who only want one thing

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui (Radix)
- Supabase (auth, database, storage)
- Deployed on Lovable (can migrate cleanly — only dependency is one OAuth wrapper file)

## Authentication
- Google OAuth via Lovable's auth wrapper → Supabase session
- Email/password also supported
- Guest mode planned (local storage, no account required) — NOT YET BUILT
- Profile avatar shows Google pic or fallback icon, dropdown for sign out

## Home Page — Current State
- Header: "WOLF & WORD" + profile avatar
- Heatmap with streak (streak already calculated in code)
- "Start Today's Session" button → goes to first in-progress passage
- Passage cards in grid
- Search (visible after 3+ passages)
- Sort: Recent, Progress, A-Z

## Home Page — Planned Changes

### Sort Options (replaces current)
1. **Biblical chronology** — Genesis through Revelation order
2. **Date added** — newest first
3. **Manual** — drag to reorder

Sort order = queue order. Whatever's at top is what "Today's Session" picks.

### Tags & Filtering
- Users can tag passages (e.g., "Psalms", "Prophecy", "Memorized", custom tags)
- Filter by tags from home page
- Tags replace the concept of "collections" — less context switching

### "Today's Session" Logic
- Picks up where you left off in your queue (determined by sort order)
- User is in the driver's seat — they add passages, the app helps them work through them
- No algorithm, no random verse of the day — just: continue your own plan

## Memorization Flow — TO BE DEFINED

### Current Modes
- **Blur mode** — verses blurred, tap to reveal
- **Initials/First Letter mode** — show only first letter of each word
- **Words mode** — word-by-word reveal
- **Test mode** — type from memory (needs blinking cursor fix, needs first-letter + full-word sub-modes)

### Planned Modes
- **Teleprompter/Read mode** — scrolling text, interactive, credit when you reach the end
- **Poster/Print** — print first-letter method as physical reminder

### Progression (conceptual, not yet implemented)
Likely stages: Familiarization → Encoding → Retrieval → Mastery
- What triggers advancement between stages? TBD (pending research)
- How does spaced repetition fit? TBD
- Per-verse or per-pericope progression? TBD

### Streak/Heatmap Credit Rules (decided)
Credit is automatic — no self-reporting, no button to click.

| Mode | Credit Trigger |
|------|---------------|
| Read/Teleprompter | Reached the end of the passage |
| First Letter | Completed the passage (all letters) |
| Test/Typing | Submitted attempt (regardless of accuracy) |
| Blur | Revealed all verses |

Heatmap intensity tiers (planned):
- Light — read-through / passive engagement
- Medium — interactive mode (first letter, blur)
- Dark — recall/test mode

## Key Principles
1. **No context switching** — everything accessible from one dashboard
2. **Chapter-oriented** — chapters are containers, broken into pericopes automatically
3. **User is in control** — they choose what to memorize, app helps them execute
4. **Automatic progress tracking** — no manual logging
5. **Web-first** — PWA later, no native app (avoid app store tax)
6. **Monochromatic design** — one blue, restraint is the design
