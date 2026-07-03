#!/usr/bin/env python3
"""Fast batched KJV aligner: loads MMS model ONCE, runs on GPU, loops all chapters.
Reuses align_from_audio's helpers. Shardable: align_kjv_batch.py <k> <n> runs every
n-th chapter starting at k (run several in parallel). Skips finished, logs failures.
"""
import os, sys, re, json, glob, subprocess
import torch
from torchaudio.pipelines import MMS_FA as bundle
sys.path.insert(0, "/workspace/snail-shell")
import align_from_audio as A  # load_audio_16k, _sentences, _norm, _fill_gaps, SR, PLAYER

KJV = "/workspace/kjv"; MP3 = "/workspace/kjv-mp3"; SR = A.SR
k, n = (int(sys.argv[1]), int(sys.argv[2])) if len(sys.argv) >= 3 else (0, 1)
device = "cuda" if torch.cuda.is_available() else "cpu"
model = bundle.get_model().eval().to(device)
tok = bundle.get_tokenizer(); aln = bundle.get_aligner()
print(f"shard {k}/{n} model on {device}", flush=True)

def align_one(base, dev):
    audio = f"{KJV}/{base}.opus"
    text = open(f"{KJV}/{base}.txt", encoding="utf-8").read()
    sents = A._sentences(text)
    words, sent_of = [], []
    for si, s in enumerate(sents):
        for w in re.findall(r"\S+", s):
            words.append(w); sent_of.append(si)
    if not words:
        return "nowords"
    wave = A.load_audio_16k(audio)
    dur_ms = round(wave.size(1) / SR * 1000)
    m = model if dev == device else model.to(dev)
    with torch.inference_mode():
        emission, _ = m(wave.to(dev))
    nframes = emission.size(1)
    norm = [A._norm(w) for w in words]
    keep = [i for i, x in enumerate(norm) if x]
    spans_all = aln(emission[0], tok([norm[i] for i in keep]))
    word_ms = [None] * len(words)
    for kidx, spans in zip(keep, spans_all):
        word_ms[kidx] = (spans[0].start / nframes * dur_ms, spans[-1].end / nframes * dur_ms)
    A._fill_gaps(word_ms)
    if dev != device:
        model.to(device)  # restore
    flat = [{"t": w, "s": round(ms[0]), "e": round(ms[1]), "si": si}
            for w, ms, si in zip(words, word_ms, sent_of)]
    cues = []
    for si, s in enumerate(sents):
        sp = [f for f in flat if f["si"] == si]
        if sp:
            cues.append({"start_ms": sp[0]["s"], "end_ms": sp[-1]["e"], "text": s})
    bn = os.path.basename(audio)
    json.dump({"audio": bn, "duration_ms": dur_ms, "sentences": cues},
              open(f"{KJV}/{base}.json", "w", encoding="utf-8"), ensure_ascii=False)
    json.dump({"audio": bn, "duration_ms": dur_ms, "sentences": cues, "words": flat},
              open(f"{KJV}/{base}-aligned.json", "w", encoding="utf-8"), ensure_ascii=False)
    payload = json.dumps([{"s": f["s"], "e": f["e"], "t": f["t"]} for f in flat], ensure_ascii=False)
    open(f"{KJV}/{base}-words.html", "w", encoding="utf-8").write(
        A.PLAYER.replace("__TITLE__", base).replace("__AUDIO__", bn).replace("__DATA__", payload))
    return "ok"

bases = sorted(os.path.basename(t)[:-4] for t in glob.glob(KJV + "/*.txt"))
bases = [b for i, b in enumerate(bases) if i % n == k]
done = 0
for base in bases:
    if os.path.exists(f"{KJV}/{base}-words.html"):
        continue
    if not os.path.exists(f"{KJV}/{base}.opus"):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{MP3}/{base}.mp3",
                        "-c:a", "libopus", "-b:a", "48k", f"{KJV}/{base}.opus"], stdin=subprocess.DEVNULL)
    try:
        r = align_one(base, device); done += 1
        print(f"[{base}] {r} ({done})", flush=True)
    except torch.cuda.OutOfMemoryError:
        torch.cuda.empty_cache()
        try:
            r = align_one(base, "cpu"); done += 1
            print(f"[{base}] ok-CPU ({done})", flush=True)
        except Exception as e:
            print(f"[{base}] FAIL-OOM {str(e)[:60]}", flush=True)
    except Exception as e:
        print(f"[{base}] FAIL {type(e).__name__}: {str(e)[:60]}", flush=True)
print(f"SHARD {k}/{n} COMPLETE done={done}", flush=True)
