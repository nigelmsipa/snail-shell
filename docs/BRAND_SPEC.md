# Brand spec — Snail Shell (Scripture read-along video system)

The design language for all Snail Shell screens. North star = `thumbnail.html`:
ultra-clean, huge serif, off-white paper, one gold accent, radical breathing room.
**One idea per board. Air is the design. If it feels busy, it's wrong.**

Canonical reference artifact: **`design-v2.html`** (all six boards, current locked look).
Output format: **1920×1080** boards (scale cleanly to 4K). Static screens are
screenshotted to PNG via headless Chromium; the scrolling reader is Pillow+ffmpeg.

## Terminology (LOCKED — do not deviate)
The structural hierarchy is **narrative arc → story → scene**. NEVER use the word **"movement"**.
- **Narrative arc** — the big divisions (e.g. "I · Primordial Dawn", "II · Patriarchal Promise").
- **Story** — the A–K units within an arc (e.g. "The Cosmic Creation", "The Flood", "The Abraham Cycle").
- **Scene** — the pericopes within a chapter (e.g. "Day One: Light") — the first-letter recall units.

## Color tokens

### The constant field (SAME on every screen, every translation)
```css
:root{
  --paper:#fcfcfc;         /* off-white ground, everywhere */
  --ink:#26324f;           /* primary text — ROYAL NAVY (navy + gold = regal for the King James) */
  --ink-soft:#4f535a;      /* body prose */
  --metadata:#9a9388;      /* labels, sublines, already-read text */
  --faint:#c9c3b7;         /* dividers, ghost marks */
  --hltext:#26324f;        /* text sitting on the highlighter wash (= ink) */
}
```
- **One accent only.** The accent does all the work; nothing else is colored. **Grain:** feTurbulence
  fractalNoise, multiply, ~.42, no image files. (The *old* frame used a green accent — superseded.)

### The accent — one per translation, by publication YEAR (warm → cool)
Only `--accent` + `--hl` change per translation; the field above stays constant. Rule: **lock saturation
& lightness, vary only the hue = year of first publication** (older = warm, newer = cool → you read a
Bible's era off its color). Full constitution + CSS + JSON: **`snail-bible-colors.md`** (the source of truth).

| Translation | Year | Accent (`--accent`) | Highlighter (`--hl`) |
|---|---|---|---|
| Geneva  | 1560 | `#B37D56` clay | `hsl(25 45% 80%)` |
| **KJV** *(flagship — current)* | 1611 | `#B3944D` gold `hsl(42 40% 50%)` | **`#f4d999`** |
| Webster | 1833 | `#95A653` olive | `hsl(70 45% 80%)` |
| YLT     | 1862 | `#749F56` moss | `hsl(95 45% 80%)` |
| Smith's Literal | 1876 | `#639B55` green | `hsl(108 43% 80%)` |
| English Revised (RV) | 1885 | `#5A9556` sage-green | `hsl(116 43% 80%)` |
| Darby   | 1890 | `#579457` sage | `hsl(120 40% 80%)` |
| ASV     | 1901 | `#4F9270` jade | `hsl(150 42% 80%)` |
| Weymouth NT | 1903 | `#4F9272` jade | `hsl(152 43% 80%)` |
| JPS (Tanakh) | 1917 | `#4D937C` jade-teal | `hsl(160 43% 80%)` |
| BBE     | 1949 | `#4C9492` teal | `hsl(178 45% 80%)` |
| MLV     | 1987 | `#4F8EA1` slate | `hsl(194 43% 80%)` |
| American KJV | 1999 | `#508CA5` slate blue | `hsl(198 43% 80%)` |
| WEB     | 2000 | `#5089A5` slate blue | `hsl(200 45% 80%)` |
| **BSB** *(secondary flagship)* | 2016 | `#5672B3` blue | `hsl(222 45% 80%)` |
| LSV     | 2020 | `#7067AD` indigo | `hsl(248 42% 80%)` |
| MSB     | 2022 | `#8A6BA8` violet | `hsl(270 40% 80%)` |

- **KJV (what design-v2 renders):** `--accent:#B3944D` · `--hl:#f4d999`. Everything else on this page shows
  the KJV instance. Swap only those two vars to skin the whole system for another translation.
- The **royal-navy ink** is the "Nord-esque" cool field we chose — it stays navy for *all* translations
  (the per-translation warmth/coolness lives in the accent, not the ink). MLV unplaced (slot by year).

## Type

- **Display / hero** — `"DM Serif Display", Georgia, serif`. Heroes only: 200px (book/next),
  146–150px (translation name), 140px (chapter).
- **Body / prose** — `"Source Serif 4", Georgia, serif`. 33–34px / line-height 1.56–1.58.
  Italic for sublines and verdicts.
- **Eyebrows / meta** — `"IBM Plex Sans", system-ui, sans-serif`, uppercase, letter-spaced.
  Eyebrows 24–26px / .28–.30em (gold). Small meta 17–19px / .12–.22em (metadata grey).
- **Recall strings** — `"IBM Plex Mono", monospace`, wide tracking (.14–.17em).

### The scale (so nothing is arbitrary)
`hero 200 · translation-name 146 · chapter 140 · contents-h1 104 · section 60 ·
body 33 · eyebrow 26 · meta 19`. Board safe-margin ≈ 150px.

## Layout posture
- Off-white ground, no chrome, no drop-shadows inside the board. Grain overlay only.
- **Alabaster Canon grid** (translation & structured boards): 3 rows —
  eyebrow rail (label left / small-cap context right) · centered hero + prose ·
  a footer band. Hero floats dead-center; supporting furniture pinned top & bottom.
- Personality lives in the **voice of the prose and the point of view**, not in density.
  Keep the air; make the words opinionated.

## The five screens

1. **Translation / Lore** — Alabaster Canon layout. Shown **once, at the very start of the whole
   Bible** — it introduces the *translation*, not any single book, so NEVER name a book here (no
   "Genesis"). Eyebrow "The Translation" (left) + "The Holy Bible" (right). Prose is about the KJV
   as a whole. Centered name + one voice-y paragraph. Footer = "Is this your Bible?" self-select:
   two **filled progress meters** (Word-for-word↔Thought-for-thought, Traditional↔Contemporary)
   — gold fill from the pole to a ringed marker + plain caption, so it reads as a *measurement*
   not a line — then a "Best for…" verdict with an honest opinion.
2. **Contents / Map** — the WHOLE book's narrative arcs on ONE page (shown once per book): a glance
   of the story to come, like a map. Header = book name (@104px) + version + "the book in N stories".
   Two columns of **narrative arcs** (I · Primordial Dawn …) each listing its **stories** (A–K) with chapter
   refs. One page, not one-chapter-at-a-time — flipping through would defeat the map. Reduce cognitive
   load; give the terrain at a glance.
3. **Reader** — **CENTERED** (Pillow-rendered; this board is a SPEC). *(The Witness side-rail was
   tested as a 4K clip and shelved — the centered reader felt cozier. Body font stays **Source Serif 4**;
   Georgia was tested and rejected as too wide/heavy.)*
   Royal-KJV palette (navy + gold): ink `#26324f`, already-read `#a39b8b`, gold accent, pale-gold `#f4d999` highlight.
   A centered, left-aligned reading column (~1360px on a 1920 board), serif ~56px/1.42.
   read=grey / upcoming=ink / active=gold-wash. Top α0 deadzone (260px) + 350px fade so finished text
   vanishes up top; **no bottom fade** — upcoming text runs to the bottom edge (bird's-eye of the coming
   pericope). 180ms highlight lead.
   - Fixed **book anchor top-left** ("Genesis 1" / "King James Version"). "W & W" brand bottom-right.
   - **Orientation is INLINE, not a corner label (LOCKED).** Grayed structural markers scroll *with the
     text* as apparatus (never scripture, never gold/red), at two tiers:
     - **Scene** — small uppercase letterspaced gray (`#b7ad9c`), between pericopes (e.g. "DAY THREE · VEGETATION").
     - **Story** — larger gray serif italic (`#a79c8a`) with a hairline above (the broader story above the scene).
     Why this beats the old updating corner label: eyes stay in ONE place, it foreshadows what's COMING
     (not just where you are), doubles as the seam-breath openness, and pre-labels the exact sections the
     end-of-chapter memory cards test. Use human scene names — no internal plumbing like "3b".
   - **Verse superscripts:** small gold superscript verse № before each verse start (read verses' recede).
4. **Memorization (first-letter recall)** — a **reader-style SCROLL** (LOCKED 2026-07-01). NOT pages,
   NOT masonry. One **single narrow centered column** (~1280px, the reader's measure — never full-width),
   the **scenes in strict A→J order**, scrolling up like the reader, each rising from the bottom and
   **fading out at the top** before it reaches the pinned header. "Genesis 1" header never disappears
   (chrome-free, no harsh rule). These A→J cards are **SCENES** (see Terminology at top).
   Hint reads **"Pause on a scene & memorize it."**
   - **Bold card language:** big gold **drop-cap letter** (DM Serif ~120px) anchors each scene; heavy serif
     title (600) + verse range on a hairline; mono first-letter string below (~31px). No boxes.
   - **Why a scroll:** dissolves the pagination problem entirely (long chapters just scroll longer — Psalm 119
     is fine), gives unlimited vertical room so type stays big, and matches the reader's flow/mechanics.
   - Single column is REQUIRED: two columns would break the A→B→C reading order.
   - *(Journey, all rejected: one-flashcard-per-scene = too many pages; rigid grid = dead space; 2-col
     masonry = breaks order; static 2–3 pages = the too-many-pages-at-chapter-end problem.)*
   - Render note: implement like the reader's Pillow scroll (or an ffmpeg scroll-crop of one tall canvas);
     the browser preview `memory-scroll-bold.html` shows the look but its loop is a preview artifact.
5. **Outro** — credits + next **CONSOLIDATED into one card** (Codex v3 "A5"), LOCKED 2026-07-01.
   Balanced two-part card: **Left** = "Complete" eyebrow + big "Genesis" (176px) + one-line summary.
   **Right** (behind a hairline rule) = credits (Translation, Narration, receding to GREY labels) **plus a
   bold "Next up · Exodus"** at the bottom of that same column — gold "Next up" label + big display "Exodus"
   (~80px) + its **narrative arcs** as the preview ("Out of Egypt, The Covenant, The Dwelling"). The gold +
   display type make Next-up the bold beat while the credits recede, so it reads as forward-looking, not a
   credit row. (A separate footer band / column placement was tried and felt noisier — this A5 pairing is
   the calm, pleasing one.) Preview = on-brand arcs only, never a prose blurb. No hero next-book board.
   **Why the credits are grey (do NOT "polish" them brighter):** human credit is true but incidental — the
   Word, and continuing in it, is what leads. The hierarchy is the message: credence to the King *of* James,
   not King James. Apparatus serves Scripture, never competes with it. See [[principle_credit_recedes_word_leads]].
   **No separate hero next-book board / no "Watch Next" CTA** — pushing the next book is engagement bait;
   a quiet hint trusts the reader (Genesis→Exodus is assumed). Gift-over-engagement; honest full-stop, not a funnel.
   **No tagline** — do NOT add "Freely ye have received, freely give" or similar: stating the obvious implies
   the opposite was in question ("don't be evil" problem). What's understood is not said.

## Constraints
- PD-only library; the KJV self-select verdict is honest (a richer read, not the simplest first Bible).
- Consistency across the deck beats per-board cleverness. Reuse the tokens and the scale verbatim.
