import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ReviewQueueItem {
  user_id: string;
  pericope_id: string;
  state: string;
  average_score: number;
  next_review_at: string;
  review_count: number;
  success_count: number;
  last_score: number | null;
  priority: number;
}

export function useReviewQueue(userId: string | undefined) {
  return useQuery({
    queryKey: ['reviewQueue', userId],
    queryFn: async (): Promise<ReviewQueueItem[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_daily_review_queue')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return (data as ReviewQueueItem[]) || [];
    },
    enabled: !!userId,
    staleTime: 60000, // 1 minute
  });
}
