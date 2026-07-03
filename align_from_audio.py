#!/usr/bin/env python3
"""
align_from_audio.py — the REVERSE compiler. 🐌⏪

Given <base>.opus (any audio) + <base>.txt (the exact transcript of what's spoken),
force-align the WHOLE clip with MMS to recover per-word timings, derive sentence
spans, and emit the SAME outputs the forward TTS pipeline does:

    <base>.json          sentences with start_ms/end_ms (what render.py emits)
    <base>-aligned.json  + per-word "words" list (what align_words.py emits)
    <base>-words.html    the read-along player (inline data, file://-friendly)

Voice- and source-agnostic: BSB narration, a sermon, your own voice — anything,
as long as <base>.txt matches what is actually said. The original audio is never
re-encoded or re-voiced; only the word→time map is computed.

Run with the align venv:
    ~/.snail-align-venv/bin/python align_from_audio.py revelation-01
"""
import os, re, sys, json, subprocess
import numpy as np
import torch
from torchaudio.pipelines import MMS_FA as bundle

from add_words import PLAYER  # reuse the exact read-along player

SR = bundle.sample_rate              # 16000
_SENT = re.compile(r".+?(?:[.!?](?=\s|$)|\n\n|$)", re.S)
MAX_SENT_CHARS = 250
_NORM = re.compile(r"[^a-z']")


def _norm(w):
    return _NORM.sub("", w.lower())


def _split_long(s, maxc=MAX_SENT_CHARS):
    if len(s) <= maxc:
        return [s]
    out = []
    while len(s) > maxc:
        window = s[:maxc]
        cut = max(window.rfind(", "), window.rfind("; "),
                  window.rfind(": "), window.rfind(" — "))
        if cut <= 0:
            cut = window.rfind(" ")
        cut = cut + 1 if cut > 0 else maxc
        piece = s[:cut].strip()
        if piece:
            out.append(piece)
        s = s[cut:].strip()
    if s:
        out.append(s)
    return out


def _sentences(text):
    out = []
    for m in _SENT.finditer(text):
        s = re.sub(r"\s+", " ", m.group(0)).strip()
        if s:
            out.extend(_split_long(s))
    return out


def load_audio_16k(path):
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "s16le", "-ac", "1",
         "-ar", str(SR), "-"], capture_output=True)
    a = np.frombuffer(out.stdout, dtype="<i2").astype(np.float32) / 32768.0
    return torch.from_numpy(a.copy()).unsqueeze(0)


def _fill_gaps(ms):
    """Words with no alignable letters (bare numbers like 144,000) get a thin slot
    interpolated between aligned neighbours, so every word still highlights."""
    n = len(ms)
    for i in range(n):
        if ms[i] is not None:
            continue
        prev_e = next((ms[j][1] for j in range(i - 1, -1, -1) if ms[j]), 0.0)
        k = i
        while k < n and ms[k] is None:
            k += 1
        nxt_s = next((ms[j][0] for j in range(k, n) if ms[j]), prev_e)
        span = max(0.0, nxt_s - prev_e)
        m = k - i
        for t, idx in enumerate(range(i, k)):
            ms[idx] = (prev_e + span * t / m, prev_e + span * (t + 1) / m)
    return ms


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: align_from_audio.py <base>   (expects <base>.opus + <base>.txt)")
    base = sys.argv[1]
    if base.endswith((".txt", ".opus", ".json")):
        base = os.path.splitext(base)[0]
    audio = next((base + e for e in (".opus", ".mp3", ".m4a", ".wav", ".flac")
                  if os.path.exists(base + e)), base + ".opus")
    text = open(base + ".txt", encoding="utf-8").read()

    sents = _sentences(text)
    words, sent_of = [], []
    for si, s in enumerate(sents):
        for w in re.findall(r"\S+", s):
            words.append(w)
            sent_of.append(si)
    if not words:
        sys.exit("no words in %s.txt" % base)

    sys.stderr.write("loading audio + MMS model...\n")
    wave = load_audio_16k(audio)
    dur_ms = round(wave.size(1) / SR * 1000)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = bundle.get_model().eval().to(device)
    tok = bundle.get_tokenizer()
    aln = bundle.get_aligner()
    sys.stderr.write("aligning %d words over %.1fs of audio on %s...\n"
                     % (len(words), dur_ms / 1000, device))
    with torch.inference_mode():
        emission, _ = model(wave.to(device))
    nframes = emission.size(1)

    norm = [_norm(w) for w in words]
    keep = [i for i, n in enumerate(norm) if n]
    token_spans = aln(emission[0], tok([norm[i] for i in keep]))

    word_ms = [None] * len(words)
    for kidx, spans in zip(keep, token_spans):
        word_ms[kidx] = (spans[0].start / nframes * dur_ms,
                         spans[-1].end / nframes * dur_ms)
    _fill_gaps(word_ms)

    # per-word list (align_words.py schema) + sentence cues (render.py schema)
    flat = [{"t": w, "s": round(ms[0]), "e": round(ms[1]), "si": si}
            for w, ms, si in zip(words, word_ms, sent_of)]
    cues = []
    for si, s in enumerate(sents):
        span = [f for f in flat if f["si"] == si]
        if span:
            cues.append({"start_ms": span[0]["s"], "end_ms": span[-1]["e"], "text": s})

    json.dump({"audio": os.path.basename(audio), "duration_ms": dur_ms, "sentences": cues},
              open(base + ".json", "w", encoding="utf-8"), ensure_ascii=False)
    json.dump({"audio": os.path.basename(audio), "duration_ms": dur_ms,
               "sentences": cues, "words": flat},
              open(base + "-aligned.json", "w", encoding="utf-8"), ensure_ascii=False)
    payload = json.dumps([{"s": f["s"], "e": f["e"], "t": f["t"]} for f in flat],
                         ensure_ascii=False)
    html = (PLAYER.replace("__TITLE__", os.path.basename(base))
                  .replace("__AUDIO__", os.path.basename(audio))
                  .replace("__DATA__", payload))
    open(base + "-words.html", "w", encoding="utf-8").write(html)

    # diagnostics — these reveal an unmodeled intro/outro (e.g. spoken chapter title)
    w1s, wNe = flat[0]["s"] / 1000, flat[-1]["e"] / 1000
    print("WROTE %s.json / -aligned.json / -words.html" % base)
    print("  %d sentences, %d words | audio %.1fs" % (len(cues), len(words), dur_ms / 1000))
    print("  word #1 starts @ %.2fs | last word ends @ %.2fs | trailing gap %.2fs"
          % (w1s, wNe, dur_ms / 1000 - wNe))
    print("  >> leading gap %.2fs (big = audio has an intro the text lacks)" % w1s)


if __name__ == "__main__":
    main()
