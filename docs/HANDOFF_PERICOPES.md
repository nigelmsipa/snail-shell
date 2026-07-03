# Handoff — Pericope splitting (snail read-along footholds)

## State now
- Method APPROVED by user on a hard sample (Genesis 27 → 8 units A–H, cut on dramatic beats). He said "I like your splits, stick you on the pericopes."
- Survey done (Genesis): chapters 1–11 scenes are already foothold-sized; the **Abraham / Jacob / Joseph cycles have whole-chapter scenes** (24:1-67, 27:1-40, 41:1-46, etc.) — that's where the work is.
- NOTHING mass-produced yet. No units files written except the strawman `genesis-01-units.json`.
- Letter on-screen placement is **UNDECIDED** (he's sleeping on it). Leaning: clean video title (no letter) + letters/timestamps in the YouTube **description** (native chapter markers) + full letters in the Wolf app. So do NOT treat the on-screen `A.` prefix as final.
- `make_youtube.py` engine is ready: `--scene-src`, `--scene-tier {story,scene}`, `--units <file>`. nord theme + pericope/units code NOT git-committed yet.

## Next action
Produce per-chapter **units** splits for Genesis in reviewable batches, starting with the flagged long scenes. For each: present verse-ranges + short labels for his VETO first, then write the JSON. Format:
```json
{"book":"Genesis","chapter":27,"units":[
  {"letter":"A","title":"Isaac's charge to Esau","start_verse":1,"end_verse":4}, ...]}
```

## Goal
Subdivide the long memory-method-bible scenes into chapter-bound, lettered, complete-thought "footholds" (~2–8 verses each). One asset, three consumers: read-along on-screen title · auto-generated YouTube description timestamps · Wolf memorization app.

## How
- Scene structure: clone `github.com/nigelmsipa/memory-method-bible` → `data/base-structure/<book>-base.json` (stories→scenes w/ verse refs).
- Precise verse text for cuts: same repo `source-texts/BSB.txt`, verses keyed `Genesis 27:1\t...`.
- Cut on the text's OWN seams: new speaker, scene/location shift, formulaic markers (toledot, "and it was so", "evening and morning"). Letter A/B/C in reading order. Clip cross-chapter scenes to chapter bounds.
- Preview a chapter live: `python3 make_youtube.py genesis-27-aligned.json --layout passage --theme nord --minimal --no-rule --units genesis-27-units.json` (needs the chapter's -aligned.json + .opus present).
- Survey scene lengths: the python snippet in chat (parses base.json refs, flags spans ≥6 verses).

## Gotchas
- **Don't overbuild.** He scolded this twice — do exactly what's asked, minimal. No extra badges/variants unless requested.
- Letter placement UNDECIDED — don't bake the on-screen `A.` prefix as final; keep the clean-title path intact.
- The memory-method-bible clone is in /tmp (not persistent) — re-clone each session.
- His review is required on every split — theological/editorial judgment is HIS; I propose, he vetoes.
- Don't kill/stop RunPod pods to save money (credit is sunk).
- Memory: full context in `project_snail_youtube_variant.md` + `project_wolf_and_word.md` + `reference_memory_method_bible.md`.
