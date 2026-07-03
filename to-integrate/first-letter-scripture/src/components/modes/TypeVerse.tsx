import { useState, useEffect, useRef } from 'react';

interface TypeVerseProps {
  verseText: string;
  verseNum: number;
  onComplete?: () => void;
}

export default function TypeVerse({ verseText, verseNum, onComplete }: TypeVerseProps) {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const words = verseText.split(' ');
  const userWords = userInput.split(' ');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const normalized = userInput.toLowerCase().trim();
    const expected = verseText.toLowerCase().trim();

    if (normalized === expected) {
      onComplete?.();
    }
  }, [userInput, verseText, onComplete]);

  const getCharStatus = (wordIndex: number, charIndex: number) => {
    const userWord = userWords[wordIndex] || '';
    const expectedWord = words[wordIndex];
    
    if (wordIndex > userWords.length - 1) return 'pending';
    if (wordIndex < userWords.length - 1) {
      return userWord[charIndex] === expectedWord[charIndex] ? 'correct' : 'incorrect';
    }
    
    // Current word being typed
    if (charIndex < userWord.length) {
      return userWord[charIndex] === expectedWord[charIndex] ? 'correct' : 'incorrect';
    }
    return 'pending';
  };

  return (
    <div className="space-y-4">
      {/* Display area - Monkeytype style */}
      <div className="font-mono text-xl leading-relaxed tracking-wide">
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-block mr-2.5">
            {word.split('').map((char, charIdx) => {
              const status = getCharStatus(wordIdx, charIdx);
              return (
                <span
                  key={charIdx}
                  className={`${
                    status === 'correct'
                      ? 'text-foreground'
                      : status === 'incorrect'
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  } ${
                    wordIdx === userWords.length - 1 && charIdx === (userWords[userWords.length - 1] || '').length
                      ? 'border-l-2 border-primary animate-pulse'
                      : ''
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="w-full bg-transparent border-b-2 border-muted focus:border-primary outline-none text-foreground font-mono text-base py-2 transition-colors"
        placeholder="Start typing..."
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  );
}
