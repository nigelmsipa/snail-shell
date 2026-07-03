import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft, BookOpen, Layers, Scissors } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAllPericopes } from '@/hooks/useAllPericopes';
import { useAvailableVersions } from '@/hooks/useAvailableVersions';

type Step = 'version' | 'book' | 'chapter' | 'scope';
type ScopeType = 'chapter' | 'pericope' | 'custom';

interface AddPassageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (passage: { book: string; chapter: number; verseStart: number; verseEnd: number; versionId: string }) => void;
}

interface Book {
  id: string;
  name: string;
  totalChapters: number;
  testament: string;
}

// KJV version ID as default
const DEFAULT_VERSION_ID = '86f77392-e93a-42f9-8997-efe2680bac31';

export function AddPassageModal({ open, onOpenChange, onAdd }: AddPassageModalProps) {
  const [step, setStep] = useState<Step>('version');
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string>(DEFAULT_VERSION_ID);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [scopeType, setScopeType] = useState<ScopeType>('chapter');
  const [selectedPericopeIndex, setSelectedPericopeIndex] = useState<number | null>(null);
  const [customStart, setCustomStart] = useState<string>('1');
  const [customEnd, setCustomEnd] = useState<string>('10');
  const [maxVerse, setMaxVerse] = useState<number>(30);

  const { pericopes } = useAllPericopes();
  const { data: versions = [] } = useAvailableVersions();

  // Fetch books
  useEffect(() => {
    async function fetchBooks() {
      const { data } = await supabase
        .from('bible_books')
        .select('id, name, total_chapters, testament')
        .order('book_number');
      
      if (data) {
        setBooks(data.map(b => ({
          id: b.id,
          name: b.name,
          totalChapters: b.total_chapters,
          testament: b.testament,
        })));
      }
    }
    fetchBooks();
  }, []);

  // Get max verse for selected chapter
  useEffect(() => {
    async function fetchMaxVerse() {
      if (!selectedBook || !selectedChapter) return;
      
      const { data } = await supabase
        .from('bible_verses')
        .select('verse')
        .eq('book_id', selectedBook.id)
        .eq('chapter', selectedChapter)
        .order('verse', { ascending: false })
        .limit(1)
        .single();
      
      if (data) {
        setMaxVerse(data.verse);
        setCustomEnd(String(data.verse));
      }
    }
    fetchMaxVerse();
  }, [selectedBook, selectedChapter]);

  const chapterPericopes = pericopes.filter(
    p => p.book === selectedBook?.name && p.chapter === selectedChapter
  );

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersionId(versionId);
    setStep('book');
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setStep('chapter');
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    setStep('scope');
  };

  const handleConfirm = () => {
    if (!selectedBook || !selectedChapter) return;

    let verseStart = 1;
    let verseEnd = maxVerse;

    if (scopeType === 'pericope' && selectedPericopeIndex !== null) {
      const pericope = chapterPericopes[selectedPericopeIndex];
      verseStart = pericope.start_verse;
      verseEnd = pericope.end_verse;
    } else if (scopeType === 'custom') {
      verseStart = parseInt(customStart) || 1;
      verseEnd = parseInt(customEnd) || maxVerse;
    }

    onAdd({
      book: selectedBook.name,
      chapter: selectedChapter,
      verseStart,
      verseEnd,
      versionId: selectedVersionId,
    });

    // Reset state
    setStep('version');
    setSelectedVersionId(DEFAULT_VERSION_ID);
    setSelectedBook(null);
    setSelectedChapter(null);
    setScopeType('chapter');
    setSelectedPericopeIndex(null);
    onOpenChange(false);
  };

  const handleBack = () => {
    if (step === 'scope') {
      setStep('chapter');
      setScopeType('chapter');
      setSelectedPericopeIndex(null);
    } else if (step === 'chapter') {
      setStep('book');
      setSelectedBook(null);
    } else if (step === 'book') {
      setStep('version');
    }
  };

  const otBooks = books.filter(b => b.testament === 'OT');
  const selectedVersion = versions.find(v => v.id === selectedVersionId);
  const ntBooks = books.filter(b => b.testament === 'NT');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step !== 'version' && (
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <DialogTitle>
              {step === 'version' && 'Select Bible Version'}
              {step === 'book' && `${selectedVersion?.abbreviation} - Select Book`}
              {step === 'chapter' && `${selectedBook?.name} - Select Chapter`}
              {step === 'scope' && `${selectedBook?.name} ${selectedChapter} - Choose Scope`}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {step === 'version' && (
            <div className="grid grid-cols-2 gap-3">
              {versions.map(version => (
                <Button
                  key={version.id}
                  variant={selectedVersionId === version.id ? 'default' : 'outline'}
                  className="h-auto py-4 flex flex-col items-center gap-1"
                  onClick={() => handleVersionSelect(version.id)}
                >
                  <span className="text-lg font-bold">{version.abbreviation}</span>
                  <span className="text-xs opacity-70">{version.name}</span>
                </Button>
              ))}
            </div>
          )}

          {step === 'book' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Old Testament</h4>
                <div className="grid grid-cols-3 gap-2">
                  {otBooks.map(book => (
                    <Button
                      key={book.id}
                      variant="outline"
                      className="justify-start text-sm h-auto py-2"
                      onClick={() => handleBookSelect(book)}
                    >
                      {book.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">New Testament</h4>
                <div className="grid grid-cols-3 gap-2">
                  {ntBooks.map(book => (
                    <Button
                      key={book.id}
                      variant="outline"
                      className="justify-start text-sm h-auto py-2"
                      onClick={() => handleBookSelect(book)}
                    >
                      {book.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'chapter' && selectedBook && (
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: selectedBook.totalChapters }, (_, i) => i + 1).map(chapter => (
                <Button
                  key={chapter}
                  variant="outline"
                  onClick={() => handleChapterSelect(chapter)}
                >
                  {chapter}
                </Button>
              ))}
            </div>
          )}

          {step === 'scope' && (
            <div className="space-y-6">
              <RadioGroup value={scopeType} onValueChange={(v) => setScopeType(v as ScopeType)}>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="chapter" className="mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-practice" />
                        <span className="font-medium">Whole Chapter</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Memorize all {maxVerse} verses
                      </p>
                    </div>
                  </label>

                  {chapterPericopes.length > 0 && (
                    <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="pericope" className="mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-browse" />
                          <span className="font-medium">Pericope</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Choose a thematic section
                        </p>
                        {scopeType === 'pericope' && (
                          <div className="mt-3 space-y-2">
                            {chapterPericopes.map((p, idx) => (
                              <Button
                                key={p.id}
                                variant={selectedPericopeIndex === idx ? 'default' : 'outline'}
                                className="w-full justify-start text-left h-auto py-2"
                                onClick={() => setSelectedPericopeIndex(idx)}
                              >
                                <div>
                                  <div className="font-medium">{p.name}</div>
                                  <div className="text-xs opacity-70">
                                    v{p.start_verse}-{p.end_verse} ({p.end_verse - p.start_verse + 1} verses)
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </label>
                  )}

                  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="custom" className="mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-review" />
                        <span className="font-medium">Custom Range</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pick specific verses
                      </p>
                      {scopeType === 'custom' && (
                        <div className="mt-3 flex items-center gap-2">
                          <div>
                            <Label className="text-xs">Start</Label>
                            <Input
                              type="number"
                              min={1}
                              max={maxVerse}
                              value={customStart}
                              onChange={(e) => setCustomStart(e.target.value)}
                              className="w-20"
                            />
                          </div>
                          <span className="mt-5">to</span>
                          <div>
                            <Label className="text-xs">End</Label>
                            <Input
                              type="number"
                              min={1}
                              max={maxVerse}
                              value={customEnd}
                              onChange={(e) => setCustomEnd(e.target.value)}
                              className="w-20"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </RadioGroup>

              <Button 
                className="w-full" 
                onClick={handleConfirm}
                disabled={scopeType === 'pericope' && selectedPericopeIndex === null}
              >
                Add Passage
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
