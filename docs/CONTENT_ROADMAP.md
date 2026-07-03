# Snail Content Roadmap

The point of this doc: be **intentional** about what gets crafted into Snail read-along
format, because it takes real effort. Organize by **pipeline**, because the pipeline
decides the cost.

## The two pipelines (this is the whole strategy)

**A) HAVE AUDIO → reverse-align** — `align_from_audio.py`. LIGHT.
  - CPU does a whole Bible in ~5h; a cheap GPU pod in ~30min.
  - Used for: BSB (human narration), sermons (YouTube audio), any translation with free audio.

**B) HAVE TEXT ONLY → TTS, then align** — `render-vibevoice.py`/Kokoro + align. HEAVY.
  - TTS *generation* is the real bottleneck — THIS is what justifies renting GPU.
  - Used for: translations with no free human audio, EGW books with no recording.

> The "cloud-GPU was obsoleted" note only ever applied to pipeline A (audio you already
> have). Pipeline B (TTS) is the genuine rent-compute driver. Scope B tightly.

---

## Tier 1 — Bibles (open-source / public-domain only)

| Translation | Status | Pipeline | Notes |
|---|---|---|---|
| **BSB** | ✅ NT done, OT running tonight → COMPLETE | A (human audio) | the win |
| **KJV** | 🔶 Acts→Revelation done (TTS); **Gospels (89 ch) remain** | B (or source KJV audio→A) | pipeline already built |
| **WEB** (World English Bible) | ⬜ | B (likely no free audio) | best *modern* PD option — recommend as the one modern translation |
| ASV / Webster / Geneva / YLT / Douay-Rheims / Darby | ⬜ | B | archaic; diminishing returns |

⚠️ **Intentionality flag:** each full Bible = **1,189 chapters** of pipeline B (TTS).
"All the open-source ones" = 6+ × 1,189 ≈ 7,000+ chapters of TTS. That's the scope trap.
**Recommendation: KJV + BSB (done/near) + ONE modern PD (WEB) covers ~every reader.**
Curate, don't complete-ist — it's your own thesis. (Which "MSV" did you mean? not a
standard PD abbrev — maybe WEB or ASV? confirm before sourcing.)
TODO: per translation, CHECK if free human audio exists → if yes it drops to pipeline A.

## Tier 2 — Spirit of Prophecy (EGW)

- Have the HTML/text already. Big corpus (Conflict of the Ages 5-vol, Steps to Christ,
  Desire of Ages, Christ's Object Lessons, Great Controversy, …).
- **Mixed pipeline:** the major books HAVE free LibriVox/Adventist recordings (→ A, cheap);
  the rest need TTS (→ B). CHECK audio availability per book first — big savings.
- Sequence by importance: the famous books first.

## Tier 3 — Selected sermons

- Audio EXISTS (YouTube: C.D. Brooks, Bradford, Skeete, Batchelor, Finley…).
- Pipeline A, with one extra step: transcript from YouTube captions (you have the caption
  tooling) → light cleanup → align. Compute is light; the effort is transcript cleanup.
- Ongoing / as-selected, not a bulk job.

---

## Recommended intentional sequence (value-first, least redundant effort)

1. **Finish what's started** (nearly free): BSB (tonight) + KJV Gospels (pipeline built). → 2 complete Bibles.
2. **WEB** — one modern PD translation, if you want contemporary language. (pipeline B / rent GPU)
3. **EGW major books** — the ones with existing audio first (cheap), then TTS the rest.
4. **Sermons** — ongoing as you pick them.
5. **STOP at ~3 translations.** Don't TTS all 6+ PD Bibles — pick what users want.

## Compute plan
- Pipeline A → your CPU, or a cheap pod (`align_batch.py`, model-resident, ~30min/Bible).
- Pipeline B (TTS) → rent GPU; this is the real cost. Budget by chapters: ~1,189/Bible.
- Tool to build: `align_batch.py` (load MMS once, loop, CUDA-if-present) — speeds A everywhere.
