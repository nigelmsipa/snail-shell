import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Pericope {
  id: string;
  name: string;
  ref: string;
  book: string;
  chapter: number;
  start_verse: number;
  end_verse: number;
  verse_count?: number;
}

export function useAllPericopes() {
  const [pericopes, setPericopes] = useState<Pericope[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPericopes();
  }, []);

  const fetchPericopes = async () => {
    try {
      const { data, error } = await supabase
        .from('bible_pericopes')
        .select(`
          id,
          name,
          chapter,
          verse_start,
          verse_end,
          bible_books!inner(name)
        `)
        .order('chapter')
        .order('verse_start');

      if (error) throw error;

      const formatted = data?.map(p => ({
        id: p.id,
        name: p.name,
        book: p.bible_books.name,
        chapter: p.chapter,
        start_verse: p.verse_start,
        end_verse: p.verse_end,
        ref: `${p.bible_books.name} ${p.chapter}:${p.verse_start}${p.verse_end !== p.verse_start ? `-${p.verse_end}` : ''}`,
        verse_count: p.verse_end - p.verse_start + 1
      })) || [];

      setPericopes(formatted);
    } catch (error) {
      console.error('Error fetching pericopes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { pericopes, isLoading };
}
