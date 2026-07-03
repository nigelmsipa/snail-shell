import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, CheckCircle, Share, MoreVertical, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Install = () => {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)");
    setIsInstalled(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm space-y-4">
          <CheckCircle className="w-16 h-16 text-success mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Already Installed</h1>
          <p className="text-muted-foreground">
            Wolf & Word is installed on your device. You're all set!
          </p>
          <Link to="/">
            <Button className="mt-4">Go to App</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="text-center space-y-3">
          <Download className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Install Wolf & Word</h1>
          <p className="text-muted-foreground">
            Add the app to your home screen for the best experience — offline access, fast loading, and no browser chrome.
          </p>
        </div>

        {/* iOS Instructions */}
        <div className="bg-card rounded-xl p-5 space-y-3 border border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <span className="text-lg">🍎</span> iPhone / iPad
          </h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span>Tap the <Share className="inline w-4 h-4 text-primary" /> <strong className="text-foreground">Share</strong> button in Safari</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span>Scroll down and tap <strong className="text-foreground">Add to Home Screen</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span>Tap <strong className="text-foreground">Add</strong> to confirm</span>
            </li>
          </ol>
        </div>

        {/* Android Instructions */}
        <div className="bg-card rounded-xl p-5 space-y-3 border border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <span className="text-lg">🤖</span> Android
          </h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span>Tap the <MoreVertical className="inline w-4 h-4 text-primary" /> <strong className="text-foreground">menu</strong> in Chrome</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span>Tap <strong className="text-foreground">Install app</strong> or <strong className="text-foreground">Add to Home screen</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span>Tap <strong className="text-foreground">Install</strong> to confirm</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Install;
