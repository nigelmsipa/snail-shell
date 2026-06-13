#!/usr/bin/env python3
"""
bible_build.py — extract a KJV chapter into a spoken-text file + a verse map
for the snail-shell word read-along.

Spec (see project_bible_readalong):
- Chapter is announced and SPOKEN: "Revelation, Chapter One." (number spelled out).
- Verse text is SPOKEN and highlighted.
- KJV [bracket] italic words are SPOKEN (brackets stripped) and flagged for italic display.
- Verse NUMBERS are NOT spoken — they become display-only superscripts. We record the
  flat word index where each verse begins so the player can drop a <sup> there.

Because the aligner tokenises spoken text with \\S+ (and sentence-splitting only regroups,
never splits tokens), the flat aligned word list == \\S+ of this spoken file, in order.
So the word indices below are EXACT — no fuzzy matching needed.

Usage:  bible_build.py "Revelation" 1 [outbase]
Writes: <outbase>.txt  (spoken text for render-vibevoice.py)
        <outbase>.versemap.json
"""
import os, re, sys, json

KJV = os.path.expanduser("~/zombies/Projects/seraph-song/kjv")
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


def chapter_count(book):
    pref = book + " "
    chs = set()
    with open(KJV, encoding="utf-8") as f:
        for line in f:
            if line.startswith(pref):
                c = line[len(pref):].split(":", 1)[0]
                if c.isdigit():
                    chs.add(int(c))
    return len(chs)


def load_chapter(book, ch):
    pref = "%s %d:" % (book, ch)
    verses = []
    with open(KJV, encoding="utf-8") as f:
        for line in f:
            if line.startswith(pref):
                ref, text = line.rstrip("\n").split("\t", 1)
                verses.append((int(ref.split(":")[1]), text))
    verses.sort()
    return verses


def detok(text):
    """Whitespace tokens with [] brackets stripped; flag tokens that were bracketed
    (KJV italics). Returns (clean_tokens, italic_flags)."""
    clean, ital = [], []
    for tk in text.split():
        was = ("[" in tk) or ("]" in tk)
        c = tk.replace("[", "").replace("]", "")
        if c:
            clean.append(c)
            ital.append(was)
    return clean, ital


def main():
    if len(sys.argv) < 3:
        sys.exit('usage: bible_build.py "Book" CHAPTER [outbase]')
    book, ch = sys.argv[1], int(sys.argv[2])
    base = sys.argv[3] if len(sys.argv) > 3 else \
        "%s-%02d" % (book.lower().replace(" ", ""), ch)

    verses = load_chapter(book, ch)
    if not verses:
        sys.exit("no verses found for %s %d in %s" % (book, ch, KJV))

    # single-chapter books (Jude, Philemon, Obadiah, 2/3 John...) read just the name
    ann = ("%s." % book) if chapter_count(book) == 1 else \
          ("%s, Chapter %s." % (book, num_word(ch)))
    words = WORD.findall(ann)
    italic = [False] * len(words)
    versemap = []
    spoken_verses = []
    for v, text in verses:
        ctoks, cital = detok(text)
        versemap.append({"n": v, "word": len(words)})
        words.extend(ctoks)
        italic.extend(cital)
        spoken_verses.append(" ".join(ctoks))

    spoken = ann + "\n\n" + " ".join(spoken_verses) + "\n"
    # sanity: spoken file must tokenise to exactly our word list
    assert WORD.findall(spoken) == words, "tokenisation drift — mapping would be wrong"

    with open(base + ".txt", "w", encoding="utf-8") as f:
        f.write(spoken)
    with open(base + ".versemap.json", "w", encoding="utf-8") as f:
        json.dump({"book": book, "chapter": ch, "ann_words": len(WORD.findall(ann)),
                   "n_words": len(words), "verses": versemap,
                   "italic": [i for i, b in enumerate(italic) if b]},
                  f, ensure_ascii=False)

    print("WROTE %s.txt + %s.versemap.json" % (base, base))
    print("  %d verses, %d spoken words (%d-word announcement, %d italic)"
          % (len(verses), len(words), len(WORD.findall(ann)), sum(italic)))


if __name__ == "__main__":
    main()
