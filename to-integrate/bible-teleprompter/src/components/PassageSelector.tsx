import React, { useState, useMemo } from 'react';
import { bibleBookChapters } from '@/lib/bibleBooks';
import { OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS, BIBLE_VERSIONS, BibleVersion } from '@/lib/constants';
import { X, Search } from 'lucide-react';

interface PassageSelectorProps {
  selectedBook: string;
  startChapter: number;
  selectedVersion: BibleVersion;
  onSelect: (book: string, chapter: number, version: BibleVersion) => void;
}

const PassageSelector: React.FC<PassageSelectorProps> = ({
  selectedBook,
  startChapter,
  selectedVersion,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [testament, setTestament] = useState<'new' | 'old'>('new');
  const [tempBook, setTempBook] = useState(selectedBook);
  const [tempVersion, setTempVersion] = useState<BibleVersion>(selectedVersion);
  const [search, setSearch] = useState('');

  const books = testament === 'old' ? OLD_TESTAMENT_BOOKS : NEW_TESTAMENT_BOOKS;
  const totalChapters = bibleBookChapters[tempBook] || 1;

  const filteredBooks = useMemo(() => {
    if (!search.trim()) return books;
    const q = search.toLowerCase();
    return books.filter((b) => b.toLowerCase().includes(q));
  }, [books, search]);

  const handleOpen = () => {
    setTempBook(selectedBook);
    setTempVersion(selectedVersion);
    setSearch('');
    setOpen(true);
  };

  const handleChapterClick = (chapter: number) => {
    onSelect(tempBook, chapter, tempVersion);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 text-sm font-sans text-on-surface hover:text-on-surface-variant transition-colors duration-300"
      >
        <span className="font-serif">{selectedBook} {startChapter}</span>
        <span className="text-on-surface-variant">·</span>
        <span className="text-xs tracking-wide text-on-surface-variant">{selectedVersion}</span>
      </button>

      {/* Full-screen overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col">
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-5 right-6 p-2 text-on-surface-variant hover:text-on-surface transition-colors duration-300 z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Search bar */}
          <div className="flex justify-center pt-16 md:pt-20 px-6">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Jump to Book, Chapter, or Verse..."
                className="w-full bg-surface-container-high/60 backdrop-blur-sm rounded-sm px-5 py-4 pr-12 font-serif text-lg text-on-surface placeholder:text-on-surface-variant/50 outline-none border-none"
                autoFocus
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant/50" />
            </div>
          </div>

          {/* Version chips */}
          <div className="flex justify-center gap-2 mt-6 px-6">
            {BIBLE_VERSIONS.map((v) => (
              <button
                key={v.abbreviation}
                onClick={() => setTempVersion(v.abbreviation)}
                className={`px-3 py-1.5 rounded-full text-xs tracking-wide font-sans transition-all duration-300 ${
                  tempVersion === v.abbreviation
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {v.abbreviation}
              </button>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="flex-1 flex justify-center px-6 mt-8 overflow-hidden">
            <div className="w-full max-w-3xl flex gap-4 md:gap-6 min-h-0">
              {/* Books panel */}
              <div className="flex-1 bg-surface-container-low/60 rounded-sm p-5 md:p-6 overflow-y-auto">
                <p className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant font-sans mb-4">
                  Testament
                </p>
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setTestament('new')}
                    className={`px-4 py-2 rounded-full text-xs tracking-wide font-sans transition-all duration-300 ${
                      testament === 'new'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setTestament('old')}
                    className={`px-4 py-2 rounded-full text-xs tracking-wide font-sans transition-all duration-300 ${
                      testament === 'old'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    Old
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {filteredBooks.map((book) => (
                    <button
                      key={book}
                      onClick={() => setTempBook(book)}
                      className={`text-left py-1.5 font-serif text-base tracking-tight transition-all duration-200 ${
                        tempBook === book
                          ? 'text-on-surface font-bold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {book}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chapters panel */}
              <div className="w-56 md:w-64 bg-surface-container-low/60 rounded-sm p-5 md:p-6 overflow-y-auto flex-shrink-0">
                <p className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant font-sans mb-4">
                  Chapters
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => handleChapterClick(ch)}
                      className={`aspect-square flex items-center justify-center font-serif text-sm rounded-sm transition-all duration-200 ${
                        ch === startChapter && tempBook === selectedBook
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-outline-variant/10 px-6 py-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant font-sans">
                  Current Reading
                </p>
                <p className="font-serif text-base text-on-surface mt-0.5">
                  {selectedBook} {startChapter}
                </p>
              </div>
              <p className="text-sm text-on-surface-variant font-sans">
                Chapter {startChapter} of {bibleBookChapters[selectedBook] || 1}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PassageSelector;
