import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { bibleBookChapters } from '@/lib/bibleBooks';
import { NEW_TESTAMENT_BOOKS, OLD_TESTAMENT_BOOKS, BibleVersion } from '@/lib/constants';
import { BookOpen, ArrowRight, X } from 'lucide-react';

interface LibraryOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBook: string;
  currentChapter: number;
  currentVersion: BibleVersion;
  onSelect: (book: string, chapter: number, version: BibleVersion) => void;
}

const LibraryOverlay: React.FC<LibraryOverlayProps> = ({
  open,
  onOpenChange,
  currentBook,
  currentChapter,
  currentVersion,
  onSelect,
}) => {
  const streak = parseInt(localStorage.getItem('readingStreak') || '0', 10);

  const pick = (book: string, chapter = 1) => {
    onSelect(book, chapter, currentVersion);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-none w-screen h-screen p-0 rounded-none border-0 bg-background overflow-y-auto"
      >
        <DialogTitle className="sr-only">Library</DialogTitle>
        <DialogDescription className="sr-only">
          Browse books of the Bible and choose a passage to read.
        </DialogDescription>

        {/* Header */}
        <div className="sticky top-0 z-10 h-14 flex items-center justify-between px-6 md:px-8 bg-background/85 backdrop-blur-[12px]">
          <span className="font-serif italic text-lg text-on-surface tracking-tight">
            Library
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 -mr-2 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Close library"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Resume card */}
        <div className="max-w-3xl mx-auto px-6 md:px-8 pt-8 pb-12">
          <button
            onClick={() => pick(currentBook, currentChapter)}
            className="w-full text-left block bg-surface-container-low rounded-sm p-6 md:p-8 group hover:bg-surface-container transition-colors duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant font-sans mb-2">
                  Continue
                </p>
                <h2 className="font-serif text-2xl md:text-3xl text-on-surface tracking-tight">
                  {currentBook} {currentChapter}
                </h2>
                <p className="text-sm text-on-surface-variant font-sans mt-1">
                  {currentVersion}
                  {streak > 1 && ` · ${streak} day streak`}
                </p>
              </div>
              <div className="p-3 rounded-full bg-surface-container group-hover:bg-surface-container-high transition-colors duration-300">
                <BookOpen className="h-5 w-5 text-on-surface-variant" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-on-surface-variant font-sans">
              <span>Resume reading</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </div>

        {/* Book grids */}
        <div className="max-w-3xl mx-auto px-6 md:px-8 pb-24">
          <p className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant font-sans mb-6">
            New Testament
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-4 mb-12">
            {NEW_TESTAMENT_BOOKS.map((book) => (
              <button
                key={book}
                onClick={() => pick(book)}
                className="text-left group transition-opacity duration-300 hover:opacity-70"
              >
                <p className="font-serif text-sm text-on-surface tracking-tight leading-tight">
                  {book}
                </p>
                <p className="text-[11px] text-on-surface-variant font-sans mt-0.5">
                  {bibleBookChapters[book]} ch.
                </p>
              </button>
            ))}
          </div>

          <p className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant font-sans mb-6">
            Old Testament
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-4">
            {OLD_TESTAMENT_BOOKS.map((book) => (
              <button
                key={book}
                onClick={() => pick(book)}
                className="text-left group transition-opacity duration-300 hover:opacity-70"
              >
                <p className="font-serif text-sm text-on-surface tracking-tight leading-tight">
                  {book}
                </p>
                <p className="text-[11px] text-on-surface-variant font-sans mt-0.5">
                  {bibleBookChapters[book]} ch.
                </p>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LibraryOverlay;
