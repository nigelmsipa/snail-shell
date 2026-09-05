#!/usr/bin/env python3
"""Render the prayer boards FOR A TRANSLATION.

WHY THIS EXISTS. render_full_day.py hardcoded two finished KJV clips:

    PRAYER_BEFORE = ~/biay-samples/prayer_T6_before.mp4

Neither path contains "kjv", so a grep for the translation missed them, and all
31 MSB January days shipped with the KJV's NAVY prayer board against MSB's olive
ink. Gates 1-9 all passed: right duration, right codec, prayer beats present and
dark. Right shape, wrong Bible - the exact failure engine/translation_env.sh
warns about, arriving through the one door nobody was watching.

The board's geometry is LOCKED (prayer-anim-t6.html, calibrated by hand: hero
226px, gap 5px, block-y 540px, eye-dx 6, hero-dx 7). Only the two colours move.
So this skins a copy rather than reimplementing anything.

  python3 render_prayer.py --translation msb
  BIAY_TRANSLATION=msb python3 render_prayer.py

KJV is refused on purpose: its clips already shipped inside twelve uploaded
videos, and re-rendering them could only introduce drift.
"""
import argparse, os, shutil, subprocess, sys, tempfile
from pathlib import Path

sys.path.insert(0, "/home/nigel")
import biay_translation as T

HOME = Path("/home/nigel")
DESIGN = Path("/home/nigel/open-design/.od/projects/0b2731a7-3ec0-4647-ad18-7f0a97f6b029")
SRC = DESIGN / "prayer-anim-t6.html"
CUE = HOME / "wolf-and-word/assets/cues/prayer_cue.mp3"
CHROME = "/usr/sbin/chromium"
KJV_INK, KJV_GOLD = "#26324f", "#B3944D"
SECS, FPS, JOBS = 13.0, 60, 4          # 60fps: the shipped clips are 60/1 and the
                                        # concat is a stream copy, so anything else
                                        # would force a re-encode of every day.


def skin(slug):
    """A copy of the locked board wearing this translation's ink and accent."""
    p = T.data(slug)["palette"]
    html = SRC.read_text()
    for old, new in ((KJV_INK, p["ink"]), (KJV_INK.upper(), p["ink"]),
                     (KJV_GOLD, p["accent"]), (KJV_GOLD.lower(), p["accent"])):
        html = html.replace(old, new)
    out = DESIGN / f"_skin-{slug}-prayer-anim-t6.html"
    out.write_text(html)
    return out, p["ink"].lstrip("#").upper() + "FF"


def render(slug, which, label, dest):
    html, bg = skin(slug)
    n = int(SECS * FPS)
    W = Path(tempfile.mkdtemp(prefix=f"prayer-{slug}-{which}-"))
    lab = label.replace(" ", "%20")

    script = f'''i={{}}; p=$(awk -v ii=$i "BEGIN{{printf \\"%.5f\\", ii/({n}-1)}}")
timeout 25 {CHROME} --headless --no-sandbox --disable-gpu --hide-scrollbars \\
  --force-device-scale-factor=2 --window-size=1920,1080 --virtual-time-budget=700 \\
  --default-background-color={bg} --screenshot="{W}/f$(printf %04d $i).png" \\
  "file://{html}#${{p}}|{lab}" >/dev/null 2>&1'''
    subprocess.run(f"seq 0 {n-1} | xargs -P {JOBS} -I{{}} sh -c '{script}'",
                   shell=True, capture_output=True)

    # refill anything that dropped - and NOTE: the refill path is where a shell
    # quoting bug once put apostrophes into the label on 3 frames of 780.
    missing = [i for i in range(n) if not (W / f"f{i:04d}.png").exists()
               or (W / f"f{i:04d}.png").stat().st_size == 0]
    for i in missing:
        p = i / (n - 1)
        subprocess.run([CHROME, "--headless", "--no-sandbox", "--disable-gpu",
                        "--hide-scrollbars", "--force-device-scale-factor=2",
                        "--window-size=1920,1080", "--virtual-time-budget=1200",
                        f"--default-background-color={bg}",
                        f"--screenshot={W}/f{i:04d}.png",
                        f"file://{html}#{p:.5f}|{label}"], capture_output=True)
    got = len(list(W.glob("f*.png")))
    if got != n:
        sys.exit(f"only {got}/{n} frames for {slug}/{which}")

    dest.parent.mkdir(parents=True, exist_ok=True)
    r = subprocess.run(["ffmpeg", "-y", "-v", "error", "-framerate", str(FPS),
        "-i", str(W / "f%04d.png"), "-i", str(CUE), "-map", "0:v", "-map", "1:a",
        "-vf", "scale=1920:1080:flags=lanczos",
        "-c:v", "libx264", "-profile:v", "high", "-level", "4.2", "-crf", "18",
        "-preset", "fast", "-pix_fmt", "yuv420p", "-r", str(FPS),
        "-af", f"apad=whole_dur={SECS}", "-c:a", "aac", "-b:a", "192k",
        "-ar", "48000", "-ac", "1", "-t", str(SECS), str(dest)], capture_output=True)
    shutil.rmtree(W, ignore_errors=True)
    if r.returncode or not dest.exists():
        sys.exit(f"ffmpeg failed for {slug}/{which}: {r.stderr.decode()[:300]}")
    print(f"  {which:7} -> {dest.name}  ({n} frames, {SECS}s, ink {T.data(slug)['palette']['ink']})")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--translation")
    a = ap.parse_args()
    slug = a.translation or T.slug()
    if slug == "kjv":
        sys.exit("refusing to re-render the KJV prayer boards: they shipped inside "
                 "twelve uploaded videos. Use ~/biay-samples/prayer_T6_*.mp4 as-is.")
    out = T.paths(slug)["out"]
    print(f"prayer boards for {T.name(slug)} [{slug}]")
    render(slug, "before", "Before the reading", out / "prayer_before.mp4")
    render(slug, "after",  "After the reading",  out / "prayer_after.mp4")


if __name__ == "__main__":
    main()
