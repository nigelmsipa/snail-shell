import os
import json
import subprocess
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

# Paths
ALIGNED = "/home/nigel/kjv-render/genesis-01-aligned.json"
UNITS_JSON = "/home/nigel/wolf-and-word/genesis-01-units.json"
VERSEMAP = "/home/nigel/kjv-render/genesis-01.versemap.json"
OUTPUT_DIR = Path("/home/nigel/wolf-and-word/genesis_output")
OUTPUT_DIR.mkdir(exist_ok=True)

# 4K resolution
W, H = 3840, 2160
FPS = 30
DURATION = 30 # seconds
TOTAL_FRAMES = DURATION * FPS

# Colors
PAPER = (252, 252, 252)
INK = (46, 52, 64) # #2e3440
INK_SOFT = (79, 83, 90) # #4f535a
METADATA = (154, 147, 136) # #9a9388
FAINT = (201, 195, 183) # #c9c3b7
GOLD = (217, 178, 89) # hsl(42 40% 50%) approx
GOLD_WASH = (244, 217, 153) # #f4d999

# Fonts
FONT_SERIF = "/usr/share/fonts/TTF/adobe/SourceSerifPro-Regular.ttf"
FONT_SERIF_IT = "/usr/share/fonts/TTF/adobe/SourceSerifPro-It.ttf"
FONT_SERIF_BOLD = "/usr/share/fonts/TTF/adobe/SourceSerifPro-Semibold.ttf"
FONT_SANS = "/usr/share/fonts/TTF/IBMPlexSans-SemiBold.ttf"
FONT_SANS_REG = "/usr/share/fonts/TTF/IBMPlexSans-Regular.ttf"
FONT_MONO = "/usr/share/fonts/TTF/IBMPlexMono-Medium.ttf"

# Fallback to standard if DM Serif not found
FONT_DISPLAY_PATH = "/usr/share/fonts/TTF/DMSerifDisplay-Regular.ttf"
if not os.path.exists(FONT_DISPLAY_PATH):
    FONT_DISPLAY_PATH = FONT_SERIF

DISPLAY_DROP = ImageFont.truetype(FONT_DISPLAY_PATH, 240)
DISPLAY_HEAD = ImageFont.truetype(FONT_DISPLAY_PATH, 160)

SERIF_TITLE = ImageFont.truetype(FONT_SERIF_BOLD, 80)
SERIF_SUB = ImageFont.truetype(FONT_SERIF_IT, 46)
SANS_META = ImageFont.truetype(FONT_SANS, 38)
MONO_SK = ImageFont.truetype(FONT_MONO, 62)

def get_first_letters(words, start_w, end_w):
    letters = []
    for i in range(start_w, end_w + 1):
        w = words[i]['t']
        clean = ''.join(c for c in w if c.isalpha())
        if clean:
            letters.append(clean[0])
    return " ".join(letters)

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
    
    # Map words to verses to units
    word_to_verse = {}
    v_idx = 0
    for i in range(len(words)):
        if i < 3: # Genesis Chapter One
            word_to_verse[i] = 0
        else:
            if v_idx < len(verses) - 1 and i >= verses[v_idx+1]['word']:
                v_idx += 1
            word_to_verse[i] = verses[v_idx]['n']

    verse_to_word_range = {}
    for i in range(len(words)):
        v = word_to_verse[i]
        if v not in verse_to_word_range:
            verse_to_word_range[v] = [i, i]
        else:
            verse_to_word_range[v][1] = i

    # Build the units data
    scenes = []
    for u in units:
        sv = u['start_verse']
        ev = u['end_verse']
        
        sw = verse_to_word_range.get(sv, [0,0])[0]
        ew = verse_to_word_range.get(ev, [0,0])[1]
        
        letters = get_first_letters(words, sw, ew)
        
        scenes.append({
            'letter': u['letter'],
            'title': u['title'],
            'range': f"{sv}–{ev}" if sv != ev else str(sv),
            'letters': letters
        })

    # Render static background & pinned header
    bg_img = Image.new("RGB", (W, H), PAPER)
    draw_bg = ImageDraw.Draw(bg_img)
    
    # Grain overlay simulated simply
    
    # Pinned Header
    hd_y = 120
    col_w = 2560
    col_x = (W - col_w) // 2
    
    draw_bg.text((col_x, hd_y), "Genesis 1", font=DISPLAY_HEAD, fill=INK)
    
    rt_t = "FIRST-LETTER RECALL"
    rt_s = "Pause on a scene & memorize it"
    t_w = draw_bg.textlength(rt_t, font=SANS_META)
    s_w = draw_bg.textlength(rt_s, font=SERIF_SUB)
    
    draw_bg.text((col_x + col_w - t_w, hd_y + 20), rt_t, font=SANS_META, fill=GOLD)
    draw_bg.text((col_x + col_w - s_w, hd_y + 80), rt_s, font=SERIF_SUB, fill=METADATA)

    # Top fade mask
    mask = Image.new("L", (W, H), 255)
    draw_mask = ImageDraw.Draw(mask)
    fade_top = 392
    fade_len = 300
    for y in range(fade_top):
        draw_mask.line([(0, y), (W, y)], fill=0)
    for y in range(fade_top, fade_top + fade_len):
        alpha = int(((y - fade_top) / fade_len) * 255)
        draw_mask.line([(0, y), (W, y)], fill=alpha)

    # Layout scenes
    # We will pre-calculate the heights of each scene
    scene_layouts = []
    dummy = Image.new("RGB", (10, 10))
    d = ImageDraw.Draw(dummy)
    
    space_w = d.textlength(" ", font=MONO_SK)
    
    for sc in scenes:
        title = sc['title']
        vrange = sc['range']
        ltrs = sc['letters'].split()
        
        # Calculate letter wrapping
        max_lw = col_w - 216 - 80 # body width
        lines = []
        cur_l = []
        cur_w = 0
        for l in ltrs:
            lw = d.textlength(l, font=MONO_SK)
            if cur_w + lw > max_lw and cur_l:
                lines.append(" ".join(cur_l))
                cur_l = []
                cur_w = 0
            cur_l.append(l)
            cur_w += lw + space_w
        if cur_l:
            lines.append(" ".join(cur_l))
            
        height = 80 + 28 + len(lines) * 100 + 100
        if height < 200: height = 200 # min height for drop cap
        
        scene_layouts.append({
            'sc': sc,
            'lines': lines,
            'h': height
        })

    total_h = sum(sl['h'] for sl in scene_layouts)
    start_y_offset = H - 200
    end_y_offset = H - 200 - total_h
    
    print("Encoding memory_scroll.mp4...")
    p = subprocess.Popen([
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
        "-pix_fmt", "yuv420p",
        str(OUTPUT_DIR / "memory_scroll.mp4")
    ], stdin=subprocess.PIPE)

    for frame in range(TOTAL_FRAMES):
        progress = frame / (TOTAL_FRAMES - 1)
        # ease in out scroll
        import math
        eased = progress
        current_scroll_y = start_y_offset + (end_y_offset - start_y_offset) * eased
        
        # Text Layer
        text_layer = Image.new("RGBA", (W, H), (0,0,0,0))
        draw_text = ImageDraw.Draw(text_layer)
        
        cursor_y = current_scroll_y
        
        for sl in scene_layouts:
            h = sl['h']
            if cursor_y + h > 0 and cursor_y < H:
                # Draw this scene
                # Drop cap
                draw_text.text((col_x, cursor_y), sl['sc']['letter'], font=DISPLAY_DROP, fill=GOLD)
                
                bx = col_x + 216
                by = cursor_y + 10
                
                # Title and range
                r_w = draw_text.textlength(sl['sc']['range'], font=SANS_META)
                draw_text.text((bx, by), sl['sc']['title'], font=SERIF_TITLE, fill=INK)
                draw_text.text((col_x + col_w - r_w, by + 30), sl['sc']['range'], font=SANS_META, fill=METADATA)
                
                # Hairline
                draw_text.line([(bx, by + 110), (col_x + col_w, by + 110)], fill=FAINT, width=2)
                
                # Letters
                ly = by + 140
                for line in sl['lines']:
                    draw_text.text((bx, ly), line, font=MONO_SK, fill=INK_SOFT)
                    ly += 100
                    
            cursor_y += h
            
        from PIL import ImageChops
        r, g, b, a = text_layer.split()
        a = ImageChops.multiply(a, mask)
        faded_text = Image.merge("RGBA", (r, g, b, a))
        
        img = bg_img.copy()
        img.paste(faded_text, (0,0), faded_text)
        
        try:
            p.stdin.write(img.tobytes())
        except BrokenPipeError:
            break
            
        if frame % 150 == 0:
            print(f"Rendered {frame}/{TOTAL_FRAMES} frames...")

    p.stdin.close()
    p.wait()
    print("Done! Final video is at", OUTPUT_DIR / "memory_scroll.mp4")

if __name__ == "__main__":
    main()
