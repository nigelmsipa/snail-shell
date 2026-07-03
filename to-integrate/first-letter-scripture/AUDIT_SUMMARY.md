# Pericope Audit Summary

**Date:** 2025-11-10
**Full Report:** See `audit_report.md` for detailed issues

---

## Executive Summary

**Total Books Audited:** 11
**Total Pericopes:** 571
**Total Issues Found:** 238

### Issue Breakdown
- **Orphan Pericopes (< 5 verses):** 101 (17.7%)
- **Title Length Issues (> 8 words):** 137 (24.0%)
- **Title Quality Issues:** 0

---

## Books by Status

### ✅ PASS (1 book)
These books meet all quality standards:

- **Obadiah** - 1 ch, 3 pericopes, 7.0 avg verses
  - 0 orphans, 0 title issues

---

### ⚠️ NEEDS CONSOLIDATION (7 books)
These books have orphan pericopes but title quality is acceptable:

| Book | Chapters | Pericopes | Avg Verses | Orphans | Priority |
|------|----------|-----------|------------|---------|----------|
| **Amos** | 9 | 20 | 6.1 | 5 | Medium |
| **Hosea** | 14 | 28 | 7.0 | 4 | Medium |
| **Joel** | 3 | 12 | 6.1 | 3 | Medium |
| **Jonah** | 4 | 7 | 6.9 | 1 | Low |
| **Lamentations** | 5 | 18 | 7.6 | 1 | Low |
| **Micah** | 7 | 15 | 7.0 | 1 | Low |
| **Jeremiah** | 52 | 161 | 7.3 | 26 | High |

**Action Required:**
- Consolidate orphan pericopes (< 5 verses) with adjacent pericopes
- Focus on Jeremiah first (26 orphans), then Amos, Hosea, Joel

---

### 🚨 NEEDS BOTH (3 books)
These books have both orphan pericopes AND title issues:

| Book | Chapters | Pericopes | Avg Verses | Orphans | Title Issues | Priority |
|------|----------|-----------|------------|---------|--------------|----------|
| **Ezekiel** | 48 | 143 | 7.8 | 34 | 61 | URGENT |
| **Isaiah** | 66 | 132 | 7.9 | 21 | 39 | URGENT |
| **Daniel** | 12 | 32 | 8.8 | 5 | 9 | High |

**Action Required:**
1. **Shorten titles** (reduce to max 8 words, make evocative not descriptive)
2. **Consolidate orphans** (merge pericopes with < 5 verses)
3. Focus on Ezekiel and Isaiah first (highest issue counts)

---

## Priority Action Plan

### 🔴 URGENT - Fix These First

1. **Ezekiel** (143 pericopes)
   - 34 orphans (23.8% of pericopes)
   - 61 title issues (42.7% of pericopes)
   - **Impact:** Major prophetic book with most issues

2. **Isaiah** (132 pericopes)
   - 21 orphans (15.9% of pericopes)
   - 39 title issues (29.5% of pericopes)
   - **Impact:** Most-read prophetic book with significant issues

### 🟡 HIGH PRIORITY

3. **Jeremiah** (161 pericopes)
   - 26 orphans (16.1% of pericopes)
   - 28 title issues (17.4% of pericopes)
   - **Impact:** Largest book by pericope count

4. **Daniel** (32 pericopes)
   - 5 orphans (15.6% of pericopes)
   - 9 title issues (28.1% of pericopes)
   - **Impact:** Popular apocalyptic book

### 🟢 MEDIUM PRIORITY

5. **Amos** (20 pericopes) - 5 orphans
6. **Hosea** (28 pericopes) - 4 orphans
7. **Joel** (12 pericopes) - 3 orphans

### ⚪ LOW PRIORITY

8. **Jonah** (7 pericopes) - 1 orphan
9. **Lamentations** (18 pericopes) - 1 orphan
10. **Micah** (15 pericopes) - 1 orphan

---

## Sample Issues by Book

### Ezekiel - Title Length Examples

❌ **Too Long:**
- "The Hand of the LORD Was Upon Me - The Heavens Were Opened" (13 words)
- "I Will Bring a Sword Upon You and Destroy Your High Places" (12 words)
- "You Shall Know That I Am the LORD When Their Slain Lie Among Their Idols" (16 words)

✅ **Should Be:**
- "The Hand of the LORD" (5 words)
- "Sword Against the High Places" (5 words)
- "Slain Among Their Idols" (4 words)

### Isaiah - Title Length Examples

❌ **Too Long:**
- "The LORD Will Strike Egypt, and They Will Turn to the LORD" (12 words)
- "Come, Behold the Works of the LORD - Wars Cease to the Ends of the Earth" (15 words)

✅ **Should Be:**
- "The LORD Strikes Egypt" (4 words)
- "Wars Cease to the Ends of the Earth" (8 words)

### Amos - Orphan Examples

❌ **Too Short:**
- "The LORD Roars from Zion" - 2 verses
- "Oracles Against Six Nations" - 0 verses (cross-chapter)
- "Vision of the Plumb Line" - 3 verses
- "Famine of Hearing God's Word" - 4 verses

✅ **Should Consolidate:**
- Merge "The LORD Roars from Zion" (2v) with "Oracles Against Six Nations"
- Merge "Vision of the Plumb Line" (3v) with adjacent pericope
- Merge "Famine of Hearing God's Word" (4v) with adjacent pericope

---

## Design Principles Violated

Based on CLAUDE.md design principles:

### ❌ Violated Principles

1. **Verse Density Target: 6-12 verses per pericope**
   - 101 pericopes (17.7%) fall below 5 verses
   - These create cognitive overhead, not benefit

2. **Title Requirements: Maximum 8 words**
   - 137 pericopes (24.0%) exceed 8 words
   - Long, descriptive sentences instead of short, evocative names

3. **Evocative vs Descriptive Titles**
   - Many titles are full sentences describing content
   - Should be memorable phrases that capture essence

### ✅ Followed Principles

1. **Average verse density is good** (6.1 to 8.8 across books)
2. **Overall structure respects narrative/theological boundaries**

---

## Regeneration Strategy

### Phase 1: Title Fixes (Quick Wins)
**Estimated Time:** 2-3 hours

Target all 137 title length issues across:
- Ezekiel (61 titles)
- Isaiah (39 titles)
- Jeremiah (28 titles)
- Daniel (9 titles)

**Method:**
1. Review existing titles
2. Shorten to max 8 words
3. Ensure evocative, not descriptive
4. Update TypeScript files
5. Reimport to database

### Phase 2: Consolidation (Structural Changes)
**Estimated Time:** 4-6 hours

Target all 101 orphan pericopes:

**Priority Order:**
1. Ezekiel (34 orphans)
2. Jeremiah (26 orphans)
3. Isaiah (21 orphans)
4. Amos, Hosea, Joel, Daniel (17 orphans total)
5. Jonah, Lamentations, Micah (3 orphans total)

**Method:**
1. Identify adjacent pericopes to merge
2. Consolidate to reach 5+ verses minimum
3. Update verse ranges
4. Create new evocative title for merged pericope
5. Regenerate TypeScript files
6. Reimport to database

---

## Expected Outcomes After Fixes

### Current State
- 571 pericopes
- 101 orphans (17.7%)
- 137 title issues (24.0%)

### Target State
- ~450-500 pericopes (after consolidation)
- 0 orphans (0%)
- 0 title issues (0%)
- All books in "PASS" status

### Quality Improvements
- Better memorization ergonomics (larger chunks)
- Clearer, more memorable titles
- Reduced cognitive overhead
- Improved user experience

---

## Next Steps

1. **Review this summary** and confirm approach
2. **Start with Ezekiel** (worst offender, most issues)
   - Fix all 61 title length issues
   - Consolidate all 34 orphan pericopes
3. **Move to Isaiah** (second worst)
   - Fix all 39 title length issues
   - Consolidate all 21 orphan pericopes
4. **Continue through remaining books** by priority

---

## Technical Notes

### Multiple Data Formats Found

The audit script successfully parsed **3 different pericope formats**:

1. **Format 1** (Micah, Amos, Ezekiel, Isaiah, Jeremiah, Daniel, Jonah, Obadiah, Lamentations):
   ```typescript
   { id: 'string', ref: '...', name: '...', verses: [...] }
   ```

2. **Format 2** (Hosea):
   ```typescript
   { id: number, verses: [...], name: '...' }
   ```

3. **Format 3** (Joel):
   ```typescript
   { title: '...', verses: [...], description: '...' }
   ```

**Recommendation:** Standardize all books to Format 1 for consistency.

---

**For detailed issues on specific pericopes, see `audit_report.md`**
