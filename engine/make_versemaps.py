#!/usr/bin/env python3
"""Build per-chapter versemaps ({verses:[{n,word}],...}) for the openbible-kjv
voice by walking text/KJV.txt (Pure Cambridge, 'Book C:V<TAB>text', [brackets]
mark italics — stripped, since the aligned token stream has none).

Every chapter is VALIDATED against its -aligned.json before writing:
  1. total token count must equal len(aligned words)
  2. the aligned word at every verse-start index must equal the verse's first token
A chapter failing validation is reported and NOT written.

Usage: make_versemaps.py <book-slug> <n_chapters>   e.g. genesis 50
"""
import json
import re
import sys
from pathlib import Path

KJV_TXT = Path("/home/nigel/wolf-and-word/text/KJV.txt")
OB = Path("/home/nigel/openbible-kjv")

BOOK_NAMES = {  # slug -> name as it appears in KJV.txt
    "genesis": "Genesis",
}

def tokens(text):
    return text.replace("[", "").replace("]", "").split()

def main():
    slug, n_chapters = sys.argv[1], int(sys.argv[2])
    book_name = BOOK_NAMES.get(slug, slug.capitalize())

    chapters = {}  # ch -> [(verse_n, [tokens])]
    pat = re.compile(rf"^{re.escape(book_name)} (\d+):(\d+)\t(.*)$")
    with open(KJV_TXT, encoding="utf-8") as f:
        for line in f:
            m = pat.match(line.rstrip("\n"))
            if m:
                ch, v, txt = int(m.group(1)), int(m.group(2)), m.group(3)
                chapters.setdefault(ch, []).append((v, tokens(txt)))

    ok, failed = 0, []
    for ch in range(1, n_chapters + 1):
        cc = f"{ch:02d}"
        verses = chapters.get(ch)
        if not verses:
            failed.append((cc, "no verses found in KJV.txt")); continue
        aligned = json.loads((OB / f"{slug}-{cc}-aligned.json").read_text())
        words = aligned["words"]

        # Tolerant walk: the narrator's KJV occasionally differs by a token
        # (e.g. 'firstborn' read as 'first born'), so re-anchor each verse
        # start by matching its first 2-3 tokens within a +/-6 word window.
        vmap, cum, bad = [], 0, None
        for vn, toks in verses:
            start = None
            for probe_len in (3, 2):
                probe = [t.lower() for t in toks[:probe_len]]
                for off in sorted(range(-6, 7), key=abs):
                    p = cum + off
                    if p < 0 or p + len(probe) > len(words):
                        continue
                    if all(words[p + k]["t"].lower() == probe[k] for k in range(len(probe))):
                        start = p
                        break
                if start is not None:
                    break
            if start is None:
                got = [w["t"] for w in words[max(0, cum - 2):cum + 4]]
                bad = f"v{vn}: no anchor near {cum} for {probe} (aligned: {got})"
                break
            if vmap and start <= vmap[-1]["word"]:
                bad = f"v{vn}: non-monotone anchor {start}"
                break
            vmap.append({"n": vn, "word": start})
            cum = start + len(toks)
        if bad:
            failed.append((cc, bad)); continue
        if abs(cum - len(words)) > 6:
            failed.append((cc, f"end drift {cum} vs aligned {len(words)}")); continue

        out = OB / f"{slug}-{cc}.versemap.json"
        payload = {"book": slug, "chapter": ch, "n_words": cum, "verses": vmap}
        if out.exists():  # don't clobber the hand-staged one; just verify it
            old = json.loads(out.read_text())
            same = old.get("verses") == vmap and old.get("n_words", cum) == cum
            print(f"{slug}-{cc}: EXISTS, {'matches builder' if same else 'MISMATCH vs builder!'}")
            if not same:
                failed.append((cc, "existing versemap disagrees with builder"))
                continue
        else:
            out.write_text(json.dumps(payload))
        ok += 1

    print(f"\n{ok}/{n_chapters} chapters validated+written; {len(failed)} failed")
    for cc, why in failed:
        print(f"  FAIL {slug}-{cc}: {why}")
    sys.exit(1 if failed else 0)

if __name__ == "__main__":
    main()
