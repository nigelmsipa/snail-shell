import { useState } from "react";
import { ScriptureInput } from "@/components/ScriptureInput";
import { PosterPreview } from "@/components/PosterPreview";

const Index = () => {
  const [currentScripture, setCurrentScripture] = useState("");
  const [currentReference, setCurrentReference] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleScriptureSubmit = (scripture: string, reference: string) => {
    setCurrentScripture(scripture);
    setCurrentReference(reference);
    setShowPreview(true);
  };

  const handleReset = () => {
    setCurrentScripture("");
    setCurrentReference("");
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            <ScriptureInput onScriptureSubmit={handleScriptureSubmit} />
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {showPreview ? (
              <PosterPreview
                scripture={currentScripture}
                reference={currentReference}
                onReset={handleReset}
              />
            ) : (
              <div className="flex items-center justify-center h-96 border-2 border-dashed border-accent rounded-lg">
                <div className="text-center text-muted-foreground">
                  <div className="text-4xl mb-4">📜</div>
                  <div className="font-mono text-sm uppercase tracking-wide">
                    POSTER PREVIEW
                    <br />
                    WILL APPEAR HERE
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-accent text-center">
          <div className="text-xs font-mono text-muted-foreground space-y-2">
            <div>SCRIPTURE POSTER GENERATOR</div>
            <div>HELPING BELIEVERS MEMORIZE GOD'S WORD</div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;