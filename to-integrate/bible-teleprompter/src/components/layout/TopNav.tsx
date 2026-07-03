import { Link } from 'react-router-dom';
import PassageSelector from '@/components/PassageSelector';
import { BibleVersion } from '@/lib/constants';
import { Library as LibraryIcon } from 'lucide-react';

interface TopNavProps {
  selectedBook: string;
  startChapter: number;
  selectedVersion: BibleVersion;
  onPassageSelect: (book: string, chapter: number, version: BibleVersion) => void;
  onOpenLibrary: () => void;
}

const TopNav: React.FC<TopNavProps> = ({
  selectedBook,
  startChapter,
  selectedVersion,
  onPassageSelect,
  onOpenLibrary,
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 md:px-8 bg-surface-container-low/85 backdrop-blur-[12px]">
      <Link to="/" className="font-serif italic text-lg text-on-surface tracking-tight">
        Digital Vellum
      </Link>

      <PassageSelector
        selectedBook={selectedBook}
        startChapter={startChapter}
        selectedVersion={selectedVersion}
        onSelect={onPassageSelect}
      />

      <button
        onClick={onOpenLibrary}
        className="flex items-center gap-2 text-sm font-sans text-on-surface-variant hover:text-on-surface transition-colors duration-300"
      >
        <LibraryIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Library</span>
      </button>
    </nav>
  );
};

export default TopNav;
