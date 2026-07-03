#!/usr/bin/env bash
# master_track.sh — broadcast-ready mastering for Seraph Song renders.
# Two-pass EBU R128 loudnorm (-14 LUFS, -1 dBTP) + safety limiter, 48kHz.
# Model-agnostic: works on any ACE-Step / SongGen / YuE / Suno output.
#
# Usage:   ./master_track.sh input.wav [output.wav]
#          DENOISE=/path/to/model.rnnn ./master_track.sh in.wav   # optional RNNoise
# Output:  <output>.wav (24-bit/48k mastered) + <output>.mp3 (320k)
set -euo pipefail

IN="${1:?usage: master_track.sh input.wav [output.wav]}"
OUT="${2:-${IN%.*}_mastered.wav}"
TARGET_I=-14; TARGET_TP=-1.0; TARGET_LRA=11   # streaming-loudness target

# Optional speech denoise (needs an .rnnn model; off unless DENOISE set)
DN_FILTER=""
if [[ -n "${DENOISE:-}" && -f "${DENOISE}" ]]; then
  DN_FILTER="arnndn=m=${DENOISE},"
  echo ">> denoise ON (${DENOISE})"
fi

echo ">> pass 1/2: measuring loudness of $IN"
MEAS=$(ffmpeg -hide_banner -nostats -i "$IN" \
  -af "${DN_FILTER}loudnorm=I=${TARGET_I}:TP=${TARGET_TP}:LRA=${TARGET_LRA}:print_format=json" \
  -f null - 2>&1 | python3 -c '
import sys,json,re
t=sys.stdin.read()
m=re.search(r"\{[^{}]*\"input_i\"[^{}]*\}",t,re.S)
print(m.group(0) if m else "{}")')

get(){ python3 -c "import json,sys;print(json.loads(sys.argv[1]).get(sys.argv[2],''))" "$MEAS" "$1"; }
MI=$(get input_i); MTP=$(get input_tp); MLRA=$(get input_lra); MTH=$(get input_thresh); OFF=$(get target_offset)
echo "   measured: I=${MI} TP=${MTP} LRA=${MLRA} LUFS"

echo ">> pass 2/2: applying mastering -> $OUT"
ffmpeg -hide_banner -nostats -y -i "$IN" -af "\
${DN_FILTER}\
loudnorm=I=${TARGET_I}:TP=${TARGET_TP}:LRA=${TARGET_LRA}:measured_I=${MI}:measured_TP=${MTP}:measured_LRA=${MLRA}:measured_thresh=${MTH}:offset=${OFF}:linear=true,\
alimiter=limit=0.97:level=false,\
aresample=48000:resampler=soxr:precision=28" \
  -c:a pcm_s24le "$OUT"

MP3="${OUT%.*}.mp3"
ffmpeg -hide_banner -nostats -y -i "$OUT" -c:a libmp3lame -b:a 320k "$MP3"
echo ">> done: $OUT  +  $MP3"

echo ">> verify (post-master loudness):"
ffmpeg -hide_banner -nostats -i "$OUT" -af loudnorm=print_format=summary -f null - 2>&1 | grep -iE 'Input (Integrated|True Peak|LRA)'
