import json
from PIL import Image, ImageDraw, ImageFont

W, H = 3840, 2160
FPS = 30
MARGIN_X = 652

BG = (252, 252, 252)
INK = (46, 52, 64)
READ = (205, 211, 218)
META = (154, 147, 136)
ACCENT = (179, 148, 77)
HL = (227, 213, 181)
HLTEXT = (58, 49, 32)
MUTED_ACCENT = (180, 150, 90)

FONT_SERIF = "/usr/share/fonts/TTF/adobe/SourceSerifPro-Regular.ttf"
FONT_SERIF_IT = "/usr/share/fonts/TTF/adobe/SourceSerifPro-It.ttf"
FONT_SANS = "/usr/share/fonts/TTF/IBMPlexSans-SemiBold.ttf"
FONT_SANS_REG = "/usr/share/fonts/TTF/IBMPlexSans-Regular.ttf"

SANS_MARK = ImageFont.truetype(FONT_SANS, 50)
SANS_SUB = ImageFont.truetype(FONT_SANS_REG, 30)
SANS_STORY = ImageFont.truetype(FONT_SANS, 30)
SERIF_SCENE = ImageFont.truetype(FONT_SERIF_IT, 54)
SERIF_BODY = ImageFont.truetype(FONT_SERIF, 132)
SANS_VN = ImageFont.truetype(FONT_SANS, 60)
SANS_SNAIL = ImageFont.truetype(FONT_SANS, 30)

with open('/home/nigel/kjv-render/genesis-01-aligned.json') as f:
    aligned = json.load(f)
with open('/home/nigel/snail-shell/genesis-01-units.json') as f:
    units = json.load(f)['units']
with open('/home/nigel/kjv-render/genesis-01.versemap.json') as f:
    vmap = json.load(f)

words = aligned['words']
verses = vmap['verses']
word_to_verse = {}
v_idx = 0
for i in range(len(words)):
    if v_idx < len(verses) - 1 and i >= verses[v_idx+1]['word']:
        v_idx += 1
    word_to_verse[i] = verses[v_idx]['n']
verse_to_unit = {}
for u in units:
    for v in range(u['start_verse'], u['end_verse'] + 1):
        verse_to_unit[v] = u

def layout_unit(unit, words, active_idx, draw):
    unit_word_indices = [i for i in range(len(words)) if word_to_verse[i] >= unit['start_verse'] and word_to_verse[i] <= unit['end_verse']]
    max_w = W - MARGIN_X * 2
    space_w = draw.textlength(" ", font=SERIF_BODY)
    lines = []
    current_line = []
    cur_w = 0
    current_verse = None
    
    for i in unit_word_indices:
        v = word_to_verse[i]
        items_to_add = []
        if v != current_verse:
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
            
    if current_line:
        lines.append(current_line)
    return lines

t = 15.0
active_idx = 0
for i, w in enumerate(words):
    if w['s'] <= t * 1000 <= w['e']:
        active_idx = i
        break
    elif w['s'] > t * 1000:
        active_idx = max(0, i - 1)
        break

v = word_to_verse[active_idx]
unit = verse_to_unit[v]

img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

draw.text((192, 128), "GENESIS 1", font=SANS_MARK, fill=INK)
draw.text((192, 195), "KING JAMES VERSION", font=SANS_SUB, fill=META)

story_text = unit['story_title'].upper()
story_w = draw.textlength(story_text, font=SANS_STORY)
draw.text((W - 192 - story_w, 132), story_text, font=SANS_STORY, fill=MUTED_ACCENT)

scene_text = f"{unit['letter']} · {unit['title']}"
scene_w = draw.textlength(scene_text, font=SERIF_SCENE)
draw.text((W - 192 - scene_w, 180), scene_text, font=SERIF_SCENE, fill=(130, 135, 145))

draw.rectangle([W - 192 - 180, 260, W - 192, 264], fill=ACCENT)

snail_w = draw.textlength("SNAIL", font=SANS_SNAIL)
draw.text((W - 192 - snail_w, H - 120), "SNAIL", font=SANS_SNAIL, fill=META)

lines = layout_unit(unit, words, active_idx, draw)
LH = 198
total_h = len(lines) * LH
start_y = (H - total_h) // 2

cursor_y = start_y
space_w = draw.textlength(" ", font=SERIF_BODY)

for line in lines:
    cursor_x = MARGIN_X
    baseline = cursor_y + LH * 0.75
    for item in line:
        itype, itext, iw, ref = item
        if itype == 'vn':
            draw.text((cursor_x + space_w*0.1, baseline - 75), itext, font=SANS_VN, fill=ACCENT, anchor="ls")
            cursor_x += iw + space_w
        else:
            w_idx = ref
            if w_idx == active_idx:
                hx1 = cursor_x - 20
                hy1 = baseline - 132 * 0.85
                hx2 = cursor_x + iw + 20
                hy2 = baseline + 132 * 0.25
                draw.rounded_rectangle([hx1, hy1, hx2, hy2], radius=12, fill=HL)
                draw.text((cursor_x, baseline), itext, font=SERIF_BODY, fill=HLTEXT, anchor="ls")
            elif w_idx < active_idx:
                draw.text((cursor_x, baseline), itext, font=SERIF_BODY, fill=READ, anchor="ls")
            else:
                draw.text((cursor_x, baseline), itext, font=SERIF_BODY, fill=INK, anchor="ls")
            cursor_x += iw + space_w
    cursor_y += LH

img.save('/home/nigel/snail-shell/test_frame.png')
print("Saved /home/nigel/snail-shell/test_frame.png")
