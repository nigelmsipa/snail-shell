# Snail Read-Along — Handoff / Continuation Guide

**Purpose of this file:** so a fresh AI (or Nigel) can pick up this project cold —
e.g. when Claude credits run out — without re-deriving everything. Keep it current.
Last updated: 2026-06-16.

---

## 1. What this project is

"YouTube for documents," applied first to the Bible. Each chapter is rendered as a
**read-along**: audio + the text, with the spoken word highlighted in real time.
Two ways a chapter gets made:

- **Align (cheap, CPU/GPU):** we already have human narration audio. We force-align
  the known text to the audio to get per-word timestamps. No TTS.
- **TTS (expensive, needs GPU):** we synthesize the audio (Kokoro / VibeVoice), then align.

Per chapter we always write the **same artifact set** (slug = `<book>-NN`, NN = zero-padded chapter):

| File | What it is |
|---|---|
| `<slug>.opus` | trimmed chapter audio |
| `<slug>.txt` | chapter text (display spelling) |
| `<slug>.versemap.json` | verse → word-range map |
| `<slug>.json` | sentence-level cues (`start_ms`/`end_ms`/`text`) + duration |
| `<slug>-aligned.json` | same as above PLUS per-word `words[]` (`t`/`s`/`e` ms) |
| `<slug>-words.html` | standalone word-by-word player (self-contained) |

---

## 2. The three translations and WHERE THEY LIVE (read this — there's a known problem)

| Translation | Narration | Location | Naming | State |
|---|---|---|---|---|
| **BSB** (Berean Standard) | Davis (human) | `~/wolf-and-word/` **(repo root)** | `genesis-01-words.html` | ✅ complete, 1190 ch |
| **Geneva 1599** | Geneva Audio Bible (human, YouTube) | `~/geneva/` | `genesis-01-words.html` | 🔄 aligning now |
| **Young's Literal (YLT)** | TTS (`ylt_render.py`) | `~/wolf-and-word/ylt/` | `1corinthians-01.mp3` + `.txt` | ❌ audio+text only, NOT aligned |

### ⚠️ KNOWN ORGANIZATION DEBT (flagged 2026-06-16)
The slug `genesis-01` encodes **no translation**. All three translations want the
exact same filenames. They currently don't collide ONLY because they sit in different
directories. Problems this causes:

1. Merging translations into one app library (the à-la-carte Bible-app goal) → filenames
   are ambiguous and overwrite each other.
2. BSB chapters are dumped loose in the repo root, mixed with source code (1190 files),
   plus a stray `Alchol-words.html` from an unrelated Natural Reader test.

**Recommended fix (NOT yet done — needs Nigel's sign-off):** namespace by translation,
directory-per-translation:
```
translations/bsb/genesis-01.*
translations/geneva/genesis-01.*
translations/ylt/genesis-01.*
```
each with its own `manifest.tsv`. **This is a real refactor, not a `mv`:** the BSB
read-along is wired to repo root by `*-index.html` pages and the build scripts
(`bible_build.py`, `bsb_build.py`, `bible_index.py`, `bible_player.py`, `server.py`).
Those must be updated in lockstep with any move. Do not move files without updating refs.

---

## 3. Geneva batch — how to run / resume

The Geneva batch is **resume-safe** — a reboot/crash loses no completed data. It works at
**book granularity**: a fully-aligned book drops `<slug>.geneva.done`; a partial book is
re-run from scratch (idempotent — overwrites). On 2026-06-16 a reboot interrupted it with
18/1189 chapters done across 7 OT books; restarting just re-runs those partial books.

**Resume / start:**
```bash
cd /home/nigel/wolf-and-word
MAXJOBS=8 setsid nohup ./geneva_batch.sh > ~/geneva/logs_nohup.out 2>&1 &
```
`setsid nohup … &` detaches it so it survives the terminal/session closing.

**Watch progress:**
```bash
cat ~/geneva/STATUS.md            # auto-updated: done books / aligned chapter count
tail -f ~/geneva/logs/MAIN.log    # per-book start/DONE/FAILED
ls ~/geneva/*.geneva.done | wc -l # books finished (of 66)
ls ~/geneva/*-words.html | wc -l  # chapters finished (of 1189)
```

**Check it's alive / kill it:**
```bash
pgrep -af geneva_batch
pkill -f geneva_batch.sh
```

### Key pieces the Geneva batch depends on
- `geneva_batch.sh` — parallel driver, resume logic, writes `STATUS.md`.
- `align_book_tw.py` — the aligner. Aligns a WHOLE book in one pass (no per-chapter skip).
  Boundaries come from `tw_boundaries.py` (anchors known Geneva text to the auto-caption's
  timestamped word stream — robust to music intros / missing "chapter N" announcements).
  Then MMS forced-alignment per chapter. Archaic spelling is DISPLAYED; modern spelling ALIGNS.
- `~/.snail-align-venv/bin/python` — the venv with torch/torchaudio (MMS_FA). **CPU on this box**
  (no GPU here; GPU work goes to rented RunPod boxes).
- `~/geneva-text/GENEVA.txt` — source text (4.6 MB, all 66 books, `Book C:V` lines).
- `~/geneva/manifest.tsv` — 66 rows: `slug<TAB>Book<TAB>opus_path<TAB>vtt_path`.
- `~/geneva-audio/*.opus` + `*.en-orig.vtt` — narration audio + auto-caption transcripts.
- `make_geneva_manifest.py` — (re)builds the manifest if needed.

---

## 4. Other build scripts (reference)
- `bsb_build.py` / `bible_build.py` — build BSB chapters / index pages.
- `bible_index.py`, `bible_player.py` — index + player generation.
- `align_book.py`, `align_book_vtt.py`, `align_from_audio.py`, `align_words.py` — alignment
  variants (vtt-driven, reverse-align-from-audio, word-level).
- `ylt_render.py` — TTS render for Young's. `render.py` (Kokoro), `render-vibevoice.py`.
- `add_words.py` — holds `PLAYER` HTML template injected into `-words.html`.
- `server.py` — local dev server.

---

## 5. Immediate next steps (priority order)
1. **Let the Geneva batch finish** (running now, CPU, MAXJOBS=8). Watch `STATUS.md`.
2. **Decide the translation namespacing** (§2 debt) before adding more translations or
   building the unified library. Get Nigel's call on directory-per-translation layout.
3. **Align YLT** — audio + text exist in `ylt/`, just needs the align step run per book.
4. Clean the stray `Alchol-words.html` out of the repo root.
