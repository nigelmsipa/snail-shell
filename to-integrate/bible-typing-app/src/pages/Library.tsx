import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { books, bible, BookKey } from "@/data/bible";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getChapterStatuses } from "@/lib/progress";
import { addSelectedChapter, getSelectedChapters, isChapterSelected, removeSelectedChapter } from "@/lib/userState";

const Library = () => {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<BookKey>("john");
  const chapters = useMemo(() => Object.keys(bible[selectedBook]).map(n => Number(n)), [selectedBook]);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const selected = getSelectedChapters();

  const handleToggle = (book: BookKey, chapter: number) => {
    if (isChapterSelected(book, chapter)) removeSelectedChapter(book, chapter);
    else addSelectedChapter(book, chapter);
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">My Chapters</h1>
          <Button variant="outline" onClick={() => navigate("/browse")}>Browse</Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add a Chapter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <div className="text-sm mb-1">Book</div>
                <Select value={selectedBook} onValueChange={(v) => setSelectedBook(v as BookKey)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((b) => (
                      <SelectItem key={b.key} value={b.key}>{b.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-sm mb-1">Chapter</div>
                <Select value={String(selectedChapter)} onValueChange={(v) => setSelectedChapter(Number(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map((c) => (
                      <SelectItem key={c} value={String(c)}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button 
                  onClick={() => handleToggle(selectedBook, selectedChapter)}
                >
                  {isChapterSelected(selectedBook, selectedChapter) ? "Remove" : "Add"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {selected.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">No chapters selected yet. Add one above to get started.</Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selected.map((c) => {
              const verseCount = bible[c.book][c.chapter]?.length || 0;
              const statuses = getChapterStatuses(c.book, c.chapter, verseCount);
              const progress = verseCount ? statuses.filter(s => s === 'mastered').length / verseCount : 0;
              const label = books.find(b => b.key === c.book)?.label || c.book;
              return (
                <Card key={`${c.book}.${c.chapter}`} className="bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span>{label} {c.chapter}</span>
                      <Badge variant="outline">{Math.round(progress * 100)}%</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => navigate(`/type/${c.book}/${c.chapter}`)}>Type</Button>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/build/${c.book}/${c.chapter}`)}>Build</Button>
                      <Button size="sm" variant="secondary" onClick={() => navigate(`/acrostic/${c.book}/${c.chapter}`)}>Acrostic</Button>
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/chapter/${c.book}/${c.chapter}`)}>Details</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleToggle(c.book, c.chapter)}>Remove</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Library;

