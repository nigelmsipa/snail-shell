#!/usr/bin/env python3
"""
One-time conversion: re-save voice cache .pt files from bfloat16 to float16.
Run this once so render-vibevoice.py loads them without a runtime cast.

Usage: python convert-voices-fp16.py [--voices-dir PATH] [--dry-run]
"""
import argparse, os, sys, torch
from transformers.modeling_outputs import BaseModelOutputWithPast

VOICES_DIR = os.path.expanduser("~/VibeVoice/demo/voices/streaming_model")


def cast_cache(voice_cache_dict):
    for output in voice_cache_dict.values():
        if not isinstance(output, BaseModelOutputWithPast):
            continue
        if output.last_hidden_state is not None:
            output.last_hidden_state = output.last_hidden_state.to(dtype=torch.float16)
        cache = output.past_key_values
        if hasattr(cache, "key_cache"):
            cache.key_cache   = [t.to(dtype=torch.float16) for t in cache.key_cache]
            cache.value_cache = [t.to(dtype=torch.float16) for t in cache.value_cache]
    return voice_cache_dict


def check_overflow(voice_cache_dict):
    FP16_MAX = 65504.0
    issues = []
    for name, output in voice_cache_dict.items():
        if not isinstance(output, BaseModelOutputWithPast):
            continue
        cache = output.past_key_values
        if not hasattr(cache, "key_cache"):
            continue
        for i, t in enumerate(cache.key_cache + cache.value_cache):
            mx = t.abs().max().item()
            if mx > FP16_MAX:
                issues.append(f"  {name} layer {i}: max={mx:.1f} > fp16 limit, will overflow!")
    return issues


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--voices-dir", default=VOICES_DIR)
    p.add_argument("--dry-run", action="store_true", help="check for overflow without saving")
    args = p.parse_args()

    pts = [f for f in os.listdir(args.voices_dir) if f.endswith(".pt")]
    if not pts:
        sys.exit(f"No .pt files found in {args.voices_dir}")

    for fname in sorted(pts):
        path = os.path.join(args.voices_dir, fname)
        print(f"\n{fname}")
        cache = torch.load(path, map_location="cpu", weights_only=False)

        issues = check_overflow(cache)
        if issues:
            print("  WARNINGS:")
            for w in issues:
                print(w)
        else:
            print("  overflow check: OK")

        if args.dry_run:
            continue

        cast_cache(cache)
        torch.save(cache, path)
        print(f"  saved as float16")

    if not args.dry_run:
        print("\nDone. All voice caches are now float16.")


if __name__ == "__main__":
    main()
