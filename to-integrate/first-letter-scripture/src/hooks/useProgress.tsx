import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProgressEntry {
  id: string;
  user_id: string;
  pericope_id: string;
  chapter_id: string;
  verse_number?: number;
  completed: boolean;
}

export function useProgress(userId: string | undefined) {
  const queryClient = useQueryClient();

  // Fetch progress
  const { data: progressData = [], isLoading } = useQuery({
    queryKey: ['progress', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data as ProgressEntry[];
    },
    enabled: !!userId
  });

  // Convert to nested structure: pericope -> verse -> boolean
  const verseProgress = progressData.reduce((acc, item) => {
    if (!acc[item.pericope_id]) {
      acc[item.pericope_id] = {};
    }
    if (item.verse_number) {
      acc[item.pericope_id][item.verse_number] = item.completed;
    }
    return acc;
  }, {} as Record<string, Record<number, boolean>>);

  // Legacy pericope-level progress for backward compatibility
  const progress = progressData.reduce((acc, item) => {
    if (item.completed && !item.verse_number) {
      acc[item.pericope_id] = true;
    }
    return acc;
  }, {} as Record<string, boolean>);

  // Toggle individual verse completion
  const toggleVerseMutation = useMutation({
    mutationFn: async ({ 
      pericopeId, 
      chapterId, 
      verseNumber 
    }: { 
      pericopeId: string; 
      chapterId: string; 
      verseNumber: number;
    }) => {
      if (!userId) throw new Error('User not authenticated');

      const currentState = verseProgress[pericopeId]?.[verseNumber] || false;
      const newState = !currentState;

      if (newState) {
        // Insert or update to completed
        const { error } = await supabase
          .from('progress')
          .upsert({
            user_id: userId,
            pericope_id: pericopeId,
            chapter_id: chapterId,
            verse_number: verseNumber,
            completed: true
          }, {
            // Conflict on user+pericope+verse to align with DB unique index
            onConflict: 'user_id,pericope_id,verse_number'
          });

        if (error) throw error;
      } else {
        // Delete the progress entry
        const { error } = await supabase
          .from('progress')
          .delete()
          .eq('user_id', userId)
          .eq('pericope_id', pericopeId)
          .eq('verse_number', verseNumber);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
    }
  });

  // Toggle pericope mutation (legacy - marks all verses complete/incomplete)
  const togglePericopeMutation = useMutation({
    mutationFn: async ({ pericopeId, chapterId }: { pericopeId: string; chapterId: string }) => {
      if (!userId) throw new Error('User not authenticated');

      const currentState = progress[pericopeId] || false;
      const newState = !currentState;

      if (newState) {
        // Insert or update to completed
        const { error } = await supabase
          .from('progress')
          .upsert({
            user_id: userId,
            pericope_id: pericopeId,
            chapter_id: chapterId,
            completed: true
          }, {
            onConflict: 'user_id,pericope_id,verse_number'
          });

        if (error) throw error;
      } else {
        // Delete all progress entries for this pericope
        const { error } = await supabase
          .from('progress')
          .delete()
          .eq('user_id', userId)
          .eq('pericope_id', pericopeId);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
    }
  });

  return {
    progress,
    verseProgress,
    isLoading,
    togglePericope: togglePericopeMutation.mutate,
    toggleVerse: toggleVerseMutation.mutate
  };
}
