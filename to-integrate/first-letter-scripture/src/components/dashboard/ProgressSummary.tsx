import { BookOpen, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProgressSummaryProps {
  totalBooks: number;
  completedBooks: number;
  totalChapters: number;
  coveredChapters: number;
  totalPericopes: number;
}

export function ProgressSummary({
  totalBooks,
  completedBooks,
  totalChapters,
  coveredChapters,
  totalPericopes,
}: ProgressSummaryProps) {
  const overallProgress = totalChapters > 0 ? (coveredChapters / totalChapters) * 100 : 0;
  const remainingChapters = totalChapters - coveredChapters;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Old Testament Pericope Import Status</h2>
        <p className="text-muted-foreground">Track completion across all 39 OT books</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-foreground font-medium">Overall Progress</span>
          <span className="text-muted-foreground">{overallProgress.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {coveredChapters} of {totalChapters} chapters covered
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedBooks}/{totalBooks}</p>
              <p className="text-xs text-muted-foreground">Books Complete</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{coveredChapters}</p>
              <p className="text-xs text-muted-foreground">Chapters Covered</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <FileText className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalPericopes}</p>
              <p className="text-xs text-muted-foreground">Pericopes Imported</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{remainingChapters}</p>
              <p className="text-xs text-muted-foreground">Chapters Remaining</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
