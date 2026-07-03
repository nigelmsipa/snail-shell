import { useState, useEffect } from 'react';
import { useVerseText } from './useVerseText';
import { abbreviateVerse, simpleAbbreviate } from '@/utils/abbreviation';

interface AbbreviatedVerseResult {
  verses: Array<{
    verse: number;
    text: string;
    abbreviated: string;
    simpleAbbreviated: string;
  }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook that fetches verse text and generates abbreviations dynamically
 * Works with any Bible version since it generates abbreviations on the fly
 */
export function useAbbreviatedVerse(
  book: string,
  chapter: number,
  startVerse: number,
  endVerse: number | null,
  version: string = 'KJV'
): AbbreviatedVerseResult {
  const { verses: fullVerses, isLoading, error } = useVerseText(
    book,
    chapter,
    startVerse,
    endVerse,
    version
  );

  const [verses, setVerses] = useState<AbbreviatedVerseResult['verses']>([]);

  useEffect(() => {
    // Generate abbreviations for each verse
    const abbreviatedVerses = fullVerses.map(verse => ({
      verse: verse.verse,
      text: verse.text,
      abbreviated: abbreviateVerse(verse.text),
      simpleAbbreviated: simpleAbbreviate(verse.text)
    }));

    setVerses(abbreviatedVerses);
  }, [fullVerses]);

  return { verses, isLoading, error };
}

/**
 * Hook for single verse with abbreviation
 */
export function useSingleAbbreviatedVerse(
  book: string,
  chapter: number,
  verse: number,
  version: string = 'KJV'
) {
  const result = useAbbreviatedVerse(book, chapter, verse, null, version);
  
  return {
    verse: result.verses[0] || null,
    isLoading: result.isLoading,
    error: result.error
  };
}
