# Bible in a Year — production recipe

Everything needed to rebuild all 365 days and all 12 month videos from scratch,
**except** the two heavy derived asset trees, which are named below.

The videos live on YouTube and Odysee. This directory is the machinery that made
them. If the disk dies, this is what you actually need back.

## What is here

| path | what | reproducible? |
|---|---|---|
| `scripts/` | the 8 pipeline scripts | yes, but this is the only copy |
| `plan/WolfandWordProductionScript_v1.json` | the 365-day reading plan | **no** — hand-corrected |
| `announcements/` | 365 Bella day announcements | **no** — paid ElevenLabs generations |
| `boards/` | 12 contents + 12 credits boards as shipped | yes, from the scripts |
| `chapters/` | 12 YouTube timestamp files | yes, from the scripts |
| `thumbs/` | day-board thumbnails | yes |

`boards/` is kept as a **record of what actually shipped**, not as a source.
The generator has changed once already (the column split moved from per-book to
balanced), so a regenerated board is not guaranteed to match the uploaded video.

## What is NOT here, and why

| tree | size | to rebuild |
|---|---|---|
| `output/kjv/readalong-carded/` | 118 GB | GPU render per chapter — **rented compute**, keep it |
| `biay-days/day*.mp4` | 117 GB | ~6 s each from the readalongs, `render_full_day.py` |
| `biay-days/<month>.mp4` | 117 GB | one stream-copy concat, `build_month.py` |

The readalongs are the expensive tier. Everything below them is cheap.

## Rebuilding

Dependencies that must exist:

    ~/wolf-and-word/output/kjv/readalong-carded/<book>-NN-readalong.mp4
    ~/audio/day<NNN>_bella_announcement.mp3          (copy back from announcements/)
    ~/wolf-and-word/output/kjv/assets/boards/{translation,zoom}.mp4
    ~/wolf-and-word/assets/cues/{orientation,prayer}_cue.mp3
    ~/wolf-and-word/assets/fonts/wolf-fonts.css      (vendored, no network)

Then one command per month:

    python3 build_month.py --month 3 --dry-run   # preflight only
    python3 build_month.py --month 3             # full build, 9 gates

It renders the days, proves each against the plan, builds the intro and outro,
verifies the drain bar and the codec signature, stitches by stream copy, writes
the timestamps, and confirms every one lands on its own day board. Any gate that
fails stops the build before anything downstream is built on it.

## The shape of a month

    translation (5.5s) -> contents (12s) -> zoom (5.7s)
      -> N day videos
      -> Complete/<Month>, fading to paper (8s)

Each day is: day board with Bella -> prayer -> every chapter in full ->
2 s white hold -> prayer.

Rules encoded in the scripts, each learned the hard way:

- every board that HOLDS gets an audio cue and a visual timer
- exempt: the reading, the chapter card, the day announcement — they speak
- the board timer **drains**; the year bar **fills**. Same stripe, opposite
  directions, so one stripe never means two things
- `drawbox` evaluates its width ONCE. A time expression there exits 0 and never
  animates. Use `overlay`, which evaluates per frame
- boards are encoded to the readalongs' exact codec params so concat is `-c copy`
