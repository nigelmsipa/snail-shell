interface RoundDotsProps { current: number }

export const RoundDots = ({ current }: RoundDotsProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: 4 }, (_, i) => {
        const idx = i + 1;
        const isActive = idx === current;
        const isDone = idx < current;
        return (
          <span
            key={idx}
            className={
              "h-2.5 w-2.5 rounded-full " +
              (isActive
                ? "bg-primary shadow"
                : isDone
                ? "bg-success/70"
                : "bg-muted-foreground/30")
            }
            aria-label={`Round ${idx}${isActive ? " (current)" : isDone ? " (completed)" : ""}`}
          />
        );
      })}
    </div>
  );
};
