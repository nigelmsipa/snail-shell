import { useMemo, useRef, useState, useEffect } from 'react';
import { ActivityCalendar, ThemeInput } from 'react-activity-calendar';
import { Flame } from 'lucide-react';
import { HeatMapData } from '@/hooks/useDailyActivity';

// Convert count to level (0-4) for the library
function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 10) return 2;
  if (count <= 25) return 3;
  return 4;
}

// Note: count is now xp_earned (1 per test passed). Thresholds stay the same.

interface HeatMapProps {
  data: HeatMapData[];
  streak?: number;
}

export function HeatMap({ data, streak = 0 }: HeatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blockSize, setBlockSize] = useState(12);
  const [weeks, setWeeks] = useState(20);

  // Calculate block size and weeks to fill container width exactly
  useEffect(() => {
    const calculateLayout = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const weekdayLabelWidth = 30;
      const blockMargin = 3;
      const targetBlockSize = 12;
      const availableWidth = containerWidth - weekdayLabelWidth;
      
      // Calculate how many weeks fit at the target block size
      const weekWidth = targetBlockSize + blockMargin;
      const calculatedWeeks = Math.floor(availableWidth / weekWidth);
      
      // Clamp weeks between 12 and 52
      const clampedWeeks = Math.max(12, Math.min(52, calculatedWeeks));
      setWeeks(clampedWeeks);
      
      // Recalculate block size to fill remaining space exactly
      const finalBlockSize = Math.floor(availableWidth / clampedWeeks) - blockMargin;
      setBlockSize(Math.max(10, Math.min(16, finalBlockSize)));
    };

    calculateLayout();
    
    const resizeObserver = new ResizeObserver(calculateLayout);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Transform data to the format expected by react-activity-calendar
  const calendarData = useMemo(() => {
    const totalDays = weeks * 7;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - totalDays + 1);

    // Create a map for quick lookup
    const dataMap = new Map<string, HeatMapData>();
    data.forEach((item) => {
      const dateStr = item.date.toISOString().split('T')[0];
      dataMap.set(dateStr, item);
    });

    // Generate all days in range
    const result: Array<{
      date: string;
      count: number;
      level: 0 | 1 | 2 | 3 | 4;
    }> = [];

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayData = dataMap.get(dateStr);

      result.push({
        date: dateStr,
        count: dayData?.count || 0,
        level: getLevel(dayData?.count || 0),
      });
    }

    return result;
  }, [data, weeks]);

  // Create a lookup map for tooltip details
  const detailsMap = useMemo(() => {
    const map = new Map<string, HeatMapData['details']>();
    data.forEach((item) => {
      const dateStr = item.date.toISOString().split('T')[0];
      map.set(dateStr, item.details);
    });
    return map;
  }, [data]);

  // Custom theme using our practice (yellow) color
  const theme: ThemeInput = {
    light: [
      'hsl(var(--muted) / 0.3)',
      'hsl(var(--primary) / 0.25)',
      'hsl(var(--primary) / 0.5)',
      'hsl(var(--primary) / 0.75)',
      'hsl(var(--primary))',
    ],
    dark: [
      'hsl(var(--muted) / 0.3)',
      'hsl(var(--primary) / 0.25)',
      'hsl(var(--primary) / 0.5)',
      'hsl(var(--primary) / 0.75)',
      'hsl(var(--primary))',
    ],
  };

  return (
    <div className="w-full" ref={containerRef}>
      {/* Streak - top left */}
      <div className="mb-3">
        {streak > 0 ? (
          <div className="flex items-center gap-1.5 text-primary font-semibold text-body">
            <Flame className="w-5 h-5" />
            <span>{streak} day streak</span>
          </div>
        ) : (
          <div className="text-body-sm text-muted-foreground">
            Start your streak today
          </div>
        )}
      </div>

      {/* Activity Calendar */}
      <ActivityCalendar
        data={calendarData}
        theme={theme}
        blockSize={blockSize}
        blockMargin={3}
        blockRadius={2}
        fontSize={10}
        showColorLegend={false}
        showMonthLabels={true}
        showTotalCount={false}
        showWeekdayLabels={['mon', 'wed', 'fri']}
        weekStart={0}
        tooltips={{
          activity: {
            text: (activity) => {
              const details = detailsMap.get(activity.date);
              if (activity.count > 0 && details) {
                return `${activity.date}: ${details.versesTyped} verses · ${details.reviewsCompleted} reviews`;
              }
              return `${activity.date}: No activity`;
            },
          },
        }}
      />

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-2 text-caption text-muted-foreground">
        <span>Less</span>
        <div className="w-2.5 h-2.5 rounded-sm bg-muted/30" />
        <div className="w-2.5 h-2.5 rounded-sm bg-primary/25" />
        <div className="w-2.5 h-2.5 rounded-sm bg-primary/50" />
        <div className="w-2.5 h-2.5 rounded-sm bg-primary/75" />
        <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
        <span>More</span>
      </div>
    </div>
  );
}
