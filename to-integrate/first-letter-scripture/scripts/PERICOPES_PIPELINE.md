Pericopes Generation & Import Pipeline

Overview
- Generates clean pericopes for all 66 books directly from the Bible text in your Supabase DB.
- Targets 6–12 verses per pericope and avoids short orphans.
- Writes generated files to `scripts/pericopes_generated/` with the same naming scheme as existing curated sets.
- Imports into `bible_pericopes` using the service role key.

Prereqs
- Supabase env configured: `VITE_SUPABASE_URL`
- Keys:
  - Read-only: `VITE_SUPABASE_PUBLISHABLE_KEY`
  - Write/delete: `SUPABASE_SERVICE_ROLE_KEY`
- Apply migrations in `supabase/migrations/` first (public read policies, RLS, indexes, functions).

Commands
1) Generate pericopes from DB

   node scripts/generate_pericopes_from_db.js

   - Creates files at `scripts/pericopes_generated/NN_slug.js`.
   - Titles are short phrases from the first verse; falls back to `vX-Y`.

2) Import generated pericopes

   SUPABASE_SERVICE_ROLE_KEY=... node scripts/import_complete_bible_generated.js

   - Clears existing pericopes per book and inserts the generated ones.

Notes
- Keep curated sets in `scripts/pericopes/` for comparison or rollback.
- The app reads pericopes live from DB; no build step needed after import.
- You can iterate generation parameters (chunk sizes) inside `generate_pericopes_from_db.js` to influence density.

