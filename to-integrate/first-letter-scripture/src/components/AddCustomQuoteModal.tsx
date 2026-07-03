import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddCustomQuoteModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string, content: string, reference?: string) => void;
}

export default function AddCustomQuoteModal({
  open,
  onClose,
  onAdd,
}: AddCustomQuoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reference, setReference] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onAdd(title, content, reference || undefined);
    setTitle("");
    setContent("");
    setReference("");
    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setReference("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Quote</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="quote-title">Title*</Label>
            <Input
              id="quote-title"
              placeholder="e.g. My Favorite Prayer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="quote-content">Quote/Text*</Label>
            <Textarea
              id="quote-content"
              placeholder="Enter your quote or custom text..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="quote-reference">Scripture Reference (optional)</Label>
            <Input
              id="quote-reference"
              placeholder="e.g. John 3:16"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
          >
            Add Quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
