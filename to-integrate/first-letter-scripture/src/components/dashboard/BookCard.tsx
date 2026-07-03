import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, Circle, XCircle } from 'lucide-react';

interface BookCardProps {
  name: string;
  totalChapters: number;
  chaptersWithPericopes: number;
  pericopeCount: number;
}

export function BookCard({
  name,
  totalChapters,
  chaptersWithPericopes,
  pericopeCount,
}: BookCardProps) {
  const progress = totalChapters > 0 ? (chaptersWithPericopes / totalChapters) * 100 : 0;
  
  const getStatusColor = () => {
    if (progress === 100) return 'bg-success';
    if (progress >= 75) return 'bg-info';
    if (progress >= 50) return 'bg-warning';
    if (progress > 0) return 'bg-warning';
    return 'bg-muted';
  };

  const getStatusIcon = () => {
    if (progress === 100) return <CheckCircle2 className="h-4 w-4 text-success" />;
    if (progress >= 50) return <AlertTriangle className="h-4 w-4 text-warning" />;
    if (progress > 0) return <XCircle className="h-4 w-4 text-warning" />;
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (progress === 100) return 'Complete';
    if (progress >= 50) return 'In Progress';
    if (progress > 0) return 'Started';
    return 'Not Started';
  };

  return (
    <Card className="p-4 border-border bg-card hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {chaptersWithPericopes}/{totalChapters} chapters
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-xs font-medium text-muted-foreground">
              {getStatusText()}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${getStatusColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
            <span className="text-xs font-medium text-accent">
              {pericopeCount} pericopes
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
