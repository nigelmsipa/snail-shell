-- Migration: Spaced Repetition System, Daily Activity & Performance Schema
-- Part 1: Expand progress table with spaced repetition columns

ALTER TABLE public.progress 
  ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'new' CHECK (state IN ('new', 'learning', 'familiar', 'mastered', 'reviewing', 'fading')),
  ADD COLUMN IF NOT EXISTS last_reviewed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS next_review_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS success_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS failure_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS average_score DECIMAL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_score DECIMAL,
  ADD COLUMN IF NOT EXISTS last_test_type TEXT,
  ADD COLUMN IF NOT EXISTS confidence_rating INTEGER CHECK (confidence_rating IS NULL OR (confidence_rating BETWEEN 1 AND 5)),
  ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_progress_next_review 
  ON public.progress(user_id, next_review_at) 
  WHERE state IN ('learning', 'familiar', 'mastered');

-- Part 2: Create verse_test_results table

CREATE TABLE IF NOT EXISTS public.verse_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pericope_id TEXT NOT NULL,
  test_type TEXT NOT NULL CHECK (test_type IN ('full_recitation', 'first_letter', 'word_bank', 'multiple_choice', 'audio')),
  accuracy_percent DECIMAL NOT NULL CHECK (accuracy_percent BETWEEN 0 AND 100),
  difficulty_weight DECIMAL NOT NULL DEFAULT 1.0 CHECK (difficulty_weight BETWEEN 0 AND 1),
  calculated_score DECIMAL NOT NULL,
  time_taken_seconds INTEGER,
  confidence_rating INTEGER CHECK (confidence_rating IS NULL OR (confidence_rating BETWEEN 1 AND 5)),
  mistakes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.verse_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own test results"
  ON public.verse_test_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results"
  ON public.verse_test_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test results"
  ON public.verse_test_results FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_test_results_user_pericope ON public.verse_test_results(user_id, pericope_id);
CREATE INDEX IF NOT EXISTS idx_test_results_created ON public.verse_test_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_test_type ON public.verse_test_results(test_type);

-- Part 3: Create daily_activity table for heat map

CREATE TABLE IF NOT EXISTS public.daily_activity (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  verses_typed INTEGER DEFAULT 0,
  reviews_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, activity_date)
);

ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity"
  ON public.daily_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
  ON public.daily_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity"
  ON public.daily_activity FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON public.daily_activity(user_id, activity_date DESC);

-- Part 4: Create spaced repetition functions

CREATE OR REPLACE FUNCTION public.calculate_next_review(
  state TEXT,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  was_successful BOOLEAN
) RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
  IF NOT was_successful THEN
    RETURN NOW() + INTERVAL '1 day';
  END IF;
  
  CASE state
    WHEN 'new' THEN RETURN NOW() + INTERVAL '1 day';
    WHEN 'learning' THEN RETURN NOW() + INTERVAL '3 days';
    WHEN 'familiar' THEN RETURN NOW() + INTERVAL '7 days';
    WHEN 'mastered' THEN RETURN NOW() + INTERVAL '30 days';
    WHEN 'reviewing' THEN RETURN NOW() + INTERVAL '60 days';
    ELSE RETURN NOW() + INTERVAL '1 day';
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.calculate_next_state(
  current_state TEXT,
  average_score DECIMAL
) RETURNS TEXT AS $$
BEGIN
  IF average_score >= 0.9 THEN
    CASE current_state
      WHEN 'new' THEN RETURN 'learning';
      WHEN 'learning' THEN RETURN 'familiar';
      WHEN 'familiar' THEN RETURN 'mastered';
      WHEN 'mastered' THEN RETURN 'reviewing';
      WHEN 'reviewing' THEN RETURN 'reviewing';
      ELSE RETURN current_state;
    END CASE;
  ELSIF average_score < 0.7 THEN
    CASE current_state
      WHEN 'familiar' THEN RETURN 'learning';
      WHEN 'mastered' THEN RETURN 'familiar';
      WHEN 'reviewing' THEN RETURN 'mastered';
      ELSE RETURN current_state;
    END CASE;
  END IF;
  
  RETURN current_state;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.update_progress_after_test(
  p_user_id UUID,
  p_pericope_id TEXT,
  p_calculated_score DECIMAL,
  p_test_type TEXT
) RETURNS TABLE (
  new_state TEXT,
  new_average_score DECIMAL,
  new_next_review TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_current_progress RECORD;
  v_new_average DECIMAL;
  v_new_state TEXT;
  v_new_next_review TIMESTAMP WITH TIME ZONE;
  v_chapter_id TEXT;
BEGIN
  SELECT * INTO v_current_progress FROM public.progress
  WHERE user_id = p_user_id AND pericope_id = p_pericope_id
  LIMIT 1;
  
  IF v_current_progress IS NULL THEN
    -- Extract chapter_id from pericope_id (format: "Genesis 1-1")
    v_chapter_id := regexp_replace(p_pericope_id, '-[0-9]+$', '');
    
    INSERT INTO public.progress (
      user_id, pericope_id, chapter_id, state, review_count, success_count, average_score, last_score, last_test_type, last_reviewed_at, completed
    )
    VALUES (
      p_user_id, 
      p_pericope_id, 
      v_chapter_id,
      'learning', 
      1,
      CASE WHEN p_calculated_score >= 0.9 THEN 1 ELSE 0 END,
      p_calculated_score,
      p_calculated_score,
      p_test_type,
      NOW(),
      p_calculated_score >= 0.9
    )
    RETURNING * INTO v_current_progress;
    
    v_new_state := v_current_progress.state;
    v_new_average := p_calculated_score;
    v_new_next_review := public.calculate_next_review(v_new_state, NOW(), p_calculated_score >= 0.9);
    
    UPDATE public.progress
    SET next_review_at = v_new_next_review
    WHERE user_id = p_user_id AND pericope_id = p_pericope_id;
  ELSE
    v_new_average := (
      (v_current_progress.average_score * v_current_progress.review_count + p_calculated_score) /
      (v_current_progress.review_count + 1)
    );
    
    v_new_state := public.calculate_next_state(v_current_progress.state, v_new_average);
    v_new_next_review := public.calculate_next_review(v_new_state, NOW(), p_calculated_score >= 0.9);
    
    UPDATE public.progress
    SET
      review_count = review_count + 1,
      success_count = CASE WHEN p_calculated_score >= 0.9 THEN success_count + 1 ELSE success_count END,
      failure_count = CASE WHEN p_calculated_score < 0.9 THEN failure_count + 1 ELSE failure_count END,
      average_score = v_new_average,
      last_score = p_calculated_score,
      last_test_type = p_test_type,
      state = v_new_state,
      next_review_at = v_new_next_review,
      last_reviewed_at = NOW(),
      completed = CASE WHEN p_calculated_score >= 0.9 THEN true ELSE completed END
    WHERE user_id = p_user_id AND pericope_id = p_pericope_id;
  END IF;
  
  RETURN QUERY SELECT
    v_new_state::TEXT,
    v_new_average::DECIMAL,
    v_new_next_review::TIMESTAMP WITH TIME ZONE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_daily_activity(
  p_user_id UUID,
  p_verses_typed INTEGER DEFAULT 0,
  p_reviews_completed INTEGER DEFAULT 0,
  p_xp_earned INTEGER DEFAULT 0
) RETURNS void AS $$
BEGIN
  INSERT INTO public.daily_activity (user_id, activity_date, verses_typed, reviews_completed, xp_earned)
  VALUES (p_user_id, CURRENT_DATE, p_verses_typed, p_reviews_completed, p_xp_earned)
  ON CONFLICT (user_id, activity_date) DO UPDATE SET
    verses_typed = daily_activity.verses_typed + p_verses_typed,
    reviews_completed = daily_activity.reviews_completed + p_reviews_completed,
    xp_earned = daily_activity.xp_earned + p_xp_earned;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Part 5: Create view for daily review queue

CREATE OR REPLACE VIEW public.user_daily_review_queue AS
SELECT
  p.user_id,
  p.pericope_id,
  p.state,
  p.average_score,
  p.next_review_at,
  p.review_count,
  p.success_count,
  p.last_score,
  CASE 
    WHEN p.state = 'mastered' THEN 0
    WHEN p.state = 'familiar' THEN 1
    WHEN p.state = 'learning' THEN 2
    WHEN p.state = 'new' THEN 3
    ELSE 4
  END AS priority
FROM public.progress p
WHERE p.next_review_at IS NOT NULL AND p.next_review_at <= NOW()
ORDER BY priority DESC, p.next_review_at ASC;