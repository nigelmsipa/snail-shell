#!/usr/bin/env bash
# bbe_batch.sh — align the entire BBE read-along, resume-safe + parallel.
#   NT: NaturalReader per-book MP3s (~/bbe-audio-nt)  -> align_and_split.py (whole book)
#   OT: LibriVox chapter-range sections (from the zip) -> align_section.py (range)
# Output: per-chapter artifacts in ~/bbe-aligned. Re-run anytime; finished units skip.
#
# Tunables:  MAXJOBS=4 (concurrent books/sections; each uses OMP_NUM_THREADS threads)
#            ONLY=nt | ONLY=ot   (do just one testament)
# Runs equally on this box (overnight) or a CUDA pod (auto-uses GPU if present).
set -u
ROOT="${SNAIL_ROOT:-$HOME/wolf-and-word}"
ALIGN_PY="${ALIGN_PY:-$HOME/.snail-align-venv/bin/python}"
SRC="${BBE_SRC:-$HOME/bbe-text/BBE.txt}"
OUT="${BBE_OUT:-$HOME/bbe-aligned}"
NT_AUDIO="${BBE_NT:-$HOME/bbe-audio-nt}"
OT_ZIP="${BBE_OT_ZIP:-$HOME/Downloads/basicbible_oldtestament_2409_librivox.zip}"
OT_AUDIO="${BBE_OT:-$HOME/bbe-audio-ot}"
DONE="$OUT/.done"
LOG="$OUT/batch.log"
MAXJOBS="${MAXJOBS:-4}"
OMP="${OMP_NUM_THREADS:-8}"
ONLY="${ONLY:-all}"
mkdir -p "$OUT" "$DONE" "$OT_AUDIO"
cd "$ROOT" || exit 1
ts(){ date '+%H:%M:%S'; }
log(){ echo "[$(ts)] $*" | tee -a "$LOG"; }

throttle(){ while [ "$(jobs -rp | wc -l)" -ge "$MAXJOBS" ]; do wait -n; done; }

# NT: "Display Name|slug"  (slug matches *-aligned convention + the stitched mp3 name)
NT=(
 "Matthew|matthew" "Mark|mark" "Luke|luke" "John|john" "Acts|acts" "Romans|romans"
 "1 Corinthians|1corinthians" "2 Corinthians|2corinthians" "Galatians|galatians"
 "Ephesians|ephesians" "Philippians|philippians" "Colossians|colossians"
 "1 Thessalonians|1thessalonians" "2 Thessalonians|2thessalonians" "1 Timothy|1timothy"
 "2 Timothy|2timothy" "Titus|titus" "Philemon|philemon" "Hebrews|hebrews" "James|james"
 "1 Peter|1peter" "2 Peter|2peter" "1 John|1john" "2 John|2john" "3 John|3john"
 "Jude|jude" "Revelation|revelation"
)

do_nt(){
  local name="$1" slug="$2"
  local mark="$DONE/nt-$slug"
  [ -f "$mark" ] && { log "SKIP nt $slug (done)"; return; }
  local audio="$NT_AUDIO/$slug.mp3"
  [ -f "$audio" ] || { log "MISS nt audio $audio"; return; }
  log "START nt $slug"
  if OMP_NUM_THREADS="$OMP" MKL_NUM_THREADS="$OMP" nice -n 15 \
       "$ALIGN_PY" align_and_split.py "$name" "$audio" "$slug" --src "$SRC" --out "$OUT" \
       >>"$OUT/.nt-$slug.log" 2>&1; then
    touch "$mark"; log "DONE  nt $slug"
  else
    log "FAIL  nt $slug (see $OUT/.nt-$slug.log)"
  fi
}

do_ot(){
  local file="$1" book="$2" range="$3" slug="$4" num="$5"
  local mark="$DONE/ot-$num"
  [ -f "$mark" ] && { log "SKIP ot $num $slug $range (done)"; return; }
  local audio="$OT_AUDIO/$file"
  [ -f "$audio" ] || { log "MISS ot audio $audio"; return; }
  log "START ot $num $slug [$range]"
  if OMP_NUM_THREADS="$OMP" MKL_NUM_THREADS="$OMP" nice -n 15 \
       "$ALIGN_PY" align_section.py "$book" "$range" "$audio" "$slug" --src "$SRC" --out "$OUT" \
       >>"$OUT/.ot-$num.log" 2>&1; then
    touch "$mark"; log "DONE  ot $num $slug [$range]"
  else
    log "FAIL  ot $num $slug [$range] (see $OUT/.ot-$num.log)"
  fi
}

# ---- NT ----
if [ "$ONLY" != "ot" ]; then
  log "=== NT (27 books, MAXJOBS=$MAXJOBS, OMP=$OMP) ==="
  for e in "${NT[@]}"; do
    throttle
    do_nt "${e%%|*}" "${e##*|}" &
  done
  wait
fi

# ---- OT ----
if [ "$ONLY" != "nt" ]; then
  # extract sections once
  if [ -z "$(ls -A "$OT_AUDIO" 2>/dev/null)" ]; then
    log "extracting OT sections from zip..."; unzip -q -o "$OT_ZIP" -d "$OT_AUDIO"
  fi
  log "=== OT (119 sections, MAXJOBS=$MAXJOBS, OMP=$OMP) ==="
  for audio in "$OT_AUDIO"/oldtestament_*_basicbible_64kb.mp3; do
    f="$(basename "$audio")"
    num="$(echo "$f" | sed -E 's/oldtestament_0*([0-9]+)_.*/\1/')"
    title="$(ffprobe -v quiet -show_entries format_tags=title -of default=nk=1:nw=1 "$audio")"
    # parse "NNN - Book [C1-C2 | C]"
    body="${title#*- }"
    if [[ "$body" =~ ^(.+)\ ([0-9]+)-([0-9]+)$ ]]; then
      book="${BASH_REMATCH[1]}"; range="${BASH_REMATCH[2]}-${BASH_REMATCH[3]}"
    elif [[ "$body" =~ ^(.+)\ ([0-9]+)$ ]]; then
      book="${BASH_REMATCH[1]}"; range="${BASH_REMATCH[2]}"
    else
      book="$body"; range=""
    fi
    slug="$(echo "$book" | tr 'A-Z' 'a-z' | tr -d ' ' | sed 's/psalms/psalm/')"
    throttle
    do_ot "$f" "$book" "$range" "$slug" "$num" &
  done
  wait
fi

log "=== BATCH COMPLETE: $(ls "$DONE" | wc -l) units done; chapters on disk: $(ls "$OUT"/*-aligned.json 2>/dev/null | wc -l) ==="
