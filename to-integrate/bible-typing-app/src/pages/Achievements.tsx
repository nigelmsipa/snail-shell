import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, 
  Trophy, 
  Medal, 
  Target, 
  Zap, 
  Calendar, 
  BookOpen,
  Lock,
  Star,
  TrendingUp,
  Clock
} from "lucide-react";
import { getUserStats, Achievement } from "@/lib/userState";

export const Achievements = () => {
  const navigate = useNavigate();
  const stats = getUserStats();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Define all possible achievements
  const allAchievements: Array<Achievement & { 
    category: string; 
    requirement: string;
    unlocked: boolean;
    progress?: number;
  }> = [
    {
      id: "first_session",
      name: "Getting Started",
      description: "Complete your first typing session",
      type: "milestone",
      category: "milestones",
      requirement: "Complete 1 session",
      unlocked: stats.achievements.some(a => a.id === "first_session"),
      unlockedAt: stats.achievements.find(a => a.id === "first_session")?.unlockedAt || "",
      progress: Math.min(100, (stats.totalSessionsCompleted / 1) * 100),
    },
    {
      id: "week_streak",
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      type: "streak",
      category: "streaks",
      requirement: "7-day streak",
      unlocked: stats.achievements.some(a => a.id === "week_streak"),
      unlockedAt: stats.achievements.find(a => a.id === "week_streak")?.unlockedAt || "",
      progress: Math.min(100, (stats.currentStreak / 7) * 100),
    },
    {
      id: "month_streak",
      name: "Monthly Master",
      description: "Maintain a 30-day streak",
      type: "streak",
      category: "streaks",
      requirement: "30-day streak",
      unlocked: stats.currentStreak >= 30,
      unlockedAt: stats.currentStreak >= 30 ? new Date().toISOString() : "",
      progress: Math.min(100, (stats.currentStreak / 30) * 100),
    },
    {
      id: "accuracy_master",
      name: "Accuracy Master",
      description: "Achieve 95% accuracy or higher",
      type: "accuracy",
      category: "performance",
      requirement: "95% average accuracy",
      unlocked: stats.achievements.some(a => a.id === "accuracy_master"),
      unlockedAt: stats.achievements.find(a => a.id === "accuracy_master")?.unlockedAt || "",
      progress: Math.min(100, (stats.averageAccuracy / 0.95) * 100),
    },
    {
      id: "speed_demon",
      name: "Speed Demon",
      description: "Type at 60+ WPM consistently",
      type: "special",
      category: "performance",
      requirement: "60+ WPM average",
      unlocked: false, // This would need WPM tracking
      unlockedAt: "",
      progress: 0,
    },
    {
      id: "verse_collector",
      name: "Verse Collector",
      description: "Memorize 10 verses perfectly",
      type: "milestone",
      category: "milestones",
      requirement: "10 memorized verses",
      unlocked: stats.achievements.some(a => a.id === "verse_collector"),
      unlockedAt: stats.achievements.find(a => a.id === "verse_collector")?.unlockedAt || "",
      progress: Math.min(100, (stats.versesMemorized / 10) * 100),
    },
    {
      id: "century_club",
      name: "Century Club",
      description: "Complete 100 typing sessions",
      type: "milestone",
      category: "milestones",
      requirement: "100 sessions",
      unlocked: stats.totalSessionsCompleted >= 100,
      unlockedAt: stats.totalSessionsCompleted >= 100 ? new Date().toISOString() : "",
      progress: Math.min(100, (stats.totalSessionsCompleted / 100) * 100),
    },
    {
      id: "book_explorer",
      name: "Book Explorer",
      description: "Practice from 5 different books",
      type: "special",
      category: "exploration",
      requirement: "5 different books",
      unlocked: false, // Would need book tracking
      unlockedAt: "",
      progress: 0,
    },
    {
      id: "time_keeper",
      name: "Time Keeper",
      description: "Practice for 10 hours total",
      type: "milestone",
      category: "milestones",
      requirement: "10 hours total",
      unlocked: stats.totalTimeSpent >= 600, // 10 hours in minutes
      unlockedAt: stats.totalTimeSpent >= 600 ? new Date().toISOString() : "",
      progress: Math.min(100, (stats.totalTimeSpent / 600) * 100),
    },
  ];

  const categories = [
    { id: "all", label: "All", icon: Trophy },
    { id: "milestones", label: "Milestones", icon: Target },
    { id: "streaks", label: "Streaks", icon: Calendar },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "exploration", label: "Exploration", icon: BookOpen },
  ];

  const filteredAchievements = selectedCategory === "all" 
    ? allAchievements 
    : allAchievements.filter(a => a.category === selectedCategory);

  const unlockedCount = allAchievements.filter(a => a.unlocked).length;
  const totalCount = allAchievements.length;
  const completionRate = (unlockedCount / totalCount) * 100;

  const getAchievementIcon = (type: string, unlocked: boolean) => {
    const iconClass = unlocked ? "text-yellow-600" : "text-gray-400";
    
    switch (type) {
      case "milestone": return <Target className={`h-6 w-6 ${iconClass}`} />;
      case "streak": return <Calendar className={`h-6 w-6 ${iconClass}`} />;
      case "accuracy": return <TrendingUp className={`h-6 w-6 ${iconClass}`} />;
      case "special": return <Star className={`h-6 w-6 ${iconClass}`} />;
      default: return <Award className={`h-6 w-6 ${iconClass}`} />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-600" />
                Achievements
              </h1>
              <p className="text-gray-600 mt-1">Track your progress and unlock new milestones</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              ← Back to Home
            </Button>
          </div>

          {/* Progress Overview */}
          <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-gray-900">{unlockedCount}</p>
                  <p className="text-sm text-gray-600">Achievements Unlocked</p>
                </div>
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <div className="absolute inset-0 bg-yellow-200 rounded-full"></div>
                    <div 
                      className="absolute inset-0 bg-yellow-600 rounded-full" 
                      style={{ 
                        background: `conic-gradient(#D97706 ${completionRate * 3.6}deg, #FEF3C7 0deg)` 
                      }}
                    ></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900">
                        {Math.round(completionRate)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
                <div className="text-center">
                  <Medal className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-gray-900">{totalCount - unlockedCount}</p>
                  <p className="text-sm text-gray-600">Still to Unlock</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`relative transition-all duration-200 ${
                achievement.unlocked 
                  ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-lg" 
                  : "bg-white/90 backdrop-blur-sm border-gray-200"
              }`}
            >
              {achievement.unlocked && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Medal className="h-4 w-4 text-white" />
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-full ${
                    achievement.unlocked ? "bg-yellow-100" : "bg-gray-100"
                  }`}>
                    {achievement.unlocked ? (
                      getAchievementIcon(achievement.type, true)
                    ) : (
                      <Lock className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className={`text-lg ${
                      achievement.unlocked ? "text-gray-900" : "text-gray-500"
                    }`}>
                      {achievement.name}
                    </CardTitle>
                    <p className={`text-sm mt-1 ${
                      achievement.unlocked ? "text-gray-700" : "text-gray-500"
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Requirement:</span>
                    <span className="font-medium">{achievement.requirement}</span>
                  </div>
                  
                  {!achievement.unlocked && achievement.progress !== undefined && achievement.progress > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{Math.round(achievement.progress)}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  )}
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Clock className="h-4 w-4" />
                      <span>Unlocked {formatDate(achievement.unlockedAt)}</span>
                    </div>
                  )}
                  
                  <Badge 
                    className={`${
                      achievement.unlocked 
                        ? "bg-yellow-100 text-yellow-800 border-yellow-300" 
                        : "bg-gray-100 text-gray-600 border-gray-300"
                    }`}
                  >
                    {achievement.type === "milestone" && "Milestone"}
                    {achievement.type === "streak" && "Streak"}
                    {achievement.type === "accuracy" && "Performance"}
                    {achievement.type === "special" && "Special"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No achievements in category */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements in this category</h3>
            <p className="text-gray-600">Try a different category or start practicing to unlock achievements!</p>
          </div>
        )}

        {/* Call to Action */}
        {unlockedCount < totalCount && (
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-0">
              <CardContent className="p-8">
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Keep Going!</h3>
                <p className="text-gray-600 mb-4">
                  You have {totalCount - unlockedCount} more achievements waiting to be unlocked
                </p>
                <Button onClick={() => navigate("/")} size="lg">
                  Continue Practicing
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;