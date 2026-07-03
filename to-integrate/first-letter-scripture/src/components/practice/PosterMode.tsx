import { useState, useMemo } from 'react';
import { Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Verse {
  verse: number;
  text: string;
}

interface PosterModeProps {
  verses: Verse[];
  reference: string;
}

function toFirstLetters(text: string): string {
  return text
    .split(/\s+/)
    .map((word) => {
      if (!word) return '';
      // Keep punctuation attached to first letter
      const match = word.match(/^([^a-zA-Z]*[a-zA-Z])(.*)/);
      if (match) {
        const rest = match[2];
        const trailingPunct = rest.match(/[^a-zA-Z]*$/)?.[0] ?? '';
        return match[1] + trailingPunct;
      }
      return word[0];
    })
    .join(' ');
}

export function PosterMode({ verses, reference }: PosterModeProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const allChecked = checked.size === verses.length;

  const toggleVerse = (verseNum: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(verseNum)) next.delete(verseNum);
      else next.add(verseNum);
      return next;
    });
  };

  const posterText = useMemo(
    () =>
      verses
        .map((v) => `${v.verse}  ${toFirstLetters(v.text)}`)
        .join('\n'),
    [verses]
  );

  const handleDownload = () => {
    const blob = new Blob([`${reference}\n\n${posterText}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reference.replace(/\s+/g, '_')}_poster.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header with download */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{reference}</p>
        <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
          <Download className="w-3.5 h-3.5" /> Download
        </Button>
      </div>

      {allChecked && (
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
          <Check className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">All verses checked!</span>
        </div>
      )}

      {/* First-letter poster */}
      <div className="rounded-lg bg-muted/30 p-5 space-y-2">
        {verses.map((v) => {
          const fl = toFirstLetters(v.text);
          const isChecked = checked.has(v.verse);
          return (
            <label
              key={v.verse}
              className={`flex items-start gap-3 cursor-pointer rounded px-2 py-1.5 transition-colors hover:bg-muted/50 ${
                isChecked ? 'opacity-50' : ''
              }`}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggleVerse(v.verse)}
                className="mt-0.5"
              />
              <span className="font-mono text-sm leading-relaxed text-foreground">
                <span className="text-muted-foreground text-xs mr-1.5">{v.verse}</span>
                {fl}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
