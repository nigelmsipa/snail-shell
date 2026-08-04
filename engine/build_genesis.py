import os
import json
import math
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

# Chapter selection (env-driven for batch rendering)
BOOK = os.environ.get("BOOK", "genesis")
CHAPTER = os.environ.get("CHAPTER", "01").zfill(2)

# Leading aligned words to skip. The openbible voice starts directly at
# scripture, so 0. (The old Davis voice spoke a 3-word chapter preamble —
# the hardcoded skip it left behind was silently dropping "In the beginning"
# from Genesis 1:1. Set SKIP_WORDS=3 only for preamble voices.)
SKIP_WORDS = int(os.environ.get("SKIP_WORDS", "0"))

# Paths
ALIGNED = f"/home/nigel/openbible-kjv/{BOOK}-{CHAPTER}-aligned.json"
UNITS_JSON = f"/home/nigel/kjv-render/{BOOK}-{CHAPTER}-units.json"
VERSEMAP = f"/home/nigel/openbible-kjv/{BOOK}-{CHAPTER}.versemap.json"
AUDIO = f"/home/nigel/openbible-kjv/{BOOK}-{CHAPTER}.opus"
OUTPUT_DIR = Path(os.environ.get("OUTPUT_DIR", "/home/nigel/wolf-and-word/output/kjv/genesis_output"))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Output resolution: RES=1080 (default) or RES=2160 (4K). All layout values
# below are authored in 1080p units and scaled by U — the design spec's own
# "×2 for the 4K render" rule.
RES = os.environ.get("RES", "1080")
U = 2 if RES == "2160" else 1

W, H = 1920 * U, 1080 * U
# 30fps sits between the jerky (17 Hz) and smooth (33 Hz) motion conditions in
# the attention-capture work; FPS=60 puts the caret unambiguously in the
# no-capture regime. Encode time is the only cost.
FPS = int(os.environ.get("FPS", "30"))
MARGIN_X = 384 * U  # (1920 - 1152)/2 — 1152px column = ~52 CPL (kinetic-typography master spec)
LH = 90 * U  # 1.5 line-height on 60px body — saccadic landing zones for moving text

# Colors
def _hx(s): s = s.lstrip("#"); return tuple(int(s[i:i+2], 16) for i in (0, 2, 4))
def _env_rgb(name, default): return _hx(os.environ[name]) if os.environ.get(name) else default
BG = _env_rgb("BG_HEX", (255, 255, 255))  # pure white — override e.g. BG_HEX=518B0E
INK = _env_rgb("INK_HEX", (38, 50, 79))   # lit text (monkeytype: read+active)
READ = (163, 155, 139)
META = (154, 147, 136)
FADE = (248, 244, 232)
ACCENT = _env_rgb("ACCENT_HEX", (196, 164, 100))  # caret + verse numbers
HL = (244, 217, 153)
HLTEXT = (38, 50, 79)  # = ink, per color-constitution.md ("hltext = ink, consistent everywhere")
MUTED_ACCENT = (180, 150, 90)

# Fonts
FONT_SERIF = "/home/nigel/.local/share/fonts/source-serif-4/SourceSerif4Display-Regular.otf"  # opsz=60 Display cut per master spec
FONT_SERIF_IT = "/usr/share/fonts/TTF/adobe/SourceSerifPro-It.ttf"
FONT_SANS = "/usr/share/fonts/TTF/IBMPlexSans-SemiBold.ttf"
FONT_SANS_REG = "/usr/share/fonts/TTF/IBMPlexSans-Regular.ttf"
FONT_SANS_SEMI = "/usr/share/fonts/TTF/IBMPlexSans-SemiBold.ttf"
FONT_SERIF_ITALIC = "/home/nigel/.local/share/fonts/source-serif-4/SourceSerif4Display-It.otf"

# Scaled based on CSS ratios relative to 60px body font
SANS_MARK = ImageFont.truetype(FONT_SANS, 28 * U)
SANS_SUB = ImageFont.truetype(FONT_SANS_REG, 16 * U)
BODY_PT = 60 * U  # 16-20 arcmin x-height on a phone at 12-15in — the master spec's anchor value
SERIF_BODY = ImageFont.truetype(FONT_SERIF, BODY_PT)
SANS_VN = ImageFont.truetype(FONT_SANS, 22 * U)  # .36em of 60px body
SANS_BRAND = ImageFont.truetype(FONT_SANS, 20 * U)

# MARKER_STYLE — the story/scene hierarchy treatment.
#   current  the shipped pair: serif-roman story over SEMIBOLD letterspaced CAPS sans scene.
#            Differentiated on FOUR axes at once (typeface, case, size, letterspacing) and
#            the colors are near-identical, so color does no work. Net effect is a HIERARCHY
#            INVERSION: the scene is the lower tier but semibold+caps+tracking gives it more
#            presence than the light serif story above it.
#   weight   one-variable fix — scene drops to sans REGULAR so it stops out-shouting its parent.
#   unified  both tiers in the serif, differing on size + color only (4 axes -> 2).
#   air      styling untouched; PROXIMITY does the work. Space moves from below each marker to
#            above it, binding the title to the text it introduces. Row totals are unchanged so
#            the scroll track is identical and only the grouping differs.
MARKER_STYLE = os.environ.get("MARKER_STYLE", "current")
# MARKER_AIR is independent of the styling so the two fixes compose (e.g. weight + air).
MARKER_AIR = os.environ.get("MARKER_AIR", "1" if MARKER_STYLE == "air" else "0") == "1"
SCENE_UPPER = MARKER_STYLE != "unified"
if MARKER_STYLE == "weight":
    _scene_face, _scene_pt, _scene_ls = FONT_SANS_REG, 27, 5.5
elif MARKER_STYLE == "unified":
    _scene_face, _scene_pt, _scene_ls = FONT_SERIF, 28, 0.0
else:
    _scene_face, _scene_pt, _scene_ls = FONT_SANS_SEMI, 27, 5.5
SCENE_MARKER_FONT = ImageFont.truetype(_scene_face, _scene_pt * U)
STORY_MARKER_FONT = ImageFont.truetype(FONT_SERIF, 40 * U)  # serif ROMAN — bookish tier above the sans scenes (italic rejected 2026-07-16)
SCENE_COLOR = (183, 173, 156)  # #b7ad9c
STORY_COLOR = (167, 156, 138)  # #a79c8a
HAIRLINE_COLOR = (201, 195, 183) # #c9c3b7

# "pagehold": frozen page + one slide per ~7 lines (approved version, frozen
#             copy in build_genesis_pagehold.py).
# "gauss":    per-line glide, erf-eased, fully still in pauses (stop-start).
# "drift":    TELEPROMPTER — never stops; glides continuously at the
#             narration's pace between line onsets. The alive one.
# gauss/drift need SS=2 supersampling or small type shimmers in slow motion.
SCROLL_MODE = os.environ.get("SCROLL_MODE", "gauss")  # V1 SHIPPING DEFAULT 2026-07-23 (was drift)

# "word": per-word highlight — a crisp beat on each word as it's spoken
#         (stresses the word; matches the memorization grammar).
# "wash": traveling wash — one band gliding between words (tested 2026-07-16,
#         kept for comparison; smears word boundaries in fast passages).
HIGHLIGHT = os.environ.get("HIGHLIGHT", "word")

# HL_DOTS: micro-halftone INSIDE the highlighter band only (the Sailfish
# cover tooth, applied to the one surface that's ours) — scripture untouched.
# The lattice is PHASE-LOCKED TO THE PAGE, not the box: the highlighter is a
# window revealing the paper's tooth, so the pattern never strobes between
# words — each word sits over the same fixed field. Default ON (2026-07-16).
HL_DOTS = os.environ.get("HL_DOTS", "1") == "1"
HL_DOT = (226, 199, 135)  # the wash's own shadow tone, ~18 levels under HL
# HL_PATTERN: the texture inside the band — all page-locked & pixel-snapped:
#   dots    45° half-dot lattice (the Sailfish tooth)
#   laid    horizontal laid-paper lines
#   stripes 45° pinstripes
#   cross   crosshatch (both diagonals)
#   stipple hashed blue-noise-ish speckle (organic paper grain)
HL_PATTERN = os.environ.get("HL_PATTERN", "dots")

# MONKEYTYPE MODE (HL_STYLE=monkeytype): inverts the reading model. The page
# sits DIM; each word ignites to full ink as a smooth gold caret glides past
# it — the page fills in as it's read (vs. receding behind). Word-precise.
# V1 SHIPPING DEFAULT 2026-07-23: monkeypace. Set HL_STYLE explicitly for the others.
HL_STYLE = os.environ.get("HL_STYLE", "monkeypace")
MT = HL_STYLE in ("monkeytype", "monkeyband", "monkeypace")
MT_BAND = HL_STYLE == "monkeyband"  # monkeytype fill + the band marker
DIM = _env_rgb("DIM_HEX", (206, 202, 193))  # "untyped" — soft, above the recede

# MONKEYPACE (HL_STYLE=monkeypace): monkeytype's ignition, but the caret never
# rests. Plain monkeytype holds the caret still through a word then DASHES
# 160ms to the next one — which is a fresh motion ONSET every word, and motion
# onset captures attention involuntarily precisely when the motion that follows
# is jerky rather than smooth (Psychon. Bull. Rev. 2011: capture at 8/17 Hz,
# none at 33/100 Hz). That per-word grab is the "trick" feeling. Monkeypace
# instead sweeps the caret ACROSS each word over that word's own spoken
# duration and across the gap during the silence: no onsets left to grab with,
# and the marker becomes a reading pacer — a moving anchor the eye chooses to
# follow. Travel works out to ~2-3 deg/s, far inside the 20-30 deg/s band where
# smooth pursuit is comfortable.
MT_PACE = HL_STYLE == "monkeypace"
# Caret width: 3px of saturated gold is inside the zone 4:2:0 chroma
# subsampling smears (see the kinetic-typography master spec) — 4 gives the
# luma edge something to survive YouTube's encode with.
CARET_W = float(os.environ.get("CARET_W", "4"))
CARET_A = int(os.environ.get("CARET_A", "255"))  # <255 = a veil passing over glyphs, not a slash through them
# linear = constant speed, metronomic, never at rest (the true pacer).
# smooth = eases to a stop at each word edge — prosodic undulation, but it
# reintroduces a soft start/stop per word.
PACE_EASE = os.environ.get("PACE_EASE", "linear")
# PACE_SMOOTH: time constant in ms for a low-pass follow on the caret position.
# The caret's AVERAGE speed is not a free parameter — it must cross the line in
# the time the narration takes, so distance/time is fixed by the text and the
# audio. What this evens out is the VELOCITY SPIKES: word-locked travel darts
# across short quick words ("the", "and") and crawls across long ones, and that
# unevenness is what reads as "too fast". The filter lags the target slightly
# and catches up, so sync is preserved and self-correcting. 0 = off.
PACE_SMOOTH = float(os.environ.get("PACE_SMOOTH", "120"))  # V1 SHIPPING DEFAULT 2026-07-23
def _pace_ease(p):
    p = max(0.0, min(1.0, p))
    return p * p * (3 - 2 * p) if PACE_EASE == "smooth" else p

# Advance the highlight at the next word's true onset minus this lead — never
# at the gap midpoint. Locked 2026-07-06 (the "and lights up early" fix).
LEAD_MS = 50

# Windowed sample render for fast iteration, e.g.:
#   SCROLL_MODE=pagehold SAMPLE_START=40 SAMPLE_END=65 python3 build_genesis.py
# writes sample_<mode>_ss<SS>.mp4 instead of the full chapter.
SAMPLE_START = float(os.environ.get("SAMPLE_START", "0") or 0)
SAMPLE_END = float(os.environ.get("SAMPLE_END", "0") or 0)

# Supersample factor for the text layer: glyphs are drawn at SS x resolution
# and the layer is LANCZOS-downscaled each frame, giving half-pixel placement
# with uniform softness (a raw 1x rasterization snaps letters to whole pixels,
# which makes small titles shimmer whenever the page moves slowly).
SS = int(os.environ.get("SS", "2"))  # supersample; higher = finer sub-pixel VERTICAL grid (1/SS px) → less scroll snap
SERIF_BODY_SS = ImageFont.truetype(FONT_SERIF, BODY_PT * SS)
SANS_VN_SS = ImageFont.truetype(FONT_SANS, 22 * U * SS)
SCENE_MARKER_FONT_SS = ImageFont.truetype(_scene_face, _scene_pt * U * SS)
STORY_MARKER_FONT_SS = ImageFont.truetype(FONT_SERIF, 40 * U * SS)

def layout_chapter(words, word_to_verse, word_to_unit_idx, units):
    img = Image.new("RGB", (10, 10))
    draw = ImageDraw.Draw(img)
    space_w = draw.textlength(" ", font=SERIF_BODY)
    
    max_w = W - MARGIN_X * 2
    
    rows = []
    word_to_row = {}
    word_pos = {}  # ref -> (row_idx, x0, x1) for the traveling wash

    current_verse = None
    current_line_items = []
    cur_w = 0
    
    last_unit_idx = -1
    last_story_letter = None

    
    def flush_line():
        nonlocal current_line_items, cur_w
        if current_line_items:
            rows.append({
                'type': 'text',
                'height': LH,
                'items': current_line_items
            })
            current_line_items = []
            cur_w = 0

    for i in range(SKIP_WORDS, len(words)):
        v = word_to_verse.get(i, -1)
        u_idx = word_to_unit_idx.get(i, 0)
        unit = units[u_idx]
        
        if u_idx != last_unit_idx:
            flush_line()
            
            if last_story_letter is None or unit['story_letter'] != last_story_letter:
                rows.append({
                    'type': 'story',
                    'height': (56 + 2 + 24 + 40 + 44) * U,  # tightened 2026-07-16 — old air was half the grotesque
                    'text': unit['story_title']
                })
                last_story_letter = unit['story_letter']

            rows.append({
                'type': 'scene',
                'height': (52 + 27 + 40) * U,
                'text': unit['title'].upper() if SCENE_UPPER else unit['title']
            })
            last_unit_idx = u_idx

        items_to_add = []
        if v != current_verse and v > 0:
            vn_text = str(v)
            vn_w = draw.textlength(vn_text, font=SANS_VN) + BODY_PT * 0.06  # tightened from 0.12em — the sup must cling to its verse (2026-07-16)
            items_to_add.append(('vn', vn_text, vn_w, v))
            current_verse = v
            
        word_text = words[i]['t']
        w_w = draw.textlength(word_text, font=SERIF_BODY)
        items_to_add.append(('word', word_text, w_w, i))
        
        for item in items_to_add:
            itype, itext, iw, ref = item
            if cur_w + iw > max_w and current_line_items:
                flush_line()
            current_line_items.append(item)
            if itype == 'word':
                word_to_row[ref] = len(rows)
                word_pos[ref] = (len(rows), MARGIN_X + cur_w, MARGIN_X + cur_w + iw)
            cur_w += iw if itype == 'vn' else iw + space_w

    flush_line()
    
    cy = 0
    for r in rows:
        r['y'] = cy
        cy += r['height']
        
    return rows, word_to_row, space_w, word_pos

def compute_scroll_track(words, rows, word_to_row, total_frames):
    if SCROLL_MODE == "pagehold":
        return compute_scroll_track_pagehold(words, rows, word_to_row, total_frames)
    if SCROLL_MODE == "flow":
        return compute_scroll_track_flow(words, rows, word_to_row, total_frames)
    if SCROLL_MODE == "glide":
        return compute_scroll_track_glide(words, rows, word_to_row, total_frames)
    if SCROLL_MODE == "drift":
        return compute_scroll_track_drift(words, rows, word_to_row, total_frames)
    if SCROLL_MODE == "chase":
        return compute_scroll_track_chase(words, rows, word_to_row, total_frames)
    return compute_scroll_track_gauss(words, rows, word_to_row, total_frames)

def compute_scroll_track_flow(words, rows, word_to_row, total_frames):
    """VELOCITY-EASED FOLLOWER — the reader-app model, ported frame-for-frame.

    Every prior scroll here low-passed a POSITION curve; that never fixed the
    per-line velocity surge that reads as a 'jump'. This instead low-passes
    VELOCITY, exactly like the caret's PACE_SMOOTH and the browser teleprompter
    that finally felt fluid: each frame, the scroll velocity eases toward a
    target and position steps by velocity*dt. Because velocity itself can only
    change gradually, there is no surge to perceive — the page is one continuous
    river whose speed drifts, never snaps.

      target velocity = feedforward (how fast the ideal position is moving)
                        + a gentle pull that closes any accumulated lag
      velocity       += (target - velocity) * alpha     # framerate-independent
      position       += velocity * dt

    The ideal position is the onset-anchored track (active line at its rest
    height). Feedforward keeps pace with the narration; the correction term
    keeps it synced; the velocity low-pass is what removes the jerk. No 0.5px
    write-guard here — that was a DOM/scrollTop artifact; the renderer draws at
    sub-pixel with supersampling, so guarding would REintroduce micro-stepping.
    """
    row_first_time = {}
    for i in range(SKIP_WORDS, len(words)):
        r = word_to_row.get(i)
        if r is not None and r not in row_first_time:
            row_first_time[r] = float(words[i]['s'])
    order = sorted(row_first_time)
    times = np.array([row_first_time[r] for r in order], dtype=float)  # ms
    ys = np.array([float(rows[r]['y']) for r in order], dtype=float)   # px

    t_frames = np.arange(total_frames) / FPS * 1000.0 + 180.0          # ms
    ideal = np.interp(t_frames, times, ys)                             # px

    dt = 1.0 / FPS                                                     # s
    # Critically-damped follower (Unity SmoothDamp): tracks the moving target
    # with NO overshoot/ring — a ring would read as a bounce-back 'jump'. One
    # knob, FLOW_SMOOTH_MS: the time it aims to reach the target. Larger =
    # smoother + laggier. Framerate-independent by construction.
    smooth_t = max(0.05, float(os.environ.get("FLOW_SMOOTH_MS", "1200")) / 1000.0)
    omega = 2.0 / smooth_t

    track = np.empty(total_frames)
    pos = float(ideal[0])
    vel = 0.0
    for i in range(total_frames):
        t = ideal[i]
        x = omega * dt
        ex = 1.0 / (1.0 + x + 0.48 * x * x + 0.235 * x * x * x)
        change = pos - t
        temp = (vel + omega * change) * dt
        vel = (vel - omega * temp) * ex
        pos = t + (change + temp) * ex
        track[i] = pos
    return track

def compute_scroll_track_glide(words, rows, word_to_row, total_frames):
    """CONSTANT-VELOCITY glide — the mathematically smoothest possible scroll.
    Zero acceleration anywhere: the page moves as one continuous river from the
    first line's onset to the last line's onset at a single fixed speed. There
    are NO per-line velocity surges to read as jerks, because there are no
    velocity changes at all. Word-level sync is carried entirely by the caret;
    the page just flows. Local excursion (the active line drifting a little from
    its rest height when a passage is read faster/slower than the chapter mean)
    is bounded and self-limited by GLIDE_CORRECT, a gentle low-frequency pull
    back toward the onset-anchored position — enough to keep the line in its
    band, far too slow to reintroduce a jerk."""
    row_first_time = {}
    for i in range(SKIP_WORDS, len(words)):
        r = word_to_row.get(i)
        if r is not None and r not in row_first_time:
            row_first_time[r] = float(words[i]['s'])
    order = sorted(row_first_time)
    t0, t1 = row_first_time[order[0]], row_first_time[order[-1]]
    y0, y1 = float(rows[order[0]]['y']), float(rows[order[-1]]['y'])

    t_frames = np.arange(total_frames) / FPS * 1000.0 + 180.0
    frac = np.clip((t_frames - t0) / max(1.0, (t1 - t0)), 0.0, 1.0)
    linear = y0 + (y1 - y0) * frac

    # Optional gentle correction toward the true onset-anchored track, blended
    # at a very low weight so it can only bend the river, never kink it.
    w = float(os.environ.get("GLIDE_CORRECT", "0.25"))
    if w > 0:
        times = np.array([row_first_time[r] for r in order], dtype=float)
        ys = np.array([float(rows[r]['y']) for r in order], dtype=float)
        anchored = np.interp(t_frames, times, ys)
        sigma = max(1, int(FPS * 2.5))  # smooth the anchor hard before blending
        kern = np.exp(-0.5 * (np.arange(-3 * sigma, 3 * sigma + 1) / sigma) ** 2)
        kern /= kern.sum()
        anchored = np.convolve(np.pad(anchored, 3 * sigma, mode='edge'), kern, mode='valid')
        return (1.0 - w) * linear + w * anchored
    return linear

def compute_scroll_track_chase(words, rows, word_to_row, total_frames):
    """The June renders' motion, recovered by measurement: exponential chase
    of the active row. Velocity peaks right at a line change then decays in a
    long soft tail (~3s) that usually blends into the next line — still only
    ~17% of the time, so it feels alive, reactive to the voice. What 'bounced'
    in the July render was 1x pixel-snapping on the small marker type, not
    this curve; SS=2 fixed that. ALPHA is per-frame at 30fps."""
    ALPHA = 0.05
    row_first_time = {}
    for i in range(SKIP_WORDS, len(words)):
        r = word_to_row.get(i)
        if r is not None and r not in row_first_time:
            row_first_time[r] = float(words[i]['s'])
    order = sorted(row_first_time)
    times = [row_first_time[r] for r in order]
    ys = [float(rows[r]['y']) for r in order]

    track = np.zeros(total_frames)
    cur = ys[0]
    j = 0
    for f in range(total_frames):
        t_ms = f / FPS * 1000.0 + 180.0
        while j + 1 < len(times) and t_ms >= times[j + 1]:
            j += 1
        target = ys[j]
        cur += (target - cur) * ALPHA
        track[f] = cur
    return track

def compute_scroll_track_drift(words, rows, word_to_row, total_frames):
    """Teleprompter scroll: piecewise-linear between each row's first-word
    onset, Gaussian-smoothed. The page never stops — it carries the reader
    at the narration's own pace (~30px/s), speeding gently through marker
    rows and slowing in long pauses, but always alive."""
    row_first_time = {}
    for i in range(SKIP_WORDS, len(words)):
        r = word_to_row.get(i)
        if r is not None and r not in row_first_time:
            row_first_time[r] = float(words[i]['s'])

    times = [row_first_time[r] for r in sorted(row_first_time)]
    ys = [float(rows[r]['y']) for r in sorted(row_first_time)]

    times = np.array(times, dtype=float)
    ys = np.array(ys, dtype=float)

    t_frames = np.arange(total_frames) / FPS * 1000.0 + 180.0
    track = np.interp(t_frames, times, ys)

    # DRIFT_SIGMA_S widens the smoothing: larger = more constant velocity
    # (silkier, ignores per-line cadence), smaller = hugs the narration's pace
    # (speeds through markers, slows in pauses). The page never stops either way.
    sigma = max(1, int(FPS * float(os.environ.get("DRIFT_SIGMA_S", "0.8"))))
    kernel = np.exp(-0.5 * (np.arange(-3 * sigma, 3 * sigma + 1) / sigma) ** 2)
    kernel /= kernel.sum()
    padded = np.pad(track, 3 * sigma, mode='edge')
    return np.convolve(padded, kernel, mode='valid')

def compute_scroll_track_gauss(words, rows, word_to_row, total_frames):
    """Continuous reader scroll (build_genesis_gauss.py lineage): per-row
    staircase convolved with a Gaussian -> sum of Normal CDFs. Motion begins
    ~1.5*sigma before a row change, peaks at the change, decays to zero
    velocity in pauses. Step sizes come from actual row positions so the
    taller scene/story marker rows scroll their full height."""
    # SIGMA_MS widens each row's glide. Small (450) = crisp per-line steps that
    # dead-stop between lines — reads as jerky scrolling under a smooth caret.
    # Large = adjacent line-glides overlap into a continuous creep (approaches
    # drift). The trade is pause-stillness: a very large sigma keeps the page
    # drifting through genuine pauses.
    SIGMA_MS = float(os.environ.get("SCROLL_SIGMA_MS", "450"))
    row_first_time = {}
    for i in range(SKIP_WORDS, len(words)):
        r = word_to_row.get(i)
        if r is not None and r not in row_first_time:
            row_first_time[r] = float(words[i]['s'])

    order = sorted(row_first_time)
    transitions = []  # (t_k_ms, dY)
    prev_y = rows[order[0]]['y']
    for r_idx in order[1:]:
        y = rows[r_idx]['y']
        transitions.append((row_first_time[r_idx], float(y - prev_y)))
        prev_y = y

    t_frames = np.arange(total_frames) / FPS * 1000.0 + 180.0
    track = np.zeros(total_frames)
    for t_k, dY in transitions:
        track += dY * 0.5 * (1.0 + erf_np((t_frames - t_k) / (SIGMA_MS * math.sqrt(2.0))))
    track += rows[order[0]]['y']
    return track

def erf_np(x):
    # Abramowitz & Stegun 7.1.26 vectorized approximation (|err| < 1.5e-7)
    sign = np.sign(x)
    x = np.abs(x)
    t = 1.0 / (1.0 + 0.3275911 * x)
    y = 1.0 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * np.exp(-x * x)
    return sign * y

def compute_scroll_track_pagehold(words, rows, word_to_row, total_frames):
    """PAGE-HOLD scroll. The page stands completely still while it is read —
    like a book page — so inline scene/story titles never move during their
    scene. When the reading line would sink past BOTTOM_GUARD, the view makes
    ONE eased slide (SLIDE_MS, smoothstep) that finishes exactly at that
    line's spoken onset, landing it at TOP_LINE. Any marker rows sitting
    directly above the landing line ride along so a new page opens with its
    section heading. Motion is rare (~every 6-8 lines) and purposeful; every
    prior scheme (EMA chase, constant drift, per-line gauss steps) moved the
    page constantly, which is what made the titles 'bounce'."""
    TOP_LINE = 330 * U          # reading line lands here (top fade ends at 305)
    # BOTTOM_GUARD: how far a line may sink before the page turns. Lower value
    # = page turns sooner = shorter pages, more frequent slides. Higher = fuller
    # pages, rarer slides. SLIDE_MS: duration of the one eased slide; larger =
    # slower, more graceful page turn (the "but smoothly" knob).
    TOP_LINE = int(os.environ.get("PH_TOP_LINE", str(330 * U)))
    BOTTOM_GUARD = H - int(os.environ.get("PH_BOTTOM_MARGIN", str(150 * U)))
    SLIDE_MS = float(os.environ.get("PH_SLIDE_MS", "700"))

    row_first_time = {}
    for i in range(SKIP_WORDS, len(words)):
        r = word_to_row.get(i)
        if r is not None and r not in row_first_time:
            row_first_time[r] = float(words[i]['s'])
    order = sorted(row_first_time)

    syo = H // 2 - LH  # must match start_y_offset in main()

    def anchor_of(r_idx):
        # pull consecutive marker rows above the landing line onto the page
        a = r_idx
        while a > 0 and rows[a - 1]['type'] != 'text':
            a -= 1
        return a

    def scroll_for(r_idx):  # scroll value that puts row r_idx at TOP_LINE
        return rows[anchor_of(r_idx)]['y'] - TOP_LINE + syo

    S0 = scroll_for(order[0])
    transitions = []  # (t_k_ms, dY)
    S = S0
    for r_idx in order:
        r = rows[r_idx]
        screen_bottom = r['y'] + r['height'] - S + syo
        if screen_bottom > BOTTOM_GUARD:
            S_new = scroll_for(r_idx)
            transitions.append((row_first_time[r_idx], float(S_new - S)))
            S = S_new

    # PH_LEAD_MS: land the page-turn this many ms BEFORE the first word's onset,
    # so the eye is settled on the new page before the caret starts moving
    # (deep-research 2026-07-27: complete 100-250ms early, never after onset).
    LEAD_MS = float(os.environ.get("PH_LEAD_MS", "175"))
    t_frames = np.arange(total_frames) / FPS * 1000.0 + 180.0
    track = np.full(total_frames, float(S0))
    for t_k, dY in transitions:
        t_end = t_k - LEAD_MS
        u = np.clip((t_frames - (t_end - SLIDE_MS)) / SLIDE_MS, 0.0, 1.0)
        # smootherstep (quintic) — zero velocity AND zero acceleration at both
        # ends, i.e. lower jerk than cubic smoothstep (research: minimize jerk
        # so the turn stays in the no-capture regime).
        track += dY * u * u * u * (u * (u * 6.0 - 15.0) + 10.0)
    return track

def draw_centered_text(draw, text, font, y_center, color, letter_spacing=0):
    """Centered marker text. `y_center` and `letter_spacing` are 1x layout
    values; drawing happens in SS space with the matching SS font.

    Rows straddling the top cull boundary can land at y_center ~ -52.4999...;
    at certain subpixel offsets PIL computes a zero-size glyph mask and raises
    'bad image size' (killed 3/50 chapters in the first batch). Anything that
    high sits in the alpha-0 fade zone anyway, so skip it — and armor each
    glyph draw so a stray PIL edge case can never kill a chapter render."""
    if y_center < -10 * U:
        return
    ls = letter_spacing * SS
    if letter_spacing > 0:
        total_w = sum(draw.textlength(ch, font=font) for ch in text) + ls * max(0, len(text) - 1)
        cx = (W * SS - total_w) / 2
        for ch in text:
            try:
                draw.text((cx, y_center * SS), ch, font=font, fill=color, anchor="lm")
            except ValueError:
                pass
            cx += draw.textlength(ch, font=font) + ls
    else:
        try:
            draw.text((W * SS / 2, y_center * SS), text, font=font, fill=color, anchor="mm")
        except ValueError:
            pass

def main():
    print("Loading data...")
    with open(ALIGNED) as f:
        aligned = json.load(f)
    with open(UNITS_JSON) as f:
        units = json.load(f)['units']
    with open(VERSEMAP) as f:
        vmap = json.load(f)

    words = aligned['words']
    verses = vmap['verses']
    
    word_to_verse = {}
    v_idx = 0
    for i in range(len(words)):
        if i < SKIP_WORDS:
            word_to_verse[i] = 0
        else:
            if v_idx < len(verses) - 1 and i >= verses[v_idx+1]['word']:
                v_idx += 1
            word_to_verse[i] = verses[v_idx]['n']

    verse_to_unit_idx = {}
    for idx, u in enumerate(units):
        for v in range(u['start_verse'], u['end_verse'] + 1):
            verse_to_unit_idx[v] = idx

    word_to_unit_idx = {}
    for i in range(len(words)):
        v = word_to_verse[i]
        if v == 0:
            word_to_unit_idx[i] = 0
        else:
            word_to_unit_idx[i] = verse_to_unit_idx.get(v, 0)

    rows, word_to_row, space_w, word_pos = layout_chapter(words, word_to_verse, word_to_unit_idx, units)
    
    # SCROLL_ANCHOR_Y: screen height the active reading line rides at. Default
    # H/2 - LH parks it at center (classic drift). A smaller value lifts the
    # line into the upper third so the page always feeds up UNDER a high-resting
    # eye — "alive" motion without letting the line sink into the dead bottom
    # (the "top-to-halfway" idea; teleprompter/sheet-music posture).
    start_y_offset = int(os.environ.get("SCROLL_ANCHOR_Y", str(H // 2 - LH)))
    
    bg_img = Image.new("RGB", (W, H), BG)
    draw_bg = ImageDraw.Draw(bg_img)
    
    # Static top UI. TITLE_CENTER=1 centers the book anchor over the column
    # (the card render's "everything in the middle" posture) instead of the
    # constitution's top-left pin.
    # The anchor opens PROMINENT (ink) so you know the room you walked into,
    # then eases into the recede family after TITLE_FADE_AT seconds — still
    # legible on a glance, no longer fighting scripture for hierarchy.
    header_text = f"{BOOK.upper()} {int(CHAPTER)}"
    brand_text = "W & W"
    brand_w = draw_bg.textlength(brand_text, font=SANS_BRAND)
    _bg_plain = bg_img.copy()

    def _draw_static_ui(im, c_bk, c_ver):
        d = ImageDraw.Draw(im)
        # TOP-LEFT PIN by decree (settled 2026-07-23, and this is the ORIGINAL
        # constitution value — it was briefly amended to centered that day and
        # reverted the same session).
        # The reason, which had never been written down: the centre axis is not
        # spare space, it is the busiest lane on the page — a scene title cycles
        # through it every few verses. The book anchor is the one element that
        # NEVER changes, so parking it in that lane pollutes a working channel
        # for no gain. Off-axis is less "clean" in a still frame and more
        # readable in motion. TITLE_CENTER=1 centers it (the card render's
        # "everything in the middle" posture) if that is ever wanted again.
        if os.environ.get("TITLE_CENTER", "0") == "1":
            d.text((W / 2, 58 * U), header_text, font=SANS_MARK, fill=c_bk, anchor="ma")
            d.text((W / 2, 96 * U), "KING JAMES VERSION", font=SANS_SUB, fill=c_ver, anchor="ma")
        else:
            d.text((132 * U, 58 * U), header_text, font=SANS_MARK, fill=c_bk)
            d.text((132 * U, 90 * U), "KING JAMES VERSION", font=SANS_SUB, fill=c_ver)
        d.text((W - 132 * U - brand_w, H - (72 + 20) * U), brand_text, font=SANS_BRAND, fill=META)

    _draw_static_ui(bg_img, INK, META)                 # opening state
    bg_faded = _bg_plain
    # settled state: BARELY visible — a breath above the paper, watermark-grade.
    # You find it only when you go looking for it.
    _draw_static_ui(bg_faded, (226, 222, 213), (234, 231, 224))
    # the fade is liturgical, not stopwatch: bright while you arrive, receding
    # the moment the Word begins (first spoken word onset)
    _fade_env = os.environ.get("TITLE_FADE_AT")
    TITLE_FADE_AT = float(_fade_env) if _fade_env else max(0.5, words[SKIP_WORDS]['s'] / 1000.0)
    TITLE_FADE_DUR = float(os.environ.get("TITLE_FADE_DUR", "1.6"))

    mask = Image.new("L", (W, H), 255)
    draw_mask = ImageDraw.Draw(mask)
    
    fade_top = 130 * U
    fade_len = 175 * U
    for y in range(fade_top):
        draw_mask.line([(0, y), (W, y)], fill=0)
    for y in range(fade_top, fade_top + fade_len):
        alpha = int(((y - fade_top) / fade_len) ** 1.5 * 255)
        draw_mask.line([(0, y), (W, y)], fill=alpha)

    # OUT_NAME: explicit filename, so A/B renders that differ only by an env
    # knob don't clobber each other (the sample name keys off SCROLL_MODE only).
    if SAMPLE_END > 0:
        out_file = OUTPUT_DIR / (os.environ.get("OUT_NAME") or f"sample_{SCROLL_MODE}_ss{SS}{"-4k" if U == 2 else ""}.mp4")
        audio_args = ["-ss", str(SAMPLE_START), "-t", str(SAMPLE_END - SAMPLE_START), "-i", AUDIO]
    else:
        out_file = OUTPUT_DIR / (os.environ.get("OUT_NAME") or f"{BOOK}-{CHAPTER}-scroll{"-4k" if U == 2 else ""}.mp4")
        audio_args = ["-i", AUDIO]
    print(f"Encoding {out_file}...")
    p = subprocess.Popen([
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        *audio_args,
        "-vf", "scale=in_range=full:out_range=tv:out_color_matrix=bt709",
        "-c:v", "libx264", "-preset", os.environ.get("PRESET", "veryfast"), "-crf", os.environ.get("CRF", "18"),
        "-pix_fmt", "yuv420p",
        "-colorspace", "bt709", "-color_primaries", "bt709",
        "-color_trc", "bt709", "-color_range", "tv",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
        "-shortest",
        str(out_file)
    ], stdin=subprocess.PIPE)

    total_duration = words[-1]['e'] / 1000.0 + 3.0
    total_frames = int(total_duration * FPS)

    scroll_track = compute_scroll_track(words, rows, word_to_row, total_frames)

    start_frame = int(SAMPLE_START * FPS) if SAMPLE_END > 0 else 0
    end_frame = min(int(SAMPLE_END * FPS), total_frames) if SAMPLE_END > 0 else total_frames

    # ═══ GPU GRID-SAMPLE PATH (GPU=1) ═════════════════════════════════════
    # The real fix (deep-research 2026-08-03): bake the column ONCE into DIM +
    # INK masters, then pan them each frame with torch grid_sample, which does
    # pan + downscale + CONTINUOUS sub-pixel in a single hardware-friendly op.
    # No per-frame glyph raster, no per-frame LANCZOS. SS=2 master is enough
    # because bicubic sampling is continuous (SS=8 no longer needed). Device-
    # agnostic: uses cuda→mps→cpu automatically. Run under ~/.snail-torch-venv.
    if os.environ.get("GPU") == "1":
        import torch
        import torch.nn.functional as F
        dev = torch.device('cuda' if torch.cuda.is_available()
                           else ('mps' if getattr(torch.backends, 'mps', None) and torch.backends.mps.is_available()
                                 else 'cpu'))
        print(f"[GPU] device={dev} SS={SS}")
        P = start_y_offset
        mh = P + max(r['y'] + r['height'] for r in rows) + H + 20  # 1× master height

        def _draw_master(state):
            m = Image.new("RGBA", (W * SS, mh * SS), (*BG, 255))
            dm = ImageDraw.Draw(m)
            for r in rows:
                y0 = P + r['y']
                if r['type'] == 'scene':
                    _sc_y = (68 + 13.5) if MARKER_AIR else (52 + 13.5)
                    draw_centered_text(dm, r['text'], SCENE_MARKER_FONT_SS, y0 + _sc_y * U, SCENE_COLOR, letter_spacing=_scene_ls * U)
                elif r['type'] == 'story':
                    _st_y = (80 + 2 + 24 + 20) if MARKER_AIR else (56 + 2 + 24 + 20)
                    draw_centered_text(dm, r['text'], STORY_MARKER_FONT_SS, y0 + _st_y * U, STORY_COLOR)
                elif r['type'] == 'text':
                    cx = MARGIN_X
                    baseline = y0 + LH * 0.75
                    for itype, itext, iw, ref in r['items']:
                        if itype == 'vn':
                            _vny = baseline if os.environ.get("VN_STYLE") == "inline" else baseline - 50 * U
                            dm.text((cx * SS, _vny * SS), itext, font=SANS_VN_SS, fill=ACCENT, anchor="ls")
                            cx += iw
                        else:
                            dm.text((cx * SS, baseline * SS), itext, font=SERIF_BODY_SS,
                                    fill=(INK if state == 'ink' else DIM), anchor="ls")
                            cx += iw + space_w
            return m

        print("[GPU] baking ink + dim masters...")
        def _to_tensor(im):
            a = np.asarray(im.convert("RGB"), dtype=np.float32) / 255.0  # (Hm,Wm,3)
            return torch.from_numpy(a).permute(2, 0, 1).unsqueeze(0).to(dev)  # (1,3,Hm,Wm)
        ink_t = _to_tensor(_draw_master('ink'))
        dim_t = _to_tensor(_draw_master('dim'))
        Hm, Wm = ink_t.shape[2], ink_t.shape[3]

        # x grid is constant (full master width → output width); only y moves.
        # +(SS-1)/2 samples the CENTRE of each SS-block (sharper, constant offset).
        cc = torch.arange(W, dtype=torch.float32, device=dev)
        gx = ((cc * SS + (SS - 1) / 2.0 + 0.5) / Wm * 2.0 - 1.0).view(1, W).expand(H, W)
        rr = torch.arange(H, dtype=torch.float32, device=dev).view(H, 1)
        ys_scr = torch.arange(H, dtype=torch.float32, device=dev).view(H, 1)  # screen rows
        xs_scr = torch.arange(W, dtype=torch.float32, device=dev).view(1, W)  # screen cols

        _cp, _cpr = None, -1
        for frame in range(start_frame, end_frame):
            t_ms = (frame / FPS) * 1000.0 + 180.0
            active_w = -1
            for i, w in enumerate(words):
                if w['s'] <= t_ms <= w['e']:
                    active_w = i; break
            if active_w == -1:
                for i, w in enumerate(words):
                    if w['e'] <= t_ms:
                        active_w = i
                if active_w != -1 and active_w + 1 < len(words):
                    if t_ms >= words[active_w + 1]['s'] - LEAD_MS:
                        active_w += 1

            caret_row, caret_x = -1, 0.0
            if MT_PACE and active_w != -1 and active_w in word_pos:
                a_i, a_x0, a_x1 = word_pos[active_w]
                caret_row = a_i
                a_s, a_e = float(words[active_w]['s']), float(words[active_w]['e'])
                nxt = active_w + 1
                if t_ms <= a_e or nxt not in word_pos:
                    _pp = 0.0 if a_e <= a_s else (t_ms - a_s) / (a_e - a_s)
                    caret_x = a_x0 + (a_x1 - a_x0) * _pace_ease(_pp)
                else:
                    n_i, n_x0, _n_x1 = word_pos[nxt]
                    n_s = float(words[nxt]['s']) - LEAD_MS
                    caret_x = a_x1 if n_i != a_i else a_x1 + (n_x0 - a_x1) * _pace_ease(
                        1.0 if n_s <= a_e else (t_ms - a_e) / (n_s - a_e))
                if PACE_SMOOTH > 0 and _cp is not None and _cpr == caret_row:
                    _a = 1.0 - math.exp(-(1000.0 / FPS) / PACE_SMOOTH)
                    caret_x = _cp + (caret_x - _cp) * _a
                _cp, _cpr = caret_x, caret_row

            scroll = scroll_track[frame]
            # output row r shows 1× screen row r == master 1× y (r+scroll) → master px (r+scroll)*SS
            py = (rr + scroll) * SS + (SS - 1) / 2.0    # centre of SS-block
            gy = (py + 0.5) / Hm * 2.0 - 1.0            # (H,1)
            grid = torch.stack((gx, gy.expand(H, W)), dim=-1).unsqueeze(0)  # (1,H,W,2)
            ink_win = F.grid_sample(ink_t, grid, mode='bicubic', padding_mode='border', align_corners=False)
            dim_win = F.grid_sample(dim_t, grid, mode='bicubic', padding_mode='border', align_corners=False)

            # ignition mask in SCREEN space, FLOAT positions + soft 1px edge so the
            # DIM→INK boundary tracks the sub-pixel scroll instead of snapping to
            # integer rows. Uses the SAME `scroll` float as the text grid, so the
            # boundary moves in exact lockstep with the glyphs it's revealing.
            # (This int()-snapped binary mask was the residual-jitter culprit —
            # the text flowed sub-pixel while the boundary stepped. GLM 2026-08-04.)
            if active_w != -1 and active_w in word_pos:
                a_row = word_pos[active_w][0]; a_x1 = word_pos[active_w][2]
                rtop_f = (P + rows[a_row]['y']) - scroll          # screen-space float
                rbot_f = (P + rows[a_row]['y'] + LH) - scroll
                above = torch.clamp(rtop_f - ys_scr, 0.0, 1.0)    # 1 above active row, 1px ramp
                in_row = torch.clamp(ys_scr - rtop_f, 0.0, 1.0) * torch.clamp(rbot_f - ys_scr, 0.0, 1.0)
                hx = torch.clamp(a_x1 - xs_scr, 0.0, 1.0)         # 1 left of caret, 1px ramp
                m2 = torch.maximum(above, in_row * hx).view(1, 1, H, W)
            else:
                m2 = torch.zeros((1, 1, H, W), device=dev)
            comp = ink_win * m2 + dim_win * (1.0 - m2)

            # fade mask (top/bottom) — reuse the 1× L mask
            fade = torch.from_numpy(np.asarray(mask, dtype=np.float32) / 255.0).to(dev).view(1, 1, H, W)
            bgf = torch.tensor([c / 255.0 for c in BG], device=dev).view(1, 3, 1, 1)
            comp = comp * fade + bgf * (1.0 - fade)

            # caret: solid bar composited in FLOAT space with anti-aliased top/
            # bottom edges (float Y, no int-snap of the vertical position).
            if MT_PACE and caret_row != -1:
                cby = (P + rows[caret_row]['y'] + LH * 0.75) - scroll   # float
                y1f = cby - BODY_PT * 0.74; y2f = cby + BODY_PT * 0.20
                x1 = max(0, int(caret_x)); x2 = min(W, int(caret_x + CARET_W * U))
                if x2 > x1 and y2f > y1f:
                    cov = torch.clamp(torch.minimum(ys_scr.view(H) + 1.0 - y1f,
                                                    y2f - ys_scr.view(H)), 0.0, 1.0).view(1, H, 1)
                    acc = torch.tensor([c / 255.0 for c in ACCENT], device=dev).view(3, 1, 1)
                    comp[0, :, :, x1:x2] = acc * cov + comp[0, :, :, x1:x2] * (1.0 - cov)
            arr = (comp.clamp(0, 1)[0].permute(1, 2, 0) * 255.0).round().byte().cpu().numpy()
            try:
                p.stdin.write(arr.tobytes())
            except BrokenPipeError:
                break
            if frame % 300 == 0:
                print(f"[GPU] {frame}/{total_frames}")
        p.stdin.close(); p.wait()
        print("Done! Video is at", out_file)
        return
    # ═══ end GPU path ═════════════════════════════════════════════════════

    # ═══ BAKE-AND-PAN PATH (BAKE=1) ═══════════════════════════════════════
    # Draw the whole column ONCE into tall masters, then each frame just crops
    # a window and pans it — so we get high-SS sub-pixel smoothness without
    # re-rasterizing glyphs every frame (which is what made SS=8 unaffordable).
    # Two masters (all-DIM, all-INK) support monkeypace word ignition: a cheap
    # per-frame mask selects ink for already-read text, dim for the rest.
    if os.environ.get("BAKE") == "1":
        from PIL import ImageChops
        P = start_y_offset
        mh = P + max(r['y'] + r['height'] for r in rows) + H + 20  # 1× master height

        def _draw_master(state):
            m = Image.new("RGBA", (W * SS, mh * SS), (0, 0, 0, 0))
            dm = ImageDraw.Draw(m)
            for r in rows:
                y0 = P + r['y']
                if r['type'] == 'scene':
                    _sc_y = (68 + 13.5) if MARKER_AIR else (52 + 13.5)
                    draw_centered_text(dm, r['text'], SCENE_MARKER_FONT_SS, y0 + _sc_y * U, SCENE_COLOR, letter_spacing=_scene_ls * U)
                elif r['type'] == 'story':
                    _st_y = (80 + 2 + 24 + 20) if MARKER_AIR else (56 + 2 + 24 + 20)
                    draw_centered_text(dm, r['text'], STORY_MARKER_FONT_SS, y0 + _st_y * U, STORY_COLOR)
                elif r['type'] == 'text':
                    cx = MARGIN_X
                    baseline = y0 + LH * 0.75
                    for itype, itext, iw, ref in r['items']:
                        if itype == 'vn':
                            _vny = baseline if os.environ.get("VN_STYLE") == "inline" else baseline - 50 * U
                            dm.text((cx * SS, _vny * SS), itext, font=SANS_VN_SS, fill=ACCENT, anchor="ls")
                            cx += iw
                        else:
                            dm.text((cx * SS, baseline * SS), itext, font=SERIF_BODY_SS,
                                    fill=(INK if state == 'ink' else DIM), anchor="ls")
                            cx += iw + space_w
            return m

        print("[BAKE] rasterizing ink + dim masters...")
        ink_master = _draw_master('ink')
        dim_master = _draw_master('dim')
        max_top = mh * SS - H * SS

        _cp, _cpr = None, -1
        for frame in range(start_frame, end_frame):
            t_ms = (frame / FPS) * 1000.0 + 180.0
            active_w = -1
            for i, w in enumerate(words):
                if w['s'] <= t_ms <= w['e']:
                    active_w = i; break
            if active_w == -1:
                for i, w in enumerate(words):
                    if w['e'] <= t_ms:
                        active_w = i
                if active_w != -1 and active_w + 1 < len(words):
                    if t_ms >= words[active_w + 1]['s'] - LEAD_MS:
                        active_w += 1

            caret_row, caret_x = -1, 0.0
            if MT_PACE and active_w != -1 and active_w in word_pos:
                a_i, a_x0, a_x1 = word_pos[active_w]
                caret_row = a_i
                a_s, a_e = float(words[active_w]['s']), float(words[active_w]['e'])
                nxt = active_w + 1
                if t_ms <= a_e or nxt not in word_pos:
                    _pp = 0.0 if a_e <= a_s else (t_ms - a_s) / (a_e - a_s)
                    caret_x = a_x0 + (a_x1 - a_x0) * _pace_ease(_pp)
                else:
                    n_i, n_x0, _n_x1 = word_pos[nxt]
                    n_s = float(words[nxt]['s']) - LEAD_MS
                    if n_i != a_i:
                        caret_x = a_x1
                    else:
                        _pp = 1.0 if n_s <= a_e else (t_ms - a_e) / (n_s - a_e)
                        caret_x = a_x1 + (n_x0 - a_x1) * _pace_ease(_pp)
                if PACE_SMOOTH > 0 and _cp is not None and _cpr == caret_row:
                    _a = 1.0 - math.exp(-(1000.0 / FPS) / PACE_SMOOTH)
                    caret_x = _cp + (caret_x - _cp) * _a
                _cp, _cpr = caret_x, caret_row

            # Fractional crop for CONTINUOUS sub-pixel motion: integer-crop at
            # `base`, then shift up by the fractional part via affine. This gives
            # smoothness independent of SS, so we can bake at a modest SS (cheap
            # downscale) instead of paying SS=8's huge per-frame resize.
            scroll_px = scroll_track[frame] * SS
            base = max(0, min(int(scroll_px), max_top))
            frac = scroll_px - base
            wh = H * SS + 2
            box = (0, base, W * SS, base + wh)
            ink_win = ink_master.crop(box)
            dim_win = dim_master.crop(box)

            mk = np.zeros((wh, W * SS), dtype=np.uint8)
            if active_w != -1 and active_w in word_pos:
                a_row = word_pos[active_w][0]
                a_x1 = word_pos[active_w][2]
                rtop = max(0, min(wh, int((P + rows[a_row]['y']) * SS) - base))
                rbot = max(0, min(wh, int((P + rows[a_row]['y'] + LH) * SS) - base))
                if rtop > 0:
                    mk[:rtop, :] = 255
                if rbot > rtop:
                    xx = max(0, min(W * SS, int(a_x1 * SS)))
                    mk[rtop:rbot, :xx] = 255
            win = Image.composite(ink_win, dim_win, Image.fromarray(mk, mode='L'))

            if MT_PACE and caret_row != -1:
                cb = (P + rows[caret_row]['y'] + LH * 0.75) * SS - base
                ImageDraw.Draw(win).rectangle(
                    [caret_x * SS, cb - BODY_PT * 0.74 * SS,
                     (caret_x + CARET_W * U) * SS, cb + BODY_PT * 0.20 * SS],
                    fill=(*ACCENT, CARET_A))

            if frac > 1e-3:
                win = win.transform((W * SS, H * SS), Image.AFFINE,
                                    (1, 0, 0, 0, 1, frac), resample=Image.BICUBIC)
            else:
                win = win.crop((0, 0, W * SS, H * SS))
            frame_img = win.resize((W, H), Image.LANCZOS)
            r_c, g_c, b_c, a_c = frame_img.split()
            a_c = ImageChops.multiply(a_c, mask)
            faded = Image.merge("RGBA", (r_c, g_c, b_c, a_c))
            t_s = frame / FPS
            if t_s <= TITLE_FADE_AT:
                img = bg_img.copy()
            elif t_s >= TITLE_FADE_AT + TITLE_FADE_DUR:
                img = bg_faded.copy()
            else:
                fp = (t_s - TITLE_FADE_AT) / TITLE_FADE_DUR; fp = fp * fp * (3 - 2 * fp)
                img = Image.blend(bg_img, bg_faded, fp)
            img.paste(faded, (0, 0), faded)
            try:
                p.stdin.write(img.tobytes())
            except BrokenPipeError:
                break
            if frame % 150 == 0:
                print(f"[BAKE] {frame}/{total_frames}")
        p.stdin.close(); p.wait()
        print("Done! Video is at", out_file)
        return
    # ═══ end BAKE path ════════════════════════════════════════════════════

    _caret_prev, _caret_prev_row = None, -1

    for frame in range(start_frame, end_frame):
        t_ms = (frame / FPS) * 1000.0 + 180.0
        
        active_w = -1
        for i, w in enumerate(words):
            if w['s'] <= t_ms <= w['e']:
                active_w = i
                break
        
        if active_w == -1:
            for i, w in enumerate(words):
                if w['e'] <= t_ms:
                    active_w = i
            
            if active_w != -1 and active_w + 1 < len(words):
                next_w = active_w + 1
                if t_ms >= words[next_w]['s'] - LEAD_MS:
                    active_w = next_w

        # Monkeypace caret: one continuous path. Through the active word while
        # it is voiced, across the gap during the silence, arriving at the next
        # word's leading edge exactly at its onset lead. A long pause becomes a
        # slow drift rather than a hold-then-dash — it still "waits," but it
        # never restarts from rest.
        caret_row, caret_x = -1, 0.0
        if MT_PACE and active_w != -1 and active_w in word_pos:
            a_i, a_x0, a_x1 = word_pos[active_w]
            caret_row = a_i
            a_s, a_e = float(words[active_w]['s']), float(words[active_w]['e'])
            nxt = active_w + 1
            if t_ms <= a_e or nxt not in word_pos:
                _pp = 0.0 if a_e <= a_s else (t_ms - a_s) / (a_e - a_s)
                caret_x = a_x0 + (a_x1 - a_x0) * _pace_ease(_pp)
            else:
                n_i, n_x0, _n_x1 = word_pos[nxt]
                n_s = float(words[nxt]['s']) - LEAD_MS
                if n_i != a_i:
                    # Line change: hold at the row's end and let the jump be a
                    # jump. Return sweeps are saccadic in real reading —
                    # animating one would fight the oculomotor system.
                    caret_x = a_x1
                else:
                    _pp = 1.0 if n_s <= a_e else (t_ms - a_e) / (n_s - a_e)
                    caret_x = a_x1 + (n_x0 - a_x1) * _pace_ease(_pp)

            # Low-pass the word-locked target to shave the velocity spikes.
            # Reset on row change so the line jump stays a jump and never
            # smears into a diagonal slide across the column.
            if PACE_SMOOTH > 0:
                if _caret_prev is not None and _caret_prev_row == caret_row:
                    _a = 1.0 - math.exp(-(1000.0 / FPS) / PACE_SMOOTH)
                    caret_x = _caret_prev + (caret_x - _caret_prev) * _a
                _caret_prev, _caret_prev_row = caret_x, caret_row

        current_scroll_y = scroll_track[frame]

        text_layer = Image.new("RGBA", (W * SS, H * SS), (0,0,0,0))
        draw_text = ImageDraw.Draw(text_layer)

        base_y = start_y_offset - current_scroll_y

        # TRAVELING WASH (HIGHLIGHT=wash): one continuous gold presence
        # that glides between words (same-row), like a finger under the line.
        # After the final word it lingers and recedes — the ending settle.
        if HIGHLIGHT == "wash" and active_w in word_pos:
            r_i, wx0, wx1 = word_pos[active_w]
            nxt = active_w + 1
            if nxt in word_pos and nxt < len(words):
                GLIDE = 160.0
                pgl = (t_ms - (float(words[nxt]['s']) - GLIDE)) / GLIDE
                if pgl > 0:
                    n_i, nx0, nx1 = word_pos[nxt]
                    if n_i == r_i:
                        e = min(1.0, pgl); e = e * e * (3 - 2 * e)
                        wx0 += (nx0 - wx0) * e
                        wx1 += (nx1 - wx1) * e
            wash_alpha = 1.0
            last_e = float(words[-1]['e'])
            if t_ms > last_e:
                wash_alpha = max(0.0, 1.0 - (t_ms - last_e) / 1400.0)
            if wash_alpha > 0:
                wy = base_y + rows[r_i]['y'] + LH * 0.75
                draw_text.rounded_rectangle(
                    [(wx0 - 6 * U) * SS, (wy - BODY_PT * 0.40) * SS,
                     (wx1 + 6 * U) * SS, (wy + BODY_PT * 0.22) * SS],
                    radius=4 * U * SS, fill=(*HL, int(255 * wash_alpha)))

        for _ri, r in enumerate(rows):
            cursor_y = base_y + r['y']

            if cursor_y + r['height'] < 0 or cursor_y > H:
                continue

            if r['type'] == 'scene':
                # Text (52 top padding, text is 25 tall)
                _sc_y = (68 + 13.5) if MARKER_AIR else (52 + 13.5)
                draw_centered_text(draw_text, r['text'], SCENE_MARKER_FONT_SS, cursor_y + _sc_y * U, SCENE_COLOR, letter_spacing=_scene_ls * U)

            elif r['type'] == 'story':
                # hairline removed 2026-07-16 ("that little dash — I don't like it")
                _st_y = (80 + 2 + 24 + 20) if MARKER_AIR else (56 + 2 + 24 + 20)
                draw_centered_text(draw_text, r['text'], STORY_MARKER_FONT_SS, cursor_y + _st_y * U, STORY_COLOR)

            elif r['type'] == 'text':
                cursor_x = MARGIN_X
                baseline = cursor_y + LH * 0.75

                for item in r['items']:
                    itype, itext, iw, ref = item
                    if itype == 'vn':
                        # VN_STYLE=inline sits the number on the baseline beside the
                        # text (same small size); default 'super' raises it.
                        _vny = baseline if os.environ.get("VN_STYLE") == "inline" else baseline - 50 * U
                        draw_text.text((cursor_x * SS, _vny * SS), itext, font=SANS_VN_SS, fill=ACCENT, anchor="ls")
                        cursor_x += iw
                    else:
                        w_idx = ref
                        if MT:
                            # Monkeytype: past+active = lit ink, future = dim.
                            # marker = a gliding gold caret (default) OR the band (monkeyband).
                            if w_idx == active_w:
                                if MT_BAND:
                                    hx1 = cursor_x - 6 * U
                                    hy1 = baseline - BODY_PT * 0.40
                                    hx2 = cursor_x + iw + 6 * U
                                    hy2 = baseline + BODY_PT * 0.22
                                    draw_text.rounded_rectangle(
                                        [hx1 * SS, hy1 * SS, hx2 * SS, hy2 * SS], radius=4 * U * SS, fill=HL)
                                elif (not MT_PACE) and active_w in word_pos:
                                    _cxr = cursor_x + iw
                                    nxt = active_w + 1
                                    if nxt in word_pos:
                                        r_i = word_pos[active_w][0]
                                        n_i, _nx0, _nx1 = word_pos[nxt]
                                        if n_i == r_i and nxt < len(words):
                                            _gl = 160.0
                                            _pg = (t_ms - (float(words[nxt]['s']) - _gl)) / _gl
                                            if _pg > 0:
                                                _e = min(1.0, _pg); _e = _e * _e * (3 - 2 * _e)
                                                _cxr += (_nx1 - (cursor_x + iw)) * _e
                                    draw_text.rectangle(
                                        [(_cxr + 2 * U) * SS, (baseline - BODY_PT * 0.74) * SS,
                                         (_cxr + 2 * U + 3 * U) * SS, (baseline + BODY_PT * 0.20) * SS], fill=ACCENT)
                            _mtfill = INK if (active_w != -1 and w_idx <= active_w) else DIM
                            draw_text.text((cursor_x * SS, baseline * SS), itext, font=SERIF_BODY_SS, fill=_mtfill, anchor="ls")
                            cursor_x += iw + space_w
                            continue
                        if w_idx == active_w:
                            if HIGHLIGHT == "word" and os.environ.get("HL_STYLE") == "cursor":
                                # CURSOR: a text caret riding under the active word
                                # instead of a band — a gold underline bar the width of
                                # the word, plus a blinking vertical caret at its end.
                                _uy = (baseline + BODY_PT * 0.16) * U if False else baseline + BODY_PT * 0.14
                                draw_text.rectangle(
                                    [cursor_x * SS, _uy * SS, (cursor_x + iw) * SS, (_uy + 4 * U) * SS], fill=HL)
                                _blink = (frame // 8) % 2 == 0
                                if _blink:
                                    _cx = cursor_x + iw + 3 * U
                                    draw_text.rectangle(
                                        [_cx * SS, (baseline - BODY_PT * 0.72) * SS,
                                         (_cx + 3 * U) * SS, (baseline + BODY_PT * 0.20) * SS], fill=ACCENT)
                            elif HIGHLIGHT == "word":
                                hx1 = cursor_x - 6 * U
                                hy1 = baseline - BODY_PT * 0.40
                                hx2 = cursor_x + iw + 6 * U
                                hy2 = baseline + BODY_PT * 0.22
                                draw_text.rounded_rectangle([hx1 * SS, hy1 * SS, hx2 * SS, hy2 * SS], radius=4 * U * SS, fill=HL)
                                if os.environ.get("HL_STYLE", "flat") == "glass":
                                    # GLASS: vertical light falloff + bright top edge +
                                    # shaded bottom edge — the band as a lit pane; the
                                    # pattern tooth then prints on the glass
                                    _gh = (hy2 - hy1)
                                    _steps = max(4, int(_gh / 6))
                                    for _gi in range(_steps):
                                        _t = _gi / (_steps - 1)
                                        _gc = tuple(min(255, int(c + 16 - 26 * _t)) for c in HL)
                                        _gy0 = (hy1 + 1 * U + (_gh - 2 * U) * _gi / _steps) * SS
                                        _gy1 = (hy1 + 1 * U + (_gh - 2 * U) * (_gi + 1) / _steps) * SS
                                        draw_text.rectangle([(hx1 + 4 * U) * SS, _gy0, (hx2 - 4 * U) * SS, _gy1], fill=_gc)
                                    draw_text.rectangle([(hx1 + 4 * U) * SS, (hy1 + 1 * U) * SS, (hx2 - 4 * U) * SS, (hy1 + 1 * U) * SS + SS], fill=(252, 236, 188))
                                    draw_text.rectangle([(hx1 + 4 * U) * SS, (hy2 - 1 * U) * SS - SS, (hx2 - 4 * U) * SS, (hy2 - 1 * U) * SS], fill=(212, 183, 118))
                                if HL_DOTS and HL_PATTERN != "none":
                                    # all patterns: page-locked phase (the box reveals a
                                    # field fixed to the paper) + snapped to the OUTPUT
                                    # pixel grid — crisp like print, no downscale smear
                                    _sp = 6.0 * U * SS
                                    _hsp = _sp / 2
                                    _by = base_y * SS
                                    _ytop = (hy1 + 1 * U) * SS
                                    _ybot = (hy2 - 1 * U) * SS
                                    _xl = (hx1 + 3 * U) * SS
                                    _xr = (hx2 - 3 * U) * SS
                                    _snap = lambda v: int(round(v / SS)) * SS
                                    if HL_PATTERN == "dots":
                                        _y = _ytop + ((-( _ytop - _by)) % _hsp)
                                        while _y < _ybot:
                                            _rown = int(round((_y - _by) / _hsp))
                                            _xoff = _sp * 0.5 if _rown % 2 else 0.0
                                            _x = _xl + ((-( _xl - _xoff)) % _sp)
                                            _yq = _snap(_y)
                                            while _x < _xr:
                                                _xq = _snap(_x)
                                                draw_text.rectangle([_xq - SS, _yq - SS, _xq + SS - 1, _yq + SS - 1], fill=HL_DOT)
                                                _x += _sp
                                            _y += _hsp
                                    elif HL_PATTERN == "laid":
                                        _y = _ytop + ((-( _ytop - _by)) % _sp)
                                        while _y < _ybot:
                                            _yq = _snap(_y)
                                            draw_text.rectangle([_snap(_xl), _yq, _snap(_xr) - 1, _yq + SS - 1], fill=HL_DOT)
                                            _y += _sp
                                    elif HL_PATTERN in ("stripes", "cross"):
                                        _sp2 = 8.0 * U * SS
                                        _sgns = (1,) if HL_PATTERN == "stripes" else (1, -1)
                                        _y = float(_snap(_ytop + SS))
                                        while _y < _ybot:
                                            _py = _y - _by
                                            for _sgn in _sgns:
                                                _x = _xl + ((-( _xl - _sgn * _py)) % _sp2)
                                                while _x < _xr:
                                                    _xq = _snap(_x)
                                                    draw_text.rectangle([_xq, int(_y), _xq + SS - 1, int(_y) + SS - 1], fill=HL_DOT)
                                                    _x += _sp2
                                            _y += SS
                                    elif HL_PATTERN == "stipple":
                                        _cell = 5.0 * U * SS
                                        _gy = int((_ytop - _by) // _cell)
                                        while _by + _gy * _cell < _ybot:
                                            _gx = int(_xl // _cell)
                                            while _gx * _cell < _xr:
                                                _h = ((_gx * 73856093) ^ (_gy * 19349663)) & 0xFFFF
                                                if _h % 100 < 40:
                                                    _dy = _by + _gy * _cell + (_h >> 4) % max(1, int(_cell))
                                                    _dx = _gx * _cell + (_h >> 8) % max(1, int(_cell))
                                                    _xq, _yq = _snap(_dx), _snap(_dy)
                                                    if _xl <= _xq < _xr and _ytop <= _yq < _ybot:
                                                        draw_text.rectangle([_xq, _yq, _xq + SS - 1, _yq + SS - 1], fill=HL_DOT)
                                                _gx += 1
                                            _gy += 1
                            draw_text.text((cursor_x * SS, baseline * SS), itext, font=SERIF_BODY_SS, fill=HLTEXT, anchor="ls")
                        elif active_w != -1 and w_idx < active_w:
                            draw_text.text((cursor_x * SS, baseline * SS), itext, font=SERIF_BODY_SS, fill=READ, anchor="ls")
                        else:
                            draw_text.text((cursor_x * SS, baseline * SS), itext, font=SERIF_BODY_SS, fill=INK, anchor="ls")
                        cursor_x += iw + space_w

                # Drawn after the row's words so the caret rides over them —
                # it crosses glyphs on its way through a word. CARET_A<255
                # turns that crossing into a veil rather than a slash.
                if MT_PACE and caret_row == _ri:
                    draw_text.rectangle(
                        [caret_x * SS, (baseline - BODY_PT * 0.74) * SS,
                         (caret_x + CARET_W * U) * SS, (baseline + BODY_PT * 0.20) * SS],
                        fill=(*ACCENT, CARET_A))

        text_layer = text_layer.resize((W, H), Image.LANCZOS)

        from PIL import ImageChops
        r_c, g_c, b_c, a_c = text_layer.split()
        a_c = ImageChops.multiply(a_c, mask)
        faded_text = Image.merge("RGBA", (r_c, g_c, b_c, a_c))
        
        t_s = frame / FPS
        if t_s <= TITLE_FADE_AT:
            img = bg_img.copy()
        elif t_s >= TITLE_FADE_AT + TITLE_FADE_DUR:
            img = bg_faded.copy()
        else:
            fp = (t_s - TITLE_FADE_AT) / TITLE_FADE_DUR
            fp = fp * fp * (3 - 2 * fp)
            img = Image.blend(bg_img, bg_faded, fp)
        img.paste(faded_text, (0,0), faded_text)
        
        try:
            p.stdin.write(img.tobytes())
        except BrokenPipeError:
            break
        
        if frame % 300 == 0:
            print(f"Rendered {frame}/{total_frames} frames...")

    p.stdin.close()
    p.wait()
    print("Done! Video is at", out_file)

if __name__ == "__main__":
    main()
