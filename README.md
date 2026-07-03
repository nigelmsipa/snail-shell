# Wolf & Word

A platform for making the Bible easier to **read, know, and remember** — free, open source, and built to work offline.

Most Bible software adds features. Wolf & Word removes friction: a small set of well-made tools that help a person actually get into the text, see how it's built, and carry it with them. The name is from Matthew 10:16 — *sheep among wolves* — and the wolf imagery running through Paul's letters.

This repository is **one part** of that platform — currently the engine and the video pipeline (see [What's in this repo](#whats-in-this-repo)). Wolf & Word is the larger whole those pieces serve.

## What Wolf & Word is

Three ways in, all serving the one goal of engagement:

- **Read** — word-by-word read-along: narrated audio synced to the text, each word lighting up as it's spoken. Lowers the effort to start and to stay.
- **Know the lay of the land** — Scripture divided into its own natural units: **pericopes**, grouped into **stories** and larger **narrative arcs**. This is cartography, not rote — the point is *orientation*: knowing where things are and how a book is built. Structure turns a wall of verses into a place you can walk.
- **Remember** — the **First Letter** method, keyed to pericopes instead of isolated verses. You internalize one complete thought — a *foothold* of ≤6 verses (e.g. *Genesis 1A, 1B … 1J*) — at a time, not a scatter of disconnected lines.

## Principles

- **Open source** — nothing hidden.
- **Free** — no monetization, no accounts-as-toll, no gating of the text.
- **Offline-first** — own your copy; use it without a connection. The network is a delivery truck, not a landlord.
- **Public-domain translations only** — KJV, BSB, WEB, and other free texts, so the *text itself* is yours, not just the app.

## The arms

Wolf & Word is the umbrella; these are the parts under it, each with its own identity:

- **Snail** — the read-along *engine*. Text + narrated audio → forced alignment → a timing map → a rendered player/video. (Lives in this repo; grew out of the old `snail-shell`.)
- **Read-along videos** — the current output. Chapters rendered as read-alongs, cut into lettered pericopes, teaching the memory map passively as you watch. (Pipeline lives in this repo.)
- **Memory Method** — the pericope/story/arc structure that drives both the cartography and the memorization. Authored in the companion [`memory-method-bible`](https://github.com/nigelmsipa/memory-method-bible) repo and consumed here.
- **The Reader** — *planned*. A website/app to read or memorize any public-domain Bible, offline, with adjustable size, font, colors, and auto-scroll.

## What's in this repo

This repo holds the **engine + video pipeline + render data** — not the whole platform.

```
wolf-and-word/
  *.py  *.sh          engine + render/alignment pipeline
  *.md                docs
  renders/
    <translation>/    per-chapter data + rendered read-alongs (bsb, ylt, …); gitignored
                      (regenerable, large — the human-narration .opus needs its own backup)
  design/             design iteration (gitignored; source of truth is ~/open-design)
  to-integrate/       parked archives of retired sibling projects
```

The design source of truth lives in `~/open-design`; render/setup docs for the GPU node are in [`RENDER_SERVER.md`](RENDER_SERVER.md).

## Status

Early, and shipping **depth-first**: **KJV first, then BSB**, then the rest in publication order. Near-term work is getting KJV read-along videos out — the hard part, because a rendered video is "cement" (its format locks once produced) in a way the reader software won't be.
