import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVerseText } from '@/hooks/useVerseText';
import { useAvailableVersions } from '@/hooks/useAvailableVersions';
import { BookOpen, Globe, Edit3 } from 'lucide-react';

interface ReviewStepProps {
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number | null;
  onConfirm: (customName: string | null, version?: string) => void;
}

export function ReviewStep({ book, chapter, startVerse, endVerse, onConfirm }: ReviewStepProps) {
  const [customName, setCustomName] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string>(() => {
    return localStorage.getItem('bible-version') || 'KJV';
  });

  const { data: versions = [] } = useAvailableVersions();
  const { verses, isLoading: versesLoading } = useVerseText(
    book,
    chapter,
    startVerse,
    endVerse,
    selectedVersion
  );

  const reference = endVerse && endVerse !== startVerse
    ? `${book} ${chapter}:${startVerse}-${endVerse}`
    : `${book} ${chapter}:${startVerse}`;

  const verseCount = endVerse ? endVerse - startVerse + 1 : 1;

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    localStorage.setItem('bible-version', version);
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Reference Card */}
      <div className="bg-muted rounded border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Reference</p>
          <Select value={selectedVersion} onValueChange={handleVersionChange}>
            <SelectTrigger className="h-7 w-16 text-xs border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {versions.map((version) => (
                <SelectItem key={version.id} value={version.abbreviation} className="text-xs">
                  {version.abbreviation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xl font-bold text-foreground mb-1">{reference}</p>
        <p className="text-xs text-muted-foreground">
          {verseCount} verse{verseCount !== 1 ? 's' : ''} • {selectedVersion}
        </p>
      </div>

      {/* Custom Name Input */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">
          Custom Title (Optional)
        </label>
        <Input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder={reference}
          className="border-border text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Leave blank to use default reference
        </p>
      </div>

      {/* Verse Preview */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">
          Preview
        </label>
        <div className="rounded border border-border bg-card p-3 max-h-[200px] overflow-y-auto">
          {versesLoading ? (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground">Loading verses...</p>
            </div>
          ) : verses.length > 0 ? (
            <div className="space-y-2">
              {verses.map((verse) => (
                <div key={verse.verse} className="flex gap-2">
                  <span className="text-xs font-bold text-muted-foreground mt-0.5 min-w-[20px]">
                    {verse.verse}
                  </span>
                  <p className="text-xs text-foreground leading-relaxed flex-1">
                    {verse.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground">No verses found</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Button */}
      <Button
        onClick={() => onConfirm(customName || null, selectedVersion)}
        className="w-full font-medium text-sm py-2.5 transition-colors"
        disabled={versesLoading}
      >
        Add Verse
      </Button>
    </div>
  );
}
