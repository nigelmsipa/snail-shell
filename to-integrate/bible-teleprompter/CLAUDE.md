# Speak Easy Text Flow - Teleprompter Application

## Overview
A React-based teleprompter application built for Bible reading sessions with smooth auto-scrolling, customizable display options, and mobile-first design.

## Key Features
- **Auto-scrolling teleprompter** with adjustable speed
- **Bible passage integration** via bible-api.com
- **Customizable display**: font size, colors, text width, mirroring
- **Mobile-responsive design** with touch-friendly controls
- **Progress tracking** with visual scroll indicator
- **Resizable desktop layout** with collapsible controls panel

## Architecture
- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: Custom hooks with localStorage persistence
- **API**: bible-api.com for Bible passages

## Core Components

### `/src/hooks/useTeleprompter.ts`
- Main application state and logic
- Handles auto-scrolling animation using requestAnimationFrame
- Manages settings persistence via localStorage
- Bible passage fetching functionality

### `/src/components/teleprompter/Prompter.tsx`
- Main teleprompter display component
- Scroll progress indicator
- Static play/pause and reset controls (absolute positioned)
- Responsive text rendering with customizable styling

### `/src/components/teleprompter/Controls.tsx`
- Settings panel for customizing display and behavior
- Bible book/chapter selection
- Speed, font size, colors, and layout controls

### `/src/pages/Index.tsx`
- Main application layout
- Desktop: Resizable panels (controls + prompter)
- Mobile: Full-screen prompter with sheet-based controls

## Recent Changes (2025-01-14)
- **Fixed mobile scrolling issues**: Simplified scroll logic, removed complex transform fallbacks
- **Restored static play button**: Changed from portal-based fixed positioning to absolute positioning
- **Improved mobile compatibility**: Removed CSS properties that interfered with touch scrolling
- **Code cleanup**: Removed unused ControlsOverlay component
- **CRITICAL FIX - Mobile Scroll Ref Conflict**: Fixed iPad auto-scroll by resolving React ref conflicts between responsive layouts

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Mobile Considerations
- Uses native WebkitOverflowScrolling for smooth iOS scrolling
- Touch-friendly button sizes (48px minimum)
- Safe area insets for mobile devices
- Sheet-based controls panel on mobile

## Settings Persistence
All user preferences are stored in localStorage:
- `teleprompterText` - Current text content
- `teleprompterFontSize` - Font size (default: 64px)
- `teleprompterScrollSpeed` - Scroll speed (default: 20)
- `teleprompterTextWidth` - Text width percentage (default: 80%)
- `teleprompterBgColor` - Background color (default: #000000)
- `teleprompterTextColor` - Text color (default: #FFFFFF)
- `bibleBook`, `bibleStartChapter`, `bibleEndChapter` - Bible selection

## Critical Bug Resolved: Mobile Auto-Scroll Ref Conflict

### Problem
**Issue**: Play button would flash from play→pause→play on iPad/mobile, with no actual scrolling occurring. The same button worked perfectly on desktop.

**Symptoms**:
- Play button briefly showed pause icon (~millisecond) then reverted to play
- No text scrolling despite animation appearing to start
- Issue only occurred on iPad/mobile portrait mode
- Desktop and iPad landscape mode worked correctly
- Bug reproduced when resizing desktop browser to mobile size

### Root Cause
**React Ref Conflict Between Responsive Layouts**

The application uses dual responsive layouts:
1. **Mobile Layout**: `<div className="md:hidden">` - Contains one Prompter component
2. **Desktop Layout**: `<div className="hidden md:flex">` - Contains another Prompter component

Both layouts rendered **simultaneously** (one visible, one hidden) but shared the **same `prompterRef`** from the `useTeleprompter` hook.

**What was happening**:
- User clicks play on mobile → scroll animation starts
- `prompterRef.current` pointed to the **hidden desktop Prompter element**
- Scroll logic tried to animate the wrong DOM element
- Animation would immediately stop because hidden element had `maxScroll = 0`
- Result: Button flashed and no visible scrolling occurred

### Solution
**Separated refs for each responsive layout**:

1. **Added dedicated mobile refs** in `useTeleprompter.ts`:
   ```typescript
   const mobilePrompterRef = useRef<HTMLDivElement>(null);
   const mobileContentRef = useRef<HTMLDivElement>(null);
   ```

2. **Updated mobile layout** to use mobile-specific refs:
   ```typescript
   // Mobile layout now uses:
   prompterRef={teleprompter.mobilePrompterRef}
   contentRef={teleprompter.mobileContentRef}
   ```

3. **Enhanced scroll logic** to detect active prompter:
   ```typescript
   const activePrompter = mobilePrompterRef.current || prompterRef.current;
   ```

### Key Debugging Insight
The breakthrough came from observing that "the button behaves differently when desktop is resized to mobile size" - this pointed directly to the responsive layout being the culprit rather than iOS-specific scrolling issues.

### Technical Details
- **Mobile Portrait**: Uses `mobilePrompterRef` → ✅ Works
- **Desktop/Landscape**: Uses `prompterRef` → ✅ Works
- **No more ref conflicts**: Each layout targets its own DOM element
- **Automatic detection**: Scroll logic automatically finds the active (visible) prompter

This fix ensures reliable auto-scrolling across all devices and orientations.

## Known Issues
- None currently identified

## Future Enhancements
- Keyboard shortcuts for common actions
- Export/import of custom text
- Multiple Bible translations
- Voice control integration