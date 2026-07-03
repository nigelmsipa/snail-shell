import React from 'react';
import { Play, Pause, Monitor, MonitorOff, Palette, PanelLeft, Plus, Minus, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import { colorPresets, BIBLE_VERSIONS, BibleVersion } from '@/lib/constants';
import { bibleBooks, bibleBookChapters } from '@/lib/bibleBooks';

interface ControlsProps {
  text: string;
  setText: (text: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  scrollSpeed: number;
  setScrollSpeed: (speed: number) => void;
  textWidth: number;
  setTextWidth: (width: number) => void;
  isPlaying: boolean;
  handlePlayPause: () => void;
  isMirrored: boolean;
  setIsMirrored: (update: React.SetStateAction<boolean>) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  setControlsVisible: (visible: boolean) => void;
  handleResetScroll: () => void;
  selectedBook: string;
  setSelectedBook: (book: string) => void;
  startChapter: number;
  setStartChapter: (chapter: number) => void;
  endChapter: number;
  setEndChapter: (chapter: number) => void;
  selectedVersion: BibleVersion;
  setSelectedVersion: (version: BibleVersion) => void;
  fetchBiblePassage: () => void;
  isLoading: boolean;
  isMobile?: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  text, setText,
  fontSize, setFontSize,
  scrollSpeed, setScrollSpeed,
  textWidth, setTextWidth,
  isPlaying, handlePlayPause,
  isMirrored, setIsMirrored,
  bgColor, setBgColor,
  textColor, setTextColor,
  setControlsVisible,
  handleResetScroll,
  selectedBook, setSelectedBook,
  startChapter, setStartChapter,
  endChapter, setEndChapter,
  selectedVersion, setSelectedVersion,
  fetchBiblePassage,
  isLoading,
  isMobile = false
}) => {
  return (
    <div className={`${isMobile ? 'w-full' : 'w-full'} bg-surface-container-low h-full flex flex-col overflow-hidden`}>
      <div className={`flex items-center justify-between p-4 border-b border-outline-variant/30 ${isMobile ? 'pt-6' : ''}`}>
        <h1 className="font-serif italic text-lg text-on-surface tracking-tight">Digital Vellum</h1>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setControlsVisible(false)} title="Hide Controls" className="text-on-surface-variant hover:text-on-surface">
            <PanelLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
      
      {/* Bible Passage */}
      <div className="space-y-4">
        <label className="font-serif text-sm font-medium text-on-surface">Bible Passage</label>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs text-on-surface-variant mb-1 block font-sans tracking-wide uppercase">Version</label>
            <Select value={selectedVersion} onValueChange={(value) => setSelectedVersion(value as BibleVersion)}>
              <SelectTrigger className="bg-surface-container-lowest border-outline-variant/30 text-on-surface">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BIBLE_VERSIONS.map((version) => (
                  <SelectItem key={version.abbreviation} value={version.abbreviation}>
                    {version.abbreviation} - {version.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-on-surface-variant mb-1 block font-sans tracking-wide uppercase">Book</label>
            <Select value={selectedBook} onValueChange={setSelectedBook}>
              <SelectTrigger className="bg-surface-container-lowest border-outline-variant/30 text-on-surface">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {bibleBooks.map((book) => (
                  <SelectItem key={book} value={book}>
                    {book}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-on-surface-variant mb-1 block font-sans tracking-wide uppercase">Start</label>
              <Select 
                value={startChapter.toString()} 
                onValueChange={(value) => {
                  const newStart = parseInt(value);
                  setStartChapter(newStart);
                  if (newStart > endChapter) {
                    setEndChapter(newStart);
                  }
                }}
              >
                <SelectTrigger className="h-12 text-lg font-mono bg-surface-container-lowest border-outline-variant/30 text-on-surface">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {Array.from({ length: bibleBookChapters[selectedBook] || 1 }, (_, i) => i + 1).map((chapter) => (
                    <SelectItem key={chapter} value={chapter.toString()}>
                      {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-on-surface-variant mb-1 block font-sans tracking-wide uppercase">End</label>
              <Select 
                value={endChapter.toString()} 
                onValueChange={(value) => setEndChapter(parseInt(value))}
              >
                <SelectTrigger className="h-12 text-lg font-mono bg-surface-container-lowest border-outline-variant/30 text-on-surface">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {Array.from({ length: bibleBookChapters[selectedBook] || 1 }, (_, i) => i + 1)
                    .filter(chapter => chapter >= startChapter)
                    .map((chapter) => (
                    <SelectItem key={chapter} value={chapter.toString()}>
                      {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {startChapter !== endChapter && (
            <div className="text-xs text-on-surface-variant bg-surface-container/50 p-2 rounded font-sans">
              📖 Reading {endChapter - startChapter + 1} chapters: {selectedBook} {startChapter}-{endChapter}
            </div>
          )}
          
          <Button 
            onClick={fetchBiblePassage} 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Load Passage
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-3">
        <label className="font-serif text-sm font-medium text-on-surface">Font Size: {fontSize}px</label>
        <div className="px-2">
          <Slider
            min={12}
            max={200}
            step={1}
            value={[fontSize]}
            onValueChange={(value) => setFontSize(value[0])}
            className="w-full"
          />
        </div>
      </div>

      {/* Scroll Speed */}
      <div className="space-y-3">
        <label className="font-serif text-sm font-medium text-on-surface">Scroll Speed: {scrollSpeed}</label>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setScrollSpeed(Math.max(scrollSpeed - 1, 5))}
            disabled={scrollSpeed <= 5}
            className="shrink-0 border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center bg-surface-container rounded-md py-3 font-mono text-lg font-semibold text-on-surface">
            {scrollSpeed}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setScrollSpeed(Math.min(scrollSpeed + 1, 100))}
            disabled={scrollSpeed >= 100}
            className="shrink-0 border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Text Width */}
      <div className="space-y-3">
        <label className="font-serif text-sm font-medium text-on-surface">Text Width: {textWidth}%</label>
        <div className="px-2">
          <Slider
            min={40}
            max={100}
            step={1}
            value={[textWidth]}
            onValueChange={(value) => setTextWidth(value[0])}
            className="w-full"
          />
        </div>
      </div>

      {/* Colors */}
      <div className="flex items-center space-x-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start border-outline-variant/30 text-on-surface-variant hover:text-on-surface">
              <Palette className="mr-2 h-4 w-4" />
              Colors
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-none" align="start">
            <div className="p-4 space-y-4 bg-surface-container-low rounded-lg">
              <div>
                <label className="font-serif text-sm text-on-surface">Text Color</label>
                <HexColorPicker color={textColor} onChange={setTextColor} className="!w-full mt-2" />
              </div>
              <div>
                <label className="font-serif text-sm text-on-surface">Background Color</label>
                <HexColorPicker color={bgColor} onChange={setBgColor} className="!w-full mt-2" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Color Presets */}
      <div className="space-y-2">
        <label className="font-serif text-sm font-medium text-on-surface">Color Presets</label>
        <div className="grid grid-cols-4 gap-2">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setBgColor(preset.bgColor);
                setTextColor(preset.textColor);
              }}
              className="aspect-square rounded-md border-2 border-outline-variant/30 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring flex items-center justify-center"
              style={{ backgroundColor: preset.bgColor }}
              title={preset.name}
            >
              <span className="font-semibold text-lg" style={{ color: preset.textColor }}>Aa</span>
            </button>
          ))}
        </div>
      </div>

      {/* Play/Pause + Mirror */}
      <div className="flex items-center space-x-2">
        <Button onClick={handlePlayPause} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={() => setIsMirrored(prev => !prev)} variant={isMirrored ? "secondary" : "outline"} title="Mirror Text" className="border-outline-variant/30">
          {isMirrored ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
        </Button>
      </div>
      <Button onClick={handleResetScroll} variant="outline" className="w-full border-outline-variant/30 text-on-surface-variant hover:text-on-surface">
        Reset Scroll
      </Button>
      </div>
    </div>
  );
};

export default Controls;
