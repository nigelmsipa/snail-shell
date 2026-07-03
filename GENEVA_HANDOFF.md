# Geneva Bible Handoff

Current task: generate the 1599 Geneva Bible read-along artifacts.

## What Not To Mix Up

- BSB: already completed.
- KJV: mostly completed.
- YLT: New Testament completed.
- Geneva: current active work.

The repo root has reused filenames like `genesis-01.*` for multiple
translations. Do not write Geneva into the repo root unless the user explicitly
asks for the publish/copy step.

## Durable Locations

- Repo: `/home/nigel/wolf-and-word`
- Geneva source text: `/home/nigel/geneva-text/GENEVA.txt`
- Geneva audio/captions: `/home/nigel/geneva-audio`
- Geneva staging output: `/home/nigel/geneva`
- Geneva manifest: `/home/nigel/geneva/manifest.tsv`
- Durable batch log: `/home/nigel/geneva/logs/MAIN.log`
- Durable per-book logs: `/home/nigel/geneva/logs/<slug>.log`
- Durable status: `/home/nigel/geneva/STATUS.md`
- Completion markers: `/home/nigel/geneva/*.geneva.done`

## Current Known State

After a reboot, no Geneva process was running. `/tmp/geneva` was gone, which is
expected after reboot and means any previous `/tmp` batch logs were lost.

Surviving partial output in `/home/nigel/geneva`:

- Genesis: 2 / 50 chapters
- Exodus: 3 / 40 chapters
- Leviticus: 3 / 27 chapters
- Numbers: 3 / 36 chapters
- Joshua: 3 / 24 chapters
- Judges: 1 / 21 chapters
- Ruth: 3 / 4 chapters

There were no `.geneva.done` markers at the time this handoff was written.

## Resume Command

From the repo root:

```bash
cd /home/nigel/wolf-and-word
MAXJOBS=5 ./geneva_batch.sh
```

Use a lower `MAXJOBS` if the machine is overheating.

## Monitor Command

```bash
tail -f /home/nigel/geneva/logs/MAIN.log
```

## Safety Rules

- Do not delete partial Geneva output unless the user explicitly asks.
- It is safe for `geneva_batch.sh` to rerun a book without a `.geneva.done`
  marker; it overwrites that book's partial chapter artifacts.
- A book should only get a `.geneva.done` marker after its expected chapter
  count exists in `/home/nigel/geneva`.
- Do not trust an in-chat claim that a batch is running; verify with `pgrep`.
