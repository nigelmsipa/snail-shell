#!/bin/sh
# bible_batch.sh — render a book's chapters end-to-end, resume-safe.
# Usage: bible_batch.sh "Revelation" FIRST LAST [Voice]
# For each chapter: bible_build -> render-vibevoice (Davis) -> align -> bible_player.
# Skips a chapter if its -words.html already exists, so it survives crashes.
set -eu
cd /home/nigel/snail-shell

BOOK="$1"; FIRST="$2"; LAST="$3"; VOICE="${4:-Davis}"
RENDER_PY=/home/nigel/.kokoro-render-venv/bin/python
ALIGN_PY=/home/nigel/.snail-align-venv/bin/python
SLUG=$(echo "$BOOK" | tr '[:upper:]' '[:lower:]' | tr -d ' ')

c="$FIRST"
while [ "$c" -le "$LAST" ]; do
  base=$(printf "%s-%02d" "$SLUG" "$c")
  if [ -f "$base-words.html" ]; then
    echo "[$base] already done — skip"
    c=$((c + 1)); continue
  fi
  echo "=== [$base] build ==="
  python3 bible_build.py "$BOOK" "$c" "$base"
  echo "=== [$base] render ($VOICE) ==="
  nice -n 19 "$RENDER_PY" render-vibevoice.py \
    "/home/nigel/snail-shell/$base.txt" \
    "/home/nigel/snail-shell/$base.opus" "$VOICE" >"/tmp/$base-render.log" 2>&1
  echo "=== [$base] align ==="
  # single-threaded: torch CPU forced-align segfaults intermittently when multi-threaded
  OMP_NUM_THREADS=1 MKL_NUM_THREADS=1 \
    nice -n 19 "$ALIGN_PY" align_words.py "$base.json" >"/tmp/$base-align.log" 2>&1
  echo "=== [$base] player ==="
  python3 bible_player.py "$base"
  echo "=== [$base] DONE ==="
  c=$((c + 1))
done
echo "ALL DONE: $BOOK $FIRST-$LAST"
