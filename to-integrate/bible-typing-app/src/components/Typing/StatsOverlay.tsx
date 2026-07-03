import { Card } from "@/components/ui/card";

interface StatsOverlayProps {
  accuracy: number; // 0..1
  wpm: number;
  progress: number; // 0..1
  errors: number;
  timeElapsed: number; // seconds
}

export const StatsOverlay = ({ accuracy, wpm, progress, errors, timeElapsed }: StatsOverlayProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };
  return (
    <div className="absolute right-4 top-4 z-10 animate-fade-in pointer-events-none">
      <Card className="bg-card/80 backdrop-blur border-border text-foreground px-4 py-3 shadow">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <div className="opacity-80">Accuracy</div>
          <div className="font-semibold tabular-nums">{Math.round(accuracy * 100)}%</div>
          <div className="opacity-80">WPM</div>
          <div className="font-semibold tabular-nums">{Math.max(0, Math.round(wpm))}</div>
          <div className="opacity-80">Progress</div>
          <div className="font-semibold tabular-nums">{Math.round(progress * 100)}%</div>
          <div className="opacity-80">Time</div>
          <div className="font-semibold tabular-nums">{formatTime(timeElapsed)}</div>
          <div className="opacity-80">Errors</div>
          <div className="font-semibold tabular-nums text-destructive">{errors}</div>
        </div>
      </Card>
    </div>
  );
};
