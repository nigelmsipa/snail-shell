# Psalms Mnemonic Pericope (PsMP) Framework

## Overview

This document describes the implementation of the complete Psalms pericope framework for the First Letter Scripture memorization app. All 150 Psalms have been organized into 207 memorable pericopes following the Five-Book structure of the Psalter.

## Implementation Status

### ✅ Completed
- [x] Generated all 150 Psalm TypeScript files (`psalm1.ts` - `psalm150.ts`)
- [x] Created 207 pericopes optimized for memorization
- [x] Implemented Five-Book thematic structure
- [x] Special handling for Psalm 119 (22 Hebrew letter sections)
- [x] Named all pericopes based on opening lines or key themes
- [x] Updated import scripts to include Psalms
- [x] Created verification script

### ⏳ Pending (requires network connectivity)
- [ ] Import pericopes to Supabase database
- [ ] Verify import with check script
- [ ] Test in application UI

## Structure by Five Books

The Psalms are organized according to the canonical Five-Book division, which provides the macro-structure for memorization:

### Book 1: The Human Conflict (Psalms 1-41)
**Theme:** Individual lament and the Great Controversy at the personal level
- **Chapters:** 41 psalms
- **Pericopes:** 52 units
- **Key Psalms:**
  - Psalm 1: "Blessed Is the Man" (Two Ways)
  - Psalm 2: "Why Do the Nations Rage?" (The Lord's Anointed)
  - Psalm 8: "How Majestic Is Your Name"
  - Psalm 22: "My God, My God, Why Have You Forsaken Me?" (Messianic)
  - Psalm 23: "The Lord Is My Shepherd" ⭐ Most famous

### Book 2: The National Deliverance (Psalms 42-72)
**Theme:** Communal lament, the Sanctuary, and hope in the Messianic King
- **Chapters:** 31 psalms (42-72)
- **Pericopes:** 38 units
- **Key Psalms:**
  - Psalm 42: "As a Deer Pants for Flowing Streams"
  - Psalm 46: "God Is Our Refuge and Strength"
  - Psalm 51: "Have Mercy on Me, O God" (David's confession)
  - Psalm 72: Prayer for the King's righteous reign

### Book 3: The Sanctuary Crisis (Psalms 73-89)
**Theme:** The dark night - Sanctuary destruction and covenant crisis
- **Chapters:** 17 psalms (73-89)
- **Pericopes:** 22 units
- **Key Psalms:**
  - Psalm 73: "The Prosperity of the Wicked" / "In the Sanctuary of God"
  - Psalm 84: "How Lovely Is Your Dwelling Place"
  - Psalm 88: Darkest psalm - "O Lord, God of My Salvation"
  - Psalm 89: The covenant broken?

### Book 4: The Sovereign King (Psalms 90-106)
**Theme:** Divine sovereignty - "The LORD reigns"
- **Chapters:** 17 psalms (90-106)
- **Pericopes:** 19 units
- **Key Psalms:**
  - Psalm 90: "Lord, You Have Been Our Dwelling Place" (Prayer of Moses)
  - Psalm 91: "He Who Dwells in the Shelter of the Most High"
  - Psalms 93, 96-99: "The Lord Reigns" (Divine Kingship)
  - Psalm 100: "Make a Joyful Noise to the Lord"
  - Psalm 103: "Bless the Lord, O My Soul"

### Book 5: The Hallelujah Chorus (Psalms 107-150)
**Theme:** Universal praise - the resolution from lament to hallelujah
- **Chapters:** 44 psalms (107-150)
- **Pericopes:** 76 units
- **Key Psalms:**
  - Psalm 110: "Sit at My Right Hand" (Messianic)
  - Psalm 119: "Your Word Is a Lamp to My Feet" (22 sections, longest psalm)
  - Psalms 120-134: "Songs of Ascent"
  - Psalm 139: "You Have Searched Me and Known Me"
  - Psalms 146-150: Final Hallelujah collection

## Special Features

### Psalm 119 - The Acrostic Masterpiece
The longest psalm is divided into 22 sections, one for each letter of the Hebrew alphabet:

1. **Aleph** (v1-8): "Blessed Are the Blameless"
2. **Beth** (v9-16): "How Can a Young Man Keep His Way Pure?"
3. **Gimel** (v17-24): "Open My Eyes"
4. **Daleth** (v25-32): "My Soul Clings to the Dust"
5. **He** (v33-40): "Teach Me, O Lord"
6. **Waw** (v41-48): "Let Your Steadfast Love Come to Me"
7. **Zayin** (v49-56): "Remember Your Word to Your Servant"
8. **Heth** (v57-64): "The Lord Is My Portion"
9. **Teth** (v65-72): "You Have Dealt Well with Your Servant"
10. **Yodh** (v73-80): "Your Hands Have Made Me"
11. **Kaph** (v81-88): "My Soul Longs for Your Salvation"
12. **Lamedh** (v89-96): "Forever, O Lord, Your Word"
13. **Mem** (v97-104): "Oh How I Love Your Law!"
14. **Nun** (v105-112): "Your Word Is a Lamp to My Feet" ⭐
15. **Samekh** (v113-120): "I Hate the Double-Minded"
16. **Ayin** (v121-128): "I Am Your Servant"
17. **Pe** (v129-136): "Your Testimonies Are Wonderful"
18. **Tsadhe** (v137-144): "Righteous Are You, O Lord"
19. **Qoph** (v145-152): "With My Whole Heart I Cry"
20. **Resh** (v153-160): "Look on My Affliction"
21. **Sin** (v161-168): "Princes Persecute Me Without Cause"
22. **Taw** (v169-176): "I Have Gone Astray Like a Lost Sheep"

### Pericope Categories

Psalms are organized by genre to aid memorization:

- **Individual Laments**: Personal cries for help (Ps 3, 5, 6, 13, 22, etc.)
- **Communal Laments**: National prayers (Ps 44, 74, 80)
- **Thanksgiving**: Gratitude for deliverance (Ps 30, 32, 34, 116)
- **Praise/Hymns**: Worship and adoration (Ps 8, 19, 33, 100, 103, 145-150)
- **Royal Psalms**: Messianic/Kingship themes (Ps 2, 45, 72, 110)
- **Wisdom**: Teaching and instruction (Ps 1, 37, 49, 73, 127)
- **Trust/Confidence**: Assurance in God (Ps 23, 27, 46, 62, 91, 121)
- **Penitential**: Confession and repentance (Ps 6, 32, 38, 51, 130, 143)

## Files Generated

### Data Files (150 total)
Located in `src/data/`:
- `psalm1.ts` through `psalm150.ts`
- Each contains pericope definitions with:
  - Unique ID
  - Reference (subtitle + verse range)
  - Memorable name
  - Placeholder for abbreviated text (generated dynamically)

### Scripts

#### Generation Script
**File:** `scripts/generate_psalms_data.js`
- Generates all 150 Psalm TypeScript files
- Creates 207 pericopes with proper naming
- Handles special cases (Psalm 119's 22 sections)
- Escapes apostrophes for SQL safety

**Usage:**
```bash
node scripts/generate_psalms_data.js
```

#### Import Script
**File:** `scripts/import_pericopes.js` (updated)
- Added 'psalm': 'Psalms' to BOOK_MAP
- Imports all pericopes to Supabase database
- Handles upserts to prevent duplicates

**Usage:**
```bash
node scripts/import_pericopes.js
```

#### Verification Script
**File:** `scripts/check_psalms_pericopes.js`
- Verifies all 150 psalms imported correctly
- Checks coverage by Five Books
- Validates famous psalms (Ps 1, 23, 51, 91, 119, 150)
- Confirms Psalm 119 has all 22 sections

**Usage:**
```bash
node scripts/check_psalms_pericopes.js
```

## Database Schema

Pericopes are stored in the `bible_pericopes` table with these fields:

```sql
- book_id: UUID (references bible_books)
- chapter: INTEGER
- verse_start: INTEGER
- verse_end: INTEGER
- name: TEXT (memorable pericope name)
- subtitle: TEXT (thematic category)
- display_order: INTEGER (ordering within chapter)
```

## Next Steps

### Immediate (requires network connectivity)
1. Run `npm install` to install dependencies
2. Run `node scripts/import_pericopes.js` to import to database
3. Run `node scripts/check_psalms_pericopes.js` to verify import
4. Test in application UI

### Future Enhancements
- Add abbreviated text for each verse (algorithmically generated)
- Implement Memory Palace visualization (Sanctuary journey)
- Create gamification for the Five-Book structure
- Add audio recitation support
- Build progress tracking for each book

## Theological Framework

The PsMP Framework is based on the understanding that the Psalter is not a random collection but a carefully arranged anthology that tells a theological story:

1. **Book 1-3**: The problem (human conflict, national crisis, sanctuary destroyed)
2. **Book 4**: The answer (God's eternal sovereignty)
3. **Book 5**: The resolution (from lament to universal praise)

This journey from personal/communal lament to the final "Hallelujah" mirrors the Great Controversy theme - the long-standing cosmic conflict that resolves when all creation praises God.

## Memory Palace Technique

For optimal memorization using the Method of Loci:

**Location 1 (Outer Court - Altar):** Book 1 (The Human Conflict)
- Visualize personal sin/lament at the Burnt Offering altar

**Location 2 (Laver):** Book 2 (National Deliverance)
- Visualize communal cleansing and redemption

**Location 3 (Holy Place):** Book 3 (Sanctuary Crisis)
- Visualize darkness, with only sacred lampstand light

**Location 4 (Holy of Holies - Ark):** Book 4 (Sovereign King)
- Visualize God reigning above the Mercy Seat

**Location 5 (Heavens Above):** Book 5 (Hallelujah Chorus)
- Visualize praise bursting from temple to fill the heavens

## Statistics

- **Total chapters:** 150
- **Total pericopes:** 207
- **Average per chapter:** 1.38 pericopes
- **Largest psalm:** Psalm 119 (176 verses, 22 pericopes)
- **Smallest psalm:** Psalm 117 (2 verses, 1 pericope)
- **Most divided psalms:**
  - Psalm 119: 22 pericopes
  - Psalm 78: 4 pericopes
  - Psalms 18, 22, 31, 68, 69, 89, 104, 105, 106, 107: 3 pericopes each

## References

This framework implements the PsMP (Psalms Mnemonic Pericope) approach as outlined in the project documentation, optimized for complete memorization of the Psalter through thematic chunking and the Five-Book macro-structure.

---

**Last Updated:** 2025-11-09
**Implementation:** Complete
**Database Import:** Pending network connectivity
