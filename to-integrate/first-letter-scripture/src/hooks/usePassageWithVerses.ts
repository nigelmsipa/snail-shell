import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Passage, PassageStatus, VerseProgress, Difficulty } from '@/types/passage';
import { cleanVerseText } from '@/lib/textUtils';

interface Pericope {
  id: string;
  name: string;
  verseStart: number;
  verseEnd: number;
}

interface UsePassageWithVersesResult {
  passage: Passage | null;
  verses: Array<{ verse: number; text: string }>;
  pericopes: Pericope[];
  verseProgress: Record<number, VerseProgress>;
  isLoading: boolean;
  recordEncodingRep: (params: { verseNumber: number; difficulty: string }) => void;
  recordRetrievalAttempt: (params: { verseNumber: number; passed: boolean }) => void;
}

export function usePassageWithVerses(
  userId: string | undefined,
  passageId: string | undefined
): UsePassageWithVersesResult {
  const queryClient = useQueryClient();

  // Fetch passage
  const { data: passage, isLoading: passageLoading } = useQuery({
    queryKey: ['passage', passageId],
    queryFn: async () => {
      if (!passageId) return null;
      
      const { data, error } = await supabase
        .from('user_passages')
        .select('*, bible_versions!inner(abbreviation)')
        .eq('id', passageId)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        book: data.book,
        chapter: data.chapter,
        verseStart: data.verse_start,
        verseEnd: data.verse_end,
        currentVerse: data.current_verse ?? data.verse_start,
        status: data.status as PassageStatus,
        versionId: data.version_id,
        versionAbbreviation: (data.bible_versions as { abbreviation: string })?.abbreviation,
        createdAt: data.created_at ?? '',
        updatedAt: data.updated_at ?? '',
      } as Passage;
    },
    enabled: !!passageId,
  });

  // Fetch verses for this passage
  const { data: verses = [], isLoading: versesLoading } = useQuery({
    queryKey: ['passage-verses', passage?.book, passage?.chapter, passage?.verseStart, passage?.verseEnd, passage?.versionId],
    queryFn: async () => {
      if (!passage) return [];
      
      // Get book id
      const { data: bookData } = await supabase
        .from('bible_books')
        .select('id')
        .eq('name', passage.book)
        .single();
      
      if (!bookData) return [];
      
      const { data, error } = await supabase
        .from('bible_verses')
        .select('verse, text')
        .eq('book_id', bookData.id)
        .eq('chapter', passage.chapter)
        .eq('version_id', passage.versionId)
        .gte('verse', passage.verseStart)
        .lte('verse', passage.verseEnd)
        .order('verse');
      
      if (error) throw error;
      // Clean bracket notation from verse text
      return (data ?? []).map(v => ({
        ...v,
        text: cleanVerseText(v.text)
      }));
    },
    enabled: !!passage,
  });

  // Fetch pericopes that overlap with this passage
  const { data: pericopes = [], isLoading: pericopesLoading } = useQuery({
    queryKey: ['passage-pericopes', passage?.book, passage?.chapter, passage?.verseStart, passage?.verseEnd],
    queryFn: async () => {
      if (!passage) return [];

      // Get book id
      const { data: bookData } = await supabase
        .from('bible_books')
        .select('id')
        .eq('name', passage.book)
        .single();

      if (!bookData) return [];

      // Find pericopes that overlap with the passage verse range
      const { data, error } = await supabase
        .from('bible_pericopes')
        .select('id, name, verse_start, verse_end')
        .eq('book_id', bookData.id)
        .eq('chapter', passage.chapter)
        .lte('verse_start', passage.verseEnd)
        .gte('verse_end', passage.verseStart)
        .order('verse_start');

      if (error) throw error;

      return (data ?? []).map(p => ({
        id: p.id,
        name: p.name,
        verseStart: p.verse_start,
        verseEnd: p.verse_end,
      }));
    },
    enabled: !!passage,
  });

  // Fetch progress for all verses in this passage
  const { data: progressData = [], isLoading: progressLoading } = useQuery({
    queryKey: ['passage-progress', userId, passageId],
    queryFn: async () => {
      if (!userId || !passageId) return [];

      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .eq('passage_id', passageId);

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId && !!passageId,
  });

  // Transform progress into a lookup by verse number
  const verseProgress: Record<number, VerseProgress> = {};
  progressData.forEach((p) => {
    if (p.verse_number !== null) {
      verseProgress[p.verse_number] = {
        verseNumber: p.verse_number,
        encodingReps: p.encoding_reps ?? 0,
        lastDifficulty: (p.last_difficulty as Difficulty) ?? 'full',
        retrievalUnlocked: p.retrieval_unlocked ?? false,
        retrievalPassed: p.retrieval_passed ?? false,
      };
    }
  });

  // Record encoding rep mutation
  const encodingMutation = useMutation({
    mutationFn: async ({ verseNumber, difficulty }: { verseNumber: number; difficulty: string }) => {
      if (!userId || !passageId || !passage) throw new Error('Missing context');

      // Check for existing progress
      const existing = progressData.find(p => p.verse_number === verseNumber);
      
      if (existing) {
        const newReps = (existing.encoding_reps ?? 0) + 1;
        const { error } = await supabase
          .from('progress')
          .update({
            encoding_reps: newReps,
            last_difficulty: difficulty,
            retrieval_unlocked: newReps >= 3,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        // Need a chapter_id - create a dummy one based on book+chapter
        const chapterId = `${passage.book}-${passage.chapter}`;
        const pericopeId = `${passageId}-v${verseNumber}`;
        
        const { error } = await supabase
          .from('progress')
          .insert({
            user_id: userId,
            passage_id: passageId,
            pericope_id: pericopeId,
            chapter_id: chapterId,
            verse_number: verseNumber,
            encoding_reps: 1,
            last_difficulty: difficulty,
            retrieval_unlocked: false,
            retrieval_passed: false,
            completed: false,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passage-progress', userId, passageId] });
    },
  });

  // Record retrieval attempt mutation
  const retrievalMutation = useMutation({
    mutationFn: async ({ verseNumber, passed }: { verseNumber: number; passed: boolean }) => {
      if (!userId || !passageId || !passage) throw new Error('Missing context');

      const existing = progressData.find(p => p.verse_number === verseNumber);
      
      if (passed) {
        // Mark verse as passed
        if (existing) {
          await supabase
            .from('progress')
            .update({
              retrieval_passed: true,
              completed: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);
        }

        // Record 1 XP for verse retrieval pass
        await supabase.rpc('update_daily_activity', {
          p_user_id: userId,
          p_verses_typed: 1,
          p_reviews_completed: 0,
          p_xp_earned: 1,
        });

        // Advance current_verse if this was the current verse
        if (verseNumber === passage.currentVerse) {
          const nextVerse = verseNumber + 1;
          const isLastVerse = verseNumber >= passage.verseEnd;
          
          await supabase
            .from('user_passages')
            .update({
              current_verse: isLastVerse ? passage.verseEnd : nextVerse,
              status: isLastVerse ? 'ready_for_review' : 'in_progress',
              updated_at: new Date().toISOString(),
            })
            .eq('id', passageId);
        }
      } else {
        // Failed - reset encoding reps
        if (existing) {
          await supabase
            .from('progress')
            .update({
              encoding_reps: 1,
              retrieval_unlocked: false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passage-progress', userId, passageId] });
      queryClient.invalidateQueries({ queryKey: ['passage', passageId] });
      queryClient.invalidateQueries({ queryKey: ['passages', userId] });
    },
  });

  return {
    passage: passage ?? null,
    verses,
    pericopes,
    verseProgress,
    isLoading: passageLoading || versesLoading || pericopesLoading || progressLoading,
    recordEncodingRep: encodingMutation.mutate,
    recordRetrievalAttempt: retrievalMutation.mutate,
  };
}
