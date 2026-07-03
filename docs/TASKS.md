# Tasks for GPU Server (CachyOS AI)

## PRIORITY: Set up Ollama with GPU acceleration

### Why
This machine replaces the Void Linux CPU-only Ollama server. The RX 6600 should
run 7B models significantly faster than CPU-only inference.

### 1. Install Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Configure ROCm for RX 6600

```bash
# Add to ~/.bashrc and run now:
echo 'export HSA_OVERRIDE_GFX_VERSION=10.3.0' >> ~/.bashrc
export HSA_OVERRIDE_GFX_VERSION=10.3.0
```

### 3. Start Ollama (GPU mode)

```bash
OLLAMA_HOST=0.0.0.0:11434 ollama serve &
```

Confirm GPU is being used — should show `rocm` in the logs.

### 4. Pull the model

```bash
# Same model sage-rag uses:
ollama pull gpt-oss:20b

# If 20B is too big for 8GB VRAM, fall back to:
ollama pull qwen2.5:7b
```

### 5. Test it

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:7b",
  "prompt": "Say hello",
  "stream": false
}'
```

### 6. Make it persistent

```bash
sudo systemctl enable ollama
sudo systemctl start ollama

# Or if systemd isn't available, add to tmux startup
```

### 7. Open firewall

```bash
sudo firewall-cmd --add-port=11434/tcp --permanent
sudo firewall-cmd --reload
```

### 8. Report back

Note the tokens/sec for `qwen2.5:7b` — that's the benchmark.
Compare to CPU-only Void Linux Ollama speed.

---


## Current task: Add Kokoro support and benchmark vs VibeVoice

### 1. Pull latest changes

```bash
cd ~/wolf-and-word
git pull
```

### 2. Install Kokoro dependencies

```bash
source ~/wolf-and-word/.venv/bin/activate
pip install sherpa-onnx lameenc
```

### 3. Download the Kokoro model

```bash
mkdir -p ~/wolf-and-word/kokoro-en-v0_19
cd ~/wolf-and-word/kokoro-en-v0_19

# Download all required files:
wget https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-en-v0_19.tar.bz2
tar xf kokoro-en-v0_19.tar.bz2 --strip-components=1
rm kokoro-en-v0_19.tar.bz2
```

If the above URL is broken, files can also be found at:
https://huggingface.co/csukuangfj/kokoro-en-v0_19

Required files inside `~/wolf-and-word/kokoro-en-v0_19/`:
- `model.onnx`
- `voices.bin`
- `tokens.txt`
- `espeak-ng-data/` directory

### 4. Restart the server

```bash
# Stop existing server (Ctrl+C or kill the tmux session)
tmux kill-session -t render

tmux new -s render
cd ~/wolf-and-word
source .venv/bin/activate
export HSA_OVERRIDE_GFX_VERSION=10.3.0
python server.py --port 7272
# Ctrl+B then D to detach
```

### 5. Test Kokoro render

```bash
# Send a Kokoro render job (Adam voice = sid 5)
curl -X POST http://localhost:7272/render \
  -F "file=@/path/to/any.pdf" \
  -F "voice=adam" \
  -F "model=kokoro" \
  -s

# Watch progress
curl http://localhost:7272/progress/JOB_ID
```

### 6. Report back

Note the RTF (real-time factor) for Kokoro vs VibeVoice on the same document.
Kokoro is a much smaller/simpler model so it may be significantly faster.
The goal is to find out if the GPU helps Kokoro more than it helps VibeVoice.

---

## Benchmark results (2026-06-11, RX 6600 / gfx1030)

Done. Deps installed (`sherpa-onnx` 1.13.2 + `lameenc`), model downloaded to
`~/wolf-and-word/kokoro-en-v0_19`, server restarted, `adam` tested. Same
3-sentence text through both models:

| Model | Voice | Audio | Wall | RTF |
|---|---|---|---|---|
| VibeVoice (GPU, 0.5B + DDPM) | Carter | 8.7s | ~10s | **~1.16x** (slower than real-time) |
| Kokoro (sherpa-onnx) | adam | 6.8s | 2.9s | **~0.42x** (~2.4x faster than real-time) |

Kokoro's 0.42x is *pessimistic* — `render.py` reloads the sherpa model on every
call (not kept resident like the VibeVoice `Engine`), so the 2.9s includes model
load. Per-sentence synthesis is faster still.

**Why Kokoro wins, and the answer to the question above:** it's not that "the
GPU helps Kokoro more." Kokoro has **no diffusion decoder** — it's a single ONNX
forward pass per sentence. The thing that pins VibeVoice near real-time on this
card (the 5-step DDPM decode with no FlashAttention on gfx1030 — see SPEED.md)
simply isn't in Kokoro's pipeline. So Kokoro is fast for the same reason
VibeVoice is slow.

**User's call:** VibeVoice stays the default for quality ("buy once, cry once").
Kokoro/`adam` is the fast fallback for when speed matters in a pinch.

**Easy follow-up win (not yet done):** make Kokoro load-once/resident like the
VibeVoice `Engine` instead of reloading the sherpa model per job — removes the
load cost from every Kokoro render.

---

## Voice reference

### VibeVoice voices (model=vibevoice)
Carter, Davis, Emma, Frank, Grace, Mike, Samuel

### Kokoro voices (model=kokoro)
- `0` or `af` = default female
- `5` or `adam` = Adam (male)
