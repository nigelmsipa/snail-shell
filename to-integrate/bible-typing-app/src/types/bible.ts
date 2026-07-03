// Verse Level - Individual atomic units
export interface Verse {
  id: string; // e.g., "gen.1.1"
  book: string; // "Genesis"
  chapter: number; // 1
  verse: number; // 1
  text: string; // "In the beginning God created..."
  translation: string; // "KJV", "ESV", etc.
}

// Pericope Level - Semantic thought units
export interface Pericope {
  id: string; // e.g., "gen.1.creation-day-1"
  title: string; // "Day 1: Light and Darkness"
  description?: string; // "God creates light and separates it from darkness"
  book: string;
  chapter: number;
  startVerse: number; // 3
  endVerse: number; // 5
  verseIds: string[]; // ["gen.1.3", "gen.1.4", "gen.1.5"]
  theme?: string; // "creation", "judgment", "covenant", etc.
}

// Chapter Level - Complete container units
export interface Chapter {
  id: string; // e.g., "gen.1"
  book: string; // "Genesis"
  chapter: number; // 1
  title: string; // "The Creation of the World"
  totalVerses: number; // 31
  pericopes: Pericope[];
  verseIds: string[]; // All verse IDs in this chapter
}

// Progress tracking for memorization
export interface VerseProgress {
  verseId: string;
  learned: boolean;
  lastReviewed?: Date;
  timesReviewed: number;
  accuracy: number; // 0-100
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PericopeProgress {
  pericopeId: string;
  started: boolean;
  completed: boolean;
  currentVerseIndex: number; // Which verse in this pericope we're working on
  versesProgress: VerseProgress[];
}

export interface ChapterProgress {
  chapterId: string;
  started: boolean;
  completed: boolean;
  currentPericopeIndex: number; // Which pericope we're working on
  pericopesProgress: PericopeProgress[];
  startDate?: Date;
  completedDate?: Date;
}

// Memorization session
export interface MemorizationSession {
  id: string;
  chapterId: string;
  pericopeId: string;
  verseId: string;
  type: 'learn' | 'review' | 'quiz';
  startTime: Date;
  endTime?: Date;
  successful: boolean;
}

// Question types for active recall
export interface RecallQuestion {
  id: string;
  verseId: string;
  pericopeId: string;
  type: 'completion' | 'context' | 'meaning' | 'reference';
  question: string;
  answer: string;
  hints?: string[];
}