import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cleanVerseText } from '@/lib/textUtils';

interface VerseTextResult {
  verses: Array<{
    verse: number;
    text: string;
  }>;
  isLoading: boolean;
  error: string | null;
}

export function useVerseText(
  book: string,
  chapter: number,
  startVerse: number,
  endVerse: number | null,
  version: string = 'KJV'
): VerseTextResult {
  const [verses, setVerses] = useState<Array<{ verse: number; text: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!book || !chapter || !startVerse) {
      setVerses([]);
      return;
    }

    const fetchVerses = async () => {
      setIsLoading(true);
      setError(null);

      console.log('🔍 [useVerseText] Query params:', { book, chapter, startVerse, endVerse, version });

      try {
        // Get book info
        const { data: bookData, error: bookError } = await supabase
          .from('bible_books')
          .select('id')
          .eq('name', book)
          .single();

        console.log('📖 [useVerseText] Book lookup:', { bookData, bookError });

        if (bookError || !bookData) {
          setError('Book not found');
          setIsLoading(false);
          return;
        }

        // Get version info
        const { data: versionData, error: versionError } = await supabase
          .from('bible_versions')
          .select('id')
          .eq('abbreviation', version)
          .single();

        if (versionError || !versionData) {
          setError('Version not found');
          setIsLoading(false);
          return;
        }

        // Build query for verses
        let query = supabase
          .from('bible_verses')
          .select('verse, text')
          .eq('version_id', versionData.id)
          .eq('book_id', bookData.id)
          .eq('chapter', chapter)
          .gte('verse', startVerse);

        if (endVerse) {
          query = query.lte('verse', endVerse);
        } else {
          query = query.eq('verse', startVerse);
        }

        const { data: versesData, error: versesError } = await query.order('verse');

        console.log('📝 [useVerseText] Verses result:', { 
          count: versesData?.length || 0,
          versesData, 
          versesError 
        });

        if (versesError) {
          console.error('❌ [useVerseText] Error:', versesError);
          setError('Failed to fetch verses');
          setIsLoading(false);
          return;
        }

        // Clean bracket notation from verse text
        const cleanedVerses = (versesData || []).map(v => ({
          ...v,
          text: cleanVerseText(v.text)
        }));
        setVerses(cleanedVerses);
      } catch (err) {
        setError('An error occurred');
        console.error('Error fetching verses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerses();
  }, [book, chapter, startVerse, endVerse, version]);

  return { verses, isLoading, error };
}
