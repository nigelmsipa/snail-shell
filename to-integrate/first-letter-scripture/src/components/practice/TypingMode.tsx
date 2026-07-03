import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Verse {
  verse: number;
  text: string;
}

interface TypingModeProps {
  verses: Verse[];
  reference: string;
  onEncodingRep?: (verseNumber: number, difficulty: string) => void;
}

export function TypingMode({ verses, reference, onEncodingRep }: TypingModeProps) {
  const [currentVerseIdx, setCurrentVerseIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [errors, setErrors] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [completedVerses, setCompletedVerses] = useState<Set<number>>(new Set());
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentVerse = verses[currentVerseIdx];
  const target = currentVerse?.text ?? '';

  const accuracy = useMemo(
    () => (totalChars > 0 ? Math.round(((totalChars - errors) / totalChars) * 100) : 100),
    [totalChars, errors]
  );

  const overallProgress = Math.round((completedVerses.size / verses.length) * 100);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (!startTime) setStartTime(Date.now());

      // Count new errors
      const lastChar = value[value.length - 1];
      const expectedChar = target[value.length - 1];
      if (value.length > typed.length && lastChar !== expectedChar) {
        setErrors((prev) => prev + 1);
      }
      setTotalChars((prev) => prev + Math.abs(value.length - typed.length));
      setTyped(value);

      // Calculate WPM
      if (startTime) {
        const minutes = (Date.now() - startTime) / 60000;
        if (minutes > 0) {
          setWpm(Math.round(value.length / 5 / minutes));
        }
      }

      // Check completion
      if (value === target) {
        const newCompleted = new Set(completedVerses);
        newCompleted.add(currentVerse.verse);
        setCompletedVerses(newCompleted);

        if (onEncodingRep) {
          onEncodingRep(currentVerse.verse, 'full');
        }

        // Auto-advance after short delay
        setTimeout(() => {
          if (currentVerseIdx < verses.length - 1) {
            setCurrentVerseIdx((prev) => prev + 1);
            setTyped('');
            setStartTime(null);
          }
        }, 500);
      }
    },
    [typed, target, startTime, currentVerseIdx, verses, completedVerses, currentVerse, onEncodingRep]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentVerseIdx]);

  const handleReset = () => {
    setCurrentVerseIdx(0);
    setTyped('');
    setErrors(0);
    setTotalChars(0);
    setStartTime(null);
    setWpm(0);
    setCompletedVerses(new Set());
  };

  if (!currentVerse) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <Check className="w-12 h-12 text-primary" />
        <p className="text-lg font-semibold text-foreground">All verses typed!</p>
        <div className="flex gap-3">
          <Badge variant="secondary">{accuracy}% accuracy</Badge>
          <Badge variant="secondary">{wpm} WPM</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 mt-2">
          <RotateCcw className="w-3.5 h-3.5" /> Start over
        </Button>
      </div>
    );
  }

  // Render character-by-character comparison
  const renderTarget = () => {
    return target.split('').map((char, i) => {
      let className = 'text-muted-foreground/30';
      if (i < typed.length) {
        className = typed[i] === char ? 'text-primary' : 'text-destructive bg-destructive/10';
      } else if (i === typed.length) {
        className = 'text-foreground border-b-2 border-primary';
      }
      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Verse {currentVerse.verse}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {currentVerseIdx + 1}/{verses.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground tabular-nums">{accuracy}% acc</span>
          <span className="text-xs text-muted-foreground tabular-nums">{wpm} WPM</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleReset}>
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <Progress value={overallProgress} className="h-1" />

      {/* Reference text with character highlighting */}
      <div className="rounded-lg bg-muted/30 p-5 font-mono text-base leading-relaxed tracking-wide break-all select-none">
        {renderTarget()}
      </div>

      {/* Hidden-ish textarea for input */}
      <textarea
        ref={inputRef}
        value={typed}
        onChange={handleInput}
        className="w-full rounded-lg border border-border bg-background p-4 font-mono text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        rows={3}
        placeholder="Start typing..."
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />

      {/* Verse navigation */}
      <div className="flex gap-1 flex-wrap">
        {verses.map((v, i) => (
          <button
            key={v.verse}
            onClick={() => {
              setCurrentVerseIdx(i);
              setTyped('');
              setStartTime(null);
            }}
            className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
              completedVerses.has(v.verse)
                ? 'bg-primary text-primary-foreground'
                : i === currentVerseIdx
                ? 'bg-accent text-accent-foreground ring-1 ring-ring'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {v.verse}
          </button>
        ))}
      </div>
    </div>
  );
}
