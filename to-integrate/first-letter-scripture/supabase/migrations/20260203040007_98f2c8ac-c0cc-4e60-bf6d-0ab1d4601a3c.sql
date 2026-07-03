-- Fix the SECURITY DEFINER view issue by recreating with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.user_daily_review_queue;

CREATE VIEW public.user_daily_review_queue 
WITH (security_invoker = true) AS
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
  AND p.user_id = auth.uid()
ORDER BY priority DESC, p.next_review_at ASC;