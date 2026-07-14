#!/bin/bash
# Overnight batch: render every chapter of a book with the locked drift
# pipeline. Resume-safe (.done flags — partial mp4s from a crash re-render).
# Usage: BOOK=genesis CHAPTERS=50 WORKERS=4 ./render_kjv_book.sh
set -u
BOOK=${BOOK:-genesis}
CHAPTERS=${CHAPTERS:-50}
WORKERS=${WORKERS:-4}
OUT=/home/nigel/wolf-and-word/output/kjv/${BOOK}
ENGINE=/home/nigel/wolf-and-word/engine/build_genesis.py
mkdir -p "$OUT"

echo "[$(date +%H:%M:%S)] batch start: $BOOK 1..$CHAPTERS, $WORKERS workers"
for w in $(seq 0 $((WORKERS-1))); do
  (
    for c in $(seq 1 "$CHAPTERS"); do
      [ $((c % WORKERS)) -ne "$w" ] && continue
      ch=$(printf %02d "$c")
      [ -f "$OUT/${BOOK}-${ch}.done" ] && continue
      echo "[$(date +%H:%M:%S)] w$w: ${BOOK}-${ch} start"
      if BOOK=$BOOK CHAPTER=$ch OUTPUT_DIR=$OUT SCROLL_MODE=drift \
         nice -n 10 python3 "$ENGINE" > "$OUT/${BOOK}-${ch}.log" 2>&1; then
        touch "$OUT/${BOOK}-${ch}.done"
        echo "[$(date +%H:%M:%S)] w$w: ${BOOK}-${ch} DONE"
      else
        echo "[$(date +%H:%M:%S)] w$w: ${BOOK}-${ch} FAILED (see log)"
      fi
    done
  ) &
done
wait
done_n=$(ls "$OUT"/*.done 2>/dev/null | wc -l)
echo "[$(date +%H:%M:%S)] batch finished: $done_n/$CHAPTERS chapters done"
