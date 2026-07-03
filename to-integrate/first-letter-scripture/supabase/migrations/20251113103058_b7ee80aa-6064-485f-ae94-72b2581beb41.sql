-- Temporary policies to allow pericope modifications for import
-- WARNING: These are very permissive and should be removed after import

-- Allow INSERT on bible_pericopes
DO $$ BEGIN
  CREATE POLICY "Allow pericope modifications" ON public.bible_pericopes
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow UPDATE on bible_pericopes
DO $$ BEGIN
  CREATE POLICY "Allow pericope updates" ON public.bible_pericopes
    FOR UPDATE USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow DELETE on bible_pericopes
DO $$ BEGIN
  CREATE POLICY "Allow pericope deletes" ON public.bible_pericopes
    FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;