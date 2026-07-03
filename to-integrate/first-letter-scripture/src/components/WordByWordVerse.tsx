import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mapLettersToWords } from "@/lib/abbreviate";

interface WordByWordVerseProps {
  verseText: string;
  verseNum: number;
}

export default function WordByWordVerse({ verseText, verseNum }: WordByWordVerseProps) {
  const letterMap = mapLettersToWords(verseText);

  return (
    <TooltipProvider delayDuration={200}>
      <span className="font-mono">
        {letterMap.map((item, idx) => (
          <span key={idx}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help hover:bg-muted transition-colors px-0.5">
                  {item.letter}{item.punctuation}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <span className="font-normal">{item.word}{item.punctuation}</span>
              </TooltipContent>
            </Tooltip>
            {idx < letterMap.length - 1 && ' '}
          </span>
        ))}
      </span>
    </TooltipProvider>
  );
}
