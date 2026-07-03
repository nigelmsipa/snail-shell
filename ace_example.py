#!/usr/bin/env python3
"""Diagnostic: run ACE-Step's OWN bundled example_01.json with the repo's validated
turbo config — only the LM backend swapped mlx->vllm for CUDA. Settles whether the
install works at all."""
import os, sys, time, json
for v in ("http_proxy","https_proxy","HTTP_PROXY","HTTPS_PROXY","ALL_PROXY"):
    os.environ.pop(v, None)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from loguru import logger
from acestep.handler import AceStepHandler
from acestep.llm_inference import LLMHandler
from acestep.inference import GenerationParams, GenerationConfig, generate_music

ROOT = os.path.dirname(os.path.abspath(__file__))
CKPT = os.path.join(ROOT, "checkpoints")
SAVE = "/workspace/bakeoff/ace_example"
os.makedirs(SAVE, exist_ok=True)
EX = os.path.join(ROOT, "examples", "text2music", "example_01.json")
ex = json.load(open(EX, encoding="utf-8"))

logger.info("init DiT turbo ...")
dit = AceStepHandler()
msg, ok = dit.initialize_service(project_root=ROOT, config_path="acestep-v15-turbo",
                                 device="auto", offload_to_cpu=False)
assert ok, f"DiT init failed: {msg}"

logger.info("init LM 0.6B (vllm) ...")
lm = LLMHandler()
msg, ok = lm.initialize(checkpoint_dir=CKPT, lm_model_path="acestep-5Hz-lm-1.7B",
                        backend="vllm", device="auto", offload_to_cpu=False, dtype=None)
assert ok, f"LM init failed: {msg}"

params = GenerationParams(task_type="text2music", thinking=ex.get("think", True),
                          caption=ex.get("caption",""), lyrics=ex.get("lyrics",""),
                          bpm=ex.get("bpm"), keyscale=ex.get("keyscale",""),
                          timesignature=ex.get("timesignature",""),
                          vocal_language=ex.get("language","en"), duration=ex.get("duration"),
                          inference_steps=8, guidance_scale=1.0, seed=-1)
config = GenerationConfig(batch_size=1, audio_format="wav")
logger.info("generating bundled example ...")
t0 = time.time()
res = generate_music(dit, lm, params=params, config=config, save_dir=SAVE)
logger.info(f"done in {time.time()-t0:.0f}s success={res.success}")
for a in (res.audios or []):
    logger.info(f"  -> {a.get('path','(mem)')}")
