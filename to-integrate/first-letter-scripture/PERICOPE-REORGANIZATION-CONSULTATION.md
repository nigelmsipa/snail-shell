# Pericope Database Reorganization Consultation

## Current State: The Mess

### Problem Summary
The pericope database is inconsistent, unusable, and lacks clear purpose. Verse density ranges from 2.6 v/p (too fragmented) to 31.2 v/p (way too large), with no consistent methodology.

---

## Core Questions That Must Be Answered

### 1. PRIMARY PURPOSE: What are pericopes FOR in this app?

**Option A: Memorization Units (RECOMMENDED)**
- Purpose: Bite-sized chunks users can memorize
- Target: 6-12 verses per pericope (hard requirement)
- Rationale: App is called "First Letter Scripture" - it's for MEMORIZING
- Quality: Natural boundaries respected, but memorization drives size

**Option B: Study/Reference Units**
- Purpose: Theological/narrative coherence
- Target: Variable length (scene-based, can be 4-40 verses)
- Rationale: Academic accuracy over usability
- Quality: Scholarly divisions, may be too large to memorize

**Option C: Hybrid (CURRENT MESS)**
- Purpose: Unclear mix of both
- Target: Inconsistent
- Result: Chaos

**DECISION NEEDED:** Pick A or B. Can't be both.

---

### 2. GENRE-SPECIFIC STANDARDS: One size fits all?

If Purpose = Memorization (Option A), should standards vary by genre?

| Genre | Current Reality | Proposed Standard | Rationale |
|-------|----------------|-------------------|-----------|
| **Narrative** | 15-30 v/p | 8-12 v/p | Scenes can be chunked at dialogue/action breaks |
| **Poetry** | 3-7 v/p | 6-10 v/p | Stanzas/thought units, but consolidate tiny fragments |
| **Prophecy** | 3-30 v/p | 8-12 v/p | Oracle boundaries, but avoid micro-divisions |
| **Epistles** | 15-25 v/p | 8-12 v/p | Theological arguments split at topic shifts |
| **Lists/Genealogies** | 30-70 v/p | 15-20 v/p | Logical groupings (priests, Levites, etc.) |
| **Psalms** | 5-10 v/p | Entire psalm | Each psalm is atomic (don't split) |

**DECISION NEEDED:** Approve standards per genre OR use uniform 6-12 v/p for all.

---

### 3. DATABASE SCHEMA: Does it need changes?

**Current Schema (inferred):**
```sql
bible_pericopes:
  - id (UUID)
  - book_id (FK to bible_books)
  - chapter (int)
  - verse_start (int)
  - verse_end (int)
  - name (text)
  - [version-agnostic - shared across translations]
```

**Proposed Additions:**

**Option A: Add hierarchy support**
```sql
ALTER TABLE bible_pericopes ADD COLUMN:
  - part_number (int, nullable) -- For "Part 1: David's Rise" grouping
  - part_name (text, nullable)
  - display_order (int) -- Explicit ordering
```

**Option B: Add metadata**
```sql
ALTER TABLE bible_pericopes ADD COLUMN:
  - genre (text) -- 'narrative', 'poetry', 'prophecy', 'epistle', 'list'
  - priority (int) -- 1=essential, 2=important, 3=optional (for memorization tiers)
  - difficulty (int) -- 1=easy, 5=hard (for learners)
```

**Option C: Keep simple (current structure)**
- No changes to schema
- Just fix the data

**DECISION NEEDED:** Which additions (if any)?

---

### 4. TITLE STRATEGY: What makes a good name?

**Current Chaos:**
- Long: "The Lord Hurled a Great Wind upon the Sea" (15 words)
- Medium: "Nehemiah's Prayer for Jerusalem" (4 words)
- Short: "The Excellent Wife" (3 words)
- Quote: "How Lonely Sits the City" (5 words)

**Proposed Standard:**

| Rule | Example | Why |
|------|---------|-----|
| **Max 8 words** | "David Mourns for Saul and Jonathan" | Fits UI, memorable |
| **Use character names** | "Elijah Taken Up to Heaven" | Anchors in mind |
| **Use vivid verbs** | "Jehu Destroys Baal Worship" | Action=memorable |
| **Avoid "The Lord said to..."** | Bad: "The Lord Spoke to Jeremiah" | Generic, forgettable |
| **Prefer evocative over descriptive** | "Cast Into the Deep" > "Jonah Prays from Fish" | Emotional hook |
| **Use famous quotes when available** | "Great Is Thy Faithfulness" | Pre-existing memory anchor |

**DECISION NEEDED:** Approve title standards.

---

### 5. QUALITY CHECKLIST: How do we know a pericope is "good"?

**Proposed Quality Standards:**

✅ **Pass if ALL true:**
1. Verse count in acceptable range (6-12 v/p, or genre-specific)
2. Respects natural boundary (doesn't split mid-sentence, mid-dialogue, mid-oracle)
3. Title is memorable, evocative, max 8 words
4. Complete narrative/theological unit (user can memorize standalone)
5. No overlaps with adjacent pericopes
6. No gaps (all verses covered)

❌ **Fail if ANY true:**
1. Arbitrary cutoff (split at verse 10 just because)
2. Mid-scene split (action continues across boundary)
3. Too small (<4 verses) unless complete psalm/oracle
4. Too large (>15 verses) unless genealogy/list with no natural break
5. Generic title ("Chapter 5", "David's Reign Part 3")
6. Duplicate title in same book

**DECISION NEEDED:** Approve quality standards.

---

## Recommendations

### Immediate Actions

**1. Define Purpose (Pick One):**
   - [ ] **Option A: Memorization-first** (6-12 v/p standard)
   - [ ] Option B: Study-first (variable length)

**2. Set Hard Standards:**
   - [ ] Approve genre-specific v/p ranges
   - [ ] Approve title formatting rules
   - [ ] Approve quality checklist

**3. Database Decision:**
   - [ ] Keep current schema (simple)
   - [ ] Add hierarchy support (parts)
   - [ ] Add metadata (genre, priority, difficulty)

### Execution Strategy

**Option 1: REDO EVERYTHING (Nuclear Approach)**
- Pros: Clean slate, consistent quality
- Cons: Massive time investment (weeks)
- Process:
  1. Delete all current pericopes
  2. Hand-craft each book using approved standards
  3. Import in batches with quality checks

**Option 2: INCREMENTAL FIX (Surgical Approach)**
- Pros: Preserve good work, fix bad work
- Cons: Longer timeline, mixed quality during transition
- Process:
  1. Audit all 66 books, score against quality checklist
  2. Tier books: GOOD (keep), FIXABLE (revise), BAD (redo)
  3. Fix in priority order

**Option 3: TWO-TIER SYSTEM (Compromise)**
- Pros: Ship faster, improve over time
- Cons: Complexity in database
- Process:
  1. Mark all current pericopes as "v1" (legacy)
  2. Create new "v2" pericopes with proper standards
  3. Users see v2 when available, fallback to v1
  4. Gradually replace v1 with v2

**DECISION NEEDED:** Which execution strategy?

---

## Specific Book Examples

### Example 1: Nehemiah (Currently 23 pericopes, 17.7 v/p)

**Current (TOO BIG):**
- Ch 7 split into 4 (Gatekeepers, Exiles, Priests, Genealogies)
- Avg 18 verses each

**Fixed for Memorization (6-12 v/p):**
- Ch 7 split into 8-10 pericopes (by family groups)
- Ch 3 split into 4-5 (by wall sections)
- Result: 45-50 pericopes, 9 v/p avg

**Natural boundaries:**
- Lists: By category (leaders, priests, Levites, singers, gatekeepers)
- Narrative: By scene (prayer, journey, opposition, completion)
- Reforms: By issue (Sabbath, marriage, tithes)

### Example 2: Jeremiah (Currently 77 pericopes, 17.7 v/p)

**Current (TOO BIG):**
- Ch 2 split into 2 (19 verses, 18 verses)

**Fixed for Memorization:**
- Ch 2 split into 4-5 (oracles separated)
- Ch 50-51 (long Babylon oracles) split into 8-10 each
- Result: 140-160 pericopes, 9 v/p avg

**Natural boundaries:**
- Oracles: "Thus says the LORD" markers
- Narratives: Scene/dialogue changes
- Poetry: Stanza breaks

### Example 3: Psalms (Currently ~7 v/p - GOOD)

**Current (CORRECT):**
- Each psalm = 1 pericope
- Short psalms (3-8 verses) OK
- Long psalms (150+ verses) NOT split

**Keep as-is:** Psalms are atomic units, genre exception approved.

---

## Timeline Estimates

### If Option 1 (Redo Everything):
- Define standards: 1 session
- Redo 66 books: 15-20 sessions (2-3 weeks)
- Quality audit: 3-5 sessions
- Total: ~4 weeks

### If Option 2 (Incremental Fix):
- Audit all books: 2 sessions
- Fix high-priority (20 books): 10 sessions
- Fix medium (25 books): 12 sessions
- Fix low (21 books): 8 sessions
- Total: ~32 sessions (~5 weeks)

### If Option 3 (Two-Tier):
- Mark existing as v1: 1 session
- Create v2 for top 10 books: 8 sessions
- Iterate: ongoing
- Total: Start shipping in 1 week, improve over months

---

## Decisions Required From You

Please specify:

1. **Primary Purpose:** Memorization-first OR Study-first?
2. **Genre Standards:** Approve table above OR use uniform 6-12 v/p?
3. **Database Schema:** Keep simple OR add hierarchy OR add metadata?
4. **Title Rules:** Approve 8-word max, evocative style?
5. **Quality Checklist:** Approve 6 pass/6 fail criteria?
6. **Execution Strategy:** Nuclear redo OR Incremental fix OR Two-tier?
7. **Starting Point:** Which book should be the "gold standard" example?

Once you answer these, I can execute with confidence instead of guessing and creating more mess.

---

## Conclusion

The current pericope database is a mess because there's no clear purpose, no consistent standards, and no quality control. Before ANY work continues, these decisions must be made. Otherwise, we're just rearranging deck chairs on the Titanic.

I recommend:
- **Purpose:** Memorization-first (6-12 v/p)
- **Standards:** Genre-specific with quality checklist
- **Database:** Keep simple for now
- **Execution:** Option 2 (Incremental Fix) - audit, tier, fix in priority order
- **Gold Standard:** Start with Jonah (4 chapters, narrative, manageable)

But ultimately, these are YOUR decisions. Tell me what you want, and I'll execute it properly this time.
