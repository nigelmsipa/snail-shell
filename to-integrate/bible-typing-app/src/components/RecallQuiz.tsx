import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, HelpCircle, BookOpen, Target } from 'lucide-react';
import { MemorizationEngine } from '../lib/memorization';
import { RecallQuestion, Verse } from '../types/bible';

interface RecallQuizProps {
  engine: MemorizationEngine;
  chapterId: string;
  onQuizComplete?: () => void;
}

export function RecallQuiz({ engine, chapterId, onQuizComplete }: RecallQuizProps) {
  const [questions, setQuestions] = useState<RecallQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [quizMode, setQuizMode] = useState<'verse' | 'pericope' | 'mixed'>('mixed');

  useEffect(() => {
    loadQuestions();
  }, [quizMode]);

  const loadQuestions = () => {
    const currentVerse = engine.getCurrentVerse(chapterId);
    if (!currentVerse) return;

    let questionsToUse: RecallQuestion[] = [];

    switch (quizMode) {
      case 'verse':
        questionsToUse = engine.getQuestionsFor(chapterId, currentVerse.verse.id);
        break;
      case 'pericope':
        questionsToUse = engine.getQuestionsFor(chapterId, undefined, currentVerse.pericope.id);
        break;
      case 'mixed':
        const verseQuestions = engine.getQuestionsFor(chapterId, currentVerse.verse.id);
        const pericopeQuestions = engine.getQuestionsFor(chapterId, undefined, currentVerse.pericope.id);
        questionsToUse = [...verseQuestions, ...pericopeQuestions];
        break;
    }

    // Shuffle questions
    questionsToUse = questionsToUse.sort(() => Math.random() - 0.5);

    setQuestions(questionsToUse);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(null);
    setScore({ correct: 0, total: 0 });
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSubmit = () => {
    if (!currentQuestion) return;

    const correct = checkAnswer(userAnswer, currentQuestion.answer);
    setIsCorrect(correct);
    setShowAnswer(true);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
    // Simple string comparison for now - could be enhanced with fuzzy matching
    const normalize = (text: string) =>
      text.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

    const userNormalized = normalize(userAnswer);
    const correctNormalized = normalize(correctAnswer);

    // Check if user answer contains the key parts of the correct answer
    const userWords = userNormalized.split(' ');
    const correctWords = correctNormalized.split(' ');

    // For completion questions, require high accuracy
    if (currentQuestion.type === 'completion') {
      return userNormalized === correctNormalized;
    }

    // For other question types, check if key words are present
    const keyWords = correctWords.filter(word => word.length > 3); // Filter out short words
    const matchingWords = keyWords.filter(word =>
      userWords.some(userWord => userWord.includes(word) || word.includes(userWord))
    );

    return matchingWords.length >= Math.ceil(keyWords.length * 0.7); // 70% word match
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(null);
    } else {
      // Quiz complete
      onQuizComplete?.();
    }
  };

  const getQuestionIcon = (type: RecallQuestion['type']) => {
    switch (type) {
      case 'completion': return <Target className="h-4 w-4" />;
      case 'context': return <BookOpen className="h-4 w-4" />;
      case 'meaning': return <HelpCircle className="h-4 w-4" />;
      case 'reference': return <Target className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getQuestionTypeLabel = (type: RecallQuestion['type']) => {
    switch (type) {
      case 'completion': return 'Complete the verse';
      case 'context': return 'Context question';
      case 'meaning': return 'Meaning & application';
      case 'reference': return 'Reference recall';
      default: return 'Question';
    }
  };

  if (!questions.length) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>No Questions Available</CardTitle>
          <CardDescription>
            Continue learning verses to unlock quiz questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Quiz questions will be available once you've started learning verses in this chapter.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setQuizMode('verse')} variant={quizMode === 'verse' ? 'default' : 'outline'}>
                Verse Questions
              </Button>
              <Button onClick={() => setQuizMode('pericope')} variant={quizMode === 'pericope' ? 'default' : 'outline'}>
                Pericope Questions
              </Button>
              <Button onClick={() => setQuizMode('mixed')} variant={quizMode === 'mixed' ? 'default' : 'outline'}>
                Mixed Questions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isQuizComplete = currentQuestionIndex >= questions.length;

  if (isQuizComplete) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          <CardDescription>
            You scored {score.correct} out of {score.total} questions correct
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-blue-600">
              {percentage}%
            </div>
            <Badge variant={percentage >= 80 ? 'default' : percentage >= 60 ? 'secondary' : 'destructive'}>
              {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}
            </Badge>
            <div className="flex gap-2 justify-center">
              <Button onClick={loadQuestions}>
                Try Again
              </Button>
              <Button onClick={onQuizComplete} variant="outline">
                Back to Learning
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quiz Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                onClick={() => setQuizMode('verse')}
                variant={quizMode === 'verse' ? 'default' : 'outline'}
                size="sm"
              >
                Verse
              </Button>
              <Button
                onClick={() => setQuizMode('pericope')}
                variant={quizMode === 'pericope' ? 'default' : 'outline'}
                size="sm"
              >
                Pericope
              </Button>
              <Button
                onClick={() => setQuizMode('mixed')}
                variant={quizMode === 'mixed' ? 'default' : 'outline'}
                size="sm"
              >
                Mixed
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getQuestionIcon(currentQuestion.type)}
            {getQuestionTypeLabel(currentQuestion.type)}
          </CardTitle>
          {score.total > 0 && (
            <CardDescription>
              Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-lg text-blue-900 dark:text-blue-100">
              {currentQuestion.question}
            </p>
          </div>

          {!showAnswer ? (
            <div className="space-y-4">
              {currentQuestion.type === 'completion' ? (
                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type the complete verse here..."
                  className="min-h-[100px]"
                />
              ) : (
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                />
              )}

              <Button
                onClick={handleAnswerSubmit}
                disabled={!userAnswer.trim()}
                className="w-full"
              >
                Submit Answer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className={isCorrect ? 'border-green-500' : 'border-red-500'}>
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium">
                    {isCorrect ? 'Correct!' : 'Not quite right'}
                  </span>
                </div>
                <AlertDescription className="mt-2">
                  <div className="space-y-2">
                    <div>
                      <strong>Your answer:</strong> {userAnswer}
                    </div>
                    <div>
                      <strong>Correct answer:</strong> {currentQuestion.answer}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <Button onClick={handleNextQuestion} className="w-full">
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}