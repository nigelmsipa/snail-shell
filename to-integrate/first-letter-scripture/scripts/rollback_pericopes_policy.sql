-- Re-enable RLS on bible_pericopes after data import
-- Run this migration AFTER completing the pericope import
-- 
-- To apply this rollback, use the Lovable Cloud backend interface:
-- 1. Go to Database > SQL Editor
-- 2. Copy and paste this SQL
-- 3. Execute

ALTER TABLE bible_pericopes ENABLE ROW LEVEL SECURITY;
