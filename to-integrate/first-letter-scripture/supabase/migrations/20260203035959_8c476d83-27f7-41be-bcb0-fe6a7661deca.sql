-- Fix 1: Remove overly permissive write policies on bible_pericopes
-- Keep only the read policy for public access
DROP POLICY IF EXISTS "Allow pericope modifications" ON public.bible_pericopes;
DROP POLICY IF EXISTS "Allow pericope updates" ON public.bible_pericopes;
DROP POLICY IF EXISTS "Allow pericope deletes" ON public.bible_pericopes;

-- Fix 2: Add RLS to user_daily_review_queue view
-- Note: user_daily_review_queue is a VIEW, not a table
-- Views inherit RLS from underlying tables, so we need to ensure the progress table RLS is correct
-- The view already filters by user_id in its WHERE clause, but we should add RLS on the view itself

-- First, enable RLS on the view (views can have RLS in Postgres 15+)
-- Since this is a view based on the progress table which already has RLS, 
-- we need to create a security policy that restricts access to only the user's own data
-- However, views don't support RLS policies directly - they rely on underlying table RLS
-- The view definition already filters by next_review_at <= NOW() but doesn't restrict by auth.uid()

-- The safest approach is to recreate the view with SECURITY INVOKER (default) 
-- and ensure it only returns rows the user owns via explicit filter
DROP VIEW IF EXISTS public.user_daily_review_queue;

CREATE VIEW public.user_daily_review_queue AS
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
WHERE p.next_review_at IS NOT NULL 
  AND p.next_review_at <= NOW()
  AND p.user_id = auth.uid()  -- CRITICAL: Restrict to authenticated user's own data
ORDER BY priority DESC, p.next_review_at ASC;