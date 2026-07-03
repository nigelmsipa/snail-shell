-- Drop existing insert policy if it exists and recreate it
DROP POLICY IF EXISTS "Allow authenticated users to insert pericopes" ON public.bible_pericopes;
DROP POLICY IF EXISTS "Allow pericope insert" ON public.bible_pericopes;

-- Create the INSERT policy for pericopes
CREATE POLICY "Allow pericope insert"
  ON public.bible_pericopes
  FOR INSERT
  WITH CHECK (true);