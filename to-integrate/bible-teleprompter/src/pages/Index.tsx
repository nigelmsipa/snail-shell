
import React from 'react';
import { createPortal } from 'react-dom';
import { useTeleprompter } from '@/hooks/useTeleprompter';
import Controls from '@/components/teleprompter/Controls';
import Prompter from '@/components/teleprompter/Prompter';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const Index = () => {
  const teleprompter = useTeleprompter();
  const [mobileSheetOpen, setMobileSheetOpen] = React.useState(false);
  return (
    <div className="h-screen bg-background text-foreground font-sans">
      {/* Mobile Layout */}
      <div className="md:hidden h-full relative">
        {/* Mobile Settings FAB via portal */}
        {createPortal(
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileSheetOpen(true)}
            className="md:hidden fixed z-[2147483647] bg-background/90 hover:bg-background border shadow"
            style={{ position: 'fixed', top: 'calc(env(safe-area-inset-top) + 16px)', left: '16px' }}
            title="Show Settings"
            aria-label="Show Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>,
          document.body
        )}
        <Prompter
          controlsVisible={teleprompter.controlsVisible}
          setControlsVisible={teleprompter.setControlsVisible}
          prompterRef={teleprompter.mobilePrompterRef}
          contentRef={teleprompter.mobileContentRef}
          isMirrored={teleprompter.isMirrored}
          bgColor={teleprompter.bgColor}
          textColor={teleprompter.textColor}
          fontSize={teleprompter.fontSize}
          textWidth={teleprompter.textWidth}
          text={teleprompter.text}
          isPlaying={teleprompter.isPlaying}
          scrollSpeed={teleprompter.scrollSpeed}
          handlePlayPause={teleprompter.handlePlayPause}
          handleResetScroll={teleprompter.handleResetScroll}
        />
        
        {/* Controlled mobile sheet */}
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetContent side="left" className="w-full sm:w-[400px] p-0">
            <div className="h-full overflow-auto p-4">
              <Controls
                text={teleprompter.text}
                setText={teleprompter.setText}
                fontSize={teleprompter.fontSize}
                setFontSize={teleprompter.setFontSize}
                scrollSpeed={teleprompter.scrollSpeed}
                setScrollSpeed={teleprompter.setScrollSpeed}
                textWidth={teleprompter.textWidth}
                setTextWidth={teleprompter.setTextWidth}
                isPlaying={teleprompter.isPlaying}
                handlePlayPause={teleprompter.handlePlayPause}
                isMirrored={teleprompter.isMirrored}
                setIsMirrored={teleprompter.setIsMirrored}
                bgColor={teleprompter.bgColor}
                setBgColor={teleprompter.setBgColor}
                textColor={teleprompter.textColor}
                setTextColor={teleprompter.setTextColor}
                setControlsVisible={teleprompter.setControlsVisible}
                handleResetScroll={teleprompter.handleResetScroll}
                selectedBook={teleprompter.selectedBook}
                setSelectedBook={teleprompter.setSelectedBook}
                startChapter={teleprompter.startChapter}
                setStartChapter={teleprompter.setStartChapter}
                endChapter={teleprompter.endChapter}
                setEndChapter={teleprompter.setEndChapter}
                selectedVersion={teleprompter.selectedVersion}
                setSelectedVersion={teleprompter.setSelectedVersion}
                fetchBiblePassage={teleprompter.fetchBiblePassage}
                isLoading={teleprompter.isLoading}
                isMobile={true}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        <ResizablePanelGroup direction="horizontal">
          {teleprompter.controlsVisible && (
            <>
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                <Controls
                  text={teleprompter.text}
                  setText={teleprompter.setText}
                  fontSize={teleprompter.fontSize}
                  setFontSize={teleprompter.setFontSize}
                  scrollSpeed={teleprompter.scrollSpeed}
                  setScrollSpeed={teleprompter.setScrollSpeed}
                  textWidth={teleprompter.textWidth}
                  setTextWidth={teleprompter.setTextWidth}
                  isPlaying={teleprompter.isPlaying}
                  handlePlayPause={teleprompter.handlePlayPause}
                  isMirrored={teleprompter.isMirrored}
                  setIsMirrored={teleprompter.setIsMirrored}
                  bgColor={teleprompter.bgColor}
                  setBgColor={teleprompter.setBgColor}
                  textColor={teleprompter.textColor}
                  setTextColor={teleprompter.setTextColor}
                  setControlsVisible={teleprompter.setControlsVisible}
                  handleResetScroll={teleprompter.handleResetScroll}
                  selectedBook={teleprompter.selectedBook}
                  setSelectedBook={teleprompter.setSelectedBook}
                  startChapter={teleprompter.startChapter}
                  setStartChapter={teleprompter.setStartChapter}
                  endChapter={teleprompter.endChapter}
                  setEndChapter={teleprompter.setEndChapter}
                  selectedVersion={teleprompter.selectedVersion}
                  setSelectedVersion={teleprompter.setSelectedVersion}
                  fetchBiblePassage={teleprompter.fetchBiblePassage}
                  isLoading={teleprompter.isLoading}
                  isMobile={false}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          
          <ResizablePanel defaultSize={teleprompter.controlsVisible ? 75 : 100}>
            <Prompter
              controlsVisible={teleprompter.controlsVisible}
              setControlsVisible={teleprompter.setControlsVisible}
              prompterRef={teleprompter.prompterRef}
              contentRef={teleprompter.contentRef}
              isMirrored={teleprompter.isMirrored}
              bgColor={teleprompter.bgColor}
              textColor={teleprompter.textColor}
              fontSize={teleprompter.fontSize}
              textWidth={teleprompter.textWidth}
              text={teleprompter.text}
              isPlaying={teleprompter.isPlaying}
              scrollSpeed={teleprompter.scrollSpeed}
              handlePlayPause={teleprompter.handlePlayPause}
              handleResetScroll={teleprompter.handleResetScroll}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
