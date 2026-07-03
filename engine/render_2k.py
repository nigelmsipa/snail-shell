import os
import json
import asyncio
import base64
import urllib.request
import time
import subprocess
import shutil

FPS = 30
WORK_DIR = "/home/nigel/wolf-and-word"
KJV_DIR = "/home/nigel/kjv-render"
AUDIO_PATH = f"{KJV_DIR}/genesis-01.opus"
ALIGNED_JSON = f"{KJV_DIR}/genesis-01-aligned.json"
OUT_VIDEO = f"{WORK_DIR}/genesis-01-2k.mp4"
FRAMES_DIR = f"{WORK_DIR}/frames"

async def main():
    if os.path.exists(FRAMES_DIR):
        shutil.rmtree(FRAMES_DIR)
    os.makedirs(FRAMES_DIR)

    chrome_cmd = [
        "/usr/sbin/chromium",
        "--headless",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--remote-debugging-port=9222",
        "--window-size=1920,1080",
        "--force-device-scale-factor=1.333333",
        "--hide-scrollbars",
        "--mute-audio"
    ]
    print("Starting Chromium...")
    chrome_proc = subprocess.Popen(chrome_cmd)
    
    debugger_url = None
    for _ in range(30):
        try:
            req = urllib.request.urlopen("http://127.0.0.1:9222/json")
            tabs = json.loads(req.read())
            if tabs:
                debugger_url = tabs[0]["webSocketDebuggerUrl"]
                break
        except Exception:
            pass
        time.sleep(0.5)
        
    if not debugger_url:
        print("Failed to get CDP URL")
        chrome_proc.terminate()
        return

    print("Generating reading HTML...")
    subprocess.run([
        "python3", "make_youtube.py", ALIGNED_JSON,
        "--layout", "passage",
        "--title", "Genesis 1",
        "--sub", "King James Version",
        "--units", "genesis-01-units.json",
        "--scene-src", "/home/nigel/memory-method-bible/data/base-structure/genesis-base.json",
        "--scene-tier", "scene",
        "--theme", "kjv"
    ], check=True, cwd=WORK_DIR)
    
    with open(ALIGNED_JSON) as f:
        data = json.load(f)
    words = data.get("words", [])
    if not words:
        for c in data.get("sentences", []):
            words.append({"e": c["end_ms"]})
    dur_ms = words[-1]["e"] if words else 243300
    reading_dur = (dur_ms / 1000.0) + 2.0 
    
    THUMB_FRAMES = 3 * FPS
    LORE_FRAMES = 4 * FPS
    TOC_FRAMES = 4 * FPS
    READING_FRAMES = int(reading_dur * FPS)
    MEM_FRAMES = 5 * FPS
    CREDIT_FRAMES = 4 * FPS
    NEXT_FRAMES = 4 * FPS
    
    INTRO_SEC = (THUMB_FRAMES + LORE_FRAMES + TOC_FRAMES) / FPS
    
    import websockets
    async with websockets.connect(debugger_url, max_size=2**25) as ws:
        msg_id = 1
        async def call(method, params=None):
            nonlocal msg_id
            m_id = msg_id
            msg_id += 1
            await ws.send(json.dumps({"id": m_id, "method": method, "params": params or {}}))
            print(f"Sent {method} (id={m_id})", flush=True)
            while True:
                msg = await ws.recv()
                resp = json.loads(msg)
                if resp.get("id") == m_id:
                    if "error" in resp:
                        print(f"CDP ERROR on {method}: {resp['error']}", flush=True)
                    return resp.get("result", {})
                    
        await call("Page.enable")
        await call("Runtime.enable")
        
        frame_idx = 0
        async def capture_frames(count):
            nonlocal frame_idx
            for i in range(count):
                res = await call("Page.captureScreenshot", {"format": "png"})
                with open(f"{FRAMES_DIR}/frame_{frame_idx:06d}.png", "wb") as f:
                    f.write(base64.b64decode(res["data"]))
                frame_idx += 1
                if i % 30 == 0:
                    print(f" Captured {i}/{count} frames...", flush=True)

        async def load_and_prep(url, script):
            print(f"Loading {url}...")
            await call("Page.navigate", {"url": url})
            await asyncio.sleep(2)
            if script:
                await call("Runtime.evaluate", {"expression": script})
                await asyncio.sleep(0.5)

        await load_and_prep(f"file://{WORK_DIR}/thumbnail.html", '''
            document.querySelectorAll('.tn')[0].scrollIntoView();
            document.body.style.overflow = "hidden";
        ''')
        print("Capturing Thumbnail...", flush=True)
        await capture_frames(THUMB_FRAMES)
        
        await load_and_prep(f"file://{WORK_DIR}/bookends.html", '''
            document.querySelectorAll('.tn')[4].scrollIntoView();
            document.body.style.overflow = "hidden";
        ''')
        print("Capturing Lore...", flush=True)
        await capture_frames(LORE_FRAMES)
        
        await call("Runtime.evaluate", {"expression": "document.querySelectorAll('.tn')[1].scrollIntoView();"})
        await asyncio.sleep(0.5)
        print("Capturing Contents...", flush=True)
        await capture_frames(TOC_FRAMES)
        
        await load_and_prep(f"file://{WORK_DIR}/genesis-01-yt-passage.html", '''
            document.body.style.overflow = "hidden";
            const veil = document.getElementById('veil');
            if(veil) veil.classList.add('hide');
        ''')
        print(f"Capturing Reading ({READING_FRAMES} frames)...", flush=True)
        for i in range(READING_FRAMES):
            t_ms = (i / FPS) * 1000.0
            await call("Runtime.evaluate", {"expression": f"if(window.renderFrame) window.renderFrame({t_ms + 180});"})
            res = await call("Page.captureScreenshot", {"format": "png"})
            with open(f"{FRAMES_DIR}/frame_{frame_idx:06d}.png", "wb") as f:
                f.write(base64.b64decode(res["data"]))
            frame_idx += 1
            if i % 150 == 0:
                print(f" Reading: captured {i}/{READING_FRAMES} frames...", flush=True)
                
        await load_and_prep(f"file://{WORK_DIR}/memory-card.html", '''
            document.querySelectorAll('.tn')[0].scrollIntoView();
            document.body.style.overflow = "hidden";
        ''')
        print("Capturing Mem Card...", flush=True)
        await capture_frames(MEM_FRAMES)
        
        await load_and_prep(f"file://{WORK_DIR}/bookends.html", '''
            document.querySelectorAll('.tn')[2].scrollIntoView();
            document.body.style.overflow = "hidden";
        ''')
        print("Capturing Credits...", flush=True)
        await capture_frames(CREDIT_FRAMES)
        
        await call("Runtime.evaluate", {"expression": "document.querySelectorAll('.tn')[3].scrollIntoView();"})
        await asyncio.sleep(0.5)
        print("Capturing Next Book...", flush=True)
        await capture_frames(NEXT_FRAMES)
        
    chrome_proc.terminate()
    print("All frames captured. Starting FFmpeg encoding...", flush=True)
    
    ffmpeg_cmd = [
        "ffmpeg", "-y", 
        "-framerate", str(FPS), "-i", f"{FRAMES_DIR}/frame_%06d.png",
        "-i", AUDIO_PATH,
        "-filter_complex", f"[1:a]adelay={int(INTRO_SEC*1000)}|{int(INTRO_SEC*1000)}[a]",
        "-map", "0:v", "-map", "[a]",
        "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "256k",
        OUT_VIDEO
    ]
    subprocess.run(ffmpeg_cmd, check=True)
    print("Encoding complete! Cleaning up frames...", flush=True)
    shutil.rmtree(FRAMES_DIR)
    print(f"Done! Saved to {OUT_VIDEO}", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
