#!/usr/bin/env bash
# bsb_nt_batch.sh — reverse-align the whole BSB New Testament, PARALLEL + resume-safe.
#
# Source audio: ~/Downloads/<prefix>_<NNN>.mp3 (e.g. 40_mt_001.mp3).
# Per chapter: bsb_build.py (--announce) -> ffmpeg 48k opus -> align_from_audio.py.
# Writes <slug>-<NN>.bsb.done on success and skips it next run, so a crash (or
# the still-downloading Matthew-26 / Jude) just continues / fills in on a re-run.
# Bitrate = 48k mono Opus (user's final call 2026-06-15 — economical, transparent).
set -u
cd /home/nigel/wolf-and-word

DL="$HOME/Downloads"
ALIGN_PY="$HOME/.snail-align-venv/bin/python"
MAXJOBS="${MAXJOBS:-8}"               # concurrent alignments (14900K has 32 threads)
LOGDIR="/tmp/bsb_nt"; mkdir -p "$LOGDIR"
MAIN_LOG="$LOGDIR/MAIN.log"; : > "$MAIN_LOG"

# prefix | BSB book name | canonical chapter count   (Revelation already done)
BOOKS=(
  "40_mt|Matthew|28"          "41_mr|Mark|16"             "42_lu|Luke|24"
  "43_joh|John|21"            "44_ac|Acts|28"             "45_ro|Romans|16"
  "46_1co|1 Corinthians|16"   "47_2co|2 Corinthians|13"   "48_ga|Galatians|6"
  "49_eph|Ephesians|6"        "50_php|Philippians|4"      "51_col|Colossians|4"
  "52_1th|1 Thessalonians|5"  "53_2th|2 Thessalonians|3"  "54_1ti|1 Timothy|6"
  "55_2ti|2 Timothy|4"        "56_tit|Titus|3"            "57_phm|Philemon|1"
  "58_heb|Hebrews|13"         "59_jas|James|5"            "60_1pe|1 Peter|5"
  "61_2pe|2 Peter|3"          "62_1jo|1 John|5"           "63_2jo|2 John|1"
  "64_3jo|3 John|1"           "65_jude|Jude|1"
)

process_one() {
  local book="$1" chap="$2" prefix="$3"
  local slug base mp3 log
  slug=$(printf '%s' "$book" | tr 'A-Z' 'a-z' | tr -d ' ')
  base=$(printf "%s-%02d" "$slug" "$chap")
  mp3=$(printf "%s/%s_%03d.mp3" "$DL" "$prefix" "$chap")
  log="$LOGDIR/$base.log"

  [ -f "$base.bsb.done" ] && return 0
  if [ ! -f "$mp3" ]; then
    echo "[$base] MISSING audio ($(basename "$mp3")) — skip" >> "$MAIN_LOG"; return 0
  fi

  if python3 bsb_build.py "$book" "$chap" "$base" --announce > "$log" 2>&1 \
     && ffmpeg -y -v error -i "$mp3" -ac 1 -c:a libopus -b:a 48k "$base.opus" >> "$log" 2>&1 \
     && OMP_NUM_THREADS=1 MKL_NUM_THREADS=1 nice -n 19 "$ALIGN_PY" align_from_audio.py "$base" >> "$log" 2>&1 \
     && [ -f "$base-words.html" ]; then
    touch "$base.bsb.done"
    echo "[$base] DONE" >> "$MAIN_LOG"
  else
    echo "[$base] FAILED (see $log)" >> "$MAIN_LOG"
  fi
}

echo "BSB NT batch start: $(date)  MAXJOBS=$MAXJOBS" >> "$MAIN_LOG"
for row in "${BOOKS[@]}"; do
  prefix="${row%%|*}"; rest="${row#*|}"; book="${rest%|*}"; count="${rest##*|}"
  c=1
  while [ "$c" -le "$count" ]; do
    while [ "$(jobs -rp | wc -l)" -ge "$MAXJOBS" ]; do wait -n; done
    process_one "$book" "$c" "$prefix" &
    c=$((c + 1))
  done
done
wait

done_n=$(ls revelation-*.bsb.done *-*.bsb.done 2>/dev/null | wc -l)
echo "BSB NT batch end: $(date)" >> "$MAIN_LOG"
echo "ALL DONE — $(grep -c '\] DONE' "$MAIN_LOG") chapters aligned this run; markers on disk: $done_n" >> "$MAIN_LOG"
