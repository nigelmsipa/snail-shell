type Status = "learning" | "practicing" | "mastered";

interface VersePillsProps {
  statuses: Status[];
  currentIndex: number;
}

export const VersePills = ({ statuses, currentIndex }: VersePillsProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center justify-center">
      {statuses.map((s, i) => {
        const isCurrent = i === currentIndex;
        const base = "px-2 py-1 rounded-full text-xs tabular-nums border";
        let cls = "bg-secondary/30 text-muted-foreground border-border"; // learning
        if (s === "practicing") cls = "bg-punctuation/20 text-punctuation border-punctuation/30";
        if (s === "mastered") cls = "bg-success/20 text-success border-success/30";
        if (isCurrent) cls = "bg-primary/20 text-primary border-primary/40";
        return (
          <span key={i} className={`${base} ${cls}`}>{i + 1}</span>
        );
      })}
    </div>
  );
};
