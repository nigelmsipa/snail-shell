import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddPassageModal } from './AddPassageModal';

interface OnboardingWizardProps {
  onAddPassage: (passage: { book: string; chapter: number; verseStart: number; verseEnd: number; versionId: string }) => void;
  onComplete: () => void;
  lastCreatedPassageId?: string;
}

export function OnboardingWizard({ onAddPassage, onComplete, lastCreatedPassageId }: OnboardingWizardProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [addedPassage, setAddedPassage] = useState<{ book: string; chapter: number; verseStart: number; verseEnd: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = (passage: { book: string; chapter: number; verseStart: number; verseEnd: number; versionId: string }) => {
    setAddedPassage(passage);
    onAddPassage(passage);
    setStep(3);
  };

  const handleStartPracticing = () => {
    localStorage.setItem('wolf-word-onboarding-complete', 'true');
    onComplete();
    if (lastCreatedPassageId) {
      navigate(`/passage/${lastCreatedPassageId}`);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('wolf-word-onboarding-complete', 'true');
    onComplete();
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      {/* Step dots */}
      <div className="flex items-center gap-2 mb-12">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              s === step
                ? 'bg-primary w-6'
                : s < step
                ? 'bg-primary/40'
                : 'bg-muted-foreground/20'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Welcome */}
      {step === 1 && (
        <div className="text-center max-w-sm animate-in fade-in duration-500">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-3">
            Welcome to Wolf & Word
          </h2>
          <p className="text-body text-muted-foreground mb-8 leading-relaxed">
            Memorize Scripture verse by verse with structured practice and spaced repetition.
          </p>
          <Button
            onClick={() => setStep(2)}
            size="lg"
            className="w-full max-w-xs h-12 text-body font-semibold"
          >
            Get Started
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Step 2: Pick passage */}
      {step === 2 && (
        <div className="text-center max-w-sm animate-in fade-in duration-500">
          <h2 className="text-h3 font-bold text-foreground mb-2">
            Pick Your First Passage
          </h2>
          <p className="text-body-sm text-muted-foreground mb-8">
            Choose a book, chapter, and scope to start memorizing.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="w-full max-w-xs h-12 text-body font-semibold bg-browse text-browse-foreground hover:bg-browse/90"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Choose a Passage
          </Button>
          <button
            onClick={handleSkip}
            className="mt-4 text-caption text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>

          <AddPassageModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            onAdd={handleAdd}
          />
        </div>
      )}

      {/* Step 3: Ready */}
      {step === 3 && addedPassage && (
        <div className="text-center max-w-sm animate-in fade-in duration-500">
          <div className="w-16 h-16 rounded-2xl bg-practice/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-practice" />
          </div>
          <h2 className="text-h3 font-bold text-foreground mb-2">
            You're All Set!
          </h2>
          <p className="text-body text-muted-foreground mb-2">
            Your first passage is ready:
          </p>
          <p className="text-body font-semibold text-foreground mb-8">
            {addedPassage.book} {addedPassage.chapter}:{addedPassage.verseStart}–{addedPassage.verseEnd}
          </p>
          <Button
            onClick={handleStartPracticing}
            size="lg"
            className="w-full max-w-xs h-12 text-body font-semibold bg-practice text-practice-foreground hover:bg-practice/90"
          >
            Start Practicing
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
