## Plan: Unify into one Reading page + fix Play

### A. Collapse Library into a full-screen overlay on the Reader

- **Route changes** (`src/App.tsx`): `/` renders `Reading` directly. Remove the separate `Library` route from navigation; keep the file but only use it as the overlay content (or fold its grid into a new `LibraryOverlay` component).
- **New `src/components/library/LibraryOverlay.tsx`**: full-screen modal (Dialog with `max-w-none w-screen h-screen`) styled in the Digital Vellum aesthetic — parchment bg, Noto Serif headings, book grid with KJV/BSB/MSV/WEB chips. Clicking a book/chapter/version closes the overlay and calls `handlePassageSelect` on the reader.
- **Entry point**: replace the current "Library" link in `TopNav` with a single "Library" button that opens the overlay. The existing passage-selector overlay (book/chapter picker from the title) stays as the quick-jump variant; Library overlay is the richer browse view.
- **State preservation**: overlay sits on top of the running reader — no route change, no remount, scroll position and play state are preserved. This eliminates the "jerk" between pages.
- **Delete the homepage marketing page**'s usage from routing; keep the file untouched in case it's wanted later.

### B. Fix the Play button (no scroll happens, button flashes)

Root cause: the desktop scroll container's `scrollHeight === clientHeight` at click time, so on the first animation frame `currentPosition (0) >= maxScroll (0)` triggers `setIsPlaying(false)` immediately.

Two reasons it can read zero:
1. `ResizablePanelGroup` doesn't get an explicit height, so the panel and the `h-full` prompter inside collapse vertically.
2. The active-prompter detection `(prompterRef.current?.scrollHeight ?? 0) > 0` picks the desktop ref even when the mobile layout is the visible one.

Fixes in `src/hooks/useTeleprompter.ts` and `src/pages/Reading.tsx`:
- Wrap desktop `ResizablePanelGroup` in a `h-full` container and add `h-full` to the desktop wrapper so panels actually fill the viewport below the nav.
- In `scroll()` and `handleResetScroll()`, change end-of-scroll guard to `if (maxScroll <= 0) { schedule next frame; return }` instead of pausing — so a transient zero height doesn't kill playback.
- Improve active-prompter detection: prefer whichever ref has `offsetParent !== null` (i.e. actually visible) rather than relying on scrollHeight.
- Reset `lastTimeRef` defensively on each play start (already done) and skip the first frame's delta (already done).

### C. Light Digital Vellum polish on the unified reader

- Top nav: parchment bg, serif wordmark, single "Library" pill button on the right.
- Library overlay: parchment bg, serif book titles, hover lifts subtle ink shadow, translation chips use the existing token set.
- Keep all reader typography and controls as-is.

### Files touched

| File | Change |
|---|---|
| `src/App.tsx` | `/` → `<Reading />`; drop Library route |
| `src/components/layout/TopNav.tsx` | Replace Library link with overlay trigger |
| `src/components/library/LibraryOverlay.tsx` (new) | Full-screen Dialog wrapping the library grid |
| `src/pages/Library.tsx` | Refactor grid into `LibraryOverlay` (or import from here) |
| `src/pages/Reading.tsx` | Mount `LibraryOverlay`; add `h-full` to desktop wrapper |
| `src/hooks/useTeleprompter.ts` | Don't pause on zero maxScroll; visibility-based ref pick |

### Result

One route, one surface. Library appears as an overlay over the reader and closes back to the same scroll position. Play actually scrolls.