# BATCH GENERATION PROMPTS

Copy and paste each prompt into Claude Code to generate pericopes for that entire batch at once.

---

# BATCH 1: REMAINING MINOR PROPHETS

```
GENERATE PERICOPES - BATCH 1: REMAINING MINOR PROPHETS

Books to create pericopes for (in order):
1. Nahum (3 chapters)
2. Habakkuk (3 chapters)
3. Zephaniah (3 chapters)
4. Haggai (2 chapters)
5. Zechariah (14 chapters)
6. Malachi (4 chapters)

Total: 6 books, 29 chapters
Target: ~36-48 pericopes across all books (aiming for 7-9 verses per pericope average)

HARD CONSTRAINTS (APPLY TO ALL BOOKS):
1. **Verse Density:** Target 6-12 verses per pericope. This is a range, not a cutoff.
   - If two pericopes belong together thematically, combine them even if result is 13-14 verses
   - Don't split coherent narratives artificially to hit a number
   - Consolidate short passages intelligently

2. **Title Philosophy:** MAX 8 WORDS per pericope name
   - GOOD examples: "The Roaring Lion", "Justice Rolls Down", "The Dry Bones Live"
   - BAD examples: "The LORD Hurled a Great Wind upon the Sea" (too long, too descriptive)
   - Titles should be evocative (capture essence) not descriptive (summarize content)
   - Use vivid verbs and memorable phrases

3. **Structure:** Follow the book's natural narrative/theological flow
   - Respect the author's intent and breakpoints
   - Don't force artificial divisions
   - Keep related prophecies/oracles together

4. **Format:** Use Hosea-style TypeScript format:
   ```typescript
   export const [bookchapter]: ChapterData = {
     book: "[Book Name]",
     chapter: [number],
     pericopes: [
       {
         id: [1, 2, 3...],
         verses: [array of verse numbers],
         name: 'Pericope Title (max 8 words)'
       }
     ]
   };
   ```

APPROACH:
1. Read through each entire book first to understand structure
2. Identify natural theological/narrative breakpoints
3. Group verses into coherent units (6-12 verses, prioritizing coherence over exact numbers)
4. Write memorable 8-word-max titles for each pericope
5. Generate all TypeScript files in src/data/ directory
6. Create verification script showing chapter-by-chapter breakdown with pericope counts

DELIVERABLES:
- Nahum TypeScript files (src/data/nahum1.ts, nahum2.ts, nahum3.ts)
- Habakkuk TypeScript files (src/data/habakkuk1.ts, habakkuk2.ts, habakkuk3.ts)
- Zephaniah TypeScript files (src/data/zephaniah1.ts, zephaniah2.ts, zephaniah3.ts)
- Haggai TypeScript files (src/data/haggai1.ts, haggai2.ts)
- Zechariah TypeScript files (src/data/zechariah1.ts through zechariah14.ts)
- Malachi TypeScript files (src/data/malachi1.ts through malachi4.ts)
- Verification script: check_minor_prophets_batch1.js (reports total pericopes and verse density)
- Summary report at end showing: "Batch 1 Complete: X pericopes across 29 chapters, Y verses/pericope average"

START WITH NAHUM IMMEDIATELY. Finish all 6 books before reporting.
```

---

# BATCH 2: THE FOUR GOSPELS

```
GENERATE PERICOPES - BATCH 2: THE FOUR GOSPELS

Books to create pericopes for (in order):
1. Matthew (28 chapters)
2. Mark (16 chapters)
3. Luke (24 chapters)
4. John (21 chapters)

Total: 4 books, 89 chapters
Target: ~111-135 pericopes across all books (aiming for 7-9 verses per pericope average)

HARD CONSTRAINTS (APPLY TO ALL BOOKS):
1. **Verse Density:** Target 6-12 verses per pericope. This is a range, not a cutoff.
   - If two pericopes belong together thematically, combine them even if result is 13-14 verses
   - Don't split coherent narratives artificially to hit a number
   - Consolidate short passages intelligently

2. **Title Philosophy:** MAX 8 WORDS per pericope name
   - GOOD examples: "The Call of the Disciples", "Feeding the Five Thousand", "The Sermon on the Mount"
   - BAD examples: "Jesus Went Up on the Mountain and Sat Down with His Disciples to Teach Them" (too long)
   - Titles should be evocative (capture essence) not descriptive (summarize content)
   - Use vivid action words and memorable phrases

3. **Gospel-Specific Approach:**
   - Matthew: Organize around 5 major sections (Sermon on Mount, parables, passion, resurrection, etc.)
   - Mark: Follow fast-paced narrative flow; Jesus' authority and passion
   - Luke: Emphasize Jesus' compassion; include unique parables
   - John: Organize around theological discourse + signs; more contemplative

4. **Format:** Use Hosea-style TypeScript format:
   ```typescript
   export const [bookchapter]: ChapterData = {
     book: "[Book Name]",
     chapter: [number],
     pericopes: [
       {
         id: [1, 2, 3...],
         verses: [array of verse numbers],
         name: 'Pericope Title (max 8 words)'
       }
     ]
   };
   ```

APPROACH:
1. Read through each entire Gospel first to understand structure and unique perspective
2. Identify natural narrative/theological breakpoints
3. Group verses into coherent units (6-12 verses, prioritizing Gospel flow and narrative coherence)
4. Write memorable 8-word-max titles for each pericope
5. Generate all TypeScript files in src/data/ directory
6. Create verification script showing chapter-by-chapter breakdown with pericope counts

DELIVERABLES:
- Matthew TypeScript files (src/data/matthew1.ts through matthew28.ts)
- Mark TypeScript files (src/data/mark1.ts through mark16.ts)
- Luke TypeScript files (src/data/luke1.ts through luke24.ts)
- John TypeScript files (src/data/john1.ts through john21.ts)
- Verification script: check_gospels_batch2.js (reports total pericopes and verse density per Gospel)
- Summary report at end showing: "Batch 2 Complete: X pericopes across 89 chapters, Y verses/pericope average"

START WITH MATTHEW IMMEDIATELY. Finish all 4 Gospels before reporting.
```

---

# BATCH 3: PAULINE EPISTLES

```
GENERATE PERICOPES - BATCH 3: PAULINE EPISTLES

Books to create pericopes for (in order):
1. Romans (16 chapters)
2. 1 Corinthians (16 chapters)
3. 2 Corinthians (13 chapters)
4. Galatians (6 chapters)
5. Ephesians (6 chapters)
6. Philippians (4 chapters)
7. Colossians (4 chapters)
8. 1 Thessalonians (5 chapters)
9. 2 Thessalonians (3 chapters)
10. 1 Timothy (6 chapters)
11. 2 Timothy (4 chapters)
12. Titus (3 chapters)
13. Philemon (1 chapter)

Total: 13 books, 84 chapters
Target: ~103-129 pericopes across all books (aiming for 7-9 verses per pericope average)

HARD CONSTRAINTS (APPLY TO ALL BOOKS):
1. **Verse Density:** Target 6-12 verses per pericope. This is a range, not a cutoff.
   - If two pericopes belong together thematically, combine them even if result is 13-14 verses
   - Don't split coherent arguments artificially to hit a number
   - Consolidate related theological points intelligently

2. **Title Philosophy:** MAX 8 WORDS per pericope name
   - GOOD examples: "Justification by Faith Alone", "Love Never Fails", "Run the Race with Endurance"
   - BAD examples: "Paul Explains That We Are Justified by Faith in Jesus Christ Rather Than by Works of the Law" (too long)
   - Titles should be evocative (capture essence of Paul's argument) not descriptive (summarize content)
   - Use powerful theological language

3. **Epistle-Specific Approach:**
   - Group logically related arguments together (don't split a theological point across two pericopes)
   - Follow Paul's rhetorical flow in each letter
   - Keep exhortations with their theological basis

4. **Format:** Use Hosea-style TypeScript format:
   ```typescript
   export const [bookchapter]: ChapterData = {
     book: "[Book Name]",
     chapter: [number],
     pericopes: [
       {
         id: [1, 2, 3...],
         verses: [array of verse numbers],
         name: 'Pericope Title (max 8 words)'
       }
     ]
   };
   ```

APPROACH:
1. Read through each entire epistle first to understand Paul's argument
2. Identify natural theological/rhetorical breakpoints
3. Group verses into coherent units (6-12 verses, prioritizing logical flow of argument)
4. Write memorable 8-word-max titles for each pericope
5. Generate all TypeScript files in src/data/ directory
6. Create verification script showing chapter-by-chapter breakdown with pericope counts

DELIVERABLES:
- Romans through Philemon TypeScript files in src/data/ directory
- Verification script: check_pauline_epistles_batch3.js (reports total pericopes and verse density per epistle)
- Summary report at end showing: "Batch 3 Complete: X pericopes across 84 chapters, Y verses/pericope average"

START WITH ROMANS IMMEDIATELY. Finish all 13 Pauline epistles before reporting.
```

---

# BATCH 4: OTHER EPISTLES (NON-PAULINE)

```
GENERATE PERICOPES - BATCH 4: OTHER EPISTLES (NON-PAULINE)

Books to create pericopes for (in order):
1. Hebrews (13 chapters)
2. James (5 chapters)
3. 1 Peter (5 chapters)
4. 2 Peter (3 chapters)
5. 1 John (5 chapters)
6. 2 John (1 chapter)
7. 3 John (1 chapter)
8. Jude (1 chapter)

Total: 8 books, 29 chapters
Target: ~43-53 pericopes across all books (aiming for 7-9 verses per pericope average)

HARD CONSTRAINTS (APPLY TO ALL BOOKS):
1. **Verse Density:** Target 6-12 verses per pericope. This is a range, not a cutoff.
   - If two pericopes belong together thematically, combine them even if result is 13-14 verses
   - Don't split coherent theological points artificially to hit a number
   - Consolidate related ideas intelligently

2. **Title Philosophy:** MAX 8 WORDS per pericope name
   - GOOD examples: "Better Covenant, Better Mediator", "Faith Without Works Is Dead", "Walking in the Light"
   - BAD examples: "The Author Explains That Jesus Is Better Than the Angels and That We Should Pay Attention to His Message" (too long)
   - Titles should be evocative (capture essence) not descriptive (summarize content)
   - Use clear, memorable phrases

3. **Format:** Use Hosea-style TypeScript format:
   ```typescript
   export const [bookchapter]: ChapterData = {
     book: "[Book Name]",
     chapter: [number],
     pericopes: [
       {
         id: [1, 2, 3...],
         verses: [array of verse numbers],
         name: 'Pericope Title (max 8 words)'
       }
     ]
   };
   ```

APPROACH:
1. Read through each entire epistle first to understand author's main themes
2. Identify natural theological/rhetorical breakpoints
3. Group verses into coherent units (6-12 verses, prioritizing thematic coherence)
4. Write memorable 8-word-max titles for each pericope
5. Generate all TypeScript files in src/data/ directory
6. Create verification script showing chapter-by-chapter breakdown with pericope counts

DELIVERABLES:
- Hebrews through Jude TypeScript files in src/data/ directory
- Verification script: check_other_epistles_batch4.js (reports total pericopes and verse density per epistle)
- Summary report at end showing: "Batch 4 Complete: X pericopes across 29 chapters, Y verses/pericope average"

START WITH HEBREWS IMMEDIATELY. Finish all 8 epistles before reporting.
```

---

# BATCH 5: HISTORICAL BOOKS (OLD TESTAMENT)

```
GENERATE PERICOPES - BATCH 5: HISTORICAL BOOKS (OLD TESTAMENT)

Books to create pericopes for (in order):
1. Ruth (4 chapters)
2. 1 Samuel (31 chapters)
3. 2 Samuel (24 chapters)
4. 1 Kings (22 chapters)
5. 2 Kings (25 chapters)
6. 1 Chronicles (29 chapters)
7. 2 Chronicles (36 chapters)
8. Ezra (10 chapters)
9. Nehemiah (13 chapters)
10. Esther (10 chapters)

Total: 10 books, 155 chapters
Target: ~176-213 pericopes across all books (aiming for 7-9 verses per pericope average)

HARD CONSTRAINTS (APPLY TO ALL BOOKS):
1. **Verse Density:** Target 6-12 verses per pericope. This is a range, not a cutoff.
   - If scenes/events belong together narratively, combine them even if result is 13-14 verses
   - Don't split coherent story arcs artificially to hit a number
   - Consolidate related historical events intelligently

2. **Title Philosophy:** MAX 8 WORDS per pericope name
   - GOOD examples: "David Anointed as King", "The Temple Is Completed", "The Walls Are Rebuilt"
   - BAD examples: "And Then Samuel Took the Horn of Oil and Anointed David in the Midst of His Brothers and the Spirit of the LORD Came upon David from That Day Forward" (too long)
   - Titles should be evocative (capture the story's essence) not descriptive (summarize every detail)
   - Use active, memorable language

3. **Narrative Structure:** These are history/narrative books
   - Follow the chronological and story-based flow
   - Keep related events together (e.g., David's rise, reign, decline as one narrative arc if appropriate)
   - Don't break up pivotal moments

4. **Format:** Use Hosea-style TypeScript format:
   ```typescript
   export const [bookchapter]: ChapterData = {
     book: "[Book Name]",
     chapter: [number],
     pericopes: [
       {
         id: [1, 2, 3...],
         verses: [array of verse numbers],
         name: 'Pericope Title (max 8 words)'
       }
     ]
   };
   ```

APPROACH:
1. Read through each entire book first to understand the historical narrative
2. Identify natural story arcs and key events
3. Group verses into coherent narrative units (6-12 verses, prioritizing story coherence)
4. Write memorable 8-word-max titles for each pericope
5. Generate all TypeScript files in src/data/ directory
6. Create verification script showing chapter-by-chapter breakdown with pericope counts

DELIVERABLES:
- Ruth through Esther TypeScript files in src/data/ directory
- Verification script: check_historical_books_batch5.js (reports total pericopes and verse density per book)
- Summary report at end showing: "Batch 5 Complete: X pericopes across 155 chapters, Y verses/pericope average"

START WITH RUTH IMMEDIATELY. Finish all 10 historical books before reporting.
```

---

# BATCH 6: WISDOM & POETRY BOOKS

```
GENERATE PERICOPES - BATCH 6: WISDOM & POETRY BOOKS

Books to create pericopes for (in order):
1. Job (42 chapters)
2. Psalms (150 chapters)
3. Proverbs (31 chapters)
4. Ecclesiastes (12 chapters)
5. Song of Solomon (8 chapters)

Total: 5 books, 236 chapters
Target: ~142-171 pericopes across all books (aiming for 7-9 verses per pericope average)

HARD CONSTRAINTS (APPLY TO ALL BOOKS):
1. **Verse Density:** Target 6-12 verses per pericope. This is a range, not a cutoff.
   - If poetic units/thoughts belong together, combine them even if result is 13-14 verses
   - For Psalms: Group related stanzas (don't break up a single Psalm artificially)
   - For Proverbs: Group thematically related sayings
   - Consolidate wisely based on poetic/thematic coherence

2. **Title Philosophy:** MAX 8 WORDS per pericope name
   - GOOD examples: "Though He Slay Me, I Trust", "The LORD Is My Shepherd", "Fear the LORD and Keep His Commandments"
   - BAD examples: "In This Extended Soliloquy Job Ponders the Deep Questions of Why the Righteous Suffer While the Wicked Prosper and Contemplates God's Justice" (way too long)
   - Titles should evoke the central thought/emotion, not summarize all content
   - Use poetic, memorable language

3. **Book-Specific Approach:**
   - **Job:** Group speeches thematically (Job's initial lament, friends' speeches, Job's responses, Elihu's speech, God's response)
   - **Psalms:** Each psalm (or related psalms 1-2 verses if very short) becomes its own unit; don't split individual psalms
   - **Proverbs:** Group by topic/theme rather than breaking up thematic collections
   - **Ecclesiastes:** Follow Qohelet's theological journey; keep related reflections together
   - **Song of Solomon:** Group by speaker/scene; maintain poetic flow

4. **Format:** Use Hosea-style TypeScript format:
   ```typescript
   export const [bookchapter]: ChapterData = {
     book: "[Book Name]",
     chapter: [number],
     pericopes: [
       {
         id: [1, 2, 3...],
         verses: [array of verse numbers],
         name: 'Pericope Title (max 8 words)'
       }
     ]
   };
   ```

APPROACH:
1. Read through each entire book first to understand structure and major themes
2. For poetry: Identify natural poetic/stanzaic units
3. For wisdom: Identify thematic clusters
4. Group verses into coherent units (6-12 verses, prioritizing poetic/thematic coherence)
5. Write memorable 8-word-max titles for each pericope
6. Generate all TypeScript files in src/data/ directory
7. Create verification script showing chapter-by-chapter breakdown with pericope counts

DELIVERABLES:
- Job through Song of Solomon TypeScript files in src/data/ directory
- Verification script: check_wisdom_poetry_batch6.js (reports total pericopes and verse density per book)
- Summary report at end showing: "Batch 6 Complete: X pericopes across 236 chapters, Y verses/pericope average"

START WITH JOB IMMEDIATELY. Finish all 5 wisdom & poetry books before reporting.
```

---

# BATCH 7: MAJOR PROPHETS

```
GENERATE PERICOPES - BATCH 7: MAJOR PROPHETS

Books to create pericopes for (in order):
1. Isaiah (66 chapters)
2. Jeremiah (52 chapters)

Total: 2 books, 118 chapters
Target: ~108-130 pericopes across both books (aiming for 7-9 verses per pericope average)

HARD CONSTRAINTS (APPLY TO ALL BOOKS):
1. **Verse Density:** Target 6-12 verses per pericope. This is a range, not a cutoff.
   - If prophecies/oracles belong together thematically, combine them even if result is 13-14 verses
   - Don't split coherent prophetic messages artificially to hit a number
   - Consolidate related judgment/restoration prophecies intelligently

2. **Title Philosophy:** MAX 8 WORDS per pericope name
   - GOOD examples: "The Vision of Isaiah", "Judgment and Restoration", "Seek the LORD While He May Be Found"
   - BAD examples: "Isaiah Records His Vision of the Holy God Sitting on a Throne Being Worshipped by Seraphim Who Call Out Holy Holy Holy" (way too long)
   - Titles should capture the prophetic essence, not summarize every detail
   - Use vivid, powerful language

3. **Prophet-Specific Approach:**
   - **Isaiah:** Organize around major sections (Ch 1-12 judgment/restoration, 13-23 foreign nations, 24-27 apocalyptic, 28-35 woe/salvation, 36-39 historical, 40-55 restoration hope, 56-66 future glory)
   - **Jeremiah:** Organize around major themes (oracles against Judah, oracles against nations, biographical sections, oracles of restoration)
   - Both: Keep related prophecies grouped; don't break prophetic messages artificially

4. **Format:** Use Hosea-style TypeScript format:
   ```typescript
   export const [bookchapter]: ChapterData = {
     book: "[Book Name]",
     chapter: [number],
     pericopes: [
       {
         id: [1, 2, 3...],
         verses: [array of verse numbers],
         name: 'Pericope Title (max 8 words)'
       }
     ]
   };
   ```

APPROACH:
1. Read through each entire prophetic book first to understand major themes and structure
2. Identify natural prophetic breakpoints (new oracle, shift in theme, change of tone)
3. Group verses into coherent prophetic units (6-12 verses, prioritizing thematic coherence)
4. Write memorable 8-word-max titles for each pericope
5. Generate all TypeScript files in src/data/ directory
6. Create verification script showing chapter-by-chapter breakdown with pericope counts

DELIVERABLES:
- Isaiah TypeScript files (src/data/isaiah1.ts through isaiah66.ts)
- Jeremiah TypeScript files (src/data/jeremiah1.ts through jeremiah52.ts)
- Verification script: check_major_prophets_batch7.js (reports total pericopes and verse density per prophet)
- Summary report at end showing: "Batch 7 Complete: X pericopes across 118 chapters, Y verses/pericope average"

START WITH ISAIAH IMMEDIATELY. Finish both major prophets before reporting.
```

---

# BATCH 8: ACTS & REVELATION

```
GENERATE PERICOPES - BATCH 8: ACTS & REVELATION

Books to create pericopes for (in order):
1. Acts (28 chapters)
2. Revelation (22 chapters)

Total: 2 books, 50 chapters
Target: ~57-68 pericopes across both books (aiming for 7-9 verses per pericope average)

HARD CONSTRAINTS (APPLY TO ALL BOOKS):
1. **Verse Density:** Target 6-12 verses per pericope. This is a range, not a cutoff.
   - If narrative events/scenes belong together, combine them even if result is 13-14 verses
   - Don't split coherent story arcs artificially to hit a number
   - Consolidate related visions/events intelligently

2. **Title Philosophy:** MAX 8 WORDS per pericope name
   - GOOD examples: "Pentecost and the Gift of the Holy Spirit", "The Vision of the Throne", "The Lamb's Triumph"
   - BAD examples: "And Then Peter and John Went Up to the Temple at the Hour of Prayer and a Beggar Who Was Lame from Birth Asked Them for Alms" (too long)
   - Titles should capture narrative/prophetic essence, not summarize every detail
   - Use vivid, memorable language

3. **Book-Specific Approach:**
   - **Acts:** Follow narrative flow (Pentecost, Jerusalem witness, Samaria, Gentile expansion, Paul's missionary journeys). Keep coherent events together.
   - **Revelation:** Organize around major visions/sections (throne room, seals, trumpets, bowls, final vision). Keep prophetic sequences together.

4. **Format:** Use Hosea-style TypeScript format:
   ```typescript
   export const [bookchapter]: ChapterData = {
     book: "[Book Name]",
     chapter: [number],
     pericopes: [
       {
         id: [1, 2, 3...],
         verses: [array of verse numbers],
         name: 'Pericope Title (max 8 words)'
       }
     ]
   };
   ```

APPROACH:
1. Read through each entire book first to understand structure
2. For Acts: Identify major narrative events and turning points
3. For Revelation: Identify major visions and prophetic sections
4. Group verses into coherent units (6-12 verses, prioritizing narrative/prophetic coherence)
5. Write memorable 8-word-max titles for each pericope
6. Generate all TypeScript files in src/data/ directory
7. Create verification script showing chapter-by-chapter breakdown with pericope counts

DELIVERABLES:
- Acts TypeScript files (src/data/acts1.ts through acts28.ts)
- Revelation TypeScript files (src/data/revelation1.ts through revelation22.ts)
- Verification script: check_acts_revelation_batch8.js (reports total pericopes and verse density per book)
- Summary report at end showing: "Batch 8 Complete: X pericopes across 50 chapters, Y verses/pericope average"

START WITH ACTS IMMEDIATELY. Finish both books before reporting.
```

---

## HOW TO USE THESE PROMPTS

1. Copy the prompt for whichever batch you want to generate
2. Paste it into Claude (or whichever AI you're using)
3. The AI will generate all books in that batch
4. When complete, the AI will have created:
   - All TypeScript files for that batch
   - A verification script
   - A summary report with pericope counts
5. Download the files, add them to your project, and commit to git

Each prompt is self-contained and doesn't reference others, so you can do batches in any order.

