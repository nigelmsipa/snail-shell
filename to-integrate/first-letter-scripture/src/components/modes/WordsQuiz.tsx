import { useState, useMemo } from 'react';

interface WordsQuizProps {
  verseText: string;
  verseNum: number;
}

export default function WordsQuiz({ verseText, verseNum }: WordsQuizProps) {
  const words = useMemo(() => {
    return verseText.split(/\s+/).filter(w => w.length > 0);
  }, [verseText]);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const quizOptions = useMemo(() => {
    if (currentWordIndex >= words.length) return [];
    
    const correct = words[currentWordIndex];
    const otherWords = words.filter((w, i) => i !== currentWordIndex);
    
    // Get 4 random incorrect options
    const shuffled = [...otherWords].sort(() => Math.random() - 0.5);
    const incorrect = shuffled.slice(0, Math.min(4, shuffled.length));
    
    // Combine and shuffle all options
    return [correct, ...incorrect].sort(() => Math.random() - 0.5);
  }, [currentWordIndex, words]);

  const handleWordSelect = (word: string) => {
    if (word === words[currentWordIndex]) {
      const newSelected = [...selectedWords, word];
      setSelectedWords(newSelected);
      
      if (currentWordIndex + 1 >= words.length) {
        setIsComplete(true);
      } else {
        setCurrentWordIndex(currentWordIndex + 1);
      }
    }
  };

  const handleReset = () => {
    setCurrentWordIndex(0);
    setSelectedWords([]);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="space-y-3">
        <div className="text-sm text-success font-semibold">✓ Verse Complete!</div>
        <div className="text-sm text-foreground">{verseText}</div>
        <button
          onClick={handleReset}
          className="text-xs text-muted-foreground hover:text-foreground underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="text-xs text-muted-foreground font-semibold">
        Word {currentWordIndex + 1} of {words.length}
      </div>

      {/* Instruction */}
      <div className="text-sm font-medium text-foreground">
        Tap the {currentWordIndex === 0 ? 'first' : 'next'} word:
      </div>

      {/* Word options */}
      <div className="flex flex-wrap gap-2">
        {quizOptions.map((word, idx) => (
          <button
            key={idx}
            onClick={() => handleWordSelect(word)}
            className="px-4 py-2 bg-muted hover:bg-accent border border-border rounded-md text-sm font-mono transition-colors"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Show completed words */}
      {selectedWords.length > 0 && (
        <div className="text-sm text-muted-foreground pt-2 border-t border-border font-mono">
          {selectedWords.join(' ')}
        </div>
      )}
    </div>
  );
}
