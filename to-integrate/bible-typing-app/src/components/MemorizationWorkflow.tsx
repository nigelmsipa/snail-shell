import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Check, BookOpen, Target, RefreshCw } from 'lucide-react';
import { MemorizationEngine } from '../lib/memorization';
import { genesis1Chapter, genesis1Verses, genesis1Questions } from '../data/genesis1';
import { Verse, Pericope } from '../types/bible';

export function MemorizationWorkflow() {
  const [engine] = useState(() => {
    const eng = new MemorizationEngine();
    eng.loadChapter(genesis1Chapter, genesis1Verses, genesis1Questions);
    return eng;
  });

  const [currentVerse, setCurrentVerse] = useState<{ verse: Verse; pericope: Pericope } | null>(null);
  const [contextVerses, setContextVerses] = useState<Verse[]>([]);
  const [showVerse, setShowVerse] = useState(false);
  const [progressSummary, setProgressSummary] = useState<any>(null);

  const chapterId = 'gen.1';

  useEffect(() => {
    updateState();
  }, []);

  const updateState = () => {
    const current = engine.getCurrentVerse(chapterId);
    const context = engine.getPericopeContext(chapterId);
    const summary = engine.getProgressSummary(chapterId);

    setCurrentVerse(current);
    setContextVerses(context);
    setProgressSummary(summary);
    setShowVerse(false);
  };

  const handleVerseRevealed = () => {
    setShowVerse(true);
  };

  const handleVerseLearned = (accuracy: number = 100) => {
    engine.markVerseAsLearned(chapterId, accuracy);
    updateState();
  };

  const getPericopeProgress = () => {
    if (!currentVerse) return 0;
    const pericope = currentVerse.pericope;
    const learnedInPericope = contextVerses.length;
    const totalInPericope = pericope.verseIds.length;
    return (learnedInPericope / totalInPericope) * 100;
  };

  if (!progressSummary) return <div>Loading...</div>;

  if (progressSummary.isCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-600">🎉 Chapter Completed!</CardTitle>
          <CardDescription>
            You've successfully memorized all of {progressSummary.chapterTitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {progressSummary.totalVerses} verses memorized
            </Badge>
            <p className="text-muted-foreground">
              Ready to start a new chapter or review your progress.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {progressSummary.chapterTitle}
          </CardTitle>
          <CardDescription>
            {progressSummary.learnedVerses} of {progressSummary.totalVerses} verses learned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progressSummary.progressPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{progressSummary.progressPercentage}% complete</span>
              <span>Pericope: {progressSummary.currentPericope}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Pericope Context */}
      {currentVerse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {currentVerse.pericope.title}
            </CardTitle>
            <CardDescription>{currentVerse.pericope.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={getPericopeProgress()} className="h-2" />

              {/* Context Verses (already learned in this pericope) */}
              {contextVerses.length > 1 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Context (verses learned so far):</h4>
                  {contextVerses.slice(0, -1).map((verse) => (
                    <div key={verse.id} className="text-sm p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <Badge variant="outline" className="mb-2">
                        {verse.book} {verse.chapter}:{verse.verse}
                      </Badge>
                      <p className="text-green-800 dark:text-green-200">{verse.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Verse to Learn */}
      {currentVerse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Today's Verse
              <Badge variant="outline">
                {currentVerse.verse.book} {currentVerse.verse.chapter}:{currentVerse.verse.verse}
              </Badge>
            </CardTitle>
            <CardDescription>
              Try to recite this verse from memory, then reveal to check
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showVerse ? (
              <div className="text-center py-8">
                <Button onClick={handleVerseRevealed} size="lg">
                  Reveal Verse
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  First try to recite from memory
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-lg text-blue-900 dark:text-blue-100 leading-relaxed">
                    {currentVerse.verse.text}
                  </p>
                </div>

                <Separator />

                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => handleVerseLearned(100)}
                    className="gap-2"
                    variant="default"
                  >
                    <Check className="h-4 w-4" />
                    Got it! (100%)
                  </Button>
                  <Button
                    onClick={() => handleVerseLearned(75)}
                    variant="outline"
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Need practice (75%)
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Full Chapter Progress Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Chapter Overview</CardTitle>
          <CardDescription>
            See your progress through all pericopes in {progressSummary.chapterTitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {genesis1Chapter.pericopes.map((pericope, index) => {
              const isCompleted = index < progressSummary.completedPericopes;
              const isCurrent = index === progressSummary.completedPericopes && !progressSummary.isCompleted;

              return (
                <div
                  key={pericope.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isCompleted
                      ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                      : isCurrent
                      ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                      : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? <Check className="h-3 w-3" /> : index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{pericope.title}</h4>
                    <p className="text-sm text-muted-foreground">{pericope.description}</p>
                  </div>
                  <Badge variant="outline">
                    {pericope.verseIds.length} verses
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}