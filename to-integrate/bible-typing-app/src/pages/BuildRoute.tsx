import { useParams } from "react-router-dom";
import { bible, BookKey } from "@/data/bible";
import { BuildSession } from "@/components/Typing/BuildSession";
import NotFound from "./NotFound";

const BuildRoute = () => {
  const { book, chapter } = useParams();
  const b = (book || "") as BookKey;
  const c = Number(chapter);

  if (!b || !(b in bible)) return <NotFound />;
  if (!c || !bible[b][c]) return <NotFound />;

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto max-w-5xl px-4 py-8">
        <BuildSession book={b} chapter={c} initialTarget={1} />
      </section>
    </main>
  );
};

export default BuildRoute;