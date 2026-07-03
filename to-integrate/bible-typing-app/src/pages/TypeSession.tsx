import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChapterVerses, BibleVerse } from "@/lib/bibleApi";
import { completeChapter, ACCURACY_THRESHOLD } from "@/lib/progression";
import { VerseRenderer } from "@/components/Typing/VerseRenderer";
import { FirstLetterRenderer } from "@/components/Typing/FirstLetterRenderer";
import { tokenize } from "@/features/acrostic/engine/text";
import { RotateCcw, ChevronRight, Loader2 } from "lucide-react";

const TypeSession = () => {
  const { book, chapter } = useParams();
  const navigate = useNavigate();
  const bookName = decodeURIComponent(book || "");
  const chapterNum = Number(chapter);

  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mode
  const [firstLetterMode, setFirstLetterMode] = useState(false);

  // Typing state
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [now, setNow] = useState(Date.now());

  // First-letter mode state
  const [flResults, setFlResults] = useState<boolean[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  // Track previous input value to detect changes
  const prevInputVal = useRef("");

  // Build one continuous string from all verses
  const fullText = useMemo(() => {
    return verses.map((v) => v.text).join(" ");
  }, [verses]);

  // Tokenize for first-letter mode
  const flTokens = useMemo(() => tokenize(fullText), [fullText]);
  const flWordCount = useMemo(
    () => flTokens.filter((t) => t.core.length > 0).length,
    [flTokens]
  );

  // Current word index in first-letter mode
  const flTypedCount = flResults.length;

  // Fetch chapter data
  useEffect(() => {
    if (!bookName || !chapterNum) return;
    setLoading(true);
    getChapterVerses(bookName, chapterNum)
      .then((data) => setVerses(data.verses))
      .catch(() => setError("Failed to load chapter"))
      .finally(() => setLoading(false));
  }, [bookName, chapterNum]);

  // Autofocus
  useEffect(() => {
    inputRef.current?.focus();
  }, [verses, firstLetterMode]);

  // Timer tick
  useEffect(() => {
    if (!sessionStartedAt || completed) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [sessionStartedAt, completed]);

  // Auto-scroll to keep current position visible
  useEffect(() => {
    if (!textContainerRef.current) return;
    const caretEl = textContainerRef.current.querySelector(".animate-caret-blink") 
      || textContainerRef.current.querySelector(".bg-foreground");
    if (caretEl) {
      caretEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [typed, flResults]);

  const accuracy = correct + errors > 0 ? correct / (correct + errors) : 1;

  const timeElapsed = sessionStartedAt
    ? Math.floor(((completed ? now : Date.now()) - sessionStartedAt) / 1000)
    : 0;

  const wpm = useMemo(() => {
    if (!sessionStartedAt) return 0;
    const elapsed = (now - sessionStartedAt) / 60000;
    const totalChars = correct + errors;
    return elapsed > 0 ? (totalChars / 5) / elapsed : 0;
  }, [sessionStartedAt, now, correct, errors]);

  const handleFocus = () => inputRef.current?.focus();

  const handleChapterComplete = useCallback(
    (finalCorrect: number, finalErrors: number) => {
      const finalAccuracy = finalCorrect / (finalCorrect + finalErrors);
      const finalTime = sessionStartedAt
        ? Math.floor((Date.now() - sessionStartedAt) / 1000)
        : 0;
      const finalWpm =
        finalTime > 0
          ? ((finalCorrect + finalErrors) / 5) / (finalTime / 60)
          : 0;

      completeChapter(bookName, chapterNum, finalAccuracy, finalWpm, finalTime);
      setNow(Date.now());
      setCompleted(true);
    },
    [bookName, chapterNum, sessionStartedAt]
  );

  // Reset input sentinel value
  const resetInput = useCallback(() => {
    if (inputRef.current) {
      // Use a single space as sentinel so we can detect backspace (value shrinks)
      inputRef.current.value = " ";
      prevInputVal.current = " ";
    }
  }, []);

  useEffect(() => {
    resetInput();
  }, [verses, firstLetterMode, resetInput]);

  // Mode switch
  const handleModeSwitch = () => {
    setFirstLetterMode((m) => !m);
    setTyped("");
    setErrors(0);
    setCorrect(0);
    setFlResults([]);
    setSessionStartedAt(null);
    resetInput();
  };

  // Process a single character typed
  const processChar = useCallback(
    (ch: string) => {
      if (completed) return;
      if (!sessionStartedAt) setSessionStartedAt(Date.now());

      if (firstLetterMode) {
        // First-letter mode: match against current word's first letter
        if (flTypedCount >= flWordCount) return;
        // Find the actual word at flTypedCount
        let wordIdx = 0;
        let targetLetter = "";
        for (const token of flTokens) {
          if (token.core.length > 0) {
            if (wordIdx === flTypedCount) {
              targetLetter = token.core[0];
              break;
            }
            wordIdx++;
          }
        }
        const isCorrect = ch.toLowerCase() === targetLetter.toLowerCase();
        const newCorrect = isCorrect ? correct + 1 : correct;
        const newErrors = isCorrect ? errors : errors + 1;
        if (isCorrect) setCorrect((c) => c + 1);
        else setErrors((e) => e + 1);
        setFlResults((r) => [...r, isCorrect]);

        if (flTypedCount + 1 >= flWordCount) {
          setTimeout(() => handleChapterComplete(newCorrect, newErrors), 150);
        }
      } else {
        // Full text mode
        if (typed.length >= fullText.length) return;
        const at = typed.length;
        const isCorrect = ch === fullText[at];
        const newCorrect = isCorrect ? correct + 1 : correct;
        const newErrors = isCorrect ? errors : errors + 1;

        setTyped((t) => t + ch);
        if (isCorrect) setCorrect((c) => c + 1);
        else setErrors((e) => e + 1);

        if (at + 1 === fullText.length) {
          setTimeout(() => handleChapterComplete(newCorrect, newErrors), 150);
        }
      }
    },
    [
      completed, sessionStartedAt, firstLetterMode, flTypedCount, flWordCount,
      flTokens, correct, errors, typed, fullText, handleChapterComplete,
    ]
  );

  // Process backspace
  const processBackspace = useCallback(() => {
    if (firstLetterMode) {
      if (flResults.length === 0) return;
      const removed = flResults[flResults.length - 1];
      setFlResults((r) => r.slice(0, -1));
      if (removed) setCorrect((c) => Math.max(0, c - 1));
      else setErrors((e) => Math.max(0, e - 1));
    } else {
      if (typed.length === 0) return;
      const removedChar = typed[typed.length - 1];
      const wasCorrect = removedChar === fullText[typed.length - 1];
      setTyped((t) => t.slice(0, -1));
      if (wasCorrect) setCorrect((c) => Math.max(0, c - 1));
      else setErrors((e) => Math.max(0, e - 1));
    }
  }, [firstLetterMode, flResults, typed, fullText]);

  // Mobile-friendly: use onInput to detect typed characters
  const handleInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const el = e.currentTarget;
      const newVal = el.value;
      const oldVal = prevInputVal.current;

      if (newVal.length > oldVal.length) {
        // Character(s) added
        const added = newVal.slice(oldVal.length);
        for (const ch of added) {
          processChar(ch);
        }
      } else if (newVal.length < oldVal.length) {
        // Backspace
        const removed = oldVal.length - newVal.length;
        for (let i = 0; i < removed; i++) {
          processBackspace();
        }
      }

      // Reset to sentinel
      el.value = " ";
      prevInputVal.current = " ";
    },
    [processChar, processBackspace]
  );

  // Still handle keydown for desktop (prevents default, handles special keys)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // --- Loading ---
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  // --- Error ---
  if (error || verses.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error || "No verses found"}</p>
        <button
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Go Home
        </button>
      </div>
    );
  }

  // --- Completion ---
  if (completed) {
    const finalAccuracy = accuracy;
    const passed = finalAccuracy >= ACCURACY_THRESHOLD;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <p className="text-muted-foreground text-sm mb-8">
            {bookName} {chapterNum} · KJV
          </p>

          <div className="flex items-center justify-center gap-8 sm:gap-12 mb-8">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-primary tabular-nums">
                {Math.round(wpm)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">wpm</p>
            </div>
            <div>
              <p className={`text-3xl sm:text-4xl font-bold tabular-nums ${passed ? "text-primary" : "text-destructive"}`}>
                {Math.round(finalAccuracy * 100)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">accuracy</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
                {formatTime(timeElapsed)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">time</p>
            </div>
          </div>

          {!passed && (
            <p className="text-sm text-muted-foreground mb-6">
              Need {Math.round(ACCURACY_THRESHOLD * 100)}% accuracy to unlock the next chapter.
            </p>
          )}

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Restart"
            >
              <RotateCcw className="h-5 w-5" />
              <span className="text-sm">restart</span>
            </button>

            {passed && (
              <button
                onClick={() =>
                  navigate(`/type/${encodeURIComponent(bookName)}/${chapterNum + 1}`)
                }
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <span className="text-sm">next chapter</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Main typing view ---
  return (
    <div className="min-h-screen bg-background" onClick={handleFocus}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8">
        {/* Header: reference + mode toggle + stats */}
        <div className="flex items-center justify-between mb-6 sm:mb-10 gap-2">
          <button
            onClick={() => navigate("/")}
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            {bookName} {chapterNum}
          </button>

          <button
            onClick={handleModeSwitch}
            className="text-xs px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            {firstLetterMode ? "1st Letter" : "Full"}
          </button>

          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground tabular-nums">
            <span>{Math.round(wpm)} wpm</span>
            <span>{Math.round(accuracy * 100)}%</span>
            <span>{formatTime(timeElapsed)}</span>
          </div>
        </div>

        {/* Typing area */}
        <div ref={textContainerRef} className="max-w-4xl mx-auto">
          {firstLetterMode ? (
            <FirstLetterRenderer
              text={fullText}
              typedCount={flTypedCount}
              results={flResults}
            />
          ) : (
            <VerseRenderer text={fullText} typed={typed} />
          )}
        </div>

        {/* Input — visible enough on mobile for keyboard to open */}
        <input
          ref={inputRef}
          className="fixed bottom-0 left-0 w-full h-0 opacity-0"
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={(e) => e.preventDefault()}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          autoFocus
          enterKeyHint="done"
        />
      </div>
    </div>
  );
};

export default TypeSession;
