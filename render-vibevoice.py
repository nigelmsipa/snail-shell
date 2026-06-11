#!/usr/bin/env python3
"""
render-vibevoice.py — same pipeline as render.py but uses VibeVoice-Realtime-0.5B
instead of Kokoro/sherpa-onnx.

Usage:
  render-vibevoice.py FILE.{md,txt,pdf} [out.opus] [speaker]
  Speaker defaults to Carter. Options: Carter Davis Emma Frank Grace Mike Samuel

Output: <base>.opus  <base>.vtt  <base>.json  <base>.html
"""

import os, re, sys, json, time, copy, subprocess
import torch
import numpy as np

sys.path.insert(0, os.path.expanduser("~/VibeVoice"))
from vibevoice.modular.modeling_vibevoice_streaming_inference import (
    VibeVoiceStreamingForConditionalGenerationInference,
)
from vibevoice.processor.vibevoice_streaming_processor import VibeVoiceStreamingProcessor

MODEL_ID    = "microsoft/VibeVoice-Realtime-0.5B"
VOICES_DIR  = os.path.expanduser("~/VibeVoice/demo/voices/streaming_model")
SAMPLE_RATE = 24000

# ── text loading ────────────────────────────────────────────────────────────

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

_SENT    = re.compile(r".+?(?:[.!?](?=\s|$)|\n\n|$)", re.S)
MAX_CHARS = 300   # VibeVoice handles longer chunks fine; 300 keeps RTF stable

def _split_long(s, maxc=MAX_CHARS):
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

# ── timing util ─────────────────────────────────────────────────────────────

def _ts(ms):
    ms = max(0, int(round(ms)))
    h, ms  = divmod(ms, 3_600_000)
    m, ms  = divmod(ms,    60_000)
    s, ms  = divmod(ms,     1_000)
    return "%02d:%02d:%02d.%03d" % (h, m, s, ms)

# ── HTML player (identical to render.py) ────────────────────────────────────

def _write_html(html_path, title, audio_name, cues):
    data    = [{"s": c["start_ms"], "e": c["end_ms"], "t": c["text"]} for c in cues]
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

# ── voice loader ─────────────────────────────────────────────────────────────

def _cast_cache(voice_cache_dict, dtype):
    """Cast all KV cache tensors in a voice cache dict to the given dtype.
    Needed because the .pt files are saved in bfloat16 but we run float16 on
    AMD gfx1030 (which emulates bfloat16 as float32, causing SDPA dtype mismatch)."""
    from transformers.modeling_outputs import BaseModelOutputWithPast
    for output in voice_cache_dict.values():
        if not isinstance(output, BaseModelOutputWithPast):
            continue
        if output.last_hidden_state is not None:
            output.last_hidden_state = output.last_hidden_state.to(dtype=dtype)
        cache = output.past_key_values
        if hasattr(cache, "key_cache"):
            cache.key_cache   = [t.to(dtype=dtype) for t in cache.key_cache]
            cache.value_cache = [t.to(dtype=dtype) for t in cache.value_cache]
    return voice_cache_dict

def _voice_path(name):
    # exact filename match first
    for fname in os.listdir(VOICES_DIR):
        if not fname.endswith(".pt"):
            continue
        stem = os.path.splitext(fname)[0]           # e.g. en-Carter_man
        simple = stem.split("_")[0].split("-")[-1]  # e.g. Carter
        if simple.lower() == name.lower() or stem.lower() == name.lower():
            return os.path.join(VOICES_DIR, fname)
    raise ValueError(f"Voice '{name}' not found in {VOICES_DIR}")

# ── synthesis ────────────────────────────────────────────────────────────────

def _synth(model, processor, voice_cache, text, device):
    """Return float32 numpy array of audio samples for one text chunk."""
    text = text.strip()
    if not text:
        return np.zeros(0, dtype=np.float32)
    try:
        inputs = processor.process_input_with_cached_prompt(
            text=text,
            cached_prompt=voice_cache,
            padding=True,
            return_tensors="pt",
            return_attention_mask=True,
        )
        for k, v in inputs.items():
            if torch.is_tensor(v):
                inputs[k] = v.to(device)

        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=None,
                cfg_scale=1.5,
                tokenizer=processor.tokenizer,
                generation_config={"do_sample": False},
                verbose=False,
                all_prefilled_outputs=copy.deepcopy(voice_cache),
            )

        if outputs.speech_outputs and outputs.speech_outputs[0] is not None:
            raw = outputs.speech_outputs[0]
            if torch.is_tensor(raw):
                raw = raw.squeeze().cpu().float().numpy()
            return np.clip(np.asarray(raw, dtype=np.float32), -1.0, 1.0)
    except Exception as e:
        sys.stderr.write(f"  [warn] synth failed ({e}), skipping chunk\n")
    return np.zeros(0, dtype=np.float32)

# ── engine (model loaded once, reused across renders) ────────────────────────

def _pick_device():
    if torch.cuda.is_available():
        try:
            # Sanity check: actually run a tiny op to catch ROCm failures
            t = torch.zeros(1, device="cuda")
            _ = t + 1
            # Use float16 — bfloat16 is emulated on AMD RX 6000 and slower
            return "cuda", torch.float16
        except Exception as e:
            sys.stderr.write(f"[warn] GPU check failed ({e}), falling back to CPU\n")
    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return "mps", torch.float32
    return "cpu", torch.float32


class Engine:
    """Holds the model + processor loaded once, plus a per-speaker voice cache.
    Reuse one Engine across many render() calls so the model is never reloaded."""

    def __init__(self):
        self.device, self.load_dtype = _pick_device()
        sys.stderr.write(f"Loading VibeVoice model ({MODEL_ID}) on {self.device}…\n")
        self.processor = VibeVoiceStreamingProcessor.from_pretrained(MODEL_ID)
        self.model = VibeVoiceStreamingForConditionalGenerationInference.from_pretrained(
            MODEL_ID,
            torch_dtype=self.load_dtype,
            device_map=self.device,
            attn_implementation="sdpa",
        )
        self.model.eval()
        self.model.set_ddpm_inference_steps(num_steps=5)
        self._voices = {}   # speaker -> cast voice cache, loaded once and kept resident
        sys.stderr.write("Engine ready\n")

    def voice(self, speaker):
        key = speaker.lower()
        if key not in self._voices:
            voice_path = _voice_path(speaker)
            cache = torch.load(voice_path, map_location=self.device, weights_only=False)
            self._voices[key] = _cast_cache(cache, self.load_dtype)
            sys.stderr.write(f"Voice loaded: {speaker} ({os.path.basename(voice_path)})\n")
        return self._voices[key]


_DEFAULT_ENGINE = None

def _get_engine():
    """Lazily build a process-wide default engine (used by the CLI path)."""
    global _DEFAULT_ENGINE
    if _DEFAULT_ENGINE is None:
        _DEFAULT_ENGINE = Engine()
    return _DEFAULT_ENGINE

# ── main render ──────────────────────────────────────────────────────────────

def render(infile, outfile=None, speaker="Carter", bitrate=32, engine=None):
    text = load_text(infile)
    if not text.strip():
        sys.exit("no extractable text")

    # Normalise quotes (VibeVoice tip)
    text = text.replace("\u2018", "'").replace("\u2019", "'") \
               .replace("\u201c", '"').replace("\u201d", '"')

    outfile = outfile or os.path.splitext(os.path.basename(infile))[0] + ".opus"
    if not os.path.isabs(outfile):
        outfile = os.path.join(os.path.expanduser("~/kokoro-render"), outfile)
    base = os.path.splitext(outfile)[0]
    tmp  = outfile + ".tmp"

    engine      = engine or _get_engine()
    model       = engine.model
    processor   = engine.processor
    device      = engine.device
    voice_cache = engine.voice(speaker)

    sentences = _sentences(text)
    sys.stderr.write(f"{len(sentences)} sentences to render\n\n")

    # ── ffmpeg encoder ──
    ff = subprocess.Popen(
        ["ffmpeg", "-loglevel", "error", "-y",
         "-f", "s16le", "-ar", str(SAMPLE_RATE), "-ac", "1", "-i", "-",
         "-c:a", "libopus", "-b:a", "%dk" % bitrate, "-f", "ogg", tmp],
        stdin=subprocess.PIPE)

    cues      = []
    audio_sec = 0.0
    t0        = time.time()

    for i, sent in enumerate(sentences):
        samples = _synth(model, processor, voice_cache, sent, device)
        if samples.size == 0:
            continue
        start_ms = round(audio_sec * 1000)
        ff.stdin.write((samples * 32767.0).astype("<i2").tobytes())
        audio_sec += len(samples) / SAMPLE_RATE
        cues.append({"start_ms": start_ms,
                     "end_ms":   round(audio_sec * 1000),
                     "text":     sent})
        if (i + 1) % 10 == 0 or i + 1 == len(sentences):
            elapsed = time.time() - t0
            rtf     = elapsed / max(audio_sec, 0.01)
            sys.stderr.write("  %d/%d — %.1f min audio — RTF %.2fx\n"
                             % (i + 1, len(sentences), audio_sec / 60, rtf))
            sys.stderr.flush()

    ff.stdin.close()
    if ff.wait() != 0:
        raise RuntimeError("ffmpeg opus encoding failed")
    os.replace(tmp, outfile)

    # ── sidecars ──
    with open(base + ".vtt", "w", encoding="utf-8") as v:
        v.write("WEBVTT\n\n")
        for n, c in enumerate(cues, 1):
            v.write("%d\n%s --> %s\n%s\n\n"
                    % (n, _ts(c["start_ms"]), _ts(c["end_ms"]), c["text"]))

    with open(base + ".json", "w", encoding="utf-8") as j:
        json.dump({"audio":       os.path.basename(outfile),
                   "voice":       speaker,
                   "duration_ms": round(audio_sec * 1000),
                   "sentences":   cues}, j, ensure_ascii=False)

    title = os.path.splitext(os.path.basename(infile))[0]
    _write_html(base + ".html", title, os.path.basename(outfile), cues)

    gen = time.time() - t0
    print("\nWROTE %s (+ .vtt .json .html)\n  %d sentences | %.1f min audio | "
          "%d KB | %.0fs | RTF %.2f"
          % (outfile, len(cues), audio_sec / 60,
             os.path.getsize(outfile) // 1024, gen, gen / max(audio_sec, 0.01)))
    return outfile


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: render-vibevoice.py FILE.{md,txt,pdf} [out.opus] [speaker]")
    render(sys.argv[1],
           sys.argv[2] if len(sys.argv) > 2 else None,
           sys.argv[3] if len(sys.argv) > 3 else "Carter")
