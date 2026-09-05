#!/usr/bin/env python3
"""Render complete BIAY days.

  day board (Bella) -> prayer -> every chapter in full -> prayer -> end

The carded readalongs are 1920x1080 h264 High / 60fps / 48kHz MONO aac. Boards are
encoded to match EXACTLY, so the readings are stream-copied rather than re-encoded —
about 25x less work per day, and the reading is bit-identical to what you approved.

Each readalong starts 0.37s in, skipping its own opening settle so no join is soft.

  python3 render_full_day.py --day 237
  python3 render_full_day.py --days 1,2,3
  python3 render_full_day.py --all
"""

import argparse, json, subprocess, sys, tempfile, time
from pathlib import Path

sys.path.insert(0, "/home/nigel")
import biay_translation as T
import render_biay_sample as R
from generate_announcer_audio import parse_chapter_cues, slug
R.EDGE_PX = 16

HOME = Path("/home/nigel")
OUT = T.paths()["out"]
READALONG = T.paths()["readalong"]
SCRIPT = HOME / "WolfandWordProductionScript_v1.json"
# The prayer boards are PER TRANSLATION. These two paths contain no translation
# name, which is exactly why a grep for "kjv" missed them and 31 MSB days shipped
# with the KJV's navy board against MSB olive ink. KJV keeps the exact clips that
# shipped inside twelve uploaded videos; everything else renders its own via
# render_prayer.py.
if T.slug() == "kjv":
    PRAYER_BEFORE = HOME / "biay-samples/prayer_T6_before.mp4"
    PRAYER_AFTER  = HOME / "biay-samples/prayer_T6_after.mp4"
else:
    PRAYER_BEFORE = T.paths()["out"] / "prayer_before.mp4"
    PRAYER_AFTER  = T.paths()["out"] / "prayer_after.mp4"
# the reading must not slam straight into the closing prayer - the production
# script asks for pre_silence_sec [2,3] before it. Hold the last frame, silent.
PRE_SILENCE = 2.0
# The carded readalongs ANIMATE their chapter card in over the first ~0.30s
# (70-80k pixels changing per frame, dead still from 0.35s). Nigel wants the card
# to appear instantly, but skipping those frames would clip David's spoken
# announcement. So: FREEZE the video on the settled frame for FREEZE seconds while
# the audio plays untouched from 0. Only the head is re-encoded, up to the first
# keyframe; everything after is stream-copied.
FREEZE = 0.35

# match the readalongs exactly so concat can stream-copy
EMPTY_PAGE = """<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:#ffffff}
</style>"""

VENC = ["-c:v", "libx264", "-profile:v", "high", "-level", "4.2", "-crf", "18",
        "-preset", "fast", "-pix_fmt", "yuv420p", "-r", "60"]
AENC = ["-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "1"]


def first_keyframe_after(src, t):
    """First keyframe at or after t, so the tail can be stream-copied cleanly."""
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                        "-skip_frame", "nokey", "-show_entries", "frame=pts_time",
                        "-of", "csv=p=0", "-read_intervals", "%+12", str(src)],
                       capture_output=True, text=True)
    ks = [float(x.strip(",")) for x in r.stdout.split() if x.strip(",")]
    for k in ks:
        if k >= t:
            return k
    return ks[-1] if ks else 4.166667


def sh(cmd, tries=3):
    for _ in range(tries):
        p = subprocess.run(cmd, capture_output=True)
        if p.returncode == 0:
            return
        time.sleep(1.5)
    sys.exit(f"FAILED: {' '.join(map(str,cmd))}\n{p.stderr.decode()[:400]}")


def prayer_60(which, cache={}):
    """The prayer clips are PRE-MADE. If they already match the concat's codec
    params - 60fps h264 yuv420p, 48kHz mono aac - they are used as-is with no
    re-encode at all. Only a mismatch triggers one, and then only once."""
    if which not in cache:
        src = PRAYER_BEFORE if which == "before" else PRAYER_AFTER
        r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                            "-show_entries", "stream=r_frame_rate,pix_fmt",
                            "-of", "csv=p=0", str(src)], capture_output=True, text=True)
        a = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0",
                            "-show_entries", "stream=channels,sample_rate",
                            "-of", "csv=p=0", str(src)], capture_output=True, text=True)
        ok = "60/1" in r.stdout and "yuv420p" in r.stdout and a.stdout.strip().startswith("1,48000")
        if ok:
            cache[which] = src          # use the pre-made clip untouched
        else:
            OUT.mkdir(parents=True, exist_ok=True)
            p = OUT / f"_prayer_{which}_60.mp4"
            # STALENESS CHECK. "exists" is not "current". A cached re-encode of
            # the KJV board survived a translation switch here and put navy prayer
            # boards inside 31 MSB days, while the source path resolved correctly
            # the whole time. Re-encode whenever the cache predates its source.
            if not p.exists() or p.stat().st_mtime < src.stat().st_mtime:
                sh(["ffmpeg", "-v", "error", "-y", "-i", str(src), *VENC,
                    "-af", "aresample=48000", *AENC, str(p)])
            cache[which] = p
    return cache[which]


def render_day(day, entry, quiet=False):
    lbl = R.reading_label(entry)
    slots = parse_chapter_cues(entry["david_chapter_cues"])
    W = Path(tempfile.mkdtemp(prefix=f"d{day:03d}-"))
    segs = []

    png = W / "board.png"
    R.shot(R.board_html(day, entry["date"], lbl, "k"), png)
    bella = HOME / f"audio/day{day:03d}_bella_announcement.mp3"
    t1 = R.dur(bella) + 2.0
    s1 = W / "s1.mp4"
    sh(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", "60", "-t", f"{t1:.2f}",
        "-i", str(png), "-i", str(bella), "-map", "0:v", "-map", "1:a", *VENC,
        "-af", f"aresample=48000,adelay=600,apad=whole_dur={t1:.2f}", *AENC, str(s1)])
    segs.append(s1)

    segs.append(prayer_60("before"))

    last_src = None
    for i, (book, ch) in enumerate(slots):
        src = READALONG / f"{slug(book)}-{ch:02d}-readalong.mp4"
        if not src.exists():
            return None, f"missing {src.name}"

        kf = first_keyframe_after(src, FREEZE)

        # head: frozen settled frame for FREEZE s, then real video, audio whole
        still = W / f"f{i:02d}.png"
        sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{FREEZE + 0.05:.2f}", "-i", str(src),
            "-frames:v", "1", str(still)])
        head = W / f"h{i:02d}.mp4"
        sh(["ffmpeg", "-v", "error", "-y",
            "-loop", "1", "-t", f"{FREEZE:.3f}", "-i", str(still),
            "-ss", f"{FREEZE:.3f}", "-t", f"{kf - FREEZE:.3f}", "-i", str(src),
            "-t", f"{kf:.3f}", "-i", str(src),
            "-filter_complex", "[0:v]fps=60,format=yuv420p[a];[1:v]fps=60,format=yuv420p[b];"
                               "[a][b]concat=n=2:v=1:a=0[v]",
            "-map", "[v]", "-map", "2:a", *VENC, "-af", "aresample=48000", *AENC,
            "-t", f"{kf:.3f}", str(head)])
        segs.append(head)

        # tail: everything from that keyframe, stream-copied, untouched
        tail = W / f"t{i:02d}.mp4"
        sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{kf:.6f}", "-i", str(src),
            "-c", "copy", "-avoid_negative_ts", "make_zero", str(tail)])
        segs.append(tail)
        last_src = src

    # A beat of silence before the closing prayer. It must NOT be a frozen frame of
    # the reading: the readalong is still scrolling at its final frame (41k pixels
    # moving at -0.05s, it decelerates but never rests), so freezing it stops the
    # scroll dead and reads as a glitch. Hold an EMPTY page instead - the reading's
    # own ground with nothing on it. A breath, not a stall.
    hold_png = W / "hold.png"
    R.shot(EMPTY_PAGE, hold_png)
    hold = W / "hold.mp4"
    sh(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", "60",
        "-t", f"{PRE_SILENCE:.2f}", "-i", str(hold_png),
        "-f", "lavfi", "-t", f"{PRE_SILENCE:.2f}", "-i", "anullsrc=r=48000:cl=mono",
        "-map", "0:v", "-map", "1:a", *VENC, *AENC, "-shortest", str(hold)])
    segs.append(hold)

    segs.append(prayer_60("after"))

    lst = W / "l.txt"
    lst.write_text("".join(f"file '{s}'\n" for s in segs))
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / f"day{day:03d}.mp4"
    sh(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
        "-c", "copy", "-movflags", "+faststart", str(out)])
    subprocess.run(["rm", "-rf", str(W)], capture_output=True)
    return out, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--day", type=int)
    ap.add_argument("--days")
    ap.add_argument("--all", action="store_true")
    a = ap.parse_args()

    days = {d["day"]: d for d in json.loads(SCRIPT.read_text())}
    if a.all:
        want = sorted(days)
    elif a.days:
        want = [int(x) for x in a.days.split(",")]
    elif a.day:
        want = [a.day]
    else:
        sys.exit("pass --day N, --days a,b,c or --all")

    t0 = time.time()
    done = skipped = failed = 0
    for n in want:
        out = OUT / f"day{n:03d}.mp4"
        if out.exists() and out.stat().st_size > 1_000_000:
            skipped += 1
            continue
        s = time.time()
        path, err = render_day(n, days[n])
        if err:
            print(f"  day {n:3}  FAILED — {err}")
            failed += 1
            continue
        d = R.dur(path)
        done += 1
        print(f"  day {n:3}  {int(d//60):3}m {int(d%60):02d}s   "
              f"{path.stat().st_size/1048576:6.0f} MB   built in {time.time()-s:5.1f}s")

    el = time.time() - t0
    print(f"\n{done} rendered, {skipped} already present, {failed} failed   "
          f"({int(el//60)}m {int(el%60)}s)")


if __name__ == "__main__":
    main()
