import { CheckCircle, Clock, RotateCcw, GripVertical, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Passage } from '@/types/passage';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface PassageCardProps {
  passage: Passage;
  onSettingsClick: (passage: Passage) => void;
  onClick: (passage: Passage) => void;
  sortMode?: 'biblical' | 'date' | 'manual';
  dragListeners?: SyntheticListenerMap;
}

export function PassageCard({ passage, onSettingsClick, onClick, sortMode, dragListeners }: PassageCardProps) {
  const totalVerses = passage.verseEnd - passage.verseStart + 1;
  const completedVerses = Math.max(0, passage.currentVerse - passage.verseStart);
  const progressPercent = Math.round((completedVerses / totalVerses) * 100);

  const getReference = () => {
    if (passage.verseStart === 1) {
      return `${passage.book} ${passage.chapter}`;
    }
    if (passage.verseStart === passage.verseEnd) {
      return `${passage.book} ${passage.chapter}:${passage.verseStart}`;
    }
    return `${passage.book} ${passage.chapter}:${passage.verseStart}-${passage.verseEnd}`;
  };

  const statusConfig = {
    in_progress: {
      label: 'In Progress',
      icon: Clock,
      className: 'bg-warning/15 text-warning-foreground border-warning/30',
    },
    ready_for_review: {
      label: 'Review',
      icon: RotateCcw,
      className: 'bg-info/15 text-info border-info/30',
    },
    mastered: {
      label: 'Mastered',
      icon: CheckCircle,
      className: 'bg-success/15 text-success border-success/30',
    },
  };

  const status = statusConfig[passage.status];
  const StatusIcon = status.icon;

  const getLastPracticed = () => {
    if (!passage.updatedAt) return null;
    const date = new Date(passage.updatedAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const lastPracticed = getLastPracticed();
  const tags = passage.tags ?? [];

  return (
    <div 
      className="group relative bg-card rounded-lg border border-border/60 p-4 cursor-pointer transition-all hover:border-practice/40 hover:shadow-elevation-1 flex"
      onClick={() => onClick(passage)}
    >
      {/* Drag handle - only in manual mode */}
      {sortMode === 'manual' && (
        <div
          className="flex items-center mr-3 -ml-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
          onClick={(e) => e.stopPropagation()}
          {...dragListeners}
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Settings button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-accent"
          onClick={(e) => {
            e.stopPropagation();
            onSettingsClick(passage);
          }}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </Button>

        {/* Reference and version */}
        <div className="flex items-start gap-2 mb-3 pr-8">
          <h3 className="font-semibold text-foreground leading-tight">
            {getReference()}
          </h3>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-medium text-muted-foreground border-muted shrink-0">
            {passage.versionAbbreviation ?? 'KJV'}
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-caption text-muted-foreground">
              {completedVerses} of {totalVerses} verses
            </span>
            <span className="text-caption font-medium text-foreground">
              {progressPercent}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Status and last practiced */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${status.className}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
          {lastPracticed && (
            <span className="text-caption text-muted-foreground">
              {lastPracticed}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
