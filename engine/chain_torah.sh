#!/bin/bash
# Finish the Torah: wait for the running leviticus batch, then numbers, then
# deuteronomy. Each book gated on the previous completing fully.
set -u
OUT=/home/nigel/wolf-and-word/output/kjv
ENGINE_DIR=/home/nigel/wolf-and-word/engine

wait_book () {  # book, n_chapters — wait for a running batch then verify
  while pgrep -f "engine/render_kjv_book.sh" >/dev/null; do sleep 60; done
  local n
  n=$(ls "$OUT/$1"/*.done 2>/dev/null | wc -l)
  echo "[$(date +%H:%M:%S)] $1: $n/$2 done"
  [ "$n" -eq "$2" ]
}

wait_book leviticus 27 || { echo "leviticus incomplete — stopping chain"; exit 1; }
BOOK=numbers CHAPTERS=36 WORKERS=4 bash "$ENGINE_DIR/render_kjv_book.sh"
wait_book numbers 36 || { echo "numbers incomplete — stopping chain"; exit 1; }
BOOK=deuteronomy CHAPTERS=34 WORKERS=4 bash "$ENGINE_DIR/render_kjv_book.sh"
wait_book deuteronomy 34 || { echo "deuteronomy incomplete — stopping chain"; exit 1; }
echo "[$(date +%H:%M:%S)] TORAH COMPLETE: 187/187 chapters"
