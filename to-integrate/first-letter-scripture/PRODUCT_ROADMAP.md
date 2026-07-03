# First Letter Scripture - Product Roadmap

**Last Updated:** 2025-11-13
**Status:** Active Development

---

## Vision

Transform Bible memorization from isolated chapter/verse tracking into a unified, flexible system that supports:
- Intelligent pericope divisions optimized for memorization
- Seamless filtering and tagging across all content types
- Custom quote collections mixed with Scripture passages
- Curated collections (Roman Road, 3:16s, etc.) as learning pathways
- Single interface for all memorization activities

---

## Phase 1: Unified Content Page (Current Priority)

### Consolidate Verse & Chapter into Single Page

**Goal:** Replace separate chapter view and verse selection with one intelligent interface

**Features:**
- [ ] Single page displays all content (chapters, verses, pericopes, quotes)
- [ ] Dynamic filtering by:
  - Book
  - Chapter
  - Pericope
  - Content type (Scripture verse, custom quote, collection)
  - Tags (user-defined)
  - Theme (theological, devotional, memorization difficulty)
- [ ] Tag system:
  - Auto-tagging based on pericope theme
  - User-created custom tags
  - Tag-based collections
- [ ] Sort options:
  - Book order (canonical)
  - Difficulty (verse count, unfamiliarity)
  - Personal progress (not started, learning, mastering)
  - Custom order (drag-and-drop)

**Technical:**
- Single unified data query (verses + pericopes + quotes)
- Client-side filtering/sorting for responsiveness
- Saved filter/sort preferences per user

---

## Phase 2: Freeform Quotes Integration

### Add Custom Quotes to Memorization System

**Goal:** Allow users to memorize any quote (Scripture paraphrase, poetry, personal affirmations) alongside official Scripture

**Features:**
- [ ] Quote creation interface:
  - Text input (paste any quote)
  - Attribution/source field
  - Optional Scripture reference (if Bible-related)
  - Tags and difficulty rating
- [ ] Quote storage in database:
  - `user_quotes` table with user ownership
  - Linked to `user_collections` for grouping
  - Full text search capability
- [ ] Quote memorization:
  - Same testing modes as Scripture verses
  - Same progress tracking and spaced repetition
  - Same first-letter abbreviation generation
- [ ] Quote discovery:
  - Community quotes (publicly shared)
  - Popular quotes with favorites count
  - Search and browse functionality

**Database Schema:**
```sql
CREATE TABLE user_quotes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  text TEXT NOT NULL,
  source TEXT,
  scripture_reference TEXT,
  difficulty INTEGER (1-5),
  created_at TIMESTAMPTZ,
  is_public BOOLEAN DEFAULT false,
  favorite_count INTEGER DEFAULT 0
);

CREATE TABLE user_quote_tags (
  id UUID PRIMARY KEY,
  quote_id UUID REFERENCES user_quotes,
  tag TEXT,
  UNIQUE(quote_id, tag)
);
```

---

## Phase 3: Pericope Redesign

### Improve Pericope Quality & Flexibility

**Goal:** Enhance current auto-generated pericopes with better titles, contextual metadata, and refinement tools

**Current State:**
- 1,189 auto-generated pericopes across 66 books
- Titles derived from first verse (functional but plain)
- Verse counts vary (4-230 verses)

**Improvements:**
- [ ] Title refinement:
  - AI-generated thematic titles (instead of first-verse text)
  - Manually curated titles for key passages
  - Title suggestions based on theological importance
- [ ] Metadata enrichment:
  - `lore` field: Historical/cultural context for each pericope
  - `theme` field: Theological theme categorization
  - `difficulty`: Memorization difficulty (1-5)
  - `spiritual_significance`: Indicator for devotional importance
- [ ] Pericope splitting/merging tools:
  - Manual override of auto-generated boundaries
  - Split overly long units (>15 verses)
  - Merge fragmented units (<4 verses)
  - Preserve theological integrity
- [ ] Pericope version history:
  - Track changes to boundaries
  - Allow user feedback on pericope quality
  - Community voting on improvements

**Priority Books for Manual Refinement:**
1. Gospels (Matthew, Mark, Luke, John) - Most memorized
2. Psalms - Highly variable verse counts
3. Pentateuch (Genesis, Exodus, Leviticus, Numbers, Deuteronomy)
4. Paul's epistles - Dense theological content

---

## Phase 4: Curated Collections

### Suggested Learning Pathways

**Goal:** Provide pre-built collections of important Scripture passages as learning programs

**Flagship Collections:**

#### 1. The Roman Road (6 passages)
- Romans 3:23 - All have sinned
- Romans 6:23 - Wages of sin is death
- Romans 5:8 - God demonstrates His love
- Romans 10:9 - Confess and believe
- Romans 10:13 - Everyone who calls on name of Lord
- Romans 12:1-2 - Present your body as living sacrifice

**Features:**
- Sequential learning order (progression matters)
- Context verses for each passage
- Thematic connections highlighted
- Completion badge: "Roman Road Master"
- Estimated time to completion: 2-3 weeks

#### 2. The Great 3:16s (10+ passages)
- John 3:16 - Most famous verse
- Genesis 3:15 - First promise of Christ
- Exodus 3:16 - God remembers
- Deuteronomy 3:16 - Territorial promise
- 1 Samuel 3:16 - Samuel's call
- 2 Kings 3:16 - Filling valleys with water
- Proverbs 3:16 - Wisdom's blessings
- Isaiah 3:16 - Pride of daughters of Zion
- Jeremiah 3:16 - Ark replaced by God's presence
- Galatians 3:16 - Promise to Abraham
- And more...

**Features:**
- Browse by book
- Thematic commentary on "3:16" pattern
- Interconnected network of passages
- Badge: "3:16 Collection Master"

#### 3. The Armor of God (Ephesians 6:10-18)
- 7 pieces explained with supporting verses
- Sequential pericope-based learning
- Practical daily application focus

#### 4. The Beatitudes (Matthew 5:3-12)
- 8 beatitudes as 8 learning units
- Cultural context for each
- Living application quotes alongside Scripture

#### 5. The Fruit of the Spirit (Galatians 5:22-23)
- 9 fruits as individual learning paths
- Supporting verses for each trait
- Personal reflection prompts

**General Collection Features:**
- [ ] Collection builder UI (for admins/community)
- [ ] Progress tracking per collection
- [ ] Completion certificates/badges
- [ ] Sharing collections with friends
- [ ] Forking/remixing community collections
- [ ] Difficulty ratings for collections
- [ ] Estimated time to completion
- [ ] Community rating/feedback

**Database Schema:**
```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users,
  is_curated BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  difficulty_level INTEGER (1-5),
  estimated_hours DECIMAL,
  created_at TIMESTAMPTZ
);

CREATE TABLE collection_items (
  id UUID PRIMARY KEY,
  collection_id UUID REFERENCES collections,
  item_type TEXT ('verse', 'pericope', 'quote'),
  item_id UUID,
  sequence_number INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ
);
```

---

## Phase 5: Advanced Features (Future)

### Heat Map & Gamification
- [ ] Daily activity heat map (contribution graph)
- [ ] XP/points system
- [ ] Badge achievements
- [ ] Leaderboards (optional)
- [ ] Streak tracking

### Analytics & Insights
- [ ] Personal memorization statistics
- [ ] Most difficult passages
- [ ] Fastest memorized verses
- [ ] Time investment by book
- [ ] Learning velocity charts

### Community Features
- [ ] Share collections with friends
- [ ] Public profile with memorized verse showcase
- [ ] Collaborative collections
- [ ] Quote recommendations based on history
- [ ] Challenge friends to memorize same collection

### AI Enhancements
- [ ] Difficulty prediction: Which verses you'll struggle with
- [ ] Personalized quote suggestions
- [ ] Optimal review scheduling (advanced spaced repetition)
- [ ] Multi-language support (memorize in different translations)

---

## Implementation Roadmap

### Sprint 1: Unified Page (Weeks 1-2)
- [ ] Design unified content interface
- [ ] Implement filtering system
- [ ] Build tag management
- [ ] Migrate from separate chapter/verse views

### Sprint 2: Freeform Quotes (Weeks 3-4)
- [ ] Create quote table and UI
- [ ] Implement quote memorization
- [ ] Build quote testing modes
- [ ] Add quote search/discovery

### Sprint 3: Pericope Refinement (Weeks 5-7)
- [ ] Audit current pericopes
- [ ] Create refinement tools
- [ ] Generate AI-assisted titles
- [ ] Begin manual curation (Gospels first)

### Sprint 4: Curated Collections (Weeks 8-10)
- [ ] Build collection builder UI
- [ ] Create flagship collections
- [ ] Implement collection progress tracking
- [ ] Add completion badges

### Sprint 5: Polish & Launch (Week 11+)
- [ ] User testing and feedback
- [ ] Performance optimization
- [ ] Security audit
- [ ] Production deployment

---

## Success Metrics

### User Engagement
- Daily active users (target: 10,000 by month 6)
- Average daily practice time (target: 20+ minutes)
- Collection completion rate (target: 70% of starters)

### Content Quality
- User ratings of pericope quality (target: 4.5/5)
- Quote community engagement (target: 1,000+ public quotes)
- Collection completion feedback (target: 4.3/5 stars)

### Memorization Outcomes
- Verse retention rate (target: 80% after 30 days)
- Long-term recall (target: 60% after 6 months)
- User-reported comprehension improvement (target: 85%)

---

## Technical Decisions

### Database
- Consolidate queries: verses + pericopes + quotes in single operation
- Use materialized views for filtered/sorted datasets
- Implement full-text search for quote discovery
- Maintain referential integrity across content types

### Frontend
- Single React component for unified page (with tabs/sections)
- Client-side filtering (1,000+ items acceptable)
- Real-time tag/filter updates
- Responsive design for mobile & desktop

### API
- Simplified endpoints:
  - `GET /api/content` (verses + pericopes + quotes)
  - `POST /api/quotes` (create custom quotes)
  - `GET /api/collections` (browse/search)
  - `POST /api/progress` (track all content types)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Pericope refinement at scale | High effort | Start with Gospels only; use AI assists |
| User quote moderation | Moderation burden | Community voting; report system |
| Mobile UI complexity | UX degradation | Progressive disclosure; collapsible sections |
| Performance with unified page | Load times | Pagination; lazy loading; caching |

---

## Dependencies

- **TanStack Query** (caching/sync)
- **Supabase** (database/auth)
- **Tailwind CSS** (styling)
- **OpenAI API** (optional: AI-generated titles/context)
- **libsodium.js** (optional: encrypted personal notes)

---

## Questions for Validation

1. **Pericope quality:** Should we prioritize manual refinement or keep auto-generated?
2. **Collection curation:** Who decides which collections are "flagship"?
3. **Quote discovery:** Should community quotes be moderated or voted on?
4. **Mobile first:** Should unified page be mobile-optimized first?
5. **Multi-user:** Support group learning/challenges?

---

**Next Step:** Get user feedback on prioritization. Start with Phase 1 (Unified Page) while Pericope Refinement work happens in parallel.
