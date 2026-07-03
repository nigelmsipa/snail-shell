import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ScriptureInputProps {
  onScriptureSubmit: (scripture: string, reference: string) => void;
}

export const ScriptureInput = ({ onScriptureSubmit }: ScriptureInputProps) => {
  const [scripture, setScripture] = useState("");
  const [reference, setReference] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scripture.trim()) {
      onScriptureSubmit(scripture.trim(), reference.trim());
    }
  };

  const fetchVerse = async () => {
    if (!reference.trim()) {
      toast.error("Please enter a scripture reference");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch verse");
      }

      const data = await response.json();
      // Build text with explicit verse numbers to ensure distinct lines
      const lines = Array.isArray((data as any).verses)
        ? (data as any).verses.map((v: any) => `${v.verse} ${String(v.text || '').trim()}`)
        : String((data as any).text || '').trim().split('\n').filter(Boolean);
      const verseText = lines.join('\n');
      
      setScripture(verseText);
      onScriptureSubmit(verseText, reference.trim());
      toast.success("Verse fetched successfully");
    } catch (error) {
      toast.error("Could not fetch verse. Please check the reference format (e.g., John 3:16 or Psalm 23:1-3)");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleLoad = async () => {
    const sampleReference = "Psalm 23:1-3";
    setReference(sampleReference);
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(sampleReference)}?translation=kjv`);
      const data = await response.json();
      const lines = Array.isArray((data as any).verses)
        ? (data as any).verses.map((v: any) => `${v.verse} ${String(v.text || '').trim()}`)
        : String((data as any).text || '').trim().split('\n').filter(Boolean);
      const verseText = lines.join('\n');
      
      setScripture(verseText);
      onScriptureSubmit(verseText, sampleReference);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-mono font-semibold tracking-tight">
          SCRIPTURE
          <br />
          POSTERS
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          GENERATIVE MEMORIZATION POSTERS BASED
          <br />
          ON THE FIRST LETTER OF EACH WORD.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reference" className="text-xs font-mono uppercase tracking-wide">
            1A. ENTER REFERENCE
          </Label>
          <div className="flex gap-2">
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Psalm 23:1-3"
              className="font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && fetchVerse()}
            />
            <Button 
              type="button"
              onClick={fetchVerse}
              disabled={isLoading || !reference.trim()}
              className="font-mono text-xs uppercase tracking-wide"
            >
              {isLoading ? "..." : "Fetch"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scripture" className="text-xs font-mono uppercase tracking-wide">
            1B. FETCHED SCRIPTURE
          </Label>
          <Textarea
            id="scripture"
            value={scripture}
            onChange={(e) => setScripture(e.target.value)}
            placeholder="Scripture will appear here..."
            className="min-h-32 font-mono text-sm resize-none"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase tracking-wide">
            1C. OR TRY ONE OF THESE
          </Label>
          <div className="space-y-1 text-xs font-mono">
            <button
              type="button"
              onClick={handleSampleLoad}
              className="block text-left hover:text-primary transition-colors"
            >
              [ ] THE SHEPHERD PSALM
            </button>
            <div className="text-muted-foreground">
              [ ] THE GREAT COMMISSION
              <br />
              [ ] THE ARMOR OF GOD
              <br />
              [ ] FRUITS OF THE SPIRIT
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={!scripture.trim() || isLoading}
          className="w-full font-mono text-xs uppercase tracking-wide"
        >
          Generate Poster
        </Button>
      </form>
    </div>
  );
};