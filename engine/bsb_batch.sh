#!/bin/sh
# bsb_batch.sh — BSB reverse-compile a book's chapters end-to-end, resume-safe.
# Usage: bsb_batch.sh "Revelation" FIRST LAST
#
# For each chapter, given external BSB narration MP3s in ~/BSB audio/:
#   1. bsb_build.py  -> <base>.txt (+ --announce: "Book, Chapter N.") + versemap
#   2. ffmpeg        -> <base>.opus  (mono libopus, from 66_<bk>_0NN.mp3)
#   3. align_from_audio.py -> <base>.json / -aligned.json / -words.html
#
# Resume-safe: writes <base>.bsb.done on success and skips it next run, so a
# crash mid-batch just continues. Re-do a chapter by deleting its .bsb.done.
set -eu
cd /home/nigel/wolf-and-word/engine

BOOK="$1"; FIRST="$2"; LAST="$3"
ALIGN_PY=/home/nigel/.snail-align-venv/bin/python
SRC="/home/nigel/BSB audio"
BKCODE="re"          # Revelation = book 66, code 're' in 66_re_0NN.mp3
SLUG=$(echo "$BOOK" | tr '[:upper:]' '[:lower:]' | tr -d ' ')

c="$FIRST"
while [ "$c" -le "$LAST" ]; do
  base=$(printf "%s-%02d" "$SLUG" "$c")
  mp3=$(printf "%s/66_%s_%03d.mp3" "$SRC" "$BKCODE" "$c")
  if [ -f "$base.bsb.done" ]; then
    echo "[$base] already done — skip"
    c=$((c + 1)); continue
  fi
  if [ ! -f "$mp3" ]; then
    echo "[$base] MISSING SOURCE: $mp3 — skip"
    c=$((c + 1)); continue
  fi
  echo "=== [$base] build (BSB, --announce) ==="
  python3 bsb_build.py "$BOOK" "$c" "$base" --announce
  echo "=== [$base] convert mp3 -> opus ==="
  ffmpeg -y -v error -i "$mp3" -ac 1 -c:a libopus "$base.opus"
  echo "=== [$base] align (single-threaded) ==="
  OMP_NUM_THREADS=1 MKL_NUM_THREADS=1 \
    "$ALIGN_PY" align_from_audio.py "$base"
  touch "$base.bsb.done"
  echo "=== [$base] DONE ==="
  c=$((c + 1))
done
echo "ALL DONE: $BOOK $FIRST-$LAST"
