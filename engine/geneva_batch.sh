#!/usr/bin/env bash
# geneva_batch.sh — align the whole 1599 Geneva Bible, PARALLEL + resume-safe.
# Reads the verified manifest (slug<TAB>book<TAB>opus<TAB>vtt) and runs the
# transcript-word aligner per book into ~/geneva. A finished book drops
# <slug>.geneva.done so a crash/restart just picks up where it left off.
set -u
cd /home/nigel/wolf-and-word/engine

OUT="$HOME/geneva"
MANIFEST="$OUT/manifest.tsv"
ALIGN_PY="$HOME/.snail-align-venv/bin/python"
SRC="$HOME/geneva-text/GENEVA.txt"
MAXJOBS="${MAXJOBS:-5}"
LOGDIR="$OUT/logs"; mkdir -p "$LOGDIR"
MAIN_LOG="$LOGDIR/MAIN.log"
STATUS="$OUT/STATUS.md"

[ -f "$MANIFEST" ] || { echo "no manifest at $MANIFEST — run make_geneva_manifest.py first" >&2; exit 2; }

expected_chapters() {
  local book="$1"
  awk -v b="$book" 'index($0, b " ") == 1 {
    rest = substr($0, length(b) + 2)
    if (rest ~ /^[0-9]+:/) {
      split(rest, a, ":")
      ch[a[1]] = 1
    }
  } END { print length(ch) }' "$SRC"
}

chapter_outputs() {
  local slug="$1"
  find "$OUT" -maxdepth 1 -name "$slug-*-words.html" -print | wc -l
}

write_status() {
  local done_n total_n chapter_n
  done_n=$(find "$OUT" -maxdepth 1 -name '*.geneva.done' -print | wc -l)
  total_n=$(wc -l < "$MANIFEST")
  chapter_n=$(find "$OUT" -maxdepth 1 -name '*-aligned.json' -print | wc -l)
  {
    echo "# Geneva Batch Status"
    echo
    echo "Updated: $(date -Is)"
    echo "Output: $OUT"
    echo "Manifest: $MANIFEST"
    echo "Logs: $LOGDIR"
    echo "MAXJOBS: $MAXJOBS"
    echo "Done books: $done_n / $total_n"
    echo "Aligned chapter files: $chapter_n"
    echo
    echo "Resume command:"
    echo
    echo '```bash'
    echo "cd /home/nigel/wolf-and-word/engine"
    echo "MAXJOBS=$MAXJOBS ./geneva_batch.sh"
    echo '```'
    echo
    echo "Recent log:"
    echo
    echo '```'
    tail -n 30 "$MAIN_LOG" 2>/dev/null || true
    echo '```'
  } > "$STATUS"
}

process_one() {
  local slug="$1" book="$2" opus="$3" vtt="$4"
  local log="$LOGDIR/$slug.log"
  local expected got
  expected=$(expected_chapters "$book")
  got=$(chapter_outputs "$slug")
  if [ -f "$OUT/$slug.geneva.done" ] && [ "$got" -ge "$expected" ]; then
    echo "[$slug] done — skip ($got/$expected ch)" >> "$MAIN_LOG"
    write_status
    return 0
  fi
  if [ "$expected" -gt 0 ] && [ "$got" -ge "$expected" ]; then
    touch "$OUT/$slug.geneva.done"
    echo "[$slug] DONE marker restored ($got/$expected ch)" >> "$MAIN_LOG"
    write_status
    return 0
  fi
  echo "[$slug] start ($book)" >> "$MAIN_LOG"
  write_status
  if OMP_NUM_THREADS=1 MKL_NUM_THREADS=1 nice -n 19 \
       "$ALIGN_PY" align_book_tw.py "$book" "$opus" "$vtt" "$slug" \
       --src "$SRC" --out "$OUT" > "$log" 2>&1; then
    got=$(chapter_outputs "$slug")
    if [ "$expected" -gt 0 ] && [ "$got" -ge "$expected" ]; then
      touch "$OUT/$slug.geneva.done"
      echo "[$slug] DONE ($got/$expected ch)" >> "$MAIN_LOG"
    else
      echo "[$slug] FAILED (incomplete output $got/$expected ch, see $log)" >> "$MAIN_LOG"
    fi
  else
    echo "[$slug] FAILED (exit $?, see $log)" >> "$MAIN_LOG"
  fi
  write_status
}

echo "==== geneva batch start $(date) MAXJOBS=$MAXJOBS ====" >> "$MAIN_LOG"
write_status
while IFS=$'\t' read -r slug book opus vtt; do
  [ -z "$slug" ] && continue
  while [ "$(jobs -rp | wc -l)" -ge "$MAXJOBS" ]; do wait -n; done
  process_one "$slug" "$book" "$opus" "$vtt" &
done < "$MANIFEST"
wait
done_n=$(grep -c '\] DONE' "$MAIN_LOG")
fail_n=$(grep -c '\] FAILED' "$MAIN_LOG")
echo "==== geneva batch end $(date) — DONE=$done_n FAILED=$fail_n ====" >> "$MAIN_LOG"
write_status
