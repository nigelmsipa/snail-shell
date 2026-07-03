import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Difficulty, VerseProgress } from '@/types/passage';

const ENCODING_THRESHOLD = 3; // Reps needed before retrieval unlocks
const DIFFICULTY_PROGRESSION: Difficulty[] = ['full', 'first-letter', 'first-sentence'];

interface UseVersePracticeOptions {
  userId: string;
  passageId: string;
  verseNumber: number;
  chapterId: string;
  pericopeId: string;
}

export function useVersePractice({
  userId,
  passageId,
  verseNumber,
  chapterId,
  pericopeId,
}: UseVersePracticeOptions) {
  const queryClient = useQueryClient();
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('full');

  const recordEncodingRep = useMutation({
    mutationFn: async (difficulty: Difficulty) => {
      // First check if progress record exists
      const { data: existing } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .eq('passage_id', passageId)
        .eq('verse_number', verseNumber)
        .single();

      const newReps = (existing?.encoding_reps ?? 0) + 1;
      const retrievalUnlocked = newReps >= ENCODING_THRESHOLD;

      if (existing) {
        const { error } = await supabase
          .from('progress')
          .update({
            encoding_reps: newReps,
            last_difficulty: difficulty,
            retrieval_unlocked: retrievalUnlocked,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('progress')
          .insert({
            user_id: userId,
            passage_id: passageId,
            verse_number: verseNumber,
            chapter_id: chapterId,
            pericope_id: pericopeId,
            encoding_reps: 1,
            last_difficulty: difficulty,
            retrieval_unlocked: newReps >= ENCODING_THRESHOLD,
            completed: false,
          });
        
        if (error) throw error;
      }

      return { newReps, retrievalUnlocked };
    },
    onSuccess: ({ newReps }) => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      
      // Progress difficulty after each rep
      const difficultyIndex = Math.min(newReps - 1, DIFFICULTY_PROGRESSION.length - 1);
      setCurrentDifficulty(DIFFICULTY_PROGRESSION[difficultyIndex]);
    },
  });

  const recordRetrievalAttempt = useMutation({
    mutationFn: async (passed: boolean) => {
      const { error } = await supabase
        .from('progress')
        .update({
          retrieval_passed: passed,
          completed: passed,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('passage_id', passageId)
        .eq('verse_number', verseNumber);
      
      if (error) throw error;

      // If passed, advance the passage's current_verse
      if (passed) {
        const { data: passage } = await supabase
          .from('user_passages')
          .select('current_verse, verse_end')
          .eq('id', passageId)
          .single();

        if (passage && passage.current_verse < passage.verse_end) {
          await supabase
            .from('user_passages')
            .update({ 
              current_verse: passage.current_verse + 1,
              updated_at: new Date().toISOString(),
            })
            .eq('id', passageId);
        } else if (passage && passage.current_verse >= passage.verse_end) {
          // Passage complete!
          await supabase
            .from('user_passages')
            .update({ 
              status: 'ready_for_review',
              updated_at: new Date().toISOString(),
            })
            .eq('id', passageId);
        }
      } else {
        // Failed - reset encoding reps (need 2 more)
        await supabase
          .from('progress')
          .update({
            encoding_reps: Math.max(0, ENCODING_THRESHOLD - 2),
            retrieval_unlocked: false,
          })
          .eq('user_id', userId)
          .eq('passage_id', passageId)
          .eq('verse_number', verseNumber);
      }

      return passed;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['passages'] });
    },
  });

  const getDifficultyForReps = useCallback((reps: number): Difficulty => {
    const index = Math.min(reps, DIFFICULTY_PROGRESSION.length - 1);
    return DIFFICULTY_PROGRESSION[index];
  }, []);

  return {
    currentDifficulty,
    setCurrentDifficulty,
    recordEncodingRep: recordEncodingRep.mutate,
    recordRetrievalAttempt: recordRetrievalAttempt.mutate,
    getDifficultyForReps,
    isRecording: recordEncodingRep.isPending || recordRetrievalAttempt.isPending,
    ENCODING_THRESHOLD,
  };
}
