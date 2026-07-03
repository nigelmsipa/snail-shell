# Design System Documentation

## Overview
This document defines the comprehensive design system for the application, including colors, typography, spacing, elevation, and usage guidelines.

## Color System

### Base Colors
- **Background**: Primary surface color (`--background`)
- **Foreground**: Primary text color (`--foreground`)
- **Card**: Card background (`--card`)
- **Border**: Borders and dividers (`--border`)

### Semantic Colors
Use these for specific UI states and feedback:

#### Success
- **Color**: `--success` (142 71% 45%) - Green
- **Usage**: Completed verses, positive feedback, successful actions
- **Classes**: `bg-success`, `text-success`, `border-success`
- **Component**: `.badge-success`

#### Warning
- **Color**: `--warning` (38 92% 50%) - Orange/Amber
- **Usage**: Cautions, warnings, items needing attention
- **Classes**: `bg-warning`, `text-warning`, `border-warning`
- **Component**: `.badge-warning`

#### Info
- **Color**: `--info` (199 89% 48%) - Blue
- **Usage**: Neutral information, tooltips, helpful hints
- **Classes**: `bg-info`, `text-info`, `border-info`
- **Component**: `.badge-info`

#### Destructive
- **Color**: `--destructive` (0 70% 50%) - Red
- **Usage**: Errors, delete actions, critical warnings
- **Classes**: `bg-destructive`, `text-destructive-foreground`

### Section-Based Theming
Inspired by modern app design (like Owl), different sections of the app use distinct color themes for visual hierarchy and context switching.

#### Practice Section (Yellow Theme)
- **Color**: `--section-practice` (45 100% 51%)
- **Routes**: `/practice/*`, FocusedVersePractice
- **Usage**: Learning modes, typing practice, word-by-word
- **Classes**: 
  - `bg-practice`, `text-practice-foreground`
  - `section-practice` (includes border accent)
- **Example**:
  ```tsx
  <div className="section-practice p-6 rounded-lg">
    <h2 className="text-heading text-practice mb-4">Practice Mode</h2>
  </div>
  ```

#### Browse Section (Blue Theme)
- **Color**: `--section-browse` (217 91% 60%)
- **Routes**: `/chapter/*`, ChapterHub, HomePage
- **Usage**: Browsing chapters, exploring content, chapter selection
- **Classes**: 
  - `bg-browse`, `text-browse-foreground`
  - `section-browse` (includes border accent)
- **Example**:
  ```tsx
  <Button className="bg-browse text-browse-foreground hover:bg-browse/90">
    Start Reading
  </Button>
  ```

#### Review Section (Magenta/Pink Theme)
- **Color**: `--section-review` (340 82% 52%)
- **Routes**: `/test/*`, VerseTestModal, Dashboard review queues
- **Usage**: Testing, review modes, quiz interfaces
- **Classes**: 
  - `bg-review`, `text-review-foreground`
  - `section-review` (includes border accent)
- **Example**:
  ```tsx
  <div className="section-review p-6 rounded-lg">
    <h2 className="text-heading text-review mb-4">Review Queue</h2>
  </div>
  ```

## Typography Scale

### Display Headings
- **display-lg**: 4rem (64px) - Hero headings, landing pages
- **display-md**: 3rem (48px) - Major section headings
- **display-sm**: 2rem (32px) - Subsection headings

### Headings
- **h1**: 1.875rem (30px) - Page titles
- **h2**: 1.5rem (24px) - Section headers
- **h3**: 1.25rem (20px) - Subsection headers
- **h4**: 1.125rem (18px) - Minor headings

### Body Text
- **body-lg**: 1.125rem (18px) - Emphasized body text
- **body**: 1rem (16px) - Default body text
- **body-sm**: 0.875rem (14px) - Secondary text, captions

### Utility
- **caption**: 0.75rem (12px) - Tiny text, metadata
- **overline**: 0.625rem (10px) - Uppercase labels

### Typography Utilities
- `.text-display` - Apply display-md with bold weight
- `.text-heading` - Apply h2 with semibold weight

## Spacing Scale
Use Tailwind's default spacing scale:
- **4**: 0.25rem (4px) - Minimal spacing
- **8**: 0.5rem (8px) - Tight spacing
- **12**: 0.75rem (12px)
- **16**: 1rem (16px) - Default spacing
- **24**: 1.5rem (24px) - Medium spacing
- **32**: 2rem (32px) - Large spacing
- **48**: 3rem (48px) - Extra large spacing
- **64**: 4rem (64px) - Section spacing

## Elevation System
Use shadows to create depth and hierarchy:

- **elevation-1**: Subtle lift (cards at rest)
- **elevation-2**: Default cards, buttons
- **elevation-3**: Hover states, dropdowns
- **elevation-4**: Modals, popovers
- **elevation-5**: Maximum elevation (tooltips, alerts)

### Utility Classes
- `.card-elevated` - Card with elevation-2 and padding
- `.card-interactive` - Elevated card with hover effect

## Border Radius
- **none**: 0
- **sm**: 0.25rem (4px)
- **DEFAULT**: 0.375rem (6px)
- **md**: 0.5rem (8px)
- **lg**: 0.75rem (12px)
- **xl**: 1rem (16px)
- **2xl**: 1.5rem (24px)
- **3xl**: 2rem (32px)
- **full**: 9999px (circular)

## Component Patterns

### Section Containers
Use these for major sections of the app to apply appropriate theming:

```tsx
// Practice section
<section className="section-practice p-6 rounded-lg">
  {/* Practice content */}
</section>

// Browse section
<section className="section-browse p-6 rounded-lg">
  {/* Browse content */}
</section>

// Review section
<section className="section-review p-6 rounded-lg">
  {/* Review content */}
</section>
```

### Status Badges
```tsx
<span className="badge-success">Completed</span>
<span className="badge-warning">Review Soon</span>
<span className="badge-info">New</span>
```

### Cards
```tsx
// Static card
<div className="card-elevated">
  {/* Card content */}
</div>

// Interactive card
<div className="card-interactive" onClick={handleClick}>
  {/* Card content */}
</div>
```

## Usage Guidelines

### When to Use Section Colors
- Use section colors to create clear visual contexts
- Apply to entire page backgrounds or major sections
- Use buttons with section colors for primary actions in that context
- Don't mix multiple section colors in the same UI area

### When to Use Semantic Colors
- Use semantic colors for feedback and status indicators
- Apply to badges, alerts, and toast notifications
- Use for icons indicating state (success checkmark, warning triangle)
- Don't use for decorative purposes

### Typography Best Practices
- Use display sizes sparingly (hero sections only)
- Maintain consistent heading hierarchy (don't skip levels)
- Use body text sizes for readability (16px default)
- Use caption/overline for metadata, not important content

### Elevation Best Practices
- Use minimal elevation by default (elevation-1 or none)
- Increase elevation on hover for interactive elements
- Use highest elevation (4-5) for floating elements like modals
- Don't over-elevate everything (causes visual fatigue)

## Dark Mode
All colors automatically adapt to dark mode. The design system maintains the same semantic meaning across themes:
- Section colors remain vibrant in dark mode
- Semantic colors maintain their meaning
- Elevation shadows are adjusted for visibility
- Text foreground colors automatically invert

## Examples

### Themed Page Header
```tsx
<header className="bg-gradient-to-r from-browse/20 to-browse/5 border-b-2 border-browse">
  <div className="container mx-auto p-6">
    <h1 className="text-h1 text-browse mb-2">Browse Chapters</h1>
    <p className="text-body text-muted-foreground">
      Explore the complete Bible
    </p>
  </div>
</header>
```

### Status Card with Badge
```tsx
<div className="card-interactive">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-h3">John 3:16</h3>
    <span className="badge-success">Mastered</span>
  </div>
  <p className="text-body-sm text-muted-foreground">
    Last reviewed 2 days ago
  </p>
</div>
```

### Section with Accent
```tsx
<section className="section-practice p-8 rounded-lg">
  <h2 className="text-heading text-practice mb-6">Today's Practice</h2>
  <Button className="bg-practice text-practice-foreground hover:bg-practice/90">
    Start Session
  </Button>
</section>
```
