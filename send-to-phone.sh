#!/bin/sh
set -eu

if [ "$#" -lt 1 ]; then
    echo "usage: $0 FILE.mp3" >&2
    exit 2
fi

file=$1
phone=${PHONE:-defaultuser@100.120.40.74}
dest=${PHONE_AUDIO_DIR:-/home/defaultuser/Music/NaturalReader}
name=$(basename "$file")

ssh_opts="-o StrictHostKeyChecking=accept-new -o ConnectTimeout=10"

if [ -n "${SSHPASS:-}" ] && command -v sshpass >/dev/null 2>&1; then
    sshpass -e ssh $ssh_opts "$phone" "mkdir -p '$dest'"
    sshpass -e scp -o StrictHostKeyChecking=accept-new "$file" "$phone:$dest/$name"
else
    ssh $ssh_opts "$phone" "mkdir -p '$dest'"
    scp -o StrictHostKeyChecking=accept-new "$file" "$phone:$dest/$name"
fi

echo "$phone:$dest/$name"
