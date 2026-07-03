import { useState } from 'react';
import FirstLetterTyping from "./modes/FirstLetterTyping";
import WordByWordVerse from "./WordByWordVerse";

interface Verse {
  num: number;
  text: string;
}

interface Pericope {
  id: string;
  ref: string;
  name: string;
  large?: boolean;
  verses: Verse[];
}

interface PericopeCardProps {
  pericope: Pericope;
  viewMode: 'full' | 'first-letter';
  verseProgress: Record<number, boolean>;
  onToggleVerse: (verseNumber: number) => void;
  isAuthenticated: boolean;
  isLocked?: boolean;
}

export default function PericopeCard({
  pericope,
  viewMode,
  verseProgress,
  onToggleVerse,
  isAuthenticated,
  isLocked = false
}: PericopeCardProps) {
  const [activeVerseNum, setActiveVerseNum] = useState<number | null>(null);

  // Calculate completion
  const totalVerses = pericope.verses.length;
  const completedVerses = Object.values(verseProgress).filter(Boolean).length;
  const isComplete = completedVerses === totalVerses && totalVerses > 0;

  // Find first incomplete verse
  const firstIncompleteVerse = pericope.verses.find(v => !verseProgress[v.num]);

  const handleVerseComplete = (verseNum: number) => {
    onToggleVerse(verseNum);
    setActiveVerseNum(null);

    // Auto-advance to next incomplete verse
    const currentIndex = pericope.verses.findIndex(v => v.num === verseNum);
    const nextVerse = pericope.verses.slice(currentIndex + 1).find(v => !verseProgress[v.num]);
    if (nextVerse) {
      setTimeout(() => setActiveVerseNum(nextVerse.num), 1000);
    }
  };

  const startPracticing = () => {
    if (firstIncompleteVerse) {
      setActiveVerseNum(firstIncompleteVerse.num);
    } else if (pericope.verses[0]) {
      // If all complete, start from beginning
      setActiveVerseNum(pericope.verses[0].num);
    }
  };

  return (
    <div className={`relative bg-card border border-border rounded-lg p-4 transition-all hover:border-primary/50 hover:shadow-sm ${
      pericope.large ? 'md:col-span-2' : ''
    }`}>
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] rounded-lg flex items-center justify-center z-10">
          <svg className="w-5 h-5 text-muted-foreground/60" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
      )}

      {/* Header - Compact */}
      <div className="mb-4 pb-2.5 border-b border-border/30">
        <h3 className="text-xs font-bold text-primary/70 font-mono tracking-tight leading-tight">
          {pericope.name}
        </h3>
      </div>

      {/* Verses - Seamless flow like Option B */}
      <div className="space-y-2.5">
        {pericope.verses.map((verse, idx) => {
          const isCompleted = verseProgress[verse.num] || false;
          const isActive = activeVerseNum === verse.num;
          const isPreviousComplete = idx === 0 || verseProgress[pericope.verses[idx - 1].num];
          const isAccessible = isPreviousComplete;

          // Show all verses for full view
          // if (!isAccessible && !isCompleted) {
          //   return null;
          // }

          return (
            <div
              key={verse.num}
              className={`transition-all duration-300 ${
                isCompleted ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {isActive ? (
                // Active typing mode for THIS verse only
                <div className="my-3">
                  <div className="text-[10px] font-bold text-primary mb-2 font-mono">{verse.num}</div>
                  <FirstLetterTyping
                    key={`card-${verse.num}`}
                    verseText={verse.text}
                    verseNum={verse.num}
                    onComplete={() => handleVerseComplete(verse.num)}
                  />
                </div>
              ) : (
                // Default: Show in first-letter format (read-only)
                <div className="font-mono text-sm leading-relaxed">
                  <span
                    onClick={() => !isCompleted && isAccessible && setActiveVerseNum(verse.num)}
                    className={`text-[10px] font-bold mr-1.5 ${
                      isCompleted ? 'text-primary/40' : 'text-primary cursor-pointer hover:text-primary/70'
                    }`}
                  >
                    {verse.num}
                  </span>
                  <span className={isCompleted ? 'text-muted-foreground/60' : 'text-foreground/80'}>
                    <WordByWordVerse verseText={verse.text} verseNum={verse.num} />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
