#!/usr/bin/env python3
"""align_section.py — like align_and_split.py but for a LibriVox "section" that holds
only a CHAPTER RANGE of a book (e.g. "Genesis 11-20"), not the whole book. Aligns just
that range's text (from --src) to the section audio and emits per-chapter artifacts
named <slug>-NN (NN = the true chapter number, so ranges stitch into one book on disk).

Usage:
  align_section.py "Genesis" 11-20 <section.mp3> genesis --src BBE.txt --out DIR
  align_section.py "Ruth"    ""    <section.mp3> ruth    --src BBE.txt --out DIR   # whole book
  add --dry to validate range/word selection WITHOUT running the model (zero compute).
"""
import os, sys, re, json, math, subprocess

book   = sys.argv[1]
rng    = sys.argv[2]                       # "C1-C2" or "C" or "" (whole book)
audio  = sys.argv[3]
slug   = sys.argv[4]
src    = sys.argv[sys.argv.index("--src") + 1]
out    = sys.argv[sys.argv.index("--out") + 1]
DRY    = "--dry" in sys.argv

# LibriVox book-name -> BBE.txt book-name normalization
NORM = {"Psalms": "Psalm"}
book = NORM.get(book, book)

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from align_book import load_book, build_words, modernize, _norm, WORD, _sentences

chapters_all = load_book(src, book)
if not chapters_all:
    sys.exit("no verses for %s in %s" % (book, src))

# select the requested chapter range
if rng.strip():
    if "-" in rng:
        a, b = rng.split("-"); lo, hi = int(a), int(b)
    else:
        lo = hi = int(rng)
    want = [c for c in sorted(chapters_all) if lo <= c <= hi]
else:
    want = sorted(chapters_all)
chapters = {c: chapters_all[c] for c in want}
if not chapters:
    sys.exit("range %r selected no chapters of %s (have %s..%s)"
             % (rng, book, min(chapters_all), max(chapters_all)))

disp, modern, wchap, vmaps, chap_text = build_words(book, chapters)

if DRY:
    print("DRY %s [%s] -> chapters %s | %d words | audio=%s"
          % (book, rng or "ALL", "%d-%d" % (want[0], want[-1]) if len(want) > 1 else str(want[0]),
             len(modern), os.path.basename(audio)))
    sys.exit(0)

# ---- real alignment (mirrors align_and_split.py) ----
import torch
from torchaudio.pipelines import MMS_FA as bundle
from add_words import PLAYER
from align_from_audio import load_audio_16k, _fill_gaps
SR = bundle.sample_rate
device = "cuda" if torch.cuda.is_available() else "cpu"
model = bundle.get_model().eval().to(device)
tok = bundle.get_tokenizer(); aln = bundle.get_aligner()

norm = [_norm(modernize(w)) for w in modern]
keep = [i for i, x in enumerate(norm) if x]
wave = load_audio_16k(audio)
dur_sec = wave.size(1) / SR; dur_ms = round(dur_sec * 1000)
WIN = float(os.environ.get("SPLIT_WINDOW_S", "900")); MARGIN = 60.0
word_ms = [None] * len(modern); ntot = len(keep); wps = ntot / max(1.0, dur_sec)

def _emit(a0, a1):
    sl = wave[:, int(a0 * SR):int(a1 * SR)]
    with torch.inference_mode():
        em, _ = model(sl.to(device))
    return em

if dur_sec <= WIN:
    sys.stderr.write("%s[%s]: %d words, %.0fs, one pass on %s\n" % (book, rng or "ALL", len(modern), dur_sec, device))
    em = _emit(0, dur_sec); nf = em.size(1)
    for gi, sp in zip(keep, aln(em[0], tok([norm[i] for i in keep]))):
        word_ms[gi] = (sp[0].start / nf * dur_ms, sp[-1].end / nf * dur_ms)
else:
    nwin = math.ceil(dur_sec / WIN)
    sys.stderr.write("%s[%s]: %d words, %.0fs, %d windows on %s\n" % (book, rng or "ALL", len(modern), dur_sec, nwin, device))
    for wk in range(nwin):
        t0 = wk * WIN; t1 = min(dur_sec, t0 + WIN)
        a0 = max(0.0, t0 - MARGIN); a1 = min(dur_sec, t1 + MARGIN)
        lo = max(0, int((t0 - MARGIN) * wps)); hi = min(ntot, int((t1 + MARGIN) * wps) + 1)
        sub = keep[lo:hi]
        if not sub:
            continue
        em = _emit(a0, a1); nf = em.size(1); sl_ms = (a1 - a0) * 1000
        for gi, sp in zip(sub, aln(em[0], tok([norm[i] for i in sub]))):
            g0 = a0 * 1000 + sp[0].start / nf * sl_ms
            g1 = a0 * 1000 + sp[-1].end / nf * sl_ms
            ctr = (g0 + g1) / 2
            if (t0 * 1000 <= ctr < t1 * 1000) or (wk == nwin - 1 and ctr >= t0 * 1000):
                word_ms[gi] = (g0, g1)
_fill_gaps(word_ms)

os.makedirs(out, exist_ok=True)
for c in sorted(chapters):
    idx = [i for i in range(len(modern)) if wchap[i] == c]
    if not idx:
        continue
    c_start = max(0.0, word_ms[idx[0]][0] / 1000 - 0.3)
    c_end = word_ms[idx[-1]][1] / 1000 + 0.3
    base = os.path.join(out, "%s-%02d" % (slug, c)); bn = os.path.basename(base)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "%.3f" % c_start, "-to", "%.3f" % c_end,
                    "-i", audio, "-c:a", "libopus", "-b:a", "48k", base + ".opus"], stdin=subprocess.DEVNULL)
    flat = [{"t": disp[i], "s": round(word_ms[i][0] - c_start * 1000),
             "e": round(word_ms[i][1] - c_start * 1000)} for i in idx]
    sents, cues, wi = _sentences(chap_text[c]), [], 0
    for s in sents:
        n = len(WORD.findall(s)); span = flat[wi:wi + n]
        if span:
            cues.append({"start_ms": span[0]["s"], "end_ms": span[-1]["e"], "text": s})
        wi += n
    dur_c = round((c_end - c_start) * 1000)
    open(base + ".txt", "w").write(chap_text[c] + "\n")
    json.dump(vmaps[c], open(base + ".versemap.json", "w"), ensure_ascii=False)
    json.dump({"audio": bn + ".opus", "duration_ms": dur_c, "sentences": cues},
              open(base + ".json", "w"), ensure_ascii=False)
    json.dump({"audio": bn + ".opus", "duration_ms": dur_c, "sentences": cues, "words": flat},
              open(base + "-aligned.json", "w"), ensure_ascii=False)
    open(base + "-words.html", "w").write(
        PLAYER.replace("__TITLE__", bn).replace("__AUDIO__", bn + ".opus")
        .replace("__DATA__", json.dumps(flat, ensure_ascii=False)))
    print("  %s | %d words | %.0f-%.0fs" % (bn, len(idx), c_start, c_end))
print("WROTE %d chapters for %s [%s]" % (len(chapters), book, rng or "ALL"))
