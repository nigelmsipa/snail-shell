#!/usr/bin/env python3
"""Stitch a book's chapter videos into ONE upload-ready video (lossless
stream-copy concat — all chapters share identical encode settings) and emit
YouTube description timestamps from the units data.

Outputs into output/kjv/<book>/:
  <book>-FULL.mp4              the one giant book video
  <book>-timestamps.txt        chapter-level timestamps (fits description)
  <book>-timestamps-scenes.txt chapter+scene timestamps (pinned comment / doc)

Usage: stitch_book.py <book-slug> <n_chapters>
"""
import json
import subprocess
import sys
from pathlib import Path

OUT_ROOT = Path("/home/nigel/wolf-and-word/output/kjv")
OB = Path("/home/nigel/openbible-kjv")
UNITS = Path("/home/nigel/kjv-render")

def hms(sec):
    s = int(sec)
    return f"{s//3600}:{(s%3600)//60:02d}:{s%60:02d}" if s >= 3600 else f"{s//60}:{s%60:02d}"

def main():
    book, n = sys.argv[1], int(sys.argv[2])
    out_dir = OUT_ROOT / book
    files = []
    for c in range(1, n + 1):
        f = out_dir / f"{book}-{c:02d}-scroll.mp4"
        if not f.exists():
            sys.exit(f"missing {f} — book incomplete, not stitching")
        files.append(f)

    # durations for timestamp offsets
    durs = []
    for f in files:
        d = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                            "-of", "csv=p=0", str(f)], capture_output=True, text=True)
        durs.append(float(d.stdout.strip()))

    concat_list = out_dir / "concat.txt"
    concat_list.write_text("".join(f"file '{f}'\n" for f in files))
    full = out_dir / f"{book}-FULL.mp4"
    r = subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0",
                        "-i", str(concat_list), "-c", "copy", str(full)])
    if r.returncode != 0:
        sys.exit("concat failed")

    # chapter-level timestamps (YouTube description)
    lines, offset = [], 0.0
    for c, dur in enumerate(durs, 1):
        lines.append(f"{hms(offset)} {book.capitalize()} {c}")
        offset += dur
    (out_dir / f"{book}-timestamps.txt").write_text("\n".join(lines) + "\n")

    # chapter+scene timestamps (units + versemap + aligned word onsets)
    slines, offset = [], 0.0
    for c, dur in enumerate(durs, 1):
        cc = f"{c:02d}"
        slines.append(f"{hms(offset)} — {book.upper()} {c}")
        try:
            units = json.loads((UNITS / f"{book}-{cc}-units.json").read_text())["units"]
            vmap = json.loads((OB / f"{book}-{cc}.versemap.json").read_text())["verses"]
            words = json.loads((OB / f"{book}-{cc}-aligned.json").read_text())["words"]
            v2w = {v["n"]: v["word"] for v in vmap}
            seen = set()
            for u in units:
                key = (u["story_letter"], u["title"])
                if key in seen:
                    continue
                seen.add(key)
                w = v2w.get(u["start_verse"])
                if w is None or w >= len(words):
                    continue
                t = offset + words[w]["s"] / 1000.0
                slines.append(f"  {hms(t)} {u['title']}")
        except FileNotFoundError:
            pass
        offset += dur
    (out_dir / f"{book}-timestamps-scenes.txt").write_text("\n".join(slines) + "\n")

    total = hms(sum(durs))
    size_gb = full.stat().st_size / 1e9
    print(f"{book}: {n} chapters -> {full.name} ({total}, {size_gb:.1f}GB)")
    print(f"timestamps: {len(lines)} chapters, scene file {len(slines)} lines")

if __name__ == "__main__":
    main()
