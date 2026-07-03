import { Trophy, Star, Crown, Gem, Sparkles, Medal, BookOpen } from 'lucide-react';

interface MilestoneBadgeProps {
  completedPassages: number;
  masteredVerses: number;
}

interface Milestone {
  icon: React.ReactNode;
  label: string;
}

function getHighestMilestone(completedPassages: number, masteredVerses: number): Milestone | null {
  // Ordered highest to lowest
  if (completedPassages >= 25) return { icon: <Crown className="w-4 h-4" />, label: '25 Chapters' };
  if (completedPassages >= 12) return { icon: <Gem className="w-4 h-4" />, label: '12 Chapters' };
  if (completedPassages >= 5) return { icon: <Sparkles className="w-4 h-4" />, label: '5 Chapters' };
  if (completedPassages >= 2) return { icon: <Medal className="w-4 h-4" />, label: '2 Chapters' };
  if (completedPassages >= 1) return { icon: <Trophy className="w-4 h-4" />, label: 'Chapter Complete' };
  if (masteredVerses >= 1) return { icon: <Star className="w-4 h-4" />, label: 'First Verse' };
  return null;
}

export function MilestoneBadge({ completedPassages, masteredVerses }: MilestoneBadgeProps) {
  const milestone = getHighestMilestone(completedPassages, masteredVerses);
  if (!milestone) return null;

  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-practice/15 text-practice text-caption font-medium">
      {milestone.icon}
      <span>{milestone.label}</span>
    </div>
  );
}
