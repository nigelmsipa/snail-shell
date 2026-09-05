#!/usr/bin/env python3
"""Build ONE month of Bible-in-a-Year, end to end, with hard gates.

  translation -> contents -> zoom -> N day videos -> Complete/<Month> (fade)

Every stage must PROVE itself before the next runs. The gates exist because
each one has already caught something real:

  preflight   a missing source found AFTER a 3-minute render is a wasted render
  check_days  duration/stream/prayer-beat proof per day, before anything is built on it
  codec       one signature across every segment, or the stream copy silently degrades
  landing     every timestamp seeked and confirmed to sit on its own day board
  ends        the intro boards and the credits board present in the FINISHED file

Nothing is re-encoded at stitch time: the boards are built to the readalongs'
exact codec params so concat is -c copy.

  python3 build_month.py --month 3
  python3 build_month.py --month 3 --dry-run     # preflight only
"""
import argparse, calendar, json, subprocess, sys, tempfile
from pathlib import Path
import numpy as np
from PIL import Image

sys.path.insert(0, "/home/nigel")
import biay_translation as T
import render_biay_sample as R
import biay_translation as T
from generate_announcer_audio import parse_chapter_cues, slug

HOME = Path("/home/nigel")
OUT = T.paths()["out"]
RA = T.paths()["readalong"]
SCRIPT = HOME / "WolfandWordProductionScript_v1.json"
# The accent is per translation. This was hardcoded to KJV gold, so gate 5
# counted gold pixels regardless of which Bible was building - it would have
# passed a gold bar on MSB (it did) and failed a correct violet one.
def _accent_rgb():
    h = T.data()["palette"]["accent"].lstrip("#")
    return np.array([int(h[i:i+2], 16) for i in (0, 2, 4)])


def sh(cmd, **kw):
    p = subprocess.run(cmd, capture_output=True, **kw)
    if p.returncode:
        sys.exit(f"\nFAILED: {' '.join(map(str, cmd))}\n{p.stderr.decode()[:600]}")
    return p


def dur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                 "-of", "default=nw=1:nk=1", str(p)],
                                capture_output=True, text=True).stdout.strip())


def hms(t):
    t = int(t); h = t // 3600
    return f"{h}:{(t%3600)//60:02d}:{t%60:02d}" if h else f"{(t%3600)//60}:{t%60:02d}"


def gate(name, ok, detail=""):
    print(f"  [{'PASS' if ok else 'FAIL'}] {name:34} {detail}")
    if not ok:
        sys.exit(f"\nGATE FAILED: {name} — stopping before anything downstream is built on it.")


def frame(video, t, png):
    sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(video), "-frames:v", "1", str(png)])
    return Image.open(png)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--month", type=int, required=True)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    mname = calendar.month_name[a.month]
    slug_m = mname.lower()
    plan = [d for d in json.loads(SCRIPT.read_text()) if d["date"].startswith(mname + " ")]
    if not plan:
        sys.exit(f"no days for {mname}")
    days = [d["day"] for d in plan]
    print(f"\n=== {mname.upper()} — {len(plan)} days, day {days[0]}–{days[-1]} ===")
    print(f"    {R.reading_label(plan[0])}  ...  {R.reading_label(plan[-1])}\n")

    # ---- GATE 1: every source exists BEFORE any render starts
    miss_b = [d["day"] for d in plan
              if not (HOME / f"audio/day{d['day']:03d}_bella_announcement.mp3").exists()]
    miss_s, nch = [], 0
    for d in plan:
        for book, ch in parse_chapter_cues(d["david_chapter_cues"]):
            nch += 1
            if not (RA / f"{slug(book)}-{ch:02d}-readalong.mp4").exists():
                miss_s.append(f"{slug(book)}-{ch:02d}")
    gate("sources: Bella announcements", not miss_b, f"{len(plan)-len(miss_b)}/{len(plan)}"
         + (f"  MISSING {miss_b}" if miss_b else ""))
    gate("sources: readalong chapters", not miss_s, f"{nch-len(miss_s)}/{nch}"
         + (f"  MISSING {miss_s[:6]}" if miss_s else ""))
    if a.dry_run:
        print("\n--dry-run: preflight only, nothing built")
        return

    # ---- render days
    todo = [n for n in days if not (OUT / f"day{n:03d}.mp4").exists()]
    if todo:
        print(f"\n  rendering {len(todo)} day(s)...")
        sh([sys.executable, str(HOME / "render_full_day.py"), "--days", ",".join(map(str, todo))])
    gate("day videos present", all((OUT / f"day{n:03d}.mp4").exists() for n in days),
         f"{len(days)}/{len(days)}")

    # ---- GATE 2: prove every day against the plan
    p = subprocess.run([sys.executable, str(HOME / "check_days.py"), "--month", str(a.month), "--deep"],
                       capture_output=True, text=True)
    _tail = [l for l in (p.stdout or "").strip().splitlines() if "FAIL" in l or "PASS" in l or "PROBLEM" in l]
    _err = (p.stderr or "").strip().splitlines()[-3:]
    gate("check_days --deep", p.returncode == 0,
         (_tail[-1] if _tail else "no summary line") +
         (("   stderr: " + " | ".join(_err)) if p.returncode and _err else ""))

    # ---- intro + outro
    sh([sys.executable, str(HOME / "render_biay_intro.py"), "--month", str(a.month)])
    sh([sys.executable, str(HOME / "render_biay_outro.py"), "--month", str(a.month)])
    intro = OUT / f"{slug_m}-intro.mp4"
    outro = OUT / f"{slug_m}-outro-O3-credits-fade.mp4"
    gate("intro + outro built", intro.exists() and outro.exists(),
         f"{dur(intro):.2f}s + {dur(outro):.2f}s")

    # ---- GATE 3: the intro's drain bar actually drains, once per board
    W = Path(tempfile.mkdtemp(prefix=f"{slug_m}-"))
    sh(["ffmpeg", "-v", "error", "-y", "-i", str(intro), "-vf", "fps=1,crop=1920:16:0:0",
        str(W / "b_%03d.png")])
    vals = [np.all(np.abs(np.array(Image.open(f).convert("RGB")).astype(int) - _accent_rgb()) < 40,
                   axis=2)[8].mean() * 100
            for f in sorted(W.glob("b_*.png"))]
    resets = [i for i in range(1, len(vals)) if vals[i] > vals[i - 1] + 20]
    gate("intro drain bar resets per board", len(resets) == 2, f"at t={resets}s (expect 2 resets)")

    # ...and the bar is THIS translation's accent, not another Bible's.
    b0 = np.array(Image.open(sorted(W.glob("b_*.png"))[0]).convert("RGB")).astype(int)
    lit = b0.reshape(-1, 3)[np.abs(b0.reshape(-1, 3) - _accent_rgb()).sum(axis=1) < 60]
    barpx = tuple(int(x) for x in lit.mean(axis=0)) if len(lit) else (0, 0, 0)
    gate("drain bar is this translation's accent", len(lit) > 20000,
         f"want {tuple(int(x) for x in _accent_rgb())} got {barpx} over {len(lit)}px")

    # ---- GATE 4: one codec signature, or the copy is unsafe
    segs = [intro] + [OUT / f"day{n:03d}.mp4" for n in days] + [outro]
    sigs = set()
    for f in segs:
        v = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                            "stream=codec_name,width,height,pix_fmt,r_frame_rate", "-of", "csv=p=0",
                            str(f)], capture_output=True, text=True).stdout.strip()
        au = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries",
                             "stream=codec_name,sample_rate,channels", "-of", "csv=p=0",
                             str(f)], capture_output=True, text=True).stdout.strip()
        sigs.add((v, au))
    gate("one codec signature", len(sigs) == 1, f"{len(segs)} segments  {next(iter(sigs))[0]}")

    # ---- stitch
    lst = W / "l.txt"
    lst.write_text("".join(f"file '{s}'\n" for s in segs))
    tmp = OUT / f"{slug_m}-v2.mp4"
    sh(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
        "-c", "copy", "-movflags", "+faststart", str(tmp)])
    total = dur(tmp)
    expect = sum(dur(s) for s in segs)
    gate("duration == sum of parts", abs(total - expect) < 1.0,
         f"{hms(total)}  (delta {total-expect:+.2f}s)")

    # ---- GATE 5: every timestamp lands on its own day board
    lines, cum, marks = ["0:00 Intro"], dur(intro), []
    for d in plan:
        marks.append((cum, d["date"]))
        lines.append(f"{hms(cum)} {d['date']} — {R.reading_label(d)}")
        cum += dur(OUT / f"day{d['day']:03d}.mp4")
    credits_at = cum
    lines.append(f"{hms(cum)} Credits")
    (OUT / f"{slug_m}-chapters.txt").write_text("\n".join(lines) + "\n")

    bad = []
    for i, (t, date) in enumerate(marks):
        g = np.array(frame(tmp, t + 3, W / f"m{i:03d}.png").convert("L")).astype(int)
        if not (g[300:800].mean() > 230 and g[0:20].mean() < 245):
            bad.append(date)
    gate("timestamps land on a day board", not bad,
         f"{len(marks)-len(bad)}/{len(marks)}" + (f"  BAD {bad}" if bad else ""))

    # ---- GATE 6: the boards are actually in the finished file
    ends = {"translation": 2.0, "contents": dur(intro) / 2, "zoom": dur(intro) - 2.0,
            "credits": credits_at + 2.0}
    missing = []
    for name, t in ends.items():
        im = frame(tmp, t, W / f"e_{name}.png")
        L = np.array(im.convert("L")).astype(int)
        if L[300:800].mean() < 200:
            missing.append(name)
    gate("intro + credits boards in output", not missing,
         "translation/contents/zoom/credits" + (f"  MISSING {missing}" if missing else ""))

    # ---- GATE 10: the boards name the RIGHT BIBLE.
    # engine/translation_env.sh: "forget TRANSLATION_LABEL -> all 1,189 chapters say
    # KING JAMES VERSION ... every duration gate passes, because the video is the
    # right LENGTH, just the wrong Bible." Gates 1-9 would all pass on that. This one
    # will not. Two independent checks:
    #   ink   - the hero type's colour must be THIS translation's ink
    #   label - the footer's translation name, measured by ink width, must match a
    #           freshly rendered reference for the expected name more closely than
    #           for any other translation's name
    im = frame(tmp, marks[0][0] + 3, W / "label.png")
    arr = np.array(im.convert("RGB")).astype(int)
    want_ink = tuple(int(T.data()["palette"]["ink"].lstrip("#")[i:i+2], 16) for i in (0, 2, 4))
    dark = arr.reshape(-1, 3)[np.array(im.convert("L")).reshape(-1) < 120]
    got = tuple(int(x) for x in dark.mean(axis=0)) if len(dark) else (0, 0, 0)
    ink_ok = sum(abs(a - b) for a, b in zip(got, want_ink)) < 90
    gate("day board ink is this translation's", ink_ok,
         f"want {want_ink} got {got}")

    def label_width(text):
        html = (f'<!doctype html><meta charset="utf-8">'
                f'<link href="{R.FONTS}" rel="stylesheet"><style>'
                f'html,body{{width:1920px;height:200px;margin:0;background:#fff}}'
                f'div{{font-family:"IBM Plex Sans",sans-serif;font-weight:600;font-size:26px;'
                f'letter-spacing:.30em;text-transform:uppercase;color:#000;padding:80px 0 0 40px}}'
                f'</style><div>{text}</div>')
        png = W / ("ref_" + "".join(c for c in text if c.isalnum())[:20] + ".png")
        R.shot(html, png)
        g = np.array(Image.open(png).convert("L")).astype(int)
        cols = np.where(g.min(axis=0) < 160)[0]
        return int(cols.max() - cols.min() + 1) if len(cols) else 0

    band = np.array(im.convert("L")).astype(int)[955:1000]
    cols = np.where(band.min(axis=0) < 170)[0]
    got_w = int(cols.max() - cols.min() + 1) if len(cols) else 0
    cands = {}
    for f in sorted((HOME / "wolf-and-word/engine/translations").glob("*.json")):
        cands[f.stem] = label_width(json.loads(f.read_text())["name"])
    best = min(cands, key=lambda k: abs(cands[k] - got_w))
    gate("footer names the right translation", best == T.slug(),
         f"measured {got_w}px -> closest is '{best}' " +
         ", ".join(f"{k}={v}" for k, v in sorted(cands.items())))

    # ---- GATE 11: the PRAYER board is this translation's ink.
    # Gate 10 samples the day board and would pass a month whose prayer boards
    # came from another Bible - which is precisely what happened to MSB January.
    pt = marks[0][0] + R.dur(HOME / f"audio/day{plan[0]['day']:03d}_bella_announcement.mp3") + 6.0
    pim = np.array(frame(tmp, pt, W / "prayer.png").convert("RGB")).astype(int)
    pm = pim[400:700, 300:1600].reshape(-1, 3).mean(axis=0)
    pdelta = sum(abs(a - b) for a, b in zip(pm, want_ink))
    gate("prayer board ink is this translation's", pdelta < 60,
         f"want {want_ink} got ({pm[0]:.0f},{pm[1]:.0f},{pm[2]:.0f}) delta {pdelta:.0f}")

    # ---- promote
    final = OUT / f"{slug_m}.mp4"
    tmp.replace(final)
    subprocess.run(["rm", "-rf", str(W)], capture_output=True)
    head = open(final, "rb").read(2_000_000)
    gate("faststart (moov before mdat)", head.find(b"moov") < 100 and head.find(b"mdat") == -1,
         f"moov at {head.find(b'moov')}")

    print(f"\n{mname.upper()} COMPLETE  {final}")
    print(f"  {hms(total)}   {final.stat().st_size/1073741824:.1f} GB   "
          f"{len(plan)} days   chapters -> {slug_m}-chapters.txt\n")


if __name__ == "__main__":
    main()
