-- Base schema and security hardening migration
-- Ensures reproducible environment: tables, RLS, policies, indexes, and core functions

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Core reference tables
CREATE TABLE IF NOT EXISTS public.bible_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  testament TEXT NOT NULL,
  total_chapters INTEGER NOT NULL,
  book_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bible_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  language TEXT,
  copyright_info TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.bible_pericopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES public.bible_books(id) ON DELETE SET NULL,
  chapter INTEGER NOT NULL,
  verse_start INTEGER NOT NULL,
  verse_end INTEGER NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  display_order INTEGER NOT NULL,
  verse_count INTEGER,
  lore TEXT,
  theme TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.bible_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID REFERENCES public.bible_versions(id) ON DELETE SET NULL,
  book_id UUID REFERENCES public.bible_books(id) ON DELETE SET NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  abbreviated_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User-scoped tables
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pericope_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  verse_number INTEGER,
  completed BOOLEAN NOT NULL DEFAULT false,
  -- Spaced repetition fields
  state TEXT DEFAULT 'new' CHECK (state IN ('new','learning','familiar','mastered','reviewing','fading')),
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  review_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  average_score DECIMAL DEFAULT 0,
  last_score DECIMAL,
  last_test_type TEXT,
  confidence_rating INTEGER CHECK (confidence_rating IS NULL OR confidence_rating BETWEEN 1 AND 5),
  time_spent_seconds INTEGER DEFAULT 0,
  version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.selected_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.collection_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.user_collections(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  start_verse INTEGER NOT NULL,
  end_verse INTEGER,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_saved_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pericope_id UUID REFERENCES public.bible_pericopes(id),
  book TEXT,
  chapter INTEGER,
  start_verse INTEGER,
  end_verse INTEGER,
  custom_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activity and results (also created elsewhere; ensure presence)
CREATE TABLE IF NOT EXISTS public.verse_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pericope_id TEXT NOT NULL,
  test_type TEXT NOT NULL CHECK (test_type IN ('full_recitation','first_letter','word_bank','multiple_choice','audio')),
  accuracy_percent DECIMAL NOT NULL CHECK (accuracy_percent BETWEEN 0 AND 100),
  difficulty_weight DECIMAL NOT NULL DEFAULT 1.0 CHECK (difficulty_weight BETWEEN 0 AND 1),
  calculated_score DECIMAL NOT NULL,
  time_taken_seconds INTEGER,
  confidence_rating INTEGER CHECK (confidence_rating IS NULL OR confidence_rating BETWEEN 1 AND 5),
  mistakes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_activity (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  verses_typed INTEGER DEFAULT 0,
  reviews_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, activity_date)
);

-- RLS: enable and policies
ALTER TABLE public.bible_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_pericopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selected_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verse_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;

-- Public read for Scripture tables
DO $$ BEGIN
  CREATE POLICY "Public can read books" ON public.bible_books FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public can read versions" ON public.bible_versions FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public can read pericopes" ON public.bible_pericopes FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public can read verses" ON public.bible_verses FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- User-scoped CRUD policies
DO $$ BEGIN
  CREATE POLICY "Users read own progress" ON public.progress FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users write own progress" ON public.progress FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users update own progress" ON public.progress FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users delete own progress" ON public.progress FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users read own selected chapters" ON public.selected_chapters FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users write own selected chapters" ON public.selected_chapters FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users update own selected chapters" ON public.selected_chapters FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users delete own selected chapters" ON public.selected_chapters FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users read own collections" ON public.user_collections FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users write own collections" ON public.user_collections FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users update own collections" ON public.user_collections FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users delete own collections" ON public.user_collections FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- collection_verses owned via parent collection
DO $$ BEGIN
  CREATE POLICY "Users read own collection verses" ON public.collection_verses FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_collections uc
      WHERE uc.id = collection_verses.collection_id AND uc.user_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users write own collection verses" ON public.collection_verses FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_collections uc
      WHERE uc.id = collection_verses.collection_id AND uc.user_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users update own collection verses" ON public.collection_verses FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_collections uc
      WHERE uc.id = collection_verses.collection_id AND uc.user_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users delete own collection verses" ON public.collection_verses FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_collections uc
      WHERE uc.id = collection_verses.collection_id AND uc.user_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users read own saved verses" ON public.user_saved_verses FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users write own saved verses" ON public.user_saved_verses FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users update own saved verses" ON public.user_saved_verses FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users delete own saved verses" ON public.user_saved_verses FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- verse_test_results and daily_activity policies (if not already added)
DO $$ BEGIN
  CREATE POLICY "Users can view their own test results" ON public.verse_test_results FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can insert their own test results" ON public.verse_test_results FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can update their own test results" ON public.verse_test_results FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view their own activity" ON public.daily_activity FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can insert their own activity" ON public.daily_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can update their own activity" ON public.daily_activity FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bible_verses_ref ON public.bible_verses(version_id, book_id, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_bible_verses_book_chapter ON public.bible_verses(book_id, chapter);
CREATE INDEX IF NOT EXISTS idx_bible_pericopes_book_chapter ON public.bible_pericopes(book_id, chapter);
CREATE INDEX IF NOT EXISTS idx_bible_pericopes_book_chapter_display ON public.bible_pericopes(book_id, chapter, display_order);

CREATE INDEX IF NOT EXISTS idx_progress_user_pericope ON public.progress(user_id, pericope_id);
CREATE INDEX IF NOT EXISTS idx_progress_next_review ON public.progress(user_id, next_review_at) WHERE state IN ('learning','familiar','mastered');
-- Unique index for upserts used by frontend
CREATE UNIQUE INDEX IF NOT EXISTS uq_progress_user_pericope_verse ON public.progress(user_id, pericope_id, verse_number);
-- Ensure uniqueness for pericope-level rows (verse_number IS NULL)
CREATE UNIQUE INDEX IF NOT EXISTS uq_progress_user_pericope_pericopelevel ON public.progress(user_id, pericope_id) WHERE verse_number IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_selected_chapters_user_chapter ON public.selected_chapters(user_id, chapter_id);
CREATE INDEX IF NOT EXISTS idx_user_collections_user ON public.user_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_verses_collection ON public.collection_verses(collection_id, display_order);
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_saved_verses_combo ON public.user_saved_verses(user_id, book, chapter, start_verse, end_verse);

-- Functions
CREATE OR REPLACE FUNCTION public.calculate_next_review(
  state TEXT,
  last_reviewed_at TIMESTAMPTZ,
  was_successful BOOLEAN
) RETURNS TIMESTAMPTZ AS $$
BEGIN
  IF NOT was_successful THEN
    RETURN now() + INTERVAL '1 day';
  END IF;
  CASE state
    WHEN 'new' THEN RETURN now() + INTERVAL '1 day';
    WHEN 'learning' THEN RETURN now() + INTERVAL '3 days';
    WHEN 'familiar' THEN RETURN now() + INTERVAL '7 days';
    WHEN 'mastered' THEN RETURN now() + INTERVAL '30 days';
    WHEN 'reviewing' THEN RETURN now() + INTERVAL '60 days';
    ELSE RETURN now() + INTERVAL '1 day';
  END CASE;
END; $$ LANGUAGE plpgsql IMMUTABLE;

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
END; $$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.update_daily_activity(
  p_user_id UUID,
  p_verses_typed INTEGER DEFAULT 0,
  p_reviews_completed INTEGER DEFAULT 0,
  p_xp_earned INTEGER DEFAULT 0
) RETURNS void AS $$
BEGIN
  INSERT INTO public.daily_activity (user_id, activity_date, verses_typed, reviews_completed, xp_earned)
  VALUES (p_user_id, current_date, p_verses_typed, p_reviews_completed, p_xp_earned)
  ON CONFLICT (user_id, activity_date) DO UPDATE SET
    verses_typed = daily_activity.verses_typed + EXCLUDED.verses_typed,
    reviews_completed = daily_activity.reviews_completed + EXCLUDED.reviews_completed,
    xp_earned = daily_activity.xp_earned + EXCLUDED.xp_earned;
END; $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Use DB pericope id to derive chapter_id and update progress
CREATE OR REPLACE FUNCTION public.update_progress_after_test(
  p_user_id UUID,
  p_pericope_id TEXT,
  p_calculated_score DECIMAL,
  p_test_type TEXT
) RETURNS TABLE (
  new_state TEXT,
  new_average_score DECIMAL,
  new_next_review TIMESTAMPTZ
) AS $$
DECLARE
  v_current_progress RECORD;
  v_new_average DECIMAL;
  v_new_state TEXT;
  v_new_next_review TIMESTAMPTZ;
  v_book_name TEXT;
  v_chapter INTEGER;
BEGIN
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
END; $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Daily review view
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
WHERE p.next_review_at IS NOT NULL AND p.next_review_at <= now()
ORDER BY priority DESC, p.next_review_at ASC;