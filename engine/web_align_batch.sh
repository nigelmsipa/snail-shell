#!/usr/bin/env bash
# web_align_batch.sh — reverse-align the WHOLE World English Bible from human narration,
# PARALLEL + resume-safe. Models bsb_nt_batch.sh. LOCAL CPU job (align_from_audio.py is
# MMS-on-CPU, no GPU) — do NOT run this on a rented GPU pod; that pays for an idle GPU.
#
# Voice: David Williams (2000-01, public domain), from audiotreasure.com.
# Source audio: ~/web-human/audio/<unzipped mp3s>  (WEB_OT_Audio.zip + WEB_NT_Audio.zip)
# Transcript:   ~/web-text-chapters/<slug>-NN.txt  (already split, verse numbers stripped)
# Per chapter:  pick mp3 -> ffmpeg 48k mono opus -> align_from_audio.py -> <base>-words.html
# Writes <base>.web.done on success and skips it next run (crash/resume safe).
#
# OUTPUT lands in $OUTDIR as <slug>-NN.opus/.json/-aligned.json/-words.html
#
# >>> BEFORE A FULL RUN: verify the mp3->chapter mapping. See find_mp3() and the handoff
# >>> log (~/HANDOFF_WEB_ALIGN.md). Run TEST_BOOK=genesis first, eyeball leading-gap
# >>> diagnostics in the per-chapter logs, THEN unleash on all 66 books.
set -u
cd /home/nigel/wolf-and-word/engine

AUDIO_DIR="$HOME/web-human/audio"          # where the zips were unpacked
TXT_DIR="$HOME/web-text-chapters"          # pre-split WEB chapter transcripts
OUTDIR="$HOME/web-aligned"; mkdir -p "$OUTDIR"
ALIGN_PY="$HOME/.snail-align-venv/bin/python"
MAXJOBS="${MAXJOBS:-8}"
LOGDIR="$OUTDIR/logs"; mkdir -p "$LOGDIR"
MAIN_LOG="$LOGDIR/MAIN.log"
TEST_BOOK="${TEST_BOOK:-}"                  # set to one slug (e.g. genesis) for a trial run

# booknum | slug (matches web-text-chapters) | canonical chapter count
BOOKS=(
  "01|genesis|50"        "02|exodus|40"        "03|leviticus|27"     "04|numbers|36"
  "05|deuteronomy|34"    "06|joshua|24"        "07|judges|21"        "08|ruth|4"
  "09|1samuel|31"        "10|2samuel|24"       "11|1kings|22"        "12|2kings|25"
  "13|1chronicles|29"    "14|2chronicles|36"   "15|ezra|10"          "16|nehemiah|13"
  "17|esther|10"         "18|job|42"           "19|psalms|150"       "20|proverbs|31"
  "21|ecclesiastes|12"   "22|songofsolomon|8"  "23|isaiah|66"        "24|jeremiah|52"
  "25|lamentations|5"    "26|ezekiel|48"       "27|daniel|12"        "28|hosea|14"
  "29|joel|3"            "30|amos|9"           "31|obadiah|1"        "32|jonah|4"
  "33|micah|7"           "34|nahum|3"          "35|habakkuk|3"       "36|zephaniah|3"
  "37|haggai|2"          "38|zechariah|14"     "39|malachi|4"        "40|matthew|28"
  "41|mark|16"           "42|luke|24"          "43|john|21"          "44|acts|28"
  "45|romans|16"         "46|1corinthians|16"  "47|2corinthians|13"  "48|galatians|6"
  "49|ephesians|6"       "50|philippians|4"    "51|colossians|4"     "52|1thessalonians|5"
  "53|2thessalonians|3"  "54|1timothy|6"       "55|2timothy|4"       "56|titus|3"
  "57|philemon|1"        "58|hebrews|13"       "59|james|5"          "60|1peter|5"
  "61|2peter|3"          "62|2peter|x"  # placeholder; fixed below
)
# NOTE: NT tail intentionally explicit to avoid 2peter dup — corrected list:
BOOKS=(
  "01|genesis|50"        "02|exodus|40"        "03|leviticus|27"     "04|numbers|36"
  "05|deuteronomy|34"    "06|joshua|24"        "07|judges|21"        "08|ruth|4"
  "09|1samuel|31"        "10|2samuel|24"       "11|1kings|22"        "12|2kings|25"
  "13|1chronicles|29"    "14|2chronicles|36"   "15|ezra|10"          "16|nehemiah|13"
  "17|esther|10"         "18|job|42"           "19|psalms|150"       "20|proverbs|31"
  "21|ecclesiastes|12"   "22|songofsolomon|8"  "23|isaiah|66"        "24|jeremiah|52"
  "25|lamentations|5"    "26|ezekiel|48"       "27|daniel|12"        "28|hosea|14"
  "29|joel|3"            "30|amos|9"           "31|obadiah|1"        "32|jonah|4"
  "33|micah|7"           "34|nahum|3"          "35|habakkuk|3"       "36|zephaniah|3"
  "37|haggai|2"          "38|zechariah|14"     "39|malachi|4"        "40|matthew|28"
  "41|mark|16"           "42|luke|24"          "43|john|21"          "44|acts|28"
  "45|romans|16"         "46|1corinthians|16"  "47|2corinthians|13"  "48|galatians|6"
  "49|ephesians|6"       "50|philippians|4"    "51|colossians|4"     "52|1thessalonians|5"
  "53|2thessalonians|3"  "54|1timothy|6"       "55|2timothy|4"       "56|titus|3"
  "57|philemon|1"        "58|hebrews|13"       "59|james|5"          "60|1peter|5"
  "61|2peter|3"          "62|1john|5"          "63|2john|1"          "64|3john|1"
  "65|jude|1"            "66|revelation|22"
)

# find_mp3 <booknum> <chap> -> echoes the mp3 path, or empty if not found.
# AudioTreasure naming is inconsistent (e.g. 01_Genesis_01.mp3 vs 40_Matthew01.mp3) so we
# match by the leading 2-digit BOOK NUMBER and the chapter number with/without zero-pad.
# >>> VERIFY this resolves to the correct file for Genesis 1, Psalm 119/150 (3-digit), and
# >>> a 1-chapter NT book before trusting a full run. Mis-mapping = wrong audio on a chapter.
# Confirmed AudioTreasure naming (2026-06-17, after unzip):
#   01_Genesis_01.mp3   19_Psalm_001.mp3 (3-digit!)   25_Lam2.mp3   31_Obadiah.mp3 (1-ch books: NO number)
find_mp3() {
  local bn="$1" c="$2" c1 c2 c3 f
  c1="$c"
  c2=$(printf '%02d' "$c"); c3=$(printf '%03d' "$c")
  for pat in "${bn}_*_${c2}.mp3" "${bn}_*_${c3}.mp3" "${bn}_*_${c1}.mp3" "${bn}_*${c2}.mp3" "${bn}_*${c3}.mp3" "${bn}_*${c1}.mp3"; do
    f=$(ls "$AUDIO_DIR"/$pat 2>/dev/null | head -1)
    [ -n "$f" ] && { echo "$f"; return; }
  done
  # single-chapter books have no chapter number in the filename (e.g. 31_Obadiah.mp3)
  if [ "$c" = "1" ]; then
    f=$(ls "$AUDIO_DIR"/"${bn}"_*.mp3 2>/dev/null | grep -vE "_[0-9]+\.mp3$" | head -1)
    [ -n "$f" ] && echo "$f"
  fi
}

process_one() {
  local bn="$1" slug="$2" chap="$3"
  local base txt mp3 log
  base=$(printf "%s/%s-%02d" "$OUTDIR" "$slug" "$chap")
  txt="$TXT_DIR/$(printf '%s-%02d.txt' "$slug" "$chap")"
  log="$LOGDIR/$(basename "$base").log"

  [ -f "$base.web.done" ] && return 0
  if [ ! -f "$txt" ]; then echo "[$(basename "$base")] MISSING txt $txt" >> "$MAIN_LOG"; return 0; fi
  mp3=$(find_mp3 "$bn" "$chap")
  if [ -z "$mp3" ]; then echo "[$(basename "$base")] MISSING mp3 (book $bn ch $chap)" >> "$MAIN_LOG"; return 0; fi

  cp "$txt" "$base.txt"
  if ffmpeg -y -v error -i "$mp3" -ac 1 -c:a libopus -b:a 48k "$base.opus" > "$log" 2>&1 \
     && OMP_NUM_THREADS=1 MKL_NUM_THREADS=1 nice -n 19 "$ALIGN_PY" align_from_audio.py "$base" >> "$log" 2>&1 \
     && [ -f "$base-words.html" ]; then
    touch "$base.web.done"
    echo "[$(basename "$base")] DONE" >> "$MAIN_LOG"
  else
    echo "[$(basename "$base")] FAILED (see $log)" >> "$MAIN_LOG"
  fi
}

echo "WEB align batch start: $(date)  MAXJOBS=$MAXJOBS  TEST_BOOK=${TEST_BOOK:-<all>}" >> "$MAIN_LOG"
for row in "${BOOKS[@]}"; do
  bn="${row%%|*}"; rest="${row#*|}"; slug="${rest%|*}"; count="${rest##*|}"
  [ -n "$TEST_BOOK" ] && [ "$slug" != "$TEST_BOOK" ] && continue
  c=1
  while [ "$c" -le "$count" ]; do
    while [ "$(jobs -rp | wc -l)" -ge "$MAXJOBS" ]; do wait -n; done
    process_one "$bn" "$slug" "$c" &
    c=$((c + 1))
  done
done
wait

echo "WEB align batch end: $(date)" >> "$MAIN_LOG"
echo "DONE this run: $(grep -c '\] DONE' "$MAIN_LOG") | markers on disk: $(ls "$OUTDIR"/*.web.done 2>/dev/null | wc -l)/1189" >> "$MAIN_LOG"
