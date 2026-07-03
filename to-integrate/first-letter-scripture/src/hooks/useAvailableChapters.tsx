import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AvailableChapter {
  id: string;
  book: string;
  chapter: number;
  disabled?: boolean;
}

export function useAvailableChapters() {
  return useQuery({
    queryKey: ['available-chapters'],
    queryFn: async (): Promise<AvailableChapter[]> => {
      // Step 1: Get all distinct book_id + chapter combinations from pericopes
      const { data: pericopesData, error: pericopesError } = await supabase
        .from('bible_pericopes')
        .select('book_id, chapter');

      if (pericopesError) {
        console.error('Error fetching pericopes:', pericopesError);
        return [];
      }

      if (!pericopesData || pericopesData.length === 0) {
        return [];
      }

      // Step 2: Get all book names
      const { data: booksData, error: booksError } = await supabase
        .from('bible_books')
        .select('id, name');

      if (booksError) {
        console.error('Error fetching books:', booksError);
        return [];
      }

      // Step 3: Build a map of book_id → book_name
      const bookMap = new Map(booksData?.map(b => [b.id, b.name]) || []);

      // Step 4: Build unique chapters list
      const chaptersMap = new Map<string, AvailableChapter>();

      pericopesData.forEach((p) => {
        const bookName = bookMap.get(p.book_id);
        if (!bookName) return;
        
        const key = `${bookName}-${p.chapter}`;
        if (!chaptersMap.has(key)) {
          chaptersMap.set(key, {
            id: `${bookName} ${p.chapter}`,
            book: bookName,
            chapter: p.chapter
          });
        }
      });

      const chapters = Array.from(chaptersMap.values()).sort((a, b) => {
        if (a.book !== b.book) return a.book.localeCompare(b.book);
        return a.chapter - b.chapter;
      });

      console.log(`✅ Loaded ${chapters.length} available chapters from database`);
      console.log('Sample chapters:', chapters.slice(0, 5));
      
      return chapters;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
