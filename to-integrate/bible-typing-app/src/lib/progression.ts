/**
 * Linear progression system for typing through the Bible.
 * Chapters unlock sequentially — you must complete the previous chapter to proceed.
 * Uses localStorage for persistence.
 */

const STORAGE_KEY = "bible_typing_progress";

export interface ChapterResult {
  accuracy: number; // 0-1
  wpm: number;
  completedAt: string; // ISO date
  timeSeconds: number;
}

// Map of "BookName.Chapter" → ChapterResult
type ProgressMap = Record<string, ChapterResult>;

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(map: ProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function chapterKey(book: string, chapter: number): string {
  return `${book}.${chapter}`;
}

export function isChapterComplete(book: string, chapter: number): boolean {
  const map = loadProgress();
  const result = map[chapterKey(book, chapter)];
  return !!result && result.accuracy >= 0.95;
}

export function getChapterResult(book: string, chapter: number): ChapterResult | null {
  const map = loadProgress();
  return map[chapterKey(book, chapter)] || null;
}

export function completeChapter(
  book: string,
  chapter: number,
  accuracy: number,
  wpm: number,
  timeSeconds: number
): boolean {
  const passed = accuracy >= 0.95;
  const map = loadProgress();
  const key = chapterKey(book, chapter);
  const existing = map[key];
  
  // Always save if passed, or if better than previous attempt
  if (passed || !existing || accuracy > existing.accuracy) {
    map[key] = {
      accuracy,
      wpm,
      completedAt: new Date().toISOString(),
      timeSeconds,
    };
    saveProgress(map);
  }
  return passed;
}

/**
 * Check if a chapter is unlocked.
 * Chapter 1 of Genesis is always unlocked.
 * Otherwise, the previous chapter (or last chapter of previous book) must be complete.
 */
export function isChapterUnlocked(
  book: string,
  chapter: number,
  books: Array<{ name: string; total_chapters: number }>
): boolean {
  // First chapter of first book is always unlocked
  const bookIndex = books.findIndex((b) => b.name === book);
  if (bookIndex === 0 && chapter === 1) return true;

  // Previous chapter in same book
  if (chapter > 1) {
    return isChapterComplete(book, chapter - 1);
  }

  // First chapter of a book — check last chapter of previous book
  if (bookIndex > 0) {
    const prevBook = books[bookIndex - 1];
    return isChapterComplete(prevBook.name, prevBook.total_chapters);
  }

  return false;
}

export function getOverallStats(books: Array<{ name: string; total_chapters: number }>) {
  const map = loadProgress();
  const entries = Object.values(map);
  const completed = entries.filter((e) => e.accuracy >= 0.95).length;
  const totalChapters = books.reduce((sum, b) => sum + b.total_chapters, 0);
  const avgWpm = entries.length > 0
    ? entries.reduce((sum, e) => sum + e.wpm, 0) / entries.length
    : 0;
  const avgAccuracy = entries.length > 0
    ? entries.reduce((sum, e) => sum + e.accuracy, 0) / entries.length
    : 0;

  return { completed, totalChapters, avgWpm, avgAccuracy };
}

export const ACCURACY_THRESHOLD = 0.95;
