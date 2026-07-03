import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bible, BookKey } from "@/data/bible";
import { getChapterStatuses, recordAttempt } from "@/lib/progress";
import { recordSessionComplete } from "@/lib/userState";
import { VerseRenderer } from "./VerseRenderer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Target, 
  TrendingUp, 
  RotateCcw, 
  Home, 
  Play, 
  Pause,
  ChevronLeft,
  ChevronRight,
  Award,
  Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EnhancedTypingSessionProps {
  book: BookKey;
  chapter: number;
  focusVerseNumber: number;
  mode?: "standard" | "focus" | "build";
}

export const EnhancedTypingSession = ({ 
  book, 
  chapter, 
  focusVerseNumber,
  mode = "standard"
}: EnhancedTypingSessionProps) => {
  const navigate = useNavigate();
  const verses = bible[book][chapter];
  const [round, setRound] = useState(1);
  const [verseIndex, setVerseIndex] = useState(focusVerseNumber - 1);
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [memoryHintVisible, setMemoryHintVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    versesCompleted: 0,
    totalAccuracy: 0,
    bestWpm: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const target = verses[verseIndex];
  const memoryMode = round === 4 && mode !== "focus";

  useEffect(() => {
    inputRef.current?.focus();
    if (!sessionStartedAt) setSessionStartedAt(Date.now());
  }, []);

  useEffect(() => {
    if (round === 4 && verseIndex === 0) {
      setMemoryHintVisible(true);
      const t = setTimeout(() => setMemoryHintVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [round, verseIndex]);

  const progress = target.length ? typed.length / target.length : 0;
  const accuracy = (correct + errors) > 0 ? correct / (correct + errors) : 1;
  const wpm = useMemo(() => {
    if (!startedAt || isPaused) return 0;
    const elapsedMin = (Date.now() - startedAt) / 60000;
    const chars = correct + errors;
    return elapsedMin > 0 ? (chars / 5) / elapsedMin : 0;
  }, [startedAt, correct, errors, isPaused]);

  const timeElapsed = sessionStartedAt && !isPaused ? 
    Math.floor((Date.now() - sessionStartedAt) / 1000) : 0;

  const statuses = getChapterStatuses(book, chapter, verses.length);

  const handleFocus = () => inputRef.current?.focus();

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      inputRef.current?.focus();
    }
  };

  const handleRestart = () => {
    setTyped("");
    setErrors(0);
    setCorrect(0);
    setStartedAt(null);
    inputRef.current?.focus();
  };

  const handleSkipVerse = () => {
    if (verseIndex < verses.length - 1) {
      setVerseIndex(prev => prev + 1);
      setTyped("");
      setErrors(0);
      setCorrect(0);
      setStartedAt(null);
    }
  };

  const handlePreviousVerse = () => {
    if (verseIndex > 0) {
      setVerseIndex(prev => prev - 1);
      setTyped("");
      setErrors(0);
      setCorrect(0);
      setStartedAt(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (completed || isPaused) return;
    if (!startedAt) setStartedAt(Date.now());

    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      if (typed.length === 0) return;
      const newTyped = typed.slice(0, -1);
      setTyped(newTyped);
      let c = 0, er = 0;
      for (let i = 0; i < newTyped.length; i++) {
        if (newTyped[i] === target[i]) c++;
        else er++;
      }
      setCorrect(c);
      setErrors(er);
      return;
    }
    
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      if (typed.length >= target.length) return;
      
      const ch = e.key;
      const at = typed.length;
      const isCorrect = ch === target[at];
      setTyped((t) => t + ch);
      
      if (isCorrect) setCorrect((c) => c + 1);
      else setErrors((er) => er + 1);

      const willComplete = at + 1 === target.length;
      if (willComplete) {
        const finalAccuracy = (isCorrect ? correct + 1 : correct) / (correct + errors + 1);
        const memSuccess = memoryMode && finalAccuracy === 1;
        
        recordAttempt({ book, chapter, verseIndex }, finalAccuracy, memSuccess);
        
        // Update session stats
        setSessionStats(prev => ({
          versesCompleted: prev.versesCompleted + 1,
          totalAccuracy: (prev.totalAccuracy * prev.versesCompleted + finalAccuracy) / (prev.versesCompleted + 1),
          bestWpm: Math.max(prev.bestWpm, wpm),
        }));

        setTimeout(() => {
          if (mode === "focus") {
            setCompleted(true);
            const sessionDuration = sessionStartedAt ? 
              Math.floor((Date.now() - sessionStartedAt) / 60000) : 0;
            recordSessionComplete(sessionDuration, finalAccuracy);
            toast({ 
              title: "Verse completed!", 
              description: `${Math.round(finalAccuracy * 100)}% accuracy`
            });
          } else {
            if (verseIndex < verses.length - 1) {
              setVerseIndex((v) => v + 1);
            } else if (round < 4) {
              setRound((r) => r + 1);
              setVerseIndex(0);
              toast({ 
                title: `Round ${round + 1} complete!`, 
                description: "Moving to next round" 
              });
            } else {
              setCompleted(true);
              const sessionDuration = sessionStartedAt ? 
                Math.floor((Date.now() - sessionStartedAt) / 60000) : 0;
              recordSessionComplete(sessionDuration, sessionStats.totalAccuracy);
              toast({ 
                title: "Session complete! 🎉", 
                description: "Amazing progress!" 
              });
            }
          }
          setTyped("");
          setErrors(0);
          setCorrect(0);
          setStartedAt(null);
        }, 150);
      }
    }
  };

  const renderModeIndicator = () => {
    const modeConfig = {
      standard: { label: "Standard", color: "bg-blue-100 text-blue-800", icon: Target },
      focus: { label: "Focus", color: "bg-purple-100 text-purple-800", icon: Zap },
      build: { label: "Build", color: "bg-green-100 text-green-800", icon: Award },
    };
    
    const config = modeConfig[mode];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === "focus" ? "Verse Mastered!" : "Session Complete!"}
            </h2>
            <p className="text-gray-600">Excellent work on your Scripture typing!</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {Math.round(sessionStats.totalAccuracy * 100)}%
              </p>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {sessionStats.versesCompleted}
              </p>
              <p className="text-sm text-gray-600">Verses</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={() => navigate("/")} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Practice Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div ref={containerRef} className="container mx-auto max-w-4xl px-4 py-8" onClick={handleFocus}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Home
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {book.charAt(0).toUpperCase() + book.slice(1)} {chapter}:{verseIndex + 1}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {renderModeIndicator()}
                {mode !== "focus" && (
                  <Badge variant="outline">
                    Round {round}/4
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={togglePause}
              disabled={!startedAt}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{Math.round(accuracy * 100)}%</p>
                <p className="text-xs text-gray-600">Accuracy</p>
              </div>
              <div className="text-center">
                <Zap className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{Math.max(0, Math.round(wpm))}</p>
                <p className="text-xs text-gray-600">WPM</p>
              </div>
              <div className="text-center">
                <Target className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{Math.round(progress * 100)}%</p>
                <p className="text-xs text-gray-600">Progress</p>
              </div>
              <div className="text-center">
                <Clock className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">
                  {timeElapsed > 0 ? `${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}` : '0:00'}
                </p>
                <p className="text-xs text-gray-600">Time</p>
              </div>
              <div className="text-center">
                <span className="text-red-600 text-xl font-bold mx-auto mb-1">⚠</span>
                <p className="text-2xl font-bold text-gray-900">{errors}</p>
                <p className="text-xs text-gray-600">Errors</p>
              </div>
            </div>
            
            <div className="mt-4">
              <Progress value={progress * 100} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Verse Navigation */}
        {mode !== "focus" && verses.length > 1 && (
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePreviousVerse}
              disabled={verseIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <span className="text-sm text-gray-600">
              Verse {verseIndex + 1} of {verses.length}
            </span>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSkipVerse}
              disabled={verseIndex === verses.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Main Typing Area */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200">
          <div className="p-8">
            {memoryHintVisible && (
              <div
                className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 animate-in fade-in duration-300"
                onClick={() => setMemoryHintVisible(false)}
              >
                🧠 <strong>Memory mode:</strong> Underscores represent letters, ▲ marks capitals, punctuation is highlighted. You've got this!
              </div>
            )}
            
            {isPaused && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <Pause className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-yellow-800 font-medium">Session Paused</p>
                <p className="text-sm text-yellow-700">Click the play button to continue</p>
              </div>
            )}
            
            <VerseRenderer 
              text={target} 
              typed={typed} 
            />
            
            <input
              ref={inputRef}
              className="sr-only"
              onKeyDown={handleKeyDown}
              onPaste={(e) => e.preventDefault()}
              disabled={isPaused}
              aria-hidden
            />
          </div>
        </Card>

        {/* Chapter Progress */}
        {mode !== "focus" && (
          <div className="mt-6">
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Chapter Progress</h3>
              <div className="flex gap-1">
                {statuses.map((status, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-sm ${
                      i === verseIndex ? "ring-2 ring-blue-500" :
                      status === "mastered" ? "bg-green-500" :
                      status === "practicing" ? "bg-yellow-500" :
                      "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};