
import { getAvailableChapters } from '@/data/bibleStructure';

interface ChapterSelectionStepProps {
  book: string;
  onSelect: (chapter: number) => void;
}

export function ChapterSelectionStep({ book, onSelect }: ChapterSelectionStepProps) {
  const chapters = getAvailableChapters(book);

  return (
    <div className="h-full max-h-full">
      <div className="h-full overflow-y-auto pr-4">
        <div className="grid grid-cols-8 gap-2">
          {chapters.map((chapter) => (
            <button
              key={chapter}
              onClick={() => onSelect(chapter)}
              className="aspect-square flex items-center justify-center rounded border border-border hover:border-foreground hover:bg-muted font-medium text-xs transition-colors"
            >
              {chapter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
