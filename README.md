# snail-shell

The compiler engine for the Snail knowledge system. Takes source documents (PDF, Markdown, text) and produces portable, playable, AI-queryable artifacts: `.opus` audio + `.html` follow-along player + `.vtt` captions + `.json` timing map.

---

## This machine is the GPU render server

Your job is to run `server.py` so the main machine can send documents and get back rendered audio.

---

## Setup (CachyOS + AMD GPU)

### 1. Install system dependencies

```bash
sudo pacman -S rocm-hip-sdk rocm-opencl-runtime hip-runtime-amd ffmpeg poppler python python-pip git
```

### 2. Clone the repo

```bash
cd ~
git clone https://github.com/nigelmsipa/snail-shell.git
```

### 3. Clone VibeVoice

```bash
cd ~
git clone https://github.com/vibevoice-community/VibeVoice.git
```

### 4. Create Python venv and install deps

```bash
cd ~/snail-shell
python -m venv .venv
source .venv/bin/activate
pip install torch --index-url https://download.pytorch.org/whl/rocm6.0
pip install -e ~/VibeVoice
pip install flask
```

### 5. Fix ROCm for RX 6000 series GPUs (if GPU fails)

If the GPU doesn't work, add this to `~/.bashrc` or run before starting the server:

```bash
export HSA_OVERRIDE_GFX_VERSION=10.3.0
```

Common values by card:
- RX 6600 / 6600 XT → `10.3.0`
- RX 6700 / 6700 XT → `10.3.0`
- RX 6800 / 6800 XT → `10.3.0`
- RX 6900 XT → `10.3.0`
- RX 7600 → `11.0.0`
- RX 7700 / 7800 XT → `11.0.2`
- RX 7900 XT / XTX → `11.0.3`

### 6. Start the server

```bash
cd ~/snail-shell
source .venv/bin/activate
export HSA_OVERRIDE_GFX_VERSION=10.3.0   # adjust for your card
python server.py --port 7272
```

To keep it running after closing the terminal, use tmux:

```bash
tmux new -s render
source ~/snail-shell/.venv/bin/activate
export HSA_OVERRIDE_GFX_VERSION=10.3.0
python ~/snail-shell/server.py --port 7272
# Press Ctrl+B then D to detach — server keeps running
```

### 7. Confirm it works

```bash
curl http://localhost:7272/health
# → {"ok":true}

curl http://localhost:7272/voices
# → {"voices":["Carter","Davis","Emma","Frank","Grace","Mike","Samuel"]}
```

---

## Updating

When the main machine pushes changes:

```bash
cd ~/snail-shell
git pull
# restart server
```

---

## Notes

- The VibeVoice model (~2GB) downloads automatically from HuggingFace on first run into `~/.cache/huggingface/`
- If ROCm fails, the script automatically falls back to CPU (slower but works)
- Firewall: make sure port 7272 is open — `sudo firewall-cmd --add-port=7272/tcp --permanent && sudo firewall-cmd --reload`
