#!/usr/bin/env python3
"""Shared library for the Wolf & Word Bible-in-a-Year production architecture.

Provides:

  * the canonical versification table (book order, chapter/verse counts) derived
    from the upstream ``memory-method-bible`` reference text,
  * stable, translation-independent verse identities (``GEN.1.1``),
  * a parser for the human display references used by the approved source
    document ("Genesis 1:1-3:24", "Jude 1-25", "Titus 1:1-3:15; Philemon 1-25"),
  * a loader for the upstream Book -> Story -> Scene base-structure JSON.

Nothing in this module is translation-specific beyond the fact that the
canonical versification tradition Wolf & Word publishes against is the
Protestant/KJV chapter-and-verse tradition. Verse *identities* are normalized
and stable; verse *display* belongs to an edition overlay.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
from dataclasses import dataclass, field

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BIAY_ROOT = os.path.join(REPO_ROOT, "bible-in-a-year")
UPSTREAM_ROOT = os.path.join(os.path.dirname(REPO_ROOT), "memory-method-bible")
UPSTREAM_BASE_STRUCTURE = os.path.join(UPSTREAM_ROOT, "data", "base-structure")
UPSTREAM_REFERENCE_TEXT = os.path.join(UPSTREAM_ROOT, "source-texts", "KJV.txt")

SOURCE_DOCUMENT = os.path.join(
    BIAY_ROOT, "source", "Wolf-and-Word-Bible-in-a-Year-v0.2-Second-Pass.md"
)
MASTER_PLAN = os.path.join(BIAY_ROOT, "master-calendar", "master-plan.json")
MASTER_PLAN_SCHEMA = os.path.join(BIAY_ROOT, "master-calendar", "master-plan.schema.json")
KJV_OVERLAY = os.path.join(BIAY_ROOT, "editions", "kjv", "overlay.json")
KJV_OVERLAY_SCHEMA = os.path.join(BIAY_ROOT, "editions", "kjv", "overlay.schema.json")
VALIDATION_REPORT = os.path.join(BIAY_ROOT, "audits", "validation-report.md")

# --------------------------------------------------------------------------
# Canon
# --------------------------------------------------------------------------

# (display name in the reference text, stable USFM-style code, upstream slug, testament)
CANON = [
    ("Genesis", "GEN", "genesis", "OT"),
    ("Exodus", "EXO", "exodus", "OT"),
    ("Leviticus", "LEV", "leviticus", "OT"),
    ("Numbers", "NUM", "numbers", "OT"),
    ("Deuteronomy", "DEU", "deuteronomy", "OT"),
    ("Joshua", "JOS", "joshua", "OT"),
    ("Judges", "JDG", "judges", "OT"),
    ("Ruth", "RUT", "ruth", "OT"),
    ("1 Samuel", "1SA", "1samuel", "OT"),
    ("2 Samuel", "2SA", "2samuel", "OT"),
    ("1 Kings", "1KI", "1kings", "OT"),
    ("2 Kings", "2KI", "2kings", "OT"),
    ("1 Chronicles", "1CH", "1chronicles", "OT"),
    ("2 Chronicles", "2CH", "2chronicles", "OT"),
    ("Ezra", "EZR", "ezra", "OT"),
    ("Nehemiah", "NEH", "nehemiah", "OT"),
    ("Esther", "EST", "esther", "OT"),
    ("Job", "JOB", "job", "OT"),
    ("Psalm", "PSA", "psalms", "OT"),
    ("Proverbs", "PRO", "proverbs", "OT"),
    ("Ecclesiastes", "ECC", "ecclesiastes", "OT"),
    ("Song of Solomon", "SNG", "songofsongs", "OT"),
    ("Isaiah", "ISA", "isaiah", "OT"),
    ("Jeremiah", "JER", "jeremiah", "OT"),
    ("Lamentations", "LAM", "lamentations", "OT"),
    ("Ezekiel", "EZK", "ezekiel", "OT"),
    ("Daniel", "DAN", "daniel", "OT"),
    ("Hosea", "HOS", "hosea", "OT"),
    ("Joel", "JOL", "joel", "OT"),
    ("Amos", "AMO", "amos", "OT"),
    ("Obadiah", "OBA", "obadiah", "OT"),
    ("Jonah", "JON", "jonah", "OT"),
    ("Micah", "MIC", "micah", "OT"),
    ("Nahum", "NAM", "nahum", "OT"),
    ("Habakkuk", "HAB", "habakkuk", "OT"),
    ("Zephaniah", "ZEP", "zephaniah", "OT"),
    ("Haggai", "HAG", "haggai", "OT"),
    ("Zechariah", "ZEC", "zechariah", "OT"),
    ("Malachi", "MAL", "malachi", "OT"),
    ("Matthew", "MAT", "matthew", "NT"),
    ("Mark", "MRK", "mark", "NT"),
    ("Luke", "LUK", "luke", "NT"),
    ("John", "JHN", "john", "NT"),
    ("Acts", "ACT", "acts", "NT"),
    ("Romans", "ROM", "romans", "NT"),
    ("1 Corinthians", "1CO", "1corinthians", "NT"),
    ("2 Corinthians", "2CO", "2corinthians", "NT"),
    ("Galatians", "GAL", "galatians", "NT"),
    ("Ephesians", "EPH", "ephesians", "NT"),
    ("Philippians", "PHP", "philippians", "NT"),
    ("Colossians", "COL", "colossians", "NT"),
    ("1 Thessalonians", "1TH", "1thessalonians", "NT"),
    ("2 Thessalonians", "2TH", "2thessalonians", "NT"),
    ("1 Timothy", "1TI", "1timothy", "NT"),
    ("2 Timothy", "2TI", "2timothy", "NT"),
    ("Titus", "TIT", "titus", "NT"),
    ("Philemon", "PHM", "philemon", "NT"),
    ("Hebrews", "HEB", "hebrews", "NT"),
    ("James", "JAS", "james", "NT"),
    ("1 Peter", "1PE", "1peter", "NT"),
    ("2 Peter", "2PE", "2peter", "NT"),
    ("1 John", "1JN", "1john", "NT"),
    ("2 John", "2JN", "2john", "NT"),
    ("3 John", "3JN", "3john", "NT"),
    ("Jude", "JUD", "jude", "NT"),
    ("Revelation", "REV", "revelation", "NT"),
]

BOOK_ORDER = {name: i + 1 for i, (name, _c, _s, _t) in enumerate(CANON)}
BOOK_CODE = {name: code for name, code, _s, _t in CANON}
BOOK_SLUG = {name: slug for name, _c, slug, _t in CANON}
BOOK_TESTAMENT = {name: t for name, _c, _s, t in CANON}
CODE_TO_BOOK = {code: name for name, code, _s, _t in CANON}
SLUG_TO_BOOK = {slug: name for name, _c, slug, _t in CANON}

# The approved calendar and the upstream repository use a few display spellings
# that differ from the reference text. Aliases are display-layer only; they never
# change a verse identity.
BOOK_ALIASES = {
    "Psalms": "Psalm",
    "Song of Songs": "Song of Solomon",
    "Songs of Solomon": "Song of Solomon",
    "Canticles": "Song of Solomon",
}

# Single-chapter books: the source document cites them without a chapter number
# ("Jude 1-25" means Jude 1:1-1:25).
SINGLE_CHAPTER_BOOKS = {"Obadiah", "Philemon", "2 John", "3 John", "Jude"}

MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]
MONTH_NUMBER = {m: i + 1 for i, m in enumerate(MONTH_NAMES)}
# Perennial non-leap calendar: February always has 28 days.
MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]


def normalize_book(name: str) -> str:
    name = name.strip()
    return BOOK_ALIASES.get(name, name)


# --------------------------------------------------------------------------
# Versification table
# --------------------------------------------------------------------------


class Versification:
    """Canonical verse table: which (book, chapter, verse) triples exist."""

    def __init__(self, verses: list[tuple[str, int, int]]):
        self.verses = verses
        self.index = {v: i for i, v in enumerate(verses)}
        self.chapter_last: dict[tuple[str, int], int] = {}
        self.book_last_chapter: dict[str, int] = {}
        for book, ch, vs in verses:
            key = (book, ch)
            if vs > self.chapter_last.get(key, 0):
                self.chapter_last[key] = vs
            if ch > self.book_last_chapter.get(book, 0):
                self.book_last_chapter[book] = ch

    def __len__(self) -> int:
        return len(self.verses)

    def ordinal(self, book: str, chapter: int, verse: int) -> int:
        try:
            return self.index[(book, chapter, verse)]
        except KeyError:
            raise KeyError(f"no such verse in canonical versification: {book} {chapter}:{verse}")

    def exists(self, book: str, chapter: int, verse: int) -> bool:
        return (book, chapter, verse) in self.index

    def span(self, start: tuple[str, int, int], end: tuple[str, int, int]) -> list[tuple[str, int, int]]:
        a = self.ordinal(*start)
        b = self.ordinal(*end)
        if b < a:
            raise ValueError(f"reversed span: {start} -> {end}")
        return self.verses[a : b + 1]

    def last_verse(self, book: str, chapter: int) -> int:
        return self.chapter_last[(book, chapter)]

    def last_chapter(self, book: str) -> int:
        return self.book_last_chapter[book]


_VERSIFICATION: Versification | None = None


def load_versification(path: str = UPSTREAM_REFERENCE_TEXT) -> Versification:
    """Read the canonical verse table from the upstream reference text.

    The text file is used only as the authority on *which verses exist* in the
    Protestant canonical versification tradition. No verse content is copied
    into the master plan.
    """
    global _VERSIFICATION
    if _VERSIFICATION is not None:
        return _VERSIFICATION
    verses: list[tuple[str, int, int]] = []
    pat = re.compile(r"^(.+?) (\d+):(\d+)\t")
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            m = pat.match(line)
            if not m:
                continue
            book = normalize_book(m.group(1))
            if book not in BOOK_ORDER:
                raise ValueError(f"unknown book in reference text: {m.group(1)!r}")
            verses.append((book, int(m.group(2)), int(m.group(3))))
    _VERSIFICATION = Versification(verses)
    return _VERSIFICATION


def verse_id(book: str, chapter: int, verse: int) -> str:
    """Stable, translation-independent verse identity, e.g. ``GEN.1.1``."""
    return f"{BOOK_CODE[book]}.{chapter}.{verse}"


def parse_verse_id(vid: str) -> tuple[str, int, int]:
    code, ch, vs = vid.split(".")
    return CODE_TO_BOOK[code], int(ch), int(vs)


# --------------------------------------------------------------------------
# Reference parsing
# --------------------------------------------------------------------------

DASHES = "‐‑‒–—―"


@dataclass
class Reference:
    book: str
    start_chapter: int
    start_verse: int
    end_chapter: int
    end_verse: int

    @property
    def start(self) -> tuple[str, int, int]:
        return (self.book, self.start_chapter, self.start_verse)

    @property
    def end(self) -> tuple[str, int, int]:
        return (self.book, self.end_chapter, self.end_verse)

    def display(self, chapterless: bool = False) -> str:
        if chapterless:
            if self.start_verse == self.end_verse:
                return f"{self.book} {self.start_verse}"
            return f"{self.book} {self.start_verse}–{self.end_verse}"
        a = f"{self.start_chapter}:{self.start_verse}"
        b = f"{self.end_chapter}:{self.end_verse}"
        return f"{self.book} {a}–{b}"


_BOOK_NAME_RE = "|".join(
    sorted(
        (re.escape(n) for n in list(BOOK_ORDER) + list(BOOK_ALIASES)),
        key=len,
        reverse=True,
    )
)
_REF_RE = re.compile(
    rf"^\s*(?P<book>{_BOOK_NAME_RE})\s+"
    rf"(?P<a>\d+)(?::(?P<b>\d+))?"
    rf"(?:[{DASHES}-]\s*(?P<c>\d+)(?::(?P<d>\d+))?)?\s*$"
)


def parse_reference(text: str, vrs: Versification) -> Reference:
    """Parse one display reference into a canonical Reference.

    Handles the four shapes the approved document uses:
      ``Genesis 1:1-3:24``  ``Psalm 119:1-176``  ``Jude 1-25``  ``Obadiah 1:1-21``
    """
    m = _REF_RE.match(text.replace(" ", " "))
    if not m:
        raise ValueError(f"unparseable reference: {text!r}")
    book = normalize_book(m.group("book"))
    a, b, c, d = m.group("a"), m.group("b"), m.group("c"), m.group("d")

    if b is None:
        # No colon in the first half.
        if book in SINGLE_CHAPTER_BOOKS:
            # "Jude 1-25" -> verses of the single chapter.
            sc, sv = 1, int(a)
            if c is None:
                ec, ev = 1, int(a)
            elif d is not None:
                raise ValueError(f"unexpected chapter:verse end in single-chapter ref: {text!r}")
            else:
                ec, ev = 1, int(c)
        else:
            # "Genesis 12-15" -> whole chapters.
            sc, sv = int(a), 1
            ec = int(c) if c is not None else int(a)
            ev = vrs.last_verse(book, ec)
    else:
        sc, sv = int(a), int(b)
        if c is None:
            ec, ev = sc, sv
        elif d is None:
            # "Psalm 119:1-176" -> same chapter, verse range.
            ec, ev = sc, int(c)
        else:
            ec, ev = int(c), int(d)

    ref = Reference(book, sc, sv, ec, ev)
    for pos in (ref.start, ref.end):
        if not vrs.exists(*pos):
            raise ValueError(f"reference {text!r} names a verse outside the canon: {pos}")
    if vrs.ordinal(*ref.end) < vrs.ordinal(*ref.start):
        raise ValueError(f"reference {text!r} runs backwards")
    return ref


def parse_reading(text: str, vrs: Versification) -> list[Reference]:
    """Parse a full Reading field, which may hold several canonical references."""
    parts = [p for p in re.split(r"[;]", text) if p.strip()]
    return [parse_reference(p, vrs) for p in parts]


# --------------------------------------------------------------------------
# Upstream structure
# --------------------------------------------------------------------------


@dataclass
class Scene:
    book: str
    story_letter: str
    scene_number: int
    scene_name: str
    reference_text: str
    start: tuple[str, int, int]
    end: tuple[str, int, int]
    part_marks: tuple = (None, None)

    @property
    def is_half_verse_start(self) -> bool:
        return self.part_marks[0] == "b"

    @property
    def is_half_verse_end(self) -> bool:
        return self.part_marks[-1] == "a"

    @property
    def scene_id(self) -> str:
        return f"{BOOK_SLUG[self.book]}.{self.story_letter}.{self.scene_number}"

    @property
    def story_id(self) -> str:
        return f"{BOOK_SLUG[self.book]}.{self.story_letter}"


@dataclass
class Story:
    book: str
    letter: str
    title: str
    reference_text: str
    scenes: list[Scene] = field(default_factory=list)

    @property
    def story_id(self) -> str:
        return f"{BOOK_SLUG[self.book]}.{self.letter}"


def _parse_structure_reference(book: str, ref: str, vrs: Versification):
    """Parse an upstream ``reference`` string such as ``1:1-2:3`` or ``5:32-5:32``."""
    ref = ref.strip()
    for d in DASHES:
        ref = ref.replace(d, "-")
    if "-" in ref:
        left, right = ref.split("-", 1)
    else:
        left, right = ref, ref

    # Upstream marks half-verse seams as "20a" / "20b". The verse identity is the
    # whole verse; the a/b part is retained separately so a half-verse seam is
    # never mistaken for a divided scene.
    part_marks: list[str | None] = []

    def one(part: str, fallback_chapter: int | None):
        part = part.strip()
        mark = None
        m = re.match(r"^(.*?)([ab])$", part)
        if m and re.search(r"\d$", m.group(1)):
            part, mark = m.group(1), m.group(2)
        part_marks.append(mark)
        if ":" in part:
            ch, vs = part.split(":", 1)
            return int(ch), int(vs)
        if book in SINGLE_CHAPTER_BOOKS:
            return 1, int(part)
        if fallback_chapter is None:
            raise ValueError(f"{book}: bare verse without chapter context in {ref!r}")
        return fallback_chapter, int(part)

    sc, sv = one(left, None)
    ec, ev = one(right, sc)
    start, end = (book, sc, sv), (book, ec, ev)
    for pos in (start, end):
        if not vrs.exists(*pos):
            raise ValueError(f"{book}: structure reference {ref!r} names non-canonical verse {pos}")
    return start, end, tuple(part_marks)


def load_upstream_structure(vrs: Versification, base_dir: str = UPSTREAM_BASE_STRUCTURE):
    """Load every ``<book>-base.json`` into Story/Scene objects.

    Returns ``(stories_by_id, scenes_by_id, problems)``. Problems are recorded,
    never repaired: this repository must not modify ``memory-method-bible``.
    """
    stories: dict[str, Story] = {}
    scenes: dict[str, Scene] = {}
    problems: list[str] = []

    for name, _code, slug, _t in CANON:
        path = os.path.join(base_dir, f"{slug}-base.json")
        if not os.path.exists(path):
            problems.append(f"{name}: upstream base-structure file missing ({slug}-base.json)")
            continue
        with open(path, encoding="utf-8") as fh:
            doc = json.load(fh)
        for st in doc.get("stories", []):
            letter = st["story_letter"]
            story = Story(
                book=name,
                letter=letter,
                title=st.get("story_title", ""),
                reference_text=st.get("reference", ""),
            )
            for sc in st.get("scenes", []):
                try:
                    start, end, marks = _parse_structure_reference(name, sc["reference"], vrs)
                except (ValueError, KeyError) as exc:
                    problems.append(f"{name} story {letter}: unparseable scene reference: {exc}")
                    continue
                scene = Scene(
                    book=name,
                    story_letter=letter,
                    scene_number=sc["scene_number"],
                    scene_name=sc.get("scene_name", ""),
                    reference_text=sc["reference"],
                    start=start,
                    end=end,
                    part_marks=marks,
                )
                if scene.scene_id in scenes:
                    problems.append(f"duplicate upstream scene id {scene.scene_id}")
                    continue
                story.scenes.append(scene)
                scenes[scene.scene_id] = scene
            if story.story_id in stories:
                problems.append(f"duplicate upstream story id {story.story_id}")
                continue
            stories[story.story_id] = story
    return stories, scenes, problems


def upstream_revision(root: str = UPSTREAM_ROOT) -> dict:
    """Record the exact upstream revision the plan was derived from."""
    def git(*args) -> str | None:
        try:
            return subprocess.run(
                ["git", "-C", root, *args],
                capture_output=True, text=True, check=True,
            ).stdout.strip()
        except (subprocess.CalledProcessError, FileNotFoundError):
            return None

    dirty = git("status", "--porcelain")
    return {
        "repository": "https://github.com/nigelmsipa/memory-method-bible",
        "local_path": root,
        "revision": git("rev-parse", "HEAD"),
        "revision_subject": git("log", "-1", "--pretty=%s"),
        "working_tree_clean": dirty == "" if dirty is not None else None,
        "uncommitted_base_structure_files": (
            sorted(
                line.split(maxsplit=1)[1] for line in (dirty or "").splitlines()
                if "data/base-structure/" in line and len(line.split(maxsplit=1)) == 2
            ) or None
        ),
    }
