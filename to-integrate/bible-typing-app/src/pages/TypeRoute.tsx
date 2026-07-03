import { useParams, useLocation } from "react-router-dom";
import { bible, BookKey } from "@/data/bible";
import { EnhancedTypingSession } from "@/components/Typing/EnhancedTypingSession";
import NotFound from "./NotFound";

const TypeRoute = () => {
  const { book, chapter } = useParams();
  const location = useLocation();
  const b = (book || "") as BookKey;
  const c = Number(chapter);
  
  // Get focus verse from state or default to 1
  const focusVerse = location.state?.focusVerse || 1;
  const mode = location.state?.mode || "standard";

  if (!b || !(b in bible)) return <NotFound />;
  if (!c || !bible[b][c]) return <NotFound />;

  return (
    <EnhancedTypingSession 
      book={b} 
      chapter={c} 
      focusVerseNumber={focusVerse}
      mode={mode}
    />
  );
};

export default TypeRoute;