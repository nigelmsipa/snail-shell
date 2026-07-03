# Render server (GPU node) setup

Operational docs for the **render-server machine** — the box that runs `server.py` so the
main machine can send text and get back narrated audio (VibeVoice TTS over ROCm). This is
infrastructure, not the project; see `README.md` for what Wolf & Word is.

## Setup (CachyOS + AMD GPU)

**1. System dependencies**

```bash
sudo pacman -S rocm-hip-sdk rocm-opencl-runtime hip-runtime-amd ffmpeg poppler python python-pip git
```

**2. Clone the repos**

```bash
cd ~
git clone https://github.com/nigelmsipa/wolf-and-word.git
git clone https://github.com/vibevoice-community/VibeVoice.git
```

**3. Python venv + deps**

```bash
cd ~/wolf-and-word
python -m venv .venv
source .venv/bin/activate
pip install torch --index-url https://download.pytorch.org/whl/rocm6.0
pip install -e ~/VibeVoice
pip install flask
```

**4. ROCm override for RX 6000-series (if the GPU fails)**

```bash
export HSA_OVERRIDE_GFX_VERSION=10.3.0
```

By card: RX 6600/6700/6800/6900 XT → `10.3.0`; RX 7600 → `11.0.0`;
RX 7700/7800 XT → `11.0.2`; RX 7900 XT/XTX → `11.0.3`.

**5. Start the server**

```bash
cd ~/wolf-and-word && source .venv/bin/activate
export HSA_OVERRIDE_GFX_VERSION=10.3.0   # adjust for your card
python server.py --port 7272
```

Keep it alive across terminals with tmux:

```bash
tmux new -s render
source ~/wolf-and-word/.venv/bin/activate
export HSA_OVERRIDE_GFX_VERSION=10.3.0
python ~/wolf-and-word/server.py --port 7272
# Ctrl+B then D to detach
```

**6. Confirm**

```bash
curl http://localhost:7272/health    # → {"ok":true}
curl http://localhost:7272/voices    # → {"voices":[...]}
```

## Updating

```bash
cd ~/wolf-and-word && git pull   # then restart the server
```

## Notes

- The VibeVoice model (~2GB) downloads from HuggingFace on first run into `~/.cache/huggingface/`.
- If ROCm fails, the script falls back to CPU (slower but works).
- Firewall: `sudo firewall-cmd --add-port=7272/tcp --permanent && sudo firewall-cmd --reload`.
