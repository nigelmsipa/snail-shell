import { bible, BookKey } from "@/data/bible";
import { getChapterStatuses, getContiguousMasteredCount } from "@/lib/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();

  const getBookProgress = (book: BookKey) => {
    const chapters = Object.keys(bible[book]).map(Number);
    return chapters.map(chapter => {
      const verses = bible[book][chapter];
      const statuses = getChapterStatuses(book, chapter, verses.length);
      const mastered = statuses.filter(s => s === "mastered").length;
      const practicing = statuses.filter(s => s === "practicing").length;
      const contiguous = getContiguousMasteredCount(book, chapter, verses.length);
      return {
        chapter,
        total: verses.length,
        mastered,
        practicing,
        contiguous,
        pct: mastered / verses.length
      };
    });
  };

  const books: BookKey[] = Object.keys(bible) as BookKey[];

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto p-6">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Progress Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Track your memorization progress across all chapters.</p>
          </div>
          <Button asChild variant="secondary">
            <Link to="/">Back to Trainer</Link>
          </Button>
        </header>

        <div className="grid gap-6">
          {books.map(book => {
            const bookData = getBookProgress(book);
            const totalMastered = bookData.reduce((sum, ch) => sum + ch.mastered, 0);
            const totalVerses = bookData.reduce((sum, ch) => sum + ch.total, 0);
            const bookProgress = totalVerses === 0 ? 0 : totalMastered / totalVerses;

            return (
              <Card key={book}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{book}</CardTitle>
                    <Badge variant="secondary">
                      {Math.round(bookProgress * 100)}% ({totalMastered}/{totalVerses})
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {bookData.map(({ chapter, total, mastered, practicing }) => (
                      <div key={chapter} className="flex items-center gap-4 p-3 rounded-lg border">
                        <div className="font-medium min-w-20">Ch. {chapter}</div>

                        <div className="flex-1">
                          <div className="flex gap-1 mb-1">
                            {Array.from({ length: total }, (_, i) => (
                              <div
                                key={i}
                                className={`h-2 flex-1 rounded-sm ${
                                  i < mastered ? "bg-success" :
                                  i < mastered + practicing ? "bg-accent" :
                                  "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {mastered} mastered, {practicing} practicing, {total - mastered - practicing} learning
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/type/${book}/${chapter}`)}
                          >
                            Practice
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/build/${book}/${chapter}`)}
                          >
                            Build
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* SEO */}
      <link rel="canonical" href="/dashboard" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Scripture Type Progress Dashboard",
            description: "Dashboard showing memorization progress across Bible chapters.",
          }),
        }}
      />
    </main>
  );
};

export default Dashboard;