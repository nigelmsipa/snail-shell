# HANDOFF — Render Genesis 1 (KJV) read-along video, CORRECTLY

You (Codex / Antigravity / Gemini) are taking over a render the previous agent got
**wrong** because it ignored the design files and used a generic theme. Read this whole
file, then read the SOURCE-OF-TRUTH design files listed below **before writing any code**.
Everything here is a decision already made by the user — nothing is open for reinvention.

Working dir: `~/wolf-and-word`. KJV chapter assets: `~/kjv-render/` (and `~/kjv-aligned/`).
Render with the project's existing Pillow+ffmpeg flow (`~/Downloads/finitude_v2.py` for the
highlighted reading, `~/Downloads/build_numbers.py` for static scenes + stitching). NO browser.

---

## GOAL
A polished **4K** read-along video of **Genesis 1, King James Version**, with the FULL
sequence (thumbnail → intro scenes → reading → memorization card → closer), using the
locked **chronological color system** and **perfect audio↔highlight sync**.

---

## SOURCE-OF-TRUTH FILES — READ THESE FIRST (do not guess, open them)
- `snail-bible-colors.html` — **THE COLOR CONSTITUTION.** accent + highlighter per
  translation, assigned by **publication year**, hue warm→cool. NOTHING is random.
- `kjv-frame-design.html` — the locked KJV reading frame (foothold, story/scene, highlighter studies).
- `kjv-simulator.html` — the playable motion engine reference (highlight rides narration, scene title swaps).
- `thumbnail.html` — the decided thumbnail (dirty-paper, a display typeface — NOT a plain "play here" card).
- `bookends.html` — the **intro and outro scenes**: opener (KJV lore + "is this your Bible?" fit panel + Genesis contents) and closer (credits + next-book Exodus preview).
- `memory-card.html` — the **chapter-end memorization card** (First-Letter Recall, per movement).
- `index.html` — the Design Shelf, links all of the above.
- `make_youtube.py` — the stage generator (passage/window/solo layouts, themes, `--units`, `--scene-src`, `--scene-tier`).
- Memory-method scene data: `~/memory-method-bible/data/base-structure/genesis-base.json` (story_title + scene_name + verse refs).
- Foothold letters: `~/wolf-and-word/genesis-01-units.json`.

---

## LOCKED DECISIONS

### 1. COLOR — chronological, per-translation (the #1 bug last time)
The previous render used the `nord` theme → **sage green** highlighter. WRONG.
KJV is 1611 → its colors on the warm→cool year axis are:
- **Accent** (rule, lemma, verse-number superscripts, scene letter): `hsl(42 40% 50%)` = `#B3944D` (gold)
- **Highlighter** (block behind the active word): `hsl(42 45% 80%)` (pale gold)
- Paper/ink stay the house values (`#fcfcfc`/`#f4efe4` paper, `#2e3440`/`#2c2722` ink).
Verify these against `snail-bible-colors.html` (KJV row) and apply them — do NOT use any
theme's default green. The color is per-Bible and must come from that file's table.

### 2. STRUCTURE / HIERARCHY (a NEW decision this session)
Three tiers: **STORY → SCENE → (memorization)**.
- **Story** = the larger grouping (story_title from genesis-base.json) — on-screen context.
- **Scene** = the lettered foothold (this is the one that carries the **LETTER** A/B/C…) — from `genesis-01-units.json`, switches as it scrolls.
- **End of chapter → MEMORIZATION**: the chapter flows into the `memory-card.html` First-Letter Recall screen (each movement's first letters to memorize).
So on the reading frame, show BOTH the story title and the lettered scene; at chapter end, transition to the memorization card.

### 3. TYPOGRAPHY
Reading body = Source Serif 4 (already in stage). Thumbnail/large display = the display
typeface chosen in `thumbnail.html` (it loads DM Serif Display / Playfair / Fraunces /
Cormorant / Cinzel — use the one the design file actually applies, don't pick at random).

---

## REQUIRED VIDEO SEQUENCE (last render had ONLY the reading — wrong)
1. **Thumbnail / title** — the dirty-paper thumbnail from `thumbnail.html` (book + version, display type), not "Genesis 1 · TAP TO BEGIN".
2. **Intro scenes** — the opener from `bookends.html`: KJV lore + "is this your Bible?" fit panel + Genesis contents. (Hold each a few seconds.)
3. **The reading** — passage layout, KJV gold colors, story+scene(lettered) titles, word-synced highlight.
4. **Memorization card** — `memory-card.html` First-Letter Recall for Genesis 1's movements.
5. **Closer** — credits + Exodus next-book preview (bookends closer).
Remove the literal "TAP TO BEGIN" string — meaningless in a video.

---

## USE THE EXISTING RENDER FLOW — NO BROWSER (this is the core correction)
The previous agent invented a fragile **headless-chromium real-time screencast** → drift +
low quality. **Throw it away.** We already render videos with the proven, simple flow used
for the Seraph Song Numbers/Exodus videos: **Pillow draws frames → ffmpeg assembles + audio.**
- **`~/Downloads/finitude_v2.py`** = the EXACT precedent for *highlighted reading*: a
  `render_frame(texts, active_idx, …)` that draws the passage with the **active segment lit**
  (bold/colored + bar) and the rest dimmed, wraps text, saves PNG frames, ffmpeg → mp4. COPY
  THIS PATTERN. Change `active_idx` from sentence-level to **word-level**.
- **`~/Downloads/build_numbers.py`** = the precedent for **static-image segments**
  (`ffmpeg -loop 1 -framerate 1 -i image.png -i audio … `) and for **concatenating** segments
  into one video. Use it for the non-reading scenes and the final stitch.

### THE SYNC FIX (audio↔highlight was unaligned)
Sync is automatic when you render deterministically — there is nothing to "align":
- Truth = `genesis-01-aligned.json` (per-word start/end ms).
- For each output frame `i` at time `t = i/FPS`, compute the **active word index** = the word
  whose [start,end] contains `t`, plus the scroll/paragraph position. Draw that frame in Pillow.
- Assemble at constant FPS; mux `genesis-01.opus` from t=0 of the reading segment. Frame `i`
  always equals audio time `i/FPS` → perfect sync, zero drift, no offset guessing.

### 4K / QUALITY (slower is fine — user said so)
- Pillow canvas = **3840×2160** (just set W,H; scale font sizes/margins 2× from finitude).
- Save frames as **PNG** (lossless). Encode `-c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p
  -movflags +faststart`, audio AAC 256k or copy opus. Render time is not a constraint.
- FPS 30 is plenty (highlight steps at word boundaries; optionally interpolate a soft fade).

---

## ASSET LOCATIONS
- KJV Genesis 1: `~/kjv-render/genesis-01-aligned.json`, `genesis-01.opus` (243.3s), `genesis-01.txt` (KJV verified), `genesis-01.versemap.json`.
- Units (foothold letters): `~/wolf-and-word/genesis-01-units.json`.
- Scene/story titles: `~/memory-method-bible/data/base-structure/genesis-base.json`.
- Design files: all in `~/wolf-and-word/` (see source-of-truth list).

## PIPELINE (build it from the two reference scripts — no make_youtube/HTML needed for video)
The HTML files (`make_youtube.py` output, `kjv-frame-design.html`, etc.) are now only **visual
reference** for how the reading frame should look. The video itself is rendered in Python:
1. **Reading segment** — adapt `~/Downloads/finitude_v2.py`: load `genesis-01-aligned.json`
   (word timings) + KJV text; per frame compute active word at `t=i/FPS`; draw paper bg
   (`#fcfcfc`), Source Serif body, **KJV gold highlighter block `hsl(42 45% 80%)`** behind the
   active word, gold accents `#B3944D` (verse superscripts, rule), story title + lettered scene
   (from `genesis-01-units.json` + `genesis-base.json`) in the corner; save PNG frames; ffmpeg
   → `reading.mp4` muxed with `genesis-01.opus`.
2. **Static scenes** — thumbnail, opener (lore + fit panel + contents), memorization card,
   closer. **PNG exports already exist** for several (`thumbnail.png`, `memory-card.png`,
   `bookends-2-contents.png`). Export any missing one from its HTML (e.g. open + screenshot, or
   render with Pillow). Turn each into a short clip via `build_numbers.py`'s
   `ffmpeg -loop 1 -i image.png` pattern (hold 3–5s; add fades).
3. **Stitch** — concat: thumbnail → opener scenes → reading.mp4 → memorization card → closer,
   using `build_numbers.py`'s concat approach. Output `genesis-01-KJV.mp4` (4K).

System has `ffmpeg`, Python 3 + Pillow (`from PIL import Image, ImageDraw, ImageFont`), fonts in
`/usr/share/fonts`. **Do NOT use chromium/headless/screencast** — that was the mistake.

---

## VERIFICATION CHECKLIST (before declaring done)
- [ ] Highlighter is KJV **gold** `hsl(42 45% 80%)`, accent gold `#B3944D` — NOT sage/green.
- [ ] Audio word matches lit word at t=5s, 60s, 120s, 240s (spot-check frames vs `genesis-01-aligned.json`).
- [ ] Sequence present: thumbnail → opener scenes → reading → memorization card → closer.
- [ ] Story title AND lettered scene both shown; scene letters come from genesis-01-units.json.
- [ ] Output is 3840×2160, visibly sharp (lossless frames).
- [ ] No "TAP TO BEGIN" text.
- [ ] Memorization card matches `memory-card.html` First-Letter Recall.

## DO NOT
- Do not use any preset theme's default highlighter color — color is per-Bible by year.
- **Do not use chromium / headless / browser screencast at all** — render frames in Pillow and
  assemble with ffmpeg, exactly like `finitude_v2.py` + `build_numbers.py`. That is the flow
  that already works; the browser approach caused the drift and low quality.
- Do not skip the intro/outro/memorization scenes — they are part of the deliverable.
- Do not invent fonts/colors/structure — read the design files; they are the source of truth.
