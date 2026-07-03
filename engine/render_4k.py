import os
import json
import asyncio
import subprocess
import websockets
import urllib.request
import time

FPS = 30
WORK_DIR = "/home/nigel/wolf-and-word"
KJV_DIR = "/home/nigel/kjv-render"
AUDIO_PATH = f"{KJV_DIR}/genesis-01.opus"
ALIGNED_JSON = f"{KJV_DIR}/genesis-01-aligned.json"
OUT_VIDEO = f"{WORK_DIR}/genesis-01-4k.mp4"

async def main():
    # 1. Start headless chromium
    chrome_cmd = [
        "/usr/sbin/chromium",
        "--headless=new",
        "--disable-gpu",
        "--remote-debugging-port=9222",
        "--window-size=1920,1080",
        "--hide-scrollbars",
        "--mute-audio"
    ]
    print("Starting Chromium...")
    chrome_proc = subprocess.Popen(chrome_cmd)
    
    # Wait for CDP port
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

    print(f"CDP URL: {debugger_url}")
    
    # Run make_youtube.py to generate reading HTML
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
    
    # Read aligned duration
    with open(ALIGNED_JSON) as f:
        data = json.load(f)
    words = []
    if "words" in data:
        words = data["words"]
    else:
        for c in data.get("sentences", []):
            words.append({"e": c["end_ms"]})
    dur_ms = words[-1]["e"] if words else 243300
    reading_dur = (dur_ms / 1000.0) + 2.0  # pad 2 seconds at the end
    
    # Calculate frames
    THUMB_FRAMES = 3 * FPS
    LORE_FRAMES = 4 * FPS
    TOC_FRAMES = 4 * FPS
    READING_FRAMES = int(reading_dur * FPS)
    MEM_FRAMES = 5 * FPS
    CREDIT_FRAMES = 4 * FPS
    NEXT_FRAMES = 4 * FPS
    
    INTRO_SEC = (THUMB_FRAMES + LORE_FRAMES + TOC_FRAMES) / FPS
    
    # FFmpeg process
    ffmpeg_cmd = [
        "ffmpeg", "-y", 
        "-f", "image2pipe", "-vcodec", "png", "-r", str(FPS), "-i", "-",
        "-i", AUDIO_PATH,
        "-filter_complex", f"[1:a]adelay={int(INTRO_SEC*1000)}|{int(INTRO_SEC*1000)}[a]",
        "-map", "0:v", "-map", "[a]",
        "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "256k",
        OUT_VIDEO
    ]
    print(f"Starting FFmpeg: {' '.join(ffmpeg_cmd)}")
    ffmpeg_proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)
    
    async with websockets.connect(debugger_url, max_size=2**25) as ws:
        msg_id = 1
        async def call(method, params=None):
            nonlocal msg_id
            m_id = msg_id
            msg_id += 1
            await ws.send(json.dumps({"id": m_id, "method": method, "params": params or {}}))
            while True:
                resp = json.loads(await ws.recv())
                if resp.get("id") == m_id:
                    return resp.get("result", {})
                    
        await call("Page.enable")
        await call("Runtime.enable")
        
        # 4K override
        await call("Emulation.setDeviceMetricsOverride", {
            "width": 1920,
            "height": 1080,
            "deviceScaleFactor": 2.0,
            "mobile": False
        })
        
        async def capture_frames(count):
            for i in range(count):
                res = await call("Page.captureScreenshot", {"format": "png", "fromSurface": True})
                data = res["data"]
                import base64
                ffmpeg_proc.stdin.write(base64.b64decode(data))
                if i % 30 == 0:
                    print(f" Captured {i}/{count} frames...")

        async def load_and_prep(url, script):
            print(f"Loading {url}...")
            await call("Page.navigate", {"url": url})
            # Wait for load
            await asyncio.sleep(2)
            if script:
                await call("Runtime.evaluate", {"expression": script})
                await asyncio.sleep(0.5)

        # 1. Thumbnail
        await load_and_prep(f"file://{WORK_DIR}/thumbnail.html", '''
            document.querySelectorAll('.tn')[0].scrollIntoView();
            document.body.style.overflow = "hidden";
        ''')
        print("Capturing Thumbnail...")
        await capture_frames(THUMB_FRAMES)
        
        # 2. Lore v2
        await load_and_prep(f"file://{WORK_DIR}/bookends.html", '''
            document.querySelectorAll('.tn')[4].scrollIntoView();
            document.body.style.overflow = "hidden";
        ''')
        print("Capturing Lore...")
        await capture_frames(LORE_FRAMES)
        
        # 3. Contents
        await call("Runtime.evaluate", {"expression": "document.querySelectorAll('.tn')[1].scrollIntoView();"})
        await asyncio.sleep(0.5)
        print("Capturing Contents...")
        await capture_frames(TOC_FRAMES)
        
        # 4. Reading
        await load_and_prep(f"file://{WORK_DIR}/genesis-01-yt-passage.html", '''
            document.body.style.overflow = "hidden";
            // Ensure no TAP TO BEGIN overlay is blocking
            const veil = document.getElementById('veil');
            if(veil) veil.classList.add('hide');
        ''')
        print(f"Capturing Reading ({READING_FRAMES} frames)...")
        for i in range(READING_FRAMES):
            t_ms = (i / FPS) * 1000.0
            # lead is 180ms normally, let's just pass t_ms + 180 to window.renderFrame
            await call("Runtime.evaluate", {"expression": f"if(window.renderFrame) window.renderFrame({t_ms + 180});"})
            res = await call("Page.captureScreenshot", {"format": "png", "fromSurface": True})
            data = res["data"]
            import base64
            ffmpeg_proc.stdin.write(base64.b64decode(data))
            if i % 150 == 0:
                print(f" Reading: captured {i}/{READING_FRAMES} frames...")
                
        # 5. Memorization card
        await load_and_prep(f"file://{WORK_DIR}/memory-card.html", '''
            document.querySelectorAll('.tn')[0].scrollIntoView();
            document.body.style.overflow = "hidden";
        ''')
        print("Capturing Mem Card...")
        await capture_frames(MEM_FRAMES)
        
        # 6. Credits
        await load_and_prep(f"file://{WORK_DIR}/bookends.html", '''
            document.querySelectorAll('.tn')[2].scrollIntoView();
            document.body.style.overflow = "hidden";
        ''')
        print("Capturing Credits...")
        await capture_frames(CREDIT_FRAMES)
        
        # 7. Next Book
        await call("Runtime.evaluate", {"expression": "document.querySelectorAll('.tn')[3].scrollIntoView();"})
        await asyncio.sleep(0.5)
        print("Capturing Next Book...")
        await capture_frames(NEXT_FRAMES)
        
    ffmpeg_proc.stdin.close()
    ffmpeg_proc.wait()
    chrome_proc.terminate()
    print(f"Done! Saved to {OUT_VIDEO}")

if __name__ == "__main__":
    asyncio.run(main())
