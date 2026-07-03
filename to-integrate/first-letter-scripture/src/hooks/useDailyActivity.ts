import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DailyActivity {
  activity_date: string;
  verses_typed: number;
  reviews_completed: number;
  xp_earned: number;
}

export interface HeatMapData {
  date: Date;
  count: number;
  details: {
    versesTyped: number;
    reviewsCompleted: number;
    xpEarned: number;
  };
}

export function useDailyActivity(userId: string | undefined, daysBack: number = 84) {
  return useQuery({
    queryKey: ['dailyActivity', userId, daysBack],
    queryFn: async (): Promise<HeatMapData[]> => {
      if (!userId) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      const { data, error } = await supabase
        .from('daily_activity')
        .select('*')
        .eq('user_id', userId)
        .gte('activity_date', startDate.toISOString().split('T')[0])
        .order('activity_date', { ascending: true });

      if (error) throw error;

      return (data as DailyActivity[]).map((activity) => ({
        date: new Date(activity.activity_date),
        count: activity.xp_earned,
        details: {
          versesTyped: activity.verses_typed,
          reviewsCompleted: activity.reviews_completed,
          xpEarned: activity.xp_earned,
        },
      }));
    },
    enabled: !!userId,
  });
}
