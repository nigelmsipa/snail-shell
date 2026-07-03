# Lovable Backend Enhancement Request: Spaced Repetition System

## Overview
We need to enhance the Supabase database schema to support a spaced repetition memorization system. This will track user progress, test results, and automatically schedule review timing.

## Required Schema Changes

### 1. Enhance `progress` Table
Add the following columns to the existing `progress` table:

```sql
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'new' CHECK (state IN ('new', 'learning', 'familiar', 'mastered', 'reviewing', 'fading'));
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS last_reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS next_review_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS success_count INTEGER DEFAULT 0;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS failure_count INTEGER DEFAULT 0;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS average_score DECIMAL DEFAULT 0;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS last_score DECIMAL;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS last_test_type TEXT;
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS confidence_rating INTEGER CHECK (confidence_rating BETWEEN 1 AND 5);
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0;

-- Create index for scheduled reviews
CREATE INDEX IF NOT EXISTS idx_progress_next_review ON public.progress(user_id, next_review_at) WHERE state IN ('learning', 'familiar', 'mastered');
```

**What it does:**
- Tracks memorization progress through 6 states: new → learning → familiar → mastered → reviewing → fading
- Schedules next review date based on spaced repetition intervals
- Tracks scores, success/failure counts, and confidence ratings

---

### 2. Create `verse_test_results` Table
New table to track individual test attempts:

```sql
CREATE TABLE IF NOT EXISTS public.verse_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pericope_id TEXT NOT NULL,
  test_type TEXT NOT NULL CHECK (test_type IN ('full_recitation', 'first_letter', 'word_bank', 'multiple_choice', 'audio')),
  accuracy_percent DECIMAL NOT NULL CHECK (accuracy_percent BETWEEN 0 AND 100),
  difficulty_weight DECIMAL NOT NULL DEFAULT 1.0 CHECK (difficulty_weight BETWEEN 0 AND 1),
  calculated_score DECIMAL NOT NULL,
  time_taken_seconds INTEGER,
  confidence_rating INTEGER CHECK (confidence_rating BETWEEN 1 AND 5),
  mistakes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pericope_id, test_type, created_at)
);

-- Enable RLS
ALTER TABLE public.verse_test_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own test results"
  ON public.verse_test_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results"
  ON public.verse_test_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test results"
  ON public.verse_test_results FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_test_results_user_pericope ON public.verse_test_results(user_id, pericope_id);
CREATE INDEX IF NOT EXISTS idx_test_results_created ON public.verse_test_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_test_type ON public.verse_test_results(test_type);
```

**What it does:**
- Logs every test attempt with accuracy, test type, and difficulty weight
- Tracks test types: full recitation (1.0), first-letter (0.8), word bank (0.6), multiple choice (0.4), audio (1.0)
- Supports user-only access via RLS

---

### 3. Create `saved_verses` Table
New table for users to save individual verses:

```sql
CREATE TABLE IF NOT EXISTS public.saved_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  start_verse INTEGER NOT NULL,
  end_verse INTEGER NOT NULL,
  custom_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book, chapter, start_verse, end_verse)
);

-- Enable RLS
ALTER TABLE public.saved_verses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own saved verses"
  ON public.saved_verses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved verses"
  ON public.saved_verses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved verses"
  ON public.saved_verses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved verses"
  ON public.saved_verses FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_saved_verses_user_id ON public.saved_verses(user_id);
```

**What it does:**
- Allows users to save individual verses separate from pericope chapters
- Supports custom naming for saved verse collections
- User-only access via RLS

---

### 4. Create Database Functions

#### Function 1: `calculate_next_review()`
Determines when to schedule the next review based on learning state and success:

```sql
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
```

**Schedule:**
- New verse: review in 1 day
- Learning state: review in 3 days
- Familiar state: review in 7 days
- Mastered state: review in 30 days
- Reviewing state: review in 60 days
- Failed attempt: always review in 1 day (regardless of state)

---

#### Function 2: `calculate_next_state()`
Determines state progression based on average test score:

```sql
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
```

**State Transitions:**
- Score ≥ 0.9: Progress to next level
- Score 0.7-0.9: No change
- Score < 0.7: Regress to previous level

---

#### Function 3: `update_progress_after_test()`
Called after each test to update progress, score, and scheduling:

```sql
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
BEGIN
  SELECT * INTO v_current_progress FROM public.progress
  WHERE user_id = p_user_id AND pericope_id = p_pericope_id
  LIMIT 1;

  IF v_current_progress IS NULL THEN
    INSERT INTO public.progress (
      user_id, pericope_id, chapter_id, state, review_count, success_count, average_score
    )
    SELECT p_user_id, p_pericope_id, substring(p_pericope_id, 1, length(p_pericope_id) - 2),
           'learning', 1,
           CASE WHEN p_calculated_score >= 0.9 THEN 1 ELSE 0 END,
           p_calculated_score
    RETURNING * INTO v_current_progress;
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
      last_reviewed_at = NOW()
    WHERE user_id = p_user_id AND pericope_id = p_pericope_id;

    v_current_progress.state := v_new_state;
    v_current_progress.average_score := v_new_average;
  END IF;

  RETURN QUERY SELECT
    v_current_progress.state::TEXT,
    v_current_progress.average_score::DECIMAL,
    COALESCE(v_new_next_review, NOW() + INTERVAL '1 day')::TIMESTAMP WITH TIME ZONE;
END;
$$ LANGUAGE plpgsql;
```

**What it does:**
- Triggered after each test completion
- Creates progress record if user is memorizing that pericope for first time
- Updates average score using weighted average formula
- Automatically determines new state based on score
- Schedules next review date
- Returns new state, average score, and next review time

---

### 5. Create View for Daily Review Queue

```sql
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
  CASE WHEN p.state = 'mastered' THEN 0
       WHEN p.state = 'familiar' THEN 1
       WHEN p.state = 'learning' THEN 2
       WHEN p.state = 'new' THEN 3
       ELSE 4
  END AS priority
FROM public.progress p
WHERE p.next_review_at IS NOT NULL AND p.next_review_at <= NOW()
ORDER BY priority DESC, p.next_review_at ASC;
```

**What it does:**
- Shows verses due for review today
- Prioritizes by state (mastered first, then familiar, learning, new, then other)
- Ordered by review due date
- Used to populate daily review queue in UI

---

## How It Works Together

1. **User adds chapter to memorize** → Creates `progress` record (state = 'new')
2. **User takes test** → Inserts `verse_test_results` row, calls `update_progress_after_test()`
3. **Function runs** → Calculates new average score, determines new state, schedules next review
4. **Next day** → Verses appear in `user_daily_review_queue` view for review
5. **Cycle repeats** → User practices → scores improve → state advances → reviews spread further apart

## Difficulty Weights (for Frontend to Use)

When creating test results, use these difficulty weights:
- **Full recitation (type from memory)**: 1.0
- **Audio recitation**: 1.0
- **First-letter prompts**: 0.8
- **Word bank (tap words in order)**: 0.6
- **Multiple choice**: 0.4

Calculate `calculated_score = (accuracy_percent / 100) * difficulty_weight`

## Success Threshold

**A test counts as "successful" if score ≥ 0.9**

Example:
- Full recitation at 95% accuracy: 0.95 × 1.0 = 0.95 ✅ (passes)
- First-letter at 90% accuracy: 0.90 × 0.8 = 0.72 ❌ (fails)
- Word bank at 95% accuracy: 0.95 × 0.6 = 0.57 ❌ (fails)

---

## Implementation Notes

- All tables have Row Level Security (RLS) enabled
- Users can only see/modify their own data
- Indexes created for performance on common queries
- Functions use IMMUTABLE keyword where possible for optimization
- `update_progress_after_test()` function should be called from backend after test completion

---

## Questions Before Implementation

- Should we add any additional tracking (e.g., time zone for scheduling)?
- Do you want email reminders when verses are due for review?
- Should there be a hard limit on how many tests per day (to prevent grinding)?
- Any customization needed for the state progression thresholds (currently 0.9 and 0.7)?
