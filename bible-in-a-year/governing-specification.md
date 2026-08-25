# Bible-in-a-Year — governing specification

This document explains why the Wolf & Word Bible-in-a-Year plan is shaped the way it is,
and which file owns which decision. It governs `master-calendar/`, `editions/`, `audits/`
and `scripts/`.

The approved 365-day calendar itself lives in
`source/Wolf-and-Word-Bible-in-a-Year-v0.2-Second-Pass.md`. That document is authoritative
for every reading assignment. Nothing in this repository may rebalance, merge, split,
abbreviate or re-title a reading. The production data is a faithful translation of it into
a form software can check.

---

## 1. Natural literary daily movements

Most year-long plans cut the Bible into equal portions and let the seams fall wherever the
arithmetic puts them — mid-scene, mid-argument, mid-sentence. That produces days that end
on a cliff and days that begin in the middle of someone else's paragraph. The reader learns
the plan's rhythm instead of the book's.

A **daily movement** is the opposite commitment: a day's reading is a unit the text itself
already has. It begins where something begins and ends where something ends. The reader
should be able to say what happened today without reference to yesterday's unfinished
sentence.

This has three consequences that the rest of the specification exists to protect:

1. **Day lengths vary, and that is correct.** Day 227 is 528 words; Day 311 is 3,568. The
   plan optimises for whole movements, not for equal minutes. Load is *reported* so a
   reader knows what is coming; it is not *equalised*.
2. **The unit of structure is not ours to invent.** Books, stories and scenes come from the
   upstream analysis repository. Wolf & Word only decides where to *rest*.
3. **A scene is never divided.** This is the one hard constraint, and the validator
   enforces it independently of what the data claims about itself.

---

## 2. The boundary hierarchy

When choosing where a day ends, prefer the strongest available seam. In order:

| Rank | Endpoint type | Meaning |
|---:|---|---|
| 1 | `book_ending` | The day ends where a book ends. The strongest possible rest. |
| 2 | `story_ending` | The day ends where an upstream story completes. |
| 3 | `major_internal_movement` | The day ends at a decisive turn inside a story — a completed arc of action, a shift of scene or speaker, a resolved crisis. |
| 4 | `strong_scene_ending` | The day ends at a scene that closes firmly, when no higher seam is reachable at a workable load. |
| 5 | **Never divide a scene** | Not a rank — a constraint that overrides all four. If the only way to hit a target load is to cut through a scene, the target load loses. |

Rank 5 is absolute. Ranks 1–4 are preferences: a rank-3 endpoint is not a defect, and a
plan made entirely of rank-1 endpoints would be a plan of wildly unequal days.

Current distribution is reported in `audits/validation-report.md`.

---

## 3. Relationship to the upstream structural repository

The Book → Story → Scene architecture is supplied by:

> **`memory-method-bible`** — https://github.com/nigelmsipa/memory-method-bible
> `data/base-structure/<book>-base.json`

Wolf & Word adds exactly one tier:

```
upstream:        book  →  story  →           scene
wolf & word:     book  →  story  →  DAILY MOVEMENT  →  scene
```

The daily movement is a *grouping* of consecutive whole scenes. It never redefines a scene,
never renames a story, and never introduces a structural tier of its own.

**Rules of engagement with upstream:**

- This repository is **read-only** with respect to `memory-method-bible`. Never edit it to
  make the calendar validate.
- Story and scene identifiers are **resolved by verse containment**, not by transcribing
  the source document's prose. A scene belongs to a day when every verse of the scene falls
  inside that day's reading. This is why the identifiers cannot silently drift out of
  agreement with upstream.
- The exact upstream revision is recorded in `master-plan.json` → `source_structure`,
  including whether the working tree was clean when the plan was built.
- If upstream has no identifier for a canonical verse, the plan records an explicit
  **unresolved mapping** (`structure.unresolved_mappings`) naming the verses. It never
  invents a scene id, and it never drops the verses. Canonical coverage stays complete
  whether or not upstream is complete.

Upstream problems and calendar problems are reported in separate sections and only calendar
problems fail validation. A gap in upstream is upstream's to fix.

---

## 4. Master plan vs edition overlays

```
master-calendar/master-plan.json     structure and canonical references. No translation.
editions/kjv/overlay.json            KJV display, word counts, durations. No structure.
```

**The master plan is translation-agnostic.** It answers *what is read today and why*. It
holds day ids, dates, titles, canonical reference objects, stable verse identities, upstream
story/scene ids, movement summaries, boundary rationale, endpoint type, review status and
notes.

It must never hold: quotations, translation-specific display references, word counts,
reading durations, audio durations, or translation-specific lexical commentary. The
validator scans every day record for these fields and fails if it finds them.

**An edition overlay is keyed by master day id.** It answers *how long is that in this
translation*. Adding a translation means adding `editions/<abbr>/overlay.json`; it never
means touching the master plan. Every overlay day must resolve to a master day, and every
master day must have an overlay record.

Why this split matters concretely: the KJV numbers 3 John as 14 verses; other traditions
number the same material as 15. That is an overlay concern. The master plan reads to
`3JN.1.14` — the end of the book in either tradition — and carries a versification note
explaining the mapping. The structural plan does not change when the edition does.

---

## 5. Separation from Word of the Day and Slow Bible

Word of the Day (Hebrew/Greek word studies) and Slow Bible (pericope-level slow reading)
are **separate coordinated products**, not layers of the calendar.

They are deliberately absent from `master-plan.json`. The v0.2 second pass removed the
Hebrew/Greek word candidate from the core calendar precisely because a word study is an
editorial choice that should be revisable without touching a structural plan, and because
letting a word study influence where a day ends would invert the hierarchy in §2.

They connect by **stable identifier only**:

| Join key | Meaning |
|---|---|
| `day_id` | `ww-biay-283` — attach content to a calendar day |
| verse id spans | `MAT.1.1`–`MAT.4.25` — attach content to a passage |
| upstream `scene_id` | `genesis.A.1` — attach content to a scene |

A Word-of-the-Day file references a `day_id`; the calendar never references the word study.
The dependency runs one way. If the word-study product is deleted tomorrow, the calendar is
unaffected.

---

## 6. Stable identifiers and versioning

**Day identifiers** are `ww-biay-NNN`, zero-padded, matching the ordinal. They are stable
across versions and are the join key for every other product. A day id is never reused for
a different reading.

**Verse identities** are `<BOOKCODE>.<chapter>.<verse>` (`GEN.1.1`, `3JN.1.14`), using
three-character USFM-style book codes. They are independent of any translation's display
numbering, which is what makes a reference object survive a change of edition.

**Story and scene identifiers** are `<book-slug>.<story-letter>[.<scene-number>]`
(`genesis.H`, `genesis.H.92`), matching upstream's own addressing.

**Semantic versioning** of the plan:

| Bump | When |
|---|---|
| MAJOR | A reading assignment changes, a day id changes meaning, or the day count changes. Anything that invalidates an existing reader's progress or an existing overlay. |
| MINOR | New non-structural metadata is added to days; a new note category appears. Backward compatible. |
| PATCH | Prose corrections, rationale rewording, note clarifications. No data consumer changes behaviour. |

The overlay carries its own version and an `applies_to.plan_version`, so a mismatch between
a plan and an overlay is detectable rather than silent.

---

## 7. Review classifications

Two independent axes. **They do not mean the same thing and are never combined into one
score.**

**Boundary review** — confidence in *where the day ends*:

| Status | Meaning |
|---|---|
| `green` | The endpoint is a book ending or a completed story. Settled. |
| `yellow` | The endpoint is a strong internal movement. Structurally sound, but worth a second reading before the plan is published. |
| `red` | The endpoint is unsound and must be changed. **The approved calendar contains none.** |

Yellow is not a defect. It is a scrutiny flag. 185 of 365 days are yellow, which is expected
in a plan that rests at major internal movements rather than only at book endings.

**Load review** — how heavy the day is to read:

`light` · `normal` · `elevated` · `heavy` · `extreme`

Load is descriptive. A heavy day with a green boundary is a *good* day that happens to be
long — Luke 22–24 is one sitting because the passion and resurrection are one movement.
Load never overrides §2.

Repository mapping gaps and textual-overlay notes are recorded as their own note types.
They never turn a structurally sound boundary red.

---

## 8. Cross-book-day policy

Six days join more than one book (currently Days 276, 278, 279, 352, 358, 359).

**A multi-book day is never expressed as one artificial continuous reference.** Each book
gets its own reference object with its own start, end, verse count and display string. There
is no such reference as "Obadiah 1:1 – Jonah 4:11" and the data must not imply one.

Every cross-book day must carry an explicit `notes.cross_book` string naming the books it
joins. The validator fails if a day has more than one book without that note, and fails if
the number of reference objects does not match the number of books.

Cross-book days are only permitted where each book is read **whole**, so that the day is a
sequence of complete book endings rather than a straddle.

---

## 9. Versification policy

The master plan uses the **Protestant canonical versification tradition**, 31,102 verses.
This is a statement about which verses exist, not about which translation is displayed.

Where traditions differ, the rule is:

1. The master plan keeps the canonical identity and does **not** change.
2. An explicit `notes.versification` record on the affected day states what differs, and
   where the master plan sits relative to the divergence.
3. The edition overlay carries the display mapping.

Recorded divergence: **3 John**. The KJV numbers the closing farewell as verse 14 (14 verses
total); Nestle-Aland/UBS-based editions split it into verses 14 and 15 (15 verses total).
The plan reads to `3JN.1.14`, which is the end of the book either way, so no reader loses
text under either numbering.

**Textual history is a separate concern from versification.** Mark 16:9–20 and John
7:53–8:11 are present in the KJV and disputed in the earliest witnesses. These are recorded
as `notes.textual_history` on the affected days and as overlay notes. They are edition-level
facts, not structural defects, and they change no boundary.

---

## 10. Audit and release workflow

```bash
cd bible-in-a-year/scripts

# 1. Rebuild the production data from the approved source document.
python3 build-master-plan.py

# 2. Validate. Non-zero exit means the calendar is broken.
python3 validate-master-plan.py --report ../audits/validation-report.md

# 3. Prove the validator can still fail.
python3 test-validator.py
```

**Release gates — all three must hold:**

1. `validate-master-plan.py` exits 0.
2. `test-validator.py` reports all negative tests passing. A validator that cannot fail
   proves nothing, so this is not optional.
3. `audits/validation-report.md` is regenerated and committed in the same change. The report
   states measured results, not the source document's claims — the "Agrees" column is the
   cross-check between them.

**Never do any of these:**

- Edit `master-plan.json` or `overlay.json` by hand. They are generated. Change the source
  document or the builder, then rebuild.
- Edit `memory-method-bible` to make validation pass.
- Silently "correct" a documented sequence exception. The 2 Peter/Jude ordering is
  intentional and the validator fails if its record is removed.
- Commit a plan whose `source_structure.working_tree_clean` is `false` for a public release.
  It is acceptable during development, but a released plan should be reproducible from a
  committed upstream revision. The current state is recorded in the audit report.
