-- Enable Row Level Security on bible_pericopes table
-- This fixes the critical security issue where RLS policies exist but RLS is not enabled
ALTER TABLE bible_pericopes ENABLE ROW LEVEL SECURITY;