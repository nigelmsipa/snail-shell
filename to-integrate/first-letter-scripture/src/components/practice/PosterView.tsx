import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  BookOpen,
  Check,
  ChevronDown,
  FlaskConical,
  Keyboard,
  RotateCcw,
  Target,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { VerseProgress } from '@/types/passage';
import { Recitation } from './Recitation';
import { supabase } from '@/integrations/supabase/client';

interface Verse {
  verse: number;
  text: string;
}

interface Pericope {
  id: string;
  name: string;
  verseStart: number;
  verseEnd: number;
}

type PosterMode = 'read' | 'test';

interface PosterViewProps {
  verses: Verse[];
  pericopes: Pericope[];
  verseProgress: Record<number, VerseProgress>;
  activeVerseNum: number;
  currentVerse: number;
  userId?: string;
  onVerseSelect: (verseNum: number) => void;
  onEncodingRep: (verseNumber: number, difficulty: string) => void;
  onRetrievalAttempt: (verseNumber: number, passed: boolean) => void;
}

const MAX_MISTAKES = 3;
const REPS_TO_UNLOCK = 3;

/** First letter of a word (alphabetic only) */
function firstLetter(word: string): string {
  const m = word.match(/[a-zA-Z]/);
  return m ? m[0] : '';
}

/** Convert full text to first-letter abbreviation preserving punctuation */
function toFirstLetters(text: string): string {
  return text
    .split(/\s+/)
    .map((word) => {
      if (!word) return '';
      const match = word.match(/^([^a-zA-Z]*[a-zA-Z])(.*)/);
      if (match) {
        const rest = match[2];
        const trailingPunct = rest.match(/[^a-zA-Z]*$/)?.[0] ?? '';
        return match[1] + trailingPunct;
      }
      return word[0] ?? '';
    })
    .join(' ');
}

export function PosterView({
  verses,
  pericopes,
  verseProgress,
  activeVerseNum,
  currentVerse,
  userId,
  onVerseSelect,
  onEncodingRep,
  onRetrievalAttempt,
}: PosterViewProps) {
  const [mode, setMode] = useState<PosterMode>('read');
  const [recitationPericope, setRecitationPericope] = useState<string | null>(null);
  const [recitationPrompt, setRecitationPrompt] = useState<{ pericopeId: string; pericopeName: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const activeVerseRef = useRef<HTMLDivElement>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const [testIndex, setTestIndex] = useState(0);
  const [testMistakes, setTestMistakes] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [testFailed, setTestFailed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [wrongTapIndex, setWrongTapIndex] = useState<number | null>(null);

  // Group verses by pericope
  const groupedVerses = useMemo(() => {
    if (pericopes.length > 0) {
      return pericopes.map((pericope) => ({
        pericope,
        verses: verses.filter((v) => v.verse >= pericope.verseStart && v.verse <= pericope.verseEnd),
      }));
    }
    return [{ pericope: null as Pericope | null, verses }];
  }, [pericopes, verses]);

  const activeGroupIndex = useMemo(() => (
    groupedVerses.findIndex((g) => g.verses.some((v) => v.verse === activeVerseNum))
  ), [groupedVerses, activeVerseNum]);

  const activeGroup = activeGroupIndex >= 0 ? groupedVerses[activeGroupIndex] : groupedVerses[0] ?? null;

  const activeVerse = verses.find((v) => v.verse === activeVerseNum);
  const activeProgress = verseProgress[activeVerseNum];
  const encodingReps = activeProgress?.encodingReps ?? 0;
  const retrievalUnlocked = activeProgress?.retrievalUnlocked ?? false;

  const activeWords = useMemo(
    () => activeVerse?.text.split(/\s+/).filter((w) => w.length > 0) ?? [],
    [activeVerse]
  );

  const expectedLetters = useMemo(
    () => activeWords.map((w) => firstLetter(w).toLowerCase()),
    [activeWords]
  );

  const shuffledWords = useMemo(
    () => activeWords
      .map((word, index) => ({ word, originalIdx: index }))
      .sort(() => Math.random() - 0.5),
    [activeWords]
  );

  const revealedCount = Math.max(testIndex, selectedIndices.length);

  const isSectionComplete = useCallback((pericopeId: string) => {
    try { return localStorage.getItem(`boss-mastered-${pericopeId}`) === 'true'; } catch { return false; }
  }, []);

  const activeGroupPassedCount = useMemo(() => (
    activeGroup
      ? activeGroup.verses.filter((v) => verseProgress[v.verse]?.retrievalPassed).length
      : 0
  ), [activeGroup, verseProgress]);

  const activeGroupTotal = activeGroup?.verses.length ?? 0;
  const activeGroupComplete = activeGroup?.pericope
    ? isSectionComplete(activeGroup.pericope.id)
    : false;
  const recitationReady = !!activeGroup?.pericope && activeGroupTotal > 0 &&
    activeGroupPassedCount === activeGroupTotal &&
    !activeGroupComplete;

  const recitationGroup = useMemo(() => {
    if (!recitationPericope) return null;
    return groupedVerses.find((g) => g.pericope?.id === recitationPericope) ?? null;
  }, [recitationPericope, groupedVerses]);

  // Visible verses: all verses up to and including the active verse
  const visibleVerses = useMemo(() => {
    return verses.filter((v) => v.verse <= activeVerseNum);
  }, [verses, activeVerseNum]);

  // Auto-switch to test when retrieval unlocks
  useEffect(() => {
    if (retrievalUnlocked && mode === 'read' && !activeProgress?.retrievalPassed) {
      setMode('test');
    }
  }, [retrievalUnlocked, mode, activeProgress?.retrievalPassed]);

  // Reset test state when active verse changes
  useEffect(() => {
    setTestIndex(0);
    setTestMistakes(0);
    setTestComplete(false);
    setTestFailed(false);
    setShowSuccess(false);
    setSelectedIndices([]);
    setWrongTapIndex(null);
    setRecitationPrompt(null);

    const progress = verseProgress[activeVerseNum];
    if (progress?.retrievalUnlocked && !progress?.retrievalPassed) {
      setMode('test');
    } else if (!progress?.retrievalPassed) {
      setMode('read');
    }
  }, [activeVerseNum, verseProgress]);

  // Scroll active verse into view
  useEffect(() => {
    setTimeout(() => {
      activeVerseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [activeVerseNum]);

  // Focus container in test mode
  useEffect(() => {
    if (mode === 'test') containerRef.current?.focus();
  }, [activeVerseNum, mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => prev === 'read' ? 'test' : 'read');
  }, []);

  const findNextVerse = useCallback(() => {
    const sorted = verses.map((v) => v.verse).sort((a, b) => a - b);
    const idx = sorted.indexOf(activeVerseNum);
    return idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;
  }, [verses, activeVerseNum]);

  const completeTest = useCallback(() => {
    setTestComplete(true);
    setShowSuccess(true);
    onRetrievalAttempt(activeVerseNum, true);

    const allOthersPassed = activeGroup && activeGroup.verses
      .filter((v) => v.verse !== activeVerseNum)
      .every((v) => verseProgress[v.verse]?.retrievalPassed);

    if (allOthersPassed && activeGroup?.pericope) {
      setTimeout(() => {
        setShowSuccess(false);
        setRecitationPrompt({
          pericopeId: activeGroup.pericope!.id,
          pericopeName: activeGroup.pericope!.name,
        });
      }, 1500);
      return;
    }

    const nextVerse = findNextVerse();
    if (nextVerse) {
      setTimeout(() => {
        setShowSuccess(false);
        onVerseSelect(nextVerse);
      }, 1500);
    }
  }, [activeVerseNum, activeGroup, verseProgress, onRetrievalAttempt, findNextVerse, onVerseSelect]);

  const failTest = useCallback(() => {
    setTestFailed(true);
    setTimeout(() => onRetrievalAttempt(activeVerseNum, false), 1200);
  }, [activeVerseNum, onRetrievalAttempt]);

  const submitLetter = useCallback((letter: string) => {
    if (mode !== 'test' || testComplete || testFailed) return;

    const currentIdx = Math.max(testIndex, selectedIndices.length);
    if (currentIdx >= expectedLetters.length) return;

    let targetIndex = currentIdx;
    while (targetIndex < expectedLetters.length && expectedLetters[targetIndex] === '') {
      targetIndex++;
    }
    if (targetIndex >= expectedLetters.length) return;

    if (letter === expectedLetters[targetIndex]) {
      let nextIndex = targetIndex + 1;
      while (nextIndex < expectedLetters.length && expectedLetters[nextIndex] === '') {
        nextIndex++;
      }
      setTestIndex(nextIndex);
      if (selectedIndices.length < nextIndex) {
        setSelectedIndices(Array.from({ length: nextIndex }, (_, i) => i));
      }
      if (nextIndex >= expectedLetters.length) {
        completeTest();
      }
      return;
    }

    const nextMistakes = testMistakes + 1;
    setTestMistakes(nextMistakes);
    if (nextMistakes >= MAX_MISTAKES) failTest();
  }, [mode, testComplete, testFailed, testIndex, selectedIndices, expectedLetters, completeTest, testMistakes, failTest]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (/^[a-z]$/.test(key)) submitLetter(key);
  }, [submitLetter]);

  const handleHiddenInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    e.target.value = '';
    const key = value.slice(-1).toLowerCase();
    if (/^[a-z]$/.test(key)) submitLetter(key);
  }, [submitLetter]);

  const toggleKeyboard = useCallback(() => {
    if (keyboardOpen) hiddenInputRef.current?.blur();
    else hiddenInputRef.current?.focus();
  }, [keyboardOpen]);

  const handleWordTap = useCallback((originalIdx: number) => {
    if (selectedIndices.includes(originalIdx)) return;
    hiddenInputRef.current?.blur();

    const currentIdx = Math.max(testIndex, selectedIndices.length);
    if (currentIdx >= activeWords.length) return;

    const tappedWord = activeWords[originalIdx]?.toLowerCase();
    const expectedWord = activeWords[currentIdx]?.toLowerCase();

    if (tappedWord === expectedWord) {
      const nextSelected = [...selectedIndices, originalIdx];
      setSelectedIndices(nextSelected);
      const nextRevealed = currentIdx + 1;
      if (testIndex < nextRevealed) setTestIndex(nextRevealed);
      setWrongTapIndex(null);
      if (nextRevealed === activeWords.length) completeTest();
      return;
    }

    const nextMistakes = testMistakes + 1;
    setWrongTapIndex(originalIdx);
    setTestMistakes(nextMistakes);
    setTimeout(() => setWrongTapIndex(null), 400);
    if (nextMistakes >= MAX_MISTAKES) failTest();
  }, [selectedIndices, testIndex, activeWords, testMistakes, completeTest, failTest]);

  const handleRetry = useCallback(() => {
    setTestIndex(0);
    setTestMistakes(0);
    setTestComplete(false);
    setTestFailed(false);
    setShowSuccess(false);
    setSelectedIndices([]);
    setWrongTapIndex(null);
    containerRef.current?.focus();
  }, []);

  const handleReadComplete = useCallback(() => {
    onEncodingRep(activeVerseNum, 'full');
  }, [activeVerseNum, onEncodingRep]);

  // --- Recitation mode ---
  if (recitationGroup && recitationGroup.pericope) {
    const lastVerse = recitationGroup.verses[recitationGroup.verses.length - 1]?.verse;
    return (
      <Recitation
        pericopeName={recitationGroup.pericope.name}
        pericopeId={recitationGroup.pericope.id}
        verses={recitationGroup.verses}
        onExit={() => setRecitationPericope(null)}
        onComplete={async (pericopeId, verseCount) => {
          if (userId) {
            await supabase.rpc('update_daily_activity', {
              p_user_id: userId,
              p_verses_typed: 0,
              p_reviews_completed: 1,
              p_xp_earned: verseCount * 2,
            });
          }
          setRecitationPericope(null);
          const nextVerse = verses.find((v) => lastVerse !== undefined && v.verse > lastVerse)?.verse;
          if (nextVerse) onVerseSelect(nextVerse);
        }}
      />
    );
  }

  // --- Determine highlight class for a completed verse ---
  const getVerseHighlight = (verseNum: number) => {
    const progress = verseProgress[verseNum];
    if (!progress) return '';
    if (progress.retrievalPassed) {
      return 'bg-success/10 decoration-success/30';
    }
    if (progress.retrievalUnlocked) {
      return 'bg-warning/10 decoration-warning/30';
    }
    if (progress.encodingReps > 0) {
      return 'bg-primary/5 decoration-primary/20';
    }
    return '';
  };

  // Get pericope for a verse number
  const getPericopeFor = (verseNum: number) => {
    return pericopes.find((p) => p.verseStart === verseNum);
  };

  // --- Recitation prompt overlay ---
  if (recitationPrompt) {
    return (
      <div
        ref={containerRef}
        tabIndex={0}
        className="flex flex-col h-full outline-none"
      >
        <div className="text-center py-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Ready to recite
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            All verses in <span className="font-medium text-foreground">{recitationPrompt.pericopeName}</span> are learned.
          </p>
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setRecitationPrompt(null);
                setRecitationPericope(recitationPrompt.pericopeId);
              }}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Begin recitation
            </button>
            <button
              type="button"
              onClick={() => {
                setRecitationPrompt(null);
                const nextVerse = findNextVerse();
                if (nextVerse) onVerseSelect(nextVerse);
              }}
              className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex flex-col h-full outline-none"
    >
      <input
        ref={hiddenInputRef}
        type="text"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        onChange={handleHiddenInput}
        onFocus={() => setKeyboardOpen(true)}
        onBlur={() => setKeyboardOpen(false)}
        className="fixed -top-24 left-0 opacity-0 w-px h-px pointer-events-none"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* The Growing Poster */}
      <div className="space-y-0">
        {visibleVerses.map((verse) => {
          const isActive = verse.verse === activeVerseNum;
          const progress = verseProgress[verse.verse];
          const isPassed = progress?.retrievalPassed;
          const pericope = getPericopeFor(verse.verse);

          return (
            <div key={verse.verse}>
              {/* Pericope heading */}
              {pericope && (
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium mt-5 mb-2 first:mt-0">
                  {pericope.name}
                </p>
              )}

              {isActive ? (
                /* ── Active verse: practice interface ── */
                <div
                  ref={activeVerseRef}
                  className={
                    'py-2 transition-all ' +
                    (showSuccess && testComplete
                      ? 'rounded-sm bg-success/8'
                      : '')
                  }
                >
                  {/* Success flash */}
                  {showSuccess && testComplete ? (
                    <div>
                      <p className="font-serif text-lg leading-relaxed text-foreground">
                        <sup className="mr-0.5 text-[9px] font-semibold text-success/70 align-super">{activeVerseNum}</sup>
                        {activeVerse?.text}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-success">
                        <Check className="w-3 h-3" /> Learned
                      </span>
                    </div>
                  ) : mode === 'read' ? (
                    /* Read mode */
                    <div>
                      <p className="font-serif text-lg leading-relaxed text-foreground">
                        <sup className="mr-0.5 text-[9px] font-semibold text-primary/60 align-super">{activeVerseNum}</sup>
                        {activeVerse?.text}
                      </p>

                      {!isPassed && (
                        <div className="mt-3 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={handleReadComplete}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
                          >
                            I've read this
                          </button>
                          <span className="text-[11px] text-muted-foreground tabular-nums">
                            {Math.min(encodingReps, REPS_TO_UNLOCK)}/{REPS_TO_UNLOCK}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Test mode */
                    <div>
                      <p className="font-serif text-lg leading-relaxed">
                        <sup className="mr-0.5 text-[9px] font-semibold text-primary align-super">{activeVerseNum}</sup>
                        {activeWords.map((word, wordIndex) => {
                          const trailing = wordIndex < activeWords.length - 1 ? ' ' : '';

                          if (wordIndex < revealedCount) {
                            return <span key={wordIndex} className="text-foreground">{word}{trailing}</span>;
                          }

                          if (wordIndex === revealedCount && !testComplete && !testFailed) {
                            return (
                              <span key={wordIndex}>
                                <span className="inline-block w-0">
                                  <span className="text-primary text-xl animate-pulse font-light">|</span>
                                </span>
                                <span className="border-b border-muted-foreground/25 text-transparent">{word}</span>
                                {trailing && <span className="text-transparent">{trailing}</span>}
                              </span>
                            );
                          }

                          return (
                            <span key={wordIndex}>
                              <span className="border-b border-muted-foreground/12 text-transparent">{word}</span>
                              {trailing && <span className="text-transparent">{trailing}</span>}
                            </span>
                          );
                        })}
                      </p>

                      {/* Recall progress */}
                      {!testFailed && (
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <Progress
                            value={activeWords.length > 0 ? (revealedCount / activeWords.length) * 100 : 0}
                            className="h-1 flex-1"
                          />
                          <span className="inline-flex items-center gap-0.5 tabular-nums">
                            <Target className="w-2.5 h-2.5" />
                            {testMistakes > 0 ? `${MAX_MISTAKES - testMistakes}` : '✓'}
                          </span>
                        </div>
                      )}

                      {/* Word bank */}
                      {!testComplete && !testFailed && (
                        <div className="mt-4 border-t border-border/30 pt-3">
                          <div className="flex flex-wrap gap-1.5">
                            {shuffledWords.map(({ word, originalIdx }) => {
                              const isSelected = selectedIndices.includes(originalIdx);
                              const isWrong = wrongTapIndex === originalIdx;
                              return (
                                <button
                                  key={originalIdx}
                                  type="button"
                                  onClick={() => handleWordTap(originalIdx)}
                                  disabled={isSelected}
                                  className={
                                    'rounded-full px-2.5 py-1.5 text-xs font-medium transition-all ' +
                                    (isSelected
                                      ? 'border border-border/30 bg-background text-muted-foreground/30 opacity-40'
                                      : isWrong
                                        ? 'border border-destructive/30 bg-destructive/10 text-destructive scale-95'
                                        : 'border border-border/50 bg-background text-foreground hover:border-primary/30 active:scale-95')
                                  }
                                >
                                  {word}
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-2 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={toggleKeyboard}
                              className="md:hidden inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Keyboard className="w-3 h-3" />
                              {keyboardOpen ? 'Close' : 'Type'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Failure */}
                      {testFailed && (
                        <div className="mt-3 flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-2.5">
                          <p className="text-xs text-destructive">Too many mistakes</p>
                          <button
                            type="button"
                            onClick={handleRetry}
                            className="inline-flex items-center gap-1 text-xs text-foreground hover:text-primary transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Retry
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode toggle */}
                  {!showSuccess && (
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {mode === 'read' ? (
                          <><FlaskConical className="w-3 h-3" /> Test</>
                        ) : (
                          <><BookOpen className="w-3 h-3" /> Read</>
                        )}
                      </button>
                      {mode === 'test' && (
                        <button
                          type="button"
                          onClick={toggleKeyboard}
                          className="md:hidden inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Keyboard className="w-3 h-3" />
                          {keyboardOpen ? 'Close' : 'Keyboard'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* ── Completed verse: first-letter abbreviation with highlighter ── */
                <button
                  type="button"
                  onClick={() => onVerseSelect(verse.verse)}
                  className={
                    'text-left w-full py-0.5 transition-colors hover:opacity-80 ' +
                    'rounded-sm px-1 -mx-1 ' +
                    getVerseHighlight(verse.verse)
                  }
                >
                  <span className="font-serif text-sm leading-relaxed text-foreground/50">
                    <sup className="mr-0.5 text-[8px] text-muted-foreground/40 align-super">{verse.verse}</sup>
                    {isPassed
                      ? toFirstLetters(verse.text)
                      : verse.text}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Scroll indicator when there are more verses */}
      {activeVerseNum < verses[verses.length - 1]?.verse && (
        <div className="mt-4 flex justify-center">
          <ChevronDown className="w-4 h-4 text-muted-foreground/30 animate-bounce" />
        </div>
      )}
    </div>
  );
}
