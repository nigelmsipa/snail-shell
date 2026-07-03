import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddVerseChoiceModalProps {
  open: boolean;
  onClose: () => void;
  onChooseSingle: () => void;
  onChooseCollection: () => void;
}

export default function AddVerseChoiceModal({
  open,
  onClose,
  onChooseSingle,
  onChooseCollection,
}: AddVerseChoiceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-wide text-foreground">
            What would you like to add?
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Single Verse Option */}
          <button
            onClick={() => {
              onClose();
              onChooseSingle();
            }}
            className="group relative bg-muted hover:bg-accent border border-border hover:border-muted-foreground rounded-lg p-6 transition-all text-left"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-card border border-border rounded-lg flex items-center justify-center text-2xl">
                📄
              </div>
              <div className="flex-1">
                <div className="text-base font-bold text-foreground mb-1">
                  Single Verse or Range
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Add one verse or a contiguous range from a single chapter
                  <div className="text-muted-foreground/70 mt-1">
                    Example: Genesis 1:1 or Psalm 23:1-6
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Collection Option */}
          <button
            onClick={() => {
              onClose();
              onChooseCollection();
            }}
            className="group relative bg-muted hover:bg-accent border border-border hover:border-muted-foreground rounded-lg p-6 transition-all text-left"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-card border border-border rounded-lg flex items-center justify-center text-2xl">
                📚
              </div>
              <div className="flex-1">
                <div className="text-base font-bold text-foreground mb-1">
                  Collection
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Create a named collection with multiple verses from different books
                  <div className="text-muted-foreground/70 mt-1">
                    Example: "Promises" with verses from Genesis, Psalms, and John
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground font-medium tracking-wide"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
