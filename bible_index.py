#!/usr/bin/env python3
"""
bible_index.py — build a navigation index for a rendered book.
Scans <slug>-NN.versemap.json + <slug>-NN-words.html and writes <slug>-index.html.

Usage: bible_index.py Revelation
"""
import os, re, sys, json, glob

def main():
    book = sys.argv[1] if len(sys.argv) > 1 else "Revelation"
    slug = book.lower()
    chapters = []
    for vm in sorted(glob.glob("%s-*.versemap.json" % slug)):
        m = re.search(r"-(\d+)\.versemap\.json$", vm)
        if not m:
            continue
        ch = int(m.group(1))
        player = "%s-%02d-words.html" % (slug, ch)
        if not os.path.exists(player):
            continue
        d = json.load(open(vm, encoding="utf-8"))
        chapters.append((ch, len(d["verses"]), player))
    chapters.sort()

    cards = "\n".join(
        '<a class="ch" href="%s"><span class="n">%d</span>'
        '<span class="v">%d verses</span></a>' % (p, c, v)
        for c, v, p in chapters)

    html = """<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>%s</title>
<style>
 :root{--bg:#f4efe6;--fg:#2b2b2b;--hi:#ffe08a;--dim:#9a9388;--vn:#b07a3a}
 *{box-sizing:border-box}
 body{margin:0;background:var(--bg);color:var(--fg);
   font-family:"IBM Plex Sans",-apple-system,Segoe UI,Roboto,sans-serif}
 main{max-width:46rem;margin:0 auto;padding:2.4rem 1.1rem 6rem}
 h1{font-weight:700;font-size:1.9rem;margin:.2rem 0 .2rem}
 .sub{color:var(--dim);margin:0 0 1.8rem;font-size:.95rem}
 .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(7rem,1fr));gap:.7rem}
 .ch{display:flex;flex-direction:column;align-items:center;justify-content:center;
   text-decoration:none;color:var(--fg);background:#fbf7ee;border:1px solid #e3d8c4;
   border-radius:.7rem;padding:1.1rem .5rem;transition:transform .08s,box-shadow .12s,background .12s}
 .ch:hover{background:var(--hi);transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,.08)}
 .ch .n{font-size:1.7rem;font-weight:700;line-height:1}
 .ch .v{font-size:.72rem;color:var(--dim);margin-top:.35rem}
</style></head><body>
<main>
<h1>%s</h1>
<p class="sub">King James Version &middot; read by Davis &middot; %d chapters &middot; tap a chapter</p>
<div class="grid">
%s
</div>
</main></body></html>""" % (book, book, len(chapters), cards)

    out = "%s-index.html" % slug
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print("WROTE %s  (%d chapters)" % (out, len(chapters)))


if __name__ == "__main__":
    main()
