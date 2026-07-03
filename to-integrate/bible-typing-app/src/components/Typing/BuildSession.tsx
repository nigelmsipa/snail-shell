import { useEffect, useMemo, useRef, useState } from "react";
import { bible, BookKey } from "@/data/bible";
import { getChapterStatuses, getContiguousMasteredCount, isMastered, recordAttempt } from "@/lib/progress";
import { VerseRenderer } from "./VerseRenderer";
import { StatsOverlay } from "./StatsOverlay";
import { RoundDots } from "./RoundDots";
import { ChapterProgressBar } from "./ChapterProgressBar";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface BuildSessionProps {
  book: BookKey;
  chapter: number;
  initialTarget?: number; // 1-based
}

type Stage = "learn" | "cumulative";

export const BuildSession = ({ book, chapter, initialTarget }: BuildSessionProps) => {
  const verses = bible[book][chapter];
  const [targetIndex, setTargetIndex] = useState(() => {
    if (initialTarget && initialTarget >= 1) return Math.min(initialTarget - 1, verses.length - 1);
    const contiguous = getContiguousMasteredCount(book, chapter, verses.length);
    return Math.min(contiguous, verses.length - 1);
  });
  const [stage, setStage] = useState<Stage>("learn");
  const [round, setRound] = useState(1);
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [memoryHintVisible, setMemoryHintVisible] = useState(false);
  const [seqIndex, setSeqIndex] = useState(0); // for cumulative stage
  const [completedChapter, setCompletedChapter] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const targetText = stage === "learn" ? verses[targetIndex] : verses[seqIndex];
  const memoryMode = stage === "learn" ? (round === 4) : true;

  useEffect(() => {
    inputRef.current?.focus();
    if (!sessionStartedAt) setSessionStartedAt(Date.now());
  }, []);

  useEffect(() => {
    if (memoryMode) {
      setMemoryHintVisible(true);
      const t = setTimeout(() => setMemoryHintVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [memoryMode, stage, round]);

  const progress = targetText.length ? typed.length / targetText.length : 0;
  const accuracy = (correct + errors) > 0 ? correct / (correct + errors) : 1;
  const wpm = useMemo(() => {
    if (!startedAt) return 0;
    const elapsedMin = (Date.now() - startedAt) / 60000;
    const chars = correct + errors;
    return elapsedMin > 0 ? (chars / 5) / elapsedMin : 0;
  }, [startedAt, correct, errors]);

  const timeElapsed = sessionStartedAt ? Math.floor((Date.now() - sessionStartedAt) / 1000) : 0;

  const statuses = getChapterStatuses(book, chapter, verses.length);

  const handleFocus = () => inputRef.current?.focus();

  const resetTyping = () => {
    setTyped("");
    setErrors(0);
    setCorrect(0);
    setStartedAt(null);
  };

  const handleCompletion = () => {
    const acc = accuracy;
    if (stage === "learn") {
      const memSuccess = memoryMode && acc === 1;
      // record attempt for the specific target verse
      recordAttempt({ book, chapter, verseIndex: targetIndex }, acc, memSuccess);
      if (round < 4) {
        setRound((r) => r + 1);
      } else {
        if (acc >= 0.9 && memSuccess) {
          // proceed to cumulative check 1..target
          setStage("cumulative");
          setSeqIndex(0);
          toast({ title: "Great!", description: "Now type verses 1 to current from memory." });
        } else {
          // restart learning this target
          setRound(1);
          toast({ title: "Keep practicing", description: "Try to reach high accuracy and perfect memory." });
        }
      }
      resetTyping();
    } else {
      // cumulative stage: require perfect accuracy for each verse 1..target
      if (acc === 1) {
        if (seqIndex < targetIndex) {
          setSeqIndex((i) => i + 1);
          resetTyping();
        } else {
          // completed cumulative for current target
          const nextTarget = targetIndex + 1;
          if (nextTarget >= verses.length) {
            setCompletedChapter(true);
            toast({ title: "Chapter complete!", description: "You mastered all verses." });
          } else {
            setTargetIndex(nextTarget);
            setStage("learn");
            setRound(1);
            toast({ title: "Well done!", description: `Advance to verse ${nextTarget + 1}.` });
          }
          resetTyping();
        }
      } else {
        // back to learning current target
        setStage("learn");
        setRound(1);
        toast({ title: "Try again", description: "Cumulative check failed, practice the target again." });
        resetTyping();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (completedChapter) return;
    if (!startedAt) setStartedAt(Date.now());
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      if (typed.length === 0) return;
      const newTyped = typed.slice(0, -1);
      setTyped(newTyped);
      let c = 0, er = 0;
      for (let i = 0; i < newTyped.length; i++) {
        if (newTyped[i] === targetText[i]) c++; else er++;
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
      if (typed.length >= targetText.length) return;
      const ch = e.key;
      const at = typed.length;
      const isCorrect = ch === targetText[at];
      setTyped((t) => t + ch);
      if (isCorrect) setCorrect((c) => c + 1);
      else setErrors((er) => er + 1);

      const willComplete = at + 1 === targetText.length;
      if (willComplete) {
        setTimeout(handleCompletion, 150);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative" onClick={() => inputRef.current?.focus()}>
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
          {stage === "learn" ? <RoundDots current={round} /> : <div className="text-xs text-muted-foreground">Memory - Verse {seqIndex + 1}</div>}
        </div>
        <ChapterProgressBar statuses={statuses} currentIndex={stage === "learn" ? targetIndex : seqIndex} />
      </div>

      <Card className="p-6 bg-card border-border">
        {memoryHintVisible && (
          <div className="mb-4 text-sm text-muted-foreground animate-enter cursor-pointer" onClick={() => setMemoryHintVisible(false)}>
            Memory mode: underscores are letters, ▲ marks capitals, punctuation is highlighted. Good luck!
          </div>
        )}
        <VerseRenderer text={targetText} typed={typed} />
        <input
          ref={inputRef}
          className="sr-only"
          onKeyDown={handleKeyDown}
          onPaste={(e) => e.preventDefault()}
          aria-hidden
        />
      </Card>

      {completedChapter && (
        <div className="mt-6 text-center text-sm text-muted-foreground">You finished this chapter in Build Mode. Great work!</div>
      )}
    </div>
  );
};
