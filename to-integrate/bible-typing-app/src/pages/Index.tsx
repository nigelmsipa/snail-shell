import { useMemo, useState } from "react";
import { books, bible, BookKey } from "@/data/bible";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TypingSession } from "@/components/Typing/TypingSession";
import { BuildSession } from "@/components/Typing/BuildSession";
import { FocusSession } from "@/components/Typing/FocusSession";

const Index = () => {
  const [book, setBook] = useState<BookKey>("john");
  const [chapter, setChapter] = useState<number>(1);
  const [focusVerse, setFocusVerse] = useState<number>(1);
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<"standard" | "build" | "focus">("standard");

  const chapters = useMemo(() => Object.keys(bible[book]).map((n) => Number(n)), [book]);
  const verseCount = bible[book][chapter]?.length || 1;

  const startDisabled = focusVerse < 1 || focusVerse > verseCount;

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Scripture Type — Bible Verse Typing Trainer</h1>
          <p className="mt-3 text-muted-foreground">Practice and memorize Bible verses through a focused 4-round system with real-time feedback.</p>
          <div className="mt-4 flex justify-center"><a href="/dashboard" className="text-sm underline text-foreground/80 hover:text-foreground story-link">Open Progress Dashboard</a></div>
        </header>

        {!started ? (
          <Card className="p-6 bg-card border-border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="mb-2 block">Book</Label>
                <Select value={book} onValueChange={(v) => setBook(v as BookKey)}>
                  <SelectTrigger className="bg-background">
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
                <Label className="mb-2 block">Chapter</Label>
                <Select value={String(chapter)} onValueChange={(v) => setChapter(Number(v))}>
                  <SelectTrigger className="bg-background">
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
                <Label className="mb-2 block">Focus verse</Label>
                <Input
                  type="number"
                  min={1}
                  max={verseCount}
                  value={focusVerse}
                  onChange={(e) => setFocusVerse(Number(e.target.value))}
                  className="bg-background"
                />
                <p className="mt-1 text-xs text-muted-foreground">1 – {verseCount}</p>
              </div>
              <div>
                <Label className="mb-2 block">Mode</Label>
                <Select value={mode} onValueChange={(v) => setMode(v as "standard" | "build" | "focus")}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="build">Build</SelectItem>
                    <SelectItem value="focus">Focus (single verse)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button disabled={startDisabled} className="w-full" onClick={() => setStarted(true)}>
                  Start Session
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          (
            mode === "build" ? (
              <BuildSession book={book} chapter={chapter} initialTarget={focusVerse} />
            ) : mode === "focus" ? (
              <FocusSession book={book} chapter={chapter} verseNumber={focusVerse} />
            ) : (
              <TypingSession book={book} chapter={chapter} focusVerseNumber={focusVerse} />
            )
          )
        )}
      </section>

      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Scripture Type",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            description: "Practice and memorize Bible verses with a 4-round typing system and memory mode.",
          }),
        }}
      />
    </main>
  );
};

export default Index;
