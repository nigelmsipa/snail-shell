ALTER TABLE public.user_passages ADD COLUMN display_order integer;

-- Backfill existing rows with order based on created_at
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) as rn
  FROM public.user_passages
)
UPDATE public.user_passages
SET display_order = ordered.rn
FROM ordered
WHERE public.user_passages.id = ordered.id;