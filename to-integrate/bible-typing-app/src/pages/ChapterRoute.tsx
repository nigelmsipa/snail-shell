import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bible, books, BookKey } from "@/data/bible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getChapterStatuses } from "@/lib/progress";

const ChapterRoute = () => {
  const navigate = useNavigate();
  const { book, chapter } = useParams();
  const b = (book as BookKey) ?? "john";
  const c = Number(chapter ?? 1);
  const verses = bible[b][c] ?? [];
  const statuses = getChapterStatuses(b, c, verses.length);
  const label = books.find(x => x.key === b)?.label || b;
  const mastered = statuses.filter(s => s === 'mastered').length;
  const progress = verses.length ? Math.round((mastered / verses.length) * 100) : 0;

  const segments = useMemo(() => {
    const size = 3; // default segment size
    const out: Array<{ start: number; end: number }> = [];
    for (let i = 0; i < verses.length; i += size) {
      out.push({ start: i + 1, end: Math.min(i + size, verses.length) });
    }
    return out;
  }, [verses.length]);

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">{label} {c}</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/type/${b}/${c}`)}>Type</Button>
            <Button variant="outline" onClick={() => navigate(`/build/${b}/${c}`)}>Build</Button>
            <Button variant="secondary" onClick={() => navigate(`/acrostic/${b}/${c}`)}>Acrostic</Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Progress</span>
              <Badge variant="outline">{progress}%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-1">
              {statuses.map((s, idx) => (
                <div key={idx} className={`h-2 rounded ${s === 'mastered' ? 'bg-green-500' : s === 'practicing' ? 'bg-blue-400' : 'bg-gray-300'}`} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {segments.map((seg, i) => (
                <div key={i} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <div className="font-medium">Verses {seg.start}–{seg.end}</div>
                    <div className="text-xs text-muted-foreground">Chunk of {seg.end - seg.start + 1} verses</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => navigate(`/type/${b}/${c}`, { state: { start: seg.start, end: seg.end } })}>Type</Button>
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/acrostic/${b}/${c}`, { state: { start: seg.start, end: seg.end } })}>Acrostic</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default ChapterRoute;

