# Pericope Memory App - Development Log

## Project Vision

This project implements a Bible memorization app that uses **pericope-based learning** instead of arbitrary verse segmentation. The core insight came from recognizing that Scripture was written in meaningful thought units, not just sequential verses.

### The Problem We Solved

Existing apps like VerseLocker and Versify force users to either:
1. Memorize entire chapters at once (overwhelming)
2. Break chapters into arbitrary chunks (loses meaning)
3. Memorize isolated verses (fragments the flow)

### Our Solution: 3-Layer Architecture

```
Verse Level (Atomic Units)
├── Individual verses (gen.1.1, gen.1.2, etc.)
├── 31,000+ verses in Bible
└── Daily focus unit

Pericope Level (Semantic Units)
├── Thought-based groupings (Day 1: Light, Day 2: Sky, etc.)
├── ~6,000 pericopes in Bible
└── Weekly completion target

Chapter Level (Container Units)
├── Complete books/chapters (Genesis 1, John 3, etc.)
├── 1,189 chapters in Bible
└── Monthly achievement goal
```

## Key Implementation Features

### 1. Semantic Segmentation (Not Arbitrary)

**Genesis 1 Example:**
- **Traditional:** verses 1-10, 11-21, 22-31 (meaningless chunks)
- **Pericope:** Creation Setup (1-2), Day 1 Light (3-5), Day 2 Sky (6-8), etc.

### 2. Progressive Context Learning

```typescript
// User learns verse 1:3 but sees it in context of Day 1 pericope
const currentVerse = "And God said, Let there be light: and there was light.";
const pericopeContext = [
  "And God said, Let there be light: and there was light.", // Today's verse
  "And God saw the light, that it was good...", // Next in sequence
  "And God called the light Day..." // Completes the thought
];
```

### 3. Question-Driven Recall

Instead of just rote recitation, we test understanding:

```typescript
const questions = [
  {
    type: 'context',
    question: 'What did God create on Day 1?',
    answer: 'Light'
  },
  {
    type: 'completion',
    question: 'Complete: "And God said..."',
    answer: 'Let there be light: and there was light.'
  }
];
```

## Technical Architecture

### Core Engine (`MemorizationEngine.ts`)
- Manages 3-layer data structure
- Tracks progress across verse → pericope → chapter
- Handles spaced repetition and review scheduling

### Data Models (`bible.ts`)
```typescript
interface Verse {
  id: string;        // "gen.1.1"
  text: string;      // The actual verse text
  // ... metadata
}

interface Pericope {
  id: string;        // "gen.1.day-1"
  title: string;     // "Day 1: Light and Darkness"
  verseIds: string[]; // ["gen.1.3", "gen.1.4", "gen.1.5"]
  // ... semantic grouping
}

interface Chapter {
  pericopes: Pericope[];
  verseIds: string[];
  // ... container structure
}
```

### UI Components
- **MemorizationWorkflow**: Daily verse learning with pericope context
- **RecallQuiz**: Question-driven testing system
- **PericopeDashboard**: Progress visualization and routing
- **Home**: Entry point explaining both classic and pericope methods

## Connection to Tiny Owl Project

This app emerged from insights gained while building a Bible RAG system ("Tiny Owl"):

1. **Same 3-Layer Structure**: Both projects need verse → pericope → chapter hierarchy
2. **Semantic Chunking**: RAG for retrieval, Memory for learning - same principle
3. **Preprocessing Benefits**: Can use AI to generate pericope divisions once, then ship as data

### Monetization Strategy

- **One-time purchase** (aligns with developer values)
- **Local-only storage** (no server costs)
- **Expansion packs** for additional books/features
- **No subscriptions** (user-friendly, development-friendly)

## Development Milestones

### ✅ Completed
1. **Project setup** - React + TypeScript + shadcn/ui
2. **3-layer data structure** - Verse/Pericope/Chapter types
3. **Genesis 1 implementation** - Complete with 8 pericopes
4. **Memorization engine** - Progress tracking, spaced repetition
5. **Question system** - Context-aware recall testing
6. **UI components** - Full dashboard with tabs and progress visualization
7. **App integration** - Routing and home page updates

### 🎯 Next Steps
1. **Add more chapters** (Psalm 23, John 3, Romans 8)
2. **Enhanced question generation** (more question types)
3. **Data persistence** (localStorage → IndexedDB)
4. **Export/import progress**
5. **Mobile optimization**
6. **Offline PWA features**

## Core Innovation

**The breakthrough insight**: Instead of fighting against Scripture's natural structure, we embrace it. Pericopes aren't just academic theory - they're the optimal memorization units because they align with how the text was originally composed.

This creates memorization that's both:
- **Efficient** (meaningful chunks, not arbitrary segments)
- **Contextual** (verses understood within their narrative flow)
- **Sustainable** (daily progress within weekly completion cycles)

## Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS + Radix primitives
- **Routing**: React Router v6
- **State**: Local component state + custom engine
- **Icons**: Lucide React
- **Build**: Vite with SWC

The app is designed to be a **static site** with **no backend dependencies** - perfect for one-time purchase distribution and offline usage.

---

*This implementation represents a novel approach to Scripture memorization that respects both pedagogical principles and the literary structure of the biblical text.*