import { Status } from "@/lib/progress";
interface ChapterProgressBarProps {
  statuses: Status[];
  currentIndex?: number;
  onSegmentClick?: (index: number) => void;
}
export const ChapterProgressBar = ({
  statuses,
  currentIndex,
  onSegmentClick
}: ChapterProgressBarProps) => {
  // For chapters with few verses, limit max width per segment
  const segmentClass = statuses.length <= 5 
    ? "h-2 w-16 rounded-sm cursor-pointer transition-colors" 
    : "h-2 flex-1 rounded-sm cursor-pointer transition-colors";
    
  return (
    <div className="flex gap-1 items-center justify-start">
      {statuses.map((status, index) => (
        <div
          key={index}
          className={`${segmentClass} ${
            index === currentIndex 
              ? "bg-primary ring-2 ring-ring" 
              : status === "mastered" 
                ? "bg-success" 
                : status === "practicing" 
                  ? "bg-accent" 
                  : "bg-muted"
          }`}
          onClick={() => onSegmentClick?.(index)}
          title={`Verse ${index + 1}: ${status}`}
        />
      ))}
    </div>
  );
};