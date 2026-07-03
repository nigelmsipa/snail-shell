import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BookStats {
  book_number: number;
  name: string;
  total_chapters: number;
  chapters_with_pericopes: number;
  pericope_count: number;
  testament: string;
}

export interface DashboardStats {
  books: BookStats[];
  totalBooks: number;
  completedBooks: number;
  totalChapters: number;
  coveredChapters: number;
  totalPericopes: number;
  isLoading: boolean;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    books: [],
    totalBooks: 0,
    completedBooks: 0,
    totalChapters: 0,
    coveredChapters: 0,
    totalPericopes: 0,
    isLoading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('bible_books')
        .select(`
          book_number,
          name,
          total_chapters,
          testament,
          bible_pericopes (
            id,
            chapter
          )
        `)
        .lte('book_number', 39)
        .order('book_number');

      if (error) throw error;

      const books: BookStats[] = data?.map(book => {
        const uniqueChapters = new Set(
          book.bible_pericopes.map((p: any) => p.chapter)
        );
        return {
          book_number: book.book_number,
          name: book.name,
          total_chapters: book.total_chapters,
          chapters_with_pericopes: uniqueChapters.size,
          pericope_count: book.bible_pericopes.length,
          testament: book.testament,
        };
      }) || [];

      const totalChapters = books.reduce((sum, b) => sum + b.total_chapters, 0);
      const coveredChapters = books.reduce((sum, b) => sum + b.chapters_with_pericopes, 0);
      const totalPericopes = books.reduce((sum, b) => sum + b.pericope_count, 0);
      const completedBooks = books.filter(b => b.chapters_with_pericopes === b.total_chapters).length;

      setStats({
        books,
        totalBooks: books.length,
        completedBooks,
        totalChapters,
        coveredChapters,
        totalPericopes,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  return stats;
}
