# First Letter Scripture
wolf&word

A Bible memorization app that uses first-letter typing and spaced repetition to help users deeply memorize Scripture.

## Overview

First Letter Scripture transforms Bible memorization from rote repetition into an engaging, game-like experience. Users memorize verses by typing the first letter of each word, creating a muscle-memory pathway while maintaining full comprehension of the text.

**Current Status:** Active development with comprehensive pericope divisions for multiple books

## Key Features

### 📖 Structured Learning
- **Pericope-based organization** - Narratively and theologically meaningful verse groupings
- **Sequential progression** - Master verses → pericopes → entire chapters
- **Multi-book coverage** - Genesis through Revelation divisions in progress

### 🎮 Interactive Testing Modes
- **First-Letter Typing** - Primary mode: type first letter of each word to reveal verse
- **Word Bank** - Fill in the blanks from provided options
- **Multiple Choice** - Recognition-based testing
- **Audio Recitation** - Hands-free practice (planned)

### 📊 Gamification & Progress
- **Heat Map** - GitHub-style contribution graph showing daily practice
- **XP & Levels** - Earn points and progress through levels
- **Badges & Achievements** - Unlock milestones for consistency and mastery
- **Boss Fights** - Pericope challenges requiring memory from scratch (not just typing)

### 🧠 Spaced Repetition
- **Adaptive scheduling** - Reviews based on performance and forgetting curve
- **Time-gating** - Can't review same verse twice in 24 hours (prevents cramming)
- **Multiple test modes** - Prevents one-dimensional memorization
- **Scoring system** - Difficulty-weighted scoring ensures rigor

## Architecture

### Frontend
- **React** + TypeScript + Vite
- **shadcn-ui** components
- **Tailwind CSS** styling
- **Lovable.dev** for rapid development

### Backend
- **Supabase** (PostgreSQL database)
- **Multi-version Bible support** (KJV, WEB, BSB, MSV)
- **Scalable pericope divisions**
- **RLS policies** for secure data access

### Database Schema
- `bible_versions` - Available Bible translations
- `bible_books` - All 66 books with metadata
- `bible_pericopes` - Version-agnostic narrative divisions
- `bible_verses` - Full text for each verse
- `user_progress` - Memorization state tracking
- `user_progression` - XP and level data
- `daily_activity` - Heat map data

## Pericope Frameworks

The app uses mnemonic pericope frameworks to organize Scripture into memorable units:

### Completed Books
- **Genesis** (50 chapters, 154 pericopes)
- **Exodus** (40 chapters, 195 pericopes)
- **Leviticus** (27 chapters, 114 pericopes)
- **Numbers** (36 chapters, 127 pericopes)
- **Ezekiel** (48 chapters, 164 pericopes - EzMP Framework)
- **Hosea** (14 chapters, 75 pericopes - HoMP Framework)
- **Amos** (9 chapters, 46 pericopes - AmMP Framework)
- **Jonah** (4 chapters, 18 pericopes - JoMP Framework)
- **Micah** (7 chapters, 40 pericopes - MiMP Framework)
- **Hebrews, James, 1-2 Peter, 1-2-3 John, Jude** (34 chapters, 162 pericopes)

### Framework Philosophy
Each framework is designed to:
- **Respect theological structure** - Divisions follow narrative/theological turns
- **Optimize cognitive load** - Target 6-12 verses per pericope for manageable units
- **Support memory palace technique** - Sequential themed divisions create mental architecture
- **Highlight memorable passages** - Famous verses serve as anchors

## Getting Started

### Prerequisites
- Node.js & npm
- [Supabase account](https://supabase.com)
- Environment variables configured

### Installation
```bash
# Clone repository
git clone https://github.com/nigelmsipa/first-letter-scripture.git
cd first-letter-scripture

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Add your Supabase URL and anon key

# Start development server
npm run dev
```

### Development with Lovable
1. Visit [Lovable Project](https://lovable.dev/projects/f188a5f0-fec8-418e-9491-4e4df84ffe45)
2. Make changes via Lovable prompting
3. Changes auto-commit to this repository

## Project Philosophy

> "You can't rush mastery. Memorization is an investment that matures over time."

**Core Principles:**
- **Meaningful over superficial** - Real memorization, not checkbox completion
- **Time-gated learning** - Prevents cramming; encourages daily habits
- **Multiple verification** - Different test modes prevent gaming the system
- **Progress is personal** - Gamification motivates without external pressure
- **Theological context** - Pericopes provide narrative meaning, not isolated verses

## Design Decisions

### Why First-Letter Typing?
- Creates muscle-memory pathway while maintaining comprehension
- Works equally well on mobile and desktop
- Can type one keystroke per word (fast)
- Synergistic with app's unique value proposition
- Prevents "lucky guessing" in testing

### Why Pericopes?
- Breaks Scripture into meaningful narrative units
- Better than arbitrary chapter divisions for memorization
- Provides theological context
- Supports memory palace technique
- Creates natural progression (verse → pericope → chapter → book)

### Why Spaced Repetition?
- Scientifically proven method for long-term retention
- 24-hour minimum between same-verse reviews prevents cramming
- Intervals based on forgetting curve (1d, 3d, 7d, 14d, 30d)
- Reviews count as XP but at reduced rate

## Gamification Elements

### Heat Map
- GitHub-style contribution graph
- Shows daily activity (even 1 verse = green square)
- Encourages consistency over heroic single days
- More forgiving than streaks

### XP & Levels
- Type new verse = 10 XP
- Review verse = 5 XP
- Complete pericope = 50 XP
- Complete chapter = 200 XP
- Defeat boss = 100 XP

### Badges
- Milestone badges (First Verse, 100 Verses, Chapter Champion, etc.)
- Consistency badges (Week Warrior, Month Master, 365-Day Champion)
- Mastery badges (Perfect Week, Speed Typist, Boss Slayer)

### Boss Fights
- After completing all verses in pericope → boss available
- Recite pericope from memory (not just typing first letters)
- 95%+ accuracy required to defeat
- 100 XP reward
- Pericope becomes regular review target

## Memorization Targets

**Ideal System:**
1. **New Verse** (10 min) - Read + understand + first attempt
2. **Learning Phase** (3-7 days) - Multiple attempts, frequent reviews
3. **Familiar** (3-5 reviews) - Confident but needs occasional review
4. **Mastered** (consistent 90%+) - No more active study, maintenance only
5. **Reviewing** (monthly) - Long-term retention verification

**Boss Fight Progression:**
- Complete pericope in standard mode
- Challenge pericope boss (memory test)
- Defeat = "Memorized" badge + automatic reviews scheduled

## Contributing

This is a personal project but welcomes thoughtful input on:
- Pericope divisions for new books
- UI/UX improvements
- Testing modes
- Gamification mechanics

## License

MIT License

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check CLAUDE.md for development progress and design decisions
- Review PRODUCT_ROADMAP.md for planned features

## Next Steps

### Short Term
- Complete remaining Minor Prophets pericopes
- Implement heat map component
- Build XP/level system
- Create badge infrastructure

### Medium Term
- Add additional Bible versions (WEB, BSB, ESV)
- Implement boss fight mechanics
- Build advanced analytics
- Create community features

### Long Term
- Mobile app (React Native)
- Multi-language support
- Teacher/class features
- Advanced spaced repetition algorithms

---

**Project Start:** October 2024
**Current Status:** Active Development
**Last Updated:** November 20, 2025
**Commits Today:** Cleaned up dead code - removed debug pages and test files
