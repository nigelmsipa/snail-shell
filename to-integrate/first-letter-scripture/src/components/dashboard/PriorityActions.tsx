import { Card } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface PriorityItem {
  level: 'critical' | 'high' | 'medium' | 'future';
  book: string;
  message: string;
}

interface PriorityActionsProps {
  books: Array<{
    name: string;
    total_chapters: number;
    chapters_with_pericopes: number;
  }>;
}

export function PriorityActions({ books }: PriorityActionsProps) {
  const priorities: PriorityItem[] = [];

  books.forEach(book => {
    const missing = book.total_chapters - book.chapters_with_pericopes;
    const progress = book.total_chapters > 0 ? (book.chapters_with_pericopes / book.total_chapters) * 100 : 0;

    if (progress === 0 && book.total_chapters > 20) {
      priorities.push({
        level: 'critical',
        book: book.name,
        message: `${book.total_chapters} chapters need import`,
      });
    } else if (missing > 10) {
      priorities.push({
        level: 'high',
        book: book.name,
        message: `${missing} chapters missing`,
      });
    } else if (missing > 0 && missing <= 10) {
      priorities.push({
        level: 'medium',
        book: book.name,
        message: `${missing} chapter${missing === 1 ? '' : 's'} missing`,
      });
    }
  });

  if (priorities.length === 0) {
    return null;
  }

  const getIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'critical': return 'Critical';
      case 'high': return 'High Priority';
      case 'medium': return 'Medium';
      default: return 'Future';
    }
  };

  return (
    <Card className="p-6 border-border bg-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Priority Actions</h3>
      <div className="space-y-3">
        {priorities.slice(0, 10).map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-accent/5 rounded-lg">
            {getIcon(item.level)}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  {getLevelLabel(item.level)}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {item.book}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
