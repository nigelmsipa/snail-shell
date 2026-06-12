# Why rendering is no faster than real-time (~1.16x RTF)

Short version: the bottleneck is the GPU, not the code. The RX 6600 is a
budget gaming card running an unsupported compute workload, and the one
optimization that would give a real speedup is blocked by the model itself.

## The hardware

- **GPU:** AMD Radeon RX 6600 (gfx1032, RDNA2), 8 GB VRAM.
- AMD does **not** officially support this card for compute. ROCm runs on it
  only by masquerading as gfx1030 via `HSA_OVERRIDE_GFX_VERSION=10.3.0`.
- **Model:** microsoft/VibeVoice-Realtime-0.5B — a Qwen2 LM backbone + a
  diffusion (DDPM, 5-step) acoustic decoder, run through HuggingFace
  Transformers with `attn_implementation="sdpa"`, `float16`.

## What the profiler shows

During a render:

| Metric | Value | Meaning |
|---|---|---|
| GPU use | 87% | card is busy |
| VRAM used | 47% | memory is **not** the limit |
| Memory bandwidth | 7% | barely touched |

This is **not** a VRAM problem — there's 4+ GB free. It's **compute-bound**:
the card is pinned doing math (mostly the diffusion decode), and the memory
bus is nearly idle. Throwing more VRAM at it does nothing.

## Why the GPU is slow at this specifically

1. **No FlashAttention on RDNA2.** The optimized ROCm attention kernels
   target enterprise CDNA (gfx90a/gfx940) and high-end RDNA3 (gfx1100). They
   rely on hardware matrix instructions (WMMA / `v_dot4c_i32`) that aren't
   mapped for gfx1030. So PyTorch's SDPA silently falls back to the naive
   **math kernel** — full O(N²) attention with no memory-fusion or tiling.

2. **Diffusion decode dominates.** The DDPM decoder runs 5 denoising steps per
   chunk. That's where most of the 87% GPU time goes.

## The one big win, and why it's blocked

The standard fix for a compute-bound, under-utilized GPU in an offline job is
**batching** — push 8–16 sentences through at once so the compute units stay
saturated. Research consistently estimates 2–3x throughput from this, at zero
quality cost.

It's impossible here. VibeVoice's streaming inference hard-codes single-item
generation:

```
# vibevoice/modular/modeling_vibevoice_streaming_inference.py:511
batch_size = input_ids.shape[0]
assert batch_size == 1, "Currently only supports batch size == 1"
```

The docstring says the same: *"The function only supports batch size = 1
currently."* Getting batching would mean forking Microsoft's streaming
`generate()` loop to carry a batch dimension through both the autoregressive LM
(with per-sample stop tracking) and the diffusion decoder — real, fragile
engineering, not a config flag.

## Levers that exist, ranked

| Lever | Claimed speedup | Status here |
|---|---|---|
| Batching 8–16 | 2–3x | **Dead** — `assert batch_size == 1`. Needs a model fork. |
| `torch.compile` on decoder | ~1.2–1.3x | Possible, modest, untested; gfx1030 + `max-autotune` can hang. |
| DPM-Solver / fewer DDPM steps | ~1.4x | **Rejected** — changes audio quality. |
| ONNX / DirectML | ~1.5x | Windows-only; we're on Linux. Dead. |

## What was actually changed (and what it did *not* do)

The recent commit fixed correctness and startup cost, **not** per-sentence speed:

- **Fixed the silent dtype crash** that produced 0 ms / empty audio (bf16 voice
  cache vs fp16 model on gfx1030). Output is real now.
- **Load the model once** at server startup instead of reloading the 0.5B model
  + voices on every job. Jobs now *start* instantly — but each sentence still
  synthesizes at the same rate.

So the wall clock per job dropped by removing the reload, but the **real-time
factor per sentence is unchanged** because that's set by the GPU's compute
throughput, which none of the safe changes touch.

## Bottom line

~1.16x RTF (roughly real-time, slightly slower) is about the ceiling for this
card at unchanged quality. To go meaningfully faster you need one of:

1. **Fork VibeVoice's `generate()` to support batching** — the only path to a
   multiple-x speedup at full quality, but it's a real project against the
   model internals.
2. **Different hardware** — a CUDA GPU (FlashAttention out of the box) runs this
   many times faster with no code changes.
3. **Accept a quality trade** — fewer diffusion steps / a faster sampler.

The card isn't broken and the pipeline is correct. It's just a mule, not a horse.
