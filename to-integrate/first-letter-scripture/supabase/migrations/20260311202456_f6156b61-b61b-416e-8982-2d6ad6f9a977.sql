
-- Add note column to user_passages
ALTER TABLE public.user_passages ADD COLUMN note text DEFAULT NULL;

-- Create passage_tags table
CREATE TABLE public.passage_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  passage_id uuid NOT NULL REFERENCES public.user_passages(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (passage_id, tag)
);

ALTER TABLE public.passage_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tags"
  ON public.passage_tags FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags"
  ON public.passage_tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
  ON public.passage_tags FOR DELETE
  USING (auth.uid() = user_id);
