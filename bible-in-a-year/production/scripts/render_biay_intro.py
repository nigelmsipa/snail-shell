#!/usr/bin/env python3
"""Render the BIAY month INTRO: translation -> contents -> zoom.

Mirrors the library opening (renderer-gpu/assemble_book.sh, `concat` branch),
which is translation.mp4 + <book>-contents.mp4 + zoom.mp4 before the chapters.
Here the "book" is a month, so the contents board lists the month's days.

TWO RULES THIS ENCODES, both Nigel's:

  1. Every screen change gets an AUDIO CUE.
  2. Every board that HOLDS gets a VISUAL TIMER showing how long it holds.

  Exempt: the reading, the chapter card, the day announcement board. Those three
  announce themselves out loud; a chime over them talks across the voice.

THE TIMER DRAINS, THE YEAR FILLS. Both are the same 16px full-bleed gold rule on
the top edge - one material, one decreed thickness - but they move in opposite
directions, because they say opposite things. The day board's bar FILLS left to
right as the year accumulates ("day 12 of 365"). An intro board's bar DRAINS
right to left as its seconds run out ("this ends in 6 seconds"). Same stripe,
read by direction, so the two meanings never collide.

CUE GAIN. The cue masters peak at -24 dB; David and Bella both peak near -0.5 dB.
At their shipped level the chime is inaudible under narration, so it is lifted at
render time rather than re-mastered - one source file, gain visible here, tunable
by ear in one number.

  python3 render_biay_intro.py --month 1
  python3 render_biay_intro.py --month 1 --board-only    # just the contents PNG
"""

import argparse, calendar, json, re, subprocess, sys, tempfile
from pathlib import Path

sys.path.insert(0, "/home/nigel")
import render_biay_sample as R

HOME = Path("/home/nigel")
OUT = HOME / "biay-days"
BOARDS = HOME / "wolf-and-word/output/kjv/assets/boards"
CUES = HOME / "wolf-and-word/assets/cues"
SCRIPT = HOME / "WolfandWordProductionScript_v1.json"
FONTS = "file:///home/nigel/wolf-and-word/assets/fonts/wolf-fonts.css"

GOLD, HAIR = "B3944D", "e6e2da"
EDGE_PX = 16                 # decreed
CUE_GAIN_DB = 16             # -24 dB master -> ~-8 dB, just under the voices

# board hold times. translation/zoom keep the library's, contents gets longer
# because it now carries 31 rows instead of 5 - a signpost you cannot read is
# not a signpost.
T_CONTENTS = 12.0

VENC = ["-c:v", "libx264", "-profile:v", "high", "-level", "4.2", "-crf", "18",
        "-preset", "fast", "-pix_fmt", "yuv420p", "-r", "60"]
AENC = ["-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "1"]


def sh(cmd):
    p = subprocess.run(cmd, capture_output=True)
    if p.returncode:
        sys.exit(f"FAILED: {' '.join(map(str, cmd))}\n{p.stderr.decode()[:600]}")


def dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "default=nw=1:nk=1", str(p)], capture_output=True, text=True)
    return float(r.stdout.strip())


def contents_html(month_name, rows_by_book):
    """The library contents board (engine/boards/gen_book_boards.py CONTENTS_TPL),
    widened to two columns. Dividers stay SOLID - series-consistency decree."""
    def style_ref(label):
        """Book names grey, chapter numbers gold - for EVERY book in the row.

        Six days of the year read two books ('Obadiah 1 . Jonah 1-4'). Styling
        the whole string after the first book name as gold turned the SECOND
        book name gold too, which broke the one rule the column has. Split each
        ' . ' segment at its trailing number run instead: the digits are gold,
        everything before them is a name. Handles '1 John 1-2', where the
        leading digit belongs to the name, because the number group is anchored
        to the end of the segment.
        """
        parts = []
        for seg in label.split(" \u00b7 "):
            m = re.match(r"^(.*?)\s+(\d[\d\u2013\u2014\-]*)$", seg.strip())
            if m:
                parts.append(f'{m.group(1)} <span class="n">{m.group(2)}</span>')
            else:
                parts.append(f'<span class="n">{seg.strip()}</span>')
        return " \u00b7 ".join(parts)

    def col(rows):
        # No arc header. Every row names its own book, so a row lifted out of
        # the list on its own still says what it is - which is the whole point
        # of a contents board someone scrubs against.
        out = []
        for date, label in rows:
            out.append(f'<div class="story"><span class="t">{date}</span>'
                       f'<span class="r">{style_ref(label)}</span></div>')
        return "\n".join(out)

    # BALANCED split, not one column per book. February runs Exodus 38-40 (one
    # day), Leviticus (13), Numbers (14) - a column-per-book would put a single
    # orphan row beside two full ones. The rows name their own books now, so the
    # columns are free to be equal instead of meaningful.
    rows = [r for _, g in rows_by_book for r in g]
    half = (len(rows) + 1) // 2
    cols = "".join(f'<div class="col">{col(c)}</div>' for c in (rows[:half], rows[half:]))
    n = len(rows)
    first = rows_by_book[0][0].title()
    last = rows_by_book[-1][0].title()
    sub = f"{n} days, {first} to {last}"

    return f"""<!doctype html><meta charset="utf-8">
<link href="{FONTS}" rel="stylesheet"><style>
:root{{--paper:#ffffff;--ink:#26324f;--metadata:#9a9388;--faint:#c9c3b7;
--hair:#e6e2da;--gold:#B3944D;
--display:"DM Serif Display",Georgia,serif;--serif:"Source Serif 4",Georgia,serif;
--sans:"IBM Plex Sans",system-ui,sans-serif}}
*{{box-sizing:border-box;margin:0;padding:0}}
html{{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}}
html,body{{width:1920px;height:1080px;overflow:hidden}}
body{{background:var(--paper);position:relative}}
body::before{{content:"";position:absolute;inset:0;pointer-events:none;
 mix-blend-mode:multiply;opacity:.42;z-index:1;
 background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/></svg>")}}
.map{{position:absolute;inset:0;z-index:2;padding:88px 150px}}
.head{{display:flex;align-items:flex-end;justify-content:space-between;
 border-bottom:1px solid var(--hair);padding-bottom:22px;margin-bottom:18px}}
.book{{font-family:var(--display);font-weight:400;font-size:104px;line-height:.9;color:var(--ink)}}
.hr{{text-align:right}}
.hr .t{{font-family:var(--sans);font-size:20px;font-weight:600;letter-spacing:.28em;
 text-transform:uppercase;color:var(--gold)}}
.hr .s{{font-family:var(--serif);font-style:italic;font-size:26px;color:var(--metadata);margin-top:8px}}
.cols{{width:100%;display:flex;gap:110px}}
.col{{flex:1}}
.arc{{font-family:var(--sans);font-size:18px;font-weight:600;letter-spacing:.22em;
 text-transform:uppercase;color:var(--metadata);padding:6px 0 4px}}
.story{{display:flex;align-items:baseline;justify-content:space-between;gap:20px;
 padding:4px 0;border-top:1px solid #efece4}}
/* the head already draws a rule; the first row in each column must not draw a
   second one a few px under it - two lines bunched reads as a mistake */
.col .story:first-child{{border-top:0}}
.story .t{{font-family:var(--serif);font-size:23px;color:var(--ink)}}
.story .r{{font-family:var(--sans);font-size:19px;font-weight:500;letter-spacing:.05em;
 color:var(--metadata);white-space:nowrap}}
.story .n{{color:var(--gold);font-weight:600}}
</style>
<div class="map">
  <div class="head"><div class="book">{month_name}</div>
    <div class="hr"><div class="t">King James Version</div><div class="s">{sub}</div></div></div>
  <div class="cols">{cols}</div>
</div>"""


def timed_board(src, out, secs, cue, animated=False):
    """A board that holds, wearing its drain bar and wearing its cue.

    THE BAR IS DRAWN WITH overlay, NOT drawbox. drawbox evaluates its w/h
    expressions ONCE, at filter init - a time expression in drawbox's width is
    accepted, exits 0, and silently never animates. It looked like a full gold
    bar on every frame and nothing in the log said otherwise. overlay evaluates
    x per frame, so the gold plate is slid off to the left instead: at t=0 it
    covers the rule, at t=secs it is fully gone, and the hair rule drawn
    underneath is what shows through. Visible gold = iw * (1 - t/secs).
    """
    vin = ["-i", str(src)] if animated else ["-loop", "1", "-t", f"{secs:.3f}", "-i", str(src)]
    sh(["ffmpeg", "-v", "error", "-y", *vin,
        "-f", "lavfi", "-i", f"color=c=0x{GOLD}:s=1920x{EDGE_PX}",
        "-i", str(cue),
        "-filter_complex",
        f"[0:v]fps=60,format=yuv420p,"
        f"drawbox=x=0:y=0:w=iw:h={EDGE_PX}:color=0x{HAIR}@1:t=fill[b];"
        f"[b][1:v]overlay=x='-w*(t/{secs:.3f})':y=0:shortest=1[v];"
        f"[2:a]volume={CUE_GAIN_DB}dB,aresample=48000,"
        f"apad=whole_dur={secs:.3f},atrim=0:{secs:.3f}[a]",
        "-map", "[v]", "-map", "[a]", "-t", f"{secs:.3f}", *VENC, *AENC, str(out)])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--month", type=int, default=1)
    ap.add_argument("--board-only", action="store_true")
    a = ap.parse_args()

    mname = calendar.month_name[a.month]
    plan = [d for d in json.loads(SCRIPT.read_text()) if d["date"].startswith(mname + " ")]
    if not plan:
        sys.exit(f"no days for {mname}")

    # group consecutive days by the book they read, in order
    groups, cur, book = [], [], None
    for d in plan:
        b = d["david_chapter_cues"][0].split(".")[0].strip()
        ref = R.reading_label(d)
        short = ref[len(b):].strip() if ref.startswith(b) else ref
        if b != book:
            if cur:
                groups.append((book, cur))
            book, cur = b, []
        cur.append((d["date"], ref))
    groups.append((book, cur))

    OUT.mkdir(parents=True, exist_ok=True)
    png = OUT / f"{mname.lower()}-contents.png"
    R.shot(contents_html(mname, groups), png)
    print(f"contents board  {png}   ({', '.join(f'{b} x{len(r)}' for b, r in groups)})")
    if a.board_only:
        return

    W = Path(tempfile.mkdtemp(prefix="intro-"))
    segs = []
    for name, src, secs, animated in [
        ("translation", BOARDS / "translation.mp4", dur(BOARDS / "translation.mp4"), True),
        ("contents",    png,                        T_CONTENTS,                      False),
        ("zoom",        BOARDS / "zoom.mp4",        dur(BOARDS / "zoom.mp4"),        True),
    ]:
        seg = W / f"{name}.mp4"
        timed_board(src, seg, secs, CUES / "orientation_cue.mp3", animated)
        segs.append(seg)
        print(f"  {name:12} {secs:5.2f}s  cue +{CUE_GAIN_DB}dB  drain bar {EDGE_PX}px")

    lst = W / "l.txt"
    lst.write_text("".join(f"file '{s}'\n" for s in segs))
    out = OUT / f"{mname.lower()}-intro.mp4"
    sh(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
        "-c", "copy", "-movflags", "+faststart", str(out)])
    subprocess.run(["rm", "-rf", str(W)], capture_output=True)
    print(f"\nINTRO  {out}   ({dur(out):.2f}s)")


if __name__ == "__main__":
    main()
