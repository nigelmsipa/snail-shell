#!/usr/bin/env python3
"""asv_segment.py — turn the 14 multi-book ASV audiobook "parts" into per-book
opus + retimed word-level VTT, so the existing Geneva read-along pipeline
(align_book_tw.py) can consume them unchanged.

Input dir holds:  NN.opus  NN.en.vtt  NN.info.json   (NN = playlist_index 01..14)
Each info.json has YouTube chapter markers like "01 - Genesis 1-14" with
start_time/end_time. A book = the contiguous marker span(s) carrying its name,
possibly across two parts. We ffmpeg-cut each span and concatenate, and we slice
+ retime the VTT (cue headers AND inline <ts><c>word</c> tags) to match.

Usage: asv_segment.py <input_dir> <out_dir> <ASV.txt>
Writes: <out_dir>/<slug>.opus, <out_dir>/<slug>.en-orig.vtt, <out_dir>/manifest.tsv
"""
import os, re, sys, json, glob, subprocess, tempfile

TS = re.compile(r'(\d\d):(\d\d):(\d\d)\.(\d\d\d)')

def parse_ts(h, m, s, ms):
    return int(h)*3600 + int(m)*60 + int(s) + int(ms)/1000.0

def fmt_ts(t):
    if t < 0: t = 0.0
    h = int(t//3600); m = int((t%3600)//60); s = int(t%60); ms = int(round((t-int(t))*1000))
    if ms == 1000: s += 1; ms = 0
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"

def book_from_title(title):
    # "01 - Genesis 1-14" -> "Genesis"   ;  "75 - 1 Corinthians 1-5" -> "1 Corinthians"
    t = re.sub(r'^\s*\d+\s*-\s*', '', title).strip()
    t = re.sub(r'\s+\d+\s*(?:-\s*\d+)?\s*$', '', t).strip()  # drop trailing chapter range
    return t

def load_markers(info_path):
    d = json.load(open(info_path))
    out = []
    for c in d.get('chapters', []):
        out.append((float(c['start_time']), float(c['end_time']), book_from_title(c['title'])))
    return out

def book_spans(input_dir):
    """Return ordered list of (book, [(part_path_stem, start, end), ...])."""
    parts = sorted(glob.glob(os.path.join(input_dir, '[0-9][0-9].info.json')))
    order = []           # book appearance order
    spans = {}           # book -> list of (stem, start, end)
    for ip in parts:
        stem = ip[:-len('.info.json')]
        cur_book = None; cur_start = None; cur_end = None
        for (s, e, book) in load_markers(ip):
            if book != cur_book:
                if cur_book is not None:
                    spans[cur_book].append((stem, cur_start, cur_end))
                cur_book = book
                cur_start = s; cur_end = e
                if book not in spans:
                    spans[book] = []; order.append(book)
            else:
                cur_end = e
        if cur_book is not None:
            spans[cur_book].append((stem, cur_start, cur_end))
    return [(b, spans[b]) for b in order]

def slice_vtt(vtt_path, start, end, time_offset):
    """Return retimed VTT cue blocks for [start,end], shifted so start->time_offset."""
    raw = open(vtt_path, encoding='utf-8').read()
    blocks = raw.split('\n\n')
    out = []
    delta = time_offset - start
    for blk in blocks:
        if '-->' not in blk:
            continue
        lines = blk.split('\n')
        hdr_i = next((i for i, l in enumerate(lines) if '-->' in l), None)
        if hdr_i is None:
            continue
        m = TS.findall(lines[hdr_i])
        if len(m) < 2:
            continue
        cs = parse_ts(*m[0]); ce = parse_ts(*m[1])
        if ce < start or cs > end:
            continue
        def shift(mo):
            return fmt_ts(parse_ts(*TS.match(mo.group(0)).groups()) + delta)
        newlines = [TS.sub(shift, l) for l in lines]
        out.append('\n'.join(newlines))
    return out

def run(input_dir, out_dir, src_txt):
    os.makedirs(out_dir, exist_ok=True)
    spans = book_spans(input_dir)
    # validate book names against ASV.txt
    src = open(src_txt, encoding='utf-8').read()
    manifest = []
    for book, segs in spans:
        if (book + ' ') not in src and not re.search(r'(?m)^'+re.escape(book)+r' \d', src):
            print(f"WARN book name not found in SRC: '{book}'", file=sys.stderr)
        slug = book.lower().replace(' ', '')
        opus_out = os.path.join(out_dir, slug + '.opus')
        vtt_out = os.path.join(out_dir, slug + '.en-orig.vtt')
        # 1) extract + concat audio
        seg_files = []
        tmpd = tempfile.mkdtemp()
        for i, (stem, s, e) in enumerate(segs):
            sf = os.path.join(tmpd, f'{i}.opus')
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(s), '-to', str(e),
                            '-i', stem + '.opus', '-c', 'copy', sf], check=True)
            seg_files.append(sf)
        if len(seg_files) == 1:
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', seg_files[0], '-c', 'copy', opus_out], check=True)
        else:
            lst = os.path.join(tmpd, 'list.txt')
            open(lst, 'w').write(''.join(f"file '{f}'\n" for f in seg_files))
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0',
                            '-i', lst, '-c', 'copy', opus_out], check=True)
        # 2) slice + retime + concat vtt (offset accumulates by segment duration)
        cues = []
        offset = 0.0
        for (stem, s, e) in segs:
            cues += slice_vtt(stem + '.en.vtt', s, e, offset)
            offset += (e - s)
        with open(vtt_out, 'w', encoding='utf-8') as f:
            f.write('WEBVTT\nKind: captions\nLanguage: en\n\n')
            f.write('\n\n'.join(cues) + '\n')
        manifest.append((slug, book, opus_out, vtt_out))
        print(f"OK {slug:16s} {len(segs)} seg(s) -> {opus_out}")
    with open(os.path.join(out_dir, 'manifest.tsv'), 'w') as f:
        for slug, book, o, v in manifest:
            f.write(f"{slug}\t{book}\t{o}\t{v}\n")
    print(f"\n{len(manifest)} books, manifest written to {out_dir}/manifest.tsv")

if __name__ == '__main__':
    run(sys.argv[1], sys.argv[2], sys.argv[3])
