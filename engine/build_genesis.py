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

# 1080p resolution for faster iteration
W, H = 1920, 1080
FPS = 30
MARGIN_X = 280  # (1920 - 1360)/2 = 280
LH = 80

# Colors
BG = (252, 252, 252)
INK = (38, 50, 79)
READ = (163, 155, 139)
META = (154, 147, 136)
FADE = (248, 244, 232)
ACCENT = (196, 164, 100)
HL = (244, 217, 153)
HLTEXT = (44, 39, 34)
MUTED_ACCENT = (180, 150, 90)

# Fonts
FONT_SERIF = "/usr/share/fonts/TTF/adobe/SourceSerifPro-Regular.ttf"
FONT_SERIF_IT = "/usr/share/fonts/TTF/adobe/SourceSerifPro-It.ttf"
FONT_SANS = "/usr/share/fonts/TTF/IBMPlexSans-SemiBold.ttf"
FONT_SANS_REG = "/usr/share/fonts/TTF/IBMPlexSans-Regular.ttf"
FONT_SANS_SEMI = "/usr/share/fonts/TTF/IBMPlexSans-SemiBold.ttf"
FONT_SERIF_ITALIC = "/usr/share/fonts/TTF/adobe/SourceSerifPro-It.ttf"

# Scaled based on CSS ratios relative to 60px body font
SANS_MARK = ImageFont.truetype(FONT_SANS, 26)
SANS_SUB = ImageFont.truetype(FONT_SANS_REG, 15)
SERIF_BODY = ImageFont.truetype(FONT_SERIF, 56)
SANS_VN = ImageFont.truetype(FONT_SANS, 20)
SANS_BRAND = ImageFont.truetype(FONT_SANS, 20)

SCENE_MARKER_FONT = ImageFont.truetype(FONT_SANS_SEMI, 25)
STORY_MARKER_FONT = ImageFont.truetype(FONT_SERIF_ITALIC, 44)
SCENE_COLOR = (183, 173, 156)  # #b7ad9c
STORY_COLOR = (167, 156, 138)  # #a79c8a
HAIRLINE_COLOR = (201, 195, 183) # #c9c3b7

# "pagehold": frozen page + one slide per ~7 lines (approved version, frozen
#             copy in build_genesis_pagehold.py).
# "gauss":    per-line glide, erf-eased, fully still in pauses (stop-start).
# "drift":    TELEPROMPTER — never stops; glides continuously at the
#             narration's pace between line onsets. The alive one.
# gauss/drift need SS=2 supersampling or small type shimmers in slow motion.
SCROLL_MODE = os.environ.get("SCROLL_MODE", "drift")

# Windowed sample render for fast iteration, e.g.:
#   SCROLL_MODE=pagehold SAMPLE_START=40 SAMPLE_END=65 python3 build_genesis.py
# writes sample_<mode>_ss<SS>.mp4 instead of the full chapter.
SAMPLE_START = float(os.environ.get("SAMPLE_START", "0") or 0)
SAMPLE_END = float(os.environ.get("SAMPLE_END", "0") or 0)

# Supersample factor for the text layer: glyphs are drawn at SS x resolution
# and the layer is LANCZOS-downscaled each frame, giving half-pixel placement
# with uniform softness (a raw 1x rasterization snaps letters to whole pixels,
# which makes small titles shimmer whenever the page moves slowly).
SS = 2
SERIF_BODY_SS = ImageFont.truetype(FONT_SERIF, 56 * SS)
SANS_VN_SS = ImageFont.truetype(FONT_SANS, 20 * SS)
SCENE_MARKER_FONT_SS = ImageFont.truetype(FONT_SANS_SEMI, 25 * SS)
STORY_MARKER_FONT_SS = ImageFont.truetype(FONT_SERIF_ITALIC, 44 * SS)

def layout_chapter(words, word_to_verse, word_to_unit_idx, units):
    img = Image.new("RGB", (10, 10))
    draw = ImageDraw.Draw(img)
    space_w = draw.textlength(" ", font=SERIF_BODY)
    
    max_w = W - MARGIN_X * 2
    
    rows = []
    word_to_row = {}
    
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
                    'height': 80 + 2 + 30 + 44 + 60,
                    'text': unit['story_title']
                })
                last_story_letter = unit['story_letter']

            rows.append({
                'type': 'scene',
                'height': 52 + 25 + 40,
                'text': unit['title'].upper()
            })
            last_unit_idx = u_idx

        items_to_add = []
        if v != current_verse and v > 0:
            vn_text = str(v)
            vn_w = draw.textlength(vn_text, font=SANS_VN) + space_w * 0.4
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
            cur_w += iw + space_w
            if itype == 'word':
                word_to_row[ref] = len(rows)

    flush_line()
    
    cy = 0
    for r in rows:
        r['y'] = cy
        cy += r['height']
        
    return rows, word_to_row, space_w

def compute_scroll_track(words, rows, word_to_row, total_frames):
    if SCROLL_MODE == "pagehold":
        return compute_scroll_track_pagehold(words, rows, word_to_row, total_frames)
    if SCROLL_MODE == "drift":
        return compute_scroll_track_drift(words, rows, word_to_row, total_frames)
    if SCROLL_MODE == "chase":
        return compute_scroll_track_chase(words, rows, word_to_row, total_frames)
    return compute_scroll_track_gauss(words, rows, word_to_row, total_frames)

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

    times = np.array([row_first_time[r] for r in sorted(row_first_time)], dtype=float)
    ys = np.array([rows[r]['y'] for r in sorted(row_first_time)], dtype=float)

    t_frames = np.arange(total_frames) / FPS * 1000.0 + 180.0
    track = np.interp(t_frames, times, ys)

    sigma = int(FPS * 0.8)
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
    SIGMA_MS = 450.0
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
    TOP_LINE = 330          # reading line lands here (top fade ends at 305)
    BOTTOM_GUARD = H - 150  # advance before a line's bottom passes this
    SLIDE_MS = 700.0

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

    t_frames = np.arange(total_frames) / FPS * 1000.0 + 180.0
    track = np.full(total_frames, float(S0))
    for t_k, dY in transitions:
        u = np.clip((t_frames - (t_k - SLIDE_MS)) / SLIDE_MS, 0.0, 1.0)
        track += dY * u * u * (3.0 - 2.0 * u)  # smoothstep, ends at onset
    return track

def draw_centered_text(draw, text, font, y_center, color, letter_spacing=0):
    """Centered marker text. `y_center` and `letter_spacing` are 1x layout
    values; drawing happens in SS space with the matching SS font."""
    ls = letter_spacing * SS
    if letter_spacing > 0:
        total_w = sum(draw.textlength(ch, font=font) for ch in text) + ls * max(0, len(text) - 1)
        cx = (W * SS - total_w) / 2
        for ch in text:
            draw.text((cx, y_center * SS), ch, font=font, fill=color, anchor="lm")
            cx += draw.textlength(ch, font=font) + ls
    else:
        draw.text((W * SS / 2, y_center * SS), text, font=font, fill=color, anchor="mm")

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

    rows, word_to_row, space_w = layout_chapter(words, word_to_verse, word_to_unit_idx, units)
    
    start_y_offset = H // 2 - LH
    
    bg_img = Image.new("RGB", (W, H), BG)
    draw_bg = ImageDraw.Draw(bg_img)
    
    # Static top UI
    draw_bg.text((132, 58), f"{BOOK.upper()} {int(CHAPTER)}", font=SANS_MARK, fill=INK)
    draw_bg.text((132, 90), "KING JAMES VERSION", font=SANS_SUB, fill=META)
    
    brand_text = "W & W"
    brand_w = draw_bg.textlength(brand_text, font=SANS_BRAND)
    draw_bg.text((W - 132 - brand_w, H - 72 - 20), brand_text, font=SANS_BRAND, fill=META)

    mask = Image.new("L", (W, H), 255)
    draw_mask = ImageDraw.Draw(mask)
    
    fade_top = 130
    fade_len = 175
    for y in range(fade_top):
        draw_mask.line([(0, y), (W, y)], fill=0)
    for y in range(fade_top, fade_top + fade_len):
        alpha = int(((y - fade_top) / fade_len) ** 1.5 * 255)
        draw_mask.line([(0, y), (W, y)], fill=alpha)

    if SAMPLE_END > 0:
        out_file = OUTPUT_DIR / f"sample_{SCROLL_MODE}_ss{SS}.mp4"
        audio_args = ["-ss", str(SAMPLE_START), "-t", str(SAMPLE_END - SAMPLE_START), "-i", AUDIO]
    else:
        out_file = OUTPUT_DIR / f"{BOOK}-{CHAPTER}-scroll.mp4"
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
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
        "-shortest",
        str(out_file)
    ], stdin=subprocess.PIPE)

    total_duration = words[-1]['e'] / 1000.0 + 3.0
    total_frames = int(total_duration * FPS)

    scroll_track = compute_scroll_track(words, rows, word_to_row, total_frames)

    start_frame = int(SAMPLE_START * FPS) if SAMPLE_END > 0 else 0
    end_frame = min(int(SAMPLE_END * FPS), total_frames) if SAMPLE_END > 0 else total_frames

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
                LEAD_MS = 50
                if t_ms >= words[next_w]['s'] - LEAD_MS:
                    active_w = next_w
        
        current_scroll_y = scroll_track[frame]

        text_layer = Image.new("RGBA", (W * SS, H * SS), (0,0,0,0))
        draw_text = ImageDraw.Draw(text_layer)

        base_y = start_y_offset - current_scroll_y

        for r in rows:
            cursor_y = base_y + r['y']

            if cursor_y + r['height'] < 0 or cursor_y > H:
                continue

            if r['type'] == 'scene':
                # Text (52 top padding, text is 25 tall)
                draw_centered_text(draw_text, r['text'], SCENE_MARKER_FONT_SS, cursor_y + 52 + 12.5, SCENE_COLOR, letter_spacing=5.5)

            elif r['type'] == 'story':
                line_y = cursor_y + 80
                draw_text.rectangle([(W/2 - 40) * SS, line_y * SS, (W/2 + 40) * SS, (line_y + 2) * SS], fill=HAIRLINE_COLOR)
                draw_centered_text(draw_text, r['text'], STORY_MARKER_FONT_SS, cursor_y + 80 + 2 + 30 + 22, STORY_COLOR)

            elif r['type'] == 'text':
                cursor_x = MARGIN_X
                baseline = cursor_y + LH * 0.75

                for item in r['items']:
                    itype, itext, iw, ref = item
                    if itype == 'vn':
                        draw_text.text(((cursor_x + space_w*0.1) * SS, (baseline - 50) * SS), itext, font=SANS_VN_SS, fill=ACCENT, anchor="ls")
                        cursor_x += iw + space_w
                    else:
                        w_idx = ref
                        if w_idx == active_w:
                            hx1 = cursor_x - 6
                            hy1 = baseline - 56 * 0.40
                            hx2 = cursor_x + iw + 6
                            hy2 = baseline + 56 * 0.22
                            draw_text.rounded_rectangle([hx1 * SS, hy1 * SS, hx2 * SS, hy2 * SS], radius=4 * SS, fill=HL)
                            draw_text.text((cursor_x * SS, baseline * SS), itext, font=SERIF_BODY_SS, fill=HLTEXT, anchor="ls")
                        elif active_w != -1 and w_idx < active_w:
                            draw_text.text((cursor_x * SS, baseline * SS), itext, font=SERIF_BODY_SS, fill=READ, anchor="ls")
                        else:
                            draw_text.text((cursor_x * SS, baseline * SS), itext, font=SERIF_BODY_SS, fill=INK, anchor="ls")
                        cursor_x += iw + space_w

        text_layer = text_layer.resize((W, H), Image.LANCZOS)

        from PIL import ImageChops
        r_c, g_c, b_c, a_c = text_layer.split()
        a_c = ImageChops.multiply(a_c, mask)
        faded_text = Image.merge("RGBA", (r_c, g_c, b_c, a_c))
        
        img = bg_img.copy()
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
