import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cleanVerseText } from '@/lib/textUtils';

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

interface ChapterData {
  title: string;
  subtitle?: string;
  version?: string;
  pericopes: Pericope[];
}

export function useChapterData(book: string, chapter: number, version: string = 'KJV') {
  return useQuery({
    queryKey: ['chapter-data', book, chapter, version],
    queryFn: async (): Promise<ChapterData | null> => {
      console.log('🔍 [useChapterData] Query params:', { book, chapter, version });
      
      // Get book info
      const { data: bookData, error: bookError } = await supabase
        .from('bible_books')
        .select('id, name')
        .ilike('name', book)
        .maybeSingle();

      console.log('📖 [useChapterData] Book lookup:', { bookData, bookError });

      if (bookError || !bookData) {
        console.error('❌ Book not found:', bookError);
        return null;
      }

      // Get version info
      const { data: versionData, error: versionError } = await supabase
        .from('bible_versions')
        .select('id, abbreviation')
        .eq('abbreviation', version)
        .maybeSingle();

      if (versionError || !versionData) {
        console.error('Version not found:', versionError);
        return null;
      }

      // Get pericopes for this chapter
      console.log('🔍 [useChapterData] Fetching pericopes for:', { book_id: bookData.id, chapter });
      
      const { data: pericopesData, error: pericopesError } = await supabase
        .from('bible_pericopes')
        .select('*')
        .eq('book_id', bookData.id)
        .eq('chapter', chapter)
        .order('display_order');

      console.log('📚 [useChapterData] Pericopes result:', { 
        count: pericopesData?.length || 0, 
        pericopesData, 
        pericopesError 
      });

      if (pericopesError) {
        console.error('❌ Error fetching pericopes:', pericopesError);
        return null;
      }

      // Get all verses for this chapter
      console.log('🔍 [useChapterData] Fetching verses for:', { 
        version_id: versionData.id, 
        book_id: bookData.id, 
        chapter 
      });
      
      const { data: versesData, error: versesError } = await supabase
        .from('bible_verses')
        .select('verse, text')
        .eq('version_id', versionData.id)
        .eq('book_id', bookData.id)
        .eq('chapter', chapter)
        .order('verse');

      console.log('📝 [useChapterData] Verses result:', { 
        count: versesData?.length || 0,
        versesData: versesData?.slice(0, 3),
        versesError 
      });

      if (versesError) {
        console.error('❌ Error fetching verses:', versesError);
        return null;
      }

      // Build pericopes - use curated pericopes when available, otherwise synthesize full chapter
      let pericopes: Pericope[] = [];

      if (pericopesData && pericopesData.length > 0) {
        pericopes = pericopesData.map((pericope) => {
          const pericopeVerses = (versesData || [])
            .filter(v => v.verse >= pericope.verse_start && v.verse <= pericope.verse_end)
            .map(v => ({
              num: v.verse,
              text: cleanVerseText(v.text || '')
            }));

          return {
            id: pericope.id, // Use real DB pericope id for consistency across app
            ref: `${pericope.subtitle ? pericope.subtitle + ' · ' : ''}v${pericope.verse_start}-${pericope.verse_end}`,
            name: pericope.name,
            large: false,
            verses: pericopeVerses
          };
        });
      } else if (versesData && versesData.length > 0) {
        const maxVerse = Math.max(...versesData.map(v => v.verse));
        pericopes = [{
          id: `${book.toLowerCase().replace(/\s+/g, '')}${chapter}-1`,
          ref: `v1-${maxVerse}`,
          name: 'Full Chapter',
          large: false,
          verses: versesData.map(v => ({
            num: v.verse,
            text: cleanVerseText(v.text || '')
          }))
        }];
      } else {
        // No verses found either
        return null;
      }

      return {
        title: `${bookData.name} ${chapter}`,
        subtitle: bookData.name,
        version: versionData.abbreviation,
        pericopes
      };
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    refetchOnMount: 'always',
  });
}
