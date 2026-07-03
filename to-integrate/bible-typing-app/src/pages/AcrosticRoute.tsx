import { useParams } from "react-router-dom";
import { BookKey } from "@/data/bible";
import { AcrosticSession } from "@/components/Typing/AcrosticSession";

const AcrosticRoute = () => {
  const { book, chapter } = useParams();
  const b = (book as BookKey) ?? "john";
  const c = Number(chapter ?? 1);
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto max-w-4xl px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Acrostic Practice</h1>
          <p className="text-sm text-muted-foreground">Full → First letters → Recall</p>
        </header>
        <AcrosticSession book={b} chapter={c} />
      </section>
    </main>
  );
};

export default AcrosticRoute;

