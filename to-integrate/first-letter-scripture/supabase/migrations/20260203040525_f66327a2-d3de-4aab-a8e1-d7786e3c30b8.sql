-- Fix SECURITY DEFINER functions by adding auth.uid() validation

-- 1. Recreate update_daily_activity with auth validation
CREATE OR REPLACE FUNCTION public.update_daily_activity(
  p_user_id uuid, 
  p_verses_typed integer DEFAULT 0, 
  p_reviews_completed integer DEFAULT 0, 
  p_xp_earned integer DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate that the caller is updating their own data
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: Cannot update activity for another user';
  END IF;

  INSERT INTO public.daily_activity (user_id, activity_date, verses_typed, reviews_completed, xp_earned)
  VALUES (p_user_id, current_date, p_verses_typed, p_reviews_completed, p_xp_earned)
  ON CONFLICT (user_id, activity_date) DO UPDATE SET
    verses_typed = daily_activity.verses_typed + EXCLUDED.verses_typed,
    reviews_completed = daily_activity.reviews_completed + EXCLUDED.reviews_completed,
    xp_earned = daily_activity.xp_earned + EXCLUDED.xp_earned;
END;
$$;

-- 2. Recreate update_progress_after_test with auth validation
CREATE OR REPLACE FUNCTION public.update_progress_after_test(
  p_user_id uuid, 
  p_pericope_id text, 
  p_calculated_score numeric, 
  p_test_type text
)
RETURNS TABLE(new_state text, new_average_score numeric, new_next_review timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_progress RECORD;
  v_new_average DECIMAL;
  v_new_state TEXT;
  v_new_next_review TIMESTAMPTZ;
  v_book_name TEXT;
  v_chapter INTEGER;
BEGIN
  -- Validate that the caller is updating their own data
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: Cannot update progress for another user';
  END IF;

  -- Resolve pericope to book name + chapter
  SELECT b.name, p.chapter INTO v_book_name, v_chapter
  FROM public.bible_pericopes p
  JOIN public.bible_books b ON b.id = p.book_id
  WHERE p.id::text = p_pericope_id
  LIMIT 1;

  IF v_book_name IS NULL THEN
    RAISE EXCEPTION 'Pericope % not found', p_pericope_id;
  END IF;

  SELECT * INTO v_current_progress FROM public.progress
  WHERE user_id = p_user_id AND pericope_id = p_pericope_id AND verse_number IS NULL
  LIMIT 1;

  IF v_current_progress IS NULL THEN
    INSERT INTO public.progress (
      user_id, pericope_id, chapter_id, state, review_count, success_count, average_score, last_score, last_test_type, last_reviewed_at, completed
    )
    VALUES (
      p_user_id,
      p_pericope_id,
      (v_book_name || ' ' || v_chapter),
      'learning',
      1,
      CASE WHEN p_calculated_score >= 0.9 THEN 1 ELSE 0 END,
      p_calculated_score,
      p_calculated_score,
      p_test_type,
      now(),
      p_calculated_score >= 0.9
    ) RETURNING * INTO v_current_progress;

    v_new_state := v_current_progress.state;
    v_new_average := p_calculated_score;
    v_new_next_review := public.calculate_next_review(v_new_state, now(), p_calculated_score >= 0.9);

    UPDATE public.progress
    SET next_review_at = v_new_next_review
    WHERE user_id = p_user_id AND pericope_id = p_pericope_id AND verse_number IS NULL;
  ELSE
    v_new_average := (
      (COALESCE(v_current_progress.average_score, 0) * COALESCE(v_current_progress.review_count, 0) + p_calculated_score) /
      (COALESCE(v_current_progress.review_count, 0) + 1)
    );
    v_new_state := public.calculate_next_state(COALESCE(v_current_progress.state, 'new'), v_new_average);
    v_new_next_review := public.calculate_next_review(v_new_state, now(), p_calculated_score >= 0.9);

    UPDATE public.progress
    SET
      review_count = COALESCE(review_count,0) + 1,
      success_count = CASE WHEN p_calculated_score >= 0.9 THEN COALESCE(success_count,0) + 1 ELSE COALESCE(success_count,0) END,
      failure_count = CASE WHEN p_calculated_score < 0.9 THEN COALESCE(failure_count,0) + 1 ELSE COALESCE(failure_count,0) END,
      average_score = v_new_average,
      last_score = p_calculated_score,
      last_test_type = p_test_type,
      state = v_new_state,
      next_review_at = v_new_next_review,
      last_reviewed_at = now()
    WHERE user_id = p_user_id AND pericope_id = p_pericope_id AND verse_number IS NULL;
  END IF;

  RETURN QUERY SELECT v_new_state::TEXT, v_new_average::DECIMAL, v_new_next_review::TIMESTAMPTZ;
END;
$$;