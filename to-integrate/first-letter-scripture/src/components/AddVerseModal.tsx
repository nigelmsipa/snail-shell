import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { ProgressIndicator } from './verse-wizard/ProgressIndicator';
import { StepHeader } from './verse-wizard/StepHeader';
import { BookSelectionStep } from './verse-wizard/BookSelectionStep';
import { ChapterSelectionStep } from './verse-wizard/ChapterSelectionStep';
import { VerseSelectionStep } from './verse-wizard/VerseSelectionStep';
import { ReviewStep } from './verse-wizard/ReviewStep';

interface AddVerseModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (book: string, chapter: number, startVerse: number, endVerse: number | null, customName: string | null, version?: string) => void;
}

export default function AddVerseModal({ open, onClose, onAdd }: AddVerseModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [selectedStartVerse, setSelectedStartVerse] = useState<number>(0);
  const [selectedEndVerse, setSelectedEndVerse] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      setCurrentStep(1);
      setSelectedBook('');
      setSelectedChapter(0);
      setSelectedStartVerse(0);
      setSelectedEndVerse(null);
    }
  }, [open]);

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setCurrentStep(2);
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    setCurrentStep(3);
  };

  const handleVerseSelect = (startVerse: number, endVerse: number | null) => {
    setSelectedStartVerse(startVerse);
    setSelectedEndVerse(endVerse);
    setCurrentStep(4);
  };

  const handleConfirm = (customName: string | null, version?: string) => {
    onAdd(selectedBook, selectedChapter, selectedStartVerse, selectedEndVerse, customName, version);
    onClose();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getBreadcrumb = () => {
    const parts: string[] = [];
    if (selectedBook) parts.push(selectedBook);
    if (selectedChapter) parts.push(`Chapter ${selectedChapter}`);
    return parts.join(' → ');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[95vw] max-w-[550px] h-[90vh] max-h-[700px] flex flex-col p-0 gap-0 overflow-hidden [&>button]:hidden">
        {/* Header with Progress and Navigation */}
        <div className="border-b border-border bg-muted">
          {/* Top Row: Cancel Button */}
          <div className="px-6 pt-4 pb-2 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </div>
          
          {/* Progress Stepper Row - Full Width */}
          <div className="px-6 pb-4">
            <ProgressIndicator currentStep={currentStep} totalSteps={4} />
          </div>
          
          {/* Back Button Row */}
          {currentStep > 1 && (
            <div className="px-6 pb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-xs font-medium"
              >
                <ChevronLeft className="mr-1 h-3 w-3" />
                Back
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
          <div className="animate-in fade-in duration-300 h-full" key={currentStep}>
            {currentStep === 1 && (
              <>
                <StepHeader
                  title="Select a Book"
                  subtitle="Choose the book you want to add verses from"
                />
                <BookSelectionStep onSelect={handleBookSelect} />
              </>
            )}

            {currentStep === 2 && (
              <>
                <StepHeader
                  title="Select a Chapter"
                  subtitle={`Choose a chapter from ${selectedBook}`}
                  breadcrumb={selectedBook}
                />
                <ChapterSelectionStep
                  book={selectedBook}
                  onSelect={handleChapterSelect}
                />
              </>
            )}

            {currentStep === 3 && (
              <>
                <StepHeader
                  title="Select Verse(s)"
                  subtitle={`Choose verse(s) from ${selectedBook} ${selectedChapter}`}
                  breadcrumb={getBreadcrumb()}
                />
                <VerseSelectionStep
                  book={selectedBook}
                  chapter={selectedChapter}
                  onSelect={handleVerseSelect}
                />
              </>
            )}

            {currentStep === 4 && (
              <>
                <StepHeader
                  title="Review Your Selection"
                  subtitle="Verify your selection and optionally add a custom name"
                  breadcrumb={getBreadcrumb()}
                />
                <ReviewStep
                  book={selectedBook}
                  chapter={selectedChapter}
                  startVerse={selectedStartVerse}
                  endVerse={selectedEndVerse}
                  onConfirm={handleConfirm}
                />
              </>
            )}
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
