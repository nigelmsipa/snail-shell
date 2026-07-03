import { BookKey, Difficulty } from "@/data/bible";

export interface UserPreferences {
  preferredDifficulty: Difficulty;
  dailyGoalMinutes: number;
  favoriteBooks: BookKey[];
  notifications: boolean;
  soundEnabled: boolean;
  theme: "light" | "dark" | "auto";
  skipOnboarding: boolean;
}

export interface UserStats {
  totalSessionsCompleted: number;
  totalTimeSpent: number; // minutes
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  versesMemorized: number;
  lastActiveDate: string;
  joinDate: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  type: "milestone" | "streak" | "accuracy" | "special";
}

export interface SessionGoal {
  type: "verses" | "time" | "accuracy";
  target: number;
  description: string;
}

// Selected Chapters (Library)
export interface SelectedChapter {
  book: BookKey;
  chapter: number;
  addedAt: string;
}

const USER_PREFERENCES_KEY = "verse_mind_preferences";
const USER_STATS_KEY = "verse_mind_stats";
const SELECTED_CHAPTERS_KEY = "verse_mind_selected_chapters";

const defaultPreferences: UserPreferences = {
  preferredDifficulty: "beginner",
  dailyGoalMinutes: 15,
  favoriteBooks: [],
  notifications: true,
  soundEnabled: true,
  theme: "auto",
  skipOnboarding: false,
};

const defaultStats: UserStats = {
  totalSessionsCompleted: 0,
  totalTimeSpent: 0,
  averageAccuracy: 0,
  currentStreak: 0,
  longestStreak: 0,
  versesMemorized: 0,
  lastActiveDate: new Date().toISOString(),
  joinDate: new Date().toISOString(),
  achievements: [],
};

export function getUserPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(USER_PREFERENCES_KEY);
    return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

export function saveUserPreferences(preferences: Partial<UserPreferences>): void {
  const current = getUserPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updated));
}

export function getUserStats(): UserStats {
  try {
    const stored = localStorage.getItem(USER_STATS_KEY);
    return stored ? { ...defaultStats, ...JSON.parse(stored) } : defaultStats;
  } catch {
    return defaultStats;
  }
}

// Selected Chapters APIs
export function getSelectedChapters(): SelectedChapter[] {
  try {
    const raw = localStorage.getItem(SELECTED_CHAPTERS_KEY);
    return raw ? (JSON.parse(raw) as SelectedChapter[]) : [];
  } catch {
    return [];
  }
}

function saveSelectedChapters(list: SelectedChapter[]) {
  localStorage.setItem(SELECTED_CHAPTERS_KEY, JSON.stringify(list));
}

export function isChapterSelected(book: BookKey, chapter: number): boolean {
  return getSelectedChapters().some((c) => c.book === book && c.chapter === chapter);
}

export function addSelectedChapter(book: BookKey, chapter: number): void {
  const list = getSelectedChapters();
  if (list.some((c) => c.book === book && c.chapter === chapter)) return;
  list.push({ book, chapter, addedAt: new Date().toISOString() });
  saveSelectedChapters(list);
}

export function removeSelectedChapter(book: BookKey, chapter: number): void {
  const list = getSelectedChapters().filter((c) => !(c.book === book && c.chapter === chapter));
  saveSelectedChapters(list);
}

export function updateUserStats(updates: Partial<UserStats>): void {
  const current = getUserStats();
  const updated = { ...current, ...updates };
  localStorage.setItem(USER_STATS_KEY, JSON.stringify(updated));
}

export function recordSessionComplete(durationMinutes: number, accuracy: number): void {
  const stats = getUserStats();
  const today = new Date().toISOString().split('T')[0];
  const lastActive = new Date(stats.lastActiveDate).toISOString().split('T')[0];
  
  const isConsecutiveDay = today !== lastActive && 
    new Date(today).getTime() - new Date(lastActive).getTime() === 24 * 60 * 60 * 1000;
  
  updateUserStats({
    totalSessionsCompleted: stats.totalSessionsCompleted + 1,
    totalTimeSpent: stats.totalTimeSpent + durationMinutes,
    averageAccuracy: (stats.averageAccuracy * stats.totalSessionsCompleted + accuracy) / (stats.totalSessionsCompleted + 1),
    currentStreak: isConsecutiveDay ? stats.currentStreak + 1 : (today === lastActive ? stats.currentStreak : 1),
    longestStreak: Math.max(stats.longestStreak, isConsecutiveDay ? stats.currentStreak + 1 : 1),
    lastActiveDate: new Date().toISOString(),
  });
  
  checkAndUnlockAchievements();
}

export function isFirstTimeUser(): boolean {
  return !localStorage.getItem(USER_PREFERENCES_KEY) && !localStorage.getItem(USER_STATS_KEY);
}

export function getTodaysGoalProgress(): { completed: number; target: number; percentage: number } {
  const preferences = getUserPreferences();
  const stats = getUserStats();
  const today = new Date().toISOString().split('T')[0];
  const lastActive = new Date(stats.lastActiveDate).toISOString().split('T')[0];
  
  // If not active today, progress is 0
  const todayMinutes = today === lastActive ? calculateTodayMinutes() : 0;
  
  return {
    completed: todayMinutes,
    target: preferences.dailyGoalMinutes,
    percentage: Math.min(100, (todayMinutes / preferences.dailyGoalMinutes) * 100),
  };
}

function calculateTodayMinutes(): number {
  // This would need to track session times throughout the day
  // For now, return a simple calculation
  return 0;
}

const ACHIEVEMENTS: Record<string, Omit<Achievement, "unlockedAt">> = {
  first_session: {
    id: "first_session",
    name: "Getting Started",
    description: "Complete your first typing session",
    type: "milestone",
  },
  week_streak: {
    id: "week_streak",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    type: "streak",
  },
  accuracy_master: {
    id: "accuracy_master",
    name: "Accuracy Master",
    description: "Achieve 95% accuracy or higher",
    type: "accuracy",
  },
  speed_demon: {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Type at 60+ WPM consistently",
    type: "special",
  },
  verse_collector: {
    id: "verse_collector",
    name: "Verse Collector",
    description: "Memorize 10 verses perfectly",
    type: "milestone",
  },
};

function checkAndUnlockAchievements(): void {
  const stats = getUserStats();
  const newAchievements: Achievement[] = [];
  
  // Check for new achievements
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    const alreadyUnlocked = stats.achievements.some(a => a.id === achievement.id);
    if (alreadyUnlocked) return;
    
    let shouldUnlock = false;
    
    switch (achievement.id) {
      case "first_session":
        shouldUnlock = stats.totalSessionsCompleted >= 1;
        break;
      case "week_streak":
        shouldUnlock = stats.currentStreak >= 7;
        break;
      case "accuracy_master":
        shouldUnlock = stats.averageAccuracy >= 0.95;
        break;
      case "verse_collector":
        shouldUnlock = stats.versesMemorized >= 10;
        break;
    }
    
    if (shouldUnlock) {
      newAchievements.push({
        ...achievement,
        unlockedAt: new Date().toISOString(),
      });
    }
  });
  
  if (newAchievements.length > 0) {
    updateUserStats({
      achievements: [...stats.achievements, ...newAchievements],
    });
  }
}

export function getPersonalizedRecommendations(): SessionGoal[] {
  const preferences = getUserPreferences();
  const stats = getUserStats();
  const recommendations: SessionGoal[] = [];
  
  // Goal based on current performance
  if (stats.averageAccuracy < 0.8) {
    recommendations.push({
      type: "accuracy",
      target: 85,
      description: "Focus on accuracy - aim for 85% or higher",
    });
  }
  
  // Daily goal progress
  const goalProgress = getTodaysGoalProgress();
  if (goalProgress.percentage < 100) {
    const remaining = goalProgress.target - goalProgress.completed;
    recommendations.push({
      type: "time",
      target: remaining,
      description: `Complete your daily goal - ${remaining} minutes remaining`,
    });
  }
  
  // Streak maintenance
  if (stats.currentStreak > 0) {
    recommendations.push({
      type: "verses",
      target: 3,
      description: `Keep your ${stats.currentStreak}-day streak alive!`,
    });
  }
  
  return recommendations;
}
