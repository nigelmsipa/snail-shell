import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { books, bible } from "@/data/bible";
import { getChapterStatuses } from "@/lib/progress";

export const Browse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    return books.filter(book => 
      book.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getBookProgress = (bookKey: string): { mastered: number; total: number } => {
    const bookChapters = bible[bookKey as keyof typeof bible];
    if (!bookChapters) return { mastered: 0, total: 0 };
    
    let mastered = 0;
    let total = 0;
    
    for (const [chapterNum, verses] of Object.entries(bookChapters)) {
      const statuses = getChapterStatuses(bookKey as any, Number(chapterNum), verses.length);
      total += verses.length;
      mastered += statuses.filter(s => s === 'mastered').length;
    }
    
    return { mastered, total };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
              <div>
                <h1 className="text-2xl font-semibold">Browse Books</h1>
                <p className="text-muted-foreground">Choose a book and chapter to start memorizing</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Books grid */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const chapters = bible[book.key as keyof typeof bible];
            const chapterCount = chapters ? Object.keys(chapters).length : 0;
            const progress = getBookProgress(book.key);
            const progressPercent = progress.total > 0 ? Math.round((progress.mastered / progress.total) * 100) : 0;

            return (
              <Card key={book.key} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {book.label}
                    </span>
                    {progressPercent > 0 && (
                      <Badge variant="outline">{progressPercent}%</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      {chapterCount} chapters
                    </span>
                    {progress.total > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {progress.mastered}/{progress.total} verses mastered
                      </span>
                    )}
                  </div>
                  
                  {/* Chapter buttons */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground mb-2">
                      Popular chapters:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(chapters || {}).slice(0, 6).map((chapterNum) => {
                        const verses = chapters?.[chapterNum] || [];
                        const statuses = getChapterStatuses(book.key as any, Number(chapterNum), verses.length);
                        const masteredInChapter = statuses.filter(s => s === 'mastered').length;
                        const chapterProgress = verses.length > 0 ? Math.round((masteredInChapter / verses.length) * 100) : 0;
                        
                        return (
                          <Button
                            key={chapterNum}
                            variant={chapterProgress > 0 ? "default" : "outline"}
                            size="sm"
                            onClick={() => navigate(`/memorize/${book.key}/${chapterNum}`)}
                            className="relative"
                          >
                            Ch {chapterNum}
                            {chapterProgress > 0 && (
                              <Badge variant="secondary" className="ml-1 h-4 text-xs">
                                {chapterProgress}%
                              </Badge>
                            )}
                          </Button>
                        );
                      })}
                      {chapterCount > 6 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/memorize/${book.key}/1`)}
                          className="text-muted-foreground"
                        >
                          +{chapterCount - 6} more
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No books found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;