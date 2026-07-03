#!/usr/bin/env python3
"""tw_boundaries.py — PROTOTYPE: derive per-chapter boundary timestamps by aligning
the KNOWN Geneva text to the auto-caption's full timestamped word stream (not its
chapter announcements). Robust to music intros and missing 'chapter N' callouts.

Usage: tw_boundaries.py "Daniel" <book.en-orig.vtt>
"""
import os, re, sys, glob
from difflib import SequenceMatcher
sys.argv_backup = sys.argv
from align_book import load_book, build_words, modernize, _norm

AUD = os.path.expanduser("~/geneva-audio")
SRC = os.environ.get("TW_SRC", os.path.expanduser("~/geneva-text/GENEVA.txt"))

INLINE = re.compile(r"<(\d\d):(\d\d):(\d\d\.\d+)><c>\s*([^<]+?)</c>")


def transcript_words(vtt):
    """List of (normalized_word, t_seconds) from inline per-word timestamps."""
    out = []
    txt = open(vtt, encoding="utf-8").read()
    for h, m, s, w in INLINE.findall(txt):
        t = int(h) * 3600 + int(m) * 60 + float(s)
        nw = _norm(w)
        if nw:
            out.append((nw, t))
    return out


def boundaries(book, vtt, audio_dur=None):
    chapters = load_book(SRC, book)
    disp, modern, wchap, vmaps, chap_text = build_words(book, chapters)
    # known word stream (modernized+normalized), keep map to chapter
    known_norm = [_norm(modernize(w)) for w in modern]
    kidx = [i for i in range(len(known_norm)) if known_norm[i]]       # global indices kept
    A = [known_norm[i] for i in kidx]
    g2a = {g: a for a, g in enumerate(kidx)}

    trans = transcript_words(vtt)
    B = [w for w, t in trans]

    sm = SequenceMatcher(None, A, B, autojunk=False)
    a2b = {}
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            a2b[a + k] = b + k
    ratio = sm.ratio()

    # kept known indices grouped per chapter (in order)
    chap_kidx = {}
    for i in kidx:
        chap_kidx.setdefault(wchap[i], []).append(i)

    csorted = sorted(chapters)
    # cumulative words BEFORE each chapter -> proportional baseline placement
    cum = {}
    run = 0
    for c in csorted:
        cum[c] = run
        run += len(chap_kidx.get(c, []))
    total = max(1, run)
    if not audio_dur:
        audio_dur = trans[-1][1] if trans else 0.0

    # raw anchors: earliest matched word per chapter, strictly increasing
    raw = {}
    prev_b = -1
    for c in csorted:
        hit_t = None
        for g in chap_kidx.get(c, []):
            b = a2b.get(g2a[g])
            if b is not None and b > prev_b:
                hit_t = trans[b][1]; prev_b = b; break
        raw[c] = hit_t

    # accept an anchor ONLY if it lands near its word-count baseline; this rejects
    # the derailing far-jumps that poor captions produce (which cause OOM/CTC).
    base = {c: cum[c] / total * audio_dur for c in csorted}
    tol = 0.10 * audio_dur + 120.0
    acc = {c: (raw[c] if raw[c] is not None and abs(raw[c] - base[c]) <= tol else None)
           for c in csorted}

    # fill gaps by word-count interpolation between accepted anchors,
    # using 0 at the start and audio_dur at the end as virtual anchors.
    out = []
    for ci, c in enumerate(csorted):
        if acc[c] is not None:
            out.append((c, acc[c])); continue
        lo = next((csorted[j] for j in range(ci - 1, -1, -1) if acc[csorted[j]] is not None), None)
        hi = next((csorted[j] for j in range(ci + 1, len(csorted)) if acc[csorted[j]] is not None), None)
        lo_t, lo_w = (acc[lo], cum[lo]) if lo is not None else (0.0, 0)
        hi_t, hi_w = (acc[hi], cum[hi]) if hi is not None else (audio_dur, total)
        frac = (cum[c] - lo_w) / max(1, (hi_w - lo_w))
        out.append((c, lo_t + frac * (hi_t - lo_t)))

    # enforce strictly increasing (guards against any residual non-monotonicity)
    res = []
    prev_t = -1.0
    for c, t in out:
        if t is None or t <= prev_t:
            t = prev_t + 1.0
        res.append((c, t)); prev_t = t
    return res, ratio, len(trans), len(A)


def main():
    book, vtt = sys.argv[1], sys.argv[2]
    bnds, ratio, ntr, nkn = boundaries(book, vtt)
    print(f"{book}: known_words={nkn} transcript_words={ntr} match_ratio={ratio:.2f}")
    prev = None
    mono = True
    for c, t in bnds:
        gap = (t - prev) if (t is not None and prev is not None) else None
        if t is not None and prev is not None and t < prev:
            mono = False
        flag = "" if t is not None else "  <-- NOT FOUND"
        gs = f" (+{gap:5.0f}s)" if gap is not None else ""
        print(f"  ch{c:>3}: {('%8.1fs'%t) if t is not None else '   ----  '}{gs}{flag}")
        if t is not None:
            prev = t
    missing = [c for c, t in bnds if t is None]
    print(f"  => {len(bnds)} chapters, {len(missing)} not found, monotonic={mono}"
          + (f", MISSING={missing}" if missing else ""))


if __name__ == "__main__":
    main()
