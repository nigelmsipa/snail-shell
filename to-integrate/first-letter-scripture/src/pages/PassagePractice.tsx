import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { usePassageWithVerses } from '@/hooks/usePassageWithVerses';
import { PosterView } from '@/components/practice/PosterView';

export default function PassagePractice() {
  const { passageId } = useParams<{ passageId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { passage, verses, pericopes, verseProgress, isLoading, recordEncodingRep, recordRetrievalAttempt } = usePassageWithVerses(
    user?.id,
    passageId
  );

  const [activeVerseNumber, setActiveVerseNumber] = useState<number | null>(null);

  useEffect(() => {
    if (passage && activeVerseNumber === null) {
      setActiveVerseNumber(passage.currentVerse);
    }
  }, [passage, activeVerseNumber]);

  const chapterProgress = useMemo(() => {
    if (!verses.length) return 0;
    const mastered = verses.filter((v) => verseProgress[v.verse]?.retrievalPassed).length;
    return Math.round((mastered / verses.length) * 100);
  }, [verses, verseProgress]);

  if (isLoading || !passage || !passageId) {
    return null;
  }

  const getReference = () => {
    if (passage.verseStart === passage.verseEnd) {
      return passage.book + ' ' + passage.chapter + ':' + passage.verseStart;
    }
    return passage.book + ' ' + passage.chapter;
  };

  const activePos = activeVerseNumber
    ? verses.findIndex((v) => v.verse === activeVerseNumber) + 1
    : 1;

  const handleEncodingRep = (verseNumber: number, difficulty: string) => {
    if (!passageId) return;
    recordEncodingRep({ verseNumber, difficulty });
  };

  const handleRetrievalAttempt = (verseNumber: number, passed: boolean) => {
    if (!passageId) return;
    recordRetrievalAttempt({ verseNumber, passed });
  };

  const handleVerseSelect = (verseNum: number) => {
    const progress = verseProgress[verseNum];
    const isAllowed = verseNum <= passage.currentVerse + 1 || progress?.retrievalPassed;
    if (isAllowed) {
      setActiveVerseNumber(verseNum);
    }
  };

  const reference = getReference();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-8 w-8 shrink-0 hover:bg-muted/50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-sm font-semibold text-foreground truncate">
              {reference}
            </h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-muted-foreground tabular-nums">
              {activePos}/{verses.length}
            </span>
            <Badge variant="outline" className="text-[10px] font-medium border-muted">
              {passage.versionAbbreviation ?? 'KJV'}
            </Badge>
          </div>
        </div>
        <Progress value={chapterProgress} className="h-0.5 rounded-none" />
      </header>

      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-6">
        <PosterView
          verses={verses}
          pericopes={pericopes}
          verseProgress={verseProgress}
          activeVerseNum={activeVerseNumber ?? passage.verseStart}
          currentVerse={passage.currentVerse}
          userId={user?.id}
          onVerseSelect={handleVerseSelect}
          onEncodingRep={handleEncodingRep}
          onRetrievalAttempt={handleRetrievalAttempt}
        />
      </main>
    </div>
  );
}
