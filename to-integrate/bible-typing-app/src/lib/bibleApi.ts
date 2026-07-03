const BASE = "https://eamjsthjahxzsqmqjwxi.supabase.co/functions/v1/bible-api";

export interface BibleBook {
  name: string;
  abbreviation: string;
  testament: "OT" | "NT";
  book_number: number;
  total_chapters: number;
}

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface BiblePericope {
  name: string;
  book: string;
  chapter: number;
  verse_start: number;
  verse_end: number;
  verse_count: number;
  subtitle: string;
  theme: string | null;
}

export interface VersesResponse {
  book: string;
  chapter: number;
  version: string;
  version_name: string;
  verse_count: number;
  verses: BibleVerse[];
}

// Cache to avoid repeated fetches
const cache = new Map<string, unknown>();

async function fetchCached<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error("API returned error");
  cache.set(url, json.data);
  return json.data as T;
}

export async function getBooks(): Promise<BibleBook[]> {
  return fetchCached<BibleBook[]>(`${BASE}/books`);
}

export async function getChapterVerses(book: string, chapter: number): Promise<VersesResponse> {
  return fetchCached<VersesResponse>(
    `${BASE}/verses?book=${encodeURIComponent(book)}&chapter=${chapter}&clean=true`
  );
}

export async function getPericopes(book: string, chapter: number): Promise<BiblePericope[]> {
  return fetchCached<BiblePericope[]>(
    `${BASE}/pericopes?book=${encodeURIComponent(book)}&chapter=${chapter}`
  );
}

export function clearCache() {
  cache.clear();
}
