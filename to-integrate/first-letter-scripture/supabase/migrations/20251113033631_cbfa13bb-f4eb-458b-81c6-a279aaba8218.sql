-- Remove insecure policies and lock down bible_pericopes
-- Service role bypasses RLS, so these policies only restricted legitimate imports

DROP POLICY IF EXISTS "authenticated_delete_pericopes" ON bible_pericopes;
DROP POLICY IF EXISTS "authenticated_insert_pericopes" ON bible_pericopes;

-- bible_pericopes is now:
-- - Public read (existing SELECT policies)
-- - Service role only for writes (RLS enabled, no INSERT/DELETE/UPDATE policies)

-- Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_pericopes_book_chapter ON bible_pericopes(book_id, chapter);
CREATE INDEX IF NOT EXISTS idx_pericopes_verses ON bible_pericopes(book_id, chapter, verse_start, verse_end);

-- Ensure display_order, subtitle, verse_count exist (they should already)
-- No schema changes needed - columns already exist