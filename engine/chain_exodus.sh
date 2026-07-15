#!/bin/bash
# Wait for the running genesis fix batch, verify genesis is 50/50 complete,
# then launch the exodus batch. Detached-safe.
set -u
OUT=/home/nigel/wolf-and-word/output/kjv
while pgrep -f "engine/render_kjv_book.sh" >/dev/null; do sleep 60; done
n=$(ls "$OUT"/genesis/*.done 2>/dev/null | wc -l)
echo "[$(date +%H:%M:%S)] genesis complete check: $n/50"
if [ "$n" -ne 50 ]; then
  echo "genesis incomplete — NOT starting exodus"
  exit 1
fi
echo "[$(date +%H:%M:%S)] genesis verified 50/50 — starting exodus"
BOOK=exodus CHAPTERS=40 WORKERS=4 bash /home/nigel/wolf-and-word/engine/render_kjv_book.sh
