#!/usr/bin/env python3
"""align_book_tw.py — per-chapter Geneva read-along using TRANSCRIPT-WORD boundaries.

Boundaries come from aligning the known Geneva text to the auto-caption's full
timestamped word stream (tw_boundaries) — robust to music intros and missing
"chapter N" announcements. Each chapter is then single-pass MMS forced-aligned
(no streaming drift). Archaic spelling is DISPLAYED; modern spelling aligns.

Writes per chapter: <slug>-NN.opus / .txt / .versemap.json / .json /
-aligned.json / -words.html  — identical artifact set to align_book_vtt.py.

Usage: align_book_tw.py "Daniel" <book.opus> <book.en-orig.vtt> daniel \\
         --src ~/geneva-text/GENEVA.txt --out ~/geneva
"""
import os, sys, json, subprocess
import torch
from torchaudio.pipelines import MMS_FA as bundle
from add_words import PLAYER
from align_book import (load_book, build_words, _sentences, cut_opus, WORD)
from align_book_vtt import load_segment, align_segment
from tw_boundaries import boundaries as tw_boundaries

PAD_HEAD = 2.5   # transcript anchor may land a word or two in; pad back generously


def main():
    a = sys.argv
    book, audio, vtt, slug = a[1], a[2], a[3], a[4]
    src = a[a.index("--src") + 1] if "--src" in a else os.path.expanduser("~/geneva-text/GENEVA.txt")
    out = a[a.index("--out") + 1] if "--out" in a else "."
    os.makedirs(out, exist_ok=True)

    chapters = load_book(src, book)
    if not chapters:
        sys.exit("no verses for %s" % book)
    nchap = len(chapters)

    dur_total = float(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nk=1:nw=1", audio], capture_output=True, text=True).stdout.strip())

    tw, ratio, ntr, nkn = tw_boundaries(book, vtt, dur_total)
    bounds = [t for c, t in tw]
    if any(b is None for b in bounds):
        miss = [c for c, t in tw if t is None]
        sys.exit("UNRESOLVED BOUNDARIES for %s: chapters %s" % (book, miss))
    sys.stderr.write("%s: %d chapters | transcript_words=%d match_ratio=%.2f\n"
                     % (book, nchap, ntr, ratio))

    disp, modern, wchap, vmaps, chap_text = build_words(book, chapters)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = bundle.get_model().eval().to(device)
    tok = bundle.get_tokenizer(); aln = bundle.get_aligner()

    csorted = sorted(chapters)
    for ci, c in enumerate(csorted):
        seg_start = max(0.0, bounds[ci] - PAD_HEAD)
        seg_end = bounds[ci + 1] if ci + 1 < len(bounds) else dur_total
        if seg_end <= seg_start:
            seg_end = dur_total
        idx = [i for i in range(len(disp)) if wchap[i] == c]
        mwords = [modern[i] for i in idx]
        wave = load_segment(audio, seg_start, seg_end)
        ms, seg_ms = align_segment(wave, mwords, model, tok, aln, device)

        # trim to the actual spoken span using the aligned word times
        w0 = ms[0][0]; wN = ms[-1][1]
        c_start = seg_start + max(0.0, w0 / 1000 - 0.3)
        c_end = seg_start + wN / 1000 + 0.3
        base = os.path.join(out, "%s-%02d" % (slug, c)); bn = os.path.basename(base)
        cut_opus(audio, c_start, c_end, base + ".opus")
        flat = [{"t": disp[idx[k]],
                 "s": round(seg_start * 1000 + ms[k][0] - c_start * 1000),
                 "e": round(seg_start * 1000 + ms[k][1] - c_start * 1000)} for k in range(len(idx))]
        sents, cues, wi = _sentences(chap_text[c]), [], 0
        for s in sents:
            n = len(WORD.findall(s)); span = flat[wi:wi + n]
            if span:
                cues.append({"start_ms": span[0]["s"], "end_ms": span[-1]["e"], "text": s})
            wi += n
        dur_ms = round((c_end - c_start) * 1000)
        open(base + ".txt", "w").write(chap_text[c] + "\n")
        json.dump(vmaps[c], open(base + ".versemap.json", "w"), ensure_ascii=False)
        json.dump({"audio": bn + ".opus", "duration_ms": dur_ms, "sentences": cues},
                  open(base + ".json", "w"), ensure_ascii=False)
        json.dump({"audio": bn + ".opus", "duration_ms": dur_ms, "sentences": cues, "words": flat},
                  open(base + "-aligned.json", "w"), ensure_ascii=False)
        open(base + "-words.html", "w").write(
            PLAYER.replace("__TITLE__", bn).replace("__AUDIO__", bn + ".opus")
            .replace("__DATA__", json.dumps(flat, ensure_ascii=False)))
        wps = len(idx) / max(1.0, c_end - c_start)
        print("  %s | %d words | %.0f-%.0fs (%.0fs, %.2f wps)"
              % (bn, len(idx), c_start, c_end, c_end - c_start, wps))
    print("WROTE %d chapters for %s" % (nchap, book))


if __name__ == "__main__":
    main()
