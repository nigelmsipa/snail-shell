import { useMemo } from "react";
import { tokenize, Token } from "@/features/acrostic/engine/text";

interface FirstLetterRendererProps {
  text: string;
  /** How many first-letters have been typed so far */
  typedCount: number;
  /** Per-character correctness for typed letters */
  results: boolean[];
}

/**
 * Renders the full verse text with word-level highlighting.
 * - Completed words: colored green/red based on whether the first letter was correct
 * - Current word: fully visible (foreground color), first letter has cursor highlight
 * - Future words: dimmed
 */
export const FirstLetterRenderer = ({ text, typedCount, results }: FirstLetterRendererProps) => {
  const tokens = useMemo(() => tokenize(text), [text]);

  // Rebuild the display: we walk through tokens (words) and map them to the typed index
  let wordIndex = 0;

  return (
    <div className="text-lg sm:text-[1.75rem] leading-relaxed tracking-wider select-none">
      {tokens.map((token, tIdx) => {
        const thisWordIndex = token.core.length > 0 ? wordIndex++ : -1;
        const isTyped = thisWordIndex >= 0 && thisWordIndex < typedCount;
        const isCurrent = thisWordIndex >= 0 && thisWordIndex === typedCount;
        const isFuture = thisWordIndex >= 0 && thisWordIndex > typedCount;
        const wasCorrect = isTyped ? results[thisWordIndex] : undefined;

        // Determine classes for each part
        const wordClass = isTyped
          ? wasCorrect
            ? "text-success"
            : "text-destructive"
          : isCurrent
          ? "text-foreground"
          : "text-muted-foreground/30";

        const firstLetterClass = isCurrent
          ? "bg-foreground text-background rounded px-0.5"
          : "";

        return (
          <span key={tIdx}>
            {/* Leading punctuation */}
            {token.lead && (
              <span className={isTyped ? (wasCorrect ? "text-success" : "text-destructive") : isCurrent ? "text-foreground" : "text-muted-foreground/30"}>
                {token.lead}
              </span>
            )}
            {/* The word itself */}
            {token.core.split("").map((ch, cIdx) => (
              <span
                key={cIdx}
                className={cIdx === 0 && isCurrent ? firstLetterClass : wordClass}
              >
                {ch}
              </span>
            ))}
            {/* Trailing punctuation */}
            {token.trail && (
              <span className={isTyped ? (wasCorrect ? "text-success" : "text-destructive") : isCurrent ? "text-foreground" : "text-muted-foreground/30"}>
                {token.trail}
              </span>
            )}
            {/* Space after word */}
            {tIdx < tokens.length - 1 && <span> </span>}
          </span>
        );
      })}
    </div>
  );
};
