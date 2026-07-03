import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookKey } from "@/data/bible";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RotateCcw, ChevronRight } from "lucide-react";
import { normalizeForCompare, firstLettersMask, tokenize } from "@/features/acrostic/engine/text";
import { getVerseStatus, recordAttempt } from "@/lib/progress";
import { VerseRenderer } from "@/components/Typing/VerseRenderer";

interface VerseProgressSessionProps {
  book: BookKey;
  chapter: number;
  verses: string[];
  bookLabel: string;
}

type Pass = 1 | 2 | 3; // 1=full verse, 2=first letters, 3=recall
type SessionMode = 'learn' | 'review';

interface VerseState {
  currentVerse: number;
  pass: Pass;
  mode: SessionMode;
  reviewVerses: number[];
}

export const VerseProgressSession = ({ book, chapter, verses, bookLabel }: VerseProgressSessionProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Core session state
  const [verseState, setVerseState] = useState<VerseState>({
    currentVerse: 1, // Start from verse 1
    pass: 1,
    mode: 'learn',
    reviewVerses: []
  });
  
  // Typing state
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const currentVerseText = verses[verseState.currentVerse - 1] || "";
  
  // Target depends on the pass
  const target = useMemo(() => {
    if (verseState.pass === 1) {
      // Pass 1: Type full verse
      return normalizeForCompare(currentVerseText);
    } else {
      // Pass 2 & 3: Type only first letters
      const firstLettersText = firstLettersMask(tokenize(currentVerseText), { keepPunct: false, placeholder: "" });
      return normalizeForCompare(firstLettersText);
    }
  }, [verseState.pass, currentVerseText]);
  
  // Calculate how many verses are "mastered" (completed all 3 passes)
  const masteredCount = useMemo(() => {
    let count = 0;
    for (let i = 1; i <= verses.length; i++) {
      const status = getVerseStatus(book, chapter, i);
      if (status === 'mastered') count++;
    }
    return count;
  }, [book, chapter, verses.length]);

  // Generate display text based on current pass
  const display = useMemo(() => {
    if (verseState.pass === 1) {
      // Pass 1: Show full verse
      return currentVerseText;
    } else if (verseState.pass === 2) {
      // Pass 2: Show first letters as cues
      return firstLettersMask(tokenize(currentVerseText), { keepPunct: false, placeholder: "" });
    } else {
      // Pass 3: No cues, but user still types first letters
      return "";
    }
  }, [verseState.pass, currentVerseText]);

  const progress = target.length ? typed.length / target.length : 0;
  const accuracy = (correct + errors) > 0 ? correct / (correct + errors) : 1;
  
  useEffect(() => {
    inputRef.current?.focus();
  }, [verseState]);

  const resetTyping = () => {
    setTyped("");
    setErrors(0);
    setCorrect(0);
    setStartedAt(null);
  };

  const advanceToNextStep = () => {
    const acc = (correct + errors) > 0 ? correct / (correct + errors) : 1;
    const memorySuccess = verseState.pass === 3 && acc >= 0.95;
    
    console.log(`advanceToNextStep: Pass ${verseState.pass}, Accuracy: ${Math.round(acc * 100)}%`);
    
    // Record the attempt
    recordAttempt({ book, chapter, verseIndex: verseState.currentVerse - 1 }, acc, memorySuccess);
    
    if (verseState.pass < 3) {
      // Advance to next pass for same verse
      console.log(`Moving to pass ${verseState.pass + 1}`);
      setVerseState(prev => ({ ...prev, pass: (prev.pass + 1) as Pass }));
      resetTyping();
    } else {
      // Completed all 3 passes for this verse
      if (verseState.mode === 'learn') {
        if (verseState.currentVerse < verses.length) {
          // Move to next verse, but first do review of previous verses
          const prevVerses = [];
          for (let i = 1; i < verseState.currentVerse; i++) {
            prevVerses.push(i);
          }
          
          if (prevVerses.length > 0) {
            setVerseState(prev => ({
              ...prev,
              mode: 'review',
              pass: 3, // Review is always recall (pass 3)
              reviewVerses: prevVerses,
              currentVerse: prevVerses[0]
            }));
          } else {
            // No previous verses, just move to next
            setVerseState(prev => ({
              ...prev,
              currentVerse: prev.currentVerse + 1,
              pass: 1
            }));
          }
        } else {
          // Completed all verses in learning mode
          // Start final review of all verses
          setVerseState(prev => ({
            ...prev,
            mode: 'review',
            pass: 3,
            reviewVerses: Array.from({ length: verses.length }, (_, i) => i + 1),
            currentVerse: 1
          }));
        }
      } else {
        // In review mode
        const currentIndex = verseState.reviewVerses.indexOf(verseState.currentVerse);
        if (currentIndex < verseState.reviewVerses.length - 1) {
          // Move to next verse in review
          setVerseState(prev => ({
            ...prev,
            currentVerse: prev.reviewVerses[currentIndex + 1]
          }));
        } else {
          // Completed review
          if (verseState.currentVerse < verses.length) {
            // Return to learning mode with next verse
            setVerseState(prev => ({
              ...prev,
              mode: 'learn',
              pass: 1,
              currentVerse: prev.currentVerse + 1,
              reviewVerses: []
            }));
          } else {
            // Completely finished!
            // Could navigate away or show completion
            navigate('/browse');
          }
        }
      }
      resetTyping();
    }
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
      setCorrect(c); setErrors(er);
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
      const ok = ch === target[at];
      setTyped(t => t + ch);
      if (ok) setCorrect(c => c + 1); else setErrors(er => er + 1);

      const willComplete = at + 1 === target.length;
      if (willComplete) {
        console.log(`Completed! Pass ${verseState.pass}, Verse ${verseState.currentVerse}, Target length: ${target.length}`);
        setTimeout(() => {
          advanceToNextStep();
        }, 300);
      }
    }
  };

  const getProgressText = () => {
    if (verseState.mode === 'review') {
      const currentIndex = verseState.reviewVerses.indexOf(verseState.currentVerse);
      return `Review ${currentIndex + 1}/${verseState.reviewVerses.length}`;
    }
    return `Verse ${verseState.currentVerse}/${verses.length}`;
  };

  const getPassDescription = () => {
    if (verseState.mode === 'review') return "Review: Type first letters from memory";
    if (verseState.pass === 1) return "Pass 1: Type the full verse";
    if (verseState.pass === 2) return "Pass 2: Type first letters (with cues)";
    return "Pass 3: Type first letters (from memory)";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border z-10">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/browse')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{bookLabel} {chapter}</h1>
                <p className="text-sm text-muted-foreground">{getProgressText()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">{masteredCount}/{verses.length} verses mastered</div>
                <Progress value={(masteredCount / verses.length) * 100} className="w-32" />
              </div>
            </div>
          </div>

          {/* Current session stats */}
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Pass</div>
              <div className="font-semibold">
                {verseState.mode === 'review' ? '3' : verseState.pass}/3
                {verseState.mode === 'review' && (
                  <Badge variant="outline" className="ml-2">Review</Badge>
                )}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Accuracy</div>
              <div className="font-semibold">{Math.round(accuracy * 100)}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Progress</div>
              <div className="font-semibold">{Math.round(progress * 100)}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Verse</div>
              <div className="font-semibold">{verseState.currentVerse}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {getPassDescription()}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetTyping}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          <div 
            className="min-h-[200px] mb-6 p-6 bg-muted/30 rounded-lg cursor-text" 
            onClick={() => inputRef.current?.focus()}
          >
            {verseState.pass === 1 ? (
              // Pass 1: Type full verse with character feedback
              <VerseRenderer 
                text={currentVerseText}
                typed={typed}
              />
            ) : verseState.pass === 2 ? (
              // Pass 2: Type first letters with cues shown
              <div className="space-y-4">
                <div className="text-lg text-muted-foreground mb-4">
                  Full verse: <span className="font-mono opacity-70">{currentVerseText}</span>
                </div>
                <div className="text-lg font-medium mb-2">Type the first letters:</div>
                <VerseRenderer 
                  text={target}
                  typed={typed}
                />
              </div>
            ) : (
              // Pass 3: Type first letters from memory (NO CUES!)
              <div className="space-y-4">
                <div className="text-lg text-muted-foreground mb-2">Recall the first letters from memory:</div>
                <div className="text-lg leading-8">
                  {/* Show blurred placeholders for progress/word count */}
                  {Array.from(target).map((ch, i) => {
                    const isCurrent = i === typed.length;
                    const isTyped = i < typed.length;
                    const correct = isTyped ? typed[i] === target[i] : undefined;
                    
                    if (ch === ' ') {
                      return <span key={i} className="mx-1"></span>;
                    }
                    
                    return (
                      <span 
                        key={i} 
                        className={`inline-block w-6 h-8 mx-0.5 rounded text-center leading-8 cursor-help transition-all ${
                          isTyped
                            ? correct
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                            : isCurrent
                            ? "bg-blue-500 animate-pulse text-white"
                            : "bg-gray-300 blur-sm hover:blur-none hover:bg-yellow-200"
                        }`}
                        title={isTyped ? `Typed: ${typed[i]}` : `Hint: hover to peek (${target[i]})`}
                      >
                        {isTyped ? typed[i] : "•"}
                      </span>
                    );
                  })}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Progress: {typed.length}/{target.length} letters</div>
                  <div className="text-xs opacity-70">💡 Stuck? Hover over a gray dot for a hint</div>
                </div>
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            className="sr-only"
            onKeyDown={handleKeyDown}
            onPaste={(e) => e.preventDefault()}
            value=""
            onChange={() => {}} // Controlled input to prevent text showing
            autoFocus
            aria-hidden
          />

          {/* Progress bar */}
          <div className="mb-4">
            <Progress value={progress * 100} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{typed.length} / {target.length} characters</span>
              <span>{Math.round(accuracy * 100)}% accuracy</span>
            </div>
          </div>

          {/* Review verses indicator */}
          {verseState.mode === 'review' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ChevronRight className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Reviewing verses: {verseState.reviewVerses.join(', ')}
                </span>
              </div>
              <p className="text-xs text-blue-700">
                Practice the verses you've learned before moving to the next one.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};