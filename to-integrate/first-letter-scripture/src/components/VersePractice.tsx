import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { Difficulty, PracticeMode } from '@/types/passage';
import { cn } from '@/lib/utils';

interface VersePracticeProps {
  reference: string;
  text: string;
  abbreviatedText?: string;
  difficulty: Difficulty;
  mode: PracticeMode;
  onComplete: (accuracy: number) => void;
  onSkip?: () => void;
}

export function VersePractice({
  reference,
  text,
  abbreviatedText,
  difficulty,
  mode,
  onComplete,
  onSkip,
}: VersePracticeProps) {
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setUserInput('');
    setShowResult(false);
    setShowHint(false);
    textareaRef.current?.focus();
  }, [text, difficulty]);

  const normalizeText = (t: string) => 
    t.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();

  const getDisplayText = useCallback(() => {
    switch (difficulty) {
      case 'full':
        return text;
      case 'first-letter':
        return abbreviatedText || text.split(' ').map(w => w[0]?.toUpperCase() || '').join(' ');
      case 'first-sentence':
        // First letter of each sentence
        const sentences = text.split(/(?<=[.!?])\s+/);
        return sentences.map(s => s[0]?.toUpperCase() || '').join(' · ');
      case 'blind':
        return null;
      default:
        return text;
    }
  }, [text, abbreviatedText, difficulty]);

  const calculateAccuracy = (input: string, target: string): number => {
    const normalizedInput = normalizeText(input);
    const normalizedTarget = normalizeText(target);
    
    if (normalizedInput === normalizedTarget) return 100;
    
    const inputWords = normalizedInput.split(' ');
    const targetWords = normalizedTarget.split(' ');
    
    let matches = 0;
    inputWords.forEach((word, i) => {
      if (word === targetWords[i]) matches++;
    });
    
    return Math.round((matches / targetWords.length) * 100);
  };

  const handleSubmit = () => {
    const acc = calculateAccuracy(userInput, text);
    setAccuracy(acc);
    setShowResult(true);
  };

  const handleContinue = () => {
    onComplete(accuracy);
  };

  const difficultyLabels: Record<Difficulty, string> = {
    'full': 'Read Along',
    'first-letter': 'First Letters',
    'first-sentence': 'First of Sentence',
    'blind': 'From Memory',
  };

  const modeLabels: Record<PracticeMode, { label: string; color: string }> = {
    encoding: { label: 'Learning', color: 'bg-browse/10 text-browse border-browse/20' },
    retrieval: { label: 'Testing', color: 'bg-review/10 text-review border-review/20' },
  };

  const displayText = getDisplayText();
  const passed = accuracy >= 90;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">{reference}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={modeLabels[mode].color}>
              {modeLabels[mode].label}
            </Badge>
            <Badge variant="secondary">
              {difficultyLabels[difficulty]}
            </Badge>
          </div>
        </div>
        {difficulty === 'blind' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {showHint ? 'Hide' : 'Peek'}
          </Button>
        )}
      </div>

      {/* Display text based on difficulty */}
      {displayText && (
        <div className={cn(
          "p-4 rounded-lg bg-muted/50 font-serif text-lg leading-relaxed",
          difficulty === 'blind' && showHint && "opacity-50"
        )}>
          {difficulty === 'blind' && showHint ? text : displayText}
        </div>
      )}

      {difficulty === 'blind' && !showHint && !displayText && (
        <div className="p-4 rounded-lg bg-muted/30 border-2 border-dashed text-center text-muted-foreground">
          Type the verse from memory
        </div>
      )}

      {/* Input area */}
      {!showResult && (
        <div className="space-y-4">
          <Textarea
            ref={textareaRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type the verse here..."
            className="min-h-[120px] font-serif text-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                handleSubmit();
              }
            }}
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1" disabled={!userInput.trim()}>
              Check
            </Button>
            {onSkip && (
              <Button variant="outline" onClick={onSkip}>
                Skip
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {showResult && (
        <div className="space-y-4">
          <div className={cn(
            "p-4 rounded-lg flex items-center gap-3",
            passed ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"
          )}>
            {passed ? (
              <CheckCircle className="w-6 h-6 text-success" />
            ) : (
              <XCircle className="w-6 h-6 text-destructive" />
            )}
            <div>
              <div className="font-semibold">
                {passed ? 'Great job!' : 'Keep practicing'}
              </div>
              <div className="text-sm text-muted-foreground">
                {accuracy}% accuracy {mode === 'retrieval' && !passed && '(need 90% to pass)'}
              </div>
            </div>
          </div>

          {/* Show correct text if failed */}
          {!passed && (
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-1">Correct text:</div>
              <div className="font-serif">{text}</div>
            </div>
          )}

          <Button onClick={handleContinue} className="w-full">
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
