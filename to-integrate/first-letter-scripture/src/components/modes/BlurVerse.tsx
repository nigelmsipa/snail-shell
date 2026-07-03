import { useState } from 'react';

interface BlurVerseProps {
  verseText: string;
  verseNum: number;
}

export default function BlurVerse({ verseText, verseNum }: BlurVerseProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <span 
      className={`transition-all duration-300 cursor-pointer ${
        isRevealed ? 'blur-none' : 'blur-sm select-none'
      }`}
      onClick={() => setIsRevealed(!isRevealed)}
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
    >
      {verseText}
    </span>
  );
}
