import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Search, SlidersHorizontal, LogOut, User, Settings, Clock, BookOpen } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PassageCard } from './PassageCard';
import { SortablePassageCard } from './SortablePassageCard';
import { AddPassageModal } from './AddPassageModal';
import { PassageSettingsModal } from './PassageSettingsModal';
import { OnboardingWizard } from './OnboardingWizard';
import { HeatMap } from '@/components/HeatMap';
import { MilestoneBadge } from '@/components/MilestoneBadge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { usePassages } from '@/hooks/usePassages';
import { usePassageTags } from '@/hooks/usePassageTags';
import { useDailyActivity } from '@/hooks/useDailyActivity';
import { useLibraryProgress } from '@/hooks/useLibraryProgress';
import { useDueReviews } from '@/hooks/useDueReviews';
import { Card } from '@/components/ui/card';
import { Passage } from '@/types/passage';
import { getCanonicalOrder } from '@/data/canonicalOrder';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { passages, isLoading: passagesLoading, createPassage, deletePassage, updatePassage, updateDisplayOrder } = usePassages(user?.id);
  const { uniqueTags, tagsByPassageMap, tagCounts, addTag, removeTag } = usePassageTags(user?.id);
  const { data: dailyActivity = [] } = useDailyActivity(user?.id, 364);
  const { data: libraryProgress } = useLibraryProgress(user?.id, passages);
  const { data: dueReviews = [] } = useDueReviews(user?.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'biblical' | 'date' | 'manual'>('biblical');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [settingsPassage, setSettingsPassage] = useState<Passage | null>(null);

  // Show onboarding for new users with no passages
  const shouldShowOnboarding = user && !passagesLoading && passages.length === 0 && !localStorage.getItem('wolf-word-onboarding-complete');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Enrich passages with tags
  // Enrich passages with tags (tagsByPassageMap is stable/memoized)
  const enrichedPassages = useMemo(() => {
    return passages.map(p => ({
      ...p,
      tags: tagsByPassageMap[p.id] ?? [],
    }));
  }, [passages, tagsByPassageMap]);

  // Calculate streak
  const streak = useMemo(() => {
    if (dailyActivity.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dataMap = new Map<string, number>();
    dailyActivity.forEach((item) => {
      const dateStr = item.date.toISOString().split('T')[0];
      dataMap.set(dateStr, item.count);
    });

    let currentStreak = 0;
    const checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) || 0;
      
      if (count > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (checkDate.getTime() === today.getTime()) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return currentStreak;
  }, [dailyActivity]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleAddPassage = (passage: { book: string; chapter: number; verseStart: number; verseEnd: number; versionId: string }) => {
    createPassage(passage);
  };

  const handlePassageClick = (passage: Passage) => {
    navigate(`/passage/${passage.id}`);
  };

  // Filter and sort passages
  const visiblePassages = useMemo(() => {
    let filtered = enrichedPassages;

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter(p => p.tags?.includes(selectedTag));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.book.toLowerCase().includes(query) ||
        `${p.book} ${p.chapter}`.toLowerCase().includes(query)
      );
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'biblical': {
          const orderA = getCanonicalOrder(a.book);
          const orderB = getCanonicalOrder(b.book);
          if (orderA !== orderB) return orderA - orderB;
          if (a.chapter !== b.chapter) return a.chapter - b.chapter;
          return a.verseStart - b.verseStart;
        }
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'manual':
          return (a.displayOrder ?? 999) - (b.displayOrder ?? 999);
        default:
          return 0;
      }
    });
  }, [enrichedPassages, searchQuery, sortBy, selectedTag]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = visiblePassages.findIndex(p => p.id === active.id);
    const newIndex = visiblePassages.findIndex(p => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...visiblePassages];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    updateDisplayOrder(reordered.map(p => p.id));
  };

  if (authLoading) {
    return null;
  }

  

  // Get fresh note for the settings modal from the passages array
  const settingsPassageNote = settingsPassage
    ? (passages.find(p => p.id === settingsPassage.id)?.note ?? '')
    : '';

  const passageGrid = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {sortBy === 'manual' ? (
        visiblePassages.map((passage) => (
          <SortablePassageCard
            key={passage.id}
            passage={passage}
            onSettingsClick={setSettingsPassage}
            onClick={handlePassageClick}
            sortMode={sortBy}
          />
        ))
      ) : (
        visiblePassages.map((passage) => (
          <PassageCard
            key={passage.id}
            passage={passage}
            onSettingsClick={setSettingsPassage}
            onClick={handlePassageClick}
            sortMode={sortBy}
          />
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-h2 font-bold tracking-wide text-foreground">
              WOLF & WORD
            </h1>
            <p className="text-caption text-muted-foreground tracking-wide">
              Memorize Scripture. Guard Your Heart.
            </p>
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.full_name || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
                  {user.user_metadata?.full_name || user.email}
                </div>
                <DropdownMenuItem onClick={() => navigate('/settings')} className="text-xs cursor-pointer">
                  <Settings className="w-3.5 h-3.5 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-xs cursor-pointer">
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => navigate('/auth')}
              variant="ghost"
              size="sm"
              className="text-caption"
            >
              Sign In
            </Button>
          )}
        </header>

        {/* Guest CTA */}
        {!user && (
          <div className="text-center py-16">
            <h2 className="text-h2 font-bold mb-3 text-foreground">
              Start Your Scripture Memory Journey
            </h2>
            <p className="text-body text-muted-foreground mb-6">
              Sign in to save your progress and track your memorization
            </p>
            <Button onClick={() => navigate('/auth')} size="lg">
              Get Started
            </Button>
          </div>
        )}

        {/* Authenticated Content */}
        {user && (shouldShowOnboarding ? (
            <OnboardingWizard
              onAddPassage={(passage) => createPassage(passage)}
              onComplete={() => setShowOnboarding(false)}
              lastCreatedPassageId={passages[0]?.id}
            />
          ) : (
          <>
            {/* Library Progress */}
            {libraryProgress && libraryProgress.total > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{libraryProgress.mastered}</span>/{libraryProgress.total} verses mastered
                  </span>
                  <MilestoneBadge
                    completedPassages={libraryProgress.completedPassageCount}
                    masteredVerses={libraryProgress.mastered}
                  />
                </div>
                <Progress
                  value={(libraryProgress.mastered / libraryProgress.total) * 100}
                  className="h-2"
                />
              </div>
            )}

            {/* Heat Map */}
            <div className="mb-8">
              <HeatMap data={dailyActivity} streak={streak} />
            </div>

            {/* Due for Review Card */}
            {dueReviews.length > 0 && (
              <Card
                className="mb-6 p-4 border-amber-500/30 bg-amber-500/5 cursor-pointer hover:bg-amber-500/10 transition-colors"
                onClick={() => {
                  const firstDue = dueReviews[0];
                  if (firstDue) {
                    const parts = firstDue.chapter_id.match(/^(.+)\s(\d+)$/);
                    if (parts) {
                      const [, book, chapter] = parts;
                      const match = passages.find(p => p.book === book && p.chapter === Number(chapter));
                      if (match) {
                        navigate(`/passage/${match.id}`);
                        return;
                      }
                    }
                    const fallback = passages[0];
                    if (fallback) navigate(`/passage/${fallback.id}`);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <span className="text-body-sm font-medium text-foreground">
                      {dueReviews.length} {dueReviews.length === 1 ? 'pericope' : 'pericopes'} due for review
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="text-caption border-amber-500/30 text-amber-600 hover:bg-amber-500/10">
                    Review Now
                  </Button>
                </div>
              </Card>
            )}

            {/* Primary CTA */}
            {passages.find(p => p.status === 'in_progress') && (
              <Button
                onClick={() => {
                  const activePassage = passages.find(p => p.status === 'in_progress');
                  if (activePassage) {
                    navigate(`/passage/${activePassage.id}`);
                  }
                }}
                size="lg"
                className="w-full mb-8 h-12 text-body font-semibold bg-practice text-practice-foreground hover:bg-practice/90"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Today's Session
              </Button>
            )}

            {/* Passages Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h3 font-semibold text-foreground">Your Passages</h2>
                <Button 
                  onClick={() => setIsAddModalOpen(true)} 
                  variant="outline"
                  size="sm"
                  className="text-caption border-browse/30 text-browse hover:bg-browse/10 hover:text-browse"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              {/* Tag Filter Bar */}
              {uniqueTags.length > 0 && (
                <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`shrink-0 text-xs px-3 py-1 rounded-full border transition-colors ${
                      selectedTag === null
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    All
                  </button>
                  {uniqueTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`shrink-0 text-xs px-3 py-1 rounded-full border transition-colors ${
                        selectedTag === tag
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {tag} ({tagCounts[tag] ?? 0})
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      if (passages.length > 0) {
                        setSettingsPassage(passages[0]);
                      } else {
                        setIsAddModalOpen(true);
                      }
                    }}
                    className="shrink-0 text-xs px-2.5 py-1 rounded-full border border-dashed border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Search and Sort */}
              {passages.length > 3 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9 text-body-sm bg-muted/30 border-0"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'biblical' | 'date' | 'manual')}>
                    <SelectTrigger className="w-auto h-9 text-body-sm bg-muted/30 border-0 gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="biblical">Biblical</SelectItem>
                      <SelectItem value="date">Recent</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Passages Grid */}
            {passagesLoading ? null : visiblePassages.length > 0 ? (
              sortBy === 'manual' ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={visiblePassages.map(p => p.id)} strategy={rectSortingStrategy}>
                    {passageGrid}
                  </SortableContext>
                </DndContext>
              ) : (
                passageGrid
              )
            ) : passages.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-10 h-10 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-body font-medium text-foreground mb-1">
                  No passages yet
                </p>
                <p className="text-body-sm text-muted-foreground mb-6">
                  Add your first passage and start memorizing Scripture.
                </p>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Passage
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-body-sm">
                No passages match your search{selectedTag ? ` or tag "${selectedTag}"` : ''}.
              </div>
            )}

            <AddPassageModal
              open={isAddModalOpen}
              onOpenChange={setIsAddModalOpen}
              onAdd={handleAddPassage}
            />

            {/* Passage Settings Modal */}
            {settingsPassage && (
              <PassageSettingsModal
                open={!!settingsPassage}
                onOpenChange={(open) => { if (!open) setSettingsPassage(null); }}
                passage={settingsPassage}
                tags={tagsByPassageMap[settingsPassage.id] ?? []}
                allUserTags={uniqueTags}
                note={settingsPassageNote ?? ''}
                onAddTag={(tag) => addTag({ passageId: settingsPassage.id, tag })}
                onRemoveTag={(tag) => removeTag({ passageId: settingsPassage.id, tag })}
                onUpdateNote={(note) => updatePassage({ id: settingsPassage.id, updates: { note } })}
                onDelete={() => deletePassage(settingsPassage.id)}
              />
            )}
          </>
        ))}

      </div>
    </div>
  );
}
