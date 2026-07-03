# Agent Handoff Rules

Any AI agent working in this repository should read this file first, then read
`GENEVA_HANDOFF.md` if the task involves the Geneva Bible alignment.

## Durable State

- Do not rely on chat history as the source of truth.
- Do not put handoff-critical logs or status only in `/tmp`; reboot wipes them.
- Before resuming long-running work, check for live processes and read the
  durable status/log files named by the relevant handoff document.
- Do not start a long batch if another matching batch/alignment process is
  already running.

## Translation Outputs

This repository has historically reused flat chapter slugs such as
`genesis-01-aligned.json` across translations. The separation between BSB, KJV,
YLT, and Geneva may live in git history or in an external staging directory.

For Geneva work, use `/home/nigel/geneva` as the active staging output unless
the user explicitly says to publish/copy it into the repo root.

## Immediate Checks

Run these before making decisions about Geneva:

```bash
pgrep -af '[g]eneva_batch|[a]lign_book_tw|[.]snail-align-venv'
sed -n '1,220p' GENEVA_HANDOFF.md
sed -n '1,220p' /home/nigel/geneva/STATUS.md 2>/dev/null || true
tail -n 80 /home/nigel/geneva/logs/MAIN.log 2>/dev/null || true
```
