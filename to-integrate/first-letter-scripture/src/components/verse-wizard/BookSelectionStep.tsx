import { useState } from 'react';
import { Input } from '@/components/ui/input';

import { BIBLE_STRUCTURE } from '@/data/bibleStructure';
import { Search } from 'lucide-react';

interface BookSelectionStepProps {
  onSelect: (book: string) => void;
}

const OLD_TESTAMENT_BOOKS = BIBLE_STRUCTURE.slice(0, 39).map(b => b.name);
const NEW_TESTAMENT_BOOKS = BIBLE_STRUCTURE.slice(39).map(b => b.name);

export function BookSelectionStep({ onSelect }: BookSelectionStepProps) {
  const [search, setSearch] = useState('');

  const filterBooks = (books: string[]) => {
    return books.filter(book =>
      book.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredOT = filterBooks(OLD_TESTAMENT_BOOKS);
  const filteredNT = filterBooks(NEW_TESTAMENT_BOOKS);

  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="relative mb-4 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-sm border-border rounded-md"
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-4">
        <div className="space-y-6">
          {filteredOT.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Old Testament
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {filteredOT.map((book) => (
                  <button
                    key={book}
                    onClick={() => onSelect(book)}
                    className="px-3 py-2.5 text-xs text-left rounded border border-border hover:border-foreground hover:bg-muted font-medium transition-colors"
                  >
                    {book}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNT.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                New Testament
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {filteredNT.map((book) => (
                  <button
                    key={book}
                    onClick={() => onSelect(book)}
                    className="px-3 py-2.5 text-xs text-left rounded border border-border hover:border-foreground hover:bg-muted font-medium transition-colors"
                  >
                    {book}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredOT.length === 0 && filteredNT.length === 0 && (
            <p className="text-center text-muted-foreground py-12 text-xs">
              No books found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
