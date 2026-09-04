#!/usr/bin/env python3
"""
Render BIAY sample videos so the day board can be judged in motion, not as a still.

Boards are screenshotted to PNG via headless Chromium (the brand spec's route for
static screens) and assembled with ffmpeg. Nothing is screencast.

  python3 render_biay_sample.py scrub   --variant j1     montage across the year
  python3 render_biay_sample.py dayopen --variant j1     one day, Bella -> prayer -> David
"""

import argparse, json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path("/home/nigel")
OUT = ROOT / "biay-samples"
SCRIPT = ROOT / "WolfandWordProductionScript_v1.json"
AUDIO = ROOT / "audio"
KJV = ROOT / "openbible-kjv"
CHROMIUM = "/usr/sbin/chromium"
EDGE_PX = 5   # full-bleed rule thickness; --edge-px overrides

TOK = """--paper:#ffffff;--ink:#26324f;--metadata:#9a9388;--faint:#c9c3b7;--hair:#e6e2da;--gold:#B3944D"""
FONTS = ("file:///home/nigel/wolf-and-word/assets/fonts/wolf-fonts.css")


def board_html(day, date, reading, variant, invert=False, pray=False):
    pct = day / 365 * 100
    grain = ("background:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'>"
             "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/>"
             "</filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/></svg>\")")

    if pray:  # colours invert, breathing circle, no speech
        return f"""<!doctype html><meta charset="utf-8">
<link href="{FONTS}" rel="stylesheet"><style>
:root{{{TOK}}}*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:1920px;height:1080px;overflow:hidden}}
body{{background:var(--ink);display:flex;flex-direction:column;align-items:center;
 justify-content:center;gap:64px;font-family:"IBM Plex Sans",sans-serif}}
.circle{{width:260px;height:260px;border-radius:50%;border:3px solid var(--gold);opacity:.85}}
.t{{font-size:34px;font-weight:600;letter-spacing:.34em;text-transform:uppercase;color:#e9e4d8}}
</style><div class="circle"></div><div class="t">Take this moment to pray</div>"""

    year = ""
    if variant == "j1":
        year = f"""<div class="yearblk"><div class="yearrow">
          <span class="yearlab">The year</span>
          <span class="yearnum">{day:03d} / 365</span></div>
          <div class="track"><div class="fill" style="width:{pct:.2f}%"></div></div></div>"""
    edge = ""
    if variant == "j2":
        edge = f'<div class="edge bot"><div class="f" style="width:{pct:.2f}%"></div></div>'
    elif variant == "k":   # full-bleed, TOP edge - clear of YouTube's own controls
        edge = f'<div class="edge top"><div class="f" style="width:{pct:.2f}%"></div></div>'

    return f"""<!doctype html><meta charset="utf-8">
<link href="{FONTS}" rel="stylesheet"><style>
:root{{{TOK}}}*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:1920px;height:1080px;overflow:hidden}}
body{{background:var(--paper);position:relative;
 -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}}
body::before{{content:"";position:absolute;inset:0;pointer-events:none;
 mix-blend-mode:multiply;opacity:.42;z-index:1;{grain}}}
:root{{--optical-y:540px;--hero-dx:3px;--read-dx:2px;--foot-dx:5px}}
.wrap{{position:absolute;left:0;right:0;top:var(--optical-y);transform:translateY(-50%);
 z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 150px}}
.rail{{position:absolute;left:150px;right:150px;z-index:3;display:flex;
 justify-content:space-between;font-family:"IBM Plex Sans",sans-serif;font-weight:600;
 font-size:26px;letter-spacing:.30em;text-transform:uppercase;top:88px}}
.gold{{color:var(--gold)}}.grey{{color:var(--metadata)}}
.datehero{{font-family:"DM Serif Display",Georgia,serif;font-size:230px;line-height:.94;
 color:var(--ink);position:relative;left:var(--hero-dx)}}
.reading{{font-family:"DM Serif Display",Georgia,serif;font-size:{96 if len(reading)<=24 else 74}px;
 color:var(--gold);line-height:1.06;margin-top:26px;position:relative;left:var(--read-dx)}}
.foot{{position:absolute;left:150px;right:150px;bottom:88px;z-index:3;
 display:flex;flex-direction:column;align-items:center;gap:20px}}
.trans{{font-family:"IBM Plex Sans",sans-serif;font-weight:600;font-size:26px;
 letter-spacing:.30em;text-transform:uppercase;color:var(--metadata);
 position:relative;left:var(--foot-dx)}}
.yearblk{{width:760px}}
.yearrow{{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px}}
.yearlab{{font-family:"IBM Plex Sans",sans-serif;font-size:19px;font-weight:600;
 letter-spacing:.22em;text-transform:uppercase;color:var(--faint)}}
.yearnum{{font-family:"IBM Plex Mono",monospace;font-size:20px;color:var(--faint);
 font-variant-numeric:tabular-nums}}
.track{{height:3px;background:var(--hair);position:relative}}
.fill{{position:absolute;left:0;top:0;height:3px;background:var(--gold)}}
.edge{{position:absolute;left:0;right:0;height:{EDGE_PX}px;background:var(--hair);z-index:3}}
.edge.bot{{bottom:0}}.edge.top{{top:0}}
.edge .f{{position:absolute;left:0;top:0;height:{EDGE_PX}px;background:var(--gold)}}
</style>
<div class="rail"><span class="gold">Bible in a Year</span>
  <span class="grey">Day {day} of 365</span></div>
<div class="wrap"><div class="datehero">{date}</div>
  <div class="reading">{reading}</div></div>
<div class="foot"><div class="trans">King James Version</div>{year}</div>{edge}"""


def shot(html, png):
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as f:
        f.write(html); src = f.name
    subprocess.run([CHROMIUM, "--headless", "--disable-gpu", "--no-sandbox",
                    "--hide-scrollbars", "--force-device-scale-factor=1",
                    "--window-size=1920,1080", "--virtual-time-budget=3000",
                    f"--screenshot={png}", f"file://{src}"],
                   check=True, capture_output=True)
    Path(src).unlink(missing_ok=True)


def reading_label(entry):
    sys.path.insert(0, str(ROOT))
    from generate_announcer_audio import parse_chapter_cues
    slots = parse_chapter_cues(entry["david_chapter_cues"])
    grouped = []
    for b, c in slots:
        if grouped and grouped[-1][0] == b:
            grouped[-1][1].append(c)
        else:
            grouped.append([b, [c]])
    return " · ".join(f"{b} {ch[0]}" if len(ch) == 1 else f"{b} {ch[0]}–{ch[-1]}"
                      for b, ch in grouped)


def dur(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "default=nw=1:nk=1", str(path)],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mode", choices=["scrub", "dayopen"])
    ap.add_argument("--variant", default="j1", choices=["g2", "j1", "j2", "k"])
    ap.add_argument("--days", default="1,60,120,194,260,320,359")
    ap.add_argument("--edge-px", type=int, default=5)
    ap.add_argument("--suffix", default="")
    a = ap.parse_args()
    global EDGE_PX
    EDGE_PX = a.edge_px

    OUT.mkdir(exist_ok=True)
    days = {e["day"]: e for e in json.loads(SCRIPT.read_text())}
    work = Path(tempfile.mkdtemp(prefix="biay-"))

    if a.mode == "scrub":
        picks = [int(d) for d in a.days.split(",")]
        segs = []
        for d in picks:
            e = days[d]
            png = work / f"b{d:03d}.png"
            shot(board_html(d, e["date"], reading_label(e), a.variant), png)
            bella = AUDIO / f"day{d:03d}_bella_announcement.mp3"
            seg = work / f"s{d:03d}.mp4"
            hold = dur(bella) + 1.4
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", str(png),
                            "-i", str(bella), "-c:v", "libx264", "-t", f"{hold:.2f}",
                            "-pix_fmt", "yuv420p", "-r", "30",
                            "-af", f"adelay=400|400,apad=whole_dur={hold:.2f}",
                            "-c:a", "aac", "-b:a", "192k", "-shortest", str(seg)], check=True)
            segs.append(seg)
            print(f"  day {d:3}  {e['date']:12} {reading_label(e)}")
        lst = work / "list.txt"
        lst.write_text("".join(f"file '{s}'\n" for s in segs))
        out = OUT / f"sample_scrub_{a.variant}{a.suffix}.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0",
                        "-i", str(lst), "-c", "copy", str(out)], check=True)
        print(f"\n{out}  ({dur(out):.1f}s)")

    else:
        d = int(a.days.split(",")[0]); e = days[d]
        lbl = reading_label(e)
        # 1 · day board while Bella speaks
        p1 = work / "p1.png"; shot(board_html(d, e["date"], lbl, a.variant), p1)
        bella = AUDIO / f"day{d:03d}_bella_announcement.mp3"
        t1 = dur(bella) + 1.8
        s1 = work / "s1.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", str(p1),
                        "-i", str(bella), "-c:v", "libx264", "-t", f"{t1:.2f}", "-r", "30",
                        "-pix_fmt", "yuv420p", "-af", f"adelay=500|500,apad=whole_dur={t1:.2f}",
                        "-c:a", "aac", "-b:a", "192k", str(s1)], check=True)
        # 2 · prayer beat - silent by design (prayer_cue.mp3 does not exist yet)
        p2 = work / "p2.png"; shot(board_html(d, e["date"], lbl, a.variant, pray=True), p2)
        s2 = work / "s2.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", str(p2),
                        "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
                        "-c:v", "libx264", "-t", "5", "-r", "30", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "192k", "-shortest", str(s2)], check=True)
        # 3 · David begins - existing narration, header trimmed at the aligned offset
        sys.path.insert(0, str(ROOT))
        from generate_announcer_audio import parse_chapter_cues, kjv_source
        book, ch = parse_chapter_cues(e["david_chapter_cues"])[0]
        src, off = kjv_source(book, ch)
        s3 = work / "s3.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", str(p1),
                        "-ss", "0", "-t", "38", "-i", str(src),
                        "-c:v", "libx264", "-t", "38", "-r", "30", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "192k", "-shortest", str(s3)], check=True)
        lst = work / "list.txt"
        lst.write_text("".join(f"file '{s}'\n" for s in (s1, s2, s3)))
        out = OUT / f"sample_dayopen_{a.variant}.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0",
                        "-i", str(lst), "-c", "copy", str(out)], check=True)
        print(f"day {d} · {e['date']} · {lbl}")
        print(f"  Bella {dur(bella):.1f}s -> prayer 5.0s (silent) -> David {book} {ch} "
              f"(header ends {off:.2f}s)")
        print(f"\n{out}  ({dur(out):.1f}s)")


if __name__ == "__main__":
    main()
