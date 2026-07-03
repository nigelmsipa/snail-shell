-- Add DELETE policy for pericope imports (service role)
CREATE POLICY "Allow service role to delete pericopes"
  ON public.bible_pericopes
  FOR DELETE
  USING (true);