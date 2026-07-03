import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { useTeleprompter } from '@/hooks/useTeleprompter';
import LibraryOverlay from '@/components/library/LibraryOverlay';
import { Play, Pause, RotateCcw, Gauge, X, Check } from 'lucide-react';
import { BIBLE_VERSIONS, BibleVersion } from '@/lib/constants';
import { cn } from '@/lib/utils';

type TranslationEntry = {
  abbreviation: string;
  name: string;
  description: string;
  /** Selectable versions are wired to the bible API. Others are display-only. */
  available: boolean;
  versionKey?: BibleVersion;
};

const TRANSLATION_COLUMNS: Array<{ title: string; entries: TranslationEntry[] }> = [
  {
    title: 'Modern English',
    entries: [
      {
        abbreviation: 'BSB',
        name: 'Berean Standard Bible',
        description: 'Modern accuracy, highly readable, rigorous translation process.',
        available: true,
        versionKey: 'BSB',
      },
      {
        abbreviation: 'WEB',
        name: 'World English Bible',
        description: 'Public-domain modern English in the American Standard tradition.',
        available: true,
        versionKey: 'WEB',
      },
      {
        abbreviation: 'OEB',
        name: 'Open English Bible',
        description: 'A modern public-domain translation built for readability and clarity.',
        available: false,
      },
      {
        abbreviation: 'MSV',
        name: 'Modern Standard Version',
        description: 'A clear modern rendering tuned for continuous public reading.',
        available: true,
        versionKey: 'MSV',
      },
    ],
  },
  {
    title: 'Strict / Word-for-Word',
    entries: [
      {
        abbreviation: 'LSV',
        name: 'Literal Standard Version',
        description: 'An extremely literal translation preserving Hebrew and Greek syntax.',
        available: false,
      },
      {
        abbreviation: 'MLV',
        name: 'Modern Literal Version',
        description: 'A free-to-read literal translation with modern vocabulary.',
        available: false,
      },
      {
        abbreviation: 'YLT',
        name: "Young's Literal Translation",
        description: 'A 19th-century classic rendering each tense and word precisely.',
        available: false,
      },
      {
        abbreviation: 'DBY',
        name: 'Darby Bible',
        description: 'A dispensationalist literal translation from the original languages.',
        available: false,
      },
    ],
  },
  {
    title: 'Historical / Reformation',
    entries: [
      {
        abbreviation: 'KJV',
        name: 'King James Version',
        description: 'The historic English standard, renowned for its poetic majesty.',
        available: true,
        versionKey: 'KJV',
      },
      {
        abbreviation: 'GNV',
        name: 'Geneva Bible',
        description: 'The 16th-century study Bible of the English Reformation.',
        available: false,
      },
      {
        abbreviation: 'Matthew Bible',
        name: 'Matthew Bible 1537',
        description: 'The first complete English Bible printed under royal license.',
        available: false,
      },
      {
        abbreviation: 'ASV',
        name: 'American Standard Version',
        description: 'A 1901 revision of the KJV, foundation of many modern translations.',
        available: false,
      },
      {
        abbreviation: 'WBT',
        name: "Webster's Bible",
        description: 'Noah Webster’s 1833 modernization of the King James text.',
        available: false,
      },
    ],
  },
];

/**
 * Pure Word Reader — a single-page, hyper-minimalist Bible reading interface
 * with word-level follow-along.
 */
const Reading: React.FC = () => {
  const teleprompter = useTeleprompter();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const [speedOpen, setSpeedOpen] = useState(false);

  // word-progression state
  const [activeIndex, setActiveIndex] = useState(0);
  const [wpm, setWpm] = useState<number>(() =>
    parseInt(localStorage.getItem('pwr_wpm') || '220', 10),
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const lastTickRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const accumRef = useRef<number>(0);

  // controls auto-hide
  const [controlsShown, setControlsShown] = useState(true);
  const hideTimerRef = useRef<number | null>(null);

  // --- Fetch passage on mount ---
  useEffect(() => {
    const t = setTimeout(() => teleprompter.fetchBiblePassage(), 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Pending fetch when passage changes from library ---
  const [pendingFetch, setPendingFetch] = useState(0);
  const handlePassageSelect = useCallback(
    (book: string, chapter: number, version: BibleVersion) => {
      teleprompter.setSelectedBook(book);
      teleprompter.setStartChapter(chapter);
      teleprompter.setEndChapter(chapter);
      teleprompter.setSelectedVersion(version);
      setLibraryOpen(false);
      setVersionOpen(false);
      setPendingFetch((n) => n + 1);
      setActiveIndex(0);
      setIsPlaying(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleVersionSelect = useCallback(
    (version: BibleVersion) => {
      setVersionOpen(false);

      if (version === teleprompter.selectedVersion) {
        return;
      }

      teleprompter.setSelectedVersion(version);
      setPendingFetch((n) => n + 1);
      setActiveIndex(0);
      setIsPlaying(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [teleprompter.selectedVersion],
  );
  useEffect(() => {
    if (pendingFetch > 0) teleprompter.fetchBiblePassage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFetch]);

  // --- Persist wpm ---
  useEffect(() => {
    localStorage.setItem('pwr_wpm', String(wpm));
  }, [wpm]);

  // --- Parse text into tokens (verses + words) ---
  type Token =
    | { kind: 'word'; text: string; idx: number; verse?: number }
    | { kind: 'chapter'; text: string }
    | { kind: 'verse-num'; text: string }
    | { kind: 'verse-break' };

  const { tokens, wordCount } = useMemo(() => {
    const out: Token[] = [];
    let wIdx = 0;
    if (!teleprompter.text) return { tokens: out, wordCount: 0 };
    const lines = teleprompter.text.split('\n').filter(Boolean);
    lines.forEach((line, li) => {
      const ch = line.match(/^=== (.+) ===$/);
      if (ch) {
        out.push({ kind: 'chapter', text: ch[1] });
        return;
      }
      const v = line.match(/^(\d+)\s+(.*)$/);
      const verseNum = v ? v[1] : undefined;
      const body = v ? v[2] : line;
      if (verseNum) out.push({ kind: 'verse-num', text: verseNum });
      const words = body.split(/\s+/).filter(Boolean);
      words.forEach((w) => {
        out.push({ kind: 'word', text: w, idx: wIdx, verse: verseNum ? +verseNum : undefined });
        wIdx++;
      });
      if (li < lines.length - 1) out.push({ kind: 'verse-break' });
    });
    return { tokens: out, wordCount: wIdx };
  }, [teleprompter.text]);

  // Reset active index when text changes
  useEffect(() => {
    setActiveIndex(0);
    setIsPlaying(false);
  }, [teleprompter.text]);

  // --- Playback loop ---
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = 0;
      accumRef.current = 0;
      return;
    }
    const tick = (t: number) => {
      if (!lastTickRef.current) lastTickRef.current = t;
      const dt = t - lastTickRef.current;
      lastTickRef.current = t;
      const wps = wpm / 60;
      accumRef.current += (dt / 1000) * wps;
      if (accumRef.current >= 1) {
        const step = Math.floor(accumRef.current);
        accumRef.current -= step;
        setActiveIndex((i) => {
          const next = i + step;
          if (next >= wordCount) {
            setIsPlaying(false);
            return wordCount > 0 ? wordCount - 1 : 0;
          }
          return next;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, wpm, wordCount]);

  // --- Auto-scroll active word into upper third ---
  const activeWordRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const el = activeWordRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const target = window.innerHeight / 3;
    const delta = rect.top - target;
    if (Math.abs(delta) > 8) {
      window.scrollBy({ top: delta, behavior: 'smooth' });
    }
  }, [activeIndex]);

  // --- Controls auto-hide ---
  const showControls = useCallback(() => {
    setControlsShown(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    if (isPlaying) {
      hideTimerRef.current = window.setTimeout(() => setControlsShown(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    showControls();
    const onMove = () => showControls();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchstart', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchstart', onMove);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, [showControls]);

  const handlePlayPause = () => setIsPlaying((p) => !p);
  const handleRewind = () => {
    const back = Math.round((wpm / 60) * 10); // 10s of words
    setActiveIndex((i) => Math.max(0, i - back));
  };
  const handleReset = () => {
    setIsPlaying(false);
    setActiveIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Render tokens ---
  const renderedTokens = useMemo(() => {
    return tokens.map((tok, i) => {
      if (tok.kind === 'chapter') {
        return (
          <div key={i} className="my-16 text-center">
            <p className="text-[11px] tracking-[0.4em] uppercase text-[#656557]/60 font-sans">
              {tok.text}
            </p>
          </div>
        );
      }
      if (tok.kind === 'verse-num') {
        return (
          <sup
            key={i}
            className="text-[0.5em] font-sans text-[#656557]/50 mr-1.5 align-super tabular-nums"
          >
            {tok.text}
          </sup>
        );
      }
      if (tok.kind === 'verse-break') {
        return <span key={i}> </span>;
      }
      const state =
        tok.idx < activeIndex ? 'past' : tok.idx === activeIndex ? 'active' : 'future';
      const isActive = state === 'active';
      return (
        <React.Fragment key={i}>
          <span
            ref={isActive ? activeWordRef : undefined}
            className={cn(
              'inline-block transition-all duration-300 ease-out will-change-transform',
              state === 'past' && 'text-[#656557] opacity-40',
              state === 'active' && 'text-[#42423D] font-semibold',
              state === 'future' && 'text-[#42423D]',
            )}
            style={isActive ? { transform: 'scale(1.03)' } : undefined}
          >
            {tok.text}
          </span>
          <span> </span>
        </React.Fragment>
      );
    });
  }, [tokens, activeIndex]);

  const progress = wordCount > 0 ? (activeIndex / Math.max(1, wordCount - 1)) * 100 : 0;

  return (
    <div className="vellum-bg min-h-screen text-[#42423D] font-serif antialiased subpixel-antialiased">
      {/* Top progress hairline */}
      <div
        aria-hidden
        className="fixed top-0 left-0 right-0 h-px z-30 bg-[#42423D]/5"
      >
        <div
          className="h-full bg-[#42423D]/30 transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Integrated reading coordinates */}
      <div
        className={cn(
          'fixed top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3',
          'text-[11px] tracking-[0.28em] uppercase font-serif text-[#656557]',
        )}
      >
        <button
          onClick={() => {
            setVersionOpen(false);
            setLibraryOpen(true);
          }}
          className="transition-colors duration-300 hover:text-[#42423D] focus-visible:outline-none focus-visible:text-[#42423D]"
          aria-label="Open passage selector"
        >
          {teleprompter.selectedBook
            ? `${teleprompter.selectedBook} ${teleprompter.startChapter}`
            : 'Choose a Passage'}
        </button>

        {teleprompter.selectedBook && (
          <>
            <span className="text-[#656557]/35" aria-hidden>
              ·
            </span>
            <button
              onClick={() => {
                setLibraryOpen(false);
                setVersionOpen((open) => !open);
              }}
              className={cn(
                'px-1.5 py-0.5 -mx-1.5 -my-0.5 rounded-[2px]',
                'transition-colors duration-300 hover:text-[#42423D] focus-visible:outline-none focus-visible:text-[#42423D]',
                versionOpen && 'bg-[#eae9d7]/55 text-[#42423D]',
              )}
              aria-label="Open translation selector"
              aria-expanded={versionOpen}
            >
              {teleprompter.selectedVersion}
            </button>
          </>
        )}
      </div>

      {versionOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Translation selector"
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-[#fcf9ef]/85 backdrop-blur-[16px] text-[#42423D]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 select-none px-8 pt-28 opacity-20 md:px-20"
          >
            <div className="mx-auto max-w-3xl text-2xl leading-loose text-[#42423D]">
              {tokens.slice(0, 70).map((tok, index) => {
                if (tok.kind === 'word') {
                  return <span key={index}>{tok.text} </span>;
                }

                if (tok.kind === 'verse-num') {
                  return (
                    <span
                      key={index}
                      className="mr-4 align-top font-sans text-sm tracking-wider text-[#656557]"
                    >
                      {tok.text}
                    </span>
                  );
                }

                return null;
              })}
            </div>
          </div>

          <header className="sticky top-0 z-10 flex h-20 items-center justify-center px-6">
            <div className="flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.18em] text-[#656557]">
              <span className="font-serif">
                {teleprompter.selectedBook} {teleprompter.startChapter}
              </span>
              <span className="text-[#656557]/45">·</span>
              <span className="rounded-[2px] bg-[#eae9d7] px-3 py-1 text-[#42423D]">
                {teleprompter.selectedVersion}
              </span>
            </div>

            <button
              onClick={() => setVersionOpen(false)}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-[#656557] transition-colors duration-300 hover:text-[#42423D] focus-visible:outline-none focus-visible:text-[#42423D] md:right-8"
              aria-label="Close translation selector"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <main className="relative mx-auto max-w-7xl px-6 pb-32 pt-12 md:px-8 md:pt-16">
            <h1 className="mb-20 text-center font-serif text-4xl font-normal tracking-tight text-[#42423D] md:mb-24 md:text-5xl">
              Choose Translation
            </h1>

            <div className="grid grid-cols-1 gap-14 lg:grid-cols-3 lg:gap-20">
              {TRANSLATION_COLUMNS.map((column) => (
                <section key={column.title} className="flex flex-col">
                  <h2 className="mb-6 border-b border-[#bbbaa9]/30 pb-3 font-sans text-[11px] uppercase tracking-[0.28em] text-[#656557]">
                    {column.title}
                  </h2>

                  <div className="flex flex-col gap-2">
                    {column.entries.map((entry) => {
                      const selected =
                        entry.available && entry.versionKey === teleprompter.selectedVersion;
                      const onDevice = entry.available && !selected;

                      const status = selected
                        ? 'Active'
                        : onDevice
                          ? 'On Device'
                          : 'Download';

                      return (
                        <button
                          key={entry.abbreviation}
                          onClick={() => {
                            if (entry.available && entry.versionKey) {
                              handleVersionSelect(entry.versionKey);
                            }
                          }}
                          disabled={!entry.available}
                          className={cn(
                            'group relative -mx-4 flex flex-col gap-2 rounded-[3px] p-5 text-left transition-colors duration-500 ease-out md:-mx-6 md:p-6',
                            selected
                              ? 'bg-[#e4e4cf] shadow-[0_4px_32px_-8px_rgba(56,57,44,0.08)]'
                              : entry.available
                                ? 'hover:bg-[#f6f4e7]/80 cursor-pointer'
                                : 'opacity-65 hover:opacity-100 hover:bg-[#f6f4e7]/60 cursor-pointer',
                          )}
                        >
                          {selected && (
                            <span
                              aria-hidden
                              className="absolute left-0 top-1/2 h-12 w-[3px] -translate-y-1/2 rounded-r-[2px] bg-[#5f5f59]/55"
                            />
                          )}

                          <span className="flex w-full items-baseline justify-between gap-4">
                            <span className="font-serif text-xl font-semibold tracking-tight text-[#42423D]">
                              {entry.abbreviation}
                            </span>
                            <span
                              className={cn(
                                'flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.24em]',
                                selected ? 'text-[#42423D]' : 'text-[#656557]',
                              )}
                            >
                              {selected ? (
                                <Check className="h-3 w-3" strokeWidth={2.5} />
                              ) : (
                                <span
                                  aria-hidden
                                  className={cn(
                                    'h-1.5 w-1.5 rounded-full',
                                    onDevice ? 'bg-[#656557]/55' : 'bg-transparent',
                                  )}
                                />
                              )}
                              {status}
                            </span>
                          </span>

                          <span className="font-serif text-lg text-[#38392c]">
                            {entry.name}
                          </span>
                          <span className="font-sans text-sm leading-relaxed text-[#656557]/85">
                            {entry.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </main>

          <div className="pointer-events-none fixed bottom-0 left-0 right-0 flex justify-center px-6 pb-8 opacity-35">
            <div className="flex items-center gap-10 rounded-full bg-[#fcf9ef]/30 px-8 py-4 text-[#656557] backdrop-blur-sm">
              <RotateCcw className="h-5 w-5" />
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eae9d7] text-[#42423D] shadow-[0_8px_32px_-8px_rgba(56,57,44,0.12)]">
                <Play className="h-6 w-6 fill-current" />
              </div>
              <span className="font-sans text-xs uppercase tracking-[0.2em]">
                {wpm} WPM
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Reading surface */}
      <main className="max-w-3xl mx-auto pt-32 md:pt-40 pb-[40vh] px-6 md:px-8">
        {teleprompter.isLoading ? (
          <p className="text-center text-sm text-[#656557]/60 font-sans tracking-wider animate-pulse mt-32">
            Loading passage…
          </p>
        ) : tokens.length === 0 ? (
          <div className="text-center mt-32">
            <p className="font-serif italic text-3xl text-[#42423D]">Pure Word</p>
            <p className="mt-4 text-sm text-[#656557] font-sans">
              Choose a passage to begin.
            </p>
          </div>
        ) : (
          <div
            className="text-2xl md:text-3xl leading-relaxed md:leading-loose tracking-[0.005em]"
            style={{ wordSpacing: '0.05em' }}
          >
            {renderedTokens}
          </div>
        )}
      </main>

      {/* Floating playback controls */}
      <div
        className={cn(
          'fixed bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-40',
          'transition-all duration-500 ease-out',
          controlsShown
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none',
        )}
      >
        <div className="flex items-center gap-5 md:gap-6 px-5 md:px-6 py-3 rounded-full bg-[#fcf9ef]/85 backdrop-blur-xl border border-[#42423D]/10 shadow-[0_10px_40px_-10px_rgba(66,66,61,0.25)]">
          <button
            onClick={handleRewind}
            className="text-[#656557] hover:text-[#42423D] transition-colors p-1"
            aria-label="Rewind 10 seconds"
            title="Rewind 10s"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={handlePlayPause}
            className="text-[#42423D] hover:text-black transition-colors p-1.5 rounded-full"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>

          <button
            onClick={handleReset}
            className="text-[#656557] hover:text-[#42423D] transition-colors p-1 text-[10px] tracking-[0.2em] uppercase font-sans"
            aria-label="Reset to top"
            title="Reset"
          >
            Top
          </button>

          <span className="w-px h-5 bg-[#42423D]/15" />

          <div className="relative">
            <button
              onClick={() => setSpeedOpen((s) => !s)}
              className="flex items-center gap-1.5 text-[#656557] hover:text-[#42423D] transition-colors text-[11px] tracking-[0.15em] uppercase font-sans"
              aria-label="Playback speed"
            >
              <Gauge className="h-3.5 w-3.5" />
              <span className="tabular-nums">{wpm}</span>
            </button>
            {speedOpen && (
              <div className="absolute bottom-full right-0 mb-3 w-56 p-4 rounded-xl bg-[#fcf9ef]/95 backdrop-blur-xl border border-[#42423D]/10 shadow-[0_10px_40px_-10px_rgba(66,66,61,0.25)]">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#656557] font-sans mb-2">
                  Pace · WPM
                </p>
                <input
                  type="range"
                  min={80}
                  max={500}
                  step={10}
                  value={wpm}
                  onChange={(e) => setWpm(parseInt(e.target.value, 10))}
                  className="w-full accent-[#42423D]"
                />
                <div className="flex justify-between text-[10px] text-[#656557]/70 font-sans mt-1 tabular-nums">
                  <span>80</span>
                  <span className="text-[#42423D]">{wpm}</span>
                  <span>500</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Library overlay */}
      <LibraryOverlay
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        currentBook={teleprompter.selectedBook}
        currentChapter={teleprompter.startChapter}
        currentVersion={teleprompter.selectedVersion}
        onSelect={handlePassageSelect}
      />
    </div>
  );
};

export default Reading;
