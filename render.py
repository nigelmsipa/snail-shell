#!/usr/bin/env python3
"""
render.py — turn a markdown / text / PDF file into ONE MP3 plus a follow-along
sidecar, on the desktop, using Kokoro (sherpa-onnx).

The whole document becomes a single continuous audio file (press play once,
never click next). Alongside the MP3 it writes, sharing the same base name:
  <base>.vtt   WebVTT captions (one cue per sentence)
  <base>.json  machine-readable timing map
  <base>.html  self-contained follow-along player (highlights the current
               sentence as it's spoken; click a sentence to jump there)

Rendering is sentence-by-sentence so every sentence's exact start/end is known.

Usage:  render.py FILE.{md,txt,pdf} [out.mp3] [voice]
Voices: af / default = 0,  adam / am_adam = 5  (or a numeric Kokoro sid)
"""

import os
import re
import sys
import json
import time
import subprocess

import sherpa_onnx
import lameenc
import numpy as np

MODEL = os.path.expanduser(
    os.environ.get("KOKORO_MODEL_DIR", "~/wolf-and-word/kokoro-en-v0_19"))


def load_text(path):
    ext = path.lower().rsplit(".", 1)[-1]
    if ext == "pdf":
        out = subprocess.run(["pdftotext", "-q", path, "-"],
                             capture_output=True, text=True)
        return out.stdout
    raw = open(path, encoding="utf-8", errors="ignore").read()
    if ext in ("md", "markdown"):
        raw = _strip_markdown(raw)
    return raw


def _strip_markdown(s):
    s = re.sub(r"```.*?```", " ", s, flags=re.S)
    s = re.sub(r"`[^`]*`", " ", s)
    s = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", s)
    s = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", s)
    s = re.sub(r"^#{1,6}\s*", "", s, flags=re.M)
    s = re.sub(r"[*_~>]+", "", s)
    s = re.sub(r"^\s*[-*+]\s+", "", s, flags=re.M)
    return s


_SENT = re.compile(r".+?(?:[.!?](?=\s|$)|\n\n|$)", re.S)


# Kokoro overflows (~512-TOKEN cap -> "Bad things happened! 511 vs 511"). Tokens
# != characters: number/unit-dense text expands a lot when phonemized, so a short
# sentence can still overflow. We split aggressively up front AND catch-and-resplit
# at synth time (see _gen_samples), so no input can ever crash the render.
MAX_SENT_CHARS = 250


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


def _ts(ms):
    ms = max(0, int(round(ms)))
    h, ms = divmod(ms, 3600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return "%02d:%02d:%02d.%03d" % (h, m, s, ms)


VOICES = {"af": 0, "default": 0, "adam": 5, "am_adam": 5}


def _voice_id(value):
    if isinstance(value, int):
        return value
    s = str(value).strip().lower()
    return VOICES[s] if s in VOICES else int(s)


def _write_html(html_path, title, audio_name, cues):
    # sentences embedded inline (no fetch -> works from file:// and on Sailfish)
    data = [{"s": c["start_ms"], "e": c["end_ms"], "t": c["text"]} for c in cues]
    payload = json.dumps(data, ensure_ascii=False)
    html = """<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<style>
 :root{--bg:#f4efe6;--fg:#2b2b2b;--hi:#ffe08a;--dim:#9a9388}
 *{box-sizing:border-box}
 body{margin:0;background:var(--bg);color:var(--fg);
   font-family:"IBM Plex Sans",-apple-system,Segoe UI,Roboto,sans-serif;
   line-height:1.7;font-size:1.15rem}
 header{position:sticky;top:0;background:var(--bg);padding:.6rem 1rem;
   border-bottom:1px solid #ddd5c7;box-shadow:0 2px 8px rgba(0,0,0,.05)}
 audio{width:100%}
 main{max-width:42rem;margin:0 auto;padding:1.2rem 1.1rem 40vh}
 h1{font-size:1.1rem;color:var(--dim);font-weight:600;margin:.2rem 0 1rem}
 .s{cursor:pointer;border-radius:.25rem;padding:.02em 0;transition:background .12s}
 .s:hover{background:#eadfc8}
 .s.active{background:var(--hi);box-shadow:0 0 0 .15em var(--hi)}
 .spd{margin-top:.45rem;font-size:.85rem;color:var(--dim)}
 .spd button{font:inherit;margin:0 .12rem;padding:.18rem .55rem;border:1px solid #ccc3b2;
   background:#fbf7ee;color:var(--fg);border-radius:.4rem;cursor:pointer}
 .spd button.on{background:var(--hi);border-color:#e0c050}
</style></head><body>
<header><audio id="a" src="__AUDIO__" controls preload="metadata"></audio>
<div class="spd">Speed:
 <button data-r="1" class="on">1&times;</button><button data-r="1.25">1.25&times;</button>
 <button data-r="1.5">1.5&times;</button><button data-r="2">2&times;</button></div></header>
<main><h1>__TITLE__</h1><p id="t"></p></main>
<script>
const S=__DATA__,a=document.getElementById('a'),t=document.getElementById('t');
const spans=S.map((c,i)=>{const e=document.createElement('span');
 e.className='s';e.textContent=c.t+' ';e.onclick=()=>{a.currentTime=c.s/1000;a.play()};
 t.appendChild(e);return e});
let cur=-1;
function find(ms){if(cur>=0&&ms>=S[cur].s&&ms<S[cur].e)return cur;
 for(let i=0;i<S.length;i++)if(ms>=S[i].s&&ms<S[i].e)return i;return -1}
a.addEventListener('timeupdate',()=>{const ms=a.currentTime*1000,i=find(ms);
 if(i===cur)return; if(cur>=0)spans[cur].classList.remove('active');
 cur=i; if(i>=0){spans[i].classList.add('active');
  spans[i].scrollIntoView({block:'center',behavior:'smooth'})}});
document.querySelectorAll('.spd button').forEach(b=>b.onclick=()=>{
 a.playbackRate=parseFloat(b.dataset.r); a.preservesPitch=true;
 document.querySelectorAll('.spd button').forEach(x=>x.classList.toggle('on',x===b))});
</script></body></html>"""
    html = (html.replace("__TITLE__", title)
                .replace("__AUDIO__", audio_name)
                .replace("__DATA__", payload))
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)


def _gen_samples(tts, text, sid, depth=0):
    """Synthesize -> float32 samples. If Kokoro chokes on a too-dense/long piece,
    halve it and retry recursively so a single bad sentence can't crash the run."""
    text = text.strip()
    if not text:
        return np.zeros(0, dtype=np.float32)
    try:
        a = tts.generate(text, sid=sid, speed=1.0)
        s = np.asarray(a.samples, dtype=np.float32)
        if s.size > 0:
            return s
    except Exception:
        pass
    if depth >= 14 or " " not in text:
        return np.zeros(0, dtype=np.float32)   # give up on an unsplittable scrap
    cut = text.rfind(" ", 0, max(1, len(text) // 2))
    if cut <= 0:
        cut = len(text) // 2
    left = _gen_samples(tts, text[:cut], sid, depth + 1)
    right = _gen_samples(tts, text[cut:], sid, depth + 1)
    if left.size and right.size:
        return np.concatenate([left, right])
    return left if left.size else right


def render(infile, outfile=None, sid=0, bitrate=32, progress_cb=None):
    text = load_text(infile)
    if not text.strip():
        sys.exit("no extractable text")
    sid = _voice_id(sid)

    cfg = sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(
                model=MODEL + "/model.onnx",
                voices=MODEL + "/voices.bin",
                tokens=MODEL + "/tokens.txt",
                data_dir=MODEL + "/espeak-ng-data",
            ),
            num_threads=min(8, os.cpu_count() or 4),
        ),
        max_num_sentences=1,
    )
    tts = sherpa_onnx.OfflineTts(cfg)

    sentences = _sentences(text)
    rate = 24000
    audio_sec = 0.0
    t0 = time.time()

    outfile = outfile or os.path.splitext(os.path.basename(infile))[0] + ".opus"
    if not os.path.isabs(outfile):
        outfile = os.path.join(os.path.expanduser("~/kokoro-render"), outfile)
    base = os.path.splitext(outfile)[0]
    tmp = outfile + ".tmp"

    # Encode to Ogg Opus via ffmpeg (desktop has it, no sandbox here). ~2-3x
    # smaller than MP3 at speech quality. Timings come from sample counts, so
    # they're independent of the codec.
    ff = subprocess.Popen(
        ["ffmpeg", "-loglevel", "error", "-y",
         "-f", "s16le", "-ar", str(rate), "-ac", "1", "-i", "-",
         "-c:a", "libopus", "-b:a", "%dk" % bitrate, "-f", "ogg", tmp],
        stdin=subprocess.PIPE)

    cues = []
    for i, sent in enumerate(sentences):
        samples = _gen_samples(tts, sent, sid)
        if samples.size == 0:
            continue
        start_ms = round(audio_sec * 1000)
        samples = np.clip(samples, -1.0, 1.0)
        ff.stdin.write((samples * 32767.0).astype("<i2").tobytes())
        audio_sec += len(samples) / rate
        cues.append({"start_ms": start_ms,
                     "end_ms": round(audio_sec * 1000),
                     "text": sent})
        if (i + 1) % 25 == 0 or i + 1 == len(sentences):
            sys.stderr.write("  %d/%d sentences — %.1f min audio\n"
                             % (i + 1, len(sentences), audio_sec / 60))
            sys.stderr.flush()
            if progress_cb:
                progress_cb(i + 1, len(sentences), audio_sec)
    ff.stdin.close()
    if ff.wait() != 0:
        raise RuntimeError("ffmpeg opus encoding failed")
    os.replace(tmp, outfile)

    # WebVTT sidecar
    with open(base + ".vtt", "w", encoding="utf-8") as v:
        v.write("WEBVTT\n\n")
        for n, c in enumerate(cues, 1):
            v.write("%d\n%s --> %s\n%s\n\n"
                    % (n, _ts(c["start_ms"]), _ts(c["end_ms"]), c["text"]))

    # JSON timing map
    with open(base + ".json", "w", encoding="utf-8") as j:
        json.dump({"audio": os.path.basename(outfile),
                   "duration_ms": round(audio_sec * 1000),
                   "sentences": cues}, j, ensure_ascii=False)

    # self-contained follow-along player
    title = os.path.splitext(os.path.basename(infile))[0]
    _write_html(base + ".html", title, os.path.basename(outfile), cues)

    gen = time.time() - t0
    print("\nWROTE %s (+ .vtt .json .html)\n  %d sentences | %.1f min audio | "
          "%d KB | %.0fs | RTF %.2f"
          % (outfile, len(cues), audio_sec / 60,
             os.path.getsize(outfile) // 1024, gen, gen / max(audio_sec, 0.1)))
    return outfile


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: render.py FILE.{md,txt,pdf} [out.mp3] [voice]")
    render(sys.argv[1],
           sys.argv[2] if len(sys.argv) > 2 else None,
           sys.argv[3] if len(sys.argv) > 3 else 0)
