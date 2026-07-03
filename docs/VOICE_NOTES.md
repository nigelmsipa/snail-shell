# Voice Preferences

## Voice assignment by content type (standing default)
- **Davis** → theology / sacred: **Bible**, Spirit of Prophecy (SOP), and proper scripture-grade text.
- **Carter** → research papers, commentary — basically everything else.

## VibeVoice-Realtime-0.5B (preferred engine — ~1× RTF on CPU, no GPU needed)
- ✅ **Mike** — liked
- ✅ **Carter** — liked  
- ✅ **Davis** — liked
- 🆗 **Emma** — okay but not strong enough
- ❌ **Grace** — not preferred
- ❌ **Frank** — not preferred
- Only 2 female presets in the model; neither hits "strong narrator"

## Female voice gap
- Need a stronger female voice
- Options to explore:
  1. **Google Journey-F** — already confirmed working (key in ~/.config/natural-reader/google-tts.key); genuinely audiobook-quality female voice; costs API credits per render
  2. **VibeVoice voice cloning** — feed a ~10s reference clip of a voice you like → generates a custom .pt embedding; free/local; see vibevoice-community fork FINETUNING.md
  3. **VibeVoice 1.5B** — larger model, different voice variety, but needs more RAM/time on CPU

## Kokoro fallback voices (sherpa-onnx, fully offline)
- Voices 0–10 available; af_sky (3) was "not bad"
- bf_emma (7) / bm_george (9) are clearest British narrator voices

## Current render pipeline
- ~/kokoro-render/render.py — uses sherpa-onnx Kokoro
- Needs rewriting to use VibeVoice for final production renders
