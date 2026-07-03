import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DueReview {
  pericope_id: string;
  chapter_id: string;
}

export function useDueReviews(userId: string | undefined) {
  return useQuery({
    queryKey: ['dueReviews', userId],
    queryFn: async (): Promise<DueReview[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('progress')
        .select('pericope_id, chapter_id')
        .eq('user_id', userId)
        .is('verse_number', null)
        .not('next_review_at', 'is', null)
        .lte('next_review_at', new Date().toISOString());

      if (error) throw error;
      return (data as DueReview[]) || [];
    },
    enabled: !!userId,
    staleTime: 60000,
  });
}
