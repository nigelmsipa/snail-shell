# Acts & Revelation Pericope Generation - Summary Report

**Date:** 2025-11-10
**Task:** Create pericopes for Acts (28 ch) and Revelation (22 ch)

---

## ✅ COMPLETED

### Files Generated

**Acts (28 chapters):**
- Created: `src/data/acts1.ts` through `src/data/acts28.ts`
- Total: 173 pericopes
- Total verses: 1,007
- **Average: 5.8 verses per pericope**

**Revelation (22 chapters):**
- Created: `src/data/revelation1.ts` through `src/data/revelation22.ts`
- Total: 98 pericopes
- Total verses: 404
- **Average: 4.1 verses per pericope**

**Combined Total:** 271 pericopes across 50 chapters

---

## 📊 DENSITY ANALYSIS

### Target Constraint
- **Target:** 6-12 verses per pericope
- **Goal:** Evocative titles (MAX 8 words)
- **Format:** Hosea-style TypeScript (id, verses array, name)

### Actual Results

| Book       | Chapters | Pericopes | Verses | Avg/Pericope | Status |
|------------|----------|-----------|--------|--------------|--------|
| Acts       | 28       | 173       | 1,007  | 5.8          | ⚠️ Below target |
| Revelation | 22       | 98        | 404    | 4.1          | ⚠️ Too fragmented |

### Chapters Below Target (< 6 verses/pericope)

**Acts:** 14 out of 28 chapters
- Acts 1 (4.3), Acts 12 (4.2), Acts 18 (4.7), Acts 20 (4.8), etc.

**Revelation:** 20 out of 22 chapters
- Rev 6 (2.4), Rev 8 (2.2), Rev 14 (2.9), Rev 16 (3.0), etc.

---

## 🔍 ISSUE ANALYSIS

### Acts (5.8 avg)
**Status:** Close to target but slightly fragmented
- Most chapters range 5.2-6.9 verses per pericope
- A few outliers (Acts 1, 12, 18, 20) are below 5 verses
- **Overall:** Acceptable but could benefit from minor consolidation

### Revelation (4.1 avg)
**Status:** Significantly fragmented
- Many symbolic sequences (7 seals, 7 trumpets, 7 bowls) split too granularly
- Each seal/trumpet/bowl is only 2-3 verses
- Example issues:
  - Rev 6: Seven seals = 7 pericopes, but only 2.4 verses each
  - Rev 8: Trumpets 1-4 = 4 separate pericopes at ~2 verses each
  - Rev 16: Seven bowls = 7 pericopes at 3 verses each

**Root Cause:** Prioritized theological precision over memorization ergonomics

---

## 🎯 SAMPLE PERICOPES

### Acts - Good Examples (within target)
```typescript
// Acts 2:14-21 (8 verses) - "This Is What Was Spoken"
// Acts 4:5-12 (8 verses) - "No Other Name Under Heaven"
// Acts 7:30-34 (5 verses) - "The Burning Bush"
```

### Acts - Fragmented Examples (below target)
```typescript
// Acts 1:1-3 (3 verses) - "The Promise of the Holy Spirit"
// Acts 1:9-11 (3 verses) - "He Was Lifted Up"
// Acts 12:1-5 (5 verses) - "Herod Killed James"
```

### Revelation - Good Examples (within target)
```typescript
// Rev 2:18-29 (12 verses) - "To Thyatira: That Woman Jezebel"
// Rev 3:7-13 (7 verses) - "To Philadelphia: An Open Door"
```

### Revelation - Fragmented Examples (too short)
```typescript
// Rev 6:1-2 (2 verses) - "The First Seal: White Horse"
// Rev 6:3-4 (2 verses) - "The Second Seal: Red Horse"
// Rev 8:7 (1 verse) - "The First Trumpet: Hail and Fire"
```

---

## 🛠️ SCRIPTS CREATED

1. **`scripts/generate_acts_data.js`** - Generation script for Acts
2. **`scripts/generate_revelation_data.js`** - Generation script for Revelation
3. **`scripts/check_acts_pericopes.js`** - Verification script for Acts
4. **`scripts/check_revelation_pericopes.js`** - Verification script for Revelation
5. **`scripts/import_pericopes.js`** - Updated to include Acts and Revelation

---

## 📋 RECOMMENDATIONS

### Option 1: Keep As-Is
- Acts is close enough to target (5.8 avg)
- Proceed with current pericopes
- Focus on getting them into the database
- **Pros:** Work is done, can iterate later
- **Cons:** Revelation is fragmented, may overwhelm users

### Option 2: Consolidate Revelation Only
- Keep Acts as-is (acceptable)
- Regenerate Revelation with consolidation:
  - Group seals/trumpets/bowls by theme (e.g., "First Four Seals", "First Four Trumpets")
  - Target: ~50 pericopes instead of 98
  - Target average: 8 verses per pericope
- **Pros:** Fixes main issue (Revelation)
- **Cons:** Requires regeneration

### Option 3: Consolidate Both
- Regenerate both books to meet 6-12 verse target
- Acts: Reduce from 173 → ~120 pericopes
- Revelation: Reduce from 98 → ~50 pericopes
- **Pros:** Consistent with design principles in CLAUDE.md
- **Cons:** More work, but cleaner result

---

## 🎨 TITLE QUALITY

### Good Titles (Evocative, < 8 words)
- ✅ "Silver and Gold I Have Not" (Acts 3:1-8)
- ✅ "We Must Obey God Rather than Men" (Acts 5:27-32)
- ✅ "Worthy Is the Lamb Who Was Slain" (Rev 5:11-14)
- ✅ "Behold, I Am Making All Things New" (Rev 21:5-8)

### Titles That Could Be Shorter
- ⚠️ "To Thyatira: That Woman Jezebel" (8 words, at limit)
- ⚠️ "The Mighty Angel with the Little Scroll" (7 words, borderline)

**Overall Title Quality:** Good - most are evocative and under 8 words

---

## 📦 IMPORT READINESS

**Database Import:**
- ✅ `import_pericopes.js` updated with Acts and Revelation
- ✅ All TypeScript files use consistent format
- ✅ Ready to import with `node scripts/import_pericopes.js`

**Next Steps:**
1. Decide on consolidation (if needed)
2. Run import script to populate database
3. Test in app
4. Update CLAUDE.md with session notes

---

## 🔄 COMPARISON TO OTHER BOOKS

From CLAUDE.md lesson on pericope fragmentation:

| Book    | Chapters | Pericopes | Verses/Pericope | Status      |
|---------|----------|-----------|-----------------|-------------|
| Hosea   | 14       | 71        | 3.7             | TOO MANY ❌ |
| Micah   | 7        | 37        | 6.5             | Borderline ⚠️ |
| Amos    | 9        | 44        | 4.5             | TOO MANY ❌ |
| Jonah   | 4        | 17        | 7.1             | Acceptable ✅ |
| **Acts** | **28** | **173** | **5.8** | **Below target ⚠️** |
| **Rev** | **22** | **98** | **4.1** | **TOO MANY ❌** |

**Conclusion:** Revelation has the same fragmentation issue as Hosea and Amos. Acts is borderline like Micah.

---

## 💡 DESIGN LESSONS

### What Worked
✅ Evocative titles that capture essence
✅ Consistent TypeScript format
✅ Clear theological structure (early church → Paul → Rome)
✅ Apocalyptic progression (churches → seals → trumpets → bowls → new creation)

### What Needs Improvement
❌ Too granular in symbolic sequences
❌ Prioritized precision over memorization ergonomics
❌ Didn't enforce 6-12 verse constraint during generation

### Lessons Learned
> "These are roads, not buildings. We can rebuild them." - CLAUDE.md

Pericopes are transient data structures optimized for memorization, not theological analysis. When in doubt, consolidate.

---

## 🚀 FINAL COUNT

**Total Generated:**
- **50 chapters** (28 Acts + 22 Revelation)
- **271 pericopes** (173 Acts + 98 Revelation)
- **1,411 verses** (1,007 Acts + 404 Revelation)

**Overall Average:** 5.2 verses per pericope
**Target:** 6-12 verses per pericope

**Status:** ⚠️ Below target, consolidation recommended for Revelation
