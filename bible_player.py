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
import os, re, sys, json
from add_words import PLAYER

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
    audio = aligned.get("audio", base + ".opus")
    payload = json.dumps(W, ensure_ascii=False)

    html = (PLAYER
            .replace(_OLD_SPANS, _NEW_SPANS)
            .replace("</style>", _EXTRA_CSS, 1)
            .replace("__TITLE__", title)
            .replace("__AUDIO__", audio)
            .replace("__DATA__", payload))
    if _NEW_SPANS not in html:
        sys.exit("ERROR: span-builder patch did not apply (PLAYER template changed?)")

    out = base + "-words.html"
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print("WROTE %s  (%d words, %d verses, %d italic)"
          % (out, len(W), len(vmap["verses"]), len(italic)))


if __name__ == "__main__":
    main()
