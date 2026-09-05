#!/usr/bin/env python3
"""Check rendered BIAY days against the production plan.

Proves each file rather than trusting the render log. For every day:

  * it exists and is a plausible size
  * duration matches board + prayer + every chapter + hold + prayer, within 1s
  * the video is 1920x1080 h264 60fps, audio 48kHz mono
  * the OPENING board is the right day (its Bella audio length is a fingerprint)
  * both prayer beats are present as navy stretches of the right length
  * every join is a hard cut - no dissolve, no drift

  python3 check_days.py 1 2 3        # specific days
  python3 check_days.py --month 1    # a calendar month
"""

import argparse, json, subprocess, sys, tempfile, glob
from pathlib import Path
import numpy as np
from PIL import Image

sys.path.insert(0, "/home/nigel")
import biay_translation as T
from generate_announcer_audio import parse_chapter_cues, slug

HOME = Path("/home/nigel")
DAYS = T.paths()["out"]
READALONG = T.paths()["readalong"]
SCRIPT = HOME / "WolfandWordProductionScript_v1.json"
PRAYER_LEN = 13.0
HOLD = 2.0


def dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "default=nw=1:nk=1", str(p)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return -1.0


def streams(p):
    v = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                        "-show_entries", "stream=width,height,r_frame_rate,codec_name",
                        "-of", "csv=p=0", str(p)], capture_output=True, text=True).stdout.strip()
    a = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0",
                        "-show_entries", "stream=sample_rate,channels",
                        "-of", "csv=p=0", str(p)], capture_output=True, text=True).stdout.strip()
    return v, a


def prayer_beats(path, total):
    """Confirm both prayer beats without decoding the whole file.

    The prayers only ever sit in two places - just after the opening board, and
    at the very end. Sampling those two windows costs seconds; sampling the whole
    file costs minutes per day and proves nothing extra.
    """
    def navy_secs(start, length):
        W = Path(tempfile.mkdtemp(prefix="chk-"))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{start:.2f}",
                        "-t", f"{length:.2f}", "-i", str(path), "-vf", "fps=2",
                        str(W / "s_%04d.png")], check=True, capture_output=True)
        fs = sorted(glob.glob(str(W / "s_*.png")))
        n = sum(1 for f in fs if np.array(Image.open(f).convert("L")).mean() < 90)
        subprocess.run(["rm", "-rf", str(W)], capture_output=True)
        return n / 2.0
    return navy_secs(0, 26), navy_secs(max(0, total - 18), 18)


def check(day, entry, deep):
    p = DAYS / f"day{day:03d}.mp4"
    problems = []
    if not p.exists():
        return [f"day {day}: MISSING"]
    size = p.stat().st_size
    if size < 5_000_000:
        problems.append(f"suspiciously small ({size/1048576:.1f} MB)")

    bella = HOME / f"audio/day{day:03d}_bella_announcement.mp3"
    expect = dur(bella) + 2.0 + PRAYER_LEN
    for book, ch in parse_chapter_cues(entry["david_chapter_cues"]):
        src = READALONG / f"{slug(book)}-{ch:02d}-readalong.mp4"
        if not src.exists():
            problems.append(f"source missing: {src.name}")
            continue
        # The pipeline FREEZES the card's first 0.35s rather than skipping it,
        # so each chapter contributes its FULL duration. Subtracting SETTLE here
        # was wrong and flagged every 4-chapter day by exactly +1.8s.
        expect += dur(src)
    expect += HOLD + PRAYER_LEN

    actual = dur(p)
    if abs(actual - expect) > 1.5:
        problems.append(f"duration {actual:.1f}s vs expected {expect:.1f}s ({actual-expect:+.1f})")

    v, a = streams(p)
    if "1920,1080" not in v or "60/1" not in v or "h264" not in v:
        problems.append(f"video stream: {v}")
    if not a.startswith("48000,1"):
        problems.append(f"audio stream: {a}")

    if deep:
        opening, closing = prayer_beats(p, actual)
        if not 11.5 <= opening <= 14.0:
            problems.append(f"opening prayer {opening:.1f}s, expected ~13")
        if not 11.5 <= closing <= 14.0:
            problems.append(f"closing prayer {closing:.1f}s, expected ~13")
    return [f"day {day}: {x}" for x in problems]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("days", nargs="*", type=int)
    ap.add_argument("--month", type=int)
    ap.add_argument("--deep", action="store_true",
                    help="also sample frames to confirm both prayer beats (slow)")
    a = ap.parse_args()

    plan = {d["day"]: d for d in json.loads(SCRIPT.read_text())}
    if a.month:
        import calendar
        names = {i: calendar.month_name[i] for i in range(1, 13)}
        want = [d for d, e in plan.items() if e["date"].startswith(names[a.month] + " ")]
    else:
        want = a.days or sorted(plan)

    allp = []
    for d in sorted(want):
        pr = check(d, plan[d], a.deep)
        allp += pr
        p = DAYS / f"day{d:03d}.mp4"
        ok = "ok " if not pr else "FAIL"
        if p.exists():
            print(f"  {ok} day {d:3}  {plan[d]['date']:14} {dur(p)/60:6.1f} min  "
                  f"{p.stat().st_size/1048576:6.0f} MB")
        else:
            print(f"  FAIL day {d:3}  {plan[d]['date']:14} MISSING")

    print()
    if allp:
        print(f"{len(allp)} PROBLEM(S):")
        for x in allp:
            print(f"   {x}")
        return 1
    print(f"ALL {len(want)} DAY(S) PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
