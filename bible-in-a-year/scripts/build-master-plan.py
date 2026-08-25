#!/usr/bin/env python3
"""Translate the approved v0.2 Markdown calendar into production data.

Reads   bible-in-a-year/source/Wolf-and-Word-Bible-in-a-Year-v0.2-Second-Pass.md
Writes  bible-in-a-year/master-calendar/master-plan.json   (translation-agnostic)
        bible-in-a-year/editions/kjv/overlay.json          (KJV measurements)

The Markdown is authoritative. This script never rebalances, merges, splits or
renames a reading: it only re-expresses the approved calendar as structured data
and resolves upstream story/scene identifiers by verse containment.
"""

from __future__ import annotations

import json
import re
import sys

import biay_common as B

PLAN_ID = "ww-biay"
PLAN_VERSION = "1.0.0"
SOURCE_VERSION = "v0.2-second-pass"

READING_WPM = 200
AUDIO_WPM = 155

# The source document writes an endpoint label in several surface forms. They
# collapse onto the four boundary-hierarchy tiers of the governing specification.
ENDPOINT_TYPES = {
    "book ending": "book_ending",
    "book endings": "book_ending",
    "book": "book_ending",
    "story ending": "story_ending",
    "story": "story_ending",
    "major movement": "major_internal_movement",
    "major internal movement": "major_internal_movement",
    "scene": "strong_scene_ending",
}

BOUNDARY_REVIEW = {"green", "yellow", "red"}
LOAD_REVIEW = {"light", "normal", "elevated", "heavy", "extreme"}

DAY_HEADING = re.compile(r"^### Day (\d+) — ([A-Z][a-z]+) (\d+) — (.+)$")
FIELD = re.compile(r"^- \*\*(.+?):\*\* (.+)$")

FIELD_KEYS = {
    "Reading": "reading",
    "Included structure": "included_structure",
    "Daily movement": "daily_movement",
    "Why it begins and ends here": "boundary_rationale",
    "Endpoint": "endpoint",
    "KJV load": "kjv_load",
    "Review": "review",
    "v0.2 change": "v02_change",
    "Audit note": "audit_note",
}

# --------------------------------------------------------------------------
# Documented, intentional departures from strict canonical book order.
# --------------------------------------------------------------------------

SEQUENCE_EXCEPTIONS = [
    {
        "exception_id": "seq-2peter-jude-before-johannine",
        "kind": "canonical_order_exception",
        "day_ids": ["ww-biay-358", "ww-biay-359"],
        "books_out_of_canonical_order": ["Jude"],
        "canonical_order_expected": [
            "2 Peter", "1 John", "2 John", "3 John", "Jude",
        ],
        "plan_order_used": [
            "2 Peter", "Jude", "1 John", "2 John", "3 John",
        ],
        "summary": (
            "Day 358 reads 2 Peter and Jude together; the three Johannine letters "
            "follow on Day 359. Jude is therefore read before 1-3 John rather than "
            "after them."
        ),
        "rationale": (
            "2 Peter 2 and Jude 4-18 share a sustained literary relationship - the "
            "same false-teacher catalogue, the same Old Testament and intertestamental "
            "exempla in the same order, and largely parallel wording. Reading them in "
            "one sitting lets that relationship be heard, which is the governing purpose "
            "of a daily movement. The Johannine letters form their own coherent unit and "
            "are kept together on the following day."
        ),
        "status": "intentional",
        "approved_in": SOURCE_VERSION,
        "source_evidence": (
            "Controlling change ledger, 'Catholic-letter cluster' row: 'Pairs 2 Peter "
            "with Jude and keeps the three Johannine letters together.'"
        ),
        "do_not_silently_correct": True,
    }
]

BOUNDARY_HIERARCHY = [
    {"rank": 1, "endpoint_type": "book_ending", "label": "Book ending"},
    {"rank": 2, "endpoint_type": "story_ending", "label": "Story ending"},
    {"rank": 3, "endpoint_type": "major_internal_movement", "label": "Major internal movement"},
    {"rank": 4, "endpoint_type": "strong_scene_ending", "label": "Strong scene ending"},
    {"rank": 5, "endpoint_type": None, "label": "Never divide a scene", "constraint": True},
]


def fail(msg: str) -> None:
    print(f"build error: {msg}", file=sys.stderr)
    raise SystemExit(1)


# --------------------------------------------------------------------------
# Markdown parsing
# --------------------------------------------------------------------------


def parse_source(path: str) -> list[dict]:
    """Split the approved document into one raw record per day."""
    with open(path, encoding="utf-8") as fh:
        lines = fh.read().splitlines()

    days: list[dict] = []
    current: dict | None = None
    for line in lines:
        m = DAY_HEADING.match(line)
        if m:
            if current:
                days.append(current)
            current = {
                "ordinal": int(m.group(1)),
                "month_name": m.group(2),
                "day_of_month": int(m.group(3)),
                "title": m.group(4).strip(),
                "fields": {},
            }
            continue
        if line.startswith("## ") and current:
            days.append(current)
            current = None
            continue
        if current is None:
            continue
        fm = FIELD.match(line)
        if fm:
            label, value = fm.group(1).strip(), fm.group(2).strip()
            key = FIELD_KEYS.get(label)
            if key is None:
                fail(f"Day {current['ordinal']}: unrecognised field label {label!r}")
            if key in current["fields"]:
                fail(f"Day {current['ordinal']}: duplicated field {label!r}")
            current["fields"][key] = value
    if current:
        days.append(current)
    return days


def parse_kjv_load(text: str, ordinal: int) -> dict:
    m = re.match(
        r"^([\d,]+) words; ([\d.]+) min reading; ([\d.]+) min audio$", text
    )
    if not m:
        fail(f"Day {ordinal}: unparseable KJV load {text!r}")
    return {
        "word_count": int(m.group(1).replace(",", "")),
        "reading_minutes": float(m.group(2)),
        "audio_minutes": float(m.group(3)),
    }


def parse_review(text: str, ordinal: int) -> tuple[str, str]:
    m = re.match(r"^(\w+) boundary; (\w+) load$", text)
    if not m:
        fail(f"Day {ordinal}: unparseable review {text!r}")
    boundary, load = m.group(1).lower(), m.group(2).lower()
    if boundary not in BOUNDARY_REVIEW:
        fail(f"Day {ordinal}: invalid boundary review {boundary!r}")
    if load not in LOAD_REVIEW:
        fail(f"Day {ordinal}: invalid load review {load!r}")
    return boundary, load


# --------------------------------------------------------------------------
# Structure resolution
# --------------------------------------------------------------------------


def resolve_structure(refs, vrs, scenes_by_book):
    """Resolve upstream story/scene ids by verse containment.

    A scene is *included* when every verse of the scene falls inside the day's
    reading. A scene that only partly overlaps is a divided scene, which the
    governing specification forbids; it is returned so the caller can record it.
    """
    day_ordinals = set()
    for ref in refs:
        a, b = vrs.ordinal(*ref.start), vrs.ordinal(*ref.end)
        day_ordinals.update(range(a, b + 1))

    included_scenes: list[B.Scene] = []
    divided: list[dict] = []
    books = {ref.book for ref in refs}
    for book in books:
        for scene in scenes_by_book.get(book, []):
            a, b = vrs.ordinal(*scene.start), vrs.ordinal(*scene.end)
            scene_ordinals = set(range(a, b + 1))
            overlap = scene_ordinals & day_ordinals
            if not overlap:
                continue
            if overlap == scene_ordinals:
                included_scenes.append(scene)
            else:
                divided.append(
                    {
                        "scene_id": scene.scene_id,
                        "scene_reference": scene.reference_text,
                        "verses_inside_day": len(overlap),
                        "verses_in_scene": len(scene_ordinals),
                    }
                )

    included_scenes.sort(key=lambda s: vrs.ordinal(*s.start))

    # Verses of this day that no upstream scene claims.
    mapped = set()
    for scene in included_scenes:
        a, b = vrs.ordinal(*scene.start), vrs.ordinal(*scene.end)
        mapped.update(range(a, b + 1))
    unmapped = sorted(day_ordinals - mapped)

    story_ids: list[str] = []
    for scene in included_scenes:
        if scene.story_id not in story_ids:
            story_ids.append(scene.story_id)

    return included_scenes, story_ids, divided, unmapped


def condense_ordinals(ordinals, vrs) -> list[dict]:
    """Turn a sorted list of verse ordinals into contiguous, labelled ranges."""
    out = []
    for o in ordinals:
        book, ch, vs = vrs.verses[o]
        if out and out[-1]["_end_ordinal"] == o - 1 and out[-1]["book"] == book:
            out[-1]["_end_ordinal"] = o
            out[-1]["end_verse_id"] = B.verse_id(book, ch, vs)
            out[-1]["verse_count"] += 1
        else:
            out.append(
                {
                    "book": book,
                    "start_verse_id": B.verse_id(book, ch, vs),
                    "end_verse_id": B.verse_id(book, ch, vs),
                    "verse_count": 1,
                    "_end_ordinal": o,
                }
            )
    for r in out:
        r.pop("_end_ordinal")
        a = B.parse_verse_id(r["start_verse_id"])
        b = B.parse_verse_id(r["end_verse_id"])
        r["display"] = (
            f"{a[0]} {a[1]}:{a[2]}"
            if a == b
            else f"{a[0]} {a[1]}:{a[2]}–{b[1]}:{b[2]}"
        )
    return out


# --------------------------------------------------------------------------
# Build
# --------------------------------------------------------------------------


def main() -> int:
    vrs = B.load_versification()
    stories, scenes, upstream_problems = B.load_upstream_structure(vrs)
    if upstream_problems:
        for p in upstream_problems:
            print(f"upstream problem: {p}", file=sys.stderr)

    scenes_by_book: dict[str, list[B.Scene]] = {}
    for scene in scenes.values():
        scenes_by_book.setdefault(scene.book, []).append(scene)
    for lst in scenes_by_book.values():
        lst.sort(key=lambda s: vrs.ordinal(*s.start))

    raw_days = parse_source(B.SOURCE_DOCUMENT)
    if len(raw_days) != 365:
        fail(f"source document yielded {len(raw_days)} day records, expected 365")

    # Independent KJV word measurement, for audit only. Supplied words (which the
    # Pure Cambridge Edition marks with square brackets) are counted, consistent
    # with the approved source document's method; the brackets themselves and any
    # marginal annotation markers are not counted as words.
    measured_words: dict[tuple[str, int, int], int] = {}
    with open(B.UPSTREAM_REFERENCE_TEXT, encoding="utf-8") as fh:
        line_re = re.compile(r"^(.+?) (\d+):(\d+)\t(.*)$")
        for line in fh:
            m = line_re.match(line.rstrip("\n"))
            if not m:
                continue
            book = B.normalize_book(m.group(1))
            body = m.group(4).replace("[", " ").replace("]", " ")
            measured_words[(book, int(m.group(2)), int(m.group(3)))] = len(body.split())

    days: list[dict] = []
    overlay_days: dict[str, dict] = {}

    exception_by_day: dict[str, list[str]] = {}
    for exc in SEQUENCE_EXCEPTIONS:
        for did in exc["day_ids"]:
            exception_by_day.setdefault(did, []).append(exc["exception_id"])

    expected_month, expected_dom = 1, 1

    for raw in raw_days:
        ordinal = raw["ordinal"]
        day_id = f"{PLAN_ID}-{ordinal:03d}"
        f = raw["fields"]
        for required in (
            "reading", "included_structure", "daily_movement",
            "boundary_rationale", "endpoint", "kjv_load", "review",
        ):
            if required not in f:
                fail(f"Day {ordinal}: missing required field {required!r}")

        month = B.MONTH_NUMBER.get(raw["month_name"])
        if month is None:
            fail(f"Day {ordinal}: unknown month {raw['month_name']!r}")
        if (month, raw["day_of_month"]) != (expected_month, expected_dom):
            fail(
                f"Day {ordinal}: calendar date {raw['month_name']} {raw['day_of_month']} "
                f"breaks the perennial sequence (expected "
                f"{B.MONTH_NAMES[expected_month - 1]} {expected_dom})"
            )
        expected_dom += 1
        if expected_dom > B.MONTH_LENGTHS[expected_month - 1]:
            expected_month, expected_dom = expected_month + 1, 1

        refs = B.parse_reading(f["reading"], vrs)
        reference_objects = []
        verse_total = 0
        for ref in refs:
            count = vrs.ordinal(*ref.end) - vrs.ordinal(*ref.start) + 1
            verse_total += count
            chapterless = ref.book in B.SINGLE_CHAPTER_BOOKS
            reference_objects.append(
                {
                    "book": ref.book,
                    "book_code": B.BOOK_CODE[ref.book],
                    "book_slug": B.BOOK_SLUG[ref.book],
                    "book_canonical_order": B.BOOK_ORDER[ref.book],
                    "testament": B.BOOK_TESTAMENT[ref.book],
                    "start": {
                        "chapter": ref.start_chapter,
                        "verse": ref.start_verse,
                        "verse_id": B.verse_id(ref.book, ref.start_chapter, ref.start_verse),
                    },
                    "end": {
                        "chapter": ref.end_chapter,
                        "verse": ref.end_verse,
                        "verse_id": B.verse_id(ref.book, ref.end_chapter, ref.end_verse),
                    },
                    "verse_count": count,
                    "canonical_display": ref.display(chapterless=chapterless),
                    "single_chapter_book": chapterless,
                }
            )

        included_scenes, story_ids, divided, unmapped = resolve_structure(
            refs, vrs, scenes_by_book
        )
        scene_ids = [s.scene_id for s in included_scenes]

        endpoint_label = f["endpoint"].strip()
        endpoint_type = ENDPOINT_TYPES.get(endpoint_label.lower())
        if endpoint_type is None:
            fail(f"Day {ordinal}: unrecognised endpoint {endpoint_label!r}")

        boundary_review, load_review = parse_review(f["review"], ordinal)
        load = parse_kjv_load(f["kjv_load"], ordinal)

        books = []
        for ref in refs:
            if ref.book not in books:
                books.append(ref.book)
        testaments = sorted({B.BOOK_TESTAMENT[b] for b in books})
        if len(testaments) != 1:
            fail(f"Day {ordinal}: reading spans both testaments")

        cross_book_note = None
        if len(books) > 1:
            cross_book_note = (
                "Cross-book day: this reading joins "
                + ", ".join(books)
                + ". Each book is stored as its own canonical reference object; the day "
                  "is never expressed as one artificial continuous reference."
            )

        versification_notes = []
        if "3 John" in books:
            versification_notes.append(
                {
                    "note_id": "versification-3john-14-15",
                    "book": "3 John",
                    "summary": (
                        "The KJV numbers the closing farewell as 3 John 14, giving the "
                        "letter 14 verses. Editions following the Nestle-Aland/UBS "
                        "division split that material into verses 14 and 15, giving 15 "
                        "verses."
                    ),
                    "master_plan_position": (
                        "The master plan uses the 14-verse canonical versification and "
                        "ends the reading at 3JN.1.14, which is the end of the book in "
                        "either tradition. Editions that number a verse 15 must map "
                        "their 14-15 onto this plan's verse 14."
                    ),
                    "affects_coverage": False,
                }
            )

        textual_history_notes = []
        audit_note = f.get("audit_note")
        if audit_note and "Mark 16" in audit_note:
            textual_history_notes.append(
                {
                    "note_id": "textual-history-mark-16-9-20",
                    "passage_verse_ids": ["MRK.16.9", "MRK.16.20"],
                    "summary": (
                        "The longer ending of Mark (16:9-20) is absent from Sinaiticus "
                        "and Vaticanus and is marked or bracketed in many modern "
                        "editions. It is present and unmarked in the KJV."
                    ),
                    "policy": (
                        "Retained as an edition-level textual-history note. It is not a "
                        "boundary defect and does not change the structural plan."
                    ),
                }
            )
        if audit_note and "John 7:53" in audit_note:
            textual_history_notes.append(
                {
                    "note_id": "textual-history-john-7-53-8-11",
                    "passage_verse_ids": ["JHN.7.53", "JHN.8.11"],
                    "summary": (
                        "The pericope adulterae (John 7:53-8:11) is absent from the "
                        "earliest Greek witnesses and is bracketed in many modern "
                        "editions. It is present and unmarked in the KJV."
                    ),
                    "policy": (
                        "Retained as an edition-level textual-history note. It is not a "
                        "boundary defect and does not change the structural plan."
                    ),
                }
            )

        unresolved = []
        if unmapped:
            for rng in condense_ordinals(unmapped, vrs):
                unresolved.append(
                    {
                        "kind": "upstream_structure_mapping_gap",
                        "book": rng["book"],
                        "start_verse_id": rng["start_verse_id"],
                        "end_verse_id": rng["end_verse_id"],
                        "verse_count": rng["verse_count"],
                        "display": rng["display"],
                        "summary": (
                            "These verses are inside the day's canonical reading but no "
                            "upstream story/scene identifier covers them."
                        ),
                        "resolution": "unresolved_upstream",
                        "policy": (
                            "Canonical coverage is retained in full. No scene identifier "
                            "is invented, and memory-method-bible is not modified."
                        ),
                    }
                )

        day = {
            "day_id": day_id,
            "ordinal": ordinal,
            "calendar": {
                "month": month,
                "month_name": raw["month_name"],
                "day_of_month": raw["day_of_month"],
                "label": f"{raw['month_name']} {raw['day_of_month']}",
                "mm_dd": f"{month:02d}-{raw['day_of_month']:02d}",
            },
            "title": raw["title"],
            "testament": testaments[0],
            "books": books,
            "cross_book": len(books) > 1,
            "references": reference_objects,
            "verse_count": verse_total,
            "structure": {
                "source_text": f["included_structure"],
                "story_ids": story_ids,
                "scene_ids": scene_ids,
                "scene_count": len(scene_ids),
                "divided_scenes": divided,
                "unresolved_mappings": unresolved,
            },
            "daily_movement": f["daily_movement"],
            "boundary_rationale": f["boundary_rationale"],
            "endpoint": {
                "type": endpoint_type,
                "source_label": endpoint_label,
                "hierarchy_rank": next(
                    h["rank"] for h in BOUNDARY_HIERARCHY
                    if h["endpoint_type"] == endpoint_type
                ),
            },
            "review": {
                "boundary": boundary_review,
                "load": load_review,
                "source_text": f["review"],
            },
            "notes": {
                "cross_book": cross_book_note,
                "versification": versification_notes,
                "textual_history": textual_history_notes,
                "source_audit_note": audit_note,
                "source_change_note": f.get("v02_change"),
            },
            "sequence_exception_ids": exception_by_day.get(day_id, []),
        }
        days.append(day)

        # ---- KJV overlay ----
        measured = 0
        for ref in refs:
            for v in vrs.span(ref.start, ref.end):
                measured += measured_words[v]

        overlay_notes = []
        if audit_note:
            overlay_notes.append(audit_note)
        for n in textual_history_notes:
            overlay_notes.append(
                f"{n['summary']} {n['policy']}"
            )

        overlay_days[day_id] = {
            "day_id": day_id,
            "ordinal": ordinal,
            "display_references": [r["canonical_display"] for r in reference_objects],
            "display_reference": f["reading"],
            "word_count": load["word_count"],
            "word_count_source": "approved v0.2 source document",
            "reading_duration_minutes": round(load["word_count"] / READING_WPM, 1),
            "reading_duration_minutes_source_stated": load["reading_minutes"],
            "audio_duration_minutes_provisional": round(load["word_count"] / AUDIO_WPM, 1),
            "audio_duration_minutes_source_stated": load["audio_minutes"],
            "independent_measurement": {
                "word_count": measured,
                "delta_vs_source": measured - load["word_count"],
                "text_witness": "Pure Cambridge Edition (memory-method-bible/source-texts/KJV.txt)",
            },
            "versification": (
                [
                    {
                        "note_id": n["note_id"],
                        "kjv_display": "3 John 1-14",
                        "note": n["summary"],
                    }
                    for n in versification_notes
                ]
                or None
            ),
            "notes": overlay_notes or None,
        }

    # ---- Assemble the master plan ----
    ot_days = sum(1 for d in days if d["testament"] == "OT")
    nt_days = sum(1 for d in days if d["testament"] == "NT")
    first_nt = next(d for d in days if d["testament"] == "NT")

    plan = {
        "$schema": "./master-plan.schema.json",
        "plan_id": PLAN_ID,
        "plan_name": "Wolf & Word Bible-in-a-Year",
        "version": PLAN_VERSION,
        "translation_agnostic": True,
        "calendar": {
            "type": "perennial",
            "leap_handling": "non-leap",
            "days": 365,
            "note": (
                "A perennial non-leap calendar: Day 1 is always January 1 and Day 365 is "
                "always December 31. February is always 28 days. In a leap year, February 29 "
                "carries no plan day; readers repeat, rest, or catch up at their discretion."
            ),
        },
        "architecture": {
            "upstream_hierarchy": ["book", "story", "scene"],
            "wolf_and_word_hierarchy": ["book", "story", "daily_movement", "scene"],
            "derived_layer": "daily_movement",
            "note": (
                "Wolf & Word contributes exactly one tier: the daily movement. Books, "
                "stories and scenes are read from memory-method-bible and never redefined "
                "here."
            ),
        },
        "source_structure": B.upstream_revision(),
        "source_document": {
            "title": "Wolf & Word Bible-in-a-Year - Complete Second-Pass Proposal v0.2",
            "version": SOURCE_VERSION,
            "path": "bible-in-a-year/source/Wolf-and-Word-Bible-in-a-Year-v0.2-Second-Pass.md",
            "status": "approved; authoritative for all reading assignments",
        },
        "versification": {
            "tradition": "protestant-canonical",
            "verse_identity_format": "<BOOKCODE>.<chapter>.<verse>",
            "verse_identity_example": "GEN.1.1",
            "canonical_verse_count": len(vrs),
            "note": (
                "Verse identities are stable and independent of any translation's display "
                "numbering. Where an edition numbers differently, the edition overlay "
                "carries the mapping; the master plan does not change."
            ),
        },
        "boundary_hierarchy": BOUNDARY_HIERARCHY,
        "review_vocabulary": {
            "boundary": sorted(BOUNDARY_REVIEW),
            "load": ["light", "normal", "elevated", "heavy", "extreme"],
            "note": (
                "Boundary review and load review are independent. A yellow boundary marks a "
                "strong internal movement worth scrutiny; it does not mean the day is "
                "defective."
            ),
        },
        "sequence_exceptions": SEQUENCE_EXCEPTIONS,
        "coordinated_products": {
            "note": (
                "Word of the Day and Slow Bible/pericope content are separate products. "
                "They join the calendar by stable identifier, never by embedding editorial "
                "content in this file."
            ),
            "join_keys": ["day_id", "reference verse_id spans", "upstream scene_id"],
            "word_of_the_day": {"embedded_here": False},
            "slow_bible_pericopes": {"embedded_here": False},
        },
        "totals": {
            "days": len(days),
            "canonical_verses": sum(d["verse_count"] for d in days),
            "old_testament_days": ot_days,
            "new_testament_days": nt_days,
            "first_new_testament_day": {
                "day_id": first_nt["day_id"],
                "ordinal": first_nt["ordinal"],
                "calendar_label": first_nt["calendar"]["label"],
                "book": first_nt["books"][0],
            },
            "boundary_review": {
                colour: sum(1 for d in days if d["review"]["boundary"] == colour)
                for colour in ("green", "yellow", "red")
            },
        },
        "days": days,
    }

    overlay = {
        "$schema": "./overlay.schema.json",
        "overlay_id": "ww-biay-kjv",
        "edition": {
            "name": "King James Version",
            "abbreviation": "KJV",
            "text_witness": "Pure Cambridge Edition",
            "public_domain": True,
        },
        "version": PLAN_VERSION,
        "applies_to": {"plan_id": PLAN_ID, "plan_version": PLAN_VERSION},
        "measurement_method": {
            "word_count": (
                "Words of the KJV reading text. Supplied words - those the KJV sets in "
                "italics and the Pure Cambridge electronic text marks with square brackets "
                "- are counted, because they are read aloud. Square brackets themselves, "
                "marginal annotations, translators' notes, chapter headings and verse "
                "numbers are not counted."
            ),
            "reading_rate_wpm": READING_WPM,
            "audio_rate_wpm": AUDIO_WPM,
            "audio_status": "provisional; superseded by measured narration duration once recorded",
            "authority": (
                "Per-day word counts are carried from the approved v0.2 source document. "
                "independent_measurement records this repository's own recount for audit; "
                "it does not overwrite the approved figure."
            ),
        },
        "totals": {
            "days": len(overlay_days),
            "word_count": sum(d["word_count"] for d in overlay_days.values()),
            "independent_measurement_word_count": sum(
                d["independent_measurement"]["word_count"] for d in overlay_days.values()
            ),
        },
        "days": overlay_days,
    }

    with open(B.MASTER_PLAN, "w", encoding="utf-8") as fh:
        json.dump(plan, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    with open(B.KJV_OVERLAY, "w", encoding="utf-8") as fh:
        json.dump(overlay, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    print(f"wrote {B.MASTER_PLAN} ({len(days)} days)")
    print(f"wrote {B.KJV_OVERLAY} ({len(overlay_days)} days)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
