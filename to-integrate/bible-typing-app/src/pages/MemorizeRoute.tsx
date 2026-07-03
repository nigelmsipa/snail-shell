import { useParams } from "react-router-dom";
import { bible, books, BookKey } from "@/data/bible";
import { VerseProgressSession } from "@/components/Memorization/VerseProgressSession";

const MemorizeRoute = () => {
  const { book, chapter } = useParams();
  const b = (book as BookKey) ?? "john";
  const c = Number(chapter ?? 1);
  const verses = bible[b]?.[c] ?? [];
  const bookLabel = books.find(x => x.key === b)?.label || b;

  if (verses.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Chapter not found</h1>
          <p className="text-muted-foreground">
            {bookLabel} {c} doesn't exist or has no verses.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <VerseProgressSession 
        book={b}
        chapter={c}
        verses={verses}
        bookLabel={bookLabel}
      />
    </div>
  );
};

export default MemorizeRoute;