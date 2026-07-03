#!/usr/bin/env python3
"""
render-server.py — GPU render server for VibeVoice TTS pipeline.

Run this on your GPU machine. This machine sends it PDFs/markdown and
gets back .opus + .html + .json files.

Usage:
    python server.py [--port 7272] [--output-dir ~/rendered]

Then from the client machine:
    curl -X POST http://GPU_IP:7272/render \
         -F "file=@document.pdf" \
         -F "voice=Carter" \
         --output document.zip
"""

import os
import sys
import uuid
import zipfile
import tempfile
import threading
import importlib.util
from pathlib import Path
from flask import Flask, request, jsonify, send_file

app = Flask(__name__)

OUTPUT_DIR = Path(os.environ.get("RENDER_OUTPUT_DIR",
                  Path.home() / "rendered")).expanduser()
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Import the hyphenated render module by path so we can call render() in-process.
_spec = importlib.util.spec_from_file_location(
    "render_vibevoice", str(Path(__file__).parent / "render-vibevoice.py"))
rv = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(rv)

# Kokoro (sherpa-onnx) module — loaded lazily on first use
_ko_spec = importlib.util.spec_from_file_location(
    "render_kokoro", str(Path(__file__).parent / "render.py"))
ko = importlib.util.module_from_spec(_ko_spec)
_ko_spec.loader.exec_module(ko)

# Build the VibeVoice engine ONCE at startup (stays resident in VRAM)
ENGINE = rv.Engine()
gpu_lock = threading.Lock()

# Track in-progress jobs
jobs = {}
jobs_lock = threading.Lock()


def _do_render(job_id, infile, voice, outbase, model="vibevoice"):
    with jobs_lock:
        jobs[job_id]["status"] = "rendering"
        jobs[job_id]["progress"] = {"done": 0, "total": 0, "audio_min": 0.0}

    def _progress(done, total, audio_sec):
        with jobs_lock:
            jobs[job_id]["progress"] = {
                "done": done,
                "total": total,
                "audio_min": round(audio_sec / 60, 1),
            }

    try:
        with gpu_lock:
            if model == "kokoro":
                sid = ko._voice_id(voice) if voice else 0
                ko.render(infile, str(outbase) + ".opus", sid=sid,
                          progress_cb=_progress)
            else:
                rv.render(infile, str(outbase) + ".opus", voice, engine=ENGINE,
                          progress_cb=_progress)
        with jobs_lock:
            jobs[job_id]["status"] = "done"
            jobs[job_id]["files"] = {
                "opus": str(outbase) + ".opus",
                "html": str(outbase) + ".html",
                "json": str(outbase) + ".json",
                "vtt":  str(outbase) + ".vtt",
            }
    except (Exception, SystemExit) as e:
        import traceback
        with jobs_lock:
            jobs[job_id]["status"] = "error"
            jobs[job_id]["error"] = traceback.format_exc()[-2000:] or str(e)


@app.route("/render", methods=["POST"])
def render():
    if "file" not in request.files:
        return jsonify({"error": "no file provided"}), 400

    f     = request.files["file"]
    voice = request.form.get("voice", "Carter")
    model = request.form.get("model", "vibevoice").lower()
    sync  = request.form.get("sync", "false").lower() == "true"

    suffix = Path(f.filename).suffix or ".pdf"
    tmp = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
    f.save(tmp.name)

    job_id  = str(uuid.uuid4())[:8]
    stem    = Path(f.filename).stem
    outbase = OUTPUT_DIR / f"{stem}-{job_id}"

    with jobs_lock:
        jobs[job_id] = {"status": "queued", "stem": stem, "model": model}

    if sync:
        # Block until done, then return zip
        _do_render(job_id, tmp.name, voice, outbase, model)
        os.unlink(tmp.name)
        with jobs_lock:
            job = jobs[job_id]
        if job["status"] == "error":
            return jsonify({"error": job.get("error", "unknown")}), 500
        return _zip_response(job["files"], stem)
    else:
        # Fire and forget, return job ID immediately
        t = threading.Thread(target=_do_render,
                             args=(job_id, tmp.name, voice, outbase, model),
                             daemon=True)
        t.start()
        return jsonify({"job_id": job_id, "status": "queued"}), 202


@app.route("/progress/<job_id>")
def progress(job_id):
    with jobs_lock:
        job = jobs.get(job_id)
    if not job:
        return jsonify({"error": "job not found"}), 404
    p = job.get("progress", {})
    return jsonify({
        "job_id":    job_id,
        "status":    job["status"],
        "done":      p.get("done", 0),
        "total":     p.get("total", 0),
        "audio_min": p.get("audio_min", 0.0),
    })


@app.route("/status/<job_id>")
def status(job_id):
    with jobs_lock:
        job = jobs.get(job_id)
    if not job:
        return jsonify({"error": "job not found"}), 404
    return jsonify({"job_id": job_id, **{k: v for k, v in job.items()
                                         if k != "files"}})


@app.route("/download/<job_id>")
def download(job_id):
    with jobs_lock:
        job = jobs.get(job_id)
    if not job:
        return jsonify({"error": "job not found"}), 404
    if job["status"] != "done":
        return jsonify({"error": "not ready", "status": job["status"]}), 409
    return _zip_response(job["files"], job["stem"])


@app.route("/voices")
def voices():
    import glob
    vdir = Path(__file__).parent.parent / "VibeVoice/demo/voices/streaming_model"
    names = [Path(p).stem.split("_")[0].split("-")[-1]
             for p in glob.glob(str(vdir / "*.pt"))]
    return jsonify({"voices": sorted(set(names))})


@app.route("/health")
def health():
    return jsonify({"ok": True})


def _zip_response(files, stem):
    zip_path = OUTPUT_DIR / f"{stem}.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for key, path in files.items():
            if os.path.exists(path):
                zf.write(path, Path(path).name)
    return send_file(str(zip_path), as_attachment=True,
                     download_name=f"{stem}.zip",
                     mimetype="application/zip")


if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--port", type=int, default=7272)
    p.add_argument("--host", default="0.0.0.0")
    p.add_argument("--output-dir", default=str(OUTPUT_DIR))
    args = p.parse_args()
    OUTPUT_DIR = Path(args.output_dir)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Render server on {args.host}:{args.port}")
    print(f"Output dir: {OUTPUT_DIR}")
    app.run(host=args.host, port=args.port, threaded=True)
