#!/usr/bin/env python3
"""Generate per-chapter foothold 'units' files from a memory-method-bible base.json.

One asset, three consumers: snail read-along on-screen title, YouTube description
timestamps, Wolf memorization app. Units mirror the approved base scenes verbatim
(titles = scene_name), chapter-clipped, lettered A,B,C... in reading order. Scenes
that cross a chapter boundary are split into '(pt 1)'/'(pt 2)' units in each chapter.

Cap is 6 verses; base.json is already cut to that grain, so this only emits what's
there. Chapters with no base scenes (genealogy/list chapters) are reported and
skipped for separate human-vetoed handling.

Usage:
  build_units.py Genesis --repo ~/memory-method-bible --out . [--write]
Without --write it dry-runs (prints summary only).
"""

import argparse
import collections
import json
import os
import re


def chapter_max_verses(bsb_path, book):
    maxv = collections.defaultdict(int)
    pat = re.compile(rf'^{re.escape(book)} (\d+):(\d+)\t')
    with open(bsb_path, encoding="utf-8") as f:
        for line in f:
            m = pat.match(line)
            if m:
                c, v = int(m.group(1)), int(m.group(2))
                maxv[c] = max(maxv[c], v)
    return maxv


def parse_ref(ref):
    m = re.match(r'^(\d+):(\d+)(?:-(?:(\d+):)?(\d+))?$', ref.strip())
    if not m:
        return None
    cs = int(m.group(1)); vs = int(m.group(2))
    ce = int(m.group(3)) if m.group(3) else cs
    ve = int(m.group(4)) if m.group(4) else vs
    return cs, vs, ce, ve


def build(book, repo, bsb_path):
    base = json.load(open(os.path.join(
        repo, "data", "base-structure", f"{book.lower()}-base.json"), encoding="utf-8"))
    maxv = chapter_max_verses(bsb_path, book)
    chapters = collections.defaultdict(list)  # chap -> [(vs, ve, title)]
    for story in base["stories"]:
        for sc in story.get("scenes", []):
            p = parse_ref(sc["reference"])
            if not p:
                continue
            cs, vs, ce, ve = p
            name = sc["scene_name"]
            sl, st = story["story_letter"], story["story_title"]
            if cs == ce:
                chapters[cs].append((vs, ve, name, sl, st))
            else:
                chapters[cs].append((vs, maxv.get(cs, ve), name + " (pt 1)", sl, st))
                chapters[ce].append((1, ve, name + " (pt 2)", sl, st))
    return chapters, maxv


def to_units(book, chap, scenes):
    scenes = sorted(scenes)
    units = []
    for i, (vs, ve, title, sl, st) in enumerate(scenes):
        units.append({"letter": chr(ord('A') + i),
                      "story_letter": sl, "story_title": st,
                      "title": title,
                      "start_verse": vs, "end_verse": ve})
    return {"book": book, "chapter": chap, "units": units}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("book")
    ap.add_argument("--repo", default=os.path.expanduser("~/memory-method-bible"))
    ap.add_argument("--bsb", default=None)
    ap.add_argument("--out", default=".")
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()
    bsb = args.bsb or os.path.join(args.repo, "source-texts", "BSB.txt")

    chapters, maxv = build(args.book, args.repo, bsb)
    all_chaps = range(1, max(maxv) + 1) if maxv else []
    missing = [c for c in all_chaps if c not in chapters]
    total_units = 0
    over = []
    for chap in sorted(chapters):
        doc = to_units(args.book, chap, chapters[chap])
        total_units += len(doc["units"])
        over += [(chap, u["letter"]) for u in doc["units"]
                 if u["end_verse"] - u["start_verse"] + 1 > 6]
        if args.write:
            path = os.path.join(args.out, f"{args.book.lower()}-{chap:02d}-units.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump(doc, f, ensure_ascii=False, indent=2)
                f.write("\n")
    print(f"{args.book}: {len(chapters)} chapters, {total_units} units, "
          f"{len(over)} over cap-6  {'(WROTE files)' if args.write else '(dry-run)'}")
    if missing:
        print(f"  chapters with NO base scenes (need human-vetoed handling): {missing}")
    if over:
        print(f"  OVER CAP: {over}")


if __name__ == "__main__":
    main()
