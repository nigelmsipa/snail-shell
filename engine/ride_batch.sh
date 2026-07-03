#!/usr/bin/env bash
# ride_batch.sh — per-chapter reverse-align for ride-along Bibles (YLT NT, WEB human,
# MSB cleanup). A DIR holds <base>.txt next to <base>.{opus,mp3,...}. Resume-safe +
# parallel. align_from_audio.py does NOT window, so a long chapter (e.g. Psalm 119)
# can be ~15GB single-pass on GPU -> keep MAXJOBS low; a 2nd pass mops up any OOM.
#   DIR=/workspace/ride/ylt MAXJOBS=2 ride_batch.sh
set -u
DIR="${DIR:?set DIR=<dir of base.txt + audio>}"
ALIGN_PY="${ALIGN_PY:-python}"
SCRIPTS="${SCRIPTS:-/workspace/ride/scripts}"
MAXJOBS="${MAXJOBS:-2}"
OMP="${OMP_NUM_THREADS:-8}"
cd "$SCRIPTS" || exit 1
throttle(){ while [ "$(jobs -rp | wc -l)" -ge "$MAXJOBS" ]; do wait -n; done; }
run1(){
  local base="$1"
  [ -f "$base-aligned.json" ] && return                       # resume: already done
  if OMP_NUM_THREADS="$OMP" MKL_NUM_THREADS="$OMP" nice -n 15 \
       "$ALIGN_PY" align_from_audio.py "$base" >>"$base.log" 2>&1; then
    echo "[$(date +%H:%M:%S)] DONE $(basename "$base")"
  else
    echo "[$(date +%H:%M:%S)] FAIL $(basename "$base") (see $base.log)"
  fi
}
echo "=== ride_batch $DIR (MAXJOBS=$MAXJOBS) ==="
for txt in "$DIR"/*.txt; do
  base="${txt%.txt}"
  audio=""
  for ext in opus mp3 m4a wav flac; do
    if [ -f "$base.$ext" ]; then
      audio="$base.$ext"
      break
    fi
  done
  [ -n "$audio" ] || { echo "NOAUDIO $(basename "$base")"; continue; }
  throttle
  run1 "$base" &
done
wait
echo "=== RIDE DONE $DIR: $(ls "$DIR"/*-aligned.json 2>/dev/null | wc -l) aligned ==="
