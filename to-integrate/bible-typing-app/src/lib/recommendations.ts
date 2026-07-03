import { BookKey, books, bible } from "@/data/bible";
import { getUserPreferences, getUserStats } from "./userState";
import { getStatus, getAverageAccuracy, loadProgress } from "./progress";

export interface Recommendation {
  id: string;
  type: "continue" | "review" | "new" | "challenge";
  title: string;
  description: string;
  book: BookKey;
  chapter: number;
  verse?: number;
  estimatedTime: number; // minutes
  difficulty: "easy" | "medium" | "hard";
  reason: string;
  priority: number; // 1-10, higher is more important
}

export function getSmartRecommendations(): Recommendation[] {
  const preferences = getUserPreferences();
  const stats = getUserStats();
  const recommendations: Recommendation[] = [];
  
  // Get in-progress sessions
  const continueRecommendations = getContinueRecommendations();
  recommendations.push(...continueRecommendations);
  
  // Get review recommendations (verses that need practice)
  const reviewRecommendations = getReviewRecommendations();
  recommendations.push(...reviewRecommendations);
  
  // Get new content recommendations
  const newRecommendations = getNewContentRecommendations();
  recommendations.push(...newRecommendations);
  
  // Get challenge recommendations for advanced users
  if (stats.averageAccuracy > 0.85 && stats.totalSessionsCompleted > 10) {
    const challengeRecommendations = getChallengeRecommendations();
    recommendations.push(...challengeRecommendations);
  }
  
  // Sort by priority and return top 6
  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 6);
}

function getContinueRecommendations(): Recommendation[] {
  const progress = loadProgress();
  const recommendations: Recommendation[] = [];
  
  // Find verses that are partially learned (have attempts but not mastered)
  Object.entries(progress).forEach(([key, verseProgress]) => {
    const [book, chapter, verseIndex] = key.split('.') as [BookKey, string, string];
    const chapterNum = parseInt(chapter);
    const verseNum = parseInt(verseIndex);
    
    if (verseProgress.attempts > 0 && !verseProgress.memorySuccess) {
      const averageAcc = verseProgress.accuracyHistory.reduce((a, b) => a + b, 0) / verseProgress.accuracyHistory.length;
      
      if (averageAcc > 0.7 && averageAcc < 0.95) {
        recommendations.push({
          id: `continue-${key}`,
          type: "continue",
          title: `Continue ${books.find(b => b.key === book)?.label} ${chapterNum}:${verseNum + 1}`,
          description: `You're ${Math.round(averageAcc * 100)}% accurate - almost there!`,
          book,
          chapter: chapterNum,
          verse: verseNum + 1,
          estimatedTime: 3,
          difficulty: averageAcc > 0.85 ? "easy" : "medium",
          reason: "You've made good progress on this verse",
          priority: 9,
        });
      }
    }
  });
  
  return recommendations;
}

function getReviewRecommendations(): Recommendation[] {
  const progress = loadProgress();
  const recommendations: Recommendation[] = [];
  
  // Find mastered verses that haven't been practiced recently
  Object.entries(progress).forEach(([key, verseProgress]) => {
    const [book, chapter, verseIndex] = key.split('.') as [BookKey, string, string];
    const chapterNum = parseInt(chapter);
    const verseNum = parseInt(verseIndex);
    
    if (verseProgress.memorySuccess && verseProgress.attempts < 5) {
      recommendations.push({
        id: `review-${key}`,
        type: "review",
        title: `Review ${books.find(b => b.key === book)?.label} ${chapterNum}:${verseNum + 1}`,
        description: "Keep this verse fresh in your memory",
        book,
        chapter: chapterNum,
        verse: verseNum + 1,
        estimatedTime: 2,
        difficulty: "easy",
        reason: "Maintenance practice for mastered verse",
        priority: 6,
      });
    }
  });
  
  return recommendations.slice(0, 2); // Limit review recommendations
}

function getNewContentRecommendations(): Recommendation[] {
  const preferences = getUserPreferences();
  const stats = getUserStats();
  const recommendations: Recommendation[] = [];
  
  // Filter books by user preference
  const suitableBooks = books.filter(book => {
    if (preferences.favoriteBooks.length > 0) {
      return preferences.favoriteBooks.includes(book.key);
    }
    return book.difficulty === preferences.preferredDifficulty || 
           (preferences.preferredDifficulty === "beginner" && book.difficulty === "intermediate");
  });
  
  // Add popular verses for beginners
  if (stats.totalSessionsCompleted < 5) {
    const beginnerVerses = [
      { book: "john" as BookKey, chapter: 1, verse: 1, title: "The Word of God" },
      { book: "john" as BookKey, chapter: 3, verse: 16, title: "God's Love" },
      { book: "psalms" as BookKey, chapter: 23, verse: 1, title: "The Lord's Shepherd" },
      { book: "romans" as BookKey, chapter: 8, verse: 28, title: "All Things Work Together" },
    ];
    
    beginnerVerses.forEach(verse => {
      const verseText = bible[verse.book]?.[verse.chapter]?.[verse.verse - 1];
      if (verseText) {
        recommendations.push({
          id: `new-${verse.book}-${verse.chapter}-${verse.verse}`,
          type: "new",
          title: verse.title,
          description: verseText.substring(0, 60) + "...",
          book: verse.book,
          chapter: verse.chapter,
          verse: verse.verse,
          estimatedTime: 4,
          difficulty: "easy",
          reason: "Popular verse perfect for memorization",
          priority: 8,
        });
      }
    });
  }
  
  // Suggest next chapters in books user has started
  const startedBooks = getStartedBooks();
  startedBooks.forEach(({ book, nextChapter }) => {
    const bookInfo = books.find(b => b.key === book);
    if (bookInfo && bible[book]?.[nextChapter]) {
      recommendations.push({
        id: `new-${book}-${nextChapter}`,
        type: "new",
        title: `Start ${bookInfo.label} Chapter ${nextChapter}`,
        description: bookInfo.description,
        book,
        chapter: nextChapter,
        estimatedTime: 8,
        difficulty: bookInfo.difficulty === "beginner" ? "easy" : 
                   bookInfo.difficulty === "intermediate" ? "medium" : "hard",
        reason: `Continue your journey through ${bookInfo.label}`,
        priority: 7,
      });
    }
  });
  
  return recommendations;
}

function getChallengeRecommendations(): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Suggest difficult books for advanced users
  const challengeBooks = books.filter(book => book.difficulty === "advanced");
  
  challengeBooks.forEach(book => {
    const firstChapter = Object.keys(bible[book.key] || {})[0];
    if (firstChapter) {
      recommendations.push({
        id: `challenge-${book.key}`,
        type: "challenge",
        title: `Master ${book.label}`,
        description: `Challenge yourself with ${book.description}`,
        book: book.key,
        chapter: parseInt(firstChapter),
        estimatedTime: 15,
        difficulty: "hard",
        reason: "Advanced content for experienced typists",
        priority: 5,
      });
    }
  });
  
  return recommendations.slice(0, 1); // Limit challenges
}

function getStartedBooks(): Array<{ book: BookKey; nextChapter: number }> {
  const progress = loadProgress();
  const bookProgress: Record<BookKey, Set<number>> = {} as Record<BookKey, Set<number>>;
  
  // Track which chapters have been started in each book
  Object.keys(progress).forEach(key => {
    const [book, chapter] = key.split('.') as [BookKey, string];
    const chapterNum = parseInt(chapter);
    
    if (!bookProgress[book]) {
      bookProgress[book] = new Set();
    }
    bookProgress[book].add(chapterNum);
  });
  
  // Find next chapters for started books
  return Object.entries(bookProgress).map(([book, chapters]) => {
    const availableChapters = Object.keys(bible[book as BookKey] || {}).map(Number).sort((a, b) => a - b);
    const maxStarted = Math.max(...Array.from(chapters));
    const nextChapter = availableChapters.find(ch => ch > maxStarted);
    
    return nextChapter ? { book: book as BookKey, nextChapter } : null;
  }).filter(Boolean) as Array<{ book: BookKey; nextChapter: number }>;
}

export function getQuickStartRecommendation(): Recommendation | null {
  const stats = getUserStats();
  
  // For very new users, recommend John 3:16
  if (stats.totalSessionsCompleted === 0) {
    return {
      id: "quickstart-john-3-16",
      type: "new",
      title: "Start with John 3:16",
      description: "The most famous verse in the Bible - perfect for beginners",
      book: "john",
      chapter: 3,
      verse: 16,
      estimatedTime: 3,
      difficulty: "easy",
      reason: "Perfect first verse for new users",
      priority: 10,
    };
  }
  
  // For returning users, suggest continuing their most recent work
  const recommendations = getSmartRecommendations();
  return recommendations.find(r => r.type === "continue") || recommendations[0] || null;
}

export function getDifficultyBasedRecommendations(difficulty: "easy" | "medium" | "hard"): Recommendation[] {
  return getSmartRecommendations().filter(r => r.difficulty === difficulty);
}