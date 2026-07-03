#!/usr/bin/env python3
"""ylt_render.py — render YLT books to per-chapter audio via Google Cloud TTS.
Chunks long chapters under the 5000-byte request limit (hierarchically, so even a
punctuation-free run like a genealogy splits), tracks cumulative characters against
a CAP so it can never spill past the monthly free tier, resume-safe, and skips a
failed chapter instead of dying.  Output: ~/wolf-and-word/ylt/<slug>-NN.mp3 (+ .txt)

Usage: ylt_render.py <voice> <char_cap> "Book:chapters" ["Book:chapters" ...]
"""
import os, re, sys, json, base64, time, glob, subprocess, urllib.request, urllib.error

KEY = open(os.path.expanduser("~/.config/natural-reader/google-tts.key")).read().strip()
SRC = os.path.expanduser("~/youngsliteral/YLT")
OUTD = os.path.expanduser("~/wolf-and-word/ylt"); os.makedirs(OUTD, exist_ok=True)
MAXBYTES = 4800  # safety under Google's 5000-byte/request limit


def chapter_text(book, chap):
    pat = re.compile(r"^%s %d:\d+\t(.*)$" % (re.escape(book), chap))
    parts = []
    for line in open(SRC, encoding="utf-8"):
        m = pat.match(line.rstrip("\n"))
        if m:
            parts.append(re.sub(r"\s+", " ", m.group(1)).strip())
    return " ".join(parts)


SENT_LIMIT = 700  # Studio voices reject over-long *sentences*; break these up


def tame_sentences(text):
    """Studio TTS rejects sentences that are too long (e.g. Luke 3 genealogy, one
    76-clause comma-run). For any over-limit sentence, turn its internal comma/
    semicolon separators into sentence stops. Words are unchanged, so alignment
    against the original text is unaffected — only the rendered prosody pauses more."""
    out = []
    for s in re.split(r"(?<=[.!?]) ", text):
        if len(s.encode()) <= SENT_LIMIT:
            out.append(s); continue
        s = re.sub(r"\s*[;:]\s+", ". ", s)
        s = re.sub(r",\s+", ". ", s)
        # any still-too-long piece (no separators): hard-stop at words
        fixed = []
        for piece in re.split(r"(?<=[.!?]) ", s):
            if len(piece.encode()) <= SENT_LIMIT:
                fixed.append(piece); continue
            cur = ""
            for w in piece.split(" "):
                cand = (cur + " " + w).strip()
                if len(cand.encode()) > SENT_LIMIT and cur:
                    fixed.append(cur + "."); cur = w
                else:
                    cur = cand
            if cur:
                fixed.append(cur)
        out.append(" ".join(fixed))
    return " ".join(out)


def _too_big(s):
    return len(s.encode()) > MAXBYTES


def _hard_split(s):
    """Split a too-long string: commas, then words. Guarantees pieces <= MAXBYTES."""
    out = []
    for part in re.split(r"(?<=,) ", s):
        if not _too_big(part):
            out.append(part); continue
        cur = ""
        for w in part.split(" "):
            cand = (cur + " " + w).strip()
            if _too_big(cand) and cur:
                out.append(cur); cur = w
            else:
                cur = cand
        if cur:
            out.append(cur)
    return out


def split_chunks(text):
    if not _too_big(text):
        return [text]
    chunks, cur = [], ""
    for s in re.split(r"(?<=[.!?;]) ", text):
        for piece in ([s] if not _too_big(s) else _hard_split(s)):
            cand = (cur + " " + piece).strip()
            if _too_big(cand) and cur:
                chunks.append(cur); cur = piece
            else:
                cur = cand
    if cur:
        chunks.append(cur)
    return chunks


def synth(text, voice, tries=5):
    body = json.dumps({"input": {"text": text},
                       "voice": {"languageCode": "en-US", "name": voice},
                       "audioConfig": {"audioEncoding": "MP3"}}).encode()
    url = "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + KEY
    for k in range(tries):
        try:
            req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
            return base64.b64decode(json.load(urllib.request.urlopen(req, timeout=120))["audioContent"])
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 503) and k < tries - 1:
                time.sleep(2 ** k + 1); continue
            raise


def main():
    voice, cap = sys.argv[1], int(sys.argv[2])
    books = sys.argv[3:]
    usage_f = os.path.join(OUTD, ".usage_%s.txt" % voice)
    used = int(open(usage_f).read().strip() or 0) if os.path.exists(usage_f) else 0
    for spec in books:
        book, n = spec.rsplit(":", 1); n = int(n)
        slug = book.lower().replace(" ", "")
        for c in range(1, n + 1):
            base = "%s-%02d" % (slug, c)
            out = os.path.join(OUTD, base + ".mp3")
            if os.path.exists(out):
                continue
            text = chapter_text(book, c)
            if not text:
                print("MISSING text %s" % base, flush=True); continue
            for tmp in glob.glob(os.path.join(OUTD, "_%s_*.mp3" % base)):
                os.remove(tmp)
            try:
                parts = []
                for i, ch in enumerate(split_chunks(tame_sentences(text))):
                    if used + len(ch) > cap:
                        print("CAP REACHED at %s (used %d) — STOP" % (base, used), flush=True)
                        open(usage_f, "w").write(str(used)); return
                    p = os.path.join(OUTD, "_%s_%d.mp3" % (base, i))
                    open(p, "wb").write(synth(ch, voice)); parts.append(p)
                    used += len(ch); open(usage_f, "w").write(str(used))
                if len(parts) == 1:
                    os.rename(parts[0], out)
                else:
                    lst = os.path.join(OUTD, "_%s.txt" % base)
                    open(lst, "w").write("\n".join("file '%s'" % p for p in parts))
                    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0",
                                    "-i", lst, "-c", "copy", out], check=True)
                    for p in parts:
                        os.remove(p)
                    os.remove(lst)
                open(os.path.join(OUTD, base + ".txt"), "w").write(text + "\n")
                print("  %s | %d chars | total %d/%d" % (base, len(text), used, cap), flush=True)
            except Exception as e:
                print("FAILED %s: %s" % (base, str(e)[:160]), flush=True)
                for tmp in glob.glob(os.path.join(OUTD, "_%s*" % base)):
                    os.remove(tmp)
                continue
    print("DONE voice=%s used=%d/%d" % (voice, used, cap), flush=True)


if __name__ == "__main__":
    main()
