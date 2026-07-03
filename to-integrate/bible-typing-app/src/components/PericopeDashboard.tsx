import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Target,
  Brain,
  Trophy,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { MemorizationEngine } from '../lib/memorization';
import { MemorizationWorkflow } from './MemorizationWorkflow';
import { RecallQuiz } from './RecallQuiz';
import { genesis1Chapter, genesis1Verses, genesis1Questions } from '../data/genesis1';
import { Verse } from '../types/bible';

export function PericopeDashboard() {
  const [engine] = useState(() => {
    const eng = new MemorizationEngine();
    eng.loadChapter(genesis1Chapter, genesis1Verses, genesis1Questions);
    return eng;
  });

  const [activeTab, setActiveTab] = useState('memorize');
  const [progressSummary, setProgressSummary] = useState<any>(null);
  const [reviewVerses, setReviewVerses] = useState<Verse[]>([]);
  const [learnedVerses, setLearnedVerses] = useState<Verse[]>([]);

  const chapterId = 'gen.1';

  useEffect(() => {
    updateDashboardData();
  }, []);

  const updateDashboardData = () => {
    const summary = engine.getProgressSummary(chapterId);
    const review = engine.getReviewVerses(chapterId);
    const learned = engine.getLearnedVersesInOrder(chapterId);

    setProgressSummary(summary);
    setReviewVerses(review);
    setLearnedVerses(learned);
  };

  if (!progressSummary) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Pericope Memory
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Learn Scripture verse by verse, within the context of the whole
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{progressSummary.learnedVerses}</p>
                  <p className="text-sm text-muted-foreground">Verses Learned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{progressSummary.completedPericopes}</p>
                  <p className="text-sm text-muted-foreground">Pericopes Done</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{progressSummary.progressPercentage}%</p>
                  <p className="text-sm text-muted-foreground">Chapter Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{reviewVerses.length}</p>
                  <p className="text-sm text-muted-foreground">Need Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="memorize" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Quiz
            </TabsTrigger>
            <TabsTrigger value="review" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Review
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Learn Tab */}
          <TabsContent value="memorize">
            <MemorizationWorkflow />
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz">
            <RecallQuiz
              engine={engine}
              chapterId={chapterId}
              onQuizComplete={updateDashboardData}
            />
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Verses Needing Review
                  </CardTitle>
                  <CardDescription>
                    Practice these verses to strengthen your memory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reviewVerses.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-lg font-medium">All caught up!</p>
                      <p className="text-muted-foreground">No verses need review right now.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviewVerses.map((verse) => (
                        <div
                          key={verse.id}
                          className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
                        >
                          <Badge variant="outline" className="mb-2">
                            {verse.book} {verse.chapter}:{verse.verse}
                          </Badge>
                          <p className="text-sm text-muted-foreground mb-2">
                            Try to recite this verse, then click to reveal:
                          </p>
                          <details className="group">
                            <summary className="cursor-pointer text-sm font-medium hover:text-blue-600">
                              Click to reveal verse
                            </summary>
                            <p className="mt-2 text-yellow-800 dark:text-yellow-200">
                              {verse.text}
                            </p>
                          </details>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* All Learned Verses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    All Learned Verses
                  </CardTitle>
                  <CardDescription>
                    Your complete memorized collection so far
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {learnedVerses.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Start learning verses to see them here.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {learnedVerses.map((verse) => (
                        <div
                          key={verse.id}
                          className="p-3 border rounded-lg bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                        >
                          <Badge variant="outline" className="mb-2">
                            {verse.book} {verse.chapter}:{verse.verse}
                          </Badge>
                          <p className="text-green-800 dark:text-green-200 text-sm">
                            {verse.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <div className="space-y-6">
              {/* Chapter Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {progressSummary.chapterTitle} Progress
                  </CardTitle>
                  <CardDescription>
                    Detailed breakdown of your memorization journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {progressSummary.progressPercentage}%
                    </div>
                    <Progress value={progressSummary.progressPercentage} className="h-3 mb-4" />
                    <p className="text-muted-foreground">
                      {progressSummary.learnedVerses} of {progressSummary.totalVerses} verses completed
                    </p>
                  </div>

                  <Separator />

                  {/* Pericope Breakdown */}
                  <div>
                    <h3 className="font-semibold mb-4">Pericope Progress</h3>
                    <div className="grid gap-4">
                      {genesis1Chapter.pericopes.map((pericope, index) => {
                        const isCompleted = index < progressSummary.completedPericopes;
                        const isCurrent = index === progressSummary.completedPericopes && !progressSummary.isCompleted;

                        return (
                          <div
                            key={pericope.id}
                            className={`p-4 rounded-lg border ${
                              isCompleted
                                ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                                : isCurrent
                                ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                                : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                isCompleted
                                  ? 'bg-green-500 text-white'
                                  : isCurrent
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-300 text-gray-600'
                              }`}>
                                {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{pericope.title}</h4>
                                <p className="text-sm text-muted-foreground">{pericope.description}</p>
                              </div>
                              <Badge variant="outline">
                                verses {pericope.startVerse}-{pericope.endVerse}
                              </Badge>
                            </div>
                            {isCurrent && (
                              <div className="mt-3 text-sm text-blue-700 dark:text-blue-300">
                                📍 Currently working on this pericope
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievement Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`text-center p-4 rounded-lg border ${
                      progressSummary.learnedVerses >= 1 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="text-2xl mb-2">🌱</div>
                      <p className="text-sm font-medium">First Verse</p>
                      <p className="text-xs text-muted-foreground">Learn your first verse</p>
                    </div>

                    <div className={`text-center p-4 rounded-lg border ${
                      progressSummary.completedPericopes >= 1 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="text-2xl mb-2">📖</div>
                      <p className="text-sm font-medium">Pericope Master</p>
                      <p className="text-xs text-muted-foreground">Complete your first pericope</p>
                    </div>

                    <div className={`text-center p-4 rounded-lg border ${
                      progressSummary.learnedVerses >= 10 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="text-2xl mb-2">⭐</div>
                      <p className="text-sm font-medium">Ten Verses</p>
                      <p className="text-xs text-muted-foreground">Memorize 10 verses</p>
                    </div>

                    <div className={`text-center p-4 rounded-lg border ${
                      progressSummary.isCompleted ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="text-2xl mb-2">🏆</div>
                      <p className="text-sm font-medium">Chapter Complete</p>
                      <p className="text-xs text-muted-foreground">Finish the entire chapter</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}