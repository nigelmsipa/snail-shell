import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ArrowLeft, BookOpen, Check, RotateCcw, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Verse {
  verse: number;
  text: string;
}

interface RecitationProps {
  pericopeName: string;
  pericopeId: string;
  verses: Verse[];
  onExit: () => void;
  onComplete: (pericopeId: string, verseCount: number) => void;
}

const MAX_MISTAKES = 3;

export function Recitation({ pericopeName, pericopeId, verses, onExit, onComplete }: RecitationProps) {
  const [currentVerseIdx, setCurrentVerseIdx] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [failed, setFailed] = useState(false);
  const [failedAtVerse, setFailedAtVerse] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentVerse = verses[currentVerseIdx];
  const words = useMemo(
    () => currentVerse?.text.split(/\s+/).filter(w => w.length > 0) ?? [],
    [currentVerse]
  );
  const expectedLetters = useMemo(
    () => words.map(w => (w.match(/[a-zA-Z]/)?.[0] ?? '').toLowerCase()),
    [words]
  );
  const verseRange = verses.length > 0
    ? `${verses[0].verse}\u2013${verses[verses.length - 1].verse}`
    : '';
  const progress = ((currentVerseIdx + (revealedCount / Math.max(expectedLetters.length, 1))) / Math.max(verses.length, 1)) * 100;

  useEffect(() => {
    containerRef.current?.focus();
  }, [currentVerseIdx]);

  useEffect(() => {
    setRevealedCount(0);
  }, [currentVerseIdx]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (failed || completed) return;
    const key = e.key.toLowerCase();
    if (!/^[a-z]$/.test(key)) return;

    let idx = revealedCount;
    while (idx < expectedLetters.length && expectedLetters[idx] === '') {
      idx++;
    }
    if (idx >= expectedLetters.length) return;

    if (key === expectedLetters[idx]) {
      let next = idx + 1;
      while (next < expectedLetters.length && expectedLetters[next] === '') {
        next++;
      }
      setRevealedCount(next);

      if (next >= expectedLetters.length) {
        const nextVerseIdx = currentVerseIdx + 1;
        if (nextVerseIdx >= verses.length) {
          setCompleted(true);
          try {
            localStorage.setItem(`boss-mastered-${pericopeId}`, 'true');
          } catch {
            // Ignore storage failures
          }
          setTimeout(() => onComplete(pericopeId, verses.length), 2000);
        } else {
          setTimeout(() => setCurrentVerseIdx(nextVerseIdx), 500);
        }
      }
    } else {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= MAX_MISTAKES) {
        setFailed(true);
        setFailedAtVerse(currentVerse?.verse ?? null);
      }
    }
  }, [failed, completed, revealedCount, expectedLetters, currentVerseIdx, verses.length, mistakes, pericopeId, currentVerse, onComplete]);

  const handleRetry = useCallback(() => {
    setCurrentVerseIdx(0);
    setRevealedCount(0);
    setMistakes(0);
    setFailed(false);
    setFailedAtVerse(null);
    setCompleted(false);
    containerRef.current?.focus();
  }, []);

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-success" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Section Complete</h2>
          <p className="text-sm text-muted-foreground mt-1">{pericopeName}</p>
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
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <BookOpen className="w-3.5 h-3.5" />
          Section Recitation
        </span>
      </div>

      {/* Section info */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">{pericopeName}</h2>
        <p className="text-xs text-muted-foreground">
          Verses {verseRange} &middot; {currentVerseIdx + 1} of {verses.length}
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6 text-xs text-muted-foreground">
        <Progress value={progress} className="h-1.5 flex-1" />
        <span className={mistakes > 0 ? 'text-destructive tabular-nums' : 'tabular-nums'}>
          {mistakes}/{MAX_MISTAKES}
        </span>
      </div>

      {/* Verses */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-lg mx-auto w-full space-y-3">
          {/* Already completed verses */}
          {verses.slice(0, currentVerseIdx).map(v => (
            <p key={v.verse} className="font-serif text-sm leading-relaxed text-success/50">
              <sup className="text-[9px] mr-0.5 text-success/35">{v.verse}</sup>
              {v.text}
            </p>
          ))}

          {/* Current verse */}
          {currentVerse && !failed && (
            <div className="py-2">
              <p className="font-serif text-2xl leading-relaxed">
                <sup className="text-xs mr-1 text-primary font-semibold">{currentVerse.verse}</sup>
                {words.map((word, wIdx) => {
                  const trailing = wIdx < words.length - 1 ? ' ' : '';
                  if (wIdx < revealedCount) {
                    return (
                      <span key={wIdx} className="text-foreground">{word}{trailing}</span>
                    );
                  } else if (wIdx === revealedCount) {
                    return (
                      <span key={wIdx}>
                        <span className="inline-block w-0">
                          <span className="text-primary text-3xl animate-pulse font-light">|</span>
                        </span>
                        <span className="border-b border-muted-foreground/20 text-transparent">{word}</span>
                        {trailing && <span className="text-transparent">{trailing}</span>}
                      </span>
                    );
                  } else {
                    return (
                      <span key={wIdx}>
                        <span className="border-b border-muted-foreground/10 text-transparent">{word}</span>
                        {trailing && <span className="text-transparent">{trailing}</span>}
                      </span>
                    );
                  }
                })}
              </p>
            </div>
          )}

          {/* Failure state */}
          {failed && (
            <div className="space-y-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <p className="font-serif text-base leading-relaxed text-destructive/60">
                <sup className="text-xs mr-1">{failedAtVerse}</sup>
                {currentVerse?.text}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-destructive">Too many mistakes</p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry from start
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
