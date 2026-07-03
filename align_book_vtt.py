#!/usr/bin/env python3
"""align_book_vtt.py — split a per-book audiobook into per-chapter read-along by
using the YouTube caption's spoken "chapter N" announcements as boundaries, then
run a RELIABLE single-pass MMS forced-align per chapter (no streaming drift).

Archaic text (1599 Geneva) is DISPLAYED; a modernized spelling is used for the
alignment only (so letters match the narrator's modern pronunciation).

Usage: align_book_vtt.py "Ruth" <book.opus> <book.vtt> ruth \\
         --src ~/geneva-text/GENEVA.txt --out ~/geneva
"""
import os, re, sys, json, subprocess
import numpy as np
import torch
from torchaudio.pipelines import MMS_FA as bundle
from add_words import PLAYER
from align_book import (modernize, load_book, build_words, _fill_gaps, _norm,
                        _sentences, cut_opus, WORD)

SR = bundle.sample_rate


def vtt_time(s):
    h, m, rest = s.split(":")
    return int(h) * 3600 + int(m) * 60 + float(rest)


def chapter_boundaries(vtt_path):
    """Distinct start-times of cues announcing 'chapter' (deduped from YouTube's
    rolling repeats). Returns sorted list of seconds."""
    times = []
    cur_start = None
    for line in open(vtt_path, encoding="utf-8"):
        m = re.match(r"(\d\d:\d\d:\d\d\.\d+)\s*-->", line)
        if m:
            cur_start = vtt_time(m.group(1)); continue
        if cur_start is not None and re.search(r"\bchapter\b", line, re.I):
            times.append(cur_start); cur_start = None
    times.sort()
    out = []
    for t in times:
        if not out or t - out[-1] > 10.0:   # collapse rolling-repeat clusters
            out.append(t)
    return out


def load_segment(path, start, end):
    cmd = ["ffmpeg", "-v", "error", "-ss", "%.3f" % start, "-to", "%.3f" % end,
           "-i", path, "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"]
    out = subprocess.run(cmd, capture_output=True)
    a = np.frombuffer(out.stdout, dtype="<i2").astype(np.float32) / 32768.0
    return torch.from_numpy(a.copy()).unsqueeze(0)


def align_segment(wave, modern, model, tok, aln, device):
    """Single-pass forced align of one chapter's words over its audio segment."""
    dur_ms = wave.size(1) / SR * 1000
    norm = [_norm(modernize(w)) for w in modern]
    keep = [i for i, n in enumerate(norm) if n]
    with torch.inference_mode():
        emission, _ = model(wave.to(device))
    nf = emission.size(1)
    spans = aln(emission[0].cpu(), tok([norm[i] for i in keep]))
    ms = [None] * len(modern)
    for kidx, sp in zip(keep, spans):
        ms[kidx] = (sp[0].start / nf * dur_ms, sp[-1].end / nf * dur_ms)
    _fill_gaps(ms)
    return ms, dur_ms


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
    bounds = chapter_boundaries(vtt)
    sys.stderr.write("%s: %d chapters in text, %d 'chapter' cues in captions\n" % (book, nchap, len(bounds)))
    if len(bounds) != nchap:
        sys.exit("BOUNDARY MISMATCH for %s: text=%d captions=%d — handle manually" % (book, nchap, len(bounds)))

    disp, modern, wchap, vmaps, chap_text = build_words(book, chapters)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = bundle.get_model().eval().to(device); tok = bundle.get_tokenizer(); aln = bundle.get_aligner()

    dur_total = float(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nk=1:nw=1", audio], capture_output=True, text=True).stdout.strip())
    PAD_HEAD = 1.0   # back up before the announcement so chapter's words aren't clipped

    csorted = sorted(chapters)
    for ci, c in enumerate(csorted):
        seg_start = max(0.0, bounds[ci] - PAD_HEAD)
        seg_end = (bounds[ci + 1] if ci + 1 < len(bounds) else dur_total)
        idx = [i for i in range(len(disp)) if wchap[i] == c]
        mwords = [modern[i] for i in idx]
        wave = load_segment(audio, seg_start, seg_end)
        ms, seg_ms = align_segment(wave, mwords, model, tok, aln, device)

        # trim to actual spoken span (drop the announcement lead-in)
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
        print("  %s | %d words | %.0f-%.0fs (%.0fs, %.2f wps)" % (bn, len(idx), c_start, c_end, c_end - c_start, wps))
    print("WROTE %d chapters for %s" % (nchap, book))


if __name__ == "__main__":
    main()
