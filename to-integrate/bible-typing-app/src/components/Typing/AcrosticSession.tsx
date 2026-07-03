import { useEffect, useMemo, useRef, useState } from "react";
import { bible, BookKey } from "@/data/bible";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getChapterStatuses, recordAttempt } from "@/lib/progress";
import { firstLettersMask, normalizeForCompare, tokenize, compareTypedToTarget, wordBoundaries, ComparisonResult } from "@/features/acrostic/engine/text";

interface AcrosticSessionProps {
  book: BookKey;
  chapter: number;
}

type Pass = 1 | 2 | 3; // 1=full, 2=first letters, 3=recall
type FeedbackMode = 'none' | 'on_submit' | 'per_word';
type SessionState = 'typing' | 'submitted' | 'completed';

export const AcrosticSession = ({ book, chapter }: AcrosticSessionProps) => {
  const verses = bible[book][chapter];
  const [pass, setPass] = useState<Pass>(1);
  const [verseIndex, setVerseIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>('none');
  const [sessionState, setSessionState] = useState<SessionState>('typing');
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [wordStatuses, setWordStatuses] = useState<boolean[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  const [showUnderscores, setShowUnderscores] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    // Load saved feedback mode
    const saved = localStorage.getItem('acrostic_feedback_mode');
    if (saved && ['none', 'on_submit', 'per_word'].includes(saved)) {
      setFeedbackMode(saved as FeedbackMode);
    }
  }, []);
  
  // Save feedback mode preference
  useEffect(() => {
    localStorage.setItem('acrostic_feedback_mode', feedbackMode);
  }, [feedbackMode]);

  const targetRaw = verses[verseIndex] ?? "";
  const target = useMemo(() => {
    if (pass === 1) return normalizeForCompare(targetRaw);
    if (pass === 2) return normalizeForCompare(firstLettersMask(tokenize(targetRaw), { keepPunct: false, noSpaces: true }));
    // Pass 3: remove spaces and make case-insensitive
    return normalizeForCompare(targetRaw).replace(/\s+/g, '').toLowerCase();
  }, [pass, targetRaw]);
  const display = useMemo(() => {
    if (pass === 1) return targetRaw;
    if (pass === 2) return firstLettersMask(tokenize(targetRaw), { keepPunct: false, placeholder: showUnderscores ? "_" : "", noSpaces: true });
    if (pass === 3 && showPlaceholders) {
      const toks = tokenize(targetRaw);
      return toks.map(t => (t.core ? "•".repeat(t.core.length) : "")).join(" ");
    }
    return ""; // pass 3: recall, no cues
  }, [pass, targetRaw, showUnderscores, showPlaceholders]);

  // Initialize word boundaries for per-word feedback
  const targetTokens = useMemo(() => tokenize(targetRaw), [targetRaw]);
  const boundaries = useMemo(() => wordBoundaries(targetTokens), [targetTokens]);
  
  // Update word statuses for per-word mode
  useEffect(() => {
    if (pass === 3 && feedbackMode === 'per_word') {
      const result = compareTypedToTarget(typed, target);
      setWordStatuses(result.perWord);
    }
  }, [typed, target, pass, feedbackMode]);

  const progress = target.length ? typed.length / target.length : 0;
  const accuracy = (correct + errors) > 0 ? correct / (correct + errors) : 1;
  const wpm = useMemo(() => {
    if (!startedAt) return 0;
    const elapsedMin = (Date.now() - startedAt) / 60000;
    const chars = correct + errors;
    return elapsedMin > 0 ? (chars / 5) / elapsedMin : 0;
  }, [startedAt, correct, errors]);

  const statuses = getChapterStatuses(book, chapter, verses.length);

  const resetForNext = () => {
    setTyped("");
    setErrors(0);
    setCorrect(0);
    setStartedAt(null);
    setSessionState('typing');
    setComparisonResult(null);
    setWordStatuses([]);
    setHintsUsed(0);
  };

  const handleSubmit = () => {
    if (pass !== 3 || feedbackMode !== 'on_submit') return;
    
    const result = compareTypedToTarget(typed, target);
    const adjustedAccuracy = Math.max(0.8, result.accuracy - (hintsUsed * 0.05)); // 5% penalty per hint, min 80%
    const memSuccess = adjustedAccuracy === 1;
    
    setComparisonResult(result);
    setSessionState('submitted');
    recordAttempt({ book, chapter, verseIndex }, adjustedAccuracy, memSuccess);
  };

  const handleRetry = () => {
    setTyped("");
    setErrors(0);
    setCorrect(0);
    setSessionState('typing');
    setComparisonResult(null);
    setHintsUsed(0);
    inputRef.current?.focus();
  };

  const handleNext = () => {
    if (verseIndex < verses.length - 1) {
      setVerseIndex(i => i + 1);
      resetForNext();
    } else if (pass < 3) {
      setPass((p) => (p + 1) as Pass);
      setVerseIndex(0);
      resetForNext();
    } else {
      setCompleted(true);
    }
  };

  const handleHint = () => {
    if (pass !== 3 || sessionState !== 'typing') return;
    
    // Find the next word that hasn't been completed yet
    const typedNorm = normalizeForCompare(typed);
    const words = targetTokens.filter(t => t.core);
    let nextIncompleteWordIndex = 0;
    let position = 0;
    
    for (let i = 0; i < words.length; i++) {
      const wordEnd = position + words[i].core.length;
      if (typedNorm.length <= position || !typedNorm.slice(position, wordEnd).startsWith(words[i].core)) {
        nextIncompleteWordIndex = i;
        break;
      }
      position = wordEnd + 1; // +1 for space
    }
    
    if (nextIncompleteWordIndex < words.length) {
      const word = words[nextIncompleteWordIndex];
      const hint = word.core[0];
      // Add the first letter as a hint by updating typed to include it
      const targetUpToHint = target.slice(0, typedNorm.length + 1);
      if (targetUpToHint[typedNorm.length] === hint) {
        setTyped(prev => prev + hint);
        setCorrect(c => c + 1);
        setHintsUsed(h => h + 1);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (completed || sessionState === 'submitted') return;
    if (!startedAt) setStartedAt(Date.now());
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      if (typed.length === 0) return;
      const newTyped = typed.slice(0, -1);
      setTyped(newTyped);
      let c = 0, er = 0;
      const normalizedTyped = pass === 3 ? newTyped.replace(/\s+/g, '').toLowerCase() : newTyped;
      for (let i = 0; i < normalizedTyped.length; i++) {
        if (normalizedTyped[i] === target[i]) c++; else er++;
      }
      setCorrect(c); setErrors(er);
      return;
    }
    if (e.key === "Tab" || e.key === "Enter") { 
      e.preventDefault(); 
      if (pass === 3 && feedbackMode === 'on_submit' && typed.length > 0) {
        handleSubmit();
      }
      return; 
    }

    if (e.key.length === 1) {
      e.preventDefault();
      if (typed.length >= target.length) return;
      const ch = e.key;
      const normalizedTyped = pass === 3 ? typed.replace(/\s+/g, '').toLowerCase() : typed;
      const at = normalizedTyped.length;
      if (at >= target.length) return;
      const normalizedCh = pass === 3 ? ch.replace(/\s+/g, '').toLowerCase() : ch;
      const ok = normalizedCh === target[at];
      setTyped(t => t + ch);
      if (ok) setCorrect(c => c + 1); else setErrors(er => er + 1);

      const willComplete = at + 1 === target.length;
      if (willComplete) {
        const finalCorrect = ok ? correct + 1 : correct;
        const finalTotal = correct + errors + 1;
        const acc = finalCorrect / finalTotal;
        
        // For pass 3, handle different feedback modes
        if (pass === 3) {
          if (feedbackMode === 'on_submit') {
            // Don't auto-advance, wait for submit
            return;
          } else {
            // Auto-advance for 'none' and 'per_word' modes
            const adjustedAccuracy = Math.max(0.8, acc - (hintsUsed * 0.05));
            const memSuccess = adjustedAccuracy === 1;
            recordAttempt({ book, chapter, verseIndex }, adjustedAccuracy, memSuccess);
          }
        } else {
          // Pass 1 and 2 behavior unchanged
          recordAttempt({ book, chapter, verseIndex }, acc, false);
        }

        setTimeout(() => {
          handleNext();
        }, 120);
      }
    }
  };

  return (
    <div className="relative">
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border mb-6 pb-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="grid grid-cols-5 gap-x-4 gap-y-1 text-xs">
            <div className="opacity-80">Acc</div>
            <div className="opacity-80">WPM</div>
            <div className="opacity-80">Prog</div>
            <div className="opacity-80">Pass</div>
            <div className="opacity-80">Verse</div>
            <div className="font-semibold tabular-nums">{Math.round(accuracy * 100)}%</div>
            <div className="font-semibold tabular-nums">{Math.max(0, Math.round(wpm))}</div>
            <div className="font-semibold tabular-nums">{Math.round(progress * 100)}%</div>
            <div className="font-semibold">{pass}/3</div>
            <div className="font-semibold">{verseIndex + 1}/{verses.length}</div>
          </div>
        </div>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="mb-3 text-sm text-muted-foreground flex items-center justify-between gap-4">
          <div>
            {pass === 1 && "Pass 1: Type the full verse."}
            {pass === 2 && "Pass 2: Only first letters are shown."}
            {pass === 3 && (
              <span>
                Pass 3: Recall {feedbackMode === 'none' ? 'with no cues' : 
                               feedbackMode === 'per_word' ? 'with word feedback' :
                               'and submit for review'}.
                {hintsUsed > 0 && <span className="ml-2 text-orange-600">({hintsUsed} hint{hintsUsed > 1 ? 's' : ''} used)</span>}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {pass === 2 && (
              <label className="flex items-center gap-2 text-xs">
                <input 
                  type="checkbox" 
                  checked={showUnderscores} 
                  onChange={(e) => setShowUnderscores(e.target.checked)}
                  className="w-3 h-3"
                />
                Show underscores
              </label>
            )}
            {pass === 3 && (
              <>
                <Select value={feedbackMode} onValueChange={(v) => setFeedbackMode(v as FeedbackMode)}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="per_word">Per-word</SelectItem>
                    <SelectItem value="on_submit">On submit</SelectItem>
                  </SelectContent>
                </Select>
                <label className="flex items-center gap-2 text-xs">
                  <input 
                    type="checkbox" 
                    checked={showPlaceholders} 
                    onChange={(e) => setShowPlaceholders(e.target.checked)}
                    className="w-3 h-3"
                  />
                  Placeholders
                </label>
              </>
            )}
          </div>
        </div>
        
        <div className="min-h-[120px] text-lg leading-8 whitespace-pre-wrap">
          {display || <span className="opacity-40">(no cues)</span>}
        </div>
        
        {/* Per-word feedback dots */}
        {pass === 3 && feedbackMode === 'per_word' && wordStatuses.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {wordStatuses.map((isCorrect, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full ${
                  isCorrect ? 'bg-green-500' : 'bg-red-400'
                }`}
                title={`Word ${idx + 1}: ${isCorrect ? 'correct' : 'incorrect'}`}
              />
            ))}
          </div>
        )}
        
        {/* Submission result */}
        {sessionState === 'submitted' && comparisonResult && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Result:</span>
              <Badge variant={comparisonResult.accuracy > 0.9 ? "default" : "secondary"}>
                {Math.round(comparisonResult.accuracy * 100)}% accuracy
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              {comparisonResult.accuracy === 1 ? "Perfect!" : "Keep practicing to improve."}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleNext}>Next</Button>
              <Button size="sm" variant="outline" onClick={handleRetry}>Retry</Button>
            </div>
          </div>
        )}
        
        {/* Action buttons for Pass 3 */}
        {pass === 3 && sessionState === 'typing' && (
          <div className="mt-4 flex gap-2">
            {feedbackMode === 'on_submit' && (
              <Button 
                size="sm" 
                onClick={handleSubmit}
                disabled={typed.length === 0}
              >
                Submit
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleHint}
              disabled={typed.length >= target.length}
            >
              Hint
            </Button>
          </div>
        )}
        
        <input
          ref={inputRef}
          className="sr-only"
          onKeyDown={handleKeyDown}
          onPaste={(e) => e.preventDefault()}
          aria-hidden
          disabled={sessionState === 'submitted'}
        />
      </Card>

      {completed && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Acrostic session complete. Great work!
        </div>
      )}
    </div>
  );
};

export default AcrosticSession;

