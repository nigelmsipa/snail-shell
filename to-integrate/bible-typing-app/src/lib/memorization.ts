import {
  Chapter,
  Pericope,
  Verse,
  ChapterProgress,
  PericopeProgress,
  VerseProgress,
  MemorizationSession,
  RecallQuestion
} from '../types/bible';

export class MemorizationEngine {
  private chapters: Map<string, Chapter> = new Map();
  private verses: Map<string, Verse> = new Map();
  private pericopes: Map<string, Pericope> = new Map();
  private progress: Map<string, ChapterProgress> = new Map();
  private questions: Map<string, RecallQuestion[]> = new Map();

  // Load Bible data into the engine
  loadChapter(chapter: Chapter, verses: Verse[], questions: RecallQuestion[] = []) {
    // Store chapter
    this.chapters.set(chapter.id, chapter);

    // Store verses
    verses.forEach(verse => {
      this.verses.set(verse.id, verse);
    });

    // Store pericopes
    chapter.pericopes.forEach(pericope => {
      this.pericopes.set(pericope.id, pericope);
    });

    // Store questions
    this.questions.set(chapter.id, questions);

    // Initialize progress if not exists
    if (!this.progress.has(chapter.id)) {
      this.initializeChapterProgress(chapter);
    }
  }

  // Initialize progress tracking for a new chapter
  private initializeChapterProgress(chapter: Chapter) {
    const pericopesProgress: PericopeProgress[] = chapter.pericopes.map((pericope, index) => {
      const versesProgress: VerseProgress[] = pericope.verseIds.map(verseId => ({
        verseId,
        learned: false,
        timesReviewed: 0,
        accuracy: 0,
        difficulty: 'medium' as const
      }));

      return {
        pericopeId: pericope.id,
        started: index === 0, // Start with first pericope
        completed: false,
        currentVerseIndex: 0,
        versesProgress
      };
    });

    const chapterProgress: ChapterProgress = {
      chapterId: chapter.id,
      started: true,
      completed: false,
      currentPericopeIndex: 0,
      pericopesProgress,
      startDate: new Date()
    };

    this.progress.set(chapter.id, chapterProgress);
  }

  // Get current verse to work on
  getCurrentVerse(chapterId: string): { verse: Verse; pericope: Pericope } | null {
    const progress = this.progress.get(chapterId);
    const chapter = this.chapters.get(chapterId);

    if (!progress || !chapter) return null;

    const currentPericope = chapter.pericopes[progress.currentPericopeIndex];
    const pericopeProgress = progress.pericopesProgress[progress.currentPericopeIndex];

    if (!currentPericope || !pericopeProgress) return null;

    const currentVerseId = currentPericope.verseIds[pericopeProgress.currentVerseIndex];
    const verse = this.verses.get(currentVerseId);

    if (!verse) return null;

    return {
      verse,
      pericope: currentPericope
    };
  }

  // Get verses learned so far in current pericope (for context)
  getPericopeContext(chapterId: string): Verse[] {
    const progress = this.progress.get(chapterId);
    const chapter = this.chapters.get(chapterId);

    if (!progress || !chapter) return [];

    const currentPericope = chapter.pericopes[progress.currentPericopeIndex];
    const pericopeProgress = progress.pericopesProgress[progress.currentPericopeIndex];

    if (!currentPericope || !pericopeProgress) return [];

    // Return verses up to current position
    const contextVerseIds = currentPericope.verseIds.slice(0, pericopeProgress.currentVerseIndex + 1);
    return contextVerseIds.map(id => this.verses.get(id)).filter(Boolean) as Verse[];
  }

  // Mark current verse as learned and advance
  markVerseAsLearned(chapterId: string, accuracy: number = 100) {
    const progress = this.progress.get(chapterId);
    if (!progress) return;

    const pericopeProgress = progress.pericopesProgress[progress.currentPericopeIndex];
    if (!pericopeProgress) return;

    // Update current verse progress
    const verseProgress = pericopeProgress.versesProgress[pericopeProgress.currentVerseIndex];
    if (verseProgress) {
      verseProgress.learned = true;
      verseProgress.lastReviewed = new Date();
      verseProgress.timesReviewed += 1;
      verseProgress.accuracy = accuracy;
      verseProgress.difficulty = accuracy >= 90 ? 'easy' : accuracy >= 70 ? 'medium' : 'hard';
    }

    // Advance to next verse in pericope
    pericopeProgress.currentVerseIndex += 1;

    // Check if pericope is completed
    const currentPericope = this.chapters.get(chapterId)?.pericopes[progress.currentPericopeIndex];
    if (currentPericope && pericopeProgress.currentVerseIndex >= currentPericope.verseIds.length) {
      pericopeProgress.completed = true;

      // Advance to next pericope
      progress.currentPericopeIndex += 1;

      // Check if chapter is completed
      if (progress.currentPericopeIndex >= progress.pericopesProgress.length) {
        progress.completed = true;
        progress.completedDate = new Date();
      } else {
        // Start next pericope
        const nextPericopeProgress = progress.pericopesProgress[progress.currentPericopeIndex];
        if (nextPericopeProgress) {
          nextPericopeProgress.started = true;
        }
      }
    }

    this.progress.set(chapterId, progress);
  }

  // Get progress summary
  getProgressSummary(chapterId: string) {
    const progress = this.progress.get(chapterId);
    const chapter = this.chapters.get(chapterId);

    if (!progress || !chapter) return null;

    const totalVerses = chapter.totalVerses;
    const learnedVerses = progress.pericopesProgress
      .flatMap(p => p.versesProgress)
      .filter(v => v.learned).length;

    const completedPericopes = progress.pericopesProgress.filter(p => p.completed).length;

    return {
      chapterTitle: chapter.title,
      totalVerses,
      learnedVerses,
      progressPercentage: Math.round((learnedVerses / totalVerses) * 100),
      totalPericopes: chapter.pericopes.length,
      completedPericopes,
      currentPericope: chapter.pericopes[progress.currentPericopeIndex]?.title || 'Completed',
      isCompleted: progress.completed
    };
  }

  // Get review verses (previously learned verses that need reinforcement)
  getReviewVerses(chapterId: string, limit: number = 5): Verse[] {
    const progress = this.progress.get(chapterId);
    if (!progress) return [];

    const reviewVerses: Verse[] = [];

    for (const pericopeProgress of progress.pericopesProgress) {
      for (const verseProgress of pericopeProgress.versesProgress) {
        if (verseProgress.learned && verseProgress.accuracy < 90) {
          const verse = this.verses.get(verseProgress.verseId);
          if (verse) reviewVerses.push(verse);
        }
      }
    }

    // Sort by last reviewed (oldest first) and return limited set
    return reviewVerses
      .sort((a, b) => {
        const aProgress = this.getVerseProgress(chapterId, a.id);
        const bProgress = this.getVerseProgress(chapterId, b.id);
        const aTime = aProgress?.lastReviewed?.getTime() || 0;
        const bTime = bProgress?.lastReviewed?.getTime() || 0;
        return aTime - bTime;
      })
      .slice(0, limit);
  }

  // Get questions for a specific verse or pericope
  getQuestionsFor(chapterId: string, verseId?: string, pericopeId?: string): RecallQuestion[] {
    const questions = this.questions.get(chapterId) || [];

    if (verseId) {
      return questions.filter(q => q.verseId === verseId);
    }

    if (pericopeId) {
      return questions.filter(q => q.pericopeId === pericopeId);
    }

    return questions;
  }

  private getVerseProgress(chapterId: string, verseId: string): VerseProgress | null {
    const progress = this.progress.get(chapterId);
    if (!progress) return null;

    for (const pericopeProgress of progress.pericopesProgress) {
      const verseProgress = pericopeProgress.versesProgress.find(v => v.verseId === verseId);
      if (verseProgress) return verseProgress;
    }

    return null;
  }

  // Get all learned verses in chapter (for full recitation)
  getLearnedVersesInOrder(chapterId: string): Verse[] {
    const progress = this.progress.get(chapterId);
    const chapter = this.chapters.get(chapterId);

    if (!progress || !chapter) return [];

    const learnedVerseIds: string[] = [];

    for (const pericopeProgress of progress.pericopesProgress) {
      for (const verseProgress of pericopeProgress.versesProgress) {
        if (verseProgress.learned) {
          learnedVerseIds.push(verseProgress.verseId);
        }
      }
    }

    // Return in chapter order
    return chapter.verseIds
      .filter(id => learnedVerseIds.includes(id))
      .map(id => this.verses.get(id))
      .filter(Boolean) as Verse[];
  }
}