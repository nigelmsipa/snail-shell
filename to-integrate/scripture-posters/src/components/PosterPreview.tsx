import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, RotateCcw } from "lucide-react";

interface PosterPreviewProps {
  scripture: string;
  reference: string;
  onReset: () => void;
}

export const PosterPreview = ({ scripture, reference, onReset }: PosterPreviewProps) => {
  const [memorizedVerses, setMemorizedVerses] = useState<Set<number>>(new Set());

  const toggleVerseMemorized = (index: number) => {
    setMemorizedVerses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };
  const convertToFirstLetters = (text: string) => {
    const verses: Array<{ verseNum: string | null; text: string }> = [];
    
    // KJV API format uses newlines between verses typically
    // Split by line breaks first to handle multi-verse passages
    const lines = text.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      // Try to match verse number at start: "1 The Lord is..."
      const match = line.match(/^(\d+)\s+(.+)$/);
      
      if (match) {
        const verseNum = match[1];
        const verseText = match[2];
        
        const converted = verseText
          .split(' ')
          .map(word => {
            const cleanWord = word.replace(/[^\w]/g, '');
            if (!cleanWord) return '';
            const firstLetter = cleanWord.charAt(0).toUpperCase();
            const punctuation = word.replace(/[\w]/g, '');
            return firstLetter + punctuation;
          })
          .filter(w => w)
          .join(' ');
        
        verses.push({ verseNum, text: converted });
      } else if (line.trim()) {
        // No verse number, just convert the text
        const converted = line
          .split(' ')
          .map(word => {
            const cleanWord = word.replace(/[^\w]/g, '');
            if (!cleanWord) return '';
            const firstLetter = cleanWord.charAt(0).toUpperCase();
            const punctuation = word.replace(/[\w]/g, '');
            return firstLetter + punctuation;
          })
          .filter(w => w)
          .join(' ');
        
        if (converted.trim()) {
          verses.push({ verseNum: null, text: converted });
        }
      }
    });
    
    return verses;
  };

  const formatForPoster = (verses: Array<{ verseNum: string | null; text: string }>) => {
    // Group lines by verse number
    const groupedVerses: Array<{ verseNum: string | null; lines: string[] }> = [];
    
    verses.forEach(verse => {
      if (!verse.text.trim()) return;
      
      if (verse.verseNum) {
        // New verse with number
        groupedVerses.push({ verseNum: verse.verseNum, lines: [verse.text] });
      } else {
        // Line without verse number - add to previous verse if exists
        if (groupedVerses.length > 0) {
          groupedVerses[groupedVerses.length - 1].lines.push(verse.text);
        } else {
          groupedVerses.push({ verseNum: null, lines: [verse.text] });
        }
      }
    });
    
    return groupedVerses;
  };

  const handleDownload = () => {
    const posterElement = document.getElementById('poster-content');
    if (posterElement) {
      const firstLetterText = posterLines.map(v => v.lines.join(' ')).join(' ');
      const dataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(
        `${reference}\n\n${firstLetterText}\n\n---\nGenerated with Scripture Posters`
      );
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${reference.replace(/[^\w\s]/gi, '')}-poster.txt`;
      link.click();
    }
  };

  const firstLetterData = convertToFirstLetters(scripture);
  const posterLines = formatForPoster(firstLetterData);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-mono font-semibold">POSTER PREVIEW</h2>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
            FIRST LETTER METHOD
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="font-mono text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            RESET
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="font-mono text-xs"
          >
            <Download className="w-3 h-3 mr-1" />
            DOWNLOAD
          </Button>
        </div>
      </div>

      <Card className="p-8" id="poster-content">
        <div className="space-y-6 text-center">
          {reference && (
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              {reference}
            </div>
          )}
          
          <div className="space-y-3">
            {posterLines.map((verse, index) => (
              <div
                key={index}
                className="flex items-start gap-3 group"
              >
                <Checkbox
                  id={`verse-${index}`}
                  checked={memorizedVerses.has(index)}
                  onCheckedChange={() => toggleVerseMemorized(index)}
                  className="mt-1.5 opacity-40 group-hover:opacity-100 transition-opacity"
                />
                <div className="flex-1">
                  <label
                    htmlFor={`verse-${index}`}
                    className={`font-mono text-lg leading-relaxed tracking-wider cursor-pointer transition-all block ${
                      memorizedVerses.has(index) 
                        ? 'line-through opacity-50' 
                        : ''
                    }`}
                  >
                    {verse.verseNum && (
                      <sup className="text-[0.6em] text-muted-foreground/60 mr-1">
                        {verse.verseNum}
                      </sup>
                    )}
                    {verse.lines.map((line, lineIndex) => (
                      <span key={lineIndex}>
                        {lineIndex > 0 && ' '}
                        {line}
                      </span>
                    ))}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-accent text-xs font-mono text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>MEMORIZATION PROGRESS</span>
              <span>{memorizedVerses.size} / {posterLines.length}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-xs text-muted-foreground font-mono space-y-1">
        <div>ORIGINAL TEXT:</div>
        <div className="p-3 bg-muted/50 rounded text-xs leading-relaxed">
          {scripture}
        </div>
      </div>
    </div>
  );
};
