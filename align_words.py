#!/usr/bin/env python3
"""
align_words.py — EXACT word timings by forced alignment. 🐌🎯

Reads an already-rendered <base>.json (sentence timings) and the audio, then uses
torchaudio's MMS forced aligner to find where each word PHYSICALLY is in the
waveform. Writes <base>-words.html (same player) + <base>-aligned.json with exact
per-word marks. The audio and text are untouched — only the map becomes exact.

Aligns PER SENTENCE: each sentence's audio span [start_ms,end_ms] is already exact
(from sample counts), so we slice it out and align just that sentence's words. Fast,
bounded, and self-anchoring — no whole-document drift.

Run with the alignment venv:
    ~/.snail-align-venv/bin/python align_words.py <base>.json
"""
import os
import re
import sys
import json
import subprocess

import numpy as np
import torch
from torchaudio.pipelines import MMS_FA as bundle

from add_words import PLAYER, word_spans  # reuse the player + proportional fallback

SR = bundle.sample_rate          # 16000
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
_M = _T = _A = None


def _load_model():
    global _M, _T, _A
    if _M is None:
        _M = bundle.get_model().to(DEVICE).eval()
        _T = bundle.get_tokenizer()
        _A = bundle.get_aligner()
    return _M, _T, _A


def load_audio_16k(path):
    """Decode any audio to mono 16k float32 via ffmpeg (robust, no codec deps)."""
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "s16le", "-ac", "1",
         "-ar", str(SR), "-"], capture_output=True)
    a = np.frombuffer(out.stdout, dtype="<i2").astype(np.float32) / 32768.0
    return torch.from_numpy(a.copy()).unsqueeze(0)   # (1, n)


_NORM = re.compile(r"[^a-z']")


def _norm(w):
    return _NORM.sub("", w.lower())


def align_sentence(seg, words):
    """seg: (1,n) waveform at SR for ONE sentence. words: original strings.
    Returns per-word (start_frac, end_frac) within the segment, or None where a
    word has no alignable letters (numbers, bare initials) — filled by caller."""
    norm = [_norm(w) for w in words]
    keep = [i for i, n in enumerate(norm) if n]
    transcript = [norm[i] for i in keep]
    out = [None] * len(words)
    if not transcript or seg.size(1) < SR // 50:    # <20ms: too short
        return out
    model, tok, aln = _load_model()
    with torch.inference_mode():
        emission, _ = model(seg.to(DEVICE))
    nframes = emission.size(1)
    try:
        token_spans = aln(emission[0], tok(transcript))
    except Exception:
        return out
    for kidx, spans in zip(keep, token_spans):
        out[kidx] = (spans[0].start / nframes, spans[-1].end / nframes)
    return out


def _fill_gaps(fracs):
    """Words with no alignment (None) get a thin slot interpolated between the
    nearest aligned neighbours, so every word still highlights in order."""
    n = len(fracs)
    for i in range(n):
        if fracs[i] is not None:
            continue
        prev_e = next((fracs[j][1] for j in range(i - 1, -1, -1) if fracs[j]), 0.0)
        nxt_s = next((fracs[j][0] for j in range(i + 1, n) if fracs[j]), 1.0)
        # count consecutive Nones to share the gap
        k = i
        while k < n and fracs[k] is None:
            k += 1
        span = max(0.0, nxt_s - prev_e)
        m = k - i
        for t, idx in enumerate(range(i, k)):
            fracs[idx] = (prev_e + span * t / m, prev_e + span * (t + 1) / m)
    return fracs


def build_words(sentences, wave):
    flat = []
    n_aligned = n_fallback = 0
    for si, c in enumerate(sentences):
        words = re.findall(r"\S+", c["text"])
        if not words:
            continue
        s_ms, e_ms = c["start_ms"], c["end_ms"]
        a, b = int(s_ms / 1000 * SR), int(e_ms / 1000 * SR)
        seg = wave[:, a:b]
        fracs = align_sentence(seg, words)
        if all(f is None for f in fracs):
            # alignment failed for the whole sentence -> proportional fallback
            for w in word_spans(c["text"], s_ms, e_ms):
                w["si"] = si
                flat.append(w)
            n_fallback += len(words)
            continue
        fracs = _fill_gaps(fracs)
        span = e_ms - s_ms
        for w, (fs, fe) in zip(words, fracs):
            flat.append({"t": w, "s": round(s_ms + fs * span),
                         "e": round(s_ms + fe * span), "si": si})
        n_aligned += len(words)
        if (si + 1) % 20 == 0:
            sys.stderr.write("  aligned %d/%d sentences\n" % (si + 1, len(sentences)))
            sys.stderr.flush()
    return flat, n_aligned, n_fallback


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: align_words.py <base>.json")
    jpath = sys.argv[1]
    data = json.load(open(jpath, encoding="utf-8"))
    base = os.path.splitext(jpath)[0]
    audio = data.get("audio", os.path.basename(base) + ".opus")
    audio_path = audio if os.path.isabs(audio) else os.path.join(
        os.path.dirname(os.path.abspath(jpath)), audio)

    sys.stderr.write("loading audio + model...\n")
    wave = load_audio_16k(audio_path)
    words, na, nf = build_words(data["sentences"], wave)

    payload = json.dumps([{"s": w["s"], "e": w["e"], "t": w["t"]} for w in words],
                         ensure_ascii=False)
    html = (PLAYER.replace("__TITLE__", os.path.basename(base))
                  .replace("__AUDIO__", audio)
                  .replace("__DATA__", payload))
    open(base + "-words.html", "w", encoding="utf-8").write(html)
    data["words"] = words
    json.dump(data, open(base + "-aligned.json", "w", encoding="utf-8"),
              ensure_ascii=False)
    print("WROTE %s-words.html  (%d words: %d aligned, %d proportional-fallback)"
          % (base, len(words), na, nf))


if __name__ == "__main__":
    main()
