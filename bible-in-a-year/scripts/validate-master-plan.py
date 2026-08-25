#!/usr/bin/env python3
"""Validate the Wolf & Word Bible-in-a-Year master plan and its KJV overlay.

Exits non-zero if any of the following is true:

  * the plan does not contain exactly 365 days
  * day ordinals or stable ids are missing, duplicated, or out of order
  * calendar dates are missing, duplicated, or out of order
  * a canonical verse is missing or duplicated
  * a day divides a repository scene
  * a referenced story or scene identifier does not exist upstream
  * an endpoint type or review status is invalid
  * a KJV overlay day does not resolve to a master day
  * translation-specific measurements appear in the master plan
  * the intentional 2 Peter/Jude sequence exception is undocumented

Calendar problems (this repository's responsibility) and upstream mapping
problems (memory-method-bible's responsibility) are reported separately and only
calendar problems fail the build.

Usage:
    python3 validate-master-plan.py [--report PATH] [--quiet]
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter

import biay_common as B

VALID_ENDPOINTS = {
    "book_ending",
    "story_ending",
    "major_internal_movement",
    "strong_scene_ending",
}
VALID_BOUNDARY = {"green", "yellow", "red"}
VALID_LOAD = {"light", "normal", "elevated", "heavy", "extreme"}

# Field names that must never appear anywhere in the master plan's day records.
FORBIDDEN_DAY_KEYS = {
    "kjv_load", "kjv_words", "kjv_word_count", "word_count", "words",
    "reading_minutes", "reading_duration_minutes", "reading_time",
    "audio_minutes", "audio_duration_minutes", "audio_duration_minutes_provisional",
    "quotation", "quote", "verse_text", "text",
    "kjv_display_reference", "kjv_reference", "display_reference",
    "lexical_commentary", "word_of_the_day", "hebrew_word", "greek_word",
    "slow_bible", "pericope_content",
}

REQUIRED_SEQUENCE_EXCEPTION = "seq-2peter-jude-before-johannine"

# Ranges the v0.2 source document flagged as "currently unmapped" upstream. They are
# re-checked against the live upstream data on every run rather than assumed, so the
# report always states what is true now instead of what was true when the proposal
# was written.
GENESIS_MAINTENANCE_RANGES = [
    ("Genesis 6:1-8", ("Genesis", 6, 1), ("Genesis", 6, 8)),
    ("Genesis 11:10-26", ("Genesis", 11, 10), ("Genesis", 11, 26)),
    ("Genesis 25:12-18", ("Genesis", 25, 12), ("Genesis", 25, 18)),
]


def investigate_genesis_gaps(vrs, scenes) -> list[dict]:
    """Determine whether the flagged Genesis verses really lack upstream mapping."""
    out = []
    for label, start, end in GENESIS_MAINTENANCE_RANGES:
        a, b = vrs.ordinal(*start), vrs.ordinal(*end)
        wanted = set(range(a, b + 1))
        covering = []
        for sc in scenes.values():
            if sc.book != "Genesis":
                continue
            sa, sb = vrs.ordinal(*sc.start), vrs.ordinal(*sc.end)
            if set(range(sa, sb + 1)) & wanted:
                covering.append(sc)
        covering.sort(key=lambda s: vrs.ordinal(*s.start))
        covered = set()
        for sc in covering:
            sa, sb = vrs.ordinal(*sc.start), vrs.ordinal(*sc.end)
            covered.update(set(range(sa, sb + 1)) & wanted)
        out.append(
            {
                "range": label,
                "verses": len(wanted),
                "verses_mapped": len(covered),
                "fully_mapped": covered == wanted,
                "scenes": [
                    {"scene_id": s.scene_id, "reference": s.reference_text, "name": s.scene_name}
                    for s in covering
                ],
                "unmapped_verse_ids": sorted(
                    B.verse_id(*vrs.verses[o]) for o in (wanted - covered)
                ),
            }
        )
    return out



class Findings:
    def __init__(self):
        self.calendar_errors: list[str] = []
        self.upstream_issues: list[str] = []
        self.warnings: list[str] = []

    def error(self, msg: str) -> None:
        self.calendar_errors.append(msg)

    def upstream(self, msg: str) -> None:
        self.upstream_issues.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)

    @property
    def ok(self) -> bool:
        return not self.calendar_errors


def walk_keys(obj, path=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield path, k
            yield from walk_keys(v, f"{path}.{k}" if path else k)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk_keys(v, f"{path}[{i}]")


def validate(plan: dict, overlay: dict, vrs, stories, scenes, upstream_problems) -> tuple[Findings, dict]:
    f = Findings()
    stats: dict = {}

    for p in upstream_problems:
        f.upstream(p)

    days = plan.get("days", [])

    # ---- 1. exactly 365 days -------------------------------------------
    if len(days) != 365:
        f.error(f"plan contains {len(days)} day records; exactly 365 are required")

    # ---- 2. ordinals and stable ids ------------------------------------
    seen_ids: Counter = Counter()
    for i, d in enumerate(days):
        did, ordinal = d.get("day_id"), d.get("ordinal")
        if not did:
            f.error(f"day at index {i}: missing day_id")
            continue
        seen_ids[did] += 1
        if not re.fullmatch(r"ww-biay-\d{3}", did):
            f.error(f"{did}: day_id does not match the stable ww-biay-NNN form")
        if ordinal is None:
            f.error(f"{did}: missing ordinal")
            continue
        if ordinal != i + 1:
            f.error(f"{did}: ordinal {ordinal} is out of order at index {i} (expected {i + 1})")
        if did != f"ww-biay-{ordinal:03d}":
            f.error(f"{did}: day_id does not agree with ordinal {ordinal}")
    for did, n in seen_ids.items():
        if n > 1:
            f.error(f"{did}: day_id appears {n} times; day ids must be unique")

    # ---- 3. calendar dates ---------------------------------------------
    expected_month, expected_dom = 1, 1
    seen_dates: Counter = Counter()
    for d in days:
        did = d.get("day_id", "?")
        cal = d.get("calendar")
        if not cal:
            f.error(f"{did}: missing calendar block")
            continue
        month, dom = cal.get("month"), cal.get("day_of_month")
        if month is None or dom is None:
            f.error(f"{did}: missing calendar month or day_of_month")
            continue
        seen_dates[(month, dom)] += 1
        if (month, dom) != (expected_month, expected_dom):
            f.error(
                f"{did}: calendar date {month:02d}-{dom:02d} is out of order "
                f"(expected {expected_month:02d}-{expected_dom:02d} on a perennial "
                f"non-leap calendar)"
            )
        expected_dom += 1
        if expected_dom > B.MONTH_LENGTHS[expected_month - 1]:
            expected_month, expected_dom = expected_month + 1, 1
        if cal.get("mm_dd") != f"{month:02d}-{dom:02d}":
            f.error(f"{did}: mm_dd {cal.get('mm_dd')!r} disagrees with month/day_of_month")
        if cal.get("month_name") != B.MONTH_NAMES[month - 1]:
            f.error(f"{did}: month_name {cal.get('month_name')!r} disagrees with month {month}")
    for date, n in seen_dates.items():
        if n > 1:
            f.error(f"calendar date {date[0]:02d}-{date[1]:02d} is used by {n} days")

    # ---- 4. canonical coverage -----------------------------------------
    owner: dict[int, str] = {}
    coverage: Counter = Counter()
    duplicated: list[str] = []
    for d in days:
        did = d.get("day_id", "?")
        refs = d.get("references") or []
        if not refs:
            f.error(f"{did}: no canonical reference objects")
        running = 0
        for r in refs:
            try:
                start = B.parse_verse_id(r["start"]["verse_id"])
                end = B.parse_verse_id(r["end"]["verse_id"])
            except (KeyError, ValueError) as exc:
                f.error(f"{did}: unusable reference verse identity ({exc})")
                continue
            if start[0] != r.get("book") or end[0] != r.get("book"):
                f.error(f"{did}: reference book {r.get('book')!r} disagrees with its verse ids")
            try:
                span = vrs.span(start, end)
            except (KeyError, ValueError) as exc:
                f.error(f"{did}: bad reference span ({exc})")
                continue
            if r.get("verse_count") != len(span):
                f.error(
                    f"{did}: reference {r.get('canonical_display')} declares "
                    f"{r.get('verse_count')} verses but spans {len(span)}"
                )
            running += len(span)
            for v in span:
                o = vrs.ordinal(*v)
                coverage[o] += 1
                if o in owner:
                    duplicated.append(
                        f"{B.verse_id(*v)} appears on {owner[o]} and again on {did}"
                    )
                else:
                    owner[o] = did
        if d.get("verse_count") != running:
            f.error(f"{did}: verse_count {d.get('verse_count')} disagrees with its references ({running})")

    missing = [B.verse_id(*v) for i, v in enumerate(vrs.verses) if coverage[i] == 0]
    if missing:
        f.error(f"{len(missing)} canonical verses are not read by any day (first: {missing[0]})")
    if duplicated:
        f.error(f"{len(duplicated)} canonical verses are read more than once (first: {duplicated[0]})")

    stats["missing_verses"] = missing
    stats["duplicated_verses"] = duplicated
    stats["covered_verses"] = len(owner)

    # ---- 5 & 6. structure identifiers and scene division ----------------
    divided_total = 0
    unresolved_records: list[tuple[str, dict]] = []
    for d in days:
        did = d.get("day_id", "?")
        st = d.get("structure") or {}
        for sid in st.get("story_ids", []):
            if sid not in stories:
                f.error(f"{did}: story identifier {sid!r} does not exist upstream")
        for sid in st.get("scene_ids", []):
            if sid not in scenes:
                f.error(f"{did}: scene identifier {sid!r} does not exist upstream")
        if st.get("scene_count") != len(st.get("scene_ids", [])):
            f.error(f"{did}: scene_count disagrees with scene_ids")
        for div in st.get("divided_scenes", []):
            divided_total += 1
            f.error(
                f"{did}: divides upstream scene {div.get('scene_id')} "
                f"({div.get('verses_inside_day')} of {div.get('verses_in_scene')} verses) - "
                f"the governing specification forbids dividing a scene"
            )
        for un in st.get("unresolved_mappings", []):
            unresolved_records.append((did, un))

    # Independently re-derive scene division from the plan's own references, so a
    # build that simply forgot to populate divided_scenes cannot pass.
    for scene in scenes.values():
        a, b = vrs.ordinal(*scene.start), vrs.ordinal(*scene.end)
        owners = {owner.get(o) for o in range(a, b + 1)}
        owners.discard(None)
        if len(owners) > 1:
            divided_total += 1
            f.error(
                f"upstream scene {scene.scene_id} ({scene.reference_text}) is split "
                f"across days {sorted(owners)}"
            )
    stats["divided_scenes"] = divided_total

    # Any verse the plan reads that no upstream scene covers must be declared.
    scene_covered: set[int] = set()
    for scene in scenes.values():
        a, b = vrs.ordinal(*scene.start), vrs.ordinal(*scene.end)
        scene_covered.update(range(a, b + 1))
    undeclared: list[str] = []
    declared_ids: set[str] = set()
    for did, un in unresolved_records:
        try:
            s = vrs.ordinal(*B.parse_verse_id(un["start_verse_id"]))
            e = vrs.ordinal(*B.parse_verse_id(un["end_verse_id"]))
            declared_ids.update(range(s, e + 1))
        except (KeyError, ValueError):
            f.error(f"{did}: unresolved_mappings record has an unusable verse identity")
    for o in owner:
        if o not in scene_covered and o not in declared_ids:
            undeclared.append(B.verse_id(*vrs.verses[o]))
    if undeclared:
        f.error(
            f"{len(undeclared)} canonical verses have no upstream scene and no explicit "
            f"unresolved-mapping record (first: {undeclared[0]})"
        )
    ss = plan.get("source_structure") or {}
    if ss.get("working_tree_clean") is False:
        n = len(ss.get("uncommitted_base_structure_files") or [])
        f.upstream(
            f"Upstream provenance: memory-method-bible was built from revision "
            f"{(ss.get('revision') or '?')[:12]} with an unclean working tree "
            f"({n} modified base-structure file(s)). The story/scene identifiers therefore "
            f"reflect a working tree, not a published commit. Commit or stash upstream and "
            f"rebuild before a public release."
        )

    stats["genesis_maintenance"] = investigate_genesis_gaps(vrs, scenes)
    for g in stats["genesis_maintenance"]:
        if not g["fully_mapped"]:
            f.upstream(
                f"Genesis structural mapping: {g['range']} still has "
                f"{g['verses'] - g['verses_mapped']} verse(s) with no upstream scene "
                f"(first: {g['unmapped_verse_ids'][0]}). Recorded as an upstream "
                f"source-maintenance issue; not repaired here."
            )

    stats["unresolved_mappings"] = unresolved_records
    if unresolved_records:
        for did, un in unresolved_records:
            f.upstream(
                f"{did}: {un.get('display', '?')} ({un.get('verse_count')} verses) has no "
                f"upstream story/scene identifier"
            )

    # ---- 7. endpoint and review vocabularies ---------------------------
    for d in days:
        did = d.get("day_id", "?")
        ep = (d.get("endpoint") or {}).get("type")
        if ep not in VALID_ENDPOINTS:
            f.error(f"{did}: invalid endpoint type {ep!r}")
        rank = (d.get("endpoint") or {}).get("hierarchy_rank")
        expected_rank = {
            "book_ending": 1, "story_ending": 2,
            "major_internal_movement": 3, "strong_scene_ending": 4,
        }.get(ep)
        if expected_rank is not None and rank != expected_rank:
            f.error(f"{did}: endpoint hierarchy_rank {rank} disagrees with type {ep}")
        rv = d.get("review") or {}
        if rv.get("boundary") not in VALID_BOUNDARY:
            f.error(f"{did}: invalid boundary review status {rv.get('boundary')!r}")
        if rv.get("load") not in VALID_LOAD:
            f.error(f"{did}: invalid load review status {rv.get('load')!r}")

    # ---- cross-book policy ---------------------------------------------
    cross_book_days = []
    for d in days:
        did = d.get("day_id", "?")
        books = d.get("books") or []
        is_cross = len(books) > 1
        if d.get("cross_book") != is_cross:
            f.error(f"{did}: cross_book flag disagrees with its book list")
        if len(d.get("references") or []) != len(books) and is_cross:
            f.error(f"{did}: a multi-book day must carry one reference object per book")
        if is_cross:
            if not (d.get("notes") or {}).get("cross_book"):
                f.error(f"{did}: cross-book day carries no explicit cross-book note")
            cross_book_days.append(d)
    stats["cross_book_days"] = cross_book_days

    # ---- 8. overlay resolution -----------------------------------------
    master_ids = {d.get("day_id") for d in days}
    overlay_days = overlay.get("days", {})
    for key, od in overlay_days.items():
        if key not in master_ids:
            f.error(f"KJV overlay day {key!r} does not resolve to a master day")
        if od.get("day_id") != key:
            f.error(f"KJV overlay {key!r}: day_id field disagrees with its key")
    for did in master_ids:
        if did not in overlay_days:
            f.error(f"master day {did} has no KJV overlay record")

    # ---- 9. no translation-specific data in the master plan ------------
    for d in days:
        did = d.get("day_id", "?")
        for path, key in walk_keys(d):
            if key in FORBIDDEN_DAY_KEYS:
                f.error(
                    f"{did}: translation-specific field {key!r} appears in the master "
                    f"plan at {path or '<day>'}; it belongs in an edition overlay"
                )
    blob = json.dumps(plan, ensure_ascii=False)
    for token in ("words/min", "wpm", "min audio", "min reading"):
        if token in blob:
            # Rate vocabulary is allowed only in prose that explains the separation.
            if token in ("min audio", "min reading"):
                f.error(f"master plan contains a translation-specific duration string ({token!r})")

    # ---- 10. sequence exception documented -----------------------------
    exceptions = plan.get("sequence_exceptions") or []
    by_id = {e.get("exception_id"): e for e in exceptions}
    exc = by_id.get(REQUIRED_SEQUENCE_EXCEPTION)
    if exc is None:
        f.error(
            "the intentional 2 Peter/Jude sequence exception is undocumented: no "
            f"sequence_exceptions entry with id {REQUIRED_SEQUENCE_EXCEPTION!r}"
        )
    else:
        for field in ("summary", "rationale", "status", "approved_in", "day_ids"):
            if not exc.get(field):
                f.error(f"sequence exception {REQUIRED_SEQUENCE_EXCEPTION}: missing {field}")
        if exc.get("status") != "intentional":
            f.error(f"sequence exception {REQUIRED_SEQUENCE_EXCEPTION}: status must be 'intentional'")
        for did in exc.get("day_ids", []):
            if did not in master_ids:
                f.error(f"sequence exception references unknown day {did}")
            else:
                day = days[int(did.rsplit("-", 1)[1]) - 1]
                if REQUIRED_SEQUENCE_EXCEPTION not in day.get("sequence_exception_ids", []):
                    f.error(f"{did}: does not back-reference sequence exception {REQUIRED_SEQUENCE_EXCEPTION}")

    # Independently detect canonical-order departures and require each to be documented.
    documented_days: set[str] = set()
    for e in exceptions:
        documented_days.update(e.get("day_ids", []))
    order_departures = []
    last_seen = 0
    for d in days:
        for r in d.get("references") or []:
            n = r.get("book_canonical_order")
            if n is None:
                continue
            if n < last_seen:
                order_departures.append(
                    {
                        "day_id": d.get("day_id"),
                        "book": r.get("book"),
                        "book_canonical_order": n,
                        "follows_book_order": last_seen,
                        "documented": d.get("day_id") in documented_days
                        or any(
                            r.get("book") in e.get("books_out_of_canonical_order", [])
                            for e in exceptions
                        ),
                    }
                )
            last_seen = max(last_seen, n)
    for od in order_departures:
        if not od["documented"]:
            f.error(
                f"{od['day_id']}: {od['book']} is read out of canonical order and no "
                f"sequence exception documents it"
            )
    stats["order_departures"] = order_departures
    stats["sequence_exceptions"] = exceptions

    # ---- totals for the report -----------------------------------------
    stats["days"] = len(days)
    stats["ot_days"] = sum(1 for d in days if d.get("testament") == "OT")
    stats["nt_days"] = sum(1 for d in days if d.get("testament") == "NT")
    stats["boundary_counts"] = Counter(
        (d.get("review") or {}).get("boundary") for d in days
    )
    stats["load_counts"] = Counter((d.get("review") or {}).get("load") for d in days)
    stats["endpoint_counts"] = Counter((d.get("endpoint") or {}).get("type") for d in days)

    first_nt = next((d for d in days if d.get("testament") == "NT"), None)
    stats["first_nt_day"] = first_nt

    # Declared totals must agree with the data.
    declared = plan.get("totals") or {}
    checks = {
        "days": stats["days"],
        "canonical_verses": stats["covered_verses"],
        "old_testament_days": stats["ot_days"],
        "new_testament_days": stats["nt_days"],
    }
    for k, actual in checks.items():
        if declared.get(k) != actual:
            f.error(f"plan totals.{k} says {declared.get(k)} but the data gives {actual}")
    for colour in ("green", "yellow", "red"):
        if (declared.get("boundary_review") or {}).get(colour) != stats["boundary_counts"][colour]:
            f.error(
                f"plan totals.boundary_review.{colour} says "
                f"{(declared.get('boundary_review') or {}).get(colour)} but the data gives "
                f"{stats['boundary_counts'][colour]}"
            )

    # ---- overlay measurements -------------------------------------------
    loads = []
    for d in days:
        od = overlay_days.get(d.get("day_id"))
        if not od:
            continue
        wc = od.get("word_count")
        if not isinstance(wc, int) or wc <= 0:
            f.error(f"{d.get('day_id')}: KJV overlay word_count is missing or non-positive")
            continue
        expected_reading = round(wc / 200, 1)
        expected_audio = round(wc / 155, 1)
        if od.get("reading_duration_minutes") != expected_reading:
            f.error(
                f"{d.get('day_id')}: overlay reading duration "
                f"{od.get('reading_duration_minutes')} != {expected_reading} at 200 wpm"
            )
        if od.get("audio_duration_minutes_provisional") != expected_audio:
            f.error(
                f"{d.get('day_id')}: overlay audio duration "
                f"{od.get('audio_duration_minutes_provisional')} != {expected_audio} at 155 wpm"
            )
        stated = od.get("reading_duration_minutes_source_stated")
        if stated is not None and abs(stated - expected_reading) > 0.15:
            f.warn(
                f"{d.get('day_id')}: source-stated reading minutes {stated} differs from "
                f"{expected_reading} computed at 200 wpm"
            )
        loads.append((wc, d))

    loads.sort(key=lambda x: x[0])
    stats["lightest"] = loads[:3]
    stats["heaviest"] = list(reversed(loads[-3:]))
    stats["overlay_word_total"] = sum(w for w, _ in loads)
    stats["overlay_measured_total"] = sum(
        (overlay_days.get(d.get("day_id")) or {}).get("independent_measurement", {}).get("word_count", 0)
        for d in days
    )

    delta = stats["overlay_measured_total"] - stats["overlay_word_total"]
    if delta:
        f.upstream(
            f"KJV word-count provenance: this repository's independent recount over the "
            f"Pure Cambridge Edition gives {stats['overlay_measured_total']:,} words against the "
            f"approved document's {stats['overlay_word_total']:,} - a difference of {delta:+,} "
            f"({abs(delta) / stats['overlay_word_total'] * 100:.2f}%). The approved figures are "
            f"retained; the delta is a text-witness/tokeniser difference, not a calendar defect."
        )

    return f, stats


# --------------------------------------------------------------------------
# Report
# --------------------------------------------------------------------------


def write_report(path: str, plan: dict, overlay: dict, f: Findings, stats: dict) -> None:
    L: list[str] = []
    A = L.append

    A("# Bible-in-a-Year — validation report")
    A("")
    A("Generated by `bible-in-a-year/scripts/validate-master-plan.py`. Every number below is")
    A("measured from `master-calendar/master-plan.json` and `editions/kjv/overlay.json`, not")
    A("copied from the source proposal.")
    A("")
    A(f"**Result: {'PASS' if f.ok else 'FAIL'}** — "
      f"{len(f.calendar_errors)} calendar error(s), "
      f"{len(f.upstream_issues)} upstream/source-data issue(s), "
      f"{len(f.warnings)} warning(s).")
    A("")

    ss = plan.get("source_structure") or {}
    A("## Provenance")
    A("")
    A("| Field | Value |")
    A("|---|---|")
    A(f"| Plan | `{plan.get('plan_id')}` v{plan.get('version')} |")
    A(f"| Source document | {plan.get('source_document', {}).get('version')} |")
    A(f"| Upstream repository | {ss.get('repository')} |")
    A(f"| Upstream revision | `{(ss.get('revision') or '')[:12]}` — {ss.get('revision_subject')} |")
    A(f"| Upstream working tree clean | {ss.get('working_tree_clean')} |")
    A("")

    A("## Totals")
    A("")
    A("| Measure | Result | Approved figure | Agrees |")
    A("|---|---:|---:|:--:|")
    rows = [
        ("Total days", stats["days"], 365),
        ("Total canonical verses", stats["covered_verses"], 31102),
        ("Missing verses", len(stats["missing_verses"]), 0),
        ("Duplicated verses", len(stats["duplicated_verses"]), 0),
        ("Old Testament days", stats["ot_days"], 282),
        ("New Testament days", stats["nt_days"], 83),
        ("Green boundaries", stats["boundary_counts"]["green"], 180),
        ("Yellow boundaries", stats["boundary_counts"]["yellow"], 185),
        ("Red boundaries", stats["boundary_counts"]["red"], 0),
        ("KJV words (approved counts)", stats["overlay_word_total"], 790686),
    ]
    for label, actual, expected in rows:
        mark = "yes" if actual == expected else "**NO**"
        A(f"| {label} | {actual:,} | {expected:,} | {mark} |")
    A("")

    fnt = stats.get("first_nt_day") or {}
    A(f"First New Testament day: **{fnt.get('day_id')}** (Day {fnt.get('ordinal')}, "
      f"{(fnt.get('calendar') or {}).get('label')}) — {', '.join(fnt.get('books') or [])}.")
    A("")

    A("## Load and boundary distribution")
    A("")
    A("| Load review | Days |")
    A("|---|---:|")
    for k in ("light", "normal", "elevated", "heavy", "extreme"):
        A(f"| {k.capitalize()} | {stats['load_counts'][k]} |")
    A("")
    A("| Endpoint type | Days |")
    A("|---|---:|")
    for k in ("book_ending", "story_ending", "major_internal_movement", "strong_scene_ending"):
        A(f"| `{k}` | {stats['endpoint_counts'][k]} |")
    A("")

    A("## Lightest and heaviest days by KJV word count")
    A("")
    A("| | Day | Date | Reading | KJV words | Reading (200 wpm) | Audio (155 wpm) |")
    A("|---|---|---|---|---:|---:|---:|")
    ov = overlay.get("days", {})
    def row(tag, wc, d):
        o = ov.get(d["day_id"], {})
        refs = "; ".join(r["canonical_display"] for r in d["references"])
        return (f"| {tag} | Day {d['ordinal']} | {d['calendar']['label']} | {refs} | "
                f"{wc:,} | {o.get('reading_duration_minutes')} min | "
                f"{o.get('audio_duration_minutes_provisional')} min |")
    for i, (wc, d) in enumerate(stats["lightest"]):
        A(row("Lightest" if i == 0 else "", wc, d))
    for i, (wc, d) in enumerate(stats["heaviest"]):
        A(row("Heaviest" if i == 0 else "", wc, d))
    A("")

    A("## Cross-book days")
    A("")
    cbd = stats["cross_book_days"]
    if not cbd:
        A("None.")
    else:
        A(f"{len(cbd)} day(s) join more than one book. Each stores one reference object per")
        A("book; none is flattened into an artificial continuous reference.")
        A("")
        A("| Day | Date | Books | Reference objects | Endpoint |")
        A("|---|---|---|---|---|")
        for d in cbd:
            refs = "; ".join(f"`{r['start']['verse_id']}`–`{r['end']['verse_id']}`" for r in d["references"])
            A(f"| Day {d['ordinal']} | {d['calendar']['label']} | {', '.join(d['books'])} | "
              f"{refs} | `{d['endpoint']['type']}` |")
    A("")

    A("## Canonical-order exceptions")
    A("")
    for e in stats["sequence_exceptions"]:
        A(f"### `{e.get('exception_id')}` — {e.get('status')}")
        A("")
        A(f"- **Days:** {', '.join(e.get('day_ids', []))}")
        A(f"- **Canonical order would be:** {' → '.join(e.get('canonical_order_expected', []))}")
        A(f"- **Plan order used:** {' → '.join(e.get('plan_order_used', []))}")
        A(f"- **Summary:** {e.get('summary')}")
        A(f"- **Rationale:** {e.get('rationale')}")
        A(f"- **Approved in:** {e.get('approved_in')}")
        A("")
    dep = stats["order_departures"]
    A(f"Independently detected canonical-order departures: **{len(dep)}**"
      + (" — all documented." if dep and all(x["documented"] for x in dep) else "."))
    for x in dep:
        A(f"- {x['day_id']}: {x['book']} (canon #{x['book_canonical_order']}) read after "
          f"canon #{x['follows_book_order']} — documented: {x['documented']}")
    A("")

    A("## Versification notes")
    A("")
    found = False
    for d in plan["days"]:
        for n in (d.get("notes") or {}).get("versification", []):
            found = True
            A(f"- **Day {d['ordinal']}** (`{n['note_id']}`): {n['summary']}")
            A(f"  - Master-plan position: {n['master_plan_position']}")
    if not found:
        A("None recorded.")
    A("")

    A("## Textual-history notes (edition-level, not boundary defects)")
    A("")
    found = False
    for d in plan["days"]:
        for n in (d.get("notes") or {}).get("textual_history", []):
            found = True
            A(f"- **Day {d['ordinal']}** (`{n['note_id']}`): {n['summary']}")
    if not found:
        A("None recorded.")
    A("")

    A("## Structural integrity")
    A("")
    A(f"- Upstream stories referenced: **{len({s for d in plan['days'] for s in d['structure']['story_ids']})}**")
    A(f"- Upstream scenes referenced: **{sum(d['structure']['scene_count'] for d in plan['days'])}**")
    A(f"- Scenes divided across a day boundary: **{stats['divided_scenes']}**")
    A(f"- Verses with no upstream story/scene identifier: "
      f"**{sum(u.get('verse_count', 0) for _, u in stats['unresolved_mappings'])}**")
    A("")

    A("## Known upstream maintenance issue — Genesis structural mapping")
    A("")
    A("The approved v0.2 document flags three Genesis ranges as \"currently unmapped\" in the")
    A("upstream story/scene data. Each is re-checked against the live upstream checkout on")
    A("every validation run; the finding below is measured now, not inherited from the proposal.")
    A("")
    A("| Range | Verses | Mapped | Verdict |")
    A("|---|---:|---:|---|")
    for g in stats["genesis_maintenance"]:
        verdict = "resolved upstream" if g["fully_mapped"] else "**GAP REMAINS**"
        A(f"| {g['range']} | {g['verses']} | {g['verses_mapped']} | {verdict} |")
    A("")
    unresolved_gaps = [g for g in stats["genesis_maintenance"] if not g["fully_mapped"]]
    if unresolved_gaps:
        A("These verses are genuinely absent from the upstream story/scene mappings. They are")
        A("recorded as upstream source-maintenance issues. The master plan retains complete")
        A("canonical coverage of them through explicit `unresolved_mappings` records; no scene")
        A("identifier has been invented and `memory-method-bible` has not been modified.")
        A("")
        for g in unresolved_gaps:
            A(f"- **{g['range']}** — unmapped: {', '.join(g['unmapped_verse_ids'])}")
    else:
        A("**Determination: the gaps are not present in the current upstream checkout.** All")
        A("three ranges now resolve to real scenes, so there is nothing for this repository to")
        A("record as missing and nothing to repair. Upstream carries")
        A("`tools/patch_genesis_gaps.py`, whose docstring describes exactly these three")
        A("toledot-bridge gaps and the placement used to close them; the base-structure data")
        A("reflects that fix.")
        A("")
        A("The consequence for this repository is a **stale note, not a data defect**: the")
        A("source document's audit notes on Day 2 and Day 4 (\"plus currently unmapped 6:1-8\",")
        A("\"plus currently unmapped\") described upstream as it stood when the proposal was")
        A("written. Those notes are preserved verbatim in the master plan at")
        A("`notes.source_audit_note` rather than deleted, because the approved document is not")
        A("edited to fit new findings. They should be revised in the next approved revision of")
        A("the calendar.")
        A("")
        for g in stats["genesis_maintenance"]:
            A(f"- **{g['range']}** now maps to: "
              + ", ".join(f"`{sc['scene_id']}` ({sc['reference']})" for sc in g["scenes"]))
    A("")

    A("## Unresolved source-data problems")
    A("")
    if not f.upstream_issues:
        A("None.")
    else:
        A("These are upstream or source-measurement issues. They are recorded, not repaired,")
        A("and they do not fail validation — they are not calendar defects.")
        A("")
        for m in f.upstream_issues:
            A(f"- {m}")
    A("")

    A("## Calendar errors")
    A("")
    if not f.calendar_errors:
        A("None. The calendar validates.")
    else:
        for m in f.calendar_errors:
            A(f"- {m}")
    A("")

    if f.warnings:
        A("## Warnings")
        A("")
        for m in f.warnings:
            A(f"- {m}")
        A("")

    with open(path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(L))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--plan", default=B.MASTER_PLAN, help="master-plan.json to validate")
    ap.add_argument("--overlay", default=B.KJV_OVERLAY, help="KJV overlay.json to validate")
    ap.add_argument("--report", default=None, help="write the Markdown validation report here")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    with open(args.plan, encoding="utf-8") as fh:
        plan = json.load(fh)
    with open(args.overlay, encoding="utf-8") as fh:
        overlay = json.load(fh)

    vrs = B.load_versification()
    stories, scenes, upstream_problems = B.load_upstream_structure(vrs)

    findings, stats = validate(plan, overlay, vrs, stories, scenes, upstream_problems)

    # Optional strict JSON Schema pass, when the library is installed.
    try:
        import jsonschema  # type: ignore
    except ImportError:
        findings.warn("jsonschema is not installed; JSON Schema conformance was not checked")
    else:
        for doc, schema_path, label in (
            (plan, B.MASTER_PLAN_SCHEMA, "master-plan"),
            (overlay, B.KJV_OVERLAY_SCHEMA, "kjv-overlay"),
        ):
            with open(schema_path, encoding="utf-8") as fh:
                schema = json.load(fh)
            for err in sorted(
                jsonschema.Draft202012Validator(schema).iter_errors(doc),
                key=lambda e: list(e.path),
            ):
                findings.error(f"{label} schema: {'/'.join(str(p) for p in err.path)}: {err.message}")

    if args.report:
        write_report(args.report, plan, overlay, findings, stats)

    if not args.quiet:
        print(f"days                 {stats['days']}")
        print(f"canonical verses     {stats['covered_verses']:,}")
        print(f"missing verses       {len(stats['missing_verses'])}")
        print(f"duplicated verses    {len(stats['duplicated_verses'])}")
        print(f"OT / NT days         {stats['ot_days']} / {stats['nt_days']}")
        print(f"green/yellow/red     {stats['boundary_counts']['green']} / "
              f"{stats['boundary_counts']['yellow']} / {stats['boundary_counts']['red']}")
        print(f"divided scenes       {stats['divided_scenes']}")
        print(f"cross-book days      {len(stats['cross_book_days'])}")
        print(f"order exceptions     {len(stats['order_departures'])}")
        print()
        for m in findings.upstream_issues:
            print(f"upstream issue: {m}")
        for m in findings.warnings:
            print(f"warning: {m}")
        for m in findings.calendar_errors:
            print(f"ERROR: {m}")
        print()
        print("VALIDATION PASSED" if findings.ok else "VALIDATION FAILED")

    return 0 if findings.ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
