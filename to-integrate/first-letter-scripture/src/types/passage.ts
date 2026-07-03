export type PassageStatus = 'in_progress' | 'ready_for_review' | 'mastered';

export type Difficulty = 'full' | 'first-letter' | 'first-sentence' | 'blind';

export type PracticeMode = 'encoding' | 'retrieval';

export interface Passage {
  id: string;
  userId: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  currentVerse: number;
  status: PassageStatus;
  versionId: string;
  versionAbbreviation?: string;
  createdAt: string;
  updatedAt: string;
  displayOrder?: number;
  note?: string | null;
  tags?: string[];
}

export interface VerseProgress {
  verseNumber: number;
  encodingReps: number;
  lastDifficulty: Difficulty;
  retrievalUnlocked: boolean;
  retrievalPassed: boolean;
}

export interface DailySession {
  warmup: SessionVerse[];
  learning: SessionVerse[];
  consolidate: SessionVerse[];
  test: SessionVerse[];
}

export interface SessionVerse {
  passageId: string;
  book: string;
  chapter: number;
  verseNumber: number;
  text: string;
  abbreviatedText?: string;
  progress?: VerseProgress;
}
