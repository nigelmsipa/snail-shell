import os
import json
import subprocess
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

# Paths
ALIGNED = "/home/nigel/kjv-render/genesis-01-aligned.json"
UNITS_JSON = "/home/nigel/snail-shell/genesis-01-units.json"
VERSEMAP = "/home/nigel/kjv-render/genesis-01.versemap.json"
AUDIO = "/home/nigel/kjv-render/genesis-01.opus"
OUTPUT_DIR = Path("/home/nigel/snail-shell/genesis_output")
OUTPUT_DIR.mkdir(exist_ok=True)

# 4K resolution
W, H = 3840, 2160
FPS = 30
MARGIN_X = 652
LH = 198

# Colors
BG = (252, 252, 252)
INK = (46, 52, 64)
READ = (205, 211, 218)
META = (154, 147, 136)
ACCENT = (179, 148, 77)
HL = (227, 213, 181)
HLTEXT = (58, 49, 32)
MUTED_ACCENT = (180, 150, 90)

# Fonts
FONT_SERIF = "/usr/share/fonts/TTF/adobe/SourceSerifPro-Regular.ttf"
FONT_SERIF_IT = "/usr/share/fonts/TTF/adobe/SourceSerifPro-It.ttf"
FONT_SANS = "/usr/share/fonts/TTF/IBMPlexSans-SemiBold.ttf"
FONT_SANS_REG = "/usr/share/fonts/TTF/IBMPlexSans-Regular.ttf"

SANS_MARK = ImageFont.truetype(FONT_SANS, 50)
SANS_SUB = ImageFont.truetype(FONT_SANS_REG, 30)
SERIF_SCENE = ImageFont.truetype(FONT_SERIF_IT, 54)
SERIF_BODY = ImageFont.truetype(FONT_SERIF, 132)
SANS_VN = ImageFont.truetype(FONT_SANS, 60)
SANS_BRAND = ImageFont.truetype(FONT_SANS, 30)

def layout_chapter(words, word_to_verse):
    # Dummy draw to get metrics
    img = Image.new("RGB", (10, 10))
    draw = ImageDraw.Draw(img)
    space_w = draw.textlength(" ", font=SERIF_BODY)
    
    max_w = W - MARGIN_X * 2
    
    lines = []
    current_line = []
    cur_w = 0
    current_verse = None
    
    word_to_line = {}
    
    for i in range(3, len(words)):
        v = word_to_verse.get(i, -1)
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
            if cur_w + iw > max_w and current_line:
                lines.append(current_line)
                current_line = []
                cur_w = 0
            current_line.append(item)
            cur_w += iw + space_w
            if itype == 'word':
                word_to_line[ref] = len(lines)
                
    if current_line:
        lines.append(current_line)
        
    return lines, word_to_line, space_w

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
        if i < 3: # Genesis Chapter One
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

    lines, word_to_line, space_w = layout_chapter(words, word_to_verse)
    
    # We want line 0 to start at roughly H/2 initially
    start_y_offset = H // 2 - LH
    
    # Pre-render the static background elements
    bg_img = Image.new("RGB", (W, H), BG)
    draw_bg = ImageDraw.Draw(bg_img)
    draw_bg.text((192, 128), "GENESIS 1", font=SANS_MARK, fill=INK)
    draw_bg.text((192, 195), "KING JAMES VERSION", font=SANS_SUB, fill=META)
    
    brand_text = "W & W"
    brand_w = draw_bg.textlength(brand_text, font=SANS_BRAND)
    draw_bg.text((W - 192 - brand_w, H - 120), brand_text, font=SANS_BRAND, fill=META)
    draw_bg.rectangle([W - 192 - 180, 260, W - 192, 264], fill=ACCENT)

    print("Encoding reading.mp4...")
    p = subprocess.Popen([
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-i", AUDIO,
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
        "-shortest",
        str(OUTPUT_DIR / "reading_scroll.mp4")
    ], stdin=subprocess.PIPE)

    total_duration = words[-1]['e'] / 1000.0 + 3.0
    total_frames = int(total_duration * FPS)

    current_scroll_y = 0.0
    
    for frame in range(total_frames):
        t_ms = (frame / FPS) * 1000.0
        
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
                midpoint = (words[active_w]['e'] + words[next_w]['s']) / 2.0
                if t_ms >= midpoint:
                    active_w = next_w
        
        target_scroll_y = 0.0
        if active_w != -1 and active_w >= 3:
            line_idx = word_to_line.get(active_w, 0)
            target_scroll_y = line_idx * LH
        
        # Smooth scroll (exponential moving average)
        if frame == 0:
            current_scroll_y = target_scroll_y
        else:
            current_scroll_y += (target_scroll_y - current_scroll_y) * 0.05
            
        unit_idx = word_to_unit_idx.get(max(3, active_w), 0)
        unit = units[unit_idx]
        
        # Start with the static background
        img = bg_img.copy()
        draw = ImageDraw.Draw(img)
        
        # Draw Scene Title (only scene, no story)
        scene_text = f"{unit['letter']} · {unit['title']}"
        scene_w = draw.textlength(scene_text, font=SERIF_SCENE)
        draw.text((W - 192 - scene_w, 180), scene_text, font=SERIF_SCENE, fill=(130, 135, 145))

        # Draw lines that are visible
        base_y = start_y_offset - current_scroll_y
        
        for line_idx, line in enumerate(lines):
            cursor_y = base_y + line_idx * LH
            
            # Culling - only draw if on screen
            if cursor_y + LH < 0 or cursor_y > H:
                continue
                
            cursor_x = MARGIN_X
            baseline = cursor_y + LH * 0.75
            
            for item in line:
                itype, itext, iw, ref = item
                if itype == 'vn':
                    draw.text((cursor_x + space_w*0.1, baseline - 75), itext, font=SANS_VN, fill=ACCENT, anchor="ls")
                    cursor_x += iw + space_w
                else:
                    w_idx = ref
                    if w_idx == active_w:
                        hx1 = cursor_x - 20
                        hy1 = baseline - 132 * 0.85
                        hx2 = cursor_x + iw + 20
                        hy2 = baseline + 132 * 0.25
                        draw.rounded_rectangle([hx1, hy1, hx2, hy2], radius=12, fill=HL)
                        draw.text((cursor_x, baseline), itext, font=SERIF_BODY, fill=HLTEXT, anchor="ls")
                    elif active_w != -1 and w_idx < active_w:
                        draw.text((cursor_x, baseline), itext, font=SERIF_BODY, fill=READ, anchor="ls")
                    else:
                        draw.text((cursor_x, baseline), itext, font=SERIF_BODY, fill=INK, anchor="ls")
                    cursor_x += iw + space_w
                    
        try:
            p.stdin.write(img.tobytes())
        except BrokenPipeError:
            print("FFmpeg closed pipe early (likely due to -shortest).")
            break
        
        if frame % 300 == 0:
            print(f"Rendered {frame}/{total_frames} frames...")

    p.stdin.close()
    p.wait()

    def make_static_video(image_name, duration, out_name):
        img_path = Path("/home/nigel/snail-shell") / image_name
        out_path = OUTPUT_DIR / out_name
        print(f"Making {out_name}...")
        subprocess.run([
            "ffmpeg", "-y",
            "-loop", "1", "-framerate", "30", "-i", str(img_path),
            "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
            "-c:v", "libx264", "-tune", "stillimage", "-preset", "ultrafast", "-crf", "18",
            "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
            "-vf", "scale=3840:2160,setsar=1:1",
            "-pix_fmt", "yuv420p",
            "-t", str(duration),
            str(out_path)
        ], check=True)
        return out_path

    parts = [
        make_static_video("thumbnail.png", 3, "thumbnail.mp4"),
        make_static_video("bookends-1-lore.png", 4, "lore.mp4"),
        make_static_video("bookends-2-contents.png", 4, "contents.mp4"),
        OUTPUT_DIR / "reading_scroll.mp4",
        make_static_video("memory-card.png", 10, "memory.mp4"),
        make_static_video("bookends-3-credits.png", 3, "credits.mp4"),
        make_static_video("bookends-4-next.png", 4, "next.mp4")
    ]

    final_txt = OUTPUT_DIR / "final_scroll_concat.txt"
    with open(final_txt, "w") as f:
        for p in parts:
            f.write(f"file '{p.resolve()}'\n")

    print("Stitching final video...")
    subprocess.run([
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", str(final_txt),
        "-c", "copy",
        str(OUTPUT_DIR / "genesis_01_scroll_final.mp4")
    ], check=True)
    print("Done! Final video is at", OUTPUT_DIR / "genesis_01_scroll_final.mp4")

if __name__ == "__main__":
    main()
