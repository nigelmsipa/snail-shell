# GPU Render Server Setup

Set this up on your other machine (the one with the 8GB GPU) so you can
send PDFs from anywhere and get back narrated audio in minutes instead of 45.

---

## 1. Requirements

- **CachyOS** (Arch-based) + AMD Radeon RX GPU (8GB) — RX 6000 series or newer required for ROCm
- Python 3.10+ (already on CachyOS)
- ROCm + ffmpeg + pdftotext:
  ```bash
  sudo pacman -S rocm-hip-sdk rocm-opencl-runtime hip-runtime-amd ffmpeg poppler
  ```
- Confirm GPU is visible:
  ```bash
  rocminfo | grep "Marketing Name"
  ```
- If your card is RX 5000 or older, ROCm won't work — CPU render is the fallback (same 45 min speed).

---

## 2. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/kokoro-render.git
cd kokoro-render
```

Or just copy the files over via `scp` from this machine:
```bash
scp -r ~/kokoro-render user@GPU_MACHINE_IP:~/kokoro-render
```

---

## 3. Clone VibeVoice (community fork)

```bash
cd ~
git clone https://github.com/vibevoice-community/VibeVoice.git
```

---

## 4. Create Python venv and install deps

```bash
cd ~/kokoro-render
python3 -m venv .venv
source .venv/bin/activate

# PyTorch with ROCm support (AMD RX GPU on CachyOS):
pip install torch --index-url https://download.pytorch.org/whl/rocm6.0

# Install VibeVoice
pip install -e ~/VibeVoice

# Install server deps
pip install flask

# (optional) pdftotext Python fallback
pip install pdfminer.six
```

---

## 5. Test a single render

```bash
source .venv/bin/activate
python render-vibevoice.py /path/to/test.pdf ~/rendered/test.opus Carter
```

First run downloads the VibeVoice model (~2 GB) from HuggingFace automatically.
Subsequent runs use the cached model at `~/.cache/huggingface/`.

---

## 6. Start the server

```bash
source .venv/bin/activate
python server.py --port 7272
```

To run it permanently in the background:
```bash
nohup python server.py --port 7272 > ~/render-server.log 2>&1 &
```

Or create a systemd service (see below).

---

## 7. Test from client machine (this machine)

```bash
# Check health
curl http://GPU_IP:7272/health

# Render a PDF (async — returns job ID immediately)
curl -X POST http://GPU_IP:7272/render \
     -F "file=@document.pdf" \
     -F "voice=Carter"
# → {"job_id": "abc12345", "status": "queued"}

# Check progress
curl http://GPU_IP:7272/status/abc12345

# Download when done (returns .zip with .opus .html .json .vtt)
curl http://GPU_IP:7272/download/abc12345 -o document.zip
unzip document.zip -d ~/kokoro-render/

# OR: render synchronously (blocks until done, returns zip directly)
curl -X POST http://GPU_IP:7272/render \
     -F "file=@document.pdf" \
     -F "voice=Carter" \
     -F "sync=true" \
     --output document.zip
```

---

## 8. Available voices

```bash
curl http://GPU_IP:7272/voices
# → {"voices": ["Carter", "Davis", "Emma", "Frank", "Grace", "Mike", "Samuel"]}
```

---

## 9. Systemd service (optional, auto-start on boot)

Create `/etc/systemd/system/render-server.service`:
```ini
[Unit]
Description=VibeVoice Render Server
After=network.target

[Service]
User=YOUR_USERNAME
WorkingDirectory=/home/YOUR_USERNAME/kokoro-render
ExecStart=/home/YOUR_USERNAME/kokoro-render/.venv/bin/python server.py --port 7272
Restart=on-failure
Environment=RENDER_OUTPUT_DIR=/home/YOUR_USERNAME/rendered

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable render-server
sudo systemctl start render-server
```

---

## Expected render speed with GPU

| GPU           | 40-min document |
|---------------|-----------------|
| RTX 3070/4060 | ~3–4 min        |
| RTX 3080/4070 | ~2–3 min        |
| CPU (no GPU)  | ~45 min         |
