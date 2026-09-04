#!/usr/bin/env python3
"""
Wolf & The Word — per-beat audio generation for the 365-day Bible reading calendar.

Two voices:
  Bella  — speaks the daily reading announcement (one short line per day)
  David  — speaks the chapter cues AND the full chapter text

Beats per day (from WolfandWordProductionScript_v1.json):
  reading_announcement (Bella) -> opening_prayer (no speech) -> scripture (David)
  -> closing_prayer (no speech) -> transition

The prayer beats are sound + visual only; no audio is generated for them, but they
appear in the manifest as gaps so an editor or assembly script knows where they slot.

Commands:
  clone     --sample FILE --name NAME       clone a voice, print its voice_id
  generate  --days 1,237,359 | --all        generate per-beat audio
  qa        --days ... | --all              transcribe back and diff
  manifest  --all                           (re)write manifests only, no API calls

Add --dry-run to any of generate/qa to plan without spending API credit.
"""

import argparse
import json
import os
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCRIPT_JSON = ROOT / "WolfandWordProductionScript_v1.json"
VERSES_JSON = ROOT / "kjv_verses.json"
AUDIO_DIR = ROOT / "audio"
MANIFEST_DIR = AUDIO_DIR / "manifests"
QA_STATE = AUDIO_DIR / "qa_state.json"

DEFAULT_MODEL = "eleven_v3"
SCRIBE_MODEL = "scribe_v1"
WORD_COUNT_TOLERANCE = 0.03  # 3% for full-chapter audio

# The production script and the KJV text disagree on two book names.
BOOK_ALIASES = {
    "Psalms": "Psalm",
    "Song of Songs": "Song of Solomon",
}

# David's KJV narration already exists — 1189 chapters at ~/openbible-kjv/, with
# word-level alignment. His beats are REFERENCED, never re-synthesized. Each file
# opens with his own spoken "<Book>. Chapter N." header; the first aligned word
# gives the exact second scripture starts, so the header doubles as the chapter
# intro beat and the remainder is the chapter text beat.
KJV_AUDIO_DIR = ROOT / "openbible-kjv"
AUDIO_SLUG_FIXUPS = {"songofsongs": "songofsolomon"}


# --------------------------------------------------------------------------
# data loading
# --------------------------------------------------------------------------

_verse_index = None


def load_verses():
    """book -> chapter -> [(verse, word_count, text), ...]"""
    global _verse_index
    if _verse_index is None:
        _verse_index = {}
        for book, chapter, verse, wc, text in json.loads(VERSES_JSON.read_text()):
            _verse_index.setdefault(book, {}).setdefault(chapter, []).append((verse, wc, text))
    return _verse_index


def load_days():
    return json.loads(SCRIPT_JSON.read_text())


def build_chapter_text(book, chapter):
    """All verses of book+chapter, verse-sorted, joined as spoken prose.

    Verse numbers are never spoken — just the prose, one space between verses.
    """
    idx = load_verses()
    key = BOOK_ALIASES.get(book, book)
    if key not in idx:
        raise KeyError(f"unknown book {book!r} (tried {key!r})")
    if chapter not in idx[key]:
        raise KeyError(f"{key} has no chapter {chapter}")
    verses = sorted(idx[key][chapter], key=lambda v: v[0])
    return " ".join(text for _, _, text in verses)


# --------------------------------------------------------------------------
# chapter cues -> (book, chapter) slots
# --------------------------------------------------------------------------

CUE_WITH_BOOK = re.compile(r"^(.+?)\.\s*Chapter\s+(\d+)\.$")
CUE_CHAPTER_ONLY = re.compile(r"^Chapter\s+(\d+)\.$")


def parse_chapter_cues(cues):
    """['Genesis. Chapter 1.', 'Chapter 2.'] -> [('Genesis',1), ('Genesis',2)]

    A cue naming a book starts a new book; a bare 'Chapter N.' continues the
    current one. This is the positional mapping between cues and chapter text.
    """
    slots, current_book = [], None
    for cue in cues:
        m = CUE_WITH_BOOK.match(cue)
        if m:
            current_book = m.group(1)
            slots.append((current_book, int(m.group(2))))
            continue
        m = CUE_CHAPTER_ONLY.match(cue)
        if m:
            if current_book is None:
                raise ValueError(f"cue {cue!r} has no preceding book")
            slots.append((current_book, int(m.group(1))))
            continue
        raise ValueError(f"unparsable chapter cue: {cue!r}")
    return slots


def slug(book):
    s = re.sub(r"[^a-z0-9]", "", book.lower())
    return AUDIO_SLUG_FIXUPS.get(s, s)


def kjv_source(book, chapter):
    """Locate David's existing recording for this chapter and its header split.

    Returns (audio_path, scripture_starts_at_seconds). Everything before that
    offset is David speaking the chapter header; everything after is the reading.
    """
    base = f"{slug(book)}-{chapter:02d}"
    audio = KJV_AUDIO_DIR / f"{base}.opus"
    aligned = KJV_AUDIO_DIR / f"{base}-aligned.json"
    if not audio.exists():
        return None, None
    offset = None
    if aligned.exists():
        try:
            words = json.loads(aligned.read_text())["words"]
            if words:
                offset = words[0]["s"] / 1000.0
        except (KeyError, ValueError, json.JSONDecodeError):
            offset = None
    return audio, offset


def beat_filenames(day, slots):
    """Per-slot (intro, text) filenames.

    Spec naming is day{NNN}_david_ch{N}_{intro,text}.mp3, but a day spanning
    several books can repeat a chapter number (Dec 25 has 1 John 1, 2 John 1
    and 3 John 1). Those days get the book slug added so nothing is overwritten.
    """
    chapters = [c for _, c in slots]
    ambiguous = len(chapters) != len(set(chapters))
    names = []
    for book, chapter in slots:
        stem = f"day{day:03d}_david"
        if ambiguous:
            stem += f"_{slug(book)}"
        stem += f"_ch{chapter}"
        names.append((f"{stem}_intro.mp3", f"{stem}_text.mp3"))
    return names, ambiguous


# --------------------------------------------------------------------------
# manifest
# --------------------------------------------------------------------------

def build_day_manifest(entry):
    day = entry["day"]
    slots = parse_chapter_cues(entry["david_chapter_cues"])
    names, ambiguous = beat_filenames(day, slots)
    cues = entry["david_chapter_cues"]

    prayer = next((b for b in entry["structure"] if b["beat"] == "opening_prayer"), {})
    closing = next((b for b in entry["structure"] if b["beat"] == "closing_prayer"), {})
    transition = next((b for b in entry["structure"] if b["beat"] == "transition"), {})

    beats = [
        {
            "beat": "reading_announcement",
            "speaker": "Bella",
            "text": entry["bella_reading_announcement"],
            "file": f"day{day:03d}_bella_announcement.mp3",
        },
        {
            "beat": "opening_prayer",
            "speaker": None,
            "file": None,
            "sound": prayer.get("sound"),
            "on_screen_text": prayer.get("on_screen_text"),
            "visual": prayer.get("visual"),
            "note": "no TTS - sound + visual only",
        },
    ]

    scripture = []
    for (book, chapter), (intro_f, text_f), cue in zip(slots, names, cues):
        audio, offset = kjv_source(book, chapter)
        rel = str(audio.relative_to(ROOT)) if audio else None
        scripture.append(
            {
                "book": book,
                "chapter": chapter,
                "source": rel,
                "source_missing": audio is None,
                "header_split_sec": offset,
                "intro": {
                    "speaker": "David",
                    "text": cue,
                    "source": rel,
                    "start_sec": 0.0,
                    "end_sec": offset,
                    "note": "existing narration - David's own spoken chapter header",
                },
                "text": {
                    "speaker": "David",
                    "source": rel,
                    "start_sec": offset,
                    "end_sec": None,
                    "word_count": len(build_chapter_text(book, chapter).split()),
                    "note": "existing narration - no TTS",
                },
            }
        )
    beats.append({"beat": "scripture", "speaker": "David", "chapters": scripture})

    beats.append(
        {
            "beat": "closing_prayer",
            "speaker": None,
            "file": None,
            "sound": closing.get("sound"),
            "on_screen_text": closing.get("on_screen_text"),
            "visual": closing.get("visual"),
            "pre_silence_sec": closing.get("pre_silence_sec"),
            "note": "no TTS - sound + visual only",
        }
    )
    beats.append({"beat": "transition", "type": transition.get("type")})

    return {
        "day": day,
        "date": entry["date"],
        "reading": entry["reading"],
        "is_month_end": entry["is_month_end"],
        "ending": transition.get("type"),
        "disambiguated_filenames": ambiguous,
        "beats": beats,
    }


def write_manifests(entries):
    MANIFEST_DIR.mkdir(parents=True, exist_ok=True)
    combined = []
    for entry in entries:
        m = build_day_manifest(entry)
        (MANIFEST_DIR / f"day{entry['day']:03d}.json").write_text(
            json.dumps(m, indent=1, ensure_ascii=False)
        )
        combined.append(m)
    (AUDIO_DIR / "manifest.json").write_text(json.dumps(combined, indent=1, ensure_ascii=False))
    return combined


# --------------------------------------------------------------------------
# ElevenLabs
# --------------------------------------------------------------------------

def client():
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("ELEVENLABS_API_KEY is not set in this shell.")
    try:
        from elevenlabs.client import ElevenLabs
    except ImportError:
        sys.exit("elevenlabs package not installed - run: pip install elevenlabs")
    return ElevenLabs(api_key=key)


def cmd_clone(args):
    sample = Path(args.sample)
    if not sample.exists():
        sys.exit(f"sample not found: {sample}")
    c = client()
    with open(sample, "rb") as fh:
        voice = c.voices.ivc.create(name=args.name, files=[fh])
    print(f"voice_id for {args.name!r}: {voice.voice_id}")
    return voice.voice_id


def synth(c, text, voice_id, model, out_path):
    audio = c.text_to_speech.convert(voice_id=voice_id, text=text, model_id=model)
    data = b"".join(audio) if hasattr(audio, "__iter__") and not isinstance(audio, bytes) else audio
    out_path.write_bytes(data)
    return len(data)


# --------------------------------------------------------------------------
# QA
# --------------------------------------------------------------------------

_UNITS = {
    "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6,
    "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12,
    "thirteen": 13, "fourteen": 14, "fifteen": 15, "sixteen": 16,
    "seventeen": 17, "eighteen": 18, "nineteen": 19,
    "first": 1, "second": 2, "third": 3, "fourth": 4, "fifth": 5, "sixth": 6,
    "seventh": 7, "eighth": 8, "ninth": 9, "tenth": 10, "eleventh": 11,
    "twelfth": 12, "thirteenth": 13, "fourteenth": 14, "fifteenth": 15,
    "sixteenth": 16, "seventeenth": 17, "eighteenth": 18, "nineteenth": 19,
}
_TENS = {
    "twenty": 20, "thirty": 30, "forty": 40, "fifty": 50, "sixty": 60,
    "seventy": 70, "eighty": 80, "ninety": 90,
    "twentieth": 20, "thirtieth": 30, "fortieth": 40, "fiftieth": 50,
    "sixtieth": 60, "seventieth": 70, "eightieth": 80, "ninetieth": 90,
}


def _words_to_digits(tokens):
    """Fold spelled-out numbers ('one hundred nineteen') into digits ('119')."""
    out, i = [], 0
    while i < len(tokens):
        t = tokens[i]
        if t in _UNITS or t in _TENS or t in ("hundred", "hundredth"):
            total, j = 0, i
            while j < len(tokens):
                w = tokens[j]
                if w in ("hundred", "hundredth"):
                    total = (total or 1) * 100
                elif w in _TENS:
                    total += _TENS[w]
                elif w in _UNITS:
                    total += _UNITS[w]
                elif (
                    w == "and"
                    and total >= 100  # only inside "one hundred and nineteen"
                    and j + 1 < len(tokens)
                    and (tokens[j + 1] in _UNITS or tokens[j + 1] in _TENS)
                ):
                    pass  # never join "four and five" - those are two chapters
                else:
                    break
                j += 1
            out.append(str(total))
            i = j
        else:
            out.append(t)
            i += 1
    return out


def normalize(text):
    """Canonical form for diffing speech against the written line.

    Folds case, punctuation, ordinal suffixes ('1st' -> '1') and spelled-out
    numbers ('chapters one to three' -> 'chapters 1 to 3'). Without this the
    diff flags every day, because a voice naturally speaks digits as words.
    """
    text = unicodedata.normalize("NFKD", text).lower()
    text = re.sub(r"\b(\d+)(st|nd|rd|th)\b", r"\1", text)
    # Punctuation becomes a barrier token so number folding cannot run across a
    # comma - 'five, second' must stay [5, 2], never sum to 7.
    text = re.sub(r"[^\w\s]", " \x00 ", text)
    folded = _words_to_digits(text.split())
    return " ".join(t for t in folded if t != "\x00")


def transcribe(c, path):
    with open(path, "rb") as fh:
        r = c.speech_to_text.convert(file=fh, model_id=SCRIBE_MODEL)
    return r.text


def load_qa_state():
    if QA_STATE.exists():
        return json.loads(QA_STATE.read_text())
    return {}


def save_qa_state(state):
    QA_STATE.parent.mkdir(parents=True, exist_ok=True)
    QA_STATE.write_text(json.dumps(state, indent=1, ensure_ascii=False))


# --------------------------------------------------------------------------
# generate / qa
# --------------------------------------------------------------------------

def select(entries, args):
    if args.all:
        return entries
    if not args.days:
        sys.exit("pass --days 1,237,359 or --all")
    wanted = {int(d) for d in args.days.split(",")}
    picked = [e for e in entries if e["day"] in wanted]
    missing = wanted - {e["day"] for e in picked}
    if missing:
        sys.exit(f"no such day(s): {sorted(missing)}")
    return picked


def cmd_generate(args):
    entries = select(load_days(), args)
    manifests = {m["day"]: m for m in write_manifests(load_days())}
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    qa_state = load_qa_state()

    jobs = []  # (file, speaker, voice_id, text)
    for entry in entries:
        m = manifests[entry["day"]]
        for beat in m["beats"]:
            if beat["beat"] == "reading_announcement":
                jobs.append((beat["file"], "Bella", args.bella_voice, beat["text"]))
            # David's beats are existing narration referenced by the manifest.
            # Nothing to synthesize, nothing to spend.

    todo, skipped = [], 0
    for fname, speaker, vid, text in jobs:
        path = AUDIO_DIR / fname
        if path.exists() and not args.overwrite and qa_state.get(fname, {}).get("passed"):
            skipped += 1
            continue
        todo.append((fname, speaker, vid, text))

    chars = sum(len(t) for _, _, _, t in todo)
    print(f"days: {[e['day'] for e in entries]}")
    print(f"files planned: {len(jobs)}   to generate: {len(todo)}   skipped (exists+QA-passed): {skipped}")
    print(f"characters to spend: {chars:,}")
    print(f"model: {args.model}")

    if args.dry_run:
        print("\n--- DRY RUN, no API calls ---")
        for fname, speaker, _, text in todo:
            preview = text if len(text) <= 70 else text[:67] + "..."
            print(f"  {fname:44} {speaker:6} {len(text):>6,}ch  {preview}")
        return

    if not args.bella_voice:
        sys.exit("pass --bella-voice (David needs none - his narration already exists)")

    c = client()
    for i, (fname, speaker, vid, text) in enumerate(todo, 1):
        n = synth(c, text, vid, args.model, AUDIO_DIR / fname)
        print(f"  [{i}/{len(todo)}] {fname}  {n//1024}KB  ({len(text):,}ch)")
        qa_state.setdefault(fname, {})["passed"] = False
    save_qa_state(qa_state)


def cmd_qa(args):
    entries = select(load_days(), args)
    manifests = {m["day"]: m for m in write_manifests(load_days())}
    qa_state = load_qa_state()

    checks = []  # (file, kind, expected)
    for entry in entries:
        m = manifests[entry["day"]]
        for beat in m["beats"]:
            if beat["beat"] == "reading_announcement":
                checks.append((beat["file"], "exact", beat["text"]))
            # David's beats are pre-existing, already-verified narration - not re-QA'd.

    pending = [c for c in checks if (AUDIO_DIR / c[0]).exists()]
    absent = [c[0] for c in checks if not (AUDIO_DIR / c[0]).exists()]
    if args.dry_run:
        print(f"would transcribe {len(pending)} file(s); {len(absent)} not yet generated")
        return

    c = client()
    mismatches = []
    for fname, kind, expected in pending:
        if qa_state.get(fname, {}).get("passed") and not args.overwrite:
            continue
        heard = transcribe(c, AUDIO_DIR / fname)
        if kind == "exact":
            ok = normalize(heard) == normalize(expected)
            detail = {"expected": expected, "heard": heard.strip()}
        else:
            exp_n, got_n = len(expected.split()), len(heard.split())
            drift = abs(got_n - exp_n) / exp_n if exp_n else 1.0
            ok = drift <= WORD_COUNT_TOLERANCE
            detail = {"expected_words": exp_n, "heard_words": got_n, "drift_pct": round(drift * 100, 2)}
        qa_state.setdefault(fname, {})["passed"] = ok
        if not ok:
            mismatches.append({"file": fname, "check": kind, **detail})
    save_qa_state(qa_state)

    print(f"checked {len(pending)} file(s); {len(mismatches)} mismatch(es)")
    for m in mismatches:
        print(f"\n  {m['file']}  [{m['check']}]")
        if m["check"] == "exact":
            print(f"    expected: {m['expected']}")
            print(f"    heard   : {m['heard']}")
        else:
            print(f"    expected {m['expected_words']} words, heard {m['heard_words']} ({m['drift_pct']}% off)")
    if absent:
        print(f"\n{len(absent)} file(s) not generated yet: {absent[:5]}{'...' if len(absent) > 5 else ''}")


def cmd_manifest(args):
    entries = load_days()
    combined = write_manifests(entries)
    amb = [m["day"] for m in combined if m["disambiguated_filenames"]]
    print(f"wrote {len(combined)} day manifests + audio/manifest.json")
    print(f"days needing filename disambiguation (repeat chapter numbers): {amb}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    c = sub.add_parser("clone")
    c.add_argument("--sample", required=True)
    c.add_argument("--name", required=True)
    c.set_defaults(func=cmd_clone)

    for name, fn in (("generate", cmd_generate), ("qa", cmd_qa)):
        s = sub.add_parser(name)
        s.add_argument("--days")
        s.add_argument("--all", action="store_true")
        s.add_argument("--bella-voice")
        s.add_argument("--david-voice")
        s.add_argument("--model", default=DEFAULT_MODEL)
        s.add_argument("--overwrite", action="store_true")
        s.add_argument("--dry-run", action="store_true")
        s.set_defaults(func=fn)

    m = sub.add_parser("manifest")
    m.add_argument("--all", action="store_true")
    m.set_defaults(func=cmd_manifest)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
