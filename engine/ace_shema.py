#!/usr/bin/env python3
"""Bake-off render: the Shema (Deut 6:4-9) through ACE-Step 1.5 xl-sft."""
import os, sys, time
for v in ("http_proxy","https_proxy","HTTP_PROXY","HTTPS_PROXY","ALL_PROXY"):
    os.environ.pop(v, None)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from loguru import logger
from acestep.handler import AceStepHandler
from acestep.llm_inference import LLMHandler
from acestep.inference import GenerationParams, GenerationConfig, generate_music

ROOT = os.path.dirname(os.path.abspath(__file__))
CKPT = os.path.join(ROOT, "checkpoints")
SAVE = "/workspace/bakeoff/acestep"
os.makedirs(SAVE, exist_ok=True)

CAPTION = ("A slow, atmospheric ambient worship piece. Ethereal synth pads and soft "
           "cinematic strings build a sacred, reverent mood. A gentle, clear male voice "
           "sings scripture solemnly with natural reverb, unhurried and meditative. "
           "Sparse, prayerful, hymn-like arrangement.")

LYRICS = """[Verse]
Hear, O Israel: The LORD our God is one LORD:
And thou shalt love the LORD thy God with all thine heart,
and with all thy soul, and with all thy might.
And these words, which I command thee this day, shall be in thine heart:
And thou shalt teach them diligently unto thy children,
and shalt talk of them when thou sittest in thine house,
and when thou walkest by the way, and when thou liest down, and when thou risest up.
And thou shalt bind them for a sign upon thine hand,
and they shall be as frontlets between thine eyes.
And thou shalt write them upon the posts of thy house, and on thy gates."""

logger.info("init DiT xl-sft ...")
t0 = time.time()
dit = AceStepHandler()
msg, ok = dit.initialize_service(project_root=ROOT, config_path="acestep-v15-xl-sft",
                                 device="auto", offload_to_cpu=False)
assert ok, f"DiT init failed: {msg}"
logger.info(f"DiT up in {time.time()-t0:.0f}s")

logger.info("init LM 1.7B (vllm) ...")
t0 = time.time()
lm = LLMHandler()
msg, ok = lm.initialize(checkpoint_dir=CKPT, lm_model_path="acestep-5Hz-lm-1.7B",
                        backend="vllm", device="auto", offload_to_cpu=False, dtype=None)
assert ok, f"LM init failed: {msg}"
logger.info(f"LM up in {time.time()-t0:.0f}s")

params = GenerationParams(task_type="text2music", thinking=True,
                          caption=CAPTION, lyrics=LYRICS, vocal_language="en",
                          duration=-1, inference_steps=50, guidance_scale=7.0, seed=42)
config = GenerationConfig(batch_size=1, audio_format="wav")

logger.info("generating ...")
t0 = time.time()
res = generate_music(dit, lm, params=params, config=config, save_dir=SAVE)
logger.info(f"gen done in {time.time()-t0:.0f}s success={res.success} {getattr(res,'status_message','')}")
for a in (res.audios or []):
    logger.info(f"  -> {a.get('path','(mem)')}")
