#!/usr/bin/env bash
# bsb_ot_batch.sh — reverse-align the whole BSB Old Testament, PARALLEL + resume-safe.
# Same engine as bsb_nt_batch.sh: bsb_build (--announce) -> ffmpeg 48k -> align_from_audio.
# Audio: ~/Downloads/<prefix>_<NNN>.mp3.  Markers: <slug>-<NN>.bsb.done (resume-safe).
# BSB quirks: Psalms = book name "Psalm"; 22_so = "Song of Solomon".
set -u
cd /home/nigel/wolf-and-word

DL="$HOME/Downloads"
ALIGN_PY="$HOME/.snail-align-venv/bin/python"
MAXJOBS="${MAXJOBS:-8}"
LOGDIR="/tmp/bsb_ot"; mkdir -p "$LOGDIR"
MAIN_LOG="$LOGDIR/MAIN.log"; : > "$MAIN_LOG"

# prefix | BSB book name | canonical chapter count
BOOKS=(
  "01_ge|Genesis|50"          "02_ex|Exodus|40"           "03_le|Leviticus|27"
  "04_nu|Numbers|36"          "05_de|Deuteronomy|34"      "06_jos|Joshua|24"
  "07_jud|Judges|21"          "08_ru|Ruth|4"              "09_1sa|1 Samuel|31"
  "10_2sa|2 Samuel|24"        "11_1ki|1 Kings|22"         "12_2ki|2 Kings|25"
  "13_1ch|1 Chronicles|29"    "14_2ch|2 Chronicles|36"    "15_ezr|Ezra|10"
  "16_ne|Nehemiah|13"         "17_es|Esther|10"           "18_job|Job|42"
  "19_ps|Psalm|150"           "20_pr|Proverbs|31"         "21_ec|Ecclesiastes|12"
  "22_so|Song of Solomon|8"   "23_isa|Isaiah|66"          "24_jer|Jeremiah|52"
  "25_la|Lamentations|5"      "26_eze|Ezekiel|48"         "27_da|Daniel|12"
  "28_ho|Hosea|14"            "29_joe|Joel|3"             "30_am|Amos|9"
  "31_ob|Obadiah|1"           "32_jon|Jonah|4"            "33_mic|Micah|7"
  "34_na|Nahum|3"             "35_hab|Habakkuk|3"         "36_zep|Zephaniah|3"
  "37_hag|Haggai|2"           "38_zec|Zechariah|14"       "39_mal|Malachi|4"
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

echo "BSB OT batch start: $(date)  MAXJOBS=$MAXJOBS" >> "$MAIN_LOG"
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
echo "BSB OT batch end: $(date)" >> "$MAIN_LOG"
echo "ALL DONE — $(grep -c '\] DONE' "$MAIN_LOG") chapters aligned this run" >> "$MAIN_LOG"
