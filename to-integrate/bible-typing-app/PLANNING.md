# Verse Mind Type — Planning & Strategy

This document captures the product vision, architecture direction, and phased plan so another collaborator/AI can pick up quickly.

## Product Vision
- Progressive memorization with a chapter‑first workflow.
- Acrostic Drill Mode: Full text → First letters → Recall (no cues).
- Users select whole chapters, practice in small segments, and roll up to chapter mastery.
- Offline‑friendly web app; optional PWA install.

## Monetization
- No ads. Focus on:
  - Free core + Pro features: spaced repetition scheduler, custom sets, export/printables, multi‑device sync.
  - Optional one‑time “chapter packs”.
  - Physical companion: magazine‑style issues (plans + acrostic worksheets), fulfilled via print‑on‑demand; pair with digital PDF in‑app.
- Funnel: In‑app “Practice Plan” pages, soft upsell after streaks; optional email capture (opt‑in).

## UX Redesign (North Star)
- Library (Home): Translation selector → Book → Chapter. “My Chapters” pinned with mastery bars and quick resume.
- Chapter Page: Segment the chapter (e.g., 3–5 verse chunks). Show per‑segment mastery; actions: Practice (Acrostic), Review (Spaced), Build (learn new segment).
- Session Flow (Acrostic):
  1. Pass 1 — Full Text
  2. Pass 2 — First Letters mask
  3. Pass 3 — Recall (no cues / optional placeholders)
  - Thresholds to advance; Skip allowed with warning. Completion sheet with metrics.
- Dashboard: Today’s queue, streaks, recent gains, chapter progress grid.
- Onboarding: 3 quick steps, skippable; route‑based redirect (no app‑wide gate).

## Data Model (Local‑first)
- Verse {id, book, chapter, verse, text}
- Segment {chapterId, verseRange}
- Session {mode, pass, metrics, targetId, completedAt}
- Mastery {targetId (segment/verse/chapter), level 0–3, lastSuccessAt}
- Rules: Full→FirstLetters→Recall increases mastery 0→3; chapter mastery aggregates segment mastery.
- Storage services: LocalStorage/IndexedDB behind a `storage` API; adapters later for remote sync.

## Architecture Direction
- Features: `features/acrostic`, `features/library`, `features/dashboard`, `features/onboarding`.
- Domain: `core/typing` (tokenize, normalize, scoring), `core/scheduler` (spaced repetition), `core/repo` (verses/mastery/sessions interfaces).
- State: Zustand for app/UI state; TanStack Query for async data (presently local).
- Routing: Nested feature routes; lazy when feasible.

## Phase Plan
- Phase 1 — Acrostic MVP (this commit):
  - Add acrostic text helpers and a new `AcrosticSession` with 3 passes.
  - Add route `/acrostic/:book/:chapter` and minimal UI.
- Phase 2 — Library (Chapter‑first):
  - “My Chapters” selection and Chapter page with segments + mastery.
- Phase 3 — Dashboard + Skippable Onboarding:
  - Replace hard gate with redirect; new dashboard with queue/streaks.
- Phase 4 — Scheduler + Review Mode:
  - Spaced repetition queue across selected chapters.
- Phase 5 — Monetization hooks:
  - Pro features and export/printables; soft upsell surfaces.
- Phase 6 — PWA + Email capture (opt‑in).

## Open Decisions
- Thresholds (defaults): Full 98%, First Letters 95%, Recall 90% (user‑configurable).
- Pass 3 placeholders: fully blank vs faint word‑count dots.
- Punctuation: ignored in scoring; optionally display faintly in Pass 2.
- Segment size: default 3 verses (configurable).
- Monetization: subscription vs one‑time packs (to validate).

## Implementation Notes
- Keep additions additive and avoid breaking current `TypeRoute`/`BuildRoute`.
- Use existing Bible data from `src/data/bible.ts`.
- Store basic session metrics alongside current `progress` lib; refine later.

