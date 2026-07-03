# Wolf & Word

A platform for making the Bible easier to **read, know, and remember** — free, open source, and built to work offline.

The goal is to lower the barrier to actually engaging Scripture: not another feature-heavy Bible app, but a small set of well-made tools that help a person read their Bible, understand how it's put together, and commit it to memory.

The name comes from Matthew 10:16 — *sheep among wolves* — and the recurring wolf imagery in Paul's letters.

---

## What it does

Three aspects, each serving the one goal of engagement:

- **Read** — word-by-word read-along: narrated audio synced to the text so the words light up as they're spoken. Lowers the effort to start and stay in the text.
- **Know the lay of the land (cartography)** — Scripture divided into its own natural units — **pericopes** grouped into **stories** and larger **narrative arcs**. The point isn't rote recall of every verse; it's *orientation*: knowing where things are and how the book is built. Structure turns a wall of verses into a place you can walk.
- **Memorize** — the **First Letter** method, but keyed to pericopes instead of isolated verses. You memorize a complete thought (a *foothold*, ≤6 verses) at a time — e.g. *Genesis 1A, 1B … 1J* — rather than a scatter of disconnected lines.

## Principles

- **Open source.** The whole thing is open — nothing hidden.
- **Free.** No monetization, no accounts-as-toll, no gating of the text.
- **Offline-first.** You should be able to own your copy and use it without a connection. The network is a delivery truck, not a landlord.
- **Public-domain translations only.** Built on Bibles that are free to own and redistribute (KJV, BSB, WEB, and other public-domain texts) — so the text itself, not just the app, is genuinely yours.

## How it's built

- **Snail** — the *engine*. Takes a source text plus narrated audio and produces a word-synced read-along: forced alignment → a timing map → a rendered player / video. (This repo grew out of, and replaces, the old `snail-shell`.)
- **memory-method** — the *data*. The whole Bible carved into pericope footholds, stories, and arcs. This drives both the cartography and the memorization. (Authored in the companion [`memory-method-bible`](https://github.com/nigelmsipa/memory-method-bible) repo and consumed here.)
- **First Letter** — the *memorization vehicle* layered on top of the pericope data.

### Outputs

1. **YouTube read-along videos** — the current focus. Each chapter rendered as a read-along, cut into lettered pericopes, teaching the memory map passively as you watch.
2. **A reader / website** — planned. Pick a public-domain Bible and read or memorize it, offline, with adjustable text size, font, colors, and auto-scroll.

## Status

Early and shipping depth-first: **KJV first, then BSB**, then the rest in publication order. The near-term work is getting KJV read-along videos out the door — polishing them is the hard part, because a rendered video is "cement" (its format locks once it's produced) in a way the reader software isn't.

---

## Render server (GPU node)

The sections below are operational docs for the **render-server machine** — the box that runs `server.py` so the main machine can send documents and get back rendered audio (VibeVoice TTS over ROCm).

### Setup (CachyOS + AMD GPU)

**1. Install system dependencies**

```bash
sudo pacman -S rocm-hip-sdk rocm-opencl-runtime hip-runtime-amd ffmpeg poppler python python-pip git
```

**2. Clone the repos**

```bash
cd ~
git clone https://github.com/nigelmsipa/wolf-and-word.git
git clone https://github.com/vibevoice-community/VibeVoice.git
```

**3. Create Python venv and install deps**

```bash
cd ~/wolf-and-word
python -m venv .venv
source .venv/bin/activate
pip install torch --index-url https://download.pytorch.org/whl/rocm6.0
pip install -e ~/VibeVoice
pip install flask
```

**4. Fix ROCm for RX 6000-series GPUs (if the GPU fails)**

```bash
export HSA_OVERRIDE_GFX_VERSION=10.3.0
```

Common values by card:
- RX 6600 / 6700 / 6800 / 6900 XT → `10.3.0`
- RX 7600 → `11.0.0`
- RX 7700 / 7800 XT → `11.0.2`
- RX 7900 XT / XTX → `11.0.3`

**5. Start the server**

```bash
cd ~/wolf-and-word
source .venv/bin/activate
export HSA_OVERRIDE_GFX_VERSION=10.3.0   # adjust for your card
python server.py --port 7272
```

To keep it running after closing the terminal, use tmux:

```bash
tmux new -s render
source ~/wolf-and-word/.venv/bin/activate
export HSA_OVERRIDE_GFX_VERSION=10.3.0
python ~/wolf-and-word/server.py --port 7272
# Ctrl+B then D to detach — server keeps running
```

**6. Confirm it works**

```bash
curl http://localhost:7272/health    # → {"ok":true}
curl http://localhost:7272/voices    # → {"voices":[...]}
```

### Updating

```bash
cd ~/wolf-and-word
git pull
# restart server
```

### Notes

- The VibeVoice model (~2GB) downloads automatically from HuggingFace on first run into `~/.cache/huggingface/`.
- If ROCm fails, the script automatically falls back to CPU (slower but works).
- Firewall: open port 7272 — `sudo firewall-cmd --add-port=7272/tcp --permanent && sudo firewall-cmd --reload`.
