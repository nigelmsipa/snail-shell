#!/usr/bin/env python3
"""
make_youtube.py — broadcast / lyric-video variants of the read-along. 🐌🎬

The everyday player (add_words.py -> <base>-words.html) is built for a READER on
a phone: a long cream scroll with audio + speed + lead controls.

This builds SCREEN-RECORDABLE versions instead: a fixed 1920x1080 stage, no
chrome, large centered text with the current word lit. Point OBS at it, hit play,
get a YouTube-ready read-along. Same alignment numbers + same rAF sync engine as
the phone player — only the LAYOUT changes.

Three layouts (--layout), from least to most on-screen context:
  solo     one verse centered, swaps each boundary (minimal, pure lyric video)
  window   3 lines visible: prev (dim) / current (lit) / next (dim)   [DEFAULT]
  passage  whole chapter on screen, broadcast-styled, auto-scrolls to keep the
           active verse centered — the "what we have on the web" feel, 16:9

Usage:
  make_youtube.py psalm-23-aligned.json                      # window (default)
  make_youtube.py psalm-23-aligned.json --layout passage
  make_youtube.py psalm-23-aligned.json --all                # write all 3
  make_youtube.py john-01-aligned.json --title "John 1" --sub "Berean Standard Bible"
Writes: <base>-yt-<layout>.html  (needs the .opus next to it)
"""
import os
import re
import sys
import json
import argparse

_WORD = re.compile(r"\S+")


def word_spans(text, start_ms, end_ms):
    words = _WORD.findall(text)
    if not words:
        return []
    weights = [len(w) + 1 for w in words]
    total = sum(weights)
    span = max(0, end_ms - start_ms)
    out, acc = [], 0
    for w, wt in zip(words, weights):
        s = start_ms + round(span * acc / total)
        acc += wt
        e = start_ms + round(span * acc / total)
        out.append({"t": w, "s": s, "e": e})
    return out


def load_words(data):
    if data.get("words"):
        return [{"t": w["t"], "s": w["s"], "e": w["e"], "si": w.get("si", 0)}
                for w in data["words"]]
    flat = []
    for si, c in enumerate(data["sentences"]):
        for w in word_spans(c["text"], c["start_ms"], c["end_ms"]):
            w["si"] = si
            flat.append(w)
    return flat


# Color coding lives ONLY in the highlighter + verse numbers, and it means
# "where you are in the canon" (orientation, not decoration). Each section:
#   hl = LIGHT wash so the dark word on top stays readable (accessibility),
#   ac = DEEP same-hue accent so verse numbers read on cream.
SECTIONS = {
    "law":       {"hl": "#efd9a2", "ac": "#a8821f"},   # Torah — warm gold
    "history":   {"hl": "#eccab2", "ac": "#a85f30"},   # Joshua–Esther — clay
    "wisdom":    {"hl": "#ead0c0", "ac": "#9c6b3f"},   # Job–Song — sand/amber
    "major":     {"hl": "#d3ddc2", "ac": "#5f7a3e"},   # Isa–Daniel — sage
    "minor":     {"hl": "#dadcb4", "ac": "#76792f"},   # Hosea–Malachi — olive
    "gospels":   {"hl": "#c9d8e4", "ac": "#3a6480"},   # Matt–John — dusty blue
    "acts":      {"hl": "#c3dcd5", "ac": "#2f7367"},   # Acts — teal
    "epistles":  {"hl": "#d4cee6", "ac": "#5a4f8c"},   # Romans–Jude — lavender
    "revelation":{"hl": "#eccaa6", "ac": "#a8602a"},   # Revelation — ember
}
_BOOK_SECTION = {}
for _names, _sec in [
    ("Genesis Exodus Leviticus Numbers Deuteronomy", "law"),
    ("Joshua Judges Ruth 1Samuel 2Samuel 1Kings 2Kings 1Chronicles 2Chronicles "
     "Ezra Nehemiah Esther", "history"),
    ("Job Psalm Psalms Proverbs Ecclesiastes Song", "wisdom"),
    ("Isaiah Jeremiah Lamentations Ezekiel Daniel", "major"),
    ("Hosea Joel Amos Obadiah Jonah Micah Nahum Habakkuk Zephaniah Haggai "
     "Zechariah Malachi", "minor"),
    ("Matthew Mark Luke John", "gospels"),
    ("Acts", "acts"),
    ("Romans 1Corinthians 2Corinthians Galatians Ephesians Philippians Colossians "
     "1Thessalonians 2Thessalonians 1Timothy 2Timothy Titus Philemon Hebrews James "
     "1Peter 2Peter 1John 2John 3John Jude", "epistles"),
    ("Revelation", "revelation"),
]:
    for _n in _names.split():
        _BOOK_SECTION[_n.lower()] = _sec

UNIFORM = {"hl": "#eccd86", "ac": "#c8472f"}   # the settled single-color look

# Research-backed theme candidates (paper + ink + type + default highlighter/accent).
# Sources: Kindle sepia #fbf0d9/#5f4b32 (proven low-eyestrain warm field); near-black
# (not #000) warm ink for comfort; long-form screen serifs (Spectral, Source Serif 4,
# EB Garamond, Lora — all OFL/embeddable). Highlighters kept LIGHT for WCAG.
_F = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700"
_SRCSERIF = "&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&display=swap"
# "hltext" = the text color that sits ON the highlighter (must contrast the wash).
THEMES = {
    # our current look, kept as the control
    "plex":    {"bg": "#f4efe6", "fg": "#2b2b2b", "read": "#cfc6b4",
                "hl": "#eccd86", "ac": "#c8472f", "hltext": "#2b2b2b",
                "serif": '"IBM Plex Serif",Georgia,serif', "sans": '"IBM Plex Sans",sans-serif',
                "fonts": _F + "&family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;1,400&display=swap"},
    # Kindle sepia — warm paper, warm brown ink (proven low eyestrain), Source Serif 4.
    # Highlighter COOL dusty blue: complementary to the warm paper so it pops; WCAG-safe.
    "sepia":   {"bg": "#fbf0d9", "fg": "#3b3027", "read": "#c9b89a",
                "hl": "#c5d8e6", "ac": "#3a6480", "hltext": "#27313a",
                "serif": '"Source Serif 4",Georgia,serif', "sans": '"IBM Plex Sans",sans-serif',
                "fonts": _F + _SRCSERIF},
    # Classic Bible/Garamond tradition on parchment
    "parchment":{"bg": "#f0e6d2", "fg": "#34291f", "read": "#c2b496",
                "hl": "#ecd2a0", "ac": "#8a5a2a", "hltext": "#34291f",
                "serif": '"EB Garamond",Georgia,serif', "sans": '"IBM Plex Sans",sans-serif',
                "fonts": _F + "&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap"},
    # Spectral — purpose-built for long-form screen reading; calm warm-grey paper
    "spectral":{"bg": "#f3efe7", "fg": "#262320", "read": "#cabfa9",
                "hl": "#e9d2a2", "ac": "#b06a35", "hltext": "#262320",
                "serif": '"Spectral",Georgia,serif', "sans": '"IBM Plex Sans",sans-serif',
                "fonts": _F + "&family=Spectral:ital,wght@0,400;0,500;0,600;1,400&display=swap"},
    # Lora — high-legibility, most muted/monochrome (subtle accent), warm linen
    "linen":   {"bg": "#f5efe1", "fg": "#29241f", "read": "#c8bca4",
                "hl": "#e8d6ad", "ac": "#7d6a45", "hltext": "#29241f",
                "serif": '"Lora",Georgia,serif', "sans": '"IBM Plex Sans",sans-serif',
                "fonts": _F + "&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap"},
    # NEW — premium warm ivory (Psychology-of-Money feel): lighter/creamier, soft gold block
    "ivory":   {"bg": "#f7f2e8", "fg": "#2a2620", "read": "#cdc4b2",
                "hl": "#efe1b4", "ac": "#b0954e", "hltext": "#2a2620",
                "serif": '"Source Serif 4",Georgia,serif', "sans": '"IBM Plex Sans",sans-serif',
                "fonts": _F + _SRCSERIF},
    # NEW — cinematic DARK: warm near-black paper, warm off-white ink, luminous amber word
    "dark":    {"bg": "#16140f", "fg": "#e7ddc9", "read": "#5f594b",
                "hl": "#d8b774", "ac": "#d8b774", "hltext": "#16140f",
                "serif": '"Source Serif 4",Georgia,serif', "sans": '"IBM Plex Sans",sans-serif',
                "fonts": _F + _SRCSERIF},
    # NEW — classic red-letter Bible (Image 2): warm white, red verse numbers + red mark
    "classic": {"bg": "#fbf7ef", "fg": "#26221c", "read": "#c9c0ae",
                "hl": "#f3cdbf", "ac": "#c0392b", "hltext": "#26221c",
                "serif": '"EB Garamond",Georgia,serif', "sans": '"IBM Plex Sans",sans-serif',
                "fonts": _F + "&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap"},
    # NORD — Frame B's vision (white paper, green family) but think Nord: desaturated
    # arctic. Aurora sage instead of neon green, polar-night blue-grey ink (calmer than
    # warm-black), muted snow dims. Built to survive a long, scrolling sit without nagging.
    "nord":    {"bg": "#fcfcfc", "fg": "#2e3440", "read": "#cdd3da",
                "hl": "#d6e3c2", "ac": "#6e8b4f", "hltext": "#36402a",
                "serif": '"Source Serif 4",Georgia,serif', "sans": '"IBM Plex Sans",sans-serif',
                "fonts": _F + _SRCSERIF},
    # FRAME B (Paper) — our passage format, but the white+green palette he loved.
    # Clean white paper, warm near-black ink, soft green highlighter wash + green verse
    # numbers. Source Serif 4 keeps the "real Bible page" feel (NOT the sans redline).
    "frameb":  {"bg": "#fcfcfc", "fg": "#262220", "read": "#c4c4c4",
                "hl": "#c9ecbf", "ac": "#3aa54a", "hltext": "#143a1c",
                "serif": '"Source Serif 4",Georgia,serif', "sans": '"IBM Plex Sans",sans-serif',
                "fonts": _F + _SRCSERIF},
    # NEW — "Highlight Changes" document reader (Image 4): white panel, black sidebar,
    # SANS body, grey dims to black, bright green highlighter. Pairs with --layout redline.
    "redline": {"bg": "#fcfcfc", "fg": "#1b1b1b", "read": "#c4c4c4",
                "hl": "#c9ecbf", "ac": "#36b94a", "hltext": "#13391b",
                "serif": '"Inter",Helvetica,Arial,sans-serif', "sans": '"Inter",Helvetica,Arial,sans-serif',
                "fonts": _F + "&family=Inter:wght@300;400;500;600;700&display=swap"},
    "kjv":     {"bg": "#fcfcfc", "fg": "#2e3440", "read": "#cdd3da",
                "hl": "hsl(42 45% 80%)", "ac": "#B3944D", "hltext": "#3a3120",
                "serif": '"Source Serif 4",Georgia,serif', "sans": '"IBM Plex Sans",sans-serif',
                "fonts": _F + _SRCSERIF},
}


def section_colors(book):
    """Map a book name to its canonical-section highlighter+accent (else uniform)."""
    if not book:
        return UNIFORM
    key = book.replace(" ", "").lower()
    sec = _BOOK_SECTION.get(key)
    return SECTIONS.get(sec, UNIFORM) if sec else UNIFORM


def load_versemap(base):
    p = base.replace("-aligned", "").replace("-words", "") + ".versemap.json"
    if not os.path.exists(p):
        return None
    try:
        vm = json.load(open(p, encoding="utf-8"))
        return {"book": vm.get("book"), "chapter": vm.get("chapter"),
                "verses": vm.get("verses", [])}
    except Exception:
        return None


_REF = re.compile(r"(\d+):(\d+)")


def _ref_start(ref):
    """'1:3-5' / '2:1 - 3:4' / '1:3' -> (chapter, verse) of the start, else None."""
    m = _REF.match(ref.strip().split("-")[0].strip())
    return (int(m.group(1)), int(m.group(2))) if m else None


def load_scenes(scene_src, chapter, vm):
    """Pull pericope titles for THIS chapter from a memory-method-bible <book>-base.json.

    Returns [{word, story, scene}] anchored to word indices (via the versemap), so the
    player can swap the upper-right title exactly at each scene's first word. 'story' is
    the evocative chapter-level title; 'scene' is the short granular one.
    """
    if not (scene_src and os.path.exists(scene_src) and vm):
        return []
    try:
        data = json.load(open(scene_src, encoding="utf-8"))
    except Exception:
        return []
    vw = {v["n"]: v["word"] for v in vm.get("verses", [])}
    out = []
    for story in data.get("stories", []):
        for sc in story.get("scenes", []):
            rs = _ref_start(sc.get("reference", ""))
            if not rs or rs[0] != chapter:
                continue
            w = vw.get(rs[1])
            if w is None:
                continue
            out.append({"word": w, "story": story.get("story_title", ""),
                        "scene": sc.get("scene_name", "")})
    out.sort(key=lambda x: x["word"])
    return out


def load_units(units_src, vm):
    """Chapter-bound LETTERED memory units (A/B/C…) — the Wolf-method footholds.

    Format: {book, chapter, units:[{letter, title, start_verse, end_verse?}]}. Maps each
    unit's start_verse -> word index via the versemap so the player can swap a SUBTLE
    letter badge exactly at each unit's first word. Distinct from load_scenes (narrative,
    cross-chapter); these are chapter-bound memorization addresses.
    """
    if not (units_src and os.path.exists(units_src) and vm):
        return []
    try:
        data = json.load(open(units_src, encoding="utf-8"))
    except Exception:
        return []
    vw = {v["n"]: v["word"] for v in vm.get("verses", [])}
    out = []
    for u in data.get("units", []):
        w = vw.get(u.get("start_verse"))
        if w is None:
            continue
        out.append({"word": w, "letter": u.get("letter", ""), "title": u.get("title", "")})
    out.sort(key=lambda x: x["word"])
    return out


PLAYER = r"""<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TITLE__</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="__FONTS_URL__" rel="stylesheet">
<style>
 :root{
   --bg:__BG__; --fg:__FG__;           /* paper + ink (theme) */
   --hi:__AC__;                        /* accent: verse numbers, rule, bar */
   --hl:__HL__;                        /* highlighter wash (LIGHT — dark text stays readable) */
   --read:__READ__; --ghost:#bdb39e; --dim:#9a9388;
   --hltext:__HLTEXT__;                /* text color sitting on the highlighter */
   --serif:__SERIF__; --sans:__SANS__; /* theme typefaces */
 }
 *{box-sizing:border-box;margin:0;padding:0}
 html,body{width:100%;height:100%;background:#0c0b0a;overflow:hidden}
 #fit{position:fixed;inset:0;display:grid;place-items:center}
 #stage{width:1920px;height:1080px;position:relative;
   background:var(--bg);color:var(--fg);overflow:hidden;
   font-family:var(--serif);
   box-shadow:0 0 80px rgba(0,0,0,.5);transform-origin:center}
 #stage::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:1;
   background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/></svg>");
   mix-blend-mode:multiply;opacity:.6}
 #stage::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:1;
   background:radial-gradient(ellipse 78% 70% at 50% 45%,transparent 56%,rgba(60,45,25,.16) 100%)}

 .mark{position:absolute;top:60px;left:84px;z-index:5;
   font-family:var(--sans);letter-spacing:.22em;text-transform:uppercase;
   padding-bottom:14px;border-bottom:1px solid rgba(43,43,43,.14)}
 body.norule .mark{border-bottom:none;padding-bottom:0}  /* hairline under identifier off */
 .mark .t{font-size:23px;font-weight:600}
 .mark .s{font-size:15px;font-weight:500;color:var(--dim);margin-top:5px;letter-spacing:.18em}
 /* verse marker — kept SEPARATE from the book/chapter (no "23:1" jumble), it pulses in
    exactly at each verse boundary then fades. Distinct + transient, not a running counter. */
 .verse{position:absolute;top:60px;right:84px;z-index:5;text-align:right;
   font-family:var(--sans);opacity:0;transition:opacity .55s ease}
 .verse .vl{display:block;font-size:13px;font-weight:600;letter-spacing:.26em;
   text-transform:uppercase;color:var(--dim)}
 .verse .vnum{display:block;font-size:30px;font-weight:700;line-height:1;
   margin-top:5px;color:var(--hi)}
 /* pericope (passage title) — the editorial layer a real Bible page gives. Serif italic,
    distinct from the sans book/chapter identifier. When present it OWNS the upper-right
    and the redundant verse counter steps aside (verse already lives inline as superscript). */
 .pericope{display:none;position:absolute;top:66px;right:96px;z-index:5;
   max-width:520px;text-align:right}
 .pericope .story{font-family:var(--sans);font-size:15px;font-weight:600;letter-spacing:.22em;
   text-transform:uppercase;color:var(--hi);opacity:.6;margin-bottom:14px}
 .pericope .pt{font-family:var(--serif);font-style:italic;font-size:27px;font-weight:500;
   line-height:1.22;color:var(--fg);opacity:.66}
 .pericope .pr{width:90px;height:2px;background:var(--hi);opacity:.7;margin:16px 0 0 auto}
 body.haspericope .verse{display:none}
 body.haspericope .pericope{display:block}
 /* lettered memory unit (A/B/C…) — SUBTLE: a quiet letter + faint thought-cue, monochrome
    so it never competes with the moving highlighter. Completely ignorable; glanceable. */
 .unit{display:none;position:absolute;top:58px;right:84px;z-index:5;
   flex-direction:column;align-items:flex-end;font-family:var(--sans)}
 .unit .ul{font-size:27px;font-weight:600;line-height:1;color:var(--fg);opacity:.5;
   letter-spacing:.04em}
 .unit .ut{font-size:12px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;
   color:var(--fg);opacity:.34;margin-top:8px;max-width:300px;text-align:right}
 body.hasunits .unit{display:flex}
 body.hasunits .verse,body.hasunits .pericope{display:none}
 .snail{position:absolute;bottom:54px;right:84px;z-index:5;
   font-family:var(--sans);font-size:14px;font-weight:600;
   letter-spacing:.26em;text-transform:uppercase;color:var(--dim);opacity:.6}
 /* progress bar retired — the YouTube scrubber already IS the progress bar */
 #bar{display:none}
 /* --minimal strips everything but the identifiers + the reading */
 body.minimal .minimap,body.minimal .topbar{display:none}

 /* ---- shared word states ---- */
 .w{transition:color .14s ease-out,opacity .14s ease-out}
 .w.read{color:var(--read)}
 .w.ahead{color:var(--fg);opacity:.30}
 .w.active{color:var(--hi)}

 /* ===== layout: solo / window (the 3-line stack) ===== */
 #lines{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;
   justify-content:center;align-items:center;padding:0 13%;text-align:center}
 .ln{width:100%;transition:opacity .5s ease,max-height .5s ease,margin .5s ease,font-size .5s ease}
 .ln.side{font-size:50px;line-height:1.36;color:var(--ghost);opacity:.42;margin:22px 0}
 .ln.cur{font-size:64px;line-height:1.36;font-weight:500;margin:30px 0}
 body[data-layout="solo"] .ln.side{opacity:0;max-height:0;margin:0;overflow:hidden}
 body[data-layout="passage"] #lines{display:none}

 /* ===== layout: passage (whole chapter, web-style word dimming, auto-scroll) ===== */
 #scrollwrap{position:absolute;inset:0;z-index:2;display:none;overflow:hidden;
   /* fade text out near the top (under the title) and bottom so nothing collides */
   -webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 19%,#000 84%,transparent 100%);
   mask-image:linear-gradient(to bottom,transparent 0,#000 19%,#000 84%,transparent 100%)}
 body[data-layout="passage"] #scrollwrap{display:block}
 body[data-layout="redline"] #scrollwrap{display:block}
 #flow{position:absolute;left:0;right:0;padding:0 25%;text-align:left;
   font-size:54px;line-height:1.6;letter-spacing:-.005em;will-change:transform;
   transition:transform .55s cubic-bezier(.33,0,.15,1)}
 /* the whole chapter flows like a real Bible; read=recedes, ahead=full ink, active=red square */
 #flow .w{color:var(--fg);padding:.04em .14em;border-radius:.32em;
   transition:color .18s ease-out,background .22s ease-out}          /* unread = full ink */
 #flow .w.read{color:var(--read)}                                    /* read = recedes */
 #flow .w.active{background:var(--hl);color:var(--hltext)}           /* block: soft wash, rounded */
 /* underline style: marker stroke under the word, no fill */
 body[data-mark="underline"] #flow .w.active{background:none;color:var(--fg);
   box-shadow:inset 0 -0.16em 0 0 var(--hl)}
 .vn{font-family:var(--sans);font-weight:700;font-size:26px;
   color:var(--hi);vertical-align:.6em;margin:0 .35em 0 .15em;opacity:.7}

 /* ===== layout: redline (recreation of the "Highlight Changes" document reader) ===== */
 .sidepanel,.minimap,.topbar{display:none}
 body[data-layout="redline"]{}
 body[data-layout="redline"] .mark,
 body[data-layout="redline"] .verse,
 body[data-layout="redline"] .snail{display:none}     /* sidebar replaces the chrome */
 body[data-layout="redline"] #stage::after{display:none}  /* no vignette — flat white doc */
 /* dark left sidebar holding book/chapter */
 body[data-layout="redline"] .sidepanel{display:block;position:absolute;left:0;top:0;bottom:0;
   width:560px;background:#0c0c0c;color:#fff;z-index:7;padding:62px 56px;
   font-family:var(--sans)}
 .sidepanel .back{font-size:17px;letter-spacing:.12em;text-transform:uppercase;color:#cfcfcf;
   font-weight:600;display:flex;align-items:center;gap:10px}
 .sidepanel .lang{position:absolute;top:62px;right:56px;font-size:17px;letter-spacing:.12em;
   text-transform:uppercase;font-weight:700;color:var(--hi)}
 .sidepanel .title{font-size:62px;line-height:1.12;font-weight:300;margin-top:160px;
   letter-spacing:-.01em}
 .sidepanel .date{font-size:19px;color:#8a8a8a;margin-top:18px;font-weight:400}
 /* reading panel pushed right of the sidebar; minimap gutter on the far right */
 body[data-layout="redline"] #scrollwrap{left:560px;right:96px}
 body[data-layout="redline"] #flow{padding:0 70px;text-align:justify;
   font-size:40px;line-height:1.72;letter-spacing:0}
 body[data-layout="redline"] #flow .w{padding:.02em .1em;border-radius:.18em}
 body[data-layout="redline"] #flow .w.active{background:var(--hl);color:var(--hltext);
   box-shadow:inset 0 -0.12em 0 0 var(--hi)}     /* green block + green underline, like the ref */
 body[data-layout="redline"] .vn{color:var(--hi);font-weight:700;opacity:.85}
 /* top strip: green toggle + label, like "HIGHLIGHT CHANGES" */
 body[data-layout="redline"] .topbar{display:flex;align-items:center;gap:18px;
   position:absolute;left:660px;top:46px;z-index:8;font-family:var(--sans)}
 .topbar .tg{width:64px;height:34px;border-radius:18px;background:var(--hi);position:relative}
 .topbar .tg::after{content:"";position:absolute;top:4px;right:4px;width:26px;height:26px;
   border-radius:50%;background:#fff}
 .topbar .lbl{font-size:17px;letter-spacing:.12em;text-transform:uppercase;color:#9a9a9a;font-weight:600}
 /* right-edge minimap (orientation) */
 body[data-layout="redline"] .minimap{display:block;position:absolute;right:44px;top:120px;
   bottom:120px;width:6px;background:#ececec;border-radius:3px;z-index:7}
 .minimap #mthumb{position:absolute;left:-5px;width:16px;height:42px;border-radius:3px;
   background:#4a90e2;transform:translateY(-50%)}

 /* opening title card — cream, on-brand; fades into the reading on click */
 #veil{position:absolute;inset:0;z-index:9;display:grid;place-items:center;
   background:var(--bg);cursor:pointer;text-align:center;
   transition:opacity .9s ease}
 #veil.hide{opacity:0;pointer-events:none}
 #card .sub{font-family:var(--sans);font-size:22px;font-weight:600;
   letter-spacing:.34em;text-transform:uppercase;color:var(--dim)}
 #card .book{font-family:var(--serif);font-size:118px;font-weight:500;
   line-height:1.05;margin:.18em 0 .05em;color:var(--fg)}
 #card .chap{font-family:var(--serif);font-size:46px;font-weight:400;
   font-style:italic;color:var(--dim)}
 #card .rule{width:120px;height:2px;background:var(--hi);opacity:.5;margin:48px auto 0}
 #card .hint{font-family:var(--sans);font-size:15px;letter-spacing:.18em;
   text-transform:uppercase;color:var(--dim);opacity:.6;margin-top:28px}
</style></head><body data-layout="__LAYOUT__" data-mark="__MARK__" class="__MINIMAL__">
<div id="fit"><div id="stage">
 <div class="mark"><div class="t">__MARK_T__</div><div class="s">__MARK_S__</div></div>
 <div class="verse" id="vb"><span class="vl">Verse</span><span class="vnum" id="vnum"></span></div>
 <div class="pericope">__PERICOPE__</div>
 <div class="unit"><span class="ul" id="uletter">__ULETTER__</span><span class="ut" id="utitle">__UTITLE__</span></div>
 <div id="lines">
  <div class="ln side" id="lp"></div>
  <div class="ln cur"  id="lc"></div>
  <div class="ln side" id="ln"></div>
 </div>
 <div id="scrollwrap"><div id="flow"></div></div>
 <div class="sidepanel">
   <div class="back">&#8592; Back</div><div class="lang">English</div>
   <div class="title">__BOOK__<br>__CHAP__</div>
   <div class="date">Snail &middot; read-along</div></div>
 <div class="topbar"><div class="tg"></div><div class="lbl">Read Along</div></div>
 <div class="minimap"><div id="mthumb"></div></div>
 <div class="snail">Snail 🐌</div>
 <div id="bar"></div>
 <div id="veil"><div id="card">
   <div class="sub">__MARK_S__</div>
   <div class="book">__BOOK__</div>
   <div class="chap">__CHAP__</div>
   <div class="rule"></div></div></div>
 <audio id="a" src="__AUDIO__" preload="auto"></audio>
</div></div>
<script>
const W=__WORDS__, S=__SENTS__, VM=__VERSES__, DUR=__DUR__, LAYOUT="__LAYOUT__";
const SCENES=__SCENES__, SCENETIER="__SCENETIER__";   // pericope titles anchored to word index
const a=document.getElementById('a'),bar=document.getElementById('bar');
const lc=document.getElementById('lc'),lp=document.getElementById('lp'),ln=document.getElementById('ln');
const vb=document.getElementById('vb'),veil=document.getElementById('veil');
const flow=document.getElementById('flow'),stage=document.getElementById('stage');

function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);
  stage.style.transform='scale('+s+')';}
addEventListener('resize',fit);fit();

function verseAt(wi){ if(!VM||wi<0) return null; let n=null;
  for(const v of VM.verses){ if(wi>=v.word) n=v.n; else break; } return n; }
// switch EXACTLY at the verse's first word (not on scroll), pulse in, then fade.
let lastVerse=-1, vnum=document.getElementById('vnum');
function showVerse(wi){ if(!VM) return; const n=verseAt(wi);
  if(n===null||n===lastVerse) return; lastVerse=n;
  vnum.textContent=n; vb.style.opacity=1; }   // persistent: number just swaps, no fade/pulse

// dynamic pericope: swap the upper-right title at each scene's first word (no fade — just
// the text changing, like the verse number). SCENETIER picks evocative vs short.
let lastScene=-1, peri=document.querySelector('.pericope');
function showScene(wi){ if(!SCENES.length||!peri) return; let idx=-1;
  for(let k=0;k<SCENES.length;k++){ if(wi>=SCENES[k].word) idx=k; else break; }
  if(idx<0||idx===lastScene) return; lastScene=idx;
  const L=String.fromCharCode(65+idx);   // just a letter address in front of the title
  peri.innerHTML = '<div class="story">' + SCENES[idx].story + '</div><div class="pt">' + L + '. ' + SCENES[idx].scene + '</div><div class="pr"></div>'; }

// subtle lettered memory unit: swap the quiet A/B/C badge at each unit's first word.
const UNITS=__UNITS__;
let lastUnit=-1, uLetter=document.getElementById('uletter'), uTitle=document.getElementById('utitle');
function showUnit(wi){ if(!UNITS.length) return; let idx=-1;
  for(let k=0;k<UNITS.length;k++){ if(wi>=UNITS[k].word) idx=k; else break; }
  if(idx<0||idx===lastUnit) return; lastUnit=idx;
  if(uLetter) uLetter.textContent=UNITS[idx].letter;
  if(uTitle) uTitle.textContent=UNITS[idx].title; }

// --- sync engine (identical math to the phone player) ---
let LEAD=180, hwLat=0;
try{const C=window.AudioContext||window.webkitAudioContext;
 if(C){const ctx=new C();const rd=()=>{hwLat=(ctx.baseLatency||0)+(ctx.outputLatency||0);};rd();
  a.addEventListener('play',()=>{ctx.state==='suspended'?ctx.resume().then(rd):rd();});}}catch(e){}
let baseCT=-1,baseWall=0;
function playheadMs(){const ct=a.currentTime,now=performance.now();
 if(ct!==baseCT){baseCT=ct;baseWall=now;}
 const adv=a.paused?0:(now-baseWall)/1000*(a.playbackRate||1);
 return (baseCT+adv-hwLat)*1000;}
let cur=-1;
function find(ms){
 if(cur>=0&&ms>=W[cur].s&&ms<W[cur].e)return cur;
 if(cur>=0&&ms>=W[cur].e){for(let i=cur+1;i<W.length;i++){
   if(ms<W[i].e)return ms>=W[i].s?i:i-1>=cur?i-1:cur;}return W.length-1;}
 for(let i=0;i<W.length;i++)if(ms<W[i].e)return ms>=W[i].s?i:Math.max(0,i-1);
 return W.length-1;}

/* ===== renderer A: solo / window (3-line stack) ===== */
let curSent=-1, wordEls=[];
function renderSentence(si){
 curSent=si;
 lp.textContent = si>0 ? S[si-1].text : '';
 ln.textContent = si<S.length-1 ? S[si+1].text : '';
 lc.innerHTML='';wordEls=[];
 for(let i=0;i<W.length;i++){ if(W[i].si!==si) continue;
   const e=document.createElement('span');e.className='w ahead';
   e.textContent=W[i].t+' ';e.dataset.wi=i;lc.appendChild(e);wordEls.push(e);}
 showVerse(W.findIndex(w=>w.si===si));
}
function paintStack(i){
 if(W[i].si!==curSent) renderSentence(W[i].si);
 for(const e of wordEls){const wi=+e.dataset.wi;
   e.className='w '+(wi<i?'read':wi===i?'active':'ahead');}
}

/* ===== renderer B: passage (whole chapter inline, like the web player) ===== */
let pEls=[], pLastTop=-1, pPrev=-1;
function buildPassage(){
 // verse-number markers, then every word flows inline like a real Bible page
 const marks = (VM&&VM.verses.length) ? VM.verses.slice() : [];
 const startMark = {};                       // word index -> verse number
 for(const v of marks) startMark[v.word]=v.n;
 flow.innerHTML='';pEls=new Array(W.length);
 for(let i=0;i<W.length;i++){
   if(startMark[i]!==undefined && startMark[i]!==1){      // small verse superscript
     const b=document.createElement('span');b.className='vn';
     b.textContent=startMark[i];flow.appendChild(b);}
   const e=document.createElement('span');e.className='w';
   e.textContent=W[i].t+' ';flow.appendChild(e);pEls[i]=e;
 }
}
function paintPassage(i){
 // word-level: everything BEFORE i dims (read), i is the highlighter, everything AFTER stays full ink.
 // uses its own pPrev — the shared `cur` is already advanced by the loop, so we can't lean on it.
 if(i>pPrev){ for(let k=Math.max(0,pPrev);k<i;k++) pEls[k].className='w read'; }
 else if(i<pPrev){ for(let k=i+1;k<=pPrev && k<pEls.length;k++) pEls[k].className='w'; } // scrubbed back
 pEls[i].className='w active';
 pPrev=i;
 showVerse(i);   // precise: fires at the verse's first word, independent of scroll
 showScene(i);   // precise: swaps the pericope title at the scene boundary
 showUnit(i);    // precise: swaps the subtle A/B/C memory-unit badge
 // keep the LIVE line vertically centered; only re-scroll when the line changes
 const top=pEls[i].offsetTop;
 if(top!==pLastTop){ pLastTop=top;
   flow.style.transform='translateY('+(496 - top)+'px)'; }
}

const ISPASSAGE=(LAYOUT==='passage'||LAYOUT==='redline');
function paint(i){ if(ISPASSAGE) paintPassage(i); else paintStack(i); }

const mthumb=document.getElementById('mthumb');
function loop(){
 if(!a.paused){
   const i=find(playheadMs()+LEAD);
   if(i!==cur&&i>=0){cur=i;paint(i);}
   const frac=Math.min(1,(a.currentTime*1000)/(DUR||1));
   bar.style.width=(100*frac)+'%';
   if(mthumb) mthumb.style.top=(frac*100)+'%';   // minimap position (redline)
 }
 requestAnimationFrame(loop);
}
if(ISPASSAGE) buildPassage();
requestAnimationFrame(loop);

window.renderFrame = function(ms) {
    const i = find(ms);
    if(i !== cur && i >= 0) {
        cur = i;
        paint(i);
    }
};

veil.onclick=()=>{veil.classList.add('hide');a.play();};
a.addEventListener('ended',()=>{bar.style.width='100%';});
</script></body></html>"""


def render(data, base, vm, title, sub, layout, uniform=False, theme="plex",
           section=False, mark="block", minimal=False, no_rule=False, pericope="",
           scene_src="", scene_tier="story", units_src=""):
    words = load_words(data)
    sentences = data["sentences"]
    audio = data.get("audio", os.path.basename(base).replace("-aligned", "") + ".opus")
    dur = data.get("duration_ms", words[-1]["e"] if words else 0)
    # split the title into book + chapter for the opening card
    if vm and vm.get("book"):
        book, chap = vm["book"], "Chapter %s" % vm.get("chapter", "")
    else:
        parts = title.rsplit(" ", 1)
        if len(parts) == 2 and parts[1].isdigit():
            book, chap = parts[0], "Chapter %s" % parts[1]
        else:
            book, chap = title, ""
    th = THEMES.get(theme, THEMES["plex"])
    # highlighter/accent: section color only if --section asked; else the theme's own pair
    if section and not uniform:
        sc = section_colors(vm.get("book") if vm else book)
        hl, ac = sc["hl"], sc["ac"]
    else:
        hl, ac = th["hl"], th["ac"]
    # pericope: dynamic scene titles from a memory-method-bible base.json, or a static one
    scenes = load_scenes(scene_src, vm.get("chapter") if vm else None, vm) if scene_src else []
    peri_text = pericope
    if scenes and not pericope:                       # seed the corner with the first title
        peri_text = scenes[0]["scene" if scene_tier == "scene" else "story"]
    has_peri = bool(peri_text) or bool(scenes)
    # lettered memory units (subtle A/B/C badge) — take over the corner when present
    units = load_units(units_src, vm) if units_src else []
    u0 = units[0] if units else {"letter": "", "title": ""}
    html = (PLAYER
            .replace("__TITLE__", title)
            .replace("__MARK_T__", title)
            .replace("__MARK_S__", sub)
            .replace("__BOOK__", book)
            .replace("__CHAP__", chap)
            .replace("__BG__", th["bg"])
            .replace("__FG__", th["fg"])
            .replace("__READ__", th["read"])
            .replace("__HLTEXT__", th["hltext"])
            .replace("__SERIF__", th["serif"])
            .replace("__SANS__", th["sans"])
            .replace("__FONTS_URL__", th["fonts"])
            .replace("__MARK__", mark)
            .replace("__PERICOPE__", peri_text)
            .replace("__SCENES__", json.dumps(scenes, ensure_ascii=False))
            .replace("__SCENETIER__", scene_tier)
            .replace("__UNITS__", json.dumps(units, ensure_ascii=False))
            .replace("__ULETTER__", u0["letter"])
            .replace("__UTITLE__", u0["title"])
            .replace("__MINIMAL__", " ".join(
                (["minimal"] if minimal else []) + (["norule"] if no_rule else [])
                + (["haspericope"] if has_peri else []) + (["hasunits"] if units else [])))
            .replace("__HL__", hl)
            .replace("__AC__", ac)
            .replace("__AUDIO__", audio)
            .replace("__LAYOUT__", layout)
            .replace("__WORDS__", json.dumps(
                [{"t": w["t"], "s": w["s"], "e": w["e"], "si": w["si"]} for w in words],
                ensure_ascii=False))
            .replace("__SENTS__", json.dumps(
                [{"text": s["text"]} for s in sentences], ensure_ascii=False))
            .replace("__VERSES__", json.dumps(vm, ensure_ascii=False) if vm else "null")
            .replace("__DUR__", str(dur)))
    out = base.replace("-aligned", "") + "-yt-" + layout + ".html"
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print("WROTE %s  (%d words / %d sentences, %.0fs)"
          % (out, len(words), len(sentences), dur / 1000))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("json")
    ap.add_argument("--layout", choices=["solo", "window", "passage", "redline"], default="window")
    ap.add_argument("--all", action="store_true", help="write all three layouts")
    ap.add_argument("--title")
    ap.add_argument("--sub", default="Berean Standard Bible")
    ap.add_argument("--uniform", action="store_true",
                    help="force the theme's single highlighter instead of per-section color")
    ap.add_argument("--theme", choices=list(THEMES), default="plex",
                    help="paper+ink+type palette (research candidates)")
    ap.add_argument("--section", action="store_true",
                    help="color the highlighter/verse-numbers by canonical section")
    ap.add_argument("--mark", choices=["block", "underline"], default="block",
                    help="highlight style for the active word")
    ap.add_argument("--minimal", action="store_true",
                    help="strip everything but the identifiers + the reading")
    ap.add_argument("--no-rule", dest="no_rule", action="store_true",
                    help="drop the hairline underline beneath the book/chapter identifier")
    ap.add_argument("--pericope", default="",
                    help="static passage title for the upper-right (replaces the verse counter)")
    ap.add_argument("--scene-src", dest="scene_src", default="",
                    help="memory-method-bible <book>-base.json: dynamic pericope titles per scene")
    ap.add_argument("--scene-tier", dest="scene_tier", choices=["story", "scene"], default="story",
                    help="story=evocative chapter title (calm), scene=short titles that switch")
    ap.add_argument("--units", dest="units_src", default="",
                    help="chapter-bound lettered memory units JSON (subtle A/B/C foothold badge)")
    args = ap.parse_args()

    data = json.load(open(args.json, encoding="utf-8"))
    base = os.path.splitext(args.json)[0]
    vm = load_versemap(base)
    if args.title:
        title = args.title
    elif vm and vm.get("book"):
        title = "%s %s" % (vm["book"], vm.get("chapter", ""))
    else:
        title = os.path.basename(base).replace("-aligned", "").replace("-", " ").title()

    layouts = ["solo", "window", "passage"] if args.all else [args.layout]
    for L in layouts:
        render(data, base, vm, title, args.sub, L,
               uniform=args.uniform, theme=args.theme, section=args.section,
               mark=args.mark, minimal=args.minimal, no_rule=args.no_rule,
               pericope=args.pericope, scene_src=args.scene_src, scene_tier=args.scene_tier,
               units_src=args.units_src)


if __name__ == "__main__":
    main()
