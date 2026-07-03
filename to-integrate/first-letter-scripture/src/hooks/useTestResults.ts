import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SubmitTestResultParams {
  pericopeId: string;
  testType: 'full_recitation' | 'first_letter' | 'word_bank' | 'multiple_choice' | 'audio';
  accuracyPercent: number;
  timeTakenSeconds?: number;
  mistakes?: string;
  confidenceRating?: number;
}

const DIFFICULTY_WEIGHTS: Record<SubmitTestResultParams['testType'], number> = {
  full_recitation: 1.0,
  audio: 1.0,
  first_letter: 0.8,
  word_bank: 0.6,
  multiple_choice: 0.4,
};

export function useTestResults(userId: string | undefined) {
  const queryClient = useQueryClient();

  const submitTestResult = useMutation({
    mutationFn: async (params: SubmitTestResultParams) => {
      if (!userId) throw new Error('User not authenticated');

      const difficultyWeight = DIFFICULTY_WEIGHTS[params.testType];
      const calculatedScore = (params.accuracyPercent / 100) * difficultyWeight;

      // Insert test result
      const { error: insertError } = await supabase
        .from('verse_test_results')
        .insert({
          user_id: userId,
          pericope_id: params.pericopeId,
          test_type: params.testType,
          accuracy_percent: params.accuracyPercent,
          difficulty_weight: difficultyWeight,
          calculated_score: calculatedScore,
          time_taken_seconds: params.timeTakenSeconds,
          confidence_rating: params.confidenceRating,
          mistakes: params.mistakes,
        });

      if (insertError) throw insertError;

      // Update progress using the function
      const { data: progressData, error: progressError } = await supabase.rpc(
        'update_progress_after_test',
        {
          p_user_id: userId,
          p_pericope_id: params.pericopeId,
          p_calculated_score: calculatedScore,
          p_test_type: params.testType,
        }
      );

      if (progressError) throw progressError;

      // Update daily activity
      const { error: activityError } = await supabase.rpc('update_daily_activity', {
        p_user_id: userId,
        p_verses_typed: params.testType === 'full_recitation' ? 1 : 0,
        p_reviews_completed: 1,
        p_xp_earned: Math.round(calculatedScore * 100),
      });

      if (activityError) throw activityError;

      return {
        calculatedScore,
        newState: progressData?.[0]?.new_state,
        newAverageScore: progressData?.[0]?.new_average_score,
        nextReview: progressData?.[0]?.new_next_review,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['dailyActivity', userId] });
      queryClient.invalidateQueries({ queryKey: ['reviewQueue', userId] });
    },
  });

  return {
    submitTestResult: submitTestResult.mutate,
    submitTestResultAsync: submitTestResult.mutateAsync,
    isSubmitting: submitTestResult.isPending,
    result: submitTestResult.data,
  };
}
