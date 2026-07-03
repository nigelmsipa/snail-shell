import { useState, useEffect } from 'react';

import { useParams, Link } from 'react-router-dom';
import { useChapterData } from '@/hooks/useChapterData';
import { useAvailableVersions } from '@/hooks/useAvailableVersions';
import PericopeCard from './PericopeCard';
import FirstLetterTyping from './modes/FirstLetterTyping';
import WordByWordVerse from './WordByWordVerse';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ChapterView() {
  const { book, chapter } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { verseProgress, isLoading: progressLoading, toggleVerse } = useProgress(user?.id);

  const chapterNum = parseInt(chapter || '1', 10);
  const bookName = book ? book.charAt(0).toUpperCase() + book.slice(1) : '';

  const [selectedVersion, setSelectedVersion] = useState<string>(() => {
    return localStorage.getItem('bible-version') || 'KJV';
  });

  // View mode - how verses are DISPLAYED when not practicing (default to first-letter)
  type ViewMode = 'full' | 'first-letter';
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('bible-view-mode') as ViewMode) || 'first-letter';
  });

  // Practice mode is always first-letter (removed full-words option)
  const practiceMode = 'first-letter';

  // Theme mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('bible-theme');
    return saved === 'dark';
  });

  // Layout mode - A, B, or C
  type LayoutMode = 'grid-fullscreen' | 'continuous-flow' | 'inline-grid';
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
    return (localStorage.getItem('bible-layout-mode') as LayoutMode) || 'grid-fullscreen';
  });

  const [fullscreenPericope, setFullscreenPericope] = useState<string | null>(null);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);

  // For Option B: track which single verse is being practiced
  const [activeFlowVerse, setActiveFlowVerse] = useState<{pericopeId: string, verseNum: number} | null>(null);

  const { data: versions, isLoading: versionsLoading } = useAvailableVersions();
  const { data: chapterData, isLoading: dataLoading } = useChapterData(bookName, chapterNum, selectedVersion);

  const chapterId = `${bookName} ${chapter}`;

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    localStorage.setItem('bible-version', version);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('bible-view-mode', mode);
  };

  const handleLayoutModeChange = (mode: LayoutMode) => {
    setLayoutMode(mode);
    localStorage.setItem('bible-layout-mode', mode);
    setFullscreenPericope(null); // Reset fullscreen when changing modes
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('bible-theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Apply theme on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleVerse = (pericopeId: string, verseNumber: number) => {
    if (chapterId) {
      toggleVerse({ pericopeId, chapterId, verseNumber });
    }
  };

  if (authLoading || progressLoading || dataLoading || versionsLoading) {
    return null;
  }

  if (!chapterData) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold mb-4 font-mono">Chapter not found</h1>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Could not load: <span className="font-semibold">{bookName} {chapter}</span></p>
            <p className="text-xs">Check the console for detailed error logs</p>
          </div>
          <Link to="/" className="text-primary hover:underline font-mono">← Back to Home</Link>
        </div>
      </div>
    );
  }

  // Show warning if no pericopes found
  if (chapterData.pericopes.length === 0) {
    console.warn('⚠️ [ChapterView] No pericopes found for chapter:', { bookName, chapter });
  }

  // Calculate pericope completion for progress bar
  const pericopeCompletions = chapterData.pericopes.map(pericope => {
    const totalVerses = pericope.verses.length;
    const completedVerses = pericope.verses.filter(v =>
      verseProgress[pericope.id]?.[v.num] === true
    ).length;
    return {
      id: pericope.id,
      name: pericope.name,
      completed: totalVerses > 0 ? completedVerses === totalVerses : false,
      percentage: totalVerses > 0 ? (completedVerses / totalVerses) * 100 : 0
    };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Back button and theme toggle */}
      <div className="fixed top-3 left-3 z-50 no-print flex gap-1.5">
        <Link
          to="/"
          className="w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center hover:border-primary transition-colors"
          title="Back to Chapters"
        >
          <svg className="w-4 h-4 text-muted-foreground" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </Link>
        <button
          onClick={toggleTheme}
          className="w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center hover:border-primary transition-colors"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <svg className="w-4 h-4 text-muted-foreground" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-muted-foreground" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          )}
        </button>
        <button
          onClick={() => window.print()}
          className="w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center hover:border-primary transition-colors no-print"
          title="Print Chapter"
        >
          <svg className="w-4 h-4 text-muted-foreground" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"></path>
          </svg>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 tracking-tight font-mono">
            {chapterData.title}
          </h1>
          <p className="text-xs text-muted-foreground tracking-widest uppercase font-medium mb-6 font-mono">
            {chapterData.subtitle}
          </p>

          {/* Layout selector */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={() => handleLayoutModeChange('grid-fullscreen')}
              className={`px-4 py-2 text-sm font-mono rounded transition-all ${
                layoutMode === 'grid-fullscreen' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary'
              }`}
            >
              A
            </button>
            <button
              onClick={() => handleLayoutModeChange('continuous-flow')}
              className={`px-4 py-2 text-sm font-mono rounded transition-all ${
                layoutMode === 'continuous-flow' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary'
              }`}
            >
              B
            </button>
            <button
              onClick={() => handleLayoutModeChange('inline-grid')}
              className={`px-4 py-2 text-sm font-mono rounded transition-all ${
                layoutMode === 'inline-grid' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary'
              }`}
            >
              C
            </button>
          </div>

          {/* Global Progress Bar */}
          {user && (
            <div className="mt-6 no-print">
              <div className="flex items-center gap-1 max-w-4xl mx-auto">
                {pericopeCompletions.map((pericope) => (
                  <div
                    key={pericope.id}
                    className="flex-1 group relative"
                    title={pericope.name}
                  >
                    <div className="h-1.5 bg-muted rounded-sm overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          pericope.completed
                            ? 'bg-primary'
                            : pericope.percentage > 0
                            ? 'bg-primary/50'
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${pericope.percentage}%` }}
                      />
                    </div>
                    <div className="absolute -bottom-5 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-[10px] text-muted-foreground font-mono">{Math.round(pericope.percentage)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* OPTION A: Grid + Fullscreen - Clean Monkeytype-inspired */}
        {layoutMode === 'grid-fullscreen' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapterData.pericopes.map((pericope, idx) => {
              const isPreviousComplete = idx === 0 || pericopeCompletions[idx - 1].completed;
              const isLocked = user && !isPreviousComplete;
              const completed = Object.values(verseProgress[pericope.id] || {}).filter(Boolean).length;
              const total = pericope.verses.length;
              const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <div
                  key={pericope.id}
                  onClick={() => !isLocked && setFullscreenPericope(pericope.id)}
                  className={`group relative bg-card border border-border rounded-lg p-4 transition-all duration-200 ${
                    isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-primary/70 hover:shadow-md hover:scale-[1.02]'
                  }`}
                >
                  {isLocked && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] rounded-lg flex items-center justify-center z-10">
                      <svg className="w-6 h-6 text-muted-foreground/60" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-primary font-mono leading-tight">{pericope.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono mt-1">{pericope.ref}</p>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${percentComplete}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-muted-foreground font-mono">{completed}/{total} verses</span>
                        {percentComplete === 100 && <span className="text-primary text-xs font-mono">Complete</span>}
                      </div>
                    </div>

                    {/* Subtle hint for interaction */}
                    {!isLocked && (
                      <div className="pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-muted-foreground font-mono">Click to practice →</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* OPTION B: Continuous Flow - Seamless Bible reading experience */}
        {layoutMode === 'continuous-flow' && (
          <div className="max-w-3xl mx-auto">
            {chapterData.pericopes.map((pericope, pericopeIdx) => {
              const isPreviousPericopeComplete = pericopeIdx === 0 || pericopeCompletions[pericopeIdx - 1].completed;

              return (
                <div key={pericope.id} className="mb-10">
                  {/* Pericope header - minimal, just a label */}
                  <div className="mb-4">
                    <h2 className="text-xs font-bold text-primary/60 font-mono tracking-tight">{pericope.name}</h2>
                  </div>

                  {/* Verses - completely seamless flow */}
                  <div className="space-y-2.5">
                    {pericope.verses.map((verse, verseIdx) => {
                      const isCompleted = verseProgress[pericope.id]?.[verse.num] || false;
                      const isPreviousVerseComplete = verseIdx === 0 || verseProgress[pericope.id]?.[pericope.verses[verseIdx - 1].num];
                      const isAccessible = isPreviousPericopeComplete && isPreviousVerseComplete;
                      const isActiveVerse = activeFlowVerse?.pericopeId === pericope.id && activeFlowVerse?.verseNum === verse.num;

                      // Show all verses in Option B for full chapter view
                      // if (!isAccessible && !isCompleted) return null;

                      return (
                        <div
                          key={verse.num}
                          className={`transition-all duration-300 ${
                            isCompleted ? 'opacity-40' : 'opacity-100'
                          }`}
                        >
                          {isActiveVerse ? (
                            // Active typing mode for THIS verse only
                            <div className="my-3">
                              <div className="text-[10px] font-bold text-primary mb-2 font-mono">{verse.num}</div>
                              <FirstLetterTyping
                                key={`flow-${pericope.id}-${verse.num}`}
                                verseText={verse.text}
                                verseNum={verse.num}
                                onComplete={() => {
                                  handleToggleVerse(pericope.id, verse.num);
                                  setActiveFlowVerse(null);
                                }}
                              />
                            </div>
                          ) : (
                            // Default: Show in first-letter format (read-only)
                            <div className="font-mono text-sm leading-relaxed">
                              <span
                                onClick={() => !isCompleted && isAccessible && setActiveFlowVerse({pericopeId: pericope.id, verseNum: verse.num})}
                                className={`text-[10px] font-bold mr-1.5 ${
                                  isCompleted ? 'text-primary/40' : 'text-primary cursor-pointer hover:text-primary/70'
                                }`}
                              >
                                {verse.num}
                              </span>
                              <span className={isCompleted ? 'text-muted-foreground/60' : 'text-foreground/80'}>
                                <WordByWordVerse verseText={verse.text} verseNum={verse.num} />
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {layoutMode === 'inline-grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapterData.pericopes.map((pericope, idx) => {
              const isPreviousComplete = idx === 0 || pericopeCompletions[idx - 1].completed;
              const isLocked = user && !isPreviousComplete;

              return (
                <PericopeCard
                  key={pericope.id}
                  pericope={pericope}
                  viewMode={viewMode}
                  verseProgress={verseProgress[pericope.id] || {}}
                  onToggleVerse={(verseNum) => handleToggleVerse(pericope.id, verseNum)}
                  isAuthenticated={!!user}
                  isLocked={isLocked}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Practice Mode (Option A) */}
      {layoutMode === 'grid-fullscreen' && fullscreenPericope && (() => {
        const pericope = chapterData.pericopes.find(p => p.id === fullscreenPericope);
        if (!pericope) return null;

        const currentVerse = pericope.verses[currentVerseIndex];

        const handleFullscreenVerseComplete = () => {
          handleToggleVerse(fullscreenPericope, currentVerse.num);
          if (currentVerseIndex < pericope.verses.length - 1) {
            setTimeout(() => setCurrentVerseIndex(currentVerseIndex + 1), 1000);
          } else {
            setTimeout(() => {
              setFullscreenPericope(null);
              setCurrentVerseIndex(0);
            }, 1500);
          }
        };

        return (
          <div className="fixed inset-0 bg-background z-50 overflow-auto">
            <div className="min-h-screen flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50 backdrop-blur-sm bg-background/80">
                <button
                  onClick={() => {
                    setFullscreenPericope(null);
                    setCurrentVerseIndex(0);
                  }}
                  className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Back
                </button>
                <div className="text-center">
                  <h2 className="text-lg font-bold text-primary font-mono">{pericope.name}</h2>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{pericope.ref}</p>
                </div>
                <div className="text-sm font-mono text-muted-foreground">
                  {currentVerseIndex + 1} / {pericope.verses.length}
                </div>
              </div>

              {/* Fullscreen practice content - Monkeytype style */}
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-3xl space-y-12">
                  {/* Verse number */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary/30 bg-primary/5">
                      <span className="text-3xl font-bold text-primary font-mono">{currentVerse.num}</span>
                    </div>
                  </div>

                  {/* Typing test */}
                  <FirstLetterTyping
                    key={`${currentVerse.num}-${currentVerseIndex}`}
                    verseText={currentVerse.text}
                    verseNum={currentVerse.num}
                    onComplete={handleFullscreenVerseComplete}
                  />

                  {/* Progress dots */}
                  <div className="flex justify-center gap-2.5 pt-4">
                    {pericope.verses.map((v, idx) => (
                      <div
                        key={v.num}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          idx < currentVerseIndex
                            ? 'bg-primary'
                            : idx === currentVerseIndex
                            ? 'bg-primary/60 ring-2 ring-primary/30 animate-pulse'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
