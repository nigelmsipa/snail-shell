#!/usr/bin/env python3
"""Verify a rendered board clip frame by frame before it is allowed to ship.

Written after a shell-quoting bug put apostrophes into the label on exactly the
frames that got refilled after a dropped render - 3 frames out of 780. Every
other check passed (frame count, duplicates, rule monotonicity, hero width,
background level) because none of them looked at the label. It shipped, and it
read as a white spark in playback.

The rule this encodes: measure EVERY text band on EVERY frame, and treat any
band whose width deviates from the median as a failure. A frame that differs
from its neighbours is a bug until proven otherwise.

  python3 verify_clip.py clip.mp4
"""

import subprocess, sys, tempfile, glob, os
from pathlib import Path
import numpy as np
from PIL import Image


def bands_of(gray, thresh=45, gap=12):
    d = np.abs(gray - np.median(gray))
    rows = np.where(d.max(axis=1) > thresh)[0]
    if not len(rows):
        return []
    out, s, prev = [], rows[0], rows[0]
    for r in rows[1:]:
        if r - prev > gap:
            out.append((s, prev))
            s = r
        prev = r
    out.append((s, prev))
    res = []
    for t, b in out:
        cols = np.where(d[t:b + 1].max(axis=0) > thresh)[0]
        res.append((int(t), int(b), int(cols.min()), int(cols.max())))
    return res


def main(path):
    W = Path(tempfile.mkdtemp(prefix="verify-"))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-vf", "fps=60",
                    str(W / "f_%05d.png")], check=True, capture_output=True)
    fs = sorted(glob.glob(str(W / "f_*.png")))
    print(f"{Path(path).name}: {len(fs)} frames")

    # per-frame band geometry, ignoring the first 15 frames (fade-ups)
    # the top rule is a progress bar - its width changes every frame by design,
    # so it is excluded. Only TEXT bands must stay geometrically identical.
    per = []
    for f in fs:
        g = np.array(Image.open(f).convert("L")).astype(int)
        per.append([b for b in bands_of(g) if b[0] > 30])

    stable = per[150:]
    counts = [len(b) for b in stable]
    modal = max(set(counts), key=counts.count)
    fails = []

    for i, b in enumerate(stable):
        if len(b) != modal:
            fails.append((i + 150, f"band count {len(b)} != {modal}"))

    # width of each band, compared against its own median across the clip
    for idx in range(modal):
        widths = [b[idx][3] - b[idx][2] + 1 for b in stable if len(b) == modal]
        med = int(np.median(widths))
        j = 0
        for i, b in enumerate(stable):
            if len(b) != modal:
                continue
            w = b[idx][3] - b[idx][2] + 1
            if abs(w - med) > 8:
                fails.append((i + 150, f"band {idx} width {w} vs median {med} ({w-med:+d}px)"))
            j += 1
        print(f"  band {idx}: median width {med}px")

    subprocess.run(["rm", "-rf", str(W)], capture_output=True)

    if fails:
        print(f"\nFAIL — {len(fails)} anomalous frame(s):")
        for i, why in fails[:20]:
            print(f"   frame {i:4} (t={i/60:5.2f}s)  {why}")
        return 1
    print("\nPASS — every frame's text geometry matches its neighbours")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
