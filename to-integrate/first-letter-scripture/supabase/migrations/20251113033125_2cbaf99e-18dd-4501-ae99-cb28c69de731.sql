-- Temporary policies for pericope import
-- WARNING: These policies allow ANY authenticated user to insert/delete pericopes
-- Consider restricting to admin users only after initial import is complete

-- Allow authenticated users to delete pericopes (needed for cleanup before import)
CREATE POLICY "authenticated_delete_pericopes"
ON bible_pericopes
FOR DELETE
TO authenticated
USING (true);

-- Allow authenticated users to insert pericopes (needed for import)
CREATE POLICY "authenticated_insert_pericopes"
ON bible_pericopes
FOR INSERT
TO authenticated
WITH CHECK (true);