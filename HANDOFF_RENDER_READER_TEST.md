> **⛔ ABANDONED (2026-06-30).** User compared the Witness side-rail against the existing CENTERED
> reader and chose to **keep the centered reader** (it felt cozier). Do NOT convert `build_genesis.py`
> to the side-rail layout. Keep the current centered reader; next work is improving its VISUAL
> HIERARCHY (top-zone story/scene tiers, verse-number weight), not changing the layout. This whole
> file below is superseded — kept only for history.

# HANDOFF — Reader-only test render (Witness Table layout) — ABANDONED

**For:** Google / Gemini. **Working dir:** `~/wolf-and-word`.
**Purpose:** Render **only the scrolling reader** for **Genesis 1 (KJV)** so the user can eyeball a
NEW reader layout in motion and decide whether to keep it. This is a **throwaway test** — do NOT
render the thumbnail / lore / contents / memory / credits scenes, and do NOT stitch the final concat.
Just produce `reading_scroll.mp4`.

## What changes: the reader goes from CENTERED → "Witness Table" (left rail + offset column)

Source of truth for the look: **`design-v2.html`, board 3** ("Reader — Witness Table") + `BRAND_SPEC.md` §3.
Open board 3 in a browser to see the target. The render script to edit is **`build_genesis.py`**
(Pillow+ffmpeg, 4K 3840×2160). **Change layout ONLY.** Everything else below stays exactly as it is.

### KEEP unchanged (do NOT touch)
- Colors (warm KJV): `INK (58,49,32)`, `READ (163,155,139)`, `ACCENT (179,148,77)`, `HL (233,210,162)`.
- Fonts (Source Serif body, IBM Plex Sans marks), body size **132px / LH 198** — keep, so we isolate the layout change.
- Verse superscripts (already gold via `SANS_VN`, line ~226) — keep.
- Highlighter (rounded pale-gold rect behind active word, lines ~231-236) — keep. This is our highlighter.
- Timing: 180ms highlight lead (line 174), EMA smooth scroll `*0.05` (line 202).
- Fade mask: top 260px α0 + 350px fade, **no bottom fade** (lines 143-149) — keep.
- Scene is DYNAMIC per frame from `units` (`unit['letter']` + `unit['title']`) — keep the logic,
  only move WHERE it's drawn (see below).

### DO change — the layout (4K coords = design-v2 board ×2)
1. **Scripture column: offset right, not centered.**
   - Introduce `COL_X = 820` (left edge of text) and `COL_W = 2440` (column width).
   - In `layout_chapter`: `max_w = COL_W` (was `W - MARGIN_X*2`).
   - In the draw loop: `cursor_x = COL_X` (was `MARGIN_X`, line 220).
   - Text stays left-aligned within the column (it already is).

2. **Add a left rail with a vertical divider.**
   - Divider: 2px vertical line at **x = 620**, from **y = 160 to y = 2000**, color `#e6e2d8` (approx (230,226,216)).
   - Everything in the rail is **right-aligned to x = 550** (70px gutter left of the divider).

3. **Book + chapter — top of rail (replaces the old top-left "GENESIS 1" block, lines 131-132, 137).**
   - Draw `Gen.` on one line and `1` under it (or `Gen. 1`), right-aligned at x=550, starting y≈180.
   - Ideally **DM Serif Display ~140px** (matches the display face). If that font isn't on the box,
     fall back to Source Serif — note which you used. Color = `INK`.
   - Remove the old top-left "GENESIS 1 / KING JAMES VERSION" text and the orphaned top-right accent
     rule (line 137). The version line is not needed on the reader (it's on the intro screens).

4. **Scene label — bottom of rail (relocate from top-right, lines 254-256).**
   - Small sans kicker `SCENE` (or `Scene · now`), letter-spaced, color `META`, then under it the
     changing scene name in Source Serif ~60px, color `INK` — right-aligned to x=550, pinned near the
     bottom of the rail (baseline ≈ y=1960). Keep computing it from `unit` each frame so it switches
     as you scroll — that continually-changing scene is the whole point.
   - (If `unit['title']` is long, allow it to wrap within the ~420px rail width, right-aligned.)

5. Keep the `W & W` brand bottom-right if you like; harmless.

## Output & run
- Comment out / skip the `make_static_video(...)` calls and the concat block (lines ~270-310) for this test.
- Keep the `reading_scroll.mp4` ffmpeg encode. Final artifact: `~/wolf-and-word/genesis_output/reading_scroll.mp4`.
- Run: `cd ~/wolf-and-word && python build_genesis.py` (needs `genesis-01-aligned.json`, `genesis-01-units.json`,
  `genesis-01.versemap.json`, `genesis-01.opus` — paths already at the top of the script).
- Sanity check before handing back: the book+scene sit in a left rail with a divider, the verses scroll
  in an offset right-hand column, the active word still gets the pale-gold highlight riding the narration,
  and the scene name in the rail changes as new pericopes scroll in.
