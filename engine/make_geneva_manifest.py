#!/usr/bin/env python3
"""Pre-flight all 66 Geneva books and write a verified work manifest.

For each book: locate opus + en-orig caption, confirm the text loads, run the
transcript-word boundary finder, and require every chapter anchored + monotonic.
Writes ~/geneva/manifest.tsv  (slug<TAB>book<TAB>opus<TAB>vtt) for the batch.
Skips the dedication audio (not a canonical book). Reports anything that fails.
"""
import os, re, glob, sys
sys.argv = ["x"]
import tw_boundaries as TW
from align_book import load_book

AUD = os.path.expanduser("~/geneva-audio")
OUT = os.path.expanduser("~/geneva")
SRC = os.path.expanduser("~/geneva-text/GENEVA.txt")
os.makedirs(OUT, exist_ok=True)

# filename spelling -> canonical GENEVA.txt book name
NAME = {"Psalms": "Psalm", "Habbakuk": "Habakkuk",
        "Zecharaiah": "Zechariah", "1Timothy": "1 Timothy"}


def bookname(fn):
    m = re.match(r"\d+_(.+?)_-_", os.path.basename(fn))
    if not m:
        return None
    raw = m.group(1).replace("_", " ").strip()
    return NAME.get(raw.replace(" ", ""), NAME.get(raw, raw))


rows, fails = [], []
for o in sorted(glob.glob(f"{AUD}/*.opus")):
    fn = os.path.basename(o)
    if "Dedication" in fn:          # 67_..._Dedication_to_Queen_Elizabeth — skip
        continue
    book = bookname(o)
    stem = fn[:-5]
    vtt = None
    for cand in (stem + ".en-orig.vtt", stem + ".en.vtt"):
        if os.path.exists(os.path.join(AUD, cand)):
            vtt = os.path.join(AUD, cand); break
    if book is None or vtt is None:
        fails.append((fn, "no book name / no vtt")); continue
    chapters = load_book(SRC, book)
    if not chapters:
        fails.append((book, "text not found in GENEVA.txt")); continue
    try:
        bnds, ratio, ntr, nkn = TW.boundaries(book, vtt)
    except Exception as e:
        fails.append((book, f"boundary error: {e}")); continue
    found = [t for c, t in bnds if t is not None]
    mono = all(found[i] > found[i - 1] for i in range(1, len(found)))
    miss = [c for c, t in bnds if t is None]
    if miss or not mono or ntr < 50:
        fails.append((book, f"miss={miss} mono={mono} tr_words={ntr}")); continue
    slug = book.lower().replace(" ", "")
    rows.append((slug, book, o, vtt))

with open(os.path.join(OUT, "manifest.tsv"), "w") as f:
    for slug, book, o, vtt in rows:
        f.write(f"{slug}\t{book}\t{o}\t{vtt}\n")

print(f"manifest: {len(rows)} books verified -> {OUT}/manifest.tsv")
tot = 0
for slug, book, o, vtt in rows:
    tot += len(load_book(SRC, book))
print(f"total chapters to align: {tot}")
if fails:
    print(f"\n!! {len(fails)} books NOT in manifest:")
    for b, why in fails:
        print(f"   {b}: {why}")
else:
    print("all books resolved — none excluded")
