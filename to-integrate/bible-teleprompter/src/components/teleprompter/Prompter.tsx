import React, { useState, useEffect, useRef } from 'react';
import { Settings, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { BibleVersion } from '@/lib/constants';

interface PrompterProps {
  controlsVisible: boolean;
  setControlsVisible: (visible: boolean) => void;
  prompterRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  isMirrored: boolean;
  bgColor: string;
  textColor: string;
  fontSize: number;
  textWidth: number;
  text: string;
  isPlaying: boolean;
  scrollSpeed: number;
  handlePlayPause: () => void;
  handleResetScroll: () => void;
  selectedBook?: string;
  startChapter?: number;
  selectedVersion?: BibleVersion;
  isLoading?: boolean;
}

const Prompter: React.FC<PrompterProps> = ({
  controlsVisible,
  setControlsVisible,
  prompterRef,
  contentRef,
  isMirrored,
  bgColor,
  textColor,
  fontSize,
  textWidth,
  text,
  isPlaying,
  handlePlayPause,
  handleResetScroll,
  selectedBook = '',
  startChapter = 1,
  selectedVersion = 'KJV',
  isLoading = false,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafIdRef = useRef<number | null>(null);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (rafIdRef.current != null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (!prompterRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = prompterRef.current;
        const max = Math.max(1, scrollHeight - clientHeight);
        const progress = Math.min(100, (scrollTop / max) * 100);
        const now = performance.now();
        if (now - lastEmitRef.current > 100) {
          setScrollProgress(progress);
          lastEmitRef.current = now;
        }
      });
    };

    const element = prompterRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => {
        element.removeEventListener('scroll', handleScroll);
        if (rafIdRef.current != null) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    }
  }, [prompterRef, text]);

  const bookLabel = selectedBook.toUpperCase().includes('PSALM')
    ? 'THE BOOK OF'
    : ['Matthew', 'Mark', 'Luke', 'John'].includes(selectedBook)
    ? 'THE GOSPEL ACCORDING TO'
    : 'THE BOOK OF';

  const renderVerses = () => {
    if (!text) return null;
    const lines = text.split('\n').filter(Boolean);
    return lines.map((line, i) => {
      const chapterMatch = line.match(/^=== (.+) ===$/);
      if (chapterMatch) {
        return (
          <div key={i} className="mt-16 mb-8 text-center">
            <p className="text-xs tracking-[0.3em] uppercase opacity-50 font-sans">
              {chapterMatch[1]}
            </p>
          </div>
        );
      }

      const verseMatch = line.match(/^(\d+)\s+(.*)$/);
      if (verseMatch) {
        return (
          <p key={i} className="mb-4 leading-[1.8] relative pl-8 md:pl-12">
            <span className="absolute left-0 top-0 font-sans text-[11px] opacity-40 tracking-wider tabular-nums">
              {verseMatch[1]}
            </span>
            <span>{verseMatch[2]}</span>
          </p>
        );
      }

      return <p key={i} className="mb-4 leading-[1.8]">{line}</p>;
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center relative h-full">
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 z-20 h-1">
        <Progress
          value={scrollProgress}
          className="h-1 rounded-none"
          style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
        />
      </div>

      {/* Static controls */}
      <div className="absolute top-4 right-4 z-50 flex flex-col space-y-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayPause}
          className="w-12 h-12 bg-black/10 hover:bg-black/20 border-0 backdrop-blur-sm opacity-40 hover:opacity-100"
          style={{ color: textColor }}
          title={isPlaying ? "Pause" : "Play"}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        {scrollProgress > 5 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetScroll}
            className="w-12 h-12 bg-black/10 hover:bg-black/20 border-0 backdrop-blur-sm opacity-40 hover:opacity-100"
            style={{ color: textColor }}
            title="Reset to Top"
            aria-label="Reset to Top"
          >
            ↑
          </Button>
        )}
      </div>

      {/* Settings button - only show on desktop when controls hidden */}
      {!controlsVisible && (
        <div className="absolute top-4 left-4 z-50 hidden md:block">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setControlsVisible(true)}
            className="bg-black/10 hover:bg-black/20 border-0 backdrop-blur-sm opacity-40 hover:opacity-100"
            style={{ color: textColor }}
            title="Show Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Top gradient fade */}
      <div
        className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, ${bgColor}, transparent)` }}
      />

      <div
        ref={prompterRef}
        tabIndex={0}
        className={cn("w-full h-full overflow-y-scroll p-4 sm:p-8 lg:p-12 leading-relaxed focus:outline-none", {
          'transform scale-x-[-1]': isMirrored,
        })}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          scrollBehavior: 'auto',
          willChange: 'scroll-position',
        }}
      >
        <div
          ref={contentRef}
          style={{
            maxWidth: `${textWidth}%`,
            margin: '0 auto',
            minHeight: '100%',
            paddingBottom: '50vh',
            paddingTop: '4rem',
            textAlign: 'left',
            transform: isMirrored ? 'scaleX(-1)' : undefined,
            transformOrigin: 'center',
          }}
        >
          {/* Book title header */}
          {selectedBook && (
            <div className="text-center py-12 md:py-20">
              <p
                className="text-[10px] tracking-[0.4em] uppercase font-sans mb-3"
                style={{ color: textColor, opacity: 0.4 }}
              >
                {bookLabel}
              </p>
              <h1
                className="font-serif italic tracking-tight"
                style={{
                  color: textColor,
                  fontSize: `${Math.max(fontSize * 0.6, 28)}px`,
                }}
              >
                {selectedBook}
              </h1>
              <p
                className="mt-4 text-sm font-sans tracking-wide"
                style={{ color: textColor, opacity: 0.5 }}
              >
                Chapter {startChapter} · {selectedVersion}
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-20">
              <p className="font-sans text-sm animate-pulse" style={{ color: textColor, opacity: 0.6 }}>
                Loading passage…
              </p>
            </div>
          ) : text ? (
            <div
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: 1.8,
                letterSpacing: '0.01em',
                wordSpacing: '0.1em',
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              {renderVerses()}
            </div>
          ) : (
            <div className="text-center mt-20" style={{ color: textColor, opacity: 0.5 }}>
              <p className="text-2xl mb-4 font-light font-serif">Digital Vellum</p>
              <p className="text-lg font-sans" style={{ opacity: 0.8 }}>Choose a passage to begin your focused reading session.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to top, ${bgColor}, transparent)` }}
      />
    </div>
  );
};

export default Prompter;
