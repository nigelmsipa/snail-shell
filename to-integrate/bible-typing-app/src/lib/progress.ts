import { BookKey } from "@/data/bible";

export type Status = "learning" | "practicing" | "mastered";

export interface VerseRef {
  book: BookKey;
  chapter: number;
  verseIndex: number; // 0-based
}

interface VerseProgress {
  attempts: number;
  accuracyHistory: number[]; // 0..1
  memorySuccess: boolean;
}

type ProgressMap = Record<string, VerseProgress>;

const STORAGE_KEY = "scripture_type_progress";

function keyFor({ book, chapter, verseIndex }: VerseRef) {
  return `${book}.${chapter}.${verseIndex}`;
}

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function saveProgress(map: ProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function recordAttempt(ref: VerseRef, accuracy: number, memorySucceeded: boolean) {
  const map = loadProgress();
  const k = keyFor(ref);
  const current: VerseProgress = map[k] || { attempts: 0, accuracyHistory: [], memorySuccess: false };
  current.attempts += 1;
  current.accuracyHistory.push(Math.max(0, Math.min(1, accuracy)));
  if (memorySucceeded) current.memorySuccess = true;
  map[k] = current;
  saveProgress(map);
}

export function getAverageAccuracy(ref: VerseRef): number | null {
  const map = loadProgress();
  const k = keyFor(ref);
  const p = map[k];
  if (!p || p.accuracyHistory.length === 0) return null;
  const sum = p.accuracyHistory.reduce((a, b) => a + b, 0);
  return sum / p.accuracyHistory.length;
}

export function getStatus(ref: VerseRef): Status {
  const map = loadProgress();
  const k = keyFor(ref);
  const p = map[k];
  if (!p) return "learning";
  const avg = p.accuracyHistory.length ? p.accuracyHistory.reduce((a, b) => a + b, 0) / p.accuracyHistory.length : 0;
  if (p.memorySuccess && avg >= 0.9) return "mastered";
  if (p.attempts > 0) return "practicing";
  return "learning";
}

export function getChapterStatuses(book: BookKey, chapter: number, verseCount: number): Status[] {
  return Array.from({ length: verseCount }, (_, i) => getStatus({ book, chapter, verseIndex: i }));
}

export function isMastered(ref: VerseRef): boolean {
  return getStatus(ref) === "mastered";
}

export function getContiguousMasteredCount(book: BookKey, chapter: number, verseCount: number): number {
  const statuses = getChapterStatuses(book, chapter, verseCount);
  let count = 0;
  for (let i = 0; i < statuses.length; i++) {
    if (statuses[i] === "mastered") count++;
    else break;
  }
  return count;
}

export function getVerseStatus(book: BookKey, chapter: number, verseNumber: number): Status {
  // Convert 1-based verse number to 0-based index
  return getStatus({ book, chapter, verseIndex: verseNumber - 1 });
}

export function clearChapterProgress(book: BookKey, chapter: number): void {
  const map = loadProgress();
  const prefix = `${book}.${chapter}.`;
  for (const k of Object.keys(map)) {
    if (k.startsWith(prefix)) {
      delete map[k];
    }
  }
  localStorage.setItem("scripture_type_progress", JSON.stringify(map));
}
