# WolfenWord Design System

## Status: v1 — Established 2026-02-16

## Color Palette

### Strategy: Monochromatic Blue + Neutral

- **Primary:** `#0336ff` / `hsl(227, 100%, 50%)` — links, buttons, active states
- **Background:** `hsl(240, 4%, 95%)` — cool light gray (original, tested cream and rejected)
- **Card:** `hsl(0, 0%, 98%)` — near-white
- **Text:** `hsl(240, 5%, 10%)` — near-black
- **No secondary color.** Derive hover/disabled/border states from primary and neutrals.

### Section Colors (all blue family)
- Practice: `hsl(227, 100%, 50%)` — full primary blue
- Browse: `hsl(227, 80%, 60%)` — lighter blue
- Review: `hsl(227, 60%, 40%)` — darker blue
- Collection: `hsl(215, 80%, 55%)` — shifted blue

### Dark Mode
- Primary shifts to `hsl(224, 100%, 70%)` — lighter blue for dark backgrounds
- All section colors carry over unchanged

## Typography

### Fonts (3 total, all Google Fonts)
- **Body/UI default:** JetBrains Mono (monospace) — this is intentional, gives the app its character
- **Sans (headings, labels):** Poppins
- **Serif (scripture text):** Merriweather
- **Mono (code/data):** JetBrains Mono

### Scale (already defined in tailwind)
- display-lg: 4rem
- display-md: 3rem
- display-sm: 2rem
- h1: 1.875rem (700)
- h2: 1.5rem (600)
- h3: 1.25rem (600)
- h4: 1.125rem (500)
- body-lg: 1.125rem
- body: 1rem
- body-sm: 0.875rem
- caption: 0.75rem
- overline: 0.625rem (uppercase, tracked)

## Border Radius

**`1.5rem` (pill-shaped)** — tested 4px, rejected. The pill shape gives the app warmth and personality.

## Spacing

**Base 8px** — standard Tailwind scale: 4, 8, 12, 16, 24, 32, 48, 64

## Shadows

5-level elevation system (already in tailwind config):
- elevation-1 through elevation-5
- Used sparingly — cards use elevation-2, hover states bump to elevation-3

## Decisions Log

| Decision | Tested | Result |
|----------|--------|--------|
| Primary pink → blue | Yes | Kept blue |
| Background gray → cream | Yes | Reverted to gray — cream was too warm |
| Radius 1.5rem → 0.25rem | Yes | Reverted to 1.5rem — pill feels better |
| Body font Mono → Inter | Yes | Reverted to Mono — Inter lost the app's character |
| 9 font imports → 3 | Yes | Kept — Poppins, Merriweather, JetBrains Mono |
| Section colors rainbow → blue | Yes | Kept — monochromatic blue family |
