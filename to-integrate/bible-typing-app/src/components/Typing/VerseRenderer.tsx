interface VerseRendererProps {
  text: string;
  typed: string;
}

export const VerseRenderer = ({ text, typed }: VerseRendererProps) => {
  const currentIndex = typed.length;

  return (
    <div className="text-2xl leading-[2.4] tracking-wide select-none">
      {Array.from(text).map((ch, i) => {
        const isCurrent = i === currentIndex;
        const isTyped = i < currentIndex;
        const correct = isTyped ? typed[i] === text[i] : undefined;

        return (
          <span key={i} className="relative">
            {isCurrent && (
              <span
                className="absolute left-0 top-[0.1em] bottom-[0.1em] w-[2.5px] bg-primary animate-caret-blink rounded-full"
                aria-hidden
              />
            )}
            <span
              className={
                isTyped
                  ? correct
                    ? "text-success"
                    : "text-destructive"
                  : "text-pending"
              }
            >
              {ch}
            </span>
          </span>
        );
      })}
    </div>
  );
};
