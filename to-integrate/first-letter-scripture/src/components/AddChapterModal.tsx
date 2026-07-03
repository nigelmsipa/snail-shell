import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


interface AvailableChapter {
  id: string;
  book: string;
  chapter: number;
}

interface AddChapterModalProps {
  open: boolean;
  onClose: () => void;
  onAddChapter: (book: string, chapter: string) => void;
  existingChapters: string[];
  availableChapters: AvailableChapter[];
  isLoadingAvailableChapters: boolean;
}

// Comprehensive Bible book list with chapter counts
const BIBLE_BOOKS = [
  // Old Testament
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 },
  { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 },
  { name: 'Ruth', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Kings', chapters: 22 },
  { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 },
  { name: '2 Chronicles', chapters: 36 },
  { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 },
  { name: 'Esther', chapters: 10 },
  { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 },
  { name: 'Isaiah', chapters: 66 },
  { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 },
  { name: 'Ezekiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 },
  { name: 'Joel', chapters: 3 },
  { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 },
  { name: 'Jonah', chapters: 4 },
  { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 },
  { name: 'Habakkuk', chapters: 3 },
  { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 },
  { name: 'Zechariah', chapters: 14 },
  { name: 'Malachi', chapters: 4 },
  // New Testament
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 },
  { name: '2 Thessalonians', chapters: 3 },
  { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 },
  { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 },
  { name: '1 John', chapters: 5 },
  { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 },
  { name: 'Jude', chapters: 1 },
  { name: 'Revelation', chapters: 22 }
];

export default function AddChapterModal({ 
  open, 
  onClose, 
  onAddChapter, 
  existingChapters,
  availableChapters,
  isLoadingAvailableChapters 
}: AddChapterModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  const filteredBooks = BIBLE_BOOKS.filter(book =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChapterSelect = (book: string, chapter: number) => {
    const chapterId = `${book} ${chapter}`;
    if (!existingChapters.includes(chapterId)) {
      onAddChapter(book, chapter.toString());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent style={{ 
          maxWidth: '700px', 
          maxHeight: '80vh',
          fontFamily: 'JetBrains Mono, monospace',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column' as const
        }}>
        <DialogHeader>
          <DialogTitle style={{
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Add Chapter to Memorize
          </DialogTitle>
        </DialogHeader>

        <div style={{ marginTop: '20px', flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' as const }}>
          <Input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              fontSize: '12px',
              fontFamily: 'inherit',
              padding: '12px 16px',
              marginBottom: '20px'
            }}
          />

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' as const }}>
            {selectedBook ? (
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedBook(null)}
                  style={{
                    marginBottom: '16px',
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}
                >
                  ← Back to Books
                </Button>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '10px'
                }}>
                  {Array.from({ length: BIBLE_BOOKS.find(b => b.name === selectedBook)?.chapters || 0 }, (_, i) => i + 1).map(chapter => {
                    const chapterId = `${selectedBook} ${chapter}`;
                    const isAdded = existingChapters.includes(chapterId);
                    const isDisabled = isAdded;
                    
                    return (
                      <button
                        key={chapter}
                        onClick={() => !isDisabled && handleChapterSelect(selectedBook, chapter)}
                        disabled={isDisabled}
                        style={{
                          padding: '12px',
                          background: isDisabled ? '#f5f5f5' : '#fafafa',
                          border: '1px solid #e8e8e8',
                          borderRadius: '4px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: isDisabled ? '#999' : '#1a1a1a',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          fontFamily: 'inherit',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px'
                        }}
                        onMouseEnter={(e) => {
                          if (!isDisabled) {
                            e.currentTarget.style.background = '#f0f0f0';
                            e.currentTarget.style.borderColor = '#ccc';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isDisabled) {
                            e.currentTarget.style.background = '#fafafa';
                            e.currentTarget.style.borderColor = '#e8e8e8';
                          }
                        }}
                      >
                        <span>{chapter}</span>
                        {isAdded && (
                          <span style={{ fontSize: '9px', color: '#999' }}>Added</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredBooks.map(book => (
                  <button
                    key={book.name}
                    onClick={() => setSelectedBook(book.name)}
                    style={{
                      padding: '16px 20px',
                      background: '#fafafa',
                      border: '1px solid #e8e8e8',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0f0f0';
                      e.currentTarget.style.borderColor = '#ccc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fafafa';
                      e.currentTarget.style.borderColor = '#e8e8e8';
                    }}
                  >
                    <span>{book.name}</span>
                    <span style={{ fontSize: '11px', color: '#999' }}>
                      {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
