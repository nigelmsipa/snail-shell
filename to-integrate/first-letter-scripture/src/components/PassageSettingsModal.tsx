import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Passage } from '@/types/passage';

interface PassageSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  passage: Passage;
  tags: string[];
  allUserTags: string[];
  note: string;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onUpdateNote: (note: string) => void;
  onDelete: () => void;
}

export function PassageSettingsModal({
  open,
  onOpenChange,
  passage,
  tags,
  allUserTags,
  note,
  onAddTag,
  onRemoveTag,
  onUpdateNote,
  onDelete,
}: PassageSettingsModalProps) {
  const [tagInput, setTagInput] = useState('');
  const [localNote, setLocalNote] = useState(note);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getReference = () => {
    if (passage.verseStart === 1 && passage.verseEnd >= 1) {
      return `${passage.book} ${passage.chapter}`;
    }
    if (passage.verseStart === passage.verseEnd) {
      return `${passage.book} ${passage.chapter}:${passage.verseStart}`;
    }
    return `${passage.book} ${passage.chapter}:${passage.verseStart}-${passage.verseEnd}`;
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAddTag(trimmed);
      setTagInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleNoteBlur = () => {
    if (localNote !== note) {
      onUpdateNote(localNote);
    }
  };

  // Suggestions: user's existing tags not already on this passage
  const suggestions = allUserTags.filter(t => !tags.includes(t));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{getReference()}</DialogTitle>
          <DialogDescription>
            Manage tags, notes, and settings for this passage.
          </DialogDescription>
        </DialogHeader>

        {/* Tags Section */}
        <div className="space-y-3">
          <label className="text-body-sm font-medium text-foreground">Tags</label>
          <div className="flex flex-wrap gap-1.5 min-h-[28px]">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs gap-1 pr-1"
              >
                {tag}
                <button
                  onClick={() => onRemoveTag(tag)}
                  className="ml-0.5 rounded-full hover:bg-foreground/10 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-body-sm"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
              className="h-8 px-3"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {suggestions.slice(0, 8).map((s) => (
                <button
                  key={s}
                  onClick={() => onAddTag(s)}
                  className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Note Section */}
        <div className="space-y-2">
          <label className="text-body-sm font-medium text-foreground">Note</label>
          <Textarea
            placeholder="Why are you memorizing this passage?"
            value={localNote}
            onChange={(e) => setLocalNote(e.target.value)}
            onBlur={handleNoteBlur}
            className="min-h-[80px] text-body-sm resize-none"
          />
        </div>

        {/* Danger Zone */}
        <div className="pt-3 border-t border-border">
          {showDeleteConfirm ? (
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-destructive font-medium">Remove this passage?</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    onDelete();
                    onOpenChange(false);
                  }}
                  className="h-7 text-xs"
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Remove Passage
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
