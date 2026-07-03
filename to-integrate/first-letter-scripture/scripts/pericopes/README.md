# Bible Pericopes Project

## Overview
Creating comprehensive pericope (narrative unit) divisions for all 66 books of the Bible, optimized for memorization.

## Constraints
- **Verse count**: 6-12 verses per pericope (occasionally up to 15 for cohesive narratives)
- **Title length**: Maximum 8 words
- **Title style**: Evocative and memorable (not just descriptive)
- **Natural breaks**: Honor thought-unit boundaries, don't split coherent ideas

## Progress Tracker

### ✅ ALL 66 BOOKS COMPLETE! 🎉

**Progress: 1,189/1,189 chapters (100%)** - ALL 66 books of the Bible now have pericope divisions optimized for memorization!

### Old Testament Structure (39 books, 929 chapters) ✅ COMPLETE

#### Law / Pentateuch (5 books, 187 chapters) ✅
- [x] Genesis (50)
- [x] Exodus (40)
- [x] Leviticus (27)
- [x] Numbers (36)
- [x] Deuteronomy (34)

#### Historical Books (12 books, 249 chapters) ✅
- [x] Joshua (24)
- [x] Judges (21)
- [x] Ruth (4)
- [x] 1 Samuel (31)
- [x] 2 Samuel (24)
- [x] 1 Kings (22)
- [x] 2 Kings (25)
- [x] 1 Chronicles (29)
- [x] 2 Chronicles (36)
- [x] Ezra (10)
- [x] Nehemiah (13)
- [x] Esther (10)

#### Wisdom / Poetry (5 books, 243 chapters) ✅
- [x] Job (42)
- [x] Psalms (150)
- [x] Proverbs (31)
- [x] Ecclesiastes (12)
- [x] Song of Solomon (8)

#### Major Prophets (5 books, 183 chapters) ✅
- [x] Isaiah (66)
- [x] Jeremiah (52)
- [x] Lamentations (5)
- [x] Ezekiel (48)
- [x] Daniel (12)

#### Minor Prophets (12 books, 67 chapters) ✅
- [x] Hosea (14)
- [x] Joel (3)
- [x] Amos (9)
- [x] Obadiah (1)
- [x] Jonah (4)
- [x] Micah (7)
- [x] Nahum (3)
- [x] Habakkuk (3)
- [x] Zephaniah (3)
- [x] Haggai (2)
- [x] Zechariah (14)
- [x] Malachi (4)

### New Testament Structure (27 books, 260 chapters) ✅ COMPLETE

#### Gospels (4 books, 89 chapters) ✅
- [x] Matthew (28)
- [x] Mark (16)
- [x] Luke (24)
- [x] John (21)

#### History (1 book, 28 chapters) ✅
- [x] Acts (28)

#### Paul's Epistles (13 books, 87 chapters) ✅
- [x] Romans (16)
- [x] 1 Corinthians (16)
- [x] 2 Corinthians (13)
- [x] Galatians (6)
- [x] Ephesians (6)
- [x] Philippians (4)
- [x] Colossians (4)
- [x] 1 Thessalonians (5)
- [x] 2 Thessalonians (3)
- [x] 1 Timothy (6)
- [x] 2 Timothy (4)
- [x] Titus (3)
- [x] Philemon (1)

#### General Epistles (8 books, 34 chapters) ✅
- [x] Hebrews (13)
- [x] James (5)
- [x] 1 Peter (5)
- [x] 2 Peter (3)
- [x] 1 John (5)
- [x] 2 John (1)
- [x] 3 John (1)
- [x] Jude (1)

#### Prophecy (1 book, 22 chapters) ✅
- [x] Revelation (22)

## File Naming Convention
- Old Testament: `01_genesis.js` through `39_malachi.js`
- New Testament: `40_matthew.js` through `66_revelation.js`

## Data Format
Each file exports an array of pericope objects:

```javascript
export const BOOK_PERICOPES = [
  {
    chapter: 1,
    verse_start: 1,
    verse_end: 5,
    name: 'Short Evocative Title'
  },
  // ... more pericopes
];
```

## Import Process
1. Create pericope file for a book
2. Add to `master_import.js`
3. Run import script to load into Supabase
4. Verify with app testing

## Quality Checks
- [ ] Average 6-12 verses per pericope
- [ ] Titles are evocative (not just descriptive)
- [ ] Titles are max 8 words
- [ ] No orphaned single verses
- [ ] Narrative coherence maintained
- [ ] Theological sense respected

## Total Scope
- **66 books**
- **1,189 chapters**
- **Estimated 3,500-4,000 pericopes**
