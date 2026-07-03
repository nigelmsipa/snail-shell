import { useEffect, useMemo, useRef, useState } from "react";
import { bible, BookKey } from "@/data/bible";
import { getChapterStatuses, recordAttempt } from "@/lib/progress";
import { VerseRenderer } from "./VerseRenderer";
import { ChapterProgressBar } from "./ChapterProgressBar";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface FocusSessionProps {
  book: BookKey;
  chapter: number;
  verseNumber: number; // 1-based
}

export const FocusSession = ({ book, chapter, verseNumber }: FocusSessionProps) => {
  const verses = bible[book][chapter];
  const index = Math.max(0, Math.min(verses.length - 1, verseNumber - 1));
  const target = verses[index];

  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [memoryHintVisible, setMemoryHintVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    setMemoryHintVisible(true);
    if (!sessionStartedAt) setSessionStartedAt(Date.now());
    const t = setTimeout(() => setMemoryHintVisible(false), 3500);
    return () => clearTimeout(t);
  }, [book, chapter, verseNumber]);

  const progress = target.length ? typed.length / target.length : 0;
  const accuracy = (correct + errors) > 0 ? correct / (correct + errors) : 1;
  const wpm = useMemo(() => {
    if (!startedAt) return 0;
    const elapsedMin = (Date.now() - startedAt) / 60000;
    const chars = correct + errors;
    return elapsedMin > 0 ? (chars / 5) / elapsedMin : 0;
  }, [startedAt, correct, errors]);

  const timeElapsed = sessionStartedAt ? Math.floor((Date.now() - sessionStartedAt) / 1000) : 0;

  const statuses = getChapterStatuses(book, chapter, verses.length);

  const reset = () => {
    setTyped("");
    setErrors(0);
    setCorrect(0);
    setStartedAt(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!startedAt) setStartedAt(Date.now());
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      if (typed.length === 0) return;
      const newTyped = typed.slice(0, -1);
      setTyped(newTyped);
      let c = 0, er = 0;
      for (let i = 0; i < newTyped.length; i++) {
        if (newTyped[i] === target[i]) c++; else er++;
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
        const memSuccess = acc === 1;
        recordAttempt({ book, chapter, verseIndex: index }, acc, memSuccess);
        setTimeout(() => {
          if (memSuccess) {
            toast({ title: "Perfect!", description: "You typed it from memory with no mistakes." });
          } else {
            toast({ title: "Keep going", description: "Try again until it's perfect from memory." });
          }
          reset();
        }, 150);
      }
    }
  };

  return (
    <div className="relative" onClick={() => inputRef.current?.focus()}>
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border mb-6 pb-4 z-10">
        <div className="flex items-center justify-between mb-4">
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
          <div className="text-xs text-muted-foreground">Focus Mode - Verse {verseNumber}</div>
        </div>
        <ChapterProgressBar statuses={statuses} currentIndex={index} />
      </div>

      <Card className="p-6 bg-card border-border">
        {memoryHintVisible && (
          <div className="mb-4 text-sm text-muted-foreground animate-enter cursor-pointer" onClick={() => setMemoryHintVisible(false)}>
            Focus mode: type this verse from memory. Text is blurred until you type; match capitals and punctuation.
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
    </div>
  );
};

export default FocusSession;