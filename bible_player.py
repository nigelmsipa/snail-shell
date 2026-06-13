#!/usr/bin/env python3
"""
bible_player.py — build the word read-along player for a Bible chapter, with
verse-number SUPERSCRIPTS (shown, never spoken, never highlighted) and KJV
italic words styled.

Reads:
  <base>-aligned.json   (from align_words.py: exact per-word s/e/t)
  <base>.versemap.json  (from bible_build.py: verse->word index, italic indices)
Writes:
  <base>-words.html

The verse map's word indices are exact indices into the flat aligned word list
(both come from \\S+ of the same spoken text), so we just tag each word with its
verse number (if it starts a verse) and italic flag, then let the player render a
<sup> before it. Reuses the perceptual-sync PLAYER from add_words.py.

Usage:  bible_player.py <base>
"""
import os, re, sys, json, glob
from add_words import PLAYER


def build_nav(book, slug, cur):
    """Slim in-chapter nav: prev / chapter dropdown / next, + index link.
    Discovers the book's chapters from the *-words.html files present."""
    chs = sorted(int(m.group(1))
                 for f in glob.glob("%s-*-words.html" % slug)
                 for m in [re.search(r"-(\d+)-words\.html$", f)] if m)
    href = lambda c: "%s-%02d-words.html" % (slug, c)
    opts = "".join('<option value="%s"%s>%s %d</option>'
                   % (href(c), " selected" if c == cur else "", book, c)
                   for c in chs)
    prev = [c for c in chs if c < cur]
    nxt = [c for c in chs if c > cur]
    pv = ('<a class="navbtn" href="%s">‹</a>' % href(prev[-1])) if prev \
        else '<a class="navbtn off">‹</a>'
    nx = ('<a class="navbtn" href="%s">›</a>' % href(nxt[0])) if nxt \
        else '<a class="navbtn off">›</a>'
    return ('<nav class="bnav">%s<select id="chsel">%s</select>%s'
            '<a class="navbtn home" href="%s-index.html">✦ %s</a></nav>'
            % (pv, opts, nx, slug, book))


NAV_JS = "var _cs=document.getElementById('chsel');if(_cs)_cs.onchange=function(e){location.href=e.target.value};"

# span builder gains: a <sup> verse marker before a verse's first word, and an
# 'it' (italic) class on KJV supplied words. Verse sups seek to the verse start.
_OLD_SPANS = """const spans=W.map((w,i)=>{const e=document.createElement('span');
 e.className='w';e.textContent=w.t+' ';e.onclick=()=>{a.currentTime=w.s/1000;a.play()};
 t.appendChild(e);return e});"""
_NEW_SPANS = """const spans=W.map((w,i)=>{
 if(w.v){const s=document.createElement('sup');s.className='vn';s.textContent=w.v;
  s.title='verse '+w.v;s.onclick=()=>{a.currentTime=w.s/1000;a.play()};t.appendChild(s);}
 const e=document.createElement('span');
 e.className='w'+(w.i?' it':'');e.textContent=w.t+' ';
 e.onclick=()=>{a.currentTime=w.s/1000;a.play()};
 t.appendChild(e);return e});"""

_EXTRA_CSS = """ .vn{font-size:.62em;color:#b07a3a;font-weight:600;vertical-align:.45em;
   margin:0 .12em 0 .04em;cursor:pointer;user-select:none}
 .vn:hover{color:#8a5e2a}
 .w.it{font-style:italic}
 .bnav{display:flex;align-items:center;gap:.4rem;margin-bottom:.55rem;font-size:.9rem}
 .navbtn{text-decoration:none;color:var(--fg);background:#fbf7ee;border:1px solid #ccc3b2;
   border-radius:.4rem;padding:.18rem .62rem;cursor:pointer;font:inherit}
 .navbtn:hover{background:var(--hi);border-color:#e0c050}
 .navbtn.off{opacity:.32;pointer-events:none}
 .bnav select{font:inherit;background:#fbf7ee;border:1px solid #ccc3b2;border-radius:.4rem;
   padding:.2rem .4rem;color:var(--fg);cursor:pointer}
 .bnav .home{margin-left:auto;color:var(--vn);font-weight:600}
</style>"""


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: bible_player.py <base>")
    base = sys.argv[1]
    aligned = json.load(open(base + "-aligned.json", encoding="utf-8"))
    vmap = json.load(open(base + ".versemap.json", encoding="utf-8"))

    words = aligned["words"]
    if len(words) != vmap["n_words"]:
        sys.stderr.write("WARN: %d aligned words vs %d expected — verse map may be off\n"
                         % (len(words), vmap["n_words"]))
    verse_at = {v["word"]: v["n"] for v in vmap["verses"]}
    italic = set(vmap.get("italic", []))

    W = []
    for idx, w in enumerate(words):
        o = {"s": w["s"], "e": w["e"], "t": w["t"]}
        if idx in verse_at:
            o["v"] = verse_at[idx]
        if idx in italic:
            o["i"] = 1
        W.append(o)

    title = "%s %d" % (vmap["book"], vmap["chapter"])
    slug = vmap["book"].lower()
    audio = aligned.get("audio", base + ".opus")
    payload = json.dumps(W, ensure_ascii=False)
    nav = build_nav(vmap["book"], slug, vmap["chapter"])

    html = (PLAYER
            .replace(_OLD_SPANS, _NEW_SPANS)
            .replace("</style>", _EXTRA_CSS, 1)
            .replace("<header><audio", "<header>" + nav + "<audio", 1)
            .replace("</script>", NAV_JS + "</script>", 1)
            .replace("__TITLE__", title)
            .replace("__AUDIO__", audio)
            .replace("__DATA__", payload))
    if _NEW_SPANS not in html or nav not in html:
        sys.exit("ERROR: player patch did not apply (PLAYER template changed?)")

    out = base + "-words.html"
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print("WROTE %s  (%d words, %d verses, %d italic)"
          % (out, len(W), len(vmap["verses"]), len(italic)))


if __name__ == "__main__":
    main()
