#!/bin/sh
set -eu

if [ "$#" -lt 1 ]; then
    echo "usage: $0 FILE.pdf [out.mp3]" >&2
    exit 2
fi

infile=$1
if [ "$#" -ge 2 ]; then
    outfile=$2
else
    base=$(basename "$infile")
    outfile="$HOME/kokoro-render/${base%.*}-adam.mp3"
fi

case "$outfile" in
    /*) ;;
    *) outfile="$HOME/kokoro-render/$outfile" ;;
esac

log="${outfile%.mp3}.log"
mkdir -p "$(dirname "$outfile")"

"$HOME/.kokoro-render-venv/bin/python" \
    "$HOME/kokoro-render/render.py" \
    "$infile" \
    "$outfile" \
    adam >"$log" 2>&1

echo "$outfile"
