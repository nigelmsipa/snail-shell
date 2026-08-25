#!/usr/bin/env python3
"""Negative tests for validate-master-plan.py.

Each case mutates a throwaway copy of the real plan/overlay so that exactly one
of the documented failure conditions becomes true, then asserts that the
validator exits non-zero and names the problem. A validator that cannot fail is
not a validator.

Usage:  python3 test-validator.py
"""

from __future__ import annotations

import copy
import json
import os
import subprocess
import sys
import tempfile

import biay_common as B

HERE = os.path.dirname(os.path.abspath(__file__))
VALIDATOR = os.path.join(HERE, "validate-master-plan.py")


# --- mutations: each takes (plan, overlay) and breaks exactly one rule -------

def m_wrong_day_count(plan, overlay):
    plan["days"].pop()
    return "exactly 365 are required"


def m_duplicate_day_id(plan, overlay):
    plan["days"][5]["day_id"] = plan["days"][4]["day_id"]
    return "day_id"


def m_ordinal_out_of_order(plan, overlay):
    plan["days"][10], plan["days"][11] = plan["days"][11], plan["days"][10]
    return "out of order"


def m_missing_day_id(plan, overlay):
    del plan["days"][3]["day_id"]
    return "missing day_id"


def m_date_out_of_order(plan, overlay):
    plan["days"][40]["calendar"]["day_of_month"] = 28
    plan["days"][40]["calendar"]["mm_dd"] = "02-28"
    return "out of order"


def m_duplicate_date(plan, overlay):
    src = plan["days"][7]["calendar"]
    plan["days"][8]["calendar"] = copy.deepcopy(src)
    return "out of order"


def m_missing_verse(plan, overlay):
    # Shorten day 1 by one verse: GEN.3.24 is then read by nobody.
    ref = plan["days"][0]["references"][0]
    ref["end"] = {"chapter": 3, "verse": 23, "verse_id": "GEN.3.23"}
    ref["verse_count"] -= 1
    plan["days"][0]["verse_count"] -= 1
    return "not read by any day"


def m_duplicate_verse(plan, overlay):
    # Extend day 2 backwards over the last verse of day 1.
    ref = plan["days"][1]["references"][0]
    ref["start"] = {"chapter": 3, "verse": 24, "verse_id": "GEN.3.24"}
    ref["verse_count"] += 1
    plan["days"][1]["verse_count"] += 1
    return "read more than once"


def m_divides_a_scene(plan, overlay):
    # Move one verse from day 1 to day 2, straight through genesis.B.12 (3:22-24).
    a = plan["days"][0]["references"][0]
    b = plan["days"][1]["references"][0]
    a["end"] = {"chapter": 3, "verse": 23, "verse_id": "GEN.3.23"}
    a["verse_count"] -= 1
    plan["days"][0]["verse_count"] -= 1
    b["start"] = {"chapter": 3, "verse": 24, "verse_id": "GEN.3.24"}
    b["verse_count"] += 1
    plan["days"][1]["verse_count"] += 1
    return "is split across days"


def m_unknown_scene_id(plan, overlay):
    plan["days"][0]["structure"]["scene_ids"][0] = "genesis.Z.999"
    return "does not exist upstream"


def m_unknown_story_id(plan, overlay):
    plan["days"][0]["structure"]["story_ids"][0] = "genesis.ZZ"
    return "does not exist upstream"


def m_bad_endpoint(plan, overlay):
    plan["days"][0]["endpoint"]["type"] = "chapter_ending"
    return "invalid endpoint type"


def m_bad_review(plan, overlay):
    plan["days"][0]["review"]["boundary"] = "amber"
    return "invalid boundary review status"


def m_bad_load_review(plan, overlay):
    plan["days"][0]["review"]["load"] = "crushing"
    return "invalid load review status"


def m_orphan_overlay_day(plan, overlay):
    overlay["days"]["ww-biay-366"] = copy.deepcopy(overlay["days"]["ww-biay-365"])
    overlay["days"]["ww-biay-366"]["day_id"] = "ww-biay-366"
    return "does not resolve to a master day"


def m_translation_data_in_master(plan, overlay):
    plan["days"][0]["word_count"] = 2124
    return "belongs in an edition overlay"


def m_nested_translation_data_in_master(plan, overlay):
    plan["days"][0]["notes"]["audio_duration_minutes"] = 13.7
    return "belongs in an edition overlay"


def m_sequence_exception_removed(plan, overlay):
    plan["sequence_exceptions"] = []
    for d in plan["days"]:
        d["sequence_exception_ids"] = []
    return "undocumented"


def m_sequence_exception_undocumented_prose(plan, overlay):
    plan["sequence_exceptions"][0]["rationale"] = ""
    return "missing rationale"


def m_cross_book_note_removed(plan, overlay):
    for d in plan["days"]:
        if d["cross_book"]:
            d["notes"]["cross_book"] = None
            break
    return "no explicit cross-book note"


def m_overlay_duration_wrong(plan, overlay):
    overlay["days"]["ww-biay-001"]["reading_duration_minutes"] = 99.9
    return "at 200 wpm"


def m_totals_disagree(plan, overlay):
    plan["totals"]["old_testament_days"] = 281
    return "totals.old_testament_days"


CASES = [
    ("plan is not 365 days", m_wrong_day_count),
    ("duplicated day id", m_duplicate_day_id),
    ("ordinals out of order", m_ordinal_out_of_order),
    ("missing day id", m_missing_day_id),
    ("calendar date out of order", m_date_out_of_order),
    ("duplicated calendar date", m_duplicate_date),
    ("canonical verse missing", m_missing_verse),
    ("canonical verse duplicated", m_duplicate_verse),
    ("a day divides a scene", m_divides_a_scene),
    ("unknown scene identifier", m_unknown_scene_id),
    ("unknown story identifier", m_unknown_story_id),
    ("invalid endpoint type", m_bad_endpoint),
    ("invalid boundary review", m_bad_review),
    ("invalid load review", m_bad_load_review),
    ("overlay day with no master day", m_orphan_overlay_day),
    ("translation measurement in master plan", m_translation_data_in_master),
    ("nested translation measurement in master plan", m_nested_translation_data_in_master),
    ("2 Peter/Jude exception removed", m_sequence_exception_removed),
    ("2 Peter/Jude exception left undocumented", m_sequence_exception_undocumented_prose),
    ("cross-book note removed", m_cross_book_note_removed),
    ("overlay duration disagrees with 200 wpm", m_overlay_duration_wrong),
    ("declared totals disagree with data", m_totals_disagree),
]


def run(plan_path: str, overlay_path: str) -> tuple[int, str]:
    proc = subprocess.run(
        [sys.executable, VALIDATOR, "--plan", plan_path, "--overlay", overlay_path],
        capture_output=True, text=True, cwd=HERE,
    )
    return proc.returncode, proc.stdout + proc.stderr


def main() -> int:
    with open(B.MASTER_PLAN, encoding="utf-8") as fh:
        base_plan = json.load(fh)
    with open(B.KJV_OVERLAY, encoding="utf-8") as fh:
        base_overlay = json.load(fh)

    failures = 0
    with tempfile.TemporaryDirectory() as tmp:
        pp = os.path.join(tmp, "plan.json")
        op = os.path.join(tmp, "overlay.json")

        # Control: the unmutated pair must pass.
        with open(pp, "w", encoding="utf-8") as fh:
            json.dump(base_plan, fh)
        with open(op, "w", encoding="utf-8") as fh:
            json.dump(base_overlay, fh)
        code, out = run(pp, op)
        if code != 0:
            print("FAIL  control: the real plan should validate but did not")
            print(out)
            failures += 1
        else:
            print("ok    control: unmutated plan validates")

        for label, mutate in CASES:
            plan = copy.deepcopy(base_plan)
            overlay = copy.deepcopy(base_overlay)
            expect = mutate(plan, overlay)
            with open(pp, "w", encoding="utf-8") as fh:
                json.dump(plan, fh)
            with open(op, "w", encoding="utf-8") as fh:
                json.dump(overlay, fh)
            code, out = run(pp, op)
            if code == 0:
                print(f"FAIL  {label}: validator exited 0, expected non-zero")
                failures += 1
            elif expect not in out:
                print(f"FAIL  {label}: exited {code} but did not report {expect!r}")
                failures += 1
            else:
                print(f"ok    {label}")

    print()
    if failures:
        print(f"{failures} negative test(s) failed")
        return 1
    print(f"all {len(CASES)} negative tests passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
