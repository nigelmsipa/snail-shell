# Select Passage Dropdown Feature - Implementation Plan

## Overview
Convert the current sample passages section (1C. OR TRY ONE OF THESE) into a functional dropdown/select component that allows users to quickly load popular scripture passages.

## Current State
- Location: `src/components/ScriptureInput.tsx` (lines 133-152)
- Only "THE SHEPHERD PSALM" is currently functional
- Other passages are displayed as placeholder text
- Uses simple button click handler to load Psalm 23:1-3

## Proposed Implementation

### 1. Data Structure
Create a dedicated data file for predefined passages:
- **File**: `src/data/predefinedPassages.ts`
- **Structure**:
```typescript
interface PredefinedPassage {
  id: string;
  name: string;
  reference: string;
  description?: string;
}

export const predefinedPassages: PredefinedPassage[] = [
  { id: "shepherd-psalm", name: "The Shepherd Psalm", reference: "Psalm 23:1-3" },
  { id: "great-commission", name: "The Great Commission", reference: "Matthew 28:18-20" },
  { id: "armor-of-god", name: "The Armor of God", reference: "Ephesians 6:11-17" },
  { id: "fruits-of-spirit", name: "Fruits of the Spirit", reference: "Galatians 5:22-23" },
  // Add more passages as needed
];
```

### 2. UI Component Changes
Replace the current button list with a proper dropdown:

**Option A: Using shadcn/ui Select component**
- Import `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` from `@/components/ui/select`
- Provides native-like dropdown experience
- Maintains consistent styling with the rest of the app

**Option B: Using shadcn/ui Combobox**
- More searchable/filterable if we expand to many passages
- Better for larger lists (10+ items)

**Recommended**: Start with Option A (Select) for simplicity

### 3. Implementation Steps

#### Step 3.1: Create Data File
- Create `src/data/predefinedPassages.ts`
- Add initial 4 passages listed above
- Export the array and interface

#### Step 3.2: Check for Select Component
- Verify if `src/components/ui/select.tsx` exists
- If not, install it using: `npx shadcn-ui@latest add select`

#### Step 3.3: Update ScriptureInput Component
- Import the predefined passages data
- Import Select components from ui
- Replace the current section (lines 132-152) with:
  ```tsx
  <div className="space-y-2">
    <Label className="text-xs font-mono uppercase tracking-wide">
      1C. OR SELECT A PASSAGE
    </Label>
    <Select onValueChange={handlePassageSelect} disabled={isLoading}>
      <SelectTrigger className="font-mono text-sm">
        <SelectValue placeholder="Choose a passage..." />
      </SelectTrigger>
      <SelectContent>
        {predefinedPassages.map((passage) => (
          <SelectItem
            key={passage.id}
            value={passage.reference}
            className="font-mono text-sm"
          >
            {passage.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
  ```

#### Step 3.4: Add Handler Function
- Create `handlePassageSelect` function that:
  1. Takes the selected reference
  2. Sets it to the reference input
  3. Automatically triggers `fetchVerse()`
- Replace the current `handleSampleLoad` function

Example:
```typescript
const handlePassageSelect = async (reference: string) => {
  setReference(reference);
  setIsLoading(true);

  try {
    const response = await fetch(
      `https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch verse");
    }

    const data = await response.json();
    const lines = Array.isArray(data.verses)
      ? data.verses.map((v: any) => `${v.verse} ${String(v.text || '').trim()}`)
      : String(data.text || '').trim().split('\n').filter(Boolean);
    const verseText = lines.join('\n');

    setScripture(verseText);
    onScriptureSubmit(verseText, reference);
    toast.success("Passage loaded successfully");
  } catch (error) {
    toast.error("Could not fetch passage");
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};
```

### 4. Testing Checklist
- [ ] Dropdown renders correctly with all passages
- [ ] Selecting a passage populates the reference field
- [ ] Verse fetching works for all predefined passages
- [ ] Loading state is shown during fetch
- [ ] Success/error toasts display appropriately
- [ ] Dropdown is disabled when loading
- [ ] Styling matches the monospace/uppercase theme
- [ ] Mobile responsiveness is maintained

### 5. Future Enhancements
- Add more predefined passages (10-20 popular verses)
- Categorize passages (Comfort, Strength, Guidance, etc.)
- Add search/filter functionality using Combobox
- Allow users to save their favorite passages (localStorage)
- Add passage descriptions/contexts
- Support multiple translations

## Files to Modify
1. `src/data/predefinedPassages.ts` - NEW file
2. `src/components/ScriptureInput.tsx` - UPDATE existing
3. `src/components/ui/select.tsx` - May need to ADD via shadcn

## Dependencies
- No new external dependencies required
- Uses existing shadcn/ui components
- Uses existing bible-api.com API

## Timeline Estimate
- Data file creation: 15 minutes
- UI component update: 30 minutes
- Testing and refinement: 30 minutes
- **Total**: ~1-2 hours

## Notes
- Maintain the existing mono-spaced, uppercase aesthetic
- Keep the current manual entry workflow intact (1A and 1B)
- This dropdown is an alternative quick-access method
- Ensure accessibility (keyboard navigation, screen readers)
