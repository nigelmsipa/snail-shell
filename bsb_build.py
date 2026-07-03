#!/usr/bin/env python3
"""
bsb_build.py — extract a BSB chapter from BSB.txt into spoken text + a verse map.
BSB-sourced analog of bible_build.py (which is KJV-sourced).

Per the read-along spec (project_bible_readalong):
- Verse TEXT is spoken and highlighted; verse NUMBERS are NOT spoken — they become
  display-only superscripts. We record the flat \\S+ word index where each verse
  begins so the player can drop a <sup> there. (The aligner tokenises with \\S+ and
  sentence-splitting only regroups tokens, never splits them, so these indices are
  EXACT against the aligned word list.)
- Chapter announcement is OFF by default: external BSB audio reads verses only.
  Pass --announce if the audio actually says "Book, Chapter N." up front.

Usage:  bsb_build.py "Revelation" 1 revelation-01 [--announce]
Writes: <outbase>.txt  <outbase>.versemap.json
"""
import os, re, sys, json

BSB = os.path.expanduser("~/BSB audio/BSB.txt")
WORD = re.compile(r"\S+")

ONES = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
        "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
        "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"]
TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy",
        "Eighty", "Ninety"]


def num_word(n):
    if n <= 20:
        return ONES[n]
    if n < 100:
        t, o = TENS[n // 10], n % 10
        return t if o == 0 else t + "-" + ONES[o]
    h, rem = ONES[n // 100], n % 100
    return h + " Hundred" + (" " + num_word(rem) if rem else "")


def main():
    if len(sys.argv) < 4:
        sys.exit('usage: bsb_build.py "Revelation" 1 revelation-01 [--announce]')
    book, chap, outbase = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    announce = "--announce" in sys.argv

    pat = re.compile(r"^%s %d:(\d+)\t(.*)$" % (re.escape(book), chap))
    verses = []
    with open(BSB, encoding="utf-8") as fh:
        for line in fh:
            m = pat.match(line.rstrip("\n"))
            if m:
                verses.append((int(m.group(1)), re.sub(r"\s+", " ", m.group(2)).strip()))
    verses.sort()
    if not verses:
        sys.exit("no verses found for %s %d in %s" % (book, chap, BSB))

    pieces, ann_words = [], 0
    if announce:
        ann = "%s, Chapter %s." % (book, num_word(chap))
        pieces.append(ann)
        ann_words = len(WORD.findall(ann))

    vmap, wcount = [], ann_words
    for n, text in verses:
        vmap.append({"n": n, "word": wcount})
        wcount += len(WORD.findall(text))
        pieces.append(text)

    spoken = " ".join(pieces)
    n_words = len(WORD.findall(spoken))
    with open(outbase + ".txt", "w", encoding="utf-8") as f:
        f.write(spoken + "\n")
    json.dump({"book": book, "chapter": chap, "ann_words": ann_words,
               "n_words": n_words, "verses": vmap},
              open(outbase + ".versemap.json", "w", encoding="utf-8"),
              ensure_ascii=False)
    print("WROTE %s.txt (%d words, %d verses, ann_words=%d) + %s.versemap.json"
          % (outbase, n_words, len(verses), ann_words, outbase))


if __name__ == "__main__":
    main()
