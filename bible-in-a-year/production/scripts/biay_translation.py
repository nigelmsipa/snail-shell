#!/usr/bin/env python3
"""ONE resolver: translation slug -> every path, colour and credit BIAY needs.

The Python sibling of engine/translation_env.sh, and it exists for the same
reason that file gives:

    forget TRANSLATION_LABEL and all 1,189 chapters say KING JAMES VERSION
    while every duration gate passes, because the video is the right LENGTH,
    just the wrong Bible.

Selection is by environment variable, not by argument, because build_month.py
spawns render_full_day.py, render_biay_intro.py, render_biay_outro.py and
check_days.py as SUBPROCESSES. An env var is inherited by all of them from one
assignment; an argument would have to be threaded through five call sites, and
the one that got missed would fail silently and look fine.

    BIAY_TRANSLATION=msb python3 build_month.py --month 1

Defaults to kjv, which is what shipped.
"""
import json, os
from pathlib import Path

HOME = Path("/home/nigel")
ROOT = HOME / "wolf-and-word"
TRANSLATIONS = ROOT / "engine/translations"

# Hairline rule colour is NOT per translation. gen_book_boards.py skins only
# paper/ink/gold and leaves its dividers neutral, so every shipped contents
# board in every translation already uses these. Kept neutral deliberately.
HAIR = "#e6e2da"


def slug():
    return os.environ.get("BIAY_TRANSLATION", "kjv").strip().lower()


def data(s=None):
    s = s or slug()
    f = TRANSLATIONS / f"{s}.json"
    if not f.exists():
        avail = ", ".join(sorted(p.stem for p in TRANSLATIONS.glob("*.json")))
        raise SystemExit(f"biay_translation: no data file {f}\n"
                         f"  available: {avail}\n"
                         f"  a new translation needs its own file before anything renders.")
    d = json.loads(f.read_text())
    p = d.get("palette")
    if not p:
        raise SystemExit(f"{f} has no `palette` — refusing to fall back to another Bible's colours")
    for k in ("paper", "ink", "accent", "meta", "dim"):
        if k not in p:
            raise SystemExit(f"{f} palette is missing `{k}`")
    if "narration" not in d:
        raise SystemExit(f"{f} has no `narration` — a credit must be STATED, never inherited "
                         f"from a template. See RUNBOOK.md 0.7.")
    return d


def tokens(s=None):
    """The CSS custom-property block the boards are built from."""
    p = data(s)["palette"]
    return (f"--paper:{p['paper']};--ink:{p['ink']};--metadata:{p['meta']};"
            f"--faint:{p['dim']};--hair:{HAIR};--gold:{p['accent']}")


def name(s=None):
    return data(s)["name"]


def narration(s=None):
    n = data(s)["narration"]
    return n["name"], n.get("source", "")


def paths(s=None):
    s = s or slug()
    out = HOME / "biay-days" if s == "kjv" else HOME / f"biay-{s}"
    return {
        "slug": s,
        "readalong": ROOT / f"output/{s}/readalong-carded",
        "boards": ROOT / f"output/{s}/assets/boards",
        "out": out,
    }


def describe(s=None):
    s = s or slug()
    d = data(s); p = paths(s); nm, src = narration(s)
    return (f"{d['name']} [{s}]  ink {d['palette']['ink']}  accent {d['palette']['accent']}  "
            f"narration {nm} · {src}\n    readalongs {p['readalong']}\n    output     {p['out']}")


if __name__ == "__main__":
    import sys
    print(describe(sys.argv[1] if len(sys.argv) > 1 else None))
