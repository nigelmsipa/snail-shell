import { useState, useRef, useEffect, useCallback } from 'react';
import { DEFAULT_TEXT, BIBLE_API_BASE, BibleVersion } from '@/lib/constants';

export const useTeleprompter = () => {
  const [text, setText] = useState(() => localStorage.getItem('teleprompterText') || DEFAULT_TEXT);
  const [selectedBook, setSelectedBook] = useState(() => localStorage.getItem('bibleBook') || 'John');
  const [startChapter, setStartChapter] = useState(() => parseInt(localStorage.getItem('bibleStartChapter') || '1', 10));
  const [endChapter, setEndChapter] = useState(() => parseInt(localStorage.getItem('bibleEndChapter') || '1', 10));
  const [selectedVersion, setSelectedVersion] = useState<BibleVersion>(() => 
    (localStorage.getItem('bibleVersion') as BibleVersion) || 'KJV'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('teleprompterFontSize') || '64', 10));
  const [scrollSpeed, setScrollSpeed] = useState(() => parseInt(localStorage.getItem('teleprompterScrollSpeed') || '20', 10));
  const [textWidth, setTextWidth] = useState(() => parseInt(localStorage.getItem('teleprompterTextWidth') || '80', 10));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false);
  const [bgColor, setBgColor] = useState(() => localStorage.getItem('teleprompterBgColor') || '#000000');
  const [textColor, setTextColor] = useState(() => localStorage.getItem('teleprompterTextColor') || '#FFFFFF');
  const [controlsVisible, setControlsVisible] = useState(true);

  const prompterRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mobilePrompterRef = useRef<HTMLDivElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const velocityRef = useRef(0);
  const targetVelocityRef = useRef(0);
  const SPEED_MULTIPLIER = 5; // px per second per speed unit (reduced for smoother scrolling)

  useEffect(() => { localStorage.setItem('teleprompterText', text); }, [text]);
  useEffect(() => { localStorage.setItem('teleprompterFontSize', fontSize.toString()); }, [fontSize]);
  useEffect(() => { localStorage.setItem('teleprompterScrollSpeed', scrollSpeed.toString()); }, [scrollSpeed]);
  useEffect(() => { localStorage.setItem('teleprompterTextWidth', textWidth.toString()); }, [textWidth]);
  useEffect(() => { localStorage.setItem('teleprompterBgColor', bgColor); }, [bgColor]);
  useEffect(() => { localStorage.setItem('teleprompterTextColor', textColor); }, [textColor]);
  useEffect(() => { localStorage.setItem('bibleBook', selectedBook); }, [selectedBook]);
  useEffect(() => { localStorage.setItem('bibleStartChapter', startChapter.toString()); }, [startChapter]);
  useEffect(() => { localStorage.setItem('bibleEndChapter', endChapter.toString()); }, [endChapter]);
  useEffect(() => { localStorage.setItem('bibleVersion', selectedVersion); }, [selectedVersion]);

  const fetchBiblePassage = useCallback(async () => {
    setIsLoading(true);
    try {
      let fullText = '';

      for (let chapter = startChapter; chapter <= endChapter; chapter++) {
        const url = `${BIBLE_API_BASE}/verses?book=${encodeURIComponent(selectedBook)}&chapter=${chapter}&version=${selectedVersion}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.data?.verses) {
          const chapterText = data.data.verses
            .map((v: { verse: number; text: string }) => `${v.verse} ${v.text}`)
            .join('\n');
          
          if (startChapter !== endChapter) {
            fullText += `\n\n=== ${selectedBook} ${chapter} ===\n\n${chapterText}`;
          } else {
            fullText = chapterText;
          }
        } else {
          throw new Error(data.error || 'Failed to load passage');
        }
      }

      if (fullText) {
        setText(fullText.trim());
      } else {
        setText('Passage not found. Please check your selection.');
      }
    } catch (error) {
      setText('Error loading Bible passage. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedBook, startChapter, endChapter, selectedVersion]);

  const scroll = useCallback((time: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = time;
      animationFrameId.current = requestAnimationFrame(scroll);
      return;
    }

    const deltaTime = Math.min(time - lastTimeRef.current, 50);
    lastTimeRef.current = time;

    const activePrompter =
      mobilePrompterRef.current && mobilePrompterRef.current.offsetParent !== null
        ? mobilePrompterRef.current
        : prompterRef.current && prompterRef.current.offsetParent !== null
        ? prompterRef.current
        : prompterRef.current || mobilePrompterRef.current;

    if (!activePrompter) {
      animationFrameId.current = requestAnimationFrame(scroll);
      return;
    }

    const maxScroll = activePrompter.scrollHeight - activePrompter.clientHeight;

    // If container not yet sized or content fits, keep waiting (don't pause)
    if (maxScroll <= 0) {
      animationFrameId.current = requestAnimationFrame(scroll);
      return;
    }

    // Read current position from DOM (catches manual scrolls)
    const currentPosition = activePrompter.scrollTop;

    // Check if reached end
    if (currentPosition >= maxScroll) {
      setIsPlaying(false);
      return;
    }

    // Calculate target velocity with smoother curve
    targetVelocityRef.current = scrollSpeed * SPEED_MULTIPLIER;

    // Much gentler easing for buttery smooth acceleration
    const easingFactor = 0.05;
    velocityRef.current += (targetVelocityRef.current - velocityRef.current) * easingFactor;

    // Calculate scroll delta for this frame
    const deltaScroll = velocityRef.current * (deltaTime / 1000);

    // Only scroll if there's meaningful movement (prevents micro-jitter)
    if (Math.abs(deltaScroll) > 0.01) {
      // Direct scrollTop assignment for maximum Safari compatibility
      activePrompter.scrollTop += deltaScroll;
    }

    animationFrameId.current = requestAnimationFrame(scroll);
  }, [scrollSpeed]);


  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      velocityRef.current = 0; // Start from zero for smooth acceleration
      targetVelocityRef.current = Math.max(0, scrollSpeed) * SPEED_MULTIPLIER;
      animationFrameId.current = requestAnimationFrame(scroll);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      velocityRef.current = 0;
      targetVelocityRef.current = 0;
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, scroll, scrollSpeed]);

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleResetScroll = () => {
    const activePrompter =
      mobilePrompterRef.current && mobilePrompterRef.current.offsetParent !== null
        ? mobilePrompterRef.current
        : prompterRef.current;
    if (activePrompter) {
        activePrompter.scrollTop = 0;
    }
    velocityRef.current = 0;
    targetVelocityRef.current = 0;
    if(isPlaying) {
        setIsPlaying(false);
    }
  };

  return {
    text, setText,
    fontSize, setFontSize,
    scrollSpeed, setScrollSpeed,
    textWidth, setTextWidth,
    isPlaying, setIsPlaying, handlePlayPause,
    isMirrored, setIsMirrored,
    bgColor, setBgColor,
    textColor, setTextColor,
    controlsVisible, setControlsVisible,
    prompterRef,
    contentRef,
    mobilePrompterRef,
    mobileContentRef,
    handleResetScroll,
    selectedBook, setSelectedBook,
    startChapter, setStartChapter,
    endChapter, setEndChapter,
    selectedVersion, setSelectedVersion,
    fetchBiblePassage,
    isLoading,
  };
};