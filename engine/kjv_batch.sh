#!/usr/bin/env bash
# kjv_batch.sh — KJV read-along from WordProject audio via align_from_audio
# (per-chapter forced alignment, NO boundary detection). Resume-safe + parallel.
set -u
KJV=/workspace/kjv
MP3=/workspace/kjv-mp3
ALIGN=/workspace/snail-shell/align_from_audio.py
MAXJOBS="${MAXJOBS:-2}"
LOG="$KJV/MAIN.log"
mkdir -p "$KJV/logs"
cd /workspace/snail-shell

do_one() {
  local base="$1"
  local opus="$KJV/$base.opus" mp3="$MP3/$base.mp3" log="$KJV/logs/$base.log"
  if [ -f "$KJV/$base-words.html" ]; then echo "[$base] skip (done)" >> "$LOG"; return 0; fi
  # convert mp3 -> opus if needed (stdin from /dev/null so ffmpeg can't eat the loop input)
  if [ ! -s "$opus" ]; then ffmpeg -v error -y -i "$mp3" -c:a libopus -b:a 48k "$opus" </dev/null 2>>"$log"; fi
  if OMP_NUM_THREADS=1 nice -n 19 python3 "$ALIGN" "$KJV/$base" </dev/null >>"$log" 2>&1; then
    [ -f "$KJV/$base-words.html" ] && echo "[$base] DONE" >> "$LOG" || echo "[$base] FAILED (no output)" >> "$LOG"
  else
    echo "[$base] FAILED (exit $?)" >> "$LOG"
  fi
}

echo "==== kjv batch start $(date) MAXJOBS=$MAXJOBS ====" >> "$LOG"
for txt in "$KJV"/*.txt; do
  base=$(basename "$txt" .txt)
  while [ "$(jobs -rp | wc -l)" -ge "$MAXJOBS" ]; do wait -n; done
  do_one "$base" </dev/null &
done
wait
echo "==== kjv batch end $(date) DONE=$(grep -c '] DONE' "$LOG") FAILED=$(grep -c '] FAILED' "$LOG") ====" >> "$LOG"
