#!/usr/bin/env python3
"""align_book.py — reverse-align a WHOLE-BOOK audio file (hours long, no chapter
announcement) to its text by STREAMING MMS forced alignment in overlapping
windows, then split into per-chapter artifacts (.txt/.opus 48k/.json/-aligned.json
/-words.html/.versemap.json).  Built for per-book audiobooks (Geneva, etc.).

ARCHAIC TEXT (e.g. 1599 Geneva): align against a MODERNIZED spelling (so letters
match the narrator's modern pronunciation) but DISPLAY the authentic archaic text.
Same word sequence, so timings map 1:1.

Text source: a "Book Chapter:Verse<TAB>text" file (default ~/youngsliteral/YLT;
pass --src for e.g. ~/geneva-text/GENEVA.txt).  Output dir: --out (default cwd).

Usage: align_book.py "Ruth" <book.opus> ruth --src ~/geneva-text/GENEVA.txt --out ~/geneva
"""
import os, re, sys, json, subprocess
import numpy as np
import torch
from torchaudio.pipelines import MMS_FA as bundle
from add_words import PLAYER

SR = bundle.sample_rate
WORD = re.compile(r"\S+")
_NORM = re.compile(r"[^a-z']")
WIN_SEC = 480.0
COMMIT_TAIL_SEC = 25.0
BACK_OVERLAP_SEC = 1.5


def _norm(w):
    return _NORM.sub("", w.lower())


def modernize(w):
    """1599-spelling -> modern ORTHOGRAPHY for alignment only (word unchanged,
    just u<->v so the letters match the sound). heauen->heaven, vpon->upon,
    haue->have, loue->love, euery->every. Does NOT touch archaic word forms
    (doeth, walketh) — the narrator reads those as written."""
    w = re.sub(r"(?<=[aeiouAEIOU])u(?=[aeiouAEIOU])", "v", w)   # intervocalic u -> v
    w = re.sub(r"(?<=[aeiouAEIOU])U(?=[aeiouAEIOU])", "V", w)
    w = re.sub(r"\bv(?=[bcdfghjklmnpqrstwxz])", "u", w)         # initial v+consonant -> u
    w = re.sub(r"\bV(?=[bcdfghjklmnpqrstwxz])", "U", w)
    return w


def load_book(src, book):
    pat = re.compile(r"^%s (\d+):(\d+)\t(.*)$" % re.escape(book))
    chapters = {}
    for line in open(src, encoding="utf-8"):
        m = pat.match(line.rstrip("\n"))
        if m:
            c, v, t = int(m.group(1)), int(m.group(2)), re.sub(r"\s+", " ", m.group(3)).strip()
            chapters.setdefault(c, []).append((v, t))
    return chapters


def build_words(book, chapters):
    """Returns flat archaic words (display), modern words (align), chapter index,
    versemaps, and per-chapter archaic text."""
    disp, modern, wchap, vmaps, chap_text = [], [], [], {}, {}
    for c in sorted(chapters):
        vmap, wc, pieces = [], 0, []
        for n, t in sorted(chapters[c]):
            vmap.append({"n": n, "word": wc})
            ws = WORD.findall(t)
            wc += len(ws)
            for w in ws:
                disp.append(w); modern.append(modernize(w)); wchap.append(c)
            pieces.append(t)
        vmaps[c] = {"book": book, "chapter": c, "ann_words": 0, "n_words": wc, "verses": vmap}
        chap_text[c] = " ".join(pieces)
    return disp, modern, wchap, vmaps, chap_text


def load_audio_16k(path):
    out = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "s16le",
                          "-ac", "1", "-ar", str(SR), "-"], capture_output=True)
    a = np.frombuffer(out.stdout, dtype="<i2").astype(np.float32) / 32768.0
    return torch.from_numpy(a.copy()).unsqueeze(0)


def _fill_gaps(ms):
    n = len(ms)
    for i in range(n):
        if ms[i] is not None:
            continue
        prev_e = next((ms[j][1] for j in range(i - 1, -1, -1) if ms[j]), 0.0)
        k = i
        while k < n and ms[k] is None:
            k += 1
        nxt_s = next((ms[j][0] for j in range(k, n) if ms[j]), prev_e)
        span = max(0.0, nxt_s - prev_e); m = k - i
        for t, idx in enumerate(range(i, k)):
            ms[idx] = (prev_e + span * t / m, prev_e + span * (t + 1) / m)
    return ms


def stream_align(wave, words, model, tok, aln, device):
    total = wave.size(1); dur = total / SR
    wps = len(words) / dur
    sys.stderr.write("stream-align %d words / %.1f min (%.2f wps) on %s\n" % (len(words), dur/60, wps, device))
    word_ms = [None] * len(words)
    pos_w, pos_s, guard = 0, 0, 0
    while pos_w < len(words) and guard < 200000:
        guard += 1
        end_s = min(pos_s + int(WIN_SEC * SR), total)
        final = end_s >= total
        chunk = wave[:, pos_s:end_s].to(device)
        chunk_dur = (end_s - pos_s) / SR
        if chunk_dur < 1.0:
            break
        est = int(chunk_dur * wps * 1.6) + 40
        cand = words[pos_w:min(len(words), pos_w + est)]
        norm = [_norm(w) for w in cand]
        keep = [i for i, nm in enumerate(norm) if nm]
        if not keep:
            pos_w += len(cand); pos_s = end_s; continue
        with torch.inference_mode():
            emission, _ = model(chunk)
        nf = emission.size(1)
        spans = aln(emission[0].cpu(), tok([norm[i] for i in keep]))
        loc = [None] * len(cand)
        for kidx, sp in zip(keep, spans):
            loc[kidx] = (sp[0].start / nf * chunk_dur * 1000, sp[-1].end / nf * chunk_dur * 1000)
        limit = chunk_dur * 1000 if final else (chunk_dur - COMMIT_TAIL_SEC) * 1000
        off = pos_s / SR * 1000
        committed, last_end = 0, 0.0
        for i in range(len(cand)):
            if loc[i] is None:
                continue
            s_ms, e_ms = loc[i]
            if final or e_ms <= limit:
                word_ms[pos_w + i] = (off + s_ms, off + e_ms)
                committed = i + 1; last_end = e_ms
            else:
                break
        if final:
            break
        if committed == 0:
            pos_w += max(1, len(cand) // 2); pos_s = end_s; continue
        pos_w += committed
        pos_s = pos_s + int(max(0.0, last_end / 1000 - BACK_OVERLAP_SEC) * SR)
    _fill_gaps(word_ms)
    return word_ms


def cut_opus(src, a, b, dst):
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-ss", "%.3f" % a,
                    "-to", "%.3f" % b, "-ac", "1", "-c:a", "libopus", "-b:a", "48k", dst], check=True)


def _sentences(text):
    return [re.sub(r"\s+", " ", m.group(0)).strip()
            for m in re.finditer(r".+?(?:[.!?](?=\s|$)|\n\n|$)", text, re.S)
            if m.group(0).strip()]


def main():
    a = sys.argv
    book, audio, slug = a[1], a[2], a[3]
    src = a[a.index("--src") + 1] if "--src" in a else os.path.expanduser("~/youngsliteral/YLT")
    out = a[a.index("--out") + 1] if "--out" in a else "."
    os.makedirs(out, exist_ok=True)
    chapters = load_book(src, book)
    if not chapters:
        sys.exit("no verses for %s in %s" % (book, src))
    disp, modern, wchap, vmaps, chap_text = build_words(book, chapters)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    sys.stderr.write("loading audio + MMS model...\n")
    wave = load_audio_16k(audio)
    model = bundle.get_model().eval().to(device); tok = bundle.get_tokenizer(); aln = bundle.get_aligner()
    word_ms = stream_align(wave, modern, model, tok, aln, device)

    PAD = 0.30
    for c in sorted(chapters):
        idx = [i for i in range(len(disp)) if wchap[i] == c]
        cw = [(disp[i], word_ms[i]) for i in idx]
        c_start = max(0.0, cw[0][1][0] / 1000 - PAD)
        c_end = cw[-1][1][1] / 1000 + PAD
        base = os.path.join(out, "%s-%02d" % (slug, c))
        bname = os.path.basename(base)
        cut_opus(audio, c_start, c_end, base + ".opus")
        flat = [{"t": w, "s": round(ms[0] - c_start * 1000), "e": round(ms[1] - c_start * 1000)}
                for w, ms in cw]
        sents, cues, wi = _sentences(chap_text[c]), [], 0
        for s in sents:
            n = len(WORD.findall(s)); span = flat[wi:wi + n]
            if span:
                cues.append({"start_ms": span[0]["s"], "end_ms": span[-1]["e"], "text": s})
            wi += n
        dur_ms = round((c_end - c_start) * 1000)
        open(base + ".txt", "w").write(chap_text[c] + "\n")
        json.dump(vmaps[c], open(base + ".versemap.json", "w"), ensure_ascii=False)
        json.dump({"audio": bname + ".opus", "duration_ms": dur_ms, "sentences": cues},
                  open(base + ".json", "w"), ensure_ascii=False)
        json.dump({"audio": bname + ".opus", "duration_ms": dur_ms, "sentences": cues, "words": flat},
                  open(base + "-aligned.json", "w"), ensure_ascii=False)
        html = (PLAYER.replace("__TITLE__", bname).replace("__AUDIO__", bname + ".opus")
                .replace("__DATA__", json.dumps(flat, ensure_ascii=False)))
        open(base + "-words.html", "w").write(html)
        print("  %s | %d words | %.1f-%.1fs (%.1fs)" % (bname, len(cw), c_start, c_end, c_end - c_start))
    print("WROTE %d chapters for %s" % (len(chapters), book))


if __name__ == "__main__":
    main()
