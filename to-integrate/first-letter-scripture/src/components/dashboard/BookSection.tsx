import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { BookCard } from './BookCard';
import { useState } from 'react';

interface Book {
  book_number: number;
  name: string;
  total_chapters: number;
  chapters_with_pericopes: number;
  pericope_count: number;
}

interface BookSectionProps {
  title: string;
  books: Book[];
}

export function BookSection({ title, books }: BookSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const totalChapters = books.reduce((sum, b) => sum + b.total_chapters, 0);
  const coveredChapters = books.reduce((sum, b) => sum + b.chapters_with_pericopes, 0);
  const sectionProgress = totalChapters > 0 ? (coveredChapters / totalChapters) * 100 : 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-accent/5 transition-colors">
          <div className="flex items-center gap-4">
            <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">
                {books.length} books • {coveredChapters}/{totalChapters} chapters ({sectionProgress.toFixed(0)}%)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${sectionProgress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground min-w-[3rem] text-right">
              {sectionProgress.toFixed(0)}%
            </span>
          </div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pl-9">
          {books.map((book) => (
            <BookCard
              key={book.book_number}
              name={book.name}
              totalChapters={book.total_chapters}
              chaptersWithPericopes={book.chapters_with_pericopes}
              pericopeCount={book.pericope_count}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
