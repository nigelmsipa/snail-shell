# Tasks for GPU Server (CachyOS AI)

## Current task: Add Kokoro support and benchmark vs VibeVoice

### 1. Pull latest changes

```bash
cd ~/snail-shell
git pull
```

### 2. Install Kokoro dependencies

```bash
source ~/snail-shell/.venv/bin/activate
pip install sherpa-onnx lameenc
```

### 3. Download the Kokoro model

```bash
mkdir -p ~/snail-shell/kokoro-en-v0_19
cd ~/snail-shell/kokoro-en-v0_19

# Download all required files:
wget https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-en-v0_19.tar.bz2
tar xf kokoro-en-v0_19.tar.bz2 --strip-components=1
rm kokoro-en-v0_19.tar.bz2
```

If the above URL is broken, files can also be found at:
https://huggingface.co/csukuangfj/kokoro-en-v0_19

Required files inside `~/snail-shell/kokoro-en-v0_19/`:
- `model.onnx`
- `voices.bin`
- `tokens.txt`
- `espeak-ng-data/` directory

### 4. Restart the server

```bash
# Stop existing server (Ctrl+C or kill the tmux session)
tmux kill-session -t render

tmux new -s render
cd ~/snail-shell
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

## Voice reference

### VibeVoice voices (model=vibevoice)
Carter, Davis, Emma, Frank, Grace, Mike, Samuel

### Kokoro voices (model=kokoro)
- `0` or `af` = default female
- `5` or `adam` = Adam (male)
