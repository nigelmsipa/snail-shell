import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useTestResults } from "@/hooks/useTestResults";
import { toast } from "sonner";

interface VerseTestModalProps {
  verse: { num: number; text: string };
  isOpen: boolean;
  onClose: () => void;
  onPass: () => void;
  pericopeId?: string;
}

export default function VerseTestModal({ verse, isOpen, onClose, onPass, pericopeId }: VerseTestModalProps) {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<'pending' | 'pass' | 'fail'>('pending');
  const [startTime, setStartTime] = useState<number>(0);
  const { user } = useAuth();
  const { submitTestResultAsync, isSubmitting } = useTestResults(user?.id);

  useEffect(() => {
    if (isOpen) {
      setStartTime(Date.now());
    }
  }, [isOpen]);

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  };

  const calculateAccuracy = (input: string, expected: string): number => {
    const inputWords = input.toLowerCase().split(/\s+/);
    const expectedWords = expected.toLowerCase().split(/\s+/);
    const correctWords = inputWords.filter((word, idx) => word === expectedWords[idx]).length;
    return (correctWords / expectedWords.length) * 100;
  };

  const checkAnswer = async () => {
    const normalized = normalizeText(userInput);
    const expected = normalizeText(verse.text);
    const accuracy = calculateAccuracy(userInput, expected);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    if (normalized === expected) {
      setResult('pass');
      
      // Submit test result to spaced repetition system
      if (pericopeId && user?.id) {
        try {
          const testResult = await submitTestResultAsync({
            pericopeId,
            testType: 'full_recitation',
            accuracyPercent: 100,
            timeTakenSeconds: timeTaken,
          });

          if (testResult?.newState) {
            toast.success(`Perfect! State: ${testResult.newState}`, {
              description: testResult.nextReview 
                ? `Next review: ${new Date(testResult.nextReview).toLocaleDateString()}`
                : undefined
            });
          }
        } catch (error) {
          console.error('Failed to submit test result:', error);
        }
      }

      setTimeout(() => {
        onPass();
        handleClose();
      }, 1500);
    } else {
      setResult('fail');
      
      // Submit failed attempt
      if (pericopeId && user?.id && accuracy > 0) {
        try {
          await submitTestResultAsync({
            pericopeId,
            testType: 'full_recitation',
            accuracyPercent: accuracy,
            timeTakenSeconds: timeTaken,
            mistakes: `Expected: ${expected}\nGot: ${normalized}`,
          });
        } catch (error) {
          console.error('Failed to submit test result:', error);
        }
      }
    }
  };

  const handleClose = () => {
    setUserInput('');
    setResult('pending');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Type Verse {verse.num}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Type the verse from memory. Punctuation and capitalization must match exactly.
          </div>
          
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Begin typing..."
            className="min-h-[150px] font-mono"
            disabled={result === 'pass' || isSubmitting}
          />
          
          {result === 'fail' && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
              ❌ Not quite right. Try again!
            </div>
          )}
          
          {result === 'pass' && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded text-sm text-primary">
              ✅ Perfect! Verse marked complete.
            </div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={checkAnswer} disabled={result === 'pass' || isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Check Answer'}
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
