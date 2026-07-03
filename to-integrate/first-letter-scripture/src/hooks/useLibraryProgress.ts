import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Passage } from '@/types/passage';

interface LibraryProgress {
  mastered: number;
  total: number;
  completedPassageCount: number;
}

export function useLibraryProgress(userId: string | undefined, passages: Passage[]) {
  return useQuery({
    queryKey: ['libraryProgress', userId, passages.map(p => p.id).join(',')],
    queryFn: async (): Promise<LibraryProgress> => {
      if (!userId || passages.length === 0) {
        return { mastered: 0, total: 0, completedPassageCount: 0 };
      }

      const passageIds = passages.map(p => p.id);

      // Get all verse-level progress for user's passages where retrieval_passed = true
      const { data, error } = await supabase
        .from('progress')
        .select('passage_id, verse_number, retrieval_passed')
        .eq('user_id', userId)
        .in('passage_id', passageIds)
        .not('verse_number', 'is', null);

      if (error) throw error;

      // Total verses across all passages
      const total = passages.reduce((sum, p) => sum + (p.verseEnd - p.verseStart + 1), 0);

      // Count mastered verses (retrieval_passed = true)
      const masteredSet = new Set<string>();
      (data ?? []).forEach(row => {
        if (row.retrieval_passed && row.passage_id && row.verse_number != null) {
          masteredSet.add(`${row.passage_id}-${row.verse_number}`);
        }
      });

      // Count completed passages (all verses mastered)
      let completedPassageCount = 0;
      for (const passage of passages) {
        const verseCount = passage.verseEnd - passage.verseStart + 1;
        let passageMastered = 0;
        for (let v = passage.verseStart; v <= passage.verseEnd; v++) {
          if (masteredSet.has(`${passage.id}-${v}`)) {
            passageMastered++;
          }
        }
        if (passageMastered === verseCount) {
          completedPassageCount++;
        }
      }

      return {
        mastered: masteredSet.size,
        total,
        completedPassageCount,
      };
    },
    enabled: !!userId && passages.length > 0,
  });
}
