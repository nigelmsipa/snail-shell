import React from 'react';
import { Link } from 'react-router-dom';
import { bibleBookChapters } from '@/lib/bibleBooks';
import { NEW_TESTAMENT_BOOKS, OLD_TESTAMENT_BOOKS } from '@/lib/constants';
import { BookOpen, ArrowRight } from 'lucide-react';

const Library: React.FC = () => {
  const lastBook = localStorage.getItem('bibleBook') || 'John';
  const lastChapter = parseInt(localStorage.getItem('bibleStartChapter') || '1', 10);
  const lastVersion = localStorage.getItem('bibleVersion') || 'KJV';
  const streak = parseInt(localStorage.getItem('readingStreak') || '0', 10);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="h-14 flex items-center justify-between px-6 md:px-8 border-b border-outline-variant/10">
        <span className="font-serif italic text-lg text-on-surface tracking-tight">
          Digital Vellum
        </span>
        <Link
          to="/reading"
          className="text-sm font-sans text-on-surface-variant hover:text-on-surface transition-colors duration-300"
        >
          Reader
        </Link>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-12">
        <p className="text-[10px] tracking-[0.4em] uppercase text-on-surface-variant font-sans mb-3">
          Open Source Bible Reader
        </p>
        <h1 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-on-surface tracking-tight mb-4">
          Digital Vellum
        </h1>
        <p className="text-on-surface-variant font-sans text-sm max-w-md leading-relaxed">
          A beautiful, distraction-free reader for open-source Bible translations.
          KJV · BSB · MSV · WEB
        </p>
      </div>

      {/* Resume Reading Card */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 pb-16">
        <Link
          to="/reading"
          className="block bg-surface-container-low rounded-sm p-6 md:p-8 group hover:bg-surface-container transition-colors duration-300"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant font-sans mb-2">
                Resume Reading
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-on-surface tracking-tight">
                {lastBook} {lastChapter}
              </h2>
              <p className="text-sm text-on-surface-variant font-sans mt-1">
                {lastVersion}
                {streak > 1 && ` · ${streak} day streak`}
              </p>
            </div>
            <div className="p-3 rounded-full bg-surface-container group-hover:bg-surface-container-high transition-colors duration-300">
              <BookOpen className="h-5 w-5 text-on-surface-variant" />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-on-surface-variant font-sans">
            <span>Continue reading</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </Link>
      </div>

      {/* Book Grid */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 pb-24">
        <p className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant font-sans mb-6">
          New Testament
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-4 mb-12">
          {NEW_TESTAMENT_BOOKS.map((book) => (
            <Link
              key={book}
              to="/reading"
              onClick={() => {
                localStorage.setItem('bibleBook', book);
                localStorage.setItem('bibleStartChapter', '1');
              }}
              className="group transition-opacity duration-300 hover:opacity-70"
            >
              <p className="font-serif text-sm text-on-surface tracking-tight leading-tight">
                {book}
              </p>
              <p className="text-[11px] text-on-surface-variant font-sans mt-0.5">
                {bibleBookChapters[book]} ch.
              </p>
            </Link>
          ))}
        </div>

        <p className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant font-sans mb-6">
          Old Testament
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-4">
          {OLD_TESTAMENT_BOOKS.map((book) => (
            <Link
              key={book}
              to="/reading"
              onClick={() => {
                localStorage.setItem('bibleBook', book);
                localStorage.setItem('bibleStartChapter', '1');
              }}
              className="group transition-opacity duration-300 hover:opacity-70"
            >
              <p className="font-serif text-sm text-on-surface tracking-tight leading-tight">
                {book}
              </p>
              <p className="text-[11px] text-on-surface-variant font-sans mt-0.5">
                {bibleBookChapters[book]} ch.
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
