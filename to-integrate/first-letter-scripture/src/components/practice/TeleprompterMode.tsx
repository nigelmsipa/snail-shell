import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface Verse {
  verse: number;
  text: string;
}

interface TeleprompterModeProps {
  verses: Verse[];
  reference: string;
}

export function TeleprompterMode({ verses, reference }: TeleprompterModeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(40); // pixels per second
  const [fontSize, setFontSize] = useState(28);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const fullText = verses.map((v) => `${v.verse} ${v.text}`).join(' ');

  const animate = useCallback(
    (timestamp: number) => {
      if (!scrollRef.current) return;
      if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      scrollRef.current.scrollTop += speed * delta;

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 2) {
        setIsPlaying(false);
        return;
      }

      animRef.current = requestAnimationFrame(animate);
    },
    [speed]
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animRef.current = requestAnimationFrame(animate);
    } else if (animRef.current) {
      cancelAnimationFrame(animRef.current);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, animate]);

  const handleReset = () => {
    setIsPlaying(false);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className="gap-2"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Speed</span>
          <Slider
            value={[speed]}
            onValueChange={([v]) => setSpeed(v)}
            min={10}
            max={120}
            step={5}
            className="w-24"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Size</span>
          <Slider
            value={[fontSize]}
            onValueChange={([v]) => setFontSize(v)}
            min={16}
            max={48}
            step={2}
            className="w-20"
          />
        </div>
      </div>

      {/* Scrolling text */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-lg bg-muted/30 p-6 min-h-[60vh]"
      >
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-4">
          {reference}
        </p>
        <p
          className="leading-relaxed text-foreground font-serif"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
        >
          {fullText}
        </p>
        {/* Extra space so scroll can finish */}
        <div className="h-[50vh]" />
      </div>
    </div>
  );
}
