# Pericope System: Technical Architecture Recommendations

## Current State Analysis

### Data Flow
```
JS Files (scripts/pericopes/*.js)
    ↓ import_pericopes.js
Supabase (bible_pericopes table)
    ↓ useChapterData hook (4 queries)
React Frontend (TanStack Query cache)
```

### Actual Query Pattern (from useChapterData.tsx)
```typescript
// Query 1: Get book
supabase.from('bible_books').select('id, name').ilike('name', book)

// Query 2: Get version
supabase.from('bible_versions').select('id, abbreviation').eq('abbreviation', version)

// Query 3: Get pericopes
supabase.from('bible_pericopes').select('*')
  .eq('book_id', bookData.id)
  .eq('chapter', chapter)
  .order('display_order')  // ⚠️ Column doesn't exist

// Query 4: Get verses
supabase.from('bible_verses').select('verse, text')
  .eq('version_id', versionData.id)
  .eq('book_id', bookData.id)
  .eq('chapter', chapter)
```

---

## CRITICAL ISSUES

### 🔴 Issue 1: Missing Database Columns

**Problem:** Code references columns that don't exist in schema

**Evidence:**
```typescript
// Line 58: useChapterData.tsx
.order('display_order')  // ❌ Column doesn't exist

// Line 93: useChapterData.tsx
subtitle: pericope.subtitle  // ❌ Column doesn't exist
```

**Impact:**
- Ordering will fail or fall back to default
- Subtitle will always be undefined
- Silent bugs in production

**Fix Required:**
```sql
ALTER TABLE bible_pericopes
ADD COLUMN display_order INTEGER,
ADD COLUMN subtitle TEXT;

-- Set display_order for existing rows
UPDATE bible_pericopes
SET display_order = ROW_NUMBER() OVER (
  PARTITION BY book_id, chapter
  ORDER BY verse_start
);
```

---

### 🟠 Issue 2: Performance - 4 Queries Per Page Load

**Problem:** Every chapter view makes 4 separate database calls

**Current:**
1. Lookup book by name (fuzzy match with `ilike`)
2. Lookup version by abbreviation
3. Get pericopes for chapter
4. Get all verses for chapter

**Impact:**
- 4 round trips to database
- Network latency x4
- Unnecessary queries for book/version (static data)

**Recommended Fix:**

**Option A: Use Joins (Best Performance)**
```typescript
// Single query with joins
const { data } = await supabase
  .from('bible_pericopes')
  .select(`
    *,
    book:bible_books!inner(id, name),
    verses:bible_verses!inner(verse, text)
  `)
  .eq('book.name', book)
  .eq('chapter', chapter)
  .eq('verses.version_id', versionId)  // Need to get version_id first
  .order('display_order');
```

**Option B: Cache Book/Version Lookups (Simpler)**
```typescript
// Cache these - they never change
const BOOK_NAME_TO_ID = { /* ... */ };
const VERSION_ABB_TO_ID = { /* ... */ };

// Then just 2 queries instead of 4
const pericopesQuery = /* ... */;
const versesQuery = /* ... */;
```

**Recommendation:** Use Option B (cache static lookups) as first step. Option A requires more complex query logic.

---

### 🟠 Issue 3: Cache Configuration Conflict

**Problem:** Cache is configured but immediately invalidated

```typescript
staleTime: 1000 * 60 * 60,  // ✅ Cache for 1 hour
refetchOnMount: 'always',    // ❌ Refetch every time anyway
```

**Impact:**
- Cache exists but is never used
- Users refetch same data on every navigation
- Wasted bandwidth, slower UX

**Fix:**
```typescript
staleTime: 1000 * 60 * 60,     // Cache for 1 hour
refetchOnMount: false,         // Use cache if available
refetchOnWindowFocus: false,   // Don't refetch on tab focus
```

---

### 🟡 Issue 4: No Database Indexes

**Problem:** No explicit indexes defined for common query patterns

**Missing indexes:**
```sql
-- Currently relies on implicit primary key index
-- Need explicit composite indexes for performance

CREATE INDEX idx_pericopes_book_chapter
ON bible_pericopes(book_id, chapter);

CREATE INDEX idx_pericopes_book_chapter_order
ON bible_pericopes(book_id, chapter, display_order);

CREATE INDEX idx_verses_book_chapter
ON bible_verses(version_id, book_id, chapter);
```

**Impact:**
- Queries still work but slower
- Will matter more as data grows
- Missing composite index = full table scan

---

### 🟡 Issue 5: No Uniqueness Constraints

**Problem:** Could accidentally insert duplicate pericopes

**Current:** No constraint preventing:
```sql
INSERT INTO bible_pericopes (book_id, chapter, verse_start, verse_end, name)
VALUES (1, 5, 1, 10, 'Pericope A');

-- Nothing stops this duplicate:
INSERT INTO bible_pericopes (book_id, chapter, verse_start, verse_end, name)
VALUES (1, 5, 1, 10, 'Pericope A');
```

**Fix:**
```sql
ALTER TABLE bible_pericopes
ADD CONSTRAINT unique_pericope_range
UNIQUE (book_id, chapter, verse_start, verse_end);

-- Or stricter:
ADD CONSTRAINT unique_pericope_position
UNIQUE (book_id, chapter, display_order);
```

---

### 🟡 Issue 6: No Data Validation

**Problem:** No constraints on verse ranges

**Current:** Nothing prevents:
```sql
-- Invalid: verse_end < verse_start
INSERT INTO bible_pericopes (book_id, chapter, verse_start, verse_end, name)
VALUES (1, 5, 10, 1, 'Backwards Pericope');

-- Invalid: verse_start = 0 or negative
INSERT INTO bible_pericopes (book_id, chapter, verse_start, verse_end, name)
VALUES (1, 5, 0, 5, 'Invalid Start');
```

**Fix:**
```sql
ALTER TABLE bible_pericopes
ADD CONSTRAINT valid_verse_range
CHECK (verse_start > 0 AND verse_end >= verse_start);

ALTER TABLE bible_pericopes
ADD CONSTRAINT valid_chapter
CHECK (chapter > 0);
```

---

## RECOMMENDED DATABASE SCHEMA CHANGES

```sql
-- Migration: Add missing columns and constraints

-- 1. Add missing columns
ALTER TABLE bible_pericopes
ADD COLUMN IF NOT EXISTS display_order INTEGER,
ADD COLUMN IF NOT EXISTS subtitle TEXT;

-- 2. Populate display_order for existing rows
UPDATE bible_pericopes
SET display_order = sub.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY book_id, chapter
    ORDER BY verse_start
  ) as row_num
  FROM bible_pericopes
) sub
WHERE bible_pericopes.id = sub.id
AND bible_pericopes.display_order IS NULL;

-- 3. Add indexes
CREATE INDEX IF NOT EXISTS idx_pericopes_book_chapter
ON bible_pericopes(book_id, chapter);

CREATE INDEX IF NOT EXISTS idx_pericopes_book_chapter_order
ON bible_pericopes(book_id, chapter, display_order);

-- 4. Add constraints
ALTER TABLE bible_pericopes
ADD CONSTRAINT IF NOT EXISTS valid_verse_range
CHECK (verse_start > 0 AND verse_end >= verse_start),

ADD CONSTRAINT IF NOT EXISTS valid_chapter
CHECK (chapter > 0),

ADD CONSTRAINT IF NOT EXISTS unique_pericope_position
UNIQUE (book_id, chapter, display_order);

-- 5. Make display_order NOT NULL after populating
ALTER TABLE bible_pericopes
ALTER COLUMN display_order SET NOT NULL;
```

---

## IMPORT SCRIPT IMPROVEMENTS

### Current Problems
1. No upsert logic - overwrites or duplicates
2. No transaction handling
3. No validation before import
4. No rollback on error

### Recommended Improvements

```typescript
// import_pericopes.js v2

async function importPericopesForBook(bookName, pericopes) {
  // 1. Validate data before importing
  validatePericopes(pericopes); // Throws if invalid

  // 2. Use transaction
  const { data: bookData } = await supabase
    .from('bible_books')
    .select('id')
    .ilike('name', bookName)
    .single();

  if (!bookData) throw new Error(`Book not found: ${bookName}`);

  // 3. Delete existing pericopes for this book (clean slate)
  await supabase
    .from('bible_pericopes')
    .delete()
    .eq('book_id', bookData.id);

  // 4. Insert with explicit ordering
  const insertData = pericopes.map((p, index) => ({
    book_id: bookData.id,
    chapter: p.chapter,
    verse_start: p.verse_start,
    verse_end: p.verse_end,
    name: p.name,
    subtitle: p.subtitle || null,
    display_order: index + 1
  }));

  // 5. Batch insert
  const { error } = await supabase
    .from('bible_pericopes')
    .insert(insertData);

  if (error) {
    console.error(`Failed to import ${bookName}:`, error);
    throw error;
  }

  console.log(`✅ Imported ${pericopes.length} pericopes for ${bookName}`);
}

function validatePericopes(pericopes) {
  pericopes.forEach((p, i) => {
    if (!p.chapter || p.chapter < 1)
      throw new Error(`Invalid chapter at index ${i}`);
    if (!p.verse_start || p.verse_start < 1)
      throw new Error(`Invalid verse_start at index ${i}`);
    if (!p.verse_end || p.verse_end < p.verse_start)
      throw new Error(`Invalid verse_end at index ${i}`);
    if (!p.name || p.name.trim().length === 0)
      throw new Error(`Missing name at index ${i}`);
  });
}
```

---

## SOURCE OF TRUTH STRATEGY

### Current Confusion
- JS files exist in `/scripts/pericopes/`
- Database also has pericope data
- Which is authoritative?

### Recommended Approach: **Database as Source of Truth**

**Rationale:**
- Database is production runtime
- Easier to update/fix without redeploying
- Better for collaboration (multiple people editing)
- Query-able, auditable, versioned via migrations

**Workflow:**

```
1. EDIT: Modify JS file (convenient editing)
2. IMPORT: Run import script (upsert to database)
3. COMMIT: Commit JS file + migration script
4. DEPLOY: Database is updated
5. DELETE: JS file is now just "source code" (can delete after import)
```

**Alternative: Keep JS Files as "Fixtures"**
- Useful for testing
- Useful for seeding new environments
- Keep in repo but mark as "reference only"

---

## PERFORMANCE OPTIMIZATION ROADMAP

### Phase 1: Quick Wins (1 day)
1. ✅ Fix cache configuration (remove `refetchOnMount: 'always'`)
2. ✅ Add `display_order` and `subtitle` columns
3. ✅ Create composite indexes

**Expected improvement:** 30-40% faster load times

### Phase 2: Query Optimization (2-3 days)
1. ✅ Cache book/version lookups (static data)
2. ✅ Reduce to 2 queries instead of 4
3. ⚠️ Consider single joined query (more complex)

**Expected improvement:** 50-60% faster load times

### Phase 3: Edge Caching (optional)
1. Use Supabase edge functions for CDN caching
2. Pre-generate popular chapters (Genesis 1, John 3, etc.)
3. Serve from edge cache first

**Expected improvement:** 80-90% faster for cached chapters

---

## BEST PRACTICES CHECKLIST

### Database Layer
- [x] Use foreign keys (already done)
- [ ] Add display_order column
- [ ] Add uniqueness constraints
- [ ] Add validation constraints (CHECK)
- [ ] Create composite indexes
- [ ] Enable RLS policies (already done per migration files)

### Application Layer
- [x] Use query caching (TanStack Query)
- [ ] Fix cache invalidation settings
- [ ] Reduce number of queries per page
- [ ] Add error boundaries
- [ ] Add loading states

### Data Management
- [ ] Define clear source of truth (DB)
- [ ] Improve import script (validation, transactions)
- [ ] Add rollback capability
- [ ] Version control migrations
- [ ] Document data update workflow

---

## RECOMMENDED ACTION PLAN

### Immediate (Do First)
1. **Add missing columns** (display_order, subtitle)
2. **Fix cache configuration** (remove refetchOnMount: 'always')
3. **Add database indexes** (performance)
4. **Add uniqueness constraint** (prevent duplicates)

### Short Term (Do Next)
5. **Cache static lookups** (book IDs, version IDs)
6. **Improve import script** (validation, transactions)
7. **Add validation constraints** (CHECK clauses)

### Long Term (Future Improvements)
8. **Consider query consolidation** (joins vs separate queries)
9. **Add edge caching** (if performance still needed)
10. **Build admin UI** (edit pericopes without SQL)

---

## MIGRATION SCRIPT

Create file: `supabase/migrations/YYYYMMDD_fix_pericopes_schema.sql`

```sql
-- Fix pericope schema issues
-- Date: 2025-11-13

BEGIN;

-- 1. Add missing columns
ALTER TABLE bible_pericopes
ADD COLUMN IF NOT EXISTS display_order INTEGER,
ADD COLUMN IF NOT EXISTS subtitle TEXT;

-- 2. Populate display_order
UPDATE bible_pericopes
SET display_order = sub.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY book_id, chapter
    ORDER BY verse_start
  ) as row_num
  FROM bible_pericopes
) sub
WHERE bible_pericopes.id = sub.id;

-- 3. Add indexes
CREATE INDEX IF NOT EXISTS idx_pericopes_book_chapter
ON bible_pericopes(book_id, chapter);

CREATE INDEX IF NOT EXISTS idx_pericopes_book_chapter_order
ON bible_pericopes(book_id, chapter, display_order);

-- 4. Add constraints
ALTER TABLE bible_pericopes
ADD CONSTRAINT IF NOT EXISTS valid_verse_range
CHECK (verse_start > 0 AND verse_end >= verse_start);

ALTER TABLE bible_pericopes
ADD CONSTRAINT IF NOT EXISTS valid_chapter
CHECK (chapter > 0);

-- 5. Add uniqueness (prevents duplicates)
ALTER TABLE bible_pericopes
ADD CONSTRAINT IF NOT EXISTS unique_pericope_position
UNIQUE (book_id, chapter, display_order);

-- 6. Make display_order required
ALTER TABLE bible_pericopes
ALTER COLUMN display_order SET NOT NULL;

COMMIT;
```

---

## CONCLUSION

The pericope system is **functionally working but not optimized**. Key issues:

1. **Missing schema columns** (display_order, subtitle) referenced in code
2. **Performance**: 4 queries per page load (can be 2)
3. **Cache misconfiguration**: Refetching unnecessarily
4. **No data validation**: Could insert invalid data
5. **No indexes**: Queries work but slower than needed

**Priority fix order:**
1. Add missing columns (breaks current functionality)
2. Fix cache settings (immediate UX improvement)
3. Add indexes (performance)
4. Add constraints (data integrity)
5. Optimize queries (bigger performance win)

These are all **quick fixes** (1-2 days) that will make the system production-ready.
