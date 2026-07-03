-- Create user_passages table (replaces selected_chapters, user_saved_verses, user_collections)
CREATE TABLE public.user_passages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_start INTEGER NOT NULL,
  verse_end INTEGER NOT NULL,
  current_verse INTEGER DEFAULT 1,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'ready_for_review', 'mastered')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_passages ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_passages
CREATE POLICY "Users can view their own passages"
ON public.user_passages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own passages"
ON public.user_passages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own passages"
ON public.user_passages FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own passages"
ON public.user_passages FOR DELETE
USING (auth.uid() = user_id);

-- Add encoding tracking columns to progress table
ALTER TABLE public.progress
ADD COLUMN IF NOT EXISTS encoding_reps INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_difficulty TEXT DEFAULT 'full',
ADD COLUMN IF NOT EXISTS retrieval_unlocked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS retrieval_passed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS passage_id UUID REFERENCES public.user_passages(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_passages_user_id ON public.user_passages(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_passage_id ON public.progress(passage_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_passages_updated_at
BEFORE UPDATE ON public.user_passages
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();