export interface Pericope {
  id: number | string;
  verses?: number[];
  name: string;
  ref?: string;
  lore?: string;
  theme?: string;
  verseCount?: number;
}

export interface ChapterData {
  book?: string;
  chapter: number;
  pericopes: Pericope[];
}

// Alias for compatibility
export type PericopeData = ChapterData;
