-- Harden bible_pericopes policies: remove permissive INSERT and redundant DELETE policy
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow pericope insert" ON public.bible_pericopes;
EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow service role to delete pericopes" ON public.bible_pericopes;
EXCEPTION WHEN undefined_object THEN NULL; END $$;

-- Ensure public read policy exists (idempotent; also present in base schema)
DO $$ BEGIN
  CREATE POLICY "Public can read pericopes" ON public.bible_pericopes FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;