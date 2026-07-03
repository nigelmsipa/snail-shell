import { useCallback, useMemo } from 'react';
import { BookOpen, Check, Lock } from 'lucide-react';
import { VerseProgress } from '@/types/passage';

interface Verse {
  verse: number;
  text: string;
}

interface Pericope {
  id: string;
  name: string;
  verseStart: number;
  verseEnd: number;
}

interface ProgressRailProps {
  verses: Verse[];
  pericopes: Pericope[];
  verseProgress: Record<number, VerseProgress>;
  activeVerseNum: number;
  currentVerse: number;
  onVerseSelect: (verseNum: number) => void;
  onRecitation: (pericopeId: string) => void;
}

export function ProgressRail({
  verses,
  pericopes,
  verseProgress,
  activeVerseNum,
  currentVerse,
  onVerseSelect,
  onRecitation,
}: ProgressRailProps) {
  const isVerseLocked = useCallback((verseNum: number) => {
    const progress = verseProgress[verseNum];
    return verseNum > currentVerse + 1 && !progress?.retrievalPassed;
  }, [verseProgress, currentVerse]);

  const groups = useMemo(() => {
    if (pericopes.length === 0) {
      return [{ pericope: null as Pericope | null, verses }];
    }
    return pericopes.map((pericope) => ({
      pericope,
      verses: verses.filter((v) => v.verse >= pericope.verseStart && v.verse <= pericope.verseEnd),
    }));
  }, [pericopes, verses]);

  const isSectionComplete = useCallback((pericopeId: string) => {
    try {
      return localStorage.getItem(`boss-mastered-${pericopeId}`) === 'true';
    } catch {
      return false;
    }
  }, []);

  return (
    <div className="mb-6 space-y-4">
      {groups.map((group) => {
        const total = group.verses.length;
        const passedCount = group.verses.filter((v) => verseProgress[v.verse]?.retrievalPassed).length;
        const allPassed = total > 0 && passedCount === total;
        const completed = group.pericope ? isSectionComplete(group.pericope.id) : false;
        const recitationReady = allPassed && !!group.pericope && !completed;
        const containsActive = group.verses.some((v) => v.verse === activeVerseNum);

        const startV = group.verses[0]?.verse;
        const endV = group.verses[group.verses.length - 1]?.verse;
        const title = group.pericope?.name ?? (
          startV && endV ? `Verses ${startV}\u2013${endV}` : 'Passage'
        );

        return (
          <div
            key={group.pericope?.id ?? 'all'}
            className={
              'rounded-xl border p-3 transition-colors ' +
              (completed
                ? 'border-success/20 bg-success/5'
                : containsActive
                  ? 'border-primary/20 bg-primary/5'
                  : 'border-border/50 bg-card/50')
            }
          >
            {/* Section header */}
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <h3 className="text-sm font-medium text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground">
                  {passedCount}/{total} learned
                  {completed && ' \u00b7 Memorized'}
                </p>
              </div>
            </div>

            {/* Verse buttons */}
            <div className="flex flex-wrap gap-1.5">
              {group.verses.map((verse) => {
                const locked = isVerseLocked(verse.verse);
                const passed = verseProgress[verse.verse]?.retrievalPassed;
                const isActive = verse.verse === activeVerseNum;
                const canTap = !locked;

                return (
                  <button
                    key={verse.verse}
                    type="button"
                    disabled={!canTap}
                    onClick={() => canTap && onVerseSelect(verse.verse)}
                    className={
                      'h-8 min-w-8 rounded-lg border px-2 text-xs font-semibold tabular-nums transition-all ' +
                      (isActive
                        ? 'border-primary bg-primary text-primary-foreground'
                        : passed
                          ? 'border-success/20 bg-success/10 text-success'
                          : locked
                            ? 'border-border/30 bg-muted/15 text-muted-foreground/30'
                            : 'border-border/50 bg-background text-foreground hover:border-primary/30 hover:bg-primary/5')
                    }
                    aria-label={`Verse ${verse.verse}`}
                  >
                    {verse.verse}
                  </button>
                );
              })}
            </div>

            {/* Recitation link */}
            {group.pericope && (
              <button
                type="button"
                onClick={() => recitationReady && onRecitation(group.pericope!.id)}
                disabled={!recitationReady}
                className={
                  'mt-2.5 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors ' +
                  (completed
                    ? 'border-success/20 text-success'
                    : recitationReady
                      ? 'border-primary/25 text-primary hover:bg-primary/5'
                      : 'border-border/30 text-muted-foreground/50')
                }
              >
                <span className="font-medium">
                  {completed
                    ? 'Section memorized'
                    : recitationReady
                      ? 'Recite full section'
                      : `${total - passedCount} more to recite`}
                </span>
                {completed ? (
                  <Check className="w-3.5 h-3.5" />
                ) : recitationReady ? (
                  <BookOpen className="w-3.5 h-3.5" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
