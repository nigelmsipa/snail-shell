import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks, BibleBook } from "@/lib/bibleApi";
import {
  isChapterComplete,
  isChapterUnlocked,
  getOverallStats,
} from "@/lib/progression";
import { Loader2 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(1);

  useEffect(() => {
    getBooks()
      .then((data) => {
        setBooks(data);
        if (data.length > 0) setSelectedBook(data[0].name);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentBook = useMemo(
    () => books.find((b) => b.name === selectedBook),
    [books, selectedBook]
  );

  const stats = books.length > 0 ? getOverallStats(books) : null;

  // Find the next unlocked incomplete chapter for quick resume
  const nextChapter = useMemo(() => {
    for (const book of books) {
      for (let ch = 1; ch <= book.total_chapters; ch++) {
        if (isChapterUnlocked(book.name, ch, books) && !isChapterComplete(book.name, ch)) {
          return { book: book.name, chapter: ch };
        }
      }
    }
    return null;
  }, [books]);

  const handleStart = () => {
    if (!selectedBook) return;
    navigate(`/type/${encodeURIComponent(selectedBook)}/${selectedChapter}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">
          Scripture Type
        </h1>
        <p className="text-muted-foreground text-sm mb-12">
          Type through the Bible, chapter by chapter.
        </p>

        {/* Quick resume */}
        {nextChapter && (
          <button
            onClick={() =>
              navigate(
                `/type/${encodeURIComponent(nextChapter.book)}/${nextChapter.chapter}`
              )
            }
            className="text-primary hover:text-primary/80 transition-colors text-sm mb-10 block mx-auto"
          >
            Continue: {nextChapter.book} {nextChapter.chapter}
          </button>
        )}

        {/* Book selector */}
        <div className="space-y-4 mb-8">
          <select
            value={selectedBook}
            onChange={(e) => {
              setSelectedBook(e.target.value);
              setSelectedChapter(1);
            }}
            className="w-full bg-card text-foreground border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
          >
            {books.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Chapter selector */}
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(Number(e.target.value))}
            className="w-full bg-card text-foreground border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
          >
            {currentBook &&
              Array.from({ length: currentBook.total_chapters }, (_, i) => {
                const ch = i + 1;
                const done = isChapterComplete(selectedBook, ch);
                return (
                  <option key={ch} value={ch}>
                    Chapter {ch}
                    {done ? " \u2713" : ""}
                  </option>
                );
              })}
          </select>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="w-full bg-primary text-primary-foreground rounded-md py-3 text-sm font-medium hover:bg-primary/90 transition-colors mb-12"
        >
          Start Typing
        </button>

        {/* Subtle stats line */}
        {stats && stats.completed > 0 && (
          <p className="text-muted-foreground text-xs">
            {stats.completed} chapter{stats.completed !== 1 ? "s" : ""} completed
            {stats.avgWpm > 0 && <> · avg {Math.round(stats.avgWpm)} WPM</>}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
