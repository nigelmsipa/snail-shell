# Bible-in-a-Year

The Wolf & Word 365-day reading plan, as production data.

A **daily movement** is a day's reading chosen to be a unit the text already has — it begins
where something begins and ends where something ends, and it never cuts through a scene.
The reasoning behind that, and the rules that protect it, are in
[`governing-specification.md`](governing-specification.md). Read it before changing anything
structural.

## Layout

```
bible-in-a-year/
  README.md                          you are here — where to change what
  governing-specification.md         why the plan is shaped this way; the rules
  source/
    Wolf-and-Word-...-v0.2-...md     APPROVED calendar. Authoritative. Hand-edited.
  master-calendar/
    master-plan.json                 GENERATED. Translation-agnostic 365-day plan.
    master-plan.schema.json          Hand-edited schema for the above.
  editions/
    kjv/
      overlay.json                   GENERATED. KJV display + measurements, by day id.
      overlay.schema.json            Hand-edited schema for the above.
  audits/
    validation-report.md             GENERATED. Measured results of the last validation.
  scripts/
    biay_common.py                   canon, verse identities, reference parsing, upstream loader
    build-master-plan.py             source .md  ->  master-plan.json + overlay.json
    validate-master-plan.py          the validator (non-zero exit on any failure)
    test-validator.py                negative tests: proves the validator can fail
```

`master-plan.json`, `overlay.json` and `validation-report.md` are **generated**. Never hand-edit
them — your change will be erased by the next build. Edit the source document or the builder.

## Build and validate

```bash
cd bible-in-a-year/scripts
python3 build-master-plan.py
python3 validate-master-plan.py --report ../audits/validation-report.md
python3 test-validator.py
```

No third-party dependencies. Python 3.10+. If `jsonschema` happens to be installed, the
validator additionally checks both files against their schemas; if not, it says so and its
own checks still run.

The upstream structural repository must be checked out as a sibling directory:
`../../memory-method-bible`. It is read **read-only** and must never be modified from here.

---

## Where do I change…?

### …a structural boundary — where a day starts or ends

**Three files, in this order.**

1. `source/Wolf-and-Word-Bible-in-a-Year-v0.2-Second-Pass.md` — the approved calendar. Edit
   the `### Day N` record: its `Reading`, `Included structure`, `Daily movement`,
   `Why it begins and ends here`, `Endpoint`, `Review`, and the `KJV load` line. If you move
   a boundary, **both adjacent days change** — the verse the day loses is the verse its
   neighbour gains, or canonical coverage breaks.
2. Rebuild: `python3 scripts/build-master-plan.py`.
3. Validate: `python3 scripts/validate-master-plan.py --report ../audits/validation-report.md`.

Do **not** edit `master-plan.json` directly.

Before you move a boundary, check the constraint that outranks everything: the new endpoint
must not fall inside an upstream scene. The validator catches this independently, so a bad
boundary fails the build rather than shipping — but it is faster to check first in
`../../memory-method-bible/data/base-structure/<book>-base.json`.

Changing a reading assignment is a **MAJOR** version bump (see §6 of the specification).

### …a KJV measurement — word count, reading or audio duration

`editions/kjv/overlay.json`, via the builder.

Per-day word counts are carried from the approved source document's `KJV load` line, so the
authoritative place to change one is the **source document**, then rebuild. The overlay's
`reading_duration_minutes` (200 wpm) and `audio_duration_minutes_provisional` (155 wpm) are
derived from the word count — the validator recomputes both and fails on disagreement, so
never edit a duration by hand.

`independent_measurement` is this repository's own recount over the Pure Cambridge Edition,
kept for audit. It does not overwrite the approved figure; where the two differ the delta is
reported in `audits/validation-report.md` as a source-data note.

Once real narration exists, replace the provisional audio figure with the measured duration
in the overlay and change `measurement_method.audio_status`. That is an overlay change only —
the master plan is untouched.

### …a translation-specific note

`editions/<abbr>/overlay.json` → that day's `notes` array (or `versification` array for a
numbering difference).

Never in `master-plan.json`. The validator scans every master day record for translation
fields — `word_count`, `reading_duration_minutes`, `quotation`, `display_reference` and
others — and fails if one appears.

To add a whole new translation, create `editions/<abbr>/overlay.json` keyed by the same
`ww-biay-NNN` day ids. Nothing in `master-calendar/` changes.

The distinction that catches people out: a **versification** note (3 John 14 vs 15) belongs
in both places — the master plan records the canonical position in `notes.versification`,
the overlay records the display mapping. A **textual-history** note (Mark 16:9–20) is
edition-level; the master plan carries only the neutral record that the passage is disputed,
and the reading itself never changes.

### …a Word-of-the-Day link

**Not here.** Word of the Day is a separate product and its editorial content must not enter
this calendar.

Build it in its own file, keyed by `day_id`:

```json
{ "day_id": "ww-biay-283", "language": "greek", "lemma": "…", "gloss": "…" }
```

The dependency runs one way — the word study references the calendar; the calendar never
references the word study. `master-plan.json` → `coordinated_products.join_keys` lists the
three legal join keys: `day_id`, verse-id spans, and upstream `scene_id`.

If you find yourself wanting to change a day's boundary so a particular word lands on it,
stop: that inverts the boundary hierarchy. The calendar is decided first.

### …a Slow Bible / pericope link

**Not here either**, and for the same reason.

Slow Bible works at pericope grain, which is upstream's **scene**, not the daily movement.
Key that product to `scene_id` (`genesis.H.92`) rather than `day_id`, and derive the day
from the calendar when you need it: every day record lists its `structure.scene_ids`, so
scene → day is a lookup, not a duplicated field.

---

## What the validator guarantees

Non-zero exit if: the plan is not exactly 365 days; a day id or ordinal is missing,
duplicated or out of order; a calendar date is missing, duplicated or out of order; a
canonical verse is missing or read twice; a day divides an upstream scene; a story or scene
id does not exist upstream; an endpoint type or review status is invalid; a KJV overlay day
does not resolve to a master day; translation-specific measurement appears in the master
plan; or the intentional 2 Peter/Jude sequence exception is undocumented.

Upstream mapping problems are reported separately and do **not** fail the build — a gap in
`memory-method-bible` is upstream's to fix, and this repository records it rather than
papering over it.

## The one intentional order exception

Day 358 reads 2 Peter **and Jude**; the Johannine letters follow on Day 359. Jude is
therefore read before 1–3 John rather than after them, because 2 Peter 2 and Jude 4–18 are
so closely related that hearing them apart loses the point.

This is deliberate and approved. It is recorded in `master-plan.json` →
`sequence_exceptions`, back-referenced from both days, and the validator **fails if that
record is removed**. Do not "fix" it.
