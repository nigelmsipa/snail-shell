import { useEffect, useMemo, useRef, useState } from "react";
import { bible, BookKey } from "@/data/bible";
import { getChapterStatuses, getStatus, getAverageAccuracy, recordAttempt } from "@/lib/progress";
import { VerseRenderer } from "./VerseRenderer";
import { StatsOverlay } from "./StatsOverlay";
import { RoundDots } from "./RoundDots";
import { ChapterProgressBar } from "./ChapterProgressBar";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface TypingSessionProps {
  book: BookKey;
  chapter: number;
  focusVerseNumber: number; // 1-based
}

export const TypingSession = ({ book, chapter, focusVerseNumber }: TypingSessionProps) => {
  const verses = bible[book][chapter];
  const [round, setRound] = useState(1);
  const [verseIndex, setVerseIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [memoryHintVisible, setMemoryHintVisible] = useState(false);
  const [completed, setCompleted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const target = verses[verseIndex];
  const memoryMode = round === 4 && verseIndex === (focusVerseNumber - 1);

  useEffect(() => {
    // autofocus
    inputRef.current?.focus();
    if (!sessionStartedAt) setSessionStartedAt(Date.now());
  }, []);

  useEffect(() => {
    if (round === 4 && verseIndex === 0) {
      setMemoryHintVisible(true);
      const t = setTimeout(() => setMemoryHintVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [round, verseIndex]);

  const progress = target.length ? typed.length / target.length : 0;
  const accuracy = (correct + errors) > 0 ? correct / (correct + errors) : 1;
  const wpm = useMemo(() => {
    if (!startedAt) return 0;
    const elapsedMin = (Date.now() - startedAt) / 60000;
    const chars = correct + errors; // total typed
    return elapsedMin > 0 ? (chars / 5) / elapsedMin : 0;
  }, [startedAt, correct, errors]);

  const timeElapsed = sessionStartedAt ? Math.floor((Date.now() - sessionStartedAt) / 1000) : 0;

  const statuses = getChapterStatuses(book, chapter, verses.length);

  const handleFocus = () => inputRef.current?.focus();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (completed) return;
    if (!startedAt) setStartedAt(Date.now());

    if (e.ctrlKey || e.metaKey || e.altKey) return; // allow shortcuts

    if (e.key === "Backspace") {
      e.preventDefault();
      if (typed.length === 0) return;
      const newTyped = typed.slice(0, -1);
      setTyped(newTyped);
      // recompute counts based on new typed string
      let c = 0, er = 0;
      for (let i = 0; i < newTyped.length; i++) {
        if (newTyped[i] === target[i]) c++;
        else er++;
      }
      setCorrect(c);
      setErrors(er);
      return;
    }
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      if (typed.length >= target.length) return;
      const ch = e.key;
      const at = typed.length;
      const isCorrect = ch === target[at];
      setTyped((t) => t + ch);
      if (isCorrect) setCorrect((c) => c + 1);
      else setErrors((er) => er + 1);

      const willComplete = at + 1 === target.length;
      if (willComplete) {
        const acc = (isCorrect ? correct + 1 : correct) / (correct + errors + 1);
        const memSuccess = memoryMode && acc === 1;
        recordAttempt({ book, chapter, verseIndex }, acc, memSuccess);

        setTimeout(() => {
          // next verse or round
          if (verseIndex < verses.length - 1) {
            setVerseIndex((v) => v + 1);
          } else if (round < 4) {
            setRound((r) => r + 1);
            setVerseIndex(0);
          } else {
            setCompleted(true);
            toast({ title: "Session complete", description: "Great job!" });
          }
          setTyped("");
          setErrors(0);
          setCorrect(0);
          setStartedAt(null);
        }, 150);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative" onClick={handleFocus}>
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border mb-6 pb-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="grid grid-cols-5 gap-x-4 gap-y-1 text-xs">
              <div className="opacity-80">Acc</div>
              <div className="opacity-80">WPM</div>
              <div className="opacity-80">Prog</div>
              <div className="opacity-80">Time</div>
              <div className="opacity-80">Err</div>
              <div className="font-semibold tabular-nums">{Math.round(accuracy * 100)}%</div>
              <div className="font-semibold tabular-nums">{Math.max(0, Math.round(wpm))}</div>
              <div className="font-semibold tabular-nums">{Math.round(progress * 100)}%</div>
              <div className="font-semibold tabular-nums">{timeElapsed > 0 ? `${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}` : '0:00'}</div>
              <div className="font-semibold tabular-nums text-destructive">{errors}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RoundDots current={round} />
            <div className="text-xs text-muted-foreground">Verse {verseIndex + 1}</div>
          </div>
        </div>
        <ChapterProgressBar statuses={statuses} currentIndex={verseIndex} />
      </div>

      <Card className="p-6 bg-card border-border">
        {memoryHintVisible && (
          <div
            className="mb-4 text-sm text-muted-foreground animate-enter cursor-pointer"
            onClick={() => setMemoryHintVisible(false)}
          >
            Memory mode: underscores are letters, ▲ marks capitals, punctuation is highlighted. Good luck!
          </div>
        )}
        <VerseRenderer text={target} typed={typed} />
        <input
          ref={inputRef}
          className="sr-only"
          onKeyDown={handleKeyDown}
          onPaste={(e) => e.preventDefault()}
          aria-hidden
        />
      </Card>


      {completed && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Session complete. You can restart from the setup.
        </div>
      )}
    </div>
  );
};
