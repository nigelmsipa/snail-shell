# Bible in a Year — the translation runbook

How to produce twelve month videos for ONE translation. Written to be followed
cold, by someone with no memory of the session that produced the KJV, because
that is exactly what will happen for Geneva, Matthew's, Webster's, Young's
Literal, Smith's Literal, the ERV, the ASV, and the rest.

Read the whole of Part 0 before running anything. It is the part that has
actually cost time.

---

## PART 0 — What goes wrong, and why the gates exist

Each of these shipped or nearly shipped. None was caught by looking at a log.

### 0.1 The right length, the wrong Bible
`engine/translation_env.sh` says it plainly: forget `TRANSLATION_LABEL` and all
1,189 chapters say KING JAMES VERSION while every duration check passes, because
the video is the right *length*, just the wrong *Bible*.

**Nothing about duration, codec, or file size can catch this.** The only defence
is to read the translation name off a rendered board and compare it to the slug
you asked for. That is gate 10.

### 0.2 A command that succeeds while doing nothing
`drawbox` evaluates its `w`/`h` expressions **once**, at filter init. A time
expression in `drawbox=w='iw*(1-t/12)'` is accepted, exits 0, logs nothing, and
never animates. The bar sat permanently full and every other check passed.

Use `overlay`, which evaluates `x` per frame. Slide a gold plate off to the left
over a static hair-coloured rule: visible gold = `iw * (1 - t/secs)`.

**General rule: exit code 0 is not evidence. Measure the pixels.**

### 0.3 The exit code you are reading is the wrapper's
`nohup ... &` followed by anything else returns the *wrapper's* status, not the
job's. A "completed, exit 0" notification arrived while the upload was one third
done. Verify against the destination, never against the return value.

### 0.4 Quotation marks that appear on three frames out of 780
A shell-quoting bug in a refill path put apostrophes into a label on exactly the
frames that got re-rendered after a dropped frame. Frame count, duplicate
detection, rule monotonicity, hero width and background level all passed, because
none of them looked at the label.

`verify_clip.py` exists for this: it measures EVERY text band on EVERY frame and
fails if any band's width deviates from its median by more than 8px. Run it on a
board clip whenever the text pipeline changes.

### 0.5 Boards that drift from what shipped
The contents-board column rule changed once (per-book → balanced). January's
uploaded video has an 18/13 split; regenerating its board today gives 16/15.
**A regenerated board is not proof of what shipped.** `production/boards/` is
kept as a record, not as a source.

### 0.6 A whole month rendered against a stale intermediate
`render_full_day.py` skips any `day<NNN>.mp4` that already exists. That is what
makes re-stitching cheap, and it is also how a day rendered from an older board
survives into a new build. If the design changed, delete the affected day files
first — do not rely on the skip.

### 0.7 Attribution guessed from a template
`gen_book_boards.py` hardcodes `Narration · David · openbible.com`. MSB is
human-narrated, so all 65 MSB book outros carry the KJV's narrator.
**Never infer a narrator from a template.** Every translation needs its
narration credit stated by a human before its outro is rendered.

### 0.8 xargs -P will take the machine down
`xargs -P 10` on Chromium drove load to 40 on 32 threads, 2,285 processes, and
`uptime` itself timed out. Cap parallel Chromium at 4.

### 0.9 The caret reads as "behind" — and it is NOT an alignment problem
Nigel, 2026-09-04, on MSB January: *"it speaks before it highlights... the cursor
has to be word precise. I feel like it's a little bit behind."* He assumed a fix
applied to the KJV had failed to propagate to the MSB.

**Measured: it propagated.** `egor.py --report` over genesis-01, genesis-04,
exodus-20 and john-03 in BOTH corpora returns `snapped=0` every time. Aligned
word onsets already sit where the audio energy actually begins. The two corpora
are in identical condition.

So the residual lag is in the CARET MODEL, not the data — and it is therefore
equally present in the twelve uploaded KJV videos. `repair_onsets.py` states the
mechanism: monkeypace "sweeps the caret across the active word over that word's
own spoken duration", so the emphasis reaches the middle of a word about halfway
through hearing it. On short function words that is imperceptible; on long words
after a pause it reads as lag.

**Do not "fix" this by re-running alignment or EGOR — there is nothing there to
find.** If it is ever addressed it is a change to the sweep: give the caret a
lead, or light the word at onset and let the sweep trail inside it. That is a
design decision about the reading experience, and it would change every
translation at once, so it belongs to Nigel and to a deliberate re-render, not
to a bugfix during a build.

Two related fixes DO belong in the pipeline, both before rendering:
- `repair_onsets.py <slug> --apply` — first words that swallowed the chapter
  announcement (one KJV chapter in seven; 56 MSB chapters)
- `egor.py in.json audio.opus out.json` — early highlights on function words


### 0.10 Three colour paths hardcoded to the KJV, found three different ways
Switching to the MSB exposed three constants holding KJV values in files with no
translation in their names:

| what | where | found by |
|---|---|---|
| prayer boards | `render_full_day.py` -> `biay-samples/prayer_T6_*.mp4` | a gate written for it |
| intro/credits drain bar | `render_biay_intro.py` -> `GOLD = "B3944D"` | **Nigel, by eye** |
| the gate's own accent | `build_month.py` -> `GOLD = [179,148,77]` | only because fixing the bar would have broken the gate |

The third is the instructive one: **the check and the bug shared the same wrong
assumption.** Gate 5 counted KJV-gold pixels to decide the bar was fine, so a
gold bar on the MSB PASSED and a correct violet one would have FAILED.

A test that hardcodes the same constant as the code it tests is not a test.
Everything colour-related now resolves through `biay_translation.py`.

---

# PART 0.5 — DECIDE BEFORE YOU RENDER

Read this section before the FIRST chapter of a new translation is rendered.
Everything in it is baked into frames. Once a corpus is rendered and uploaded it
is not patchable — that is the deal an artifact makes with you.

> *"That's the one thing about an artifact: you have to get it right the first
> time. And if you don't get it right, you have to live with it."*
> — Nigel, 2026-09-04, after shipping twelve KJV months

## 0.5.1 THE CARET RULE — a requirement, not a preference

> **"There's no decision to settle. The decision is: the word that is spoken is
> what should be highlighted."** — Nigel, 2026-09-04

This is not a taste setting to A/B. It is the read-along's defining promise. If
the marker is not on the word you are hearing, the thing has failed at the one
job it exists to do. Treat any violation as a bug, not a trade-off.

### Where it currently stands
Two markers move. Only one breaks the rule.

**Word ignition — COMPLIES.** `build_genesis.py`:

    # Advance the highlight at the next word's true onset minus this lead
    # — never at the gap midpoint. Locked 2026-07-06 (the "and lights up early" fix).
    LEAD_MS = 50

Words light 50 ms before they are spoken. Correct, and confirmed intact:
`egor.py --report` returns `snapped=0` across four chapters in BOTH the KJV and
MSB corpora. The alignment is not the problem and there is nothing to re-run.

**The gold caret — VIOLATES.**

    PACE_SMOOTH = float(os.environ.get("PACE_SMOOTH", "120"))
    # The filter lags the target slightly and catches up.

A 120 ms low-pass filter on caret POSITION. At ~141 wpm a word averages ~425 ms,
so 120 ms of lag is roughly a quarter to a third of a word — and after a pause,
or across short function words, it puts the caret behind the word being spoken.
That is the rule broken.

### The fix is NOT to disable smoothing
`PACE_SMOOTH=0` would satisfy the caret rule and break the other standing rule —
**"caret flows, never dashes"**: a fresh motion onset every word grabs attention
involuntarily, which is the entire reason monkeypace replaced monkeytype. Both
rules hold at once. Neither is negotiable.

### The fix is to CLAMP the smoothed position to the active word
Let the low-pass filter do its job — it exists to kill the velocity spikes that
read as "too fast" — but bound its output so it can never leave the span of the
word currently being spoken:

    target   = word-locked caret position
    smoothed = low_pass(target, PACE_SMOOTH)
    caret    = clamp(smoothed, active_word.x_start, active_word.x_end)

Inside a word the filter is free and the motion stays smooth. At a word boundary
the clamp pulls the caret forward so it cannot sit on the previous word while a
new one is being spoken. Flow is preserved; the promise is kept.

**Unimplemented as of 2026-09-04.** It must land before the first chapter of the
next corpus is rendered — Nigel's order is Matthew's Bible BEFORE Geneva. The
KJV and MSB shipped without it and cannot be patched: 96 hours of rendered video
and an upload in progress. See `Thinking/2026-09-04-the-artifact-has-no-patch-tuesday.md`.

**Verification, once implemented:** for every word, sample the caret's x at that
word's onset+10 ms and at its end-10 ms, and assert both fall inside that word's
glyph span. That is a deterministic check over the scene JSON — it needs no
rendering and no eyes, and it should become a gate.

## 0.5.2 The other before-you-render decisions
- **narration credit** — stated in `engine/translations/<slug>.json`, never
  inherited from a template (0.7)
- **accent + ink** — accent by publication year; ink = the accent's complement
  per THE INK RULE in `color-constitution.md`. Geneva `#B37D56`/`#213544`,
  Webster `#95A653`/`#352B5A`, ASV `#4F9270`/`#4E253A` are already derived.
- **`board_seconds.translation`** — the KJV poster is 5.5 s, the MSB's is 2.75 s
  ("come out swinging"). Decide per translation; the builder reads the clip's
  own duration off disk.
- **`repair_onsets.py <slug> --apply`** — MUST run before rendering
- **CRF stays 18. SETTLED 2026-09-04, do not reopen.** Measured on a real
  chapter: CRF 22 saves 41% of the file but puts ELEVEN TIMES more error onto
  the ink (7,930 pixels >8 off vs 741 at CRF 18), and YouTube re-encodes on top
  of that. The files are large because a month is eight hours, not because the
  bitrate is high — 10.1 GB over 8h12m is only 2.9 Mbps, well under YouTube's
  recommended 12 Mbps for 1080p60. Text on paper is the worst case for
  compression artifacts. Nothing is gained by turning this dial.

## PART 1 — Prerequisites for a new translation

Nothing below is optional. If any is missing, stop and get it; do not improvise.

| thing | where | how to check |
|---|---|---|
| translation data file | `engine/translations/<slug>.json` | must have `palette` with all 8 keys, `paths.audio`, `name`, `slug` |
| carded readalongs | `output/<slug>/readalong-carded/<book>-NN-readalong.mp4` | must be 1189 |
| translation + zoom boards | `output/<slug>/assets/boards/{translation,zoom}.mp4` | both exist |
| day announcements | `~/audio/day<NNN>_bella_announcement.mp3` | **365, and SHARED** |
| cues | `assets/cues/{orientation,prayer}_cue.mp3` | shared |
| fonts | `assets/fonts/wolf-fonts.css` | vendored, no network |
| **narration credit** | **nowhere — ask Nigel** | see 0.7 |

### The announcements are translation-agnostic. This is the big saving.
Bella says `"January 1. Today's reading is Genesis, chapters 1 to 3."` — she
never names a translation. Verified: **0 of 365** day scripts mention the KJV.
So a new translation costs **no ElevenLabs spend**. Copy the same 365 files.

### board_seconds is per translation and is NOT a constant
`<slug>.json` carries `board_seconds`. MSB's translation poster is **2.75s**,
half the KJV's 5.5s — Nigel's decision, "I need to come out swinging": the
poster is front matter, and someone who cares will pause.

The intro builder reads each clip's **own duration off disk**, so it honours
this automatically. Do not hardcode 5.5.

---

## PART 2 — The build

    python3 build_month.py --month 3 --dry-run    # preflight only, builds nothing
    python3 build_month.py --month 3              # full build

One month at a time. Every gate must pass before the next stage runs; a failure
stops the build rather than letting anything downstream be built on it.

| # | gate | what it actually proves |
|---|---|---|
| 1 | sources present | every Bella file and every readalong exists BEFORE a 3-minute render starts |
| 2 | day videos present | the render produced what it claimed |
| 3 | `check_days --deep` | per day: duration vs plan, 1920x1080 h264 60fps, 48kHz mono, both prayer beats present as navy stretches |
| 4 | intro + outro built | both exist, with their real durations |
| 5 | drain bar resets per board | the timer ANIMATES — see 0.2 |
| 6 | one codec signature | all segments identical, so concat is a true stream copy |
| 7 | duration == sum of parts | within 1s; catches a silently dropped segment |
| 8 | every timestamp lands on a day board | seeks to each mark +3s and checks for white paper with a top rule |
| 9 | intro + credits boards in output | the four boards are IN THE FINISHED FILE, not just on disk |
| 10 | **translation label** | the boards name the translation you asked for — see 0.1 |

### Order of operations for a full translation

1. `--dry-run` month 1. Fix any missing source before going further.
2. Build month 1 only.
3. **Stop. Nigel looks at it personally.** Colours, boards, no stray quotation
   marks. This is not optional and does not scale away — a new translation is a
   new palette and new boards.
4. Only then build months 2–12, one at a time.
5. Nigel uploads to YouTube AND Odysee. Two platforms, because Drive shares a
   failure domain with YouTube.
6. **Only after he confirms both uploads** may the heavy outputs be deleted.
   This gate is his. It cannot be automated: nothing on this machine can see
   whether an upload finished.

---

## PART 3 — What may be deleted, and what may never be

Three tiers. Know which one you are touching.

| tier | what | cost to rebuild |
|---|---|---|
| **cheap** | `biay-*/day<NNN>.mp4` (~117 GB) | ~6 s each from the readalongs |
| **cheap** | `biay-*/<month>.mp4` (~117 GB) | one stream-copy concat, seconds |
| **EXPENSIVE — keep** | `output/<slug>/readalong-carded/` (~118 GB) | GPU render per chapter — **rented compute** |
| **IRREPLACEABLE — never** | the 365 Bella announcements (33 MB) | re-purchase from ElevenLabs |
| **IRREPLACEABLE — never** | `WolfandWordProductionScript_v1.json` | hand-corrected; six readings were mislabeled and fixed by hand |

The day and month videos are **cache**. The readalongs are **rented**. The
announcements and the plan are **bought or made once**.

---

## PART 4 — Backup, before deleting anything

| destination | holds | independent of |
|---|---|---|
| YouTube + Odysee | the 12 finished videos | each other |
| GitHub `wolf-and-word` | scripts, plan, announcements, shipped boards, timestamps | Google, HF |
| HF `Finitude1/wolf-and-word-assets` (private) | the same, plus every board/card/thumbnail | Google, GitHub |
| HF `Finitude1/snail-bibles` (private) | per-chapter opus + alignments, 12 translations | — |

Google Drive is **not** a backup for a YouTube video: same account, same failure.

Keep the HF datasets **private** until narration rights are reviewed. Public
domain text does not make every narration redistributable.

---

## PART 5 — The shape being produced

    translation -> contents -> zoom -> N day videos -> Complete/<Month> (fades to paper)

Each day: day board (Bella) -> prayer -> every chapter in full -> 2 s white hold -> prayer.

### Design rules, and the reasons they exist

- **Every board that HOLDS gets an audio cue and a visual timer.**
  Exempt: the reading, the chapter card, the day announcement — those three
  speak for themselves, and a chime over them talks across the voice.
- **The timer DRAINS; the year bar FILLS.** Same 16px gold rule, opposite
  directions, so one stripe never carries two meanings.
- **Cues are one family, two members.** `orientation` 528+792 Hz, `prayer`
  396+528 Hz. Shared 528 root. Masters peak at −24 dB against narration at
  −0.5 dB, so they are lifted +16 dB at render time (`CUE_GAIN_DB`).
- **Every contents row names its own book.** A row lifted out of the list must
  still say what it is; that is the whole point of a board people scrub against.
- **Columns are balanced, not per-book.** February is Exodus 1 / Leviticus 13 /
  Numbers 14 — a column per book would strand a single orphan row.
- **Book names grey, numerals gold — for EVERY book in a row.** Six days a year
  read two or three books, and `1 John` has a digit that belongs to the name.
- **No "Next up" on a month outro.** The book series can promise the next book
  because it is already rendered. February is not.
- **The credits board fades rather than cuts.** The fade is how the board leaves,
  not a reason to skip having one: borrowed narration needs somewhere to be
  credited, and YouTube end screens need a settled tail.
- **The 2 s hold before the closing prayer is an EMPTY page**, not a frozen
  reading frame. The readalong never stops scrolling, so freezing its last frame
  stalls a moving thing and reads as a glitch.
- **Boards match the readalongs' exact codec params** — h264 High, yuv420p,
  1920x1080, 60fps, aac 48kHz mono — so concat is `-c copy` and the approved
  frames are never re-encoded.
