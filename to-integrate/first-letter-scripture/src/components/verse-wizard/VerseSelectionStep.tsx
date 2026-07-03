import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { getAvailableVerses } from '@/data/bibleStructure';
import { MousePointer2, Check } from 'lucide-react';

interface VerseSelectionStepProps {
  book: string;
  chapter: number;
  onSelect: (startVerse: number, endVerse: number | null) => void;
}

export function VerseSelectionStep({ book, chapter, onSelect }: VerseSelectionStepProps) {
  const verses = getAvailableVerses(book, chapter);
  const [startVerse, setStartVerse] = useState<number | null>(null);
  const [hoveredVerse, setHoveredVerse] = useState<number | null>(null);

  const handleVerseClick = (verse: number) => {
    if (startVerse === null) {
      setStartVerse(verse);
    } else {
      const start = Math.min(startVerse, verse);
      const end = Math.max(startVerse, verse);
      onSelect(start, end === start ? null : end);
    }
  };

  const handleSingleVerse = () => {
    if (startVerse !== null) {
      onSelect(startVerse, null);
    }
  };

  const isInRange = (verse: number) => {
    if (startVerse === null) return false;
    if (hoveredVerse !== null && startVerse !== null) {
      const min = Math.min(startVerse, hoveredVerse);
      const max = Math.max(startVerse, hoveredVerse);
      return verse >= min && verse <= max;
    }
    return false;
  };

  const isStart = (verse: number) => verse === startVerse;

  const getRangeText = () => {
    if (startVerse === null) return null;
    if (hoveredVerse === null || hoveredVerse === startVerse) {
      return `Verse ${startVerse}`;
    }
    const min = Math.min(startVerse, hoveredVerse);
    const max = Math.max(startVerse, hoveredVerse);
    const count = max - min + 1;
    return `Verses ${min}-${max} (${count} verses)`;
  };

  return (
    <div className="flex flex-col h-full max-h-full gap-3">
      {/* Instructions Card */}
      <div className="bg-muted rounded border border-border p-3 flex-shrink-0">
        <p className="text-xs text-muted-foreground mb-1">
          {startVerse === null
            ? 'Click a verse to start'
            : `Verse ${startVerse} selected. Click another to create a range or the same to confirm`}
        </p>
        {getRangeText() && (
          <p className="text-xs font-semibold text-foreground mt-2">
            {getRangeText()}
          </p>
        )}
      </div>

      {/* Quick Action for Single Verse */}
      {startVerse !== null && (
        <Button
          onClick={handleSingleVerse}
          variant="outline"
          className="w-full text-xs font-medium flex-shrink-0"
        >
          <Check className="h-3 w-3 mr-2" />
          Continue with verse {startVerse} only
        </Button>
      )}

      {/* Verse Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-4">
        <div className="grid grid-cols-8 gap-2">
          {verses.map((verse) => {
            const selected = isStart(verse);
            const inRange = isInRange(verse) && !isStart(verse);

            return (
              <button
                key={verse}
                onClick={() => handleVerseClick(verse)}
                onMouseEnter={() => setHoveredVerse(verse)}
                onMouseLeave={() => setHoveredVerse(null)}
                className={`
                  aspect-square flex items-center justify-center rounded border
                  font-medium text-xs transition-colors
                  ${selected
                    ? 'border-foreground bg-foreground text-background'
                    : inRange
                      ? 'border-border bg-muted text-foreground'
                      : 'border-border hover:border-foreground hover:bg-muted'
                  }
                `}
              >
                {verse}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
