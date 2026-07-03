import { useState, useEffect, useRef } from 'react';

interface FirstLetterTypingProps {
  verseText: string;
  verseNum: number;
  onComplete?: () => void;
}

export default function FirstLetterTyping({ verseText, verseNum, onComplete }: FirstLetterTypingProps) {
  const words = verseText.split(/\s+/).filter(w => w.length > 0);
  const expectedLetters = words.map(word => word[0].toLowerCase());

  const [userInput, setUserInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the input
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (userInput.length === expectedLetters.length && !isComplete) {
      const allCorrect = userInput.split('').every((char, idx) =>
        char.toLowerCase() === expectedLetters[idx]
      );

      if (allCorrect) {
        setIsComplete(true);
        setTimeout(() => {
          onComplete?.();
        }, 1500);
      }
    }
  }, [userInput, expectedLetters, isComplete, onComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toLowerCase();
    // Only allow letters and limit to expected length
    const filtered = newValue.replace(/[^a-z]/g, '').slice(0, expectedLetters.length);
    setUserInput(filtered);
  };

  const getLetterStatus = (index: number): 'correct' | 'wrong' | 'pending' => {
    if (index >= userInput.length) return 'pending';
    return userInput[index].toLowerCase() === expectedLetters[index] ? 'correct' : 'wrong';
  };

  const correctCount = userInput.split('').filter((char, idx) =>
    char.toLowerCase() === expectedLetters[idx]
  ).length;

  return (
    <div className="space-y-4">
      {/* Show what user has typed */}
      <div className="font-mono text-base leading-relaxed tracking-widest uppercase min-h-[1.5rem]">
        {userInput.split('').map((letter, idx) => {
          const status = getLetterStatus(idx);
          return (
            <span
              key={idx}
              className={`inline-block mr-2.5 ${
                status === 'correct'
                  ? 'text-primary'
                  : 'text-destructive'
              }`}
            >
              {letter}
            </span>
          );
        })}
        {/* Cursor */}
        {!isComplete && userInput.length < expectedLetters.length && (
          <span className="inline-block w-0.5 h-5 bg-primary animate-pulse ml-1"></span>
        )}
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="w-full bg-transparent border-b border-muted focus:border-primary outline-none text-foreground font-mono text-sm py-1.5 transition-colors uppercase tracking-widest"
        aria-label="Type first letters of each word"
        disabled={isComplete}
        maxLength={expectedLetters.length}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Progress and hint */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-muted-foreground">
          {correctCount}/{expectedLetters.length} correct
        </span>
        <div className="flex items-center gap-3">
          {!isComplete && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showHint ? 'Hide' : 'Peek'} →
            </button>
          )}
          {isComplete && (
            <span className="text-primary">✓ Complete</span>
          )}
        </div>
      </div>

      {/* Hint - shows verse in first-letter format */}
      {showHint && !isComplete && (
        <div className="text-sm text-muted-foreground font-mono border-t border-border pt-3">
          {expectedLetters.map((letter, idx) => (
            <span key={idx} className="inline-block mr-2 opacity-50">
              {letter}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
