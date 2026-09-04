#!/usr/bin/env python3
"""Render the BIAY month OUTRO, in two variants, to be judged side by side.

  O1  credits board   - the library outro (engine/boards/gen_book_boards.py
                        OUTRO_TPL) adapted to a month. NO "next up": the book
                        series can promise the next book because it is already
                        rendered; February is not, and a card that promises a
                        video that does not exist is a card that ages badly.
  O2  fade            - no board at all. The closing prayer fades to paper and
                        the video ends on the series' own ground.

O1 holds, so by the rule it wears a cue and a drain bar. O2 does not hold - it
is an ending, not a beat - so it wears neither.

  python3 render_biay_outro.py --month 1
"""
import argparse, calendar, json, subprocess, sys, tempfile
from pathlib import Path

sys.path.insert(0, "/home/nigel")
import render_biay_sample as R
from render_biay_intro import (HOME, OUT, CUES, SCRIPT, FONTS, VENC, AENC,
                               EDGE_PX, sh, dur, timed_board)

T_CREDITS = 8.0
FADE = 1.6


def credits_html(month, span):
    return f"""<!doctype html><meta charset="utf-8">
<link href="{FONTS}" rel="stylesheet"><style>
:root{{--paper:#ffffff;--ink:#26324f;--ink-soft:#4f535a;--metadata:#9a9388;
--hair:#e6e2da;--gold:#B3944D;
--display:"DM Serif Display",Georgia,serif;--serif:"Source Serif 4",Georgia,serif;
--sans:"IBM Plex Sans",system-ui,sans-serif}}
*{{box-sizing:border-box;margin:0;padding:0}}
html{{-webkit-font-smoothing:antialiased}}html,body{{width:1920px;height:1080px;overflow:hidden}}
body{{background:var(--paper);position:relative}}
body::before{{content:"";position:absolute;inset:0;pointer-events:none;mix-blend-mode:multiply;
 opacity:.42;z-index:1;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/></svg>")}}
.outro{{position:absolute;inset:0;z-index:2;padding:150px 170px;
 display:grid;grid-template-columns:1.05fr 1fr;gap:120px}}
.left{{align-self:center}}
.eyebrow{{font-family:var(--sans);font-size:24px;font-weight:600;letter-spacing:.30em;
 text-transform:uppercase;color:var(--gold)}}
.left h3{{font-family:var(--display);font-weight:400;font-size:176px;line-height:.9;
 color:var(--ink);margin-top:14px}}
.sum{{font-family:var(--serif);font-style:italic;font-size:33px;line-height:1.5;
 color:var(--ink-soft);max-width:640px;margin-top:26px}}
.right{{border-left:1px solid var(--hair);padding-left:80px;
 display:flex;flex-direction:column;justify-content:center}}
.cr{{font-family:var(--serif);font-size:34px;color:var(--ink-soft);margin-bottom:34px}}
.cr .k{{display:block;font-family:var(--sans);font-size:17px;font-weight:600;
 letter-spacing:.22em;text-transform:uppercase;color:var(--metadata);margin-bottom:8px}}
.cr .src{{color:var(--metadata);font-size:22px;margin-left:14px;vertical-align:.16em}}
.brand{{position:absolute;right:170px;bottom:64px;z-index:3;font-family:var(--sans);
 font-size:20px;font-weight:600;letter-spacing:.08em;color:var(--metadata)}}
</style>
<div class="outro">
  <div class="left"><div class="eyebrow">Complete</div><h3>{month}</h3>
    <div class="sum">{span}</div></div>
  <div class="right">
    <div class="cr"><span class="k">Translation</span>King James Version</div>
    <div class="cr"><span class="k">Narration</span>David<span class="src">openbible.com</span></div>
  </div>
</div><div class="brand">W &amp; W</div>"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--month", type=int, default=1)
    a = ap.parse_args()

    mname = calendar.month_name[a.month]
    plan = [d for d in json.loads(SCRIPT.read_text()) if d["date"].startswith(mname + " ")]
    first, last = R.reading_label(plan[0]), R.reading_label(plan[-1])
    span = f"{len(plan)} days. {first.split('–')[0].strip()} through {last.split('–')[-1].strip() if '–' in last else last}."
    # span reads e.g. "31 days. Genesis 1 through 37." -> name the closing book
    lastbook = plan[-1]["david_chapter_cues"][0].split(".")[0].strip()
    firstbook = plan[0]["david_chapter_cues"][0].split(".")[0].strip()
    fc = R.reading_label(plan[0]).replace(firstbook, "").strip().split("–")[0]
    lc = R.reading_label(plan[-1]).replace(lastbook, "").strip().split("–")[-1]
    span = f"{len(plan)} days. {firstbook} {fc} through {lastbook} {lc}."

    OUT.mkdir(parents=True, exist_ok=True)

    # ---- O1: credits board, holds, so cue + drain bar
    png = OUT / f"{mname.lower()}-credits.png"
    R.shot(credits_html(mname, span), png)
    o1 = OUT / f"{mname.lower()}-outro-O1-credits.mp4"
    timed_board(png, o1, T_CREDITS, CUES / "orientation_cue.mp3", animated=False)
    print(f"O1 credits board  {o1.name}  {T_CREDITS:.1f}s  '{span}'")

    # ---- O3: THE APPROVED OUTRO. O1's board, fading to paper over its last
    # FADE seconds. Nigel picked this on 2026-09-04: the fade is HOW the board
    # leaves, not a reason to skip having one - the borrowed narration needs
    # somewhere to be credited, and a fade to nothing gives it nowhere.
    o3 = OUT / f"{mname.lower()}-outro-O3-credits-fade.mp4"
    sh(["ffmpeg", "-v", "error", "-y", "-i", str(o1),
        "-vf", f"fade=t=out:st={T_CREDITS - FADE:.2f}:d={FADE:.2f}:c=white",
        "-af", f"afade=t=out:st={T_CREDITS - FADE:.2f}:d={FADE:.2f}",
        *VENC, *AENC, str(o3)])
    print(f"O3 credits+fade   {o3.name}  {T_CREDITS:.1f}s  <-- THE ONE THAT SHIPS")

    # ---- O2: no board. The last day's closing prayer fades to paper.
    day = OUT / f"day{plan[-1]['day']:03d}.mp4"
    total = dur(day)
    o2 = OUT / f"{mname.lower()}-outro-O2-fade.mp4"
    tail = 5.0
    sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{total - tail:.3f}", "-i", str(day),
        "-f", "lavfi", "-i", "color=c=white:s=1920x1080:r=60",
        "-filter_complex",
        f"[0:v]fps=60,format=yuv420p,fade=t=out:st={tail - FADE:.2f}:d={FADE:.2f}:c=white[v];"
        f"[0:a]afade=t=out:st={tail - FADE:.2f}:d={FADE:.2f}[a]",
        "-map", "[v]", "-map", "[a]", "-t", f"{tail:.3f}", *VENC, *AENC, str(o2)])
    print(f"O2 fade           {o2.name}  {tail:.1f}s  (last {FADE}s fades to paper, audio with it)")

    # ---- one comparison reel: O1 then a 1s gap then O2
    W = Path(tempfile.mkdtemp(prefix="outro-"))
    gap = W / "gap.mp4"
    sh(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "color=c=0x26324f:s=1920x1080:r=60:d=1",
        "-f", "lavfi", "-t", "1", "-i", "anullsrc=r=48000:cl=mono",
        "-map", "0:v", "-map", "1:a", *VENC, *AENC, str(gap)])
    lst = W / "l.txt"
    lst.write_text("".join(f"file '{p}'\n" for p in (o1, gap, o2, gap, o3)))
    reel = OUT / f"{mname.lower()}-outro-COMPARE.mp4"
    sh(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
        "-c", "copy", str(reel)])
    subprocess.run(["rm", "-rf", str(W)], capture_output=True)
    print(f"\nCOMPARE  {reel}  ({dur(reel):.1f}s)  O1 | O2 | O3")


if __name__ == "__main__":
    main()
